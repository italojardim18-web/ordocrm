-- =============================================================================
-- Fase 3 — Processo comercial: agendamentos com estados, oportunidades/vendas
-- e conexões de calendário (Google) com tokens protegidos.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE public.appointment_status AS ENUM (
      'scheduled',
      'completed',
      'cancelled',
      'no_show'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunity_status') THEN
    CREATE TYPE public.opportunity_status AS ENUM ('open', 'won', 'lost');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sync_status') THEN
    CREATE TYPE public.sync_status AS ENUM ('pending', 'synced', 'error');
  END IF;
END $$;

alter type public.audit_action add value if not exists 'sale_registered';
alter type public.audit_action add value if not exists 'opportunity_lost';
alter type public.audit_action add value if not exists 'calendar_connected';
alter type public.audit_action add value if not exists 'calendar_disconnected';

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null default 'Sessão de alinhamento',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  location text,
  description text,
  meet_link text,
  -- Sincronização com calendário externo (nulos quando não conectado)
  calendar_event_id text,
  calendar_sync_status public.sync_status,
  calendar_sync_error text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint appointments_period check (ends_at > starts_at)
);

create index appointments_workspace_time_idx
  on public.appointments (workspace_id, starts_at)
  where deleted_at is null;
create index appointments_lead_idx on public.appointments (lead_id);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  product_id uuid not null references public.products (id),
  status public.opportunity_status not null default 'open',
  potential_value numeric(12, 2) check (potential_value is null or potential_value >= 0),
  sold_value numeric(12, 2) check (sold_value is null or sold_value >= 0),
  payment_method text,
  closed_at timestamptz,
  lost_reason_id uuid references public.lost_reasons (id) on delete set null,
  notes text,
  owner_id uuid references auth.users (id) on delete set null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index opportunities_workspace_status_idx
  on public.opportunities (workspace_id, status)
  where deleted_at is null;
create index opportunities_lead_idx on public.opportunities (lead_id);
create index opportunities_closed_idx
  on public.opportunities (workspace_id, closed_at);

create table public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null default 'google',
  account_email text,
  calendar_id text,
  calendar_name text,
  status text not null default 'awaiting_config',
  -- Tokens cifrados (AES-GCM na aplicação). Colunas SEM privilégio de SELECT
  -- para "authenticated": apenas o servidor (service_role) lê.
  access_token_enc text,
  refresh_token_enc text,
  token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider, user_id)
);

create table public.calendar_sync_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  appointment_id uuid references public.appointments (id) on delete cascade,
  direction text not null default 'outbound',
  external_event_id text,
  status public.sync_status not null default 'pending',
  error text,
  created_at timestamptz not null default now()
);

create index calendar_sync_events_workspace_idx
  on public.calendar_sync_events (workspace_id, created_at desc);

-- updated_at
create trigger set_updated_at before update on public.appointments
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.opportunities
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.calendar_connections
  for each row execute function private.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.appointments enable row level security;
alter table public.opportunities enable row level security;
alter table public.calendar_connections enable row level security;
alter table public.calendar_sync_events enable row level security;

create policy "appointments_select_member" on public.appointments
  for select to authenticated using (private.is_member(workspace_id));
create policy "appointments_insert_member" on public.appointments
  for insert to authenticated with check (private.is_member(workspace_id));
create policy "appointments_update_member" on public.appointments
  for update to authenticated
  using (private.is_member(workspace_id))
  with check (private.is_member(workspace_id));

create policy "opportunities_select_member" on public.opportunities
  for select to authenticated using (private.is_member(workspace_id));
create policy "opportunities_insert_member" on public.opportunities
  for insert to authenticated with check (private.is_member(workspace_id));
create policy "opportunities_update_member" on public.opportunities
  for update to authenticated
  using (private.is_member(workspace_id))
  with check (private.is_member(workspace_id));

-- Conexões de calendário: apenas admins veem (e nunca as colunas de token).
create policy "calendar_connections_select_admin" on public.calendar_connections
  for select to authenticated using (private.is_admin(workspace_id));

create policy "calendar_sync_events_select_admin" on public.calendar_sync_events
  for select to authenticated using (private.is_admin(workspace_id));

-- Privilégio de coluna: authenticated não consegue ler tokens mesmo com RLS ok.
revoke all on public.calendar_connections from authenticated;
grant select (
  id, workspace_id, user_id, provider, account_email,
  calendar_id, calendar_name, status, token_expires_at, created_at, updated_at
) on public.calendar_connections to authenticated;

revoke insert, update, delete on public.calendar_sync_events from authenticated;

-- -----------------------------------------------------------------------------
-- RPCs
-- -----------------------------------------------------------------------------

