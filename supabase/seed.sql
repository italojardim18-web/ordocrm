-- =============================================================================
-- Seed de DESENVOLVIMENTO — nunca executar em produção.
-- Cria dois workspaces (para testar isolamento) e três usuários sintéticos:
--   admin@praxis.dev      / praxis123!  → admin do workspace "Ítalo Jardim"
--   assistente@praxis.dev / praxis123!  → assistente do workspace "Ítalo Jardim"
--   admin@outra.dev       / praxis123!  → admin do workspace "Outra Empresa"
-- =============================================================================

-- Usuários no Supabase Auth (padrão do stack local; senha via crypt/bcrypt)
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token, email_change_token_new, email_change)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111111',
   'authenticated', 'authenticated', 'admin@praxis.dev',
   extensions.crypt('praxis123!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Ítalo Jardim"}',
   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-4222-8222-222222222222',
   'authenticated', 'authenticated', 'assistente@praxis.dev',
   extensions.crypt('praxis123!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Assistente Praxis"}',
   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-4333-8333-333333333333',
   'authenticated', 'authenticated', 'admin@outra.dev',
   extensions.crypt('praxis123!', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Admin Outra Empresa"}',
   now(), now(), '', '', '', '');

insert into auth.identities
  (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select
  gen_random_uuid(), u.id::text, u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email', now(), now(), now()
from auth.users u
where u.email in ('admin@praxis.dev', 'assistente@praxis.dev', 'admin@outra.dev');

-- Workspaces
insert into public.workspaces (id, name, timezone) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Ítalo Jardim', 'America/Campo_Grande'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Outra Empresa (teste de isolamento)', 'America/Sao_Paulo');

insert into public.workspace_branding (workspace_id, display_name) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Ítalo Jardim · Psicólogo'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Outra Empresa');

-- Vínculos e papéis
insert into public.workspace_members (workspace_id, user_id, role) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'admin'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222', 'assistant'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '33333333-3333-4333-8333-333333333333', 'admin');
