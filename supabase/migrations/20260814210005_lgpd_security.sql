-- Segurança & LGPD: Auditoria, Consentimento e Anonimização
alter type public.audit_action add value if not exists 'lgpd_data_exported';
alter type public.audit_action add value if not exists 'lgpd_lead_anonymized';
alter type public.audit_action add value if not exists 'lgpd_consent_updated';
alter type public.audit_action add value if not exists 'lgpd_privacy_terms_updated';

alter table public.leads
  add column if not exists consent_status text default 'granted',
  add column if not exists consent_purpose text default 'atendimento_clinico',
  add column if not exists consent_at timestamp with time zone default now(),
  add column if not exists anonymized_at timestamp with time zone,
  add column if not exists is_anonymized boolean not null default false;

alter table public.workspaces
  add column if not exists dpo_name text default 'Dr. Ítalo Jardim',
  add column if not exists dpo_email text default 'contato@italojardim.com.br',
  add column if not exists dpo_phone text,
  add column if not exists privacy_policy_text text,
  add column if not exists data_retention_days integer default 1825;
