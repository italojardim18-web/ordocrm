-- Adiciona suporte a cores customizadas nas tags
alter table public.tags
  add column if not exists color text not null default '#521D2A';
