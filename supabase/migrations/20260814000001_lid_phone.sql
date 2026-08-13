-- =============================================================================
-- Separa identidade do canal e telefone.
--
-- O WhatsApp passou a endereçar contatos por LID (@lid) — um identificador
-- interno como `88880204222603`, que NÃO é telefone. Até aqui a ingestão usava
-- o mesmo valor para as duas coisas, e o campo `phone` do lead acabava com um
-- número que não disca.
--
-- A partir daqui:
--   external_identities.external_id  → LID/JID: chave estável do canal
--   leads.phone                      → telefone de verdade, ou nada
--
-- Campo vazio é honesto; campo com valor inútil engana quem for ligar.
-- =============================================================================

-- CREATE OR REPLACE não substitui assinatura diferente: sem o drop, a versão
-- antiga sobrevive e o Postgres recusa as chamadas por ambiguidade.
drop function if exists public.ingest_channel_message(
  uuid, public.channel_provider, text, text, text, text, text,
  timestamptz, text, text, public.message_direction
);

create function public.ingest_channel_message(
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

  select ei.lead_id into v_lead_id
  from public.external_identities ei
  where ei.workspace_id = p_workspace_id
    and ei.provider = p_provider
    and ei.external_id = p_sender_external_id;

  if v_lead_id is null then
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
       -- Só telefone de verdade entra aqui.
       nullif(btrim(coalesce(p_phone, '')), ''),
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
     p_sent_at, left(coalesce(p_body, '[mídia]'), 160),
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

  update public.leads
  set engaged_at = case
        when v_inbound then coalesce(engaged_at, p_sent_at) else engaged_at
      end,
      first_contact_at = coalesce(first_contact_at, p_sent_at),
      -- O telefone pode chegar depois, quando o contato for resolvido.
      phone = coalesce(phone, nullif(btrim(coalesce(p_phone, '')), ''))
  where id = v_lead_id;

  insert into public.activities
    (workspace_id, lead_id, type, content, meta)
  values
    (p_workspace_id, v_lead_id, 'message',
     left(coalesce(p_body, '[mídia]'), 300),
     jsonb_build_object('provider', p_provider, 'direction', p_direction));

  return query select v_message_id, v_conversation.id, v_lead_id, v_created_lead;
end;
$$;

-- O webhook roda no servidor como service_role: sem esta concessão a ingestão
-- falha com "permission denied", porque o schema revoga execução de PUBLIC.
-- authenticated e anon continuam de fora — forjar mensagem segue impossível.
revoke execute on function public.ingest_channel_message(
  uuid, public.channel_provider, text, text, text, text, text,
  timestamptz, text, text, public.message_direction, text
) from public, anon;

grant execute on function public.ingest_channel_message(
  uuid, public.channel_provider, text, text, text, text, text,
  timestamptz, text, text, public.message_direction, text
) to service_role;

-- Limpa os LIDs que foram gravados como telefone antes desta correção.
-- Heurística por tamanho: telefone brasileiro com DDI tem 12–13 dígitos;
-- os LIDs observados têm 14–15. O limite de 13 é adequado ao uso no Brasil —
-- se um dia houver contato internacional com número mais longo, revisar.
update public.leads
set phone = null, phone_normalized = null
where phone is not null
  and length(regexp_replace(phone, '\D', '', 'g')) > 13;
