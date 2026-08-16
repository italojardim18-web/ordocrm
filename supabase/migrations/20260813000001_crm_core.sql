-- =============================================================================
-- Fase 2 — CRM principal: pipelines, etapas semânticas, produtos, leads com
-- cadastro progressivo, notas (team/admin_only), tarefas, atividades,
-- histórico de etapas e RPCs transacionais.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipos de domínio
-- -----------------------------------------------------------------------------

-- Tipo semântico interno da etapa: relatórios usam este valor, nunca o nome
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stage_type') THEN
    CREATE TYPE public.stage_type AS ENUM (
      'new',
      'qualification',
      'follow_up_pre_session',
      'alignment_session',
      'follow_up_post_session',
      'won',
      'lost',
      'custom'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_channel') THEN
    CREATE TYPE public.lead_channel AS ENUM (
      'form',
      'whatsapp',
      'instagram',
      'paid_traffic',
      'manual'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'note_visibility') THEN
    CREATE TYPE public.note_visibility AS ENUM ('team', 'admin_only');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
    CREATE TYPE public.activity_type AS ENUM (
      'call',
      'message',
      'note',
      'task',
      'stage_change',
      'system'
    );
  END IF;
END $$;

alter type public.audit_action add value if not exists 'lead_merged';
alter type public.audit_action add value if not exists 'lead_lost';
alter type public.audit_action add value if not exists 'lead_reactivated';
alter type public.audit_action add value if not exists 'stage_deleted';
alter type public.audit_action add value if not exists 'product_changed';
alter type public.audit_action add value if not exists 'pipeline_changed';

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------

create table public.pipelines (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  is_default boolean not null default false,
  position numeric not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pipelines_workspace_idx on public.pipelines (workspace_id);

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  pipeline_id uuid not null references public.pipelines (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  stage_type public.stage_type not null default 'custom',
  position numeric not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pipeline_stages_pipeline_idx on public.pipeline_stages (pipeline_id, position);
create index pipeline_stages_workspace_idx on public.pipeline_stages (workspace_id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  category text not null default 'outro',
  description text,
  default_price numeric(12, 2) check (default_price is null or default_price >= 0),
  is_active boolean not null default true,
  default_pipeline_id uuid references public.pipelines (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_workspace_idx on public.products (workspace_id, is_active);

create table public.lost_reasons (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 120),
  position numeric not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lost_reasons_workspace_idx on public.lost_reasons (workspace_id, is_active);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  pipeline_id uuid not null references public.pipelines (id),
  stage_id uuid not null references public.pipeline_stages (id),
  position numeric not null default 0,
  -- Cadastro progressivo: apenas o nome é obrigatório na captura.
  name text not null check (char_length(name) between 1 and 160),
  social_name text,
  phone text,
  phone_normalized text,
  email text,
  email_normalized text,
  city text,
  state text check (state is null or char_length(state) <= 2),
  contact_preference text,
  channel public.lead_channel not null default 'manual',
  source_detail text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  external_campaign text,
  external_ad text,
  external_form text,
  owner_id uuid references auth.users (id) on delete set null,
  potential_value numeric(12, 2) check (potential_value is null or potential_value >= 0),
  next_action text,
  first_contact_at timestamptz,
  engaged_at timestamptz,
  lost_reason_id uuid references public.lost_reasons (id) on delete set null,
  lost_note text,
  lost_at timestamptz,
  reactivated_count integer not null default 0,
  notes_summary text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index leads_board_idx on public.leads (workspace_id, stage_id, position)
  where deleted_at is null;
create index leads_pipeline_idx on public.leads (workspace_id, pipeline_id);
create index leads_phone_idx on public.leads (workspace_id, phone_normalized)
  where phone_normalized is not null;
create index leads_email_idx on public.leads (workspace_id, email_normalized)
  where email_normalized is not null;
create index leads_owner_idx on public.leads (workspace_id, owner_id);
create index leads_created_idx on public.leads (workspace_id, created_at desc);

create table public.lead_product_interests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (lead_id, product_id)
);

create index lead_product_interests_product_idx
  on public.lead_product_interests (workspace_id, product_id);

create table public.lead_stage_history (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  from_stage_id uuid references public.pipeline_stages (id) on delete set null,
  to_stage_id uuid references public.pipeline_stages (id) on delete set null,
  -- stage_type congelado no evento: relatórios não dependem da etapa existir.
  from_stage_type public.stage_type,
  to_stage_type public.stage_type not null,
  actor_id uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index lead_stage_history_lead_idx on public.lead_stage_history (lead_id, created_at);
create index lead_stage_history_workspace_idx
  on public.lead_stage_history (workspace_id, created_at);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  created_at timestamptz not null default now(),
  unique (workspace_id, name)
);

create table public.lead_tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (lead_id, tag_id)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  author_id uuid not null references auth.users (id),
  body text not null check (char_length(body) between 1 and 8000),
  visibility public.note_visibility not null default 'team',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index notes_lead_idx on public.notes (lead_id, created_at desc);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 300),
  due_at timestamptz,
  completed_at timestamptz,
  assigned_to uuid references auth.users (id) on delete set null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index tasks_lead_idx on public.tasks (lead_id);
create index tasks_due_idx on public.tasks (workspace_id, due_at)
  where completed_at is null and deleted_at is null;

create table public.activities (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  type public.activity_type not null,
  content text,
  meta jsonb not null default '{}'::jsonb,
  actor_id uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index activities_lead_idx on public.activities (lead_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Normalização e triggers
-- -----------------------------------------------------------------------------

-- Telefone normalizado: apenas dígitos; números BR de 10/11 dígitos ganham 55.
create or replace function private.normalize_phone(raw text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when raw is null or btrim(raw) = '' then null
    else (
      with digits as (select regexp_replace(raw, '\D', '', 'g') as d)
      select case
        when d = '' then null
        when char_length(d) in (10, 11) then '55' || d
        else d
      end
      from digits
    )
  end;
$$;

create or replace function private.normalize_lead_contacts()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.phone_normalized := private.normalize_phone(new.phone);
  new.email_normalized := nullif(lower(btrim(new.email)), '');
  return new;
end;
$$;

create trigger normalize_lead_contacts
  before insert or update of phone, email on public.leads
  for each row execute function private.normalize_lead_contacts();

-- Mudança de etapa só pela RPC move_lead_stage (que grava o histórico).
-- A RPC sinaliza via configuração local de transação.
create or replace function private.guard_stage_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.stage_id is distinct from old.stage_id
     and coalesce(current_setting('app.allow_stage_move', true), '') <> '1' then
    raise exception 'use move_lead_stage para mudar a etapa'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger guard_stage_change
  before update of stage_id on public.leads
  for each row execute function private.guard_stage_change();

create trigger set_updated_at before update on public.pipelines
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.pipeline_stages
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.products
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.lost_reasons
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.leads
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.notes
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.tasks
  for each row execute function private.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.pipelines enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.products enable row level security;
alter table public.lost_reasons enable row level security;
alter table public.leads enable row level security;
alter table public.lead_product_interests enable row level security;
alter table public.lead_stage_history enable row level security;
alter table public.tags enable row level security;
alter table public.lead_tags enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;

-- Estrutura (pipelines, etapas, produtos, motivos): membros leem, admin escreve.
create policy "pipelines_select_member" on public.pipelines
  for select to authenticated using (private.is_member(workspace_id));
create policy "pipelines_write_admin" on public.pipelines
  for all to authenticated
  using (private.is_admin(workspace_id))
  with check (private.is_admin(workspace_id));

create policy "stages_select_member" on public.pipeline_stages
  for select to authenticated using (private.is_member(workspace_id));
create policy "stages_write_admin" on public.pipeline_stages
  for all to authenticated
  using (private.is_admin(workspace_id))
  with check (private.is_admin(workspace_id));

create policy "products_select_member" on public.products
  for select to authenticated using (private.is_member(workspace_id));
create policy "products_write_admin" on public.products
  for all to authenticated
  using (private.is_admin(workspace_id))
  with check (private.is_admin(workspace_id));

create policy "lost_reasons_select_member" on public.lost_reasons
  for select to authenticated using (private.is_member(workspace_id));
create policy "lost_reasons_write_admin" on public.lost_reasons
  for all to authenticated
  using (private.is_admin(workspace_id))
  with check (private.is_admin(workspace_id));

-- Operação (leads e satélites): membros leem e escrevem no próprio workspace.
-- DELETE físico não existe para ninguém: arquivar = deleted_at, remoção real
-- apenas por RPC administrativa auditada (fases futuras).
create policy "leads_select_member" on public.leads
  for select to authenticated using (private.is_member(workspace_id));
create policy "leads_insert_member" on public.leads
  for insert to authenticated with check (private.is_member(workspace_id));
create policy "leads_update_member" on public.leads
  for update to authenticated
  using (private.is_member(workspace_id))
  with check (private.is_member(workspace_id));

create policy "interests_select_member" on public.lead_product_interests
  for select to authenticated using (private.is_member(workspace_id));
create policy "interests_insert_member" on public.lead_product_interests
  for insert to authenticated with check (private.is_member(workspace_id));
create policy "interests_delete_member" on public.lead_product_interests
  for delete to authenticated using (private.is_member(workspace_id));

-- Histórico de etapas: leitura para membros; escrita apenas via RPC (definer).
create policy "history_select_member" on public.lead_stage_history
  for select to authenticated using (private.is_member(workspace_id));

create policy "tags_select_member" on public.tags
  for select to authenticated using (private.is_member(workspace_id));
create policy "tags_insert_member" on public.tags
  for insert to authenticated with check (private.is_member(workspace_id));

create policy "lead_tags_select_member" on public.lead_tags
  for select to authenticated using (private.is_member(workspace_id));
create policy "lead_tags_insert_member" on public.lead_tags
  for insert to authenticated with check (private.is_member(workspace_id));
create policy "lead_tags_delete_member" on public.lead_tags
  for delete to authenticated using (private.is_member(workspace_id));

-- Notas: admin_only é invisível a quem não é admin, já na policy de SELECT.
create policy "notes_select_visibility" on public.notes
  for select to authenticated
  using (
    private.is_member(workspace_id)
    and (visibility = 'team' or private.is_admin(workspace_id))
  );
create policy "notes_insert_visibility" on public.notes
  for insert to authenticated
  with check (
    private.is_member(workspace_id)
    and author_id = (select auth.uid())
    and (visibility = 'team' or private.is_admin(workspace_id))
  );
create policy "notes_update_author_or_admin" on public.notes
  for update to authenticated
  using (
    private.is_member(workspace_id)
    and (author_id = (select auth.uid()) or private.is_admin(workspace_id))
  )
  with check (
    private.is_member(workspace_id)
    and (visibility = 'team' or private.is_admin(workspace_id))
  );

create policy "tasks_select_member" on public.tasks
  for select to authenticated using (private.is_member(workspace_id));
create policy "tasks_insert_member" on public.tasks
  for insert to authenticated with check (private.is_member(workspace_id));
create policy "tasks_update_member" on public.tasks
  for update to authenticated
  using (private.is_member(workspace_id))
  with check (private.is_member(workspace_id));

create policy "activities_select_member" on public.activities
  for select to authenticated using (private.is_member(workspace_id));
create policy "activities_insert_member" on public.activities
  for insert to authenticated
  with check (
    private.is_member(workspace_id)
    and actor_id = (select auth.uid())
  );

-- -----------------------------------------------------------------------------
-- RPCs transacionais
-- -----------------------------------------------------------------------------

-- Cria o pipeline padrão com as 7 etapas iniciais (onboarding/seed).
create or replace function public.create_default_pipeline(ws_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_pipeline uuid;
begin
  if not private.is_admin(ws_id) and (select auth.uid()) is not null then
    raise exception 'apenas administradores' using errcode = '42501';
  end if;

  insert into public.pipelines (workspace_id, name, is_default)
  values (ws_id, 'Esteira comercial', true)
  returning id into new_pipeline;

  insert into public.pipeline_stages (workspace_id, pipeline_id, name, stage_type, position)
  values
    (ws_id, new_pipeline, 'Novo lead', 'new', 1000),
    (ws_id, new_pipeline, 'Qualificação', 'qualification', 2000),
    (ws_id, new_pipeline, 'Follow-up pré-sessão', 'follow_up_pre_session', 3000),
    (ws_id, new_pipeline, 'Sessão de alinhamento', 'alignment_session', 4000),
    (ws_id, new_pipeline, 'Follow-up pós-sessão', 'follow_up_post_session', 5000),
    (ws_id, new_pipeline, 'Venda realizada', 'won', 6000),
    (ws_id, new_pipeline, 'Perdido', 'lost', 7000);

  return new_pipeline;
end;
$$;

-- Move lead de etapa e/ou posição, gravando histórico atomicamente.
create or replace function public.move_lead_stage(
  p_lead_id uuid,
  p_stage_id uuid,
  p_position numeric
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lead record;
  v_from_stage record;
  v_to_stage record;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id and deleted_at is null
  for update;

  if v_lead is null or not private.is_member(v_lead.workspace_id) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  select * into v_to_stage
  from public.pipeline_stages
  where id = p_stage_id and archived_at is null;

  if v_to_stage is null
     or v_to_stage.workspace_id <> v_lead.workspace_id
     or v_to_stage.pipeline_id <> v_lead.pipeline_id then
    raise exception 'etapa inválida para este lead' using errcode = '22023';
  end if;

  select * into v_from_stage
  from public.pipeline_stages
  where id = v_lead.stage_id;

  perform set_config('app.allow_stage_move', '1', true);

  update public.leads
  set stage_id = p_stage_id, position = p_position
  where id = p_lead_id;

  perform set_config('app.allow_stage_move', '', true);

  if v_lead.stage_id <> p_stage_id then
    insert into public.lead_stage_history
      (workspace_id, lead_id, from_stage_id, to_stage_id,
       from_stage_type, to_stage_type, actor_id)
    values
      (v_lead.workspace_id, p_lead_id, v_lead.stage_id, p_stage_id,
       v_from_stage.stage_type, v_to_stage.stage_type, (select auth.uid()));

    insert into public.activities (workspace_id, lead_id, type, content, meta, actor_id)
    values (
      v_lead.workspace_id, p_lead_id, 'stage_change',
      v_from_stage.name || ' → ' || v_to_stage.name,
      jsonb_build_object('from_stage_type', v_from_stage.stage_type,
                         'to_stage_type', v_to_stage.stage_type),
      (select auth.uid())
    );
  end if;
end;
$$;

-- Marca lead como perdido: exige motivo, move para a etapa "lost" do pipeline.
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

  perform public.move_lead_stage(p_lead_id, v_lost_stage.id, 0);

  perform private.log_audit(
    v_lead.workspace_id, 'lead_lost', 'lead', p_lead_id::text,
    jsonb_build_object('lost_reason_id', p_lost_reason_id)
  );
end;
$$;

-- Reativa lead perdido preservando histórico.
create or replace function public.reactivate_lead(
  p_lead_id uuid,
  p_stage_id uuid
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
  set lost_reason_id = null,
      lost_note = null,
      lost_at = null,
      reactivated_count = reactivated_count + 1
  where id = p_lead_id;

  perform public.move_lead_stage(p_lead_id, p_stage_id, 0);

  perform private.log_audit(
    v_lead.workspace_id, 'lead_reactivated', 'lead', p_lead_id::text
  );
end;
$$;

-- Exclui etapa migrando os leads para a etapa de destino (admin).
create or replace function public.delete_stage_migrating_leads(
  p_stage_id uuid,
  p_target_stage_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_stage record;
  v_target record;
  v_lead record;
begin
  select * into v_stage from public.pipeline_stages where id = p_stage_id;

  if v_stage is null or not private.is_admin(v_stage.workspace_id) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.leads
    where stage_id = p_stage_id and deleted_at is null
  ) then
    select * into v_target
    from public.pipeline_stages
    where id = p_target_stage_id and archived_at is null;

    if v_target is null
       or v_target.pipeline_id <> v_stage.pipeline_id
       or v_target.id = v_stage.id then
      raise exception 'escolha uma etapa de destino válida para os leads'
        using errcode = '22023';
    end if;

    for v_lead in
      select id from public.leads
      where stage_id = p_stage_id and deleted_at is null
    loop
      perform public.move_lead_stage(v_lead.id, p_target_stage_id, 0);
    end loop;
  end if;

  delete from public.pipeline_stages where id = p_stage_id;

  perform private.log_audit(
    v_stage.workspace_id, 'stage_deleted', 'pipeline_stage', p_stage_id::text,
    jsonb_build_object('name', v_stage.name, 'stage_type', v_stage.stage_type,
                       'target_stage_id', p_target_stage_id)
  );
end;
$$;

-- Mescla duplicados (admin): move satélites para o principal, completa campos
-- vazios e arquiva o duplicado. Transacional e auditada.
create or replace function public.merge_leads(
  p_primary_id uuid,
  p_duplicate_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_primary record;
  v_duplicate record;
begin
  if p_primary_id = p_duplicate_id then
    raise exception 'os leads precisam ser diferentes' using errcode = '22023';
  end if;

  select * into v_primary
  from public.leads where id = p_primary_id and deleted_at is null
  for update;
  select * into v_duplicate
  from public.leads where id = p_duplicate_id and deleted_at is null
  for update;

  if v_primary is null or v_duplicate is null
     or v_primary.workspace_id <> v_duplicate.workspace_id
     or not private.is_admin(v_primary.workspace_id) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  update public.notes set lead_id = p_primary_id where lead_id = p_duplicate_id;
  update public.tasks set lead_id = p_primary_id where lead_id = p_duplicate_id;
  update public.activities set lead_id = p_primary_id where lead_id = p_duplicate_id;
  update public.lead_stage_history set lead_id = p_primary_id where lead_id = p_duplicate_id;

  insert into public.lead_product_interests (workspace_id, lead_id, product_id)
  select workspace_id, p_primary_id, product_id
  from public.lead_product_interests
  where lead_id = p_duplicate_id
  on conflict (lead_id, product_id) do nothing;
  delete from public.lead_product_interests where lead_id = p_duplicate_id;

  insert into public.lead_tags (workspace_id, lead_id, tag_id)
  select workspace_id, p_primary_id, tag_id
  from public.lead_tags
  where lead_id = p_duplicate_id
  on conflict (lead_id, tag_id) do nothing;
  delete from public.lead_tags where lead_id = p_duplicate_id;

  update public.leads
  set phone = coalesce(v_primary.phone, v_duplicate.phone),
      email = coalesce(v_primary.email, v_duplicate.email),
      social_name = coalesce(v_primary.social_name, v_duplicate.social_name),
      city = coalesce(v_primary.city, v_duplicate.city),
      state = coalesce(v_primary.state, v_duplicate.state),
      contact_preference = coalesce(v_primary.contact_preference, v_duplicate.contact_preference),
      utm_source = coalesce(v_primary.utm_source, v_duplicate.utm_source),
      utm_medium = coalesce(v_primary.utm_medium, v_duplicate.utm_medium),
      utm_campaign = coalesce(v_primary.utm_campaign, v_duplicate.utm_campaign),
      utm_content = coalesce(v_primary.utm_content, v_duplicate.utm_content),
      utm_term = coalesce(v_primary.utm_term, v_duplicate.utm_term),
      potential_value = coalesce(v_primary.potential_value, v_duplicate.potential_value),
      owner_id = coalesce(v_primary.owner_id, v_duplicate.owner_id),
      first_contact_at = least(
        coalesce(v_primary.first_contact_at, v_duplicate.first_contact_at),
        coalesce(v_duplicate.first_contact_at, v_primary.first_contact_at)
      ),
      engaged_at = least(
        coalesce(v_primary.engaged_at, v_duplicate.engaged_at),
        coalesce(v_duplicate.engaged_at, v_primary.engaged_at)
      )
  where id = p_primary_id;

  update public.leads
  set deleted_at = now()
  where id = p_duplicate_id;

  insert into public.activities (workspace_id, lead_id, type, content, actor_id)
  values (v_primary.workspace_id, p_primary_id, 'system',
          'Lead mesclado com registro duplicado', (select auth.uid()));

  perform private.log_audit(
    v_primary.workspace_id, 'lead_merged', 'lead', p_primary_id::text,
    jsonb_build_object('duplicate_id', p_duplicate_id)
  );
end;
$$;

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

-- Tempo real do Kanban/lista: mudanças em leads são transmitidas via Realtime
-- (respeitando RLS).
alter publication supabase_realtime add table public.leads;

grant execute on function public.create_default_pipeline(uuid) to authenticated;
grant execute on function public.move_lead_stage(uuid, uuid, numeric) to authenticated;
grant execute on function public.mark_lead_lost(uuid, uuid, text) to authenticated;
grant execute on function public.reactivate_lead(uuid, uuid) to authenticated;
grant execute on function public.delete_stage_migrating_leads(uuid, uuid) to authenticated;
grant execute on function public.merge_leads(uuid, uuid) to authenticated;
