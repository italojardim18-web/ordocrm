-- =============================================================================
-- Fase 4 — Captação e conversas: formulário público, webhooks idempotentes,
-- conversas/mensagens de WhatsApp e Instagram, fila de saída (outbox).
-- =============================================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'channel_provider') THEN
    CREATE TYPE public.channel_provider AS ENUM (
      'whatsapp',
      'instagram',
      'form',
      'meta_lead_ads'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_direction') THEN
    CREATE TYPE public.message_direction AS ENUM ('inbound', 'outbound');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_status') THEN
    CREATE TYPE public.message_status AS ENUM (
      'pending',
      'sent',
      'delivered',
      'read',
      'failed'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'webhook_status') THEN
    CREATE TYPE public.webhook_status AS ENUM ('received', 'processed', 'failed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'outbox_status') THEN
    CREATE TYPE public.outbox_status AS ENUM ('pending', 'sent', 'failed');
  END IF;
END $$;

alter type public.audit_action add value if not exists 'channel_connected';
alter type public.audit_action add value if not exists 'channel_disconnected';
alter type public.audit_action add value if not exists 'form_endpoint_changed';

-- -----------------------------------------------------------------------------
-- Conexões de canal (tokens protegidos como em calendar_connections)
-- -----------------------------------------------------------------------------

create table public.channel_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  provider public.channel_provider not null,
  status text not null default 'awaiting_config',
  display_name text,
  -- Identificadores públicos da conta (não são segredos)
  external_account_id text,
  phone_number_id text,
  waba_id text,
  instagram_id text,
  -- Segredos cifrados na aplicação (AES-256-GCM)
  access_token_enc text,
  app_secret_enc text,
  verify_token_enc text,
  last_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider)
);

create trigger set_updated_at before update on public.channel_connections
  for each row execute function private.set_updated_at();

-- -----------------------------------------------------------------------------
-- Identidades externas: chave da associação automática lead ↔ conversa
-- -----------------------------------------------------------------------------

create table public.external_identities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  provider public.channel_provider not null,
  external_id text not null,
  display_name text,
  created_at timestamptz not null default now(),
  unique (workspace_id, provider, external_id)
);

create index external_identities_lead_idx on public.external_identities (lead_id);

-- -----------------------------------------------------------------------------
-- Conversas e mensagens
-- -----------------------------------------------------------------------------

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  provider public.channel_provider not null,
  external_conversation_id text not null,
  -- Janela de atendimento (WhatsApp: 24h após a última mensagem do contato)
  last_inbound_at timestamptz,
  last_message_at timestamptz,
  last_message_preview text,
  unread_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider, external_conversation_id)
);

create index conversations_workspace_recent_idx
  on public.conversations (workspace_id, last_message_at desc);
create index conversations_lead_idx on public.conversations (lead_id);

create trigger set_updated_at before update on public.conversations
  for each row execute function private.set_updated_at();

create table public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  external_id text not null,
  display_name text,
  is_self boolean not null default false,
  created_at timestamptz not null default now(),
  unique (conversation_id, external_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  provider public.channel_provider not null,
  -- Idempotência: o mesmo id externo nunca gera duas mensagens no workspace
  external_message_id text,
  direction public.message_direction not null,
  status public.message_status not null default 'sent',
  sender_external_id text,
  body text,
  media_type text,
  media_url text,
  sent_by uuid references auth.users (id),
  error text,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (workspace_id, provider, external_message_id)
);

create index messages_conversation_idx
  on public.messages (conversation_id, sent_at desc);

create table public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  message_id uuid not null references public.messages (id) on delete cascade,
  media_type text not null,
  storage_path text,
  external_url text,
  byte_size integer,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Webhooks (entrada) e outbox (saída)
-- -----------------------------------------------------------------------------

create table public.webhook_events (
  id bigint generated always as identity primary key,
  workspace_id uuid references public.workspaces (id) on delete cascade,
  provider public.channel_provider not null,
  external_event_id text not null,
  status public.webhook_status not null default 'received',
  payload jsonb not null,
  error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  -- Idempotência forte: provedor + workspace + id do evento externo
  unique (provider, workspace_id, external_event_id)
);

create index webhook_events_recent_idx
  on public.webhook_events (workspace_id, received_at desc);

