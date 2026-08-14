-- =============================================================================
-- Arquivar lead e contatos não comerciais
--
-- O CRM cria lead para todo mundo que manda mensagem — inclusive colega,
-- parente e fornecedor. Arquivar resolve uma vez; o problema é que a pessoa
-- manda mensagem de novo na semana seguinte e vira lead outra vez.
--
-- Por isso a decisão fica gravada no contato, não só no lead: marcado como
-- não comercial, aquele número nunca mais gera lead. A conversa continua no
-- inbox — você segue conversando normalmente, o pipeline é que fica limpo.
-- =============================================================================

alter table public.leads
  add column if not exists archived_at timestamptz,
  add column if not exists archived_reason text;

create index if not exists leads_ativos_idx on public.leads (workspace_id, stage_id, position)
  where deleted_at is null and archived_at is null;

comment on column public.leads.archived_at is
  'Fora do pipeline, mas com a conversa e o histórico preservados.';

alter table public.external_identities
  add column if not exists is_commercial boolean not null default true;

comment on column public.external_identities.is_commercial is
  'false = contato pessoal/profissional: mensagens dele não criam lead.';

-- -----------------------------------------------------------------------------
-- Arquivar (e opcionalmente marcar o contato como não comercial)
-- -----------------------------------------------------------------------------

