-- =============================================================================
-- Fase 1 — Fundação: workspaces, perfis, membros, convites, auditoria.
-- Multi-tenant por workspace_id com RLS em todas as tabelas expostas.
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

-- -----------------------------------------------------------------------------
-- Tipos de domínio
-- -----------------------------------------------------------------------------

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_role') THEN
    CREATE TYPE public.member_role AS ENUM ('admin', 'assistant');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitation_status') THEN
    CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'revoked', 'expired');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') THEN
    CREATE TYPE public.audit_action AS ENUM (
      'workspace_updated',
      'branding_updated',
      'member_invited',
      'invitation_revoked',
      'invitation_accepted',
      'member_role_changed',
      'member_activated',
      'member_deactivated'
    );
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Schema privado para funções auxiliares (nunca exposto pela API)
-- -----------------------------------------------------------------------------

create schema if not exists private;

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  timezone text not null default 'America/Campo_Grande',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.workspace_branding (
  workspace_id uuid primary key references public.workspaces (id) on delete cascade,
  display_name text,
  logo_url text,
  icon_url text,
  -- Tokens de marca configuráveis por workspace (cores, etc.). Nunca segredos.
  brand_tokens jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.member_role not null default 'assistant',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index if not exists workspace_members_user_idx on public.workspace_members (user_id);
create index if not exists workspace_members_workspace_idx on public.workspace_members (workspace_id);

create table if not exists public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email extensions.citext not null,
  role public.member_role not null default 'assistant',
  token_hash text not null unique,
  status public.invitation_status not null default 'pending',
  invited_by uuid not null references auth.users (id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspace_invitations_workspace_idx on public.workspace_invitations (workspace_id);
create index if not exists workspace_invitations_email_idx on public.workspace_invitations (workspace_id, email);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  actor_id uuid references auth.users (id),
  action public.audit_action not null,
  entity_type text not null,
  entity_id text,
  -- Apenas metadados; nunca conteúdo sensível, tokens ou dados pessoais além do necessário.
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_workspace_idx on public.audit_logs (workspace_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Funções auxiliares (security definer para evitar recursão de policy)
-- -----------------------------------------------------------------------------

create or replace function private.user_workspaces()
returns setof uuid
language sql
security definer
set search_path = ''
stable
as $$
  select workspace_id
  from public.workspace_members
  where user_id = (select auth.uid())
    and is_active;
$$;

create or replace function private.is_member(ws_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = (select auth.uid())
      and is_active
  );
$$;

create or replace function private.is_admin(ws_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = (select auth.uid())
      and role = 'admin'
      and is_active
  );
$$;

create or replace function private.log_audit(
  ws_id uuid,
  audit_action public.audit_action,
  entity_type text,
  entity_id text,
  details jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.audit_logs (workspace_id, actor_id, action, entity_type, entity_id, details)
  values (ws_id, (select auth.uid()), audit_action, entity_type, entity_id, details);
$$;

-- updated_at automático
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger set_updated_at before update on public.workspaces
  for each row execute function private.set_updated_at();
create or replace trigger set_updated_at before update on public.workspace_branding
  for each row execute function private.set_updated_at();
create or replace trigger set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();
create or replace trigger set_updated_at before update on public.workspace_members
  for each row execute function private.set_updated_at();
create or replace trigger set_updated_at before update on public.workspace_invitations
  for each row execute function private.set_updated_at();

-- Perfil criado automaticamente para cada novo usuário do Auth
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.workspaces enable row level security;
alter table public.workspace_branding enable row level security;
alter table public.profiles enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invitations enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "workspaces_select_member" on public.workspaces;
create policy "workspaces_select_member" on public.workspaces
  for select to authenticated
  using (private.is_member(id) and deleted_at is null);

drop policy if exists "workspaces_update_admin" on public.workspaces;
create policy "workspaces_update_admin" on public.workspaces
  for update to authenticated
  using (private.is_admin(id))
  with check (private.is_admin(id));

-- workspace_branding
drop policy if exists "branding_select_member" on public.workspace_branding;
create policy "branding_select_member" on public.workspace_branding
  for select to authenticated
  using (private.is_member(workspace_id));

drop policy if exists "branding_insert_admin" on public.workspace_branding;
create policy "branding_insert_admin" on public.workspace_branding
  for insert to authenticated
  with check (private.is_admin(workspace_id));

drop policy if exists "branding_update_admin" on public.workspace_branding;
create policy "branding_update_admin" on public.workspace_branding
  for update to authenticated
  using (private.is_admin(workspace_id))
  with check (private.is_admin(workspace_id));

-- profiles: o próprio usuário e colegas de workspace podem ler; só o próprio edita.
drop policy if exists "profiles_select_self_or_colleague" on public.profiles;
create policy "profiles_select_self_or_colleague" on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())
    or id in (
      select m.user_id
      from public.workspace_members m
      where m.workspace_id in (select private.user_workspaces())
    )
  );

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- workspace_members: membros veem a equipe do próprio workspace.
-- Nenhuma escrita direta: mudanças de papel/ativação apenas via RPCs auditadas.
drop policy if exists "members_select_member" on public.workspace_members;
create policy "members_select_member" on public.workspace_members
  for select to authenticated
  using (private.is_member(workspace_id));

-- workspace_invitations: apenas admins do workspace.
drop policy if exists "invitations_select_admin" on public.workspace_invitations;
create policy "invitations_select_admin" on public.workspace_invitations
  for select to authenticated
  using (private.is_admin(workspace_id));

-- audit_logs: apenas admins leem; escrita apenas via private.log_audit.
drop policy if exists "audit_select_admin" on public.audit_logs;
create policy "audit_select_admin" on public.audit_logs
  for select to authenticated
  using (private.is_admin(workspace_id));

-- -----------------------------------------------------------------------------
-- RPCs
-- -----------------------------------------------------------------------------

-- Cria convite e devolve o token bruto (exibido uma única vez ao admin).
create or replace function public.create_invitation(
  ws_id uuid,
  invitee_email text,
  invitee_role public.member_role default 'assistant'
)
returns table (invitation_id uuid, token text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  raw_token text;
  new_id uuid;
begin
  if not private.is_admin(ws_id) then
    raise exception 'apenas administradores podem convidar usuários'
      using errcode = '42501';
  end if;

  if exists (
    select 1
    from public.workspace_members m
    join auth.users u on u.id = m.user_id
    where m.workspace_id = ws_id
      and lower(u.email) = lower(invitee_email)
  ) then
    raise exception 'este e-mail já pertence a um membro do workspace'
      using errcode = '23505';
  end if;

  raw_token := encode(extensions.gen_random_bytes(24), 'hex');

  -- Invalida convites pendentes anteriores para o mesmo e-mail.
  update public.workspace_invitations
  set status = 'revoked'
  where workspace_id = ws_id
    and email = invitee_email::extensions.citext
    and status = 'pending';

  insert into public.workspace_invitations
    (workspace_id, email, role, token_hash, invited_by, expires_at)
  values (
    ws_id,
    invitee_email::extensions.citext,
    invitee_role,
    encode(extensions.digest(raw_token, 'sha256'), 'hex'),
    (select auth.uid()),
    now() + interval '7 days'
  )
  returning id into new_id;

  perform private.log_audit(
    ws_id, 'member_invited', 'workspace_invitation', new_id::text,
    jsonb_build_object('role', invitee_role)
  );

  return query select new_id, raw_token;
end;
$$;

-- Dados mínimos do convite para a página pública /convite/[token].
create or replace function public.get_invitation_public(raw_token text)
returns table (
  workspace_name text,
  email text,
  role public.member_role,
  status public.invitation_status,
  expires_at timestamptz
)
language sql
security definer
set search_path = ''
stable
as $$
  select w.name, i.email::text, i.role, i.status, i.expires_at
  from public.workspace_invitations i
  join public.workspaces w on w.id = i.workspace_id
  where i.token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex');
$$;

-- Aceita convite: exige usuário autenticado com o mesmo e-mail do convite.
create or replace function public.accept_invitation(raw_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  inv record;
  caller_email text;
begin
  if (select auth.uid()) is null then
    raise exception 'autenticação necessária' using errcode = '42501';
  end if;

  select email into caller_email from auth.users where id = (select auth.uid());

  select * into inv
  from public.workspace_invitations
  where token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex')
  for update;

  if inv is null then
    raise exception 'convite não encontrado' using errcode = 'P0002';
  end if;

  if inv.status <> 'pending' then
    raise exception 'convite não está mais válido' using errcode = 'P0002';
  end if;

  if inv.expires_at < now() then
    update public.workspace_invitations set status = 'expired' where id = inv.id;
    raise exception 'convite expirado' using errcode = 'P0002';
  end if;

  if lower(caller_email) <> lower(inv.email::text) then
    raise exception 'o convite pertence a outro e-mail' using errcode = '42501';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (inv.workspace_id, (select auth.uid()), inv.role)
  on conflict (workspace_id, user_id) do update
    set is_active = true;

  update public.workspace_invitations
  set status = 'accepted', accepted_at = now()
  where id = inv.id;

  perform private.log_audit(
    inv.workspace_id, 'invitation_accepted', 'workspace_invitation', inv.id::text,
    jsonb_build_object('role', inv.role)
  );

  return inv.workspace_id;
end;
$$;

create or replace function public.revoke_invitation(invitation_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  ws uuid;
begin
  select workspace_id into ws
  from public.workspace_invitations
  where id = invitation_id;

  if ws is null or not private.is_admin(ws) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  update public.workspace_invitations
  set status = 'revoked'
  where id = invitation_id and status = 'pending';

  perform private.log_audit(ws, 'invitation_revoked', 'workspace_invitation', invitation_id::text);
end;
$$;

-- Troca de papel: admin do workspace, nunca sobre si mesmo (antiescalação).
create or replace function public.change_member_role(
  member_id uuid,
  new_role public.member_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  m record;
begin
  select * into m from public.workspace_members where id = member_id;

  if m is null or not private.is_admin(m.workspace_id) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  if m.user_id = (select auth.uid()) then
    raise exception 'não é possível alterar o próprio papel' using errcode = '42501';
  end if;

  update public.workspace_members set role = new_role where id = member_id;

  perform private.log_audit(
    m.workspace_id, 'member_role_changed', 'workspace_member', member_id::text,
    jsonb_build_object('from', m.role, 'to', new_role)
  );
end;
$$;

-- Ativa/desativa membro: admin, nunca sobre si mesmo.
create or replace function public.set_member_active(member_id uuid, active boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  m record;
begin
  select * into m from public.workspace_members where id = member_id;

  if m is null or not private.is_admin(m.workspace_id) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  if m.user_id = (select auth.uid()) then
    raise exception 'não é possível desativar a si mesmo' using errcode = '42501';
  end if;

  update public.workspace_members set is_active = active where id = member_id;

  perform private.log_audit(
    m.workspace_id,
    case when active then 'member_activated' else 'member_deactivated' end,
    'workspace_member',
    member_id::text
  );
end;
$$;

-- -----------------------------------------------------------------------------
-- Grants: RPCs executáveis por usuários autenticados; página de convite é pública.
-- -----------------------------------------------------------------------------

revoke execute on all functions in schema public from public, anon;

-- Grants de tabela: a RLS é quem restringe as linhas; sem o grant o Postgres
-- nega tudo. anon não recebe acesso a tabelas (só à RPC pública do convite).
grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant usage on all sequences in schema public to authenticated, service_role;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant all on tables to service_role;

-- As policies avaliam private.is_member/is_admin com o papel do usuário da
-- requisição: ele precisa de USAGE no schema e EXECUTE nas funções.
-- O schema private não é exposto pela API (PostgREST serve apenas "public").
grant usage on schema private to authenticated;
grant execute on all functions in schema private to authenticated;
alter default privileges in schema private
  grant execute on functions to authenticated;

grant execute on function public.create_invitation(uuid, text, public.member_role) to authenticated;
grant execute on function public.accept_invitation(text) to authenticated;
grant execute on function public.revoke_invitation(uuid) to authenticated;
grant execute on function public.change_member_role(uuid, public.member_role) to authenticated;
grant execute on function public.set_member_active(uuid, boolean) to authenticated;
grant execute on function public.get_invitation_public(text) to anon, authenticated;