create table public.outbox_messages (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  message_id uuid references public.messages (id) on delete cascade,
  provider public.channel_provider not null,
  payload jsonb not null,
  status public.outbox_status not null default 'pending',
  attempts integer not null default 0,
  next_retry_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index outbox_pending_idx on public.outbox_messages (status, next_retry_at)
  where status = 'pending';

create trigger set_updated_at before update on public.outbox_messages
  for each row execute function private.set_updated_at();

-- -----------------------------------------------------------------------------
-- Formulários públicos
-- -----------------------------------------------------------------------------

create table public.form_endpoints (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  slug text not null unique,
  name text not null default 'Formulário de contato',
  headline text,
  description text,
  pipeline_id uuid references public.pipelines (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  owner_id uuid references auth.users (id) on delete set null,
  success_message text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.form_endpoints
  for each row execute function private.set_updated_at();

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  form_endpoint_id uuid not null references public.form_endpoints (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  payload jsonb not null,
  -- Idempotência do formulário: mesmo conteúdo na mesma janela = 1 lead
  dedupe_hash text not null,
  ip_hash text,
  created_at timestamptz not null default now(),
  unique (form_endpoint_id, dedupe_hash)
);

create index form_submissions_workspace_idx
  on public.form_submissions (workspace_id, created_at desc);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.channel_connections enable row level security;
alter table public.external_identities enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.webhook_events enable row level security;
alter table public.outbox_messages enable row level security;
alter table public.form_endpoints enable row level security;
alter table public.form_submissions enable row level security;

-- Conexões: só admin lê (e nunca as colunas de segredo — ver grants abaixo).
create policy "channel_connections_select_admin" on public.channel_connections
  for select to authenticated using (private.is_admin(workspace_id));

-- Conversas e mensagens: qualquer membro (assistente responde pelo CRM).
create policy "external_identities_select_member" on public.external_identities
  for select to authenticated using (private.is_member(workspace_id));
create policy "external_identities_insert_member" on public.external_identities
  for insert to authenticated with check (private.is_member(workspace_id));

create policy "conversations_select_member" on public.conversations
  for select to authenticated using (private.is_member(workspace_id));
create policy "conversations_update_member" on public.conversations
  for update to authenticated
  using (private.is_member(workspace_id))
  with check (private.is_member(workspace_id));

create policy "participants_select_member" on public.conversation_participants
  for select to authenticated using (private.is_member(workspace_id));

create policy "messages_select_member" on public.messages
  for select to authenticated using (private.is_member(workspace_id));

create policy "attachments_select_member" on public.message_attachments
  for select to authenticated using (private.is_member(workspace_id));

-- Saúde das integrações: apenas admin.
create policy "webhook_events_select_admin" on public.webhook_events
  for select to authenticated using (private.is_admin(workspace_id));

create policy "outbox_select_admin" on public.outbox_messages
  for select to authenticated using (private.is_admin(workspace_id));

-- Formulários: membros leem; admin configura.
create policy "form_endpoints_select_member" on public.form_endpoints
  for select to authenticated using (private.is_member(workspace_id));
create policy "form_endpoints_write_admin" on public.form_endpoints
  for all to authenticated
  using (private.is_admin(workspace_id))
  with check (private.is_admin(workspace_id));

create policy "form_submissions_select_admin" on public.form_submissions
  for select to authenticated using (private.is_admin(workspace_id));

-- Escrita de mensagens/conversas/eventos acontece pelo servidor (service_role)
-- ou pela RPC send_channel_message: nada de INSERT direto do cliente.
revoke insert, update, delete on public.messages from authenticated;
revoke insert, delete on public.conversations from authenticated;
revoke insert, update, delete on public.webhook_events from authenticated;
revoke insert, update, delete on public.outbox_messages from authenticated;
revoke insert, update, delete on public.form_submissions from authenticated;
revoke insert, update, delete on public.message_attachments from authenticated;
revoke insert, update, delete on public.conversation_participants from authenticated;

-- Segredos das conexões inacessíveis ao cliente (privilégio de coluna).
revoke all on public.channel_connections from authenticated;
grant select (
  id, workspace_id, provider, status, display_name, external_account_id,
  phone_number_id, waba_id, instagram_id, last_event_at, created_at, updated_at
) on public.channel_connections to authenticated;

-- -----------------------------------------------------------------------------
-- RPC: ingestão idempotente de mensagem recebida (chamada pelo servidor)
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
  p_media_url text default null
)
-- Os nomes de saída levam prefixo `out_` porque colunas de RETURNS TABLE
-- entram no escopo do PL/pgSQL e tornariam ambíguas as referências a
-- conversation_id/lead_id dentro de ON CONFLICT e INSERT.
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
begin
  -- Mensagem já ingerida? Devolve o registro existente (idempotência).
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
  select ei.lead_id into v_lead_id
  from public.external_identities ei
  where ei.workspace_id = p_workspace_id
    and ei.provider = p_provider
    and ei.external_id = p_sender_external_id;

  -- Sem correspondência: cria lead mínimo na primeira etapa do pipeline padrão
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
       case when p_provider = 'whatsapp' then p_sender_external_id else null end,
       'Primeira mensagem recebida por ' || p_provider::text)
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
    (workspace_id, lead_id, provider, external_conversation_id,
     last_inbound_at, last_message_at, last_message_preview, unread_count)
  values
    (p_workspace_id, v_lead_id, p_provider, p_external_conversation_id,
     p_sent_at, p_sent_at, left(coalesce(p_body, '[mídia]'), 160), 1)
  on conflict (workspace_id, provider, external_conversation_id) do update
    set lead_id = coalesce(public.conversations.lead_id, excluded.lead_id),
        last_inbound_at = excluded.last_inbound_at,
        last_message_at = excluded.last_message_at,
        last_message_preview = excluded.last_message_preview,
        unread_count = public.conversations.unread_count + 1
  returning * into v_conversation;

  insert into public.conversation_participants
    (workspace_id, conversation_id, external_id, display_name)
  values (p_workspace_id, v_conversation.id, p_sender_external_id, p_sender_name)
  on conflict (conversation_id, external_id) do nothing;

  insert into public.messages
    (workspace_id, conversation_id, provider, external_message_id, direction,
     status, sender_external_id, body, media_type, media_url, sent_at)
  values
    (p_workspace_id, v_conversation.id, p_provider, p_external_message_id,
     'inbound', 'delivered', p_sender_external_id, p_body, p_media_type,
     p_media_url, p_sent_at)
  returning id into v_message_id;

  -- Primeira resposta do lead marca engajamento (uma única vez, sem pontuação)
  update public.leads
  set engaged_at = coalesce(engaged_at, p_sent_at),
      first_contact_at = coalesce(first_contact_at, p_sent_at)
  where id = v_lead_id;

  insert into public.activities
    (workspace_id, lead_id, type, content, meta)
  values
    (p_workspace_id, v_lead_id, 'message',
     left(coalesce(p_body, '[mídia recebida]'), 300),
     jsonb_build_object('provider', p_provider, 'direction', 'inbound'));

  return query select v_message_id, v_conversation.id, v_lead_id, v_created_lead;
end;
$$;

-- Envio pelo CRM: grava a mensagem e enfileira no outbox (transacional).
create or replace function public.send_channel_message(
  p_conversation_id uuid,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
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
    (workspace_id, message_id, provider, payload)
  values
    (v_conversation.workspace_id, v_message_id, v_conversation.provider,
     jsonb_build_object(
       'conversation_id', p_conversation_id,
       'external_conversation_id', v_conversation.external_conversation_id,
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

-- Marcar conversa como lida
create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.conversations
  set unread_count = 0
  where id = p_conversation_id
    and private.is_member(workspace_id);
$$;

-- O Postgres concede EXECUTE a PUBLIC por padrão em toda função nova, o que
-- exporia RPCs internas (ingest_channel_message forjaria mensagens em
-- qualquer workspace). Revogamos de PUBLIC/anon e mantemos apenas os grants
-- explícitos a `authenticated`; o default privileges fecha o buraco para as
-- próximas migrations.
revoke execute on all functions in schema public from public, anon;
alter default privileges in schema public revoke execute on functions from public;

grant execute on function public.send_channel_message(uuid, text) to authenticated;
grant execute on function public.mark_conversation_read(uuid) to authenticated;
-- get_invitation_public é intencionalmente pública (página de convite).
grant execute on function public.get_invitation_public(text) to anon, authenticated;
-- ingest_channel_message NÃO é exposta a authenticated: só o servidor a chama.

-- O servidor (webhooks e formulário público) escreve com service_role e
-- dispara triggers que chamam funções do schema private (normalização de
-- contato, updated_at). Sem estes grants a escrita falha com 42501.
grant usage on schema private to service_role;
grant execute on all functions in schema private to service_role;
alter default privileges in schema private
  grant execute on functions to service_role;

-- Tempo real do inbox
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
