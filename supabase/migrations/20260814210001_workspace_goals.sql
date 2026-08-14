-- Adiciona metas financeiras e de clientes configuráveis pelo usuário no workspace
alter table public.workspaces
  add column if not exists monthly_revenue_goal numeric not null default 30000,
  add column if not exists monthly_clients_goal integer not null default 15;
