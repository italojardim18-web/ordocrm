-- Automação de Mensagens por Mudança de Etapa (Triggers) no Funil
alter table public.pipeline_stages
  add column if not exists automation_message_enabled boolean not null default false,
  add column if not exists automation_message_template text,
  add column if not exists automation_reminder_24h boolean not null default false,
  add column if not exists automation_reminder_template text;
