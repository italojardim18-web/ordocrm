-- =============================================================================
-- Migration: Isolamento Estrito Multi-Linhas (Conversas e Leads Independentes)
-- =============================================================================

-- 1. external_identities: adiciona channel_connection_id e atualiza unique constraint
ALTER TABLE public.external_identities
ADD COLUMN IF NOT EXISTS channel_connection_id UUID REFERENCES public.channel_connections(id) ON DELETE CASCADE;

-- Preenche channel_connection_id nas identidades existentes com base no lead
UPDATE public.external_identities ei
SET channel_connection_id = l.channel_connection_id
FROM public.leads l
WHERE ei.lead_id = l.id AND ei.channel_connection_id IS NULL;

-- Remove constraint única antiga se existir
ALTER TABLE public.external_identities
DROP CONSTRAINT IF EXISTS external_identities_workspace_id_provider_external_id_key;

-- Cria nova constraint única por linha
ALTER TABLE public.external_identities
DROP CONSTRAINT IF EXISTS external_identities_workspace_provider_ext_channel_key;

ALTER TABLE public.external_identities
ADD CONSTRAINT external_identities_workspace_provider_ext_channel_key
UNIQUE (workspace_id, provider, external_id, channel_connection_id);


-- 2. conversations: atualiza unique constraint para incluir channel_connection_id
ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS conversations_workspace_id_provider_external_conversation_key;

ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS conversations_workspace_id_provider_external_conversation_id_key;

ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS conversations_workspace_provider_ext_channel_key;

ALTER TABLE public.conversations
ADD CONSTRAINT conversations_workspace_provider_ext_channel_key
UNIQUE (workspace_id, provider, external_conversation_id, channel_connection_id);


-- 3. Atualizar ingest_channel_message com isolamento estrito de leads e conversas por linha
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

  -- 1. Busca lead associado estritamente à linha de atendimento atual
  select * into v_identidade
  from public.external_identities ei
  where ei.workspace_id = p_workspace_id
    and ei.provider = p_provider
    and ei.external_id = p_sender_external_id
    and (
      (p_channel_connection_id IS NOT NULL AND ei.channel_connection_id = p_channel_connection_id)
      OR (p_channel_connection_id IS NULL AND ei.channel_connection_id IS NULL)
    );

  v_lead_id := v_identidade.lead_id;

  -- 2. Se não encontrou lead para esta linha específica, cria um lead novo no funil desta linha
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
      (workspace_id, lead_id, provider, external_id, display_name, channel_connection_id)
    values (p_workspace_id, v_lead_id, p_provider, p_sender_external_id, p_sender_name, p_channel_connection_id)
    on conflict (workspace_id, provider, external_id, channel_connection_id) do nothing;
  end if;

  -- 3. Conversa (estritamente isolada por linha)
  insert into public.conversations
    (workspace_id, lead_id, provider, external_conversation_id, channel_connection_id,
     last_inbound_at, last_message_at, last_message_preview, unread_count)
  values
    (p_workspace_id, v_lead_id, p_provider, p_external_conversation_id, p_channel_connection_id,
     case when v_inbound then p_sent_at else null end,
     p_sent_at, private.previa_da_mensagem(p_body, p_media_type),
     case when v_inbound then 1 else 0 end)
  on conflict (workspace_id, provider, external_conversation_id, channel_connection_id) do update
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

GRANT EXECUTE ON FUNCTION public.ingest_channel_message(
  uuid,
  public.channel_provider,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  text,
  text,
  public.message_direction,
  text,
  uuid
) TO service_role, postgres, anon, authenticated;
