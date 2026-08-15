-- =============================================================================
-- Migration: Isolamento Estrito de Linhas WhatsApp Multi-sessão
-- =============================================================================

-- 1. Garantir coluna channel_connection_id em conversations, leads e outbox_messages
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS channel_connection_id UUID REFERENCES public.channel_connections(id) ON DELETE SET NULL;

ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS channel_connection_id UUID REFERENCES public.channel_connections(id) ON DELETE SET NULL;

ALTER TABLE public.outbox_messages
ADD COLUMN IF NOT EXISTS channel_connection_id UUID REFERENCES public.channel_connections(id) ON DELETE SET NULL;

-- 2. Atualizar send_channel_message para persistir channel_connection_id no outbox
CREATE OR REPLACE FUNCTION public.send_channel_message(
  p_conversation_id uuid,
  p_body text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
declare
  v_conversation public.conversations;
  v_message_id uuid;
begin
  select * into v_conversation
  from public.conversations
  where id = p_conversation_id;

  if v_conversation.id is null
     or not private.is_member(v_conversation.workspace_id) then
    raise exception 'conversa não encontrada' using errcode = 'P0002';
  end if;

  if p_body is null or btrim(p_body) = '' then
    raise exception 'mensagem vazia' using errcode = '22023';
  end if;

  insert into public.messages
    (workspace_id, conversation_id, provider, direction, status, body, sent_by)
  values
    (v_conversation.workspace_id, p_conversation_id, v_conversation.provider,
     'outbound', 'pending', p_body, (select auth.uid()))
  returning id into v_message_id;

  insert into public.outbox_messages
    (workspace_id, message_id, provider, channel_connection_id, payload)
  values
    (v_conversation.workspace_id, v_message_id, v_conversation.provider,
     v_conversation.channel_connection_id,
     jsonb_build_object(
       'conversation_id', p_conversation_id,
       'external_conversation_id', v_conversation.external_conversation_id,
       'channel_connection_id', v_conversation.channel_connection_id,
       'body', p_body
     ));

  update public.conversations
  set last_message_at = now(),
      last_message_preview = left(p_body, 160),
      unread_count = 0
  where id = p_conversation_id;

  if v_conversation.lead_id is not null then
    insert into public.activities (workspace_id, lead_id, type, content, meta, actor_id)
    values (v_conversation.workspace_id, v_conversation.lead_id, 'message',
            left(p_body, 300),
            jsonb_build_object('provider', v_conversation.provider,
                               'direction', 'outbound'),
            (select auth.uid()));
  end if;

  return v_message_id;
end;
$$;

-- 3. Atualizar ingest_channel_message para receber p_channel_connection_id
CREATE OR REPLACE FUNCTION public.ingest_channel_message(
  p_workspace_id uuid,
  p_provider channel_provider,
  p_external_conversation_id text,
  p_external_message_id text,
  p_sender_external_id text,
  p_sender_name text,
  p_body text,
  p_sent_at timestamp with time zone DEFAULT now(),
  p_media_type text DEFAULT NULL::text,
  p_media_url text DEFAULT NULL::text,
  p_direction message_direction DEFAULT 'inbound'::message_direction,
  p_phone text DEFAULT NULL::text,
  p_channel_connection_id uuid DEFAULT NULL::uuid
)
RETURNS TABLE(out_message_id uuid, out_conversation_id uuid, out_lead_id uuid, out_created_lead boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
  -- Idempotência de mensagem já ingerida
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

  -- Lead associado por identidade externa
  select * into v_identidade
  from public.external_identities ei
  where ei.workspace_id = p_workspace_id
    and ei.provider = p_provider
    and ei.external_id = p_sender_external_id;

  v_lead_id := v_identidade.lead_id;

  -- Sem correspondência: cria lead novo associado à linha
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
       phone, source_detail, channel_connection_id)
    values
      (p_workspace_id, v_pipeline.id, v_stage.id, 0,
       coalesce(nullif(btrim(p_sender_name), ''), 'Contato ' || p_provider::text),
       v_channel,
       p_phone,
       case when v_inbound
            then 'Primeira mensagem recebida por ' || p_provider::text
            else 'Primeiro contato feito por ' || p_provider::text end,
       p_channel_connection_id)
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

  -- Conversa (idempotente por id externo)
  insert into public.conversations
    (workspace_id, lead_id, provider, external_conversation_id, channel_connection_id,
     last_inbound_at, last_message_at, last_message_preview, unread_count)
  values
    (p_workspace_id, v_lead_id, p_provider, p_external_conversation_id, p_channel_connection_id,
     case when v_inbound then p_sent_at else null end,
     p_sent_at, private.previa_da_mensagem(p_body, p_media_type),
     case when v_inbound then 1 else 0 end)
  on conflict (workspace_id, provider, external_conversation_id) do update
    set lead_id = coalesce(public.conversations.lead_id, excluded.lead_id),
        channel_connection_id = coalesce(excluded.channel_connection_id, public.conversations.channel_connection_id),
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
        phone = coalesce(phone, p_phone),
        channel_connection_id = coalesce(channel_connection_id, p_channel_connection_id)
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
