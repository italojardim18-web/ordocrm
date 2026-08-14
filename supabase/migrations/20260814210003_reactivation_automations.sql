-- Automação de Reativação de Leads Perdidos
alter table public.workspaces
  add column if not exists reactivation_enabled boolean not null default false,
  add column if not exists reactivation_days integer not null default 30,
  add column if not exists reactivation_template text not null default 'Olá [Nome], tudo bem? Como você tem passado desde nosso último contato? Lembrei de você hoje e queria saber se podemos retomar seu acompanhamento ou se ficou alguma dúvida.',
  add column if not exists reactivation_channel_connection_id uuid references public.channel_connections(id);

alter table public.leads
  add column if not exists reactivated_at timestamp with time zone,
  add column if not exists reactivation_status text default 'none';
