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

-- =============================================================================
-- Fase 2 — pipeline padrão, produtos placeholder, motivos de perda e leads demo
-- =============================================================================

-- Pipelines e etapas (UUIDs fixos para referência nos leads)
insert into public.pipelines (id, workspace_id, name, is_default) values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Esteira comercial', true),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Esteira comercial', true);

insert into public.pipeline_stages (id, workspace_id, pipeline_id, name, stage_type, position) values
  ('c0000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Novo lead', 'new', 1000),
  ('c0000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Qualificação', 'qualification', 2000),
  ('c0000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Follow-up pré-sessão', 'follow_up_pre_session', 3000),
  ('c0000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Sessão de alinhamento', 'alignment_session', 4000),
  ('c0000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Follow-up pós-sessão', 'follow_up_post_session', 5000),
  ('c0000000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Venda realizada', 'won', 6000),
  ('c0000000-0000-4000-8000-000000000007', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Perdido', 'lost', 7000),
  ('d0000000-0000-4000-8000-000000000001', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Novo lead', 'new', 1000),
  ('d0000000-0000-4000-8000-000000000007', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Perdido', 'lost', 7000);

-- Produtos placeholder (SUBSTITUIR pelos produtos reais — decisão pendente nº 3)
insert into public.products (id, workspace_id, name, category, description, default_price, is_active) values
  ('11110000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '[Placeholder] Pacote terapêutico', 'terapia', 'Produto de demonstração — substituir pelo real.', 2400.00, true),
  ('11110000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '[Placeholder] Supervisão individual', 'supervisao', 'Produto de demonstração — substituir pelo real.', 1800.00, true),
  ('11110000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '[Placeholder] Supervisão em grupo', 'supervisao', 'Produto de demonstração — substituir pelo real.', 900.00, true),
  ('11110000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '[Placeholder] Avaliação neuropsicológica', 'terapia', 'Produto de demonstração — substituir pelo real.', 1500.00, true),
  ('11110000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '[Placeholder] Mentoria/outros', 'outro', 'Produto de demonstração — substituir pelo real.', null, true);

-- Motivos de perda iniciais
insert into public.lost_reasons (id, workspace_id, label, position) values
  ('22220000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Parou de responder', 1),
  ('22220000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Sem condições financeiras no momento', 2),
  ('22220000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Escolheu outro profissional', 3),
  ('22220000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Não era o serviço procurado', 4),
  ('22220000-0000-4000-8000-000000000011', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Parou de responder', 1);

-- Leads demo (nomes sintéticos) distribuídos pela esteira
insert into public.leads
  (id, workspace_id, pipeline_id, stage_id, position, name, phone, email, city, state,
   channel, source_detail, utm_source, utm_medium, utm_campaign,
   owner_id, potential_value, first_contact_at, engaged_at,
   lost_reason_id, lost_at, created_by, created_at) values
  -- Novo lead
  ('33330000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000001', 1000,
   'Mariana Teste Souza', '(67) 99911-0001', null, 'Campo Grande', 'MS',
   'whatsapp', 'WhatsApp — mensagem espontânea', null, null, null,
   '22222222-2222-4222-8222-222222222222', null, null, null, null, null,
   '11111111-1111-4111-8111-111111111111', now() - interval '1 day'),
  ('33330000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000001', 2000,
   'Pedro Teste Almeida', null, 'pedro.teste@example.com', null, null,
   'form', 'Formulário do site', 'google', 'cpc', 'campanha-terapia',
   null, null, null, null, null, null,
   '11111111-1111-4111-8111-111111111111', now() - interval '3 hours'),
  ('33330000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000001', 3000,
   'Carla Teste Nunes', '(67) 99911-0003', null, null, null,
   'instagram', 'Direct do Instagram', null, null, null,
   '22222222-2222-4222-8222-222222222222', null, null, null, null, null,
   '22222222-2222-4222-8222-222222222222', now() - interval '5 days'),
  -- Qualificação
  ('33330000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000002', 1000,
   'Rafael Teste Lima', '(67) 99911-0004', 'rafael.teste@example.com', 'Dourados', 'MS',
   'paid_traffic', 'Meta Ads', 'facebook', 'paid', 'trafego-supervisao',
   '22222222-2222-4222-8222-222222222222', 1800.00, now() - interval '4 days', now() - interval '3 days', null, null,
   '11111111-1111-4111-8111-111111111111', now() - interval '4 days'),
  ('33330000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000002', 2000,
   'Juliana Teste Prado', '(67) 99911-0005', null, 'Campo Grande', 'MS',
   'whatsapp', null, null, null, null,
   '11111111-1111-4111-8111-111111111111', 2400.00, now() - interval '2 days', now() - interval '1 day', null, null,
   '22222222-2222-4222-8222-222222222222', now() - interval '2 days'),
  -- Follow-up pré-sessão
  ('33330000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000003', 1000,
   'Bruno Teste Costa', '(67) 99911-0006', null, null, null,
   'instagram', null, null, null, null,
   '22222222-2222-4222-8222-222222222222', 900.00, now() - interval '8 days', now() - interval '7 days', null, null,
   '22222222-2222-4222-8222-222222222222', now() - interval '8 days'),
  ('33330000-0000-4000-8000-000000000007', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000003', 2000,
   'Fernanda Teste Dias', '(67) 99911-0007', 'fernanda.teste@example.com', 'Três Lagoas', 'MS',
   'form', null, 'instagram', 'bio', 'link-bio',
   '11111111-1111-4111-8111-111111111111', 2400.00, now() - interval '6 days', now() - interval '5 days', null, null,
   '11111111-1111-4111-8111-111111111111', now() - interval '6 days'),
  -- Sessão de alinhamento
  ('33330000-0000-4000-8000-000000000008', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000004', 1000,
   'Lucas Teste Ferreira', '(67) 99911-0008', null, 'Campo Grande', 'MS',
   'whatsapp', null, null, null, null,
   '11111111-1111-4111-8111-111111111111', 2400.00, now() - interval '10 days', now() - interval '9 days', null, null,
   '22222222-2222-4222-8222-222222222222', now() - interval '10 days'),
  ('33330000-0000-4000-8000-000000000009', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000004', 2000,
   'Aline Teste Rocha', '(67) 99911-0009', 'aline.teste@example.com', null, null,
   'paid_traffic', 'Meta Ads', 'instagram', 'paid', 'trafego-terapia',
   '22222222-2222-4222-8222-222222222222', 1500.00, now() - interval '7 days', now() - interval '6 days', null, null,
   '11111111-1111-4111-8111-111111111111', now() - interval '7 days'),
  -- Follow-up pós-sessão
  ('33330000-0000-4000-8000-000000000010', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000005', 1000,
   'Gustavo Teste Melo', '(67) 99911-0010', null, 'Campo Grande', 'MS',
   'whatsapp', null, null, null, null,
   '11111111-1111-4111-8111-111111111111', 2400.00, now() - interval '14 days', now() - interval '13 days', null, null,
   '11111111-1111-4111-8111-111111111111', now() - interval '14 days'),
  -- Venda realizada
  ('33330000-0000-4000-8000-000000000011', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000006', 1000,
   'Patrícia Teste Gomes', '(67) 99911-0011', 'patricia.teste@example.com', 'Campo Grande', 'MS',
   'instagram', null, null, null, null,
   '11111111-1111-4111-8111-111111111111', 2400.00, now() - interval '20 days', now() - interval '19 days', null, null,
   '22222222-2222-4222-8222-222222222222', now() - interval '20 days'),
  ('33330000-0000-4000-8000-000000000012', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000006', 2000,
   'Roberto Teste Vieira', '(67) 99911-0012', null, 'Dourados', 'MS',
   'form', null, 'google', 'organic', null,
   '22222222-2222-4222-8222-222222222222', 1800.00, now() - interval '25 days', now() - interval '24 days', null, null,
   '11111111-1111-4111-8111-111111111111', now() - interval '25 days'),
  -- Perdido
  ('33330000-0000-4000-8000-000000000013', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000007', 1000,
   'Sandra Teste Pires', '(67) 99911-0013', null, null, null,
   'whatsapp', null, null, null, null,
   '22222222-2222-4222-8222-222222222222', 1500.00, now() - interval '15 days', now() - interval '14 days',
   '22220000-0000-4000-8000-000000000001', now() - interval '9 days',
   '22222222-2222-4222-8222-222222222222', now() - interval '15 days'),
  ('33330000-0000-4000-8000-000000000014', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'c0000000-0000-4000-8000-000000000007', 2000,
   'Diego Teste Martins', null, 'diego.teste@example.com', null, null,
   'paid_traffic', 'Meta Ads', 'facebook', 'paid', 'trafego-terapia',
   null, null, now() - interval '12 days', null,
   '22220000-0000-4000-8000-000000000002', now() - interval '10 days',
   '11111111-1111-4111-8111-111111111111', now() - interval '12 days'),
  -- Workspace B (isolamento)
  ('33330000-0000-4000-8000-000000000015', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'd0000000-0000-4000-8000-000000000001', 1000,
   'Cliente Outra Empresa', '(11) 98888-0001', null, 'São Paulo', 'SP',
   'manual', null, null, null, null,
   '33333333-3333-4333-8333-333333333333', null, null, null, null, null,
   '33333333-3333-4333-8333-333333333333', now() - interval '1 day');

-- Interesses em produtos
insert into public.lead_product_interests (workspace_id, lead_id, product_id) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000004', '11110000-0000-4000-8000-000000000002'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000005', '11110000-0000-4000-8000-000000000001'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000006', '11110000-0000-4000-8000-000000000003'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000007', '11110000-0000-4000-8000-000000000001'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000008', '11110000-0000-4000-8000-000000000001'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000009', '11110000-0000-4000-8000-000000000004'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000010', '11110000-0000-4000-8000-000000000001'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000011', '11110000-0000-4000-8000-000000000001'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000012', '11110000-0000-4000-8000-000000000002');

-- Histórico de etapas (funil): entrada em "new" + transições até a etapa atual
insert into public.lead_stage_history
  (workspace_id, lead_id, from_stage_id, to_stage_id, from_stage_type, to_stage_type, actor_id, created_at)
select l.workspace_id, l.id, null, 'c0000000-0000-4000-8000-000000000001', null, 'new',
       l.created_by, l.created_at
from public.leads l
where l.workspace_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

insert into public.lead_stage_history
  (workspace_id, lead_id, from_stage_id, to_stage_id, from_stage_type, to_stage_type, actor_id, created_at) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '22222222-2222-4222-8222-222222222222', now() - interval '3 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '11111111-1111-4111-8111-111111111111', now() - interval '1 day'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '22222222-2222-4222-8222-222222222222', now() - interval '7 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'qualification', 'follow_up_pre_session', '22222222-2222-4222-8222-222222222222', now() - interval '6 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '11111111-1111-4111-8111-111111111111', now() - interval '5 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'qualification', 'follow_up_pre_session', '11111111-1111-4111-8111-111111111111', now() - interval '4 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '22222222-2222-4222-8222-222222222222', now() - interval '9 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000004', 'qualification', 'alignment_session', '11111111-1111-4111-8111-111111111111', now() - interval '8 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '11111111-1111-4111-8111-111111111111', now() - interval '6 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000004', 'qualification', 'alignment_session', '22222222-2222-4222-8222-222222222222', now() - interval '5 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000010', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '11111111-1111-4111-8111-111111111111', now() - interval '13 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000010', 'c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000004', 'qualification', 'alignment_session', '11111111-1111-4111-8111-111111111111', now() - interval '12 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000010', 'c0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000005', 'alignment_session', 'follow_up_post_session', '11111111-1111-4111-8111-111111111111', now() - interval '11 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000011', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '22222222-2222-4222-8222-222222222222', now() - interval '19 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000011', 'c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000004', 'qualification', 'alignment_session', '11111111-1111-4111-8111-111111111111', now() - interval '17 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000011', 'c0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000006', 'alignment_session', 'won', '11111111-1111-4111-8111-111111111111', now() - interval '15 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000012', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '11111111-1111-4111-8111-111111111111', now() - interval '24 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000012', 'c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000004', 'qualification', 'alignment_session', '22222222-2222-4222-8222-222222222222', now() - interval '22 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000012', 'c0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000006', 'alignment_session', 'won', '22222222-2222-4222-8222-222222222222', now() - interval '20 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000013', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'new', 'qualification', '22222222-2222-4222-8222-222222222222', now() - interval '14 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000013', 'c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000007', 'qualification', 'lost', '22222222-2222-4222-8222-222222222222', now() - interval '9 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000014', 'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000007', 'new', 'lost', '11111111-1111-4111-8111-111111111111', now() - interval '10 days');

-- Notas (inclui uma admin_only para testar visibilidade)
insert into public.notes (workspace_id, lead_id, author_id, body, visibility) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000004', '22222222-2222-4222-8222-222222222222', 'Respondeu rápido no WhatsApp, quer saber valores de supervisão.', 'team'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', 'Prefere atendimento no período da tarde.', 'team'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', 'Negociação sensível — tratar valores apenas comigo.', 'admin_only'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000008', '22222222-2222-4222-8222-222222222222', 'Sessão de alinhamento confirmada para a próxima semana.', 'team');

-- Tarefas (uma vencida para o indicador de follow-up)
insert into public.tasks (workspace_id, lead_id, title, due_at, assigned_to, created_by) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000006', 'Retomar contato — enviar horários disponíveis', now() - interval '2 days', '22222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000007', 'Follow-up: confirmar interesse na sessão', now() + interval '1 day', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000010', 'Enviar proposta do pacote terapêutico', now() + interval '2 days', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111');

-- =============================================================================
-- Fase 3 — agendamentos e oportunidades de demonstração
-- =============================================================================

insert into public.appointments
  (id, workspace_id, lead_id, title, starts_at, ends_at, status, created_by) values
  -- Sessão futura (etapa Sessão de alinhamento)
  ('44440000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000008',
   'Sessão de alinhamento', now() + interval '2 days', now() + interval '2 days' + interval '1 hour', 'scheduled',
   '11111111-1111-4111-8111-111111111111'),
  ('44440000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000009',
   'Sessão de alinhamento', now() + interval '4 days', now() + interval '4 days' + interval '1 hour', 'scheduled',
   '22222222-2222-4222-8222-222222222222'),
  -- Sessão realizada, aguardando decisão (follow-up pós-sessão)
  ('44440000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000010',
   'Sessão de alinhamento', now() - interval '11 days', now() - interval '11 days' + interval '1 hour', 'completed',
   '11111111-1111-4111-8111-111111111111'),
  -- Sessões que viraram venda
  ('44440000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000011',
   'Sessão de alinhamento', now() - interval '17 days', now() - interval '17 days' + interval '1 hour', 'completed',
   '11111111-1111-4111-8111-111111111111'),
  ('44440000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000012',
   'Sessão de alinhamento', now() - interval '22 days', now() - interval '22 days' + interval '1 hour', 'completed',
   '22222222-2222-4222-8222-222222222222'),
  -- Ausência (para a métrica de no-show)
  ('44440000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000013',
   'Sessão de alinhamento', now() - interval '12 days', now() - interval '12 days' + interval '1 hour', 'no_show',
   '22222222-2222-4222-8222-222222222222');

insert into public.opportunities
  (workspace_id, lead_id, product_id, status, potential_value, sold_value,
   payment_method, closed_at, lost_reason_id, owner_id, created_by, created_at) values
  -- Ganhas
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000011', '11110000-0000-4000-8000-000000000001',
   'won', 2400.00, 2400.00, 'Pix', now() - interval '15 days', null,
   '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', now() - interval '19 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000012', '11110000-0000-4000-8000-000000000002',
   'won', 1800.00, 1620.00, 'Cartão 3x', now() - interval '20 days', null,
   '22222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', now() - interval '24 days'),
  -- Abertas
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000010', '11110000-0000-4000-8000-000000000001',
   'open', 2400.00, null, null, null, null,
   '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', now() - interval '11 days'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000008', '11110000-0000-4000-8000-000000000001',
   'open', 2400.00, null, null, null, null,
   '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', now() - interval '9 days'),
  -- Perdida
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000013', '11110000-0000-4000-8000-000000000004',
   'lost', 1500.00, null, null, now() - interval '9 days', '22220000-0000-4000-8000-000000000001',
   '22222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', now() - interval '14 days');

-- =============================================================================
-- Fase 4 — formulário público de demonstração
-- =============================================================================

insert into public.form_endpoints
  (id, workspace_id, slug, name, headline, description, pipeline_id, product_id,
   owner_id, success_message) values
  ('55550000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
   'contato', 'Formulário de contato',
   'Vamos conversar?',
   'Preencha seus dados e retornamos pelo canal que você preferir.',
   'cccccccc-cccc-4ccc-8ccc-cccccccccccc', '11110000-0000-4000-8000-000000000001',
   '11111111-1111-4111-8111-111111111111',
   'Recebemos seu contato!');

-- Conversa de demonstração (WhatsApp) associada a um lead existente
insert into public.external_identities
  (workspace_id, lead_id, provider, external_id, display_name) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33330000-0000-4000-8000-000000000004',
   'whatsapp', '5567999110004', 'Rafael Teste Lima');

insert into public.conversations
  (id, workspace_id, lead_id, provider, external_conversation_id,
   last_inbound_at, last_message_at, last_message_preview, unread_count) values
  ('66660000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
   '33330000-0000-4000-8000-000000000004', 'whatsapp', '5567999110004',
   now() - interval '3 hours', now() - interval '2 hours',
   'Perfeito, qual o valor da supervisão em grupo?', 1);

insert into public.conversation_participants
  (workspace_id, conversation_id, external_id, display_name) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '66660000-0000-4000-8000-000000000001',
   '5567999110004', 'Rafael Teste Lima');

insert into public.messages
  (workspace_id, conversation_id, provider, external_message_id, direction,
   status, sender_external_id, body, sent_at) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '66660000-0000-4000-8000-000000000001',
   'whatsapp', 'wamid.demo001', 'inbound', 'delivered', '5567999110004',
   'Oi! Vi seu perfil e queria saber sobre supervisão.', now() - interval '4 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '66660000-0000-4000-8000-000000000001',
   'whatsapp', 'wamid.demo002', 'outbound', 'read', null,
   'Olá, Rafael! Claro. Trabalho com supervisão individual e em grupo.',
   now() - interval '3 hours 30 minutes'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '66660000-0000-4000-8000-000000000001',
   'whatsapp', 'wamid.demo003', 'inbound', 'delivered', '5567999110004',
   'Perfeito, qual o valor da supervisão em grupo?', now() - interval '2 hours');