-- Registra venda: fecha (ou cria) a oportunidade como ganha e move o lead
-- para a etapa "won" na mesma transação.
create or replace function public.register_sale(
  p_lead_id uuid,
  p_product_id uuid,
  p_sold_value numeric,
  p_payment_method text default null,
  p_opportunity_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lead record;
  v_won_stage record;
  v_opportunity_id uuid;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id and deleted_at is null
  for update;

  if v_lead is null or not private.is_member(v_lead.workspace_id) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  if p_sold_value is null or p_sold_value < 0 then
    raise exception 'valor vendido inválido' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.products
    where id = p_product_id and workspace_id = v_lead.workspace_id
  ) then
    raise exception 'produto inválido' using errcode = '22023';
  end if;

  if p_opportunity_id is not null then
    update public.opportunities
    set status = 'won',
        sold_value = p_sold_value,
        payment_method = coalesce(p_payment_method, payment_method),
        product_id = p_product_id,
        closed_at = now()
    where id = p_opportunity_id
      and lead_id = p_lead_id
      and workspace_id = v_lead.workspace_id
      and status = 'open'
    returning id into v_opportunity_id;

    if v_opportunity_id is null then
      raise exception 'oportunidade inválida ou já fechada' using errcode = '22023';
    end if;
  else
    insert into public.opportunities
      (workspace_id, lead_id, product_id, status, sold_value, payment_method,
       closed_at, owner_id, created_by)
    values
      (v_lead.workspace_id, p_lead_id, p_product_id, 'won', p_sold_value,
       p_payment_method, now(), v_lead.owner_id, (select auth.uid()))
    returning id into v_opportunity_id;
  end if;

  -- Move para a etapa de venda, se existir e o lead ainda não estiver nela.
  -- Atenção: `record IS NOT NULL` em PL/pgSQL só é verdadeiro quando TODAS as
  -- colunas são não-nulas (archived_at é nulo nas etapas ativas), por isso o
  -- teste é feito sobre a coluna id.
  select * into v_won_stage
  from public.pipeline_stages
  where pipeline_id = v_lead.pipeline_id
    and stage_type = 'won'
    and archived_at is null
  order by position
  limit 1;

  if v_won_stage.id is not null and v_lead.stage_id <> v_won_stage.id then
    perform public.move_lead_stage(p_lead_id, v_won_stage.id, 0);
  end if;

  insert into public.activities (workspace_id, lead_id, type, content, actor_id)
  values (v_lead.workspace_id, p_lead_id, 'system',
          'Venda registrada — R$ ' || to_char(p_sold_value, 'FM999G999G990D00'),
          (select auth.uid()));

  perform private.log_audit(
    v_lead.workspace_id, 'sale_registered', 'opportunity', v_opportunity_id::text,
    jsonb_build_object('sold_value', p_sold_value, 'product_id', p_product_id)
  );

  return v_opportunity_id;
end;
$$;

-- Marca oportunidade como perdida (o lead pode continuar ativo na esteira).
create or replace function public.mark_opportunity_lost(
  p_opportunity_id uuid,
  p_lost_reason_id uuid default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_opp record;
begin
  select * into v_opp
  from public.opportunities
  where id = p_opportunity_id and deleted_at is null
  for update;

  if v_opp is null or not private.is_member(v_opp.workspace_id) then
    raise exception 'oportunidade não encontrada' using errcode = 'P0002';
  end if;

  if v_opp.status <> 'open' then
    raise exception 'a oportunidade já está fechada' using errcode = '22023';
  end if;

  update public.opportunities
  set status = 'lost',
      lost_reason_id = p_lost_reason_id,
      notes = coalesce(p_note, notes),
      closed_at = now()
  where id = p_opportunity_id;

  perform private.log_audit(
    v_opp.workspace_id, 'opportunity_lost', 'opportunity', p_opportunity_id::text,
    jsonb_build_object('lost_reason_id', p_lost_reason_id)
  );
end;
$$;

-- mark_lead_lost agora também fecha oportunidades abertas do lead.
create or replace function public.mark_lead_lost(
  p_lead_id uuid,
  p_lost_reason_id uuid,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lead record;
  v_lost_stage record;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id and deleted_at is null
  for update;

  if v_lead is null or not private.is_member(v_lead.workspace_id) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  if p_lost_reason_id is null or not exists (
    select 1 from public.lost_reasons
    where id = p_lost_reason_id and workspace_id = v_lead.workspace_id
  ) then
    raise exception 'motivo de perda obrigatório' using errcode = '22023';
  end if;

  select * into v_lost_stage
  from public.pipeline_stages
  where pipeline_id = v_lead.pipeline_id
    and stage_type = 'lost'
    and archived_at is null
  order by position
  limit 1;

  if v_lost_stage is null then
    raise exception 'o pipeline não possui etapa de perda' using errcode = '22023';
  end if;

  update public.leads
  set lost_reason_id = p_lost_reason_id,
      lost_note = p_note,
      lost_at = now()
  where id = p_lead_id;

  update public.opportunities
  set status = 'lost',
      lost_reason_id = p_lost_reason_id,
      closed_at = now()
  where lead_id = p_lead_id
    and status = 'open'
    and deleted_at is null;

  perform public.move_lead_stage(p_lead_id, v_lost_stage.id, 0);

  perform private.log_audit(
    v_lead.workspace_id, 'lead_lost', 'lead', p_lead_id::text,
    jsonb_build_object('lost_reason_id', p_lost_reason_id)
  );
end;
$$;

grant execute on function public.register_sale(uuid, uuid, numeric, text, uuid) to authenticated;
grant execute on function public.mark_opportunity_lost(uuid, uuid, text) to authenticated;