create or replace function public.archive_lead(
  p_lead_id uuid,
  p_reason text default null,
  p_mark_non_commercial boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lead record;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id and deleted_at is null
  for update;

  if v_lead is null or not private.is_member(v_lead.workspace_id) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  update public.leads
  set archived_at = now(), archived_reason = p_reason
  where id = p_lead_id;

  -- A decisão vale para o contato, não só para este lead: é isso que evita
  -- rearquivar a mesma pessoa toda semana.
  if p_mark_non_commercial then
    update public.external_identities
    set is_commercial = false
    where lead_id = p_lead_id;

    -- A conversa continua acessível, só deixa de apontar para um lead.
    update public.conversations
    set lead_id = null
    where lead_id = p_lead_id;
  end if;

  insert into public.activities (workspace_id, lead_id, type, content, actor_id)
  values (
    v_lead.workspace_id, p_lead_id, 'system',
    case when p_mark_non_commercial
      then 'Arquivado e marcado como contato não comercial'
      else 'Lead arquivado' end
      || coalesce(' — ' || p_reason, ''),
    (select auth.uid())
  );
end;
$$;

create or replace function public.unarchive_lead(p_lead_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_workspace uuid;
begin
  select workspace_id into v_workspace from public.leads where id = p_lead_id;
  if v_workspace is null or not private.is_member(v_workspace) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  update public.leads
  set archived_at = null, archived_reason = null
  where id = p_lead_id;

  -- Voltar ao pipeline significa que é comercial de novo.
  update public.external_identities set is_commercial = true where lead_id = p_lead_id;

  insert into public.activities (workspace_id, lead_id, type, content, actor_id)
  values (v_workspace, p_lead_id, 'system', 'Lead desarquivado', (select auth.uid()));
end;
$$;

grant execute on function public.archive_lead(uuid, text, boolean) to authenticated;
grant execute on function public.unarchive_lead(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- Ingestão respeita a marcação
-- -----------------------------------------------------------------------------

create or replace function public.ingest_channel_message(
  p_workspace_id uuid,
  p_provider public.channel_provider,
  p_external_conversation_id text,
  p_external_message_id text,
  p_sender_external_id text,
  p_sender_name text,
  p_body text,
  p_sent_at timestamptz default now(),
  p_media_type text default null,
  p_media_url text default null,
  p_direction public.message_direction default 'inbound',
  p_phone text default null
)
returns table (
  out_message_id uuid,
  out_conversation_id uuid,
  out_lead_id uuid,
  out_created_lead boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_conversation public.conversations;
  v_lead_id uuid;
  v_created_lead boolean := false;
  v_message_id uuid;
  v_pipeline record;
  v_stage record;
  v_channel public.lead_channel;
  v_inbound boolean := p_direction = 'inbound';
  v_identidade record;
begin
  select m.id, m.conversation_id into v_message_id, v_conversation.id
  from public.messages m
  where m.workspace_id = p_workspace_id
    and m.provider = p_provider
    and m.external_message_id = p_external_message_id
    and p_external_message_id is not null;

  if v_message_id is not null then
    select c.lead_id into v_lead_id
    from public.conversations c where c.id = v_conversation.id;
    return query select v_message_id, v_conversation.id, v_lead_id, false;
    return;
  end if;

  select * into v_identidade
  from public.external_identities ei
  where ei.workspace_id = p_workspace_id
    and ei.provider = p_provider
    and ei.external_id = p_sender_external_id;

  v_lead_id := v_identidade.lead_id;

  -- Contato marcado como não comercial: a conversa entra, o lead não.
  if v_lead_id is null and coalesce(v_identidade.is_commercial, true) then
    select p.id into v_pipeline
    from public.pipelines p
    where p.workspace_id = p_workspace_id and p.archived_at is null
    order by p.is_default desc, p.position
    limit 1;

    if v_pipeline.id is null then
      raise exception 'workspace sem pipeline configurado' using errcode = '22023';
    end if;

    select s.id into v_stage
    from public.pipeline_stages s
    where s.pipeline_id = v_pipeline.id and s.archived_at is null
    order by s.position
    limit 1;

    v_channel := case
      when p_provider = 'whatsapp' then 'whatsapp'::public.lead_channel
      when p_provider = 'instagram' then 'instagram'::public.lead_channel
      else 'manual'::public.lead_channel
    end;

    insert into public.leads
      (workspace_id, pipeline_id, stage_id, position, name, channel,
       phone, source_detail)
    values
      (p_workspace_id, v_pipeline.id, v_stage.id, 0,
       coalesce(nullif(btrim(p_sender_name), ''), 'Contato ' || p_provider::text),
       v_channel,
       p_phone,
       case when v_inbound
            then 'Primeira mensagem recebida por ' || p_provider::text
            else 'Primeiro contato feito por ' || p_provider::text end)
    returning id into v_lead_id;

    v_created_lead := true;

    insert into public.lead_stage_history
      (workspace_id, lead_id, to_stage_id, to_stage_type)
    select p_workspace_id, v_lead_id, s.id, s.stage_type
    from public.pipeline_stages s where s.id = v_stage.id;

    insert into public.external_identities
      (workspace_id, lead_id, provider, external_id, display_name)
    values (p_workspace_id, v_lead_id, p_provider, p_sender_external_id, p_sender_name)
    on conflict (workspace_id, provider, external_id) do nothing;
  end if;

  insert into public.conversations
    (workspace_id, lead_id, provider, external_conversation_id,
     last_inbound_at, last_message_at, last_message_preview, unread_count)
  values
    (p_workspace_id, v_lead_id, p_provider, p_external_conversation_id,
     case when v_inbound then p_sent_at else null end,
     p_sent_at, private.previa_da_mensagem(p_body, p_media_type),
     case when v_inbound then 1 else 0 end)
  on conflict (workspace_id, provider, external_conversation_id) do update
    set lead_id = coalesce(public.conversations.lead_id, excluded.lead_id),
        last_inbound_at = case
          when v_inbound then excluded.last_inbound_at
          else public.conversations.last_inbound_at
        end,
        last_message_at = excluded.last_message_at,
        last_message_preview = excluded.last_message_preview,
        unread_count = case
          when v_inbound then public.conversations.unread_count + 1
          else 0
        end
  returning * into v_conversation;

  insert into public.conversation_participants
    (workspace_id, conversation_id, external_id, display_name, is_self)
  values (p_workspace_id, v_conversation.id, p_sender_external_id,
          p_sender_name, not v_inbound)
  on conflict (conversation_id, external_id) do nothing;

  insert into public.messages
    (workspace_id, conversation_id, provider, external_message_id, direction,
     status, sender_external_id, body, media_type, media_url, sent_at)
  values
    (p_workspace_id, v_conversation.id, p_provider, p_external_message_id,
     p_direction,
     case when v_inbound then 'delivered'::public.message_status
          else 'sent'::public.message_status end,
     p_sender_external_id, p_body, p_media_type, p_media_url, p_sent_at)
  returning id into v_message_id;

  if v_lead_id is not null then
    update public.leads
    set engaged_at = case
          when v_inbound then coalesce(engaged_at, p_sent_at) else engaged_at
        end,
        first_contact_at = coalesce(first_contact_at, p_sent_at),
        phone = coalesce(phone, p_phone)
    where id = v_lead_id;

    insert into public.activities
      (workspace_id, lead_id, type, content, meta)
    values
      (p_workspace_id, v_lead_id, 'message',
       left(coalesce(p_body, '[mídia]'), 300),
       jsonb_build_object('provider', p_provider, 'direction', p_direction));
  end if;

  return query select v_message_id, v_conversation.id, v_lead_id, v_created_lead;
end;
$$;

revoke execute on function public.ingest_channel_message(
  uuid, public.channel_provider, text, text, text, text, text,
  timestamptz, text, text, public.message_direction, text
) from public, anon;
