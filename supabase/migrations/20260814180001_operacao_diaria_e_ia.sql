-- =============================================================================
-- Operação diária, temperatura do lead e apoio de IA
--
-- O dashboard existente é retrospectivo: bom para revisar o mês, inútil para
-- começar a terça-feira. Esta migration cria o que falta para a pergunta
-- "o que eu preciso fazer agora":
--
--   1. follow_up_at ......... a data de retorno mora no lead, não só na tarefa
--   2. last_interaction_at .. desnormalizado, para medir esfriamento sem varrer
--                             a tabela de mensagens a cada render
--   3. temperatura .......... override manual; o cálculo vive na aplicação
--   4. transcrição .......... texto do áudio junto da mensagem
--   5. resumo comercial ..... os quatro campos que orientam a retomada
--
-- Nada aqui liga IA sozinho: as colunas nascem vazias e só são preenchidas
-- quando houver chave configurada no servidor.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Follow-up como campo do lead
-- -----------------------------------------------------------------------------

-- Tarefa com vencimento já existia, mas dependia de alguém lembrar de criá-la.
-- O compromisso de retorno é do lead, e é o que o painel do dia lê primeiro.
alter table public.leads
  add column if not exists follow_up_at timestamptz,
  add column if not exists follow_up_note text;

comment on column public.leads.follow_up_at is
  'Quando este lead precisa ser retomado. Alimenta o painel do dia.';

create index if not exists leads_follow_up_idx
  on public.leads (workspace_id, follow_up_at)
  where follow_up_at is not null and deleted_at is null and archived_at is null;

-- -----------------------------------------------------------------------------
-- 2. Última interação real com o lead
-- -----------------------------------------------------------------------------

alter table public.leads
  add column if not exists last_interaction_at timestamptz;

comment on column public.leads.last_interaction_at is
  'Última conversa/ligação com o lead. Mudança de etapa não conta: é ação '
  'nossa, não sinal dele.';

create index if not exists leads_last_interaction_idx
  on public.leads (workspace_id, last_interaction_at)
  where deleted_at is null and archived_at is null;

-- Mantido por trigger em vez de calculado na leitura: a temperatura é lida no
-- Kanban inteiro a cada abertura, e varrer mensagens ali sairia caro.
create or replace function private.tocar_ultima_interacao()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Só conversa conta. 'stage_change', 'task', 'note' e 'system' são
  -- movimento interno e não dizem nada sobre o interesse do lead.
  if new.type in ('call', 'message') then
    update public.leads
    set last_interaction_at = greatest(
      coalesce(last_interaction_at, '-infinity'::timestamptz),
      new.created_at
    )
    where id = new.lead_id;
  end if;
  return new;
end;
$$;

drop trigger if exists activities_tocam_ultima_interacao on public.activities;
create trigger activities_tocam_ultima_interacao
  after insert on public.activities
  for each row execute function private.tocar_ultima_interacao();

-- Backfill: sem isto, todo lead existente nasceria "frio" no primeiro deploy.
update public.leads l
set last_interaction_at = sub.ultima
from (
  select a.lead_id, max(a.created_at) as ultima
  from public.activities a
  where a.type in ('call', 'message')
  group by a.lead_id
) sub
where sub.lead_id = l.id
  and l.last_interaction_at is distinct from sub.ultima;

-- -----------------------------------------------------------------------------
-- 3. Temperatura do lead
--
-- O score é calculado na aplicação (`src/lib/crm/temperature.ts`), não aqui.
-- Motivo: depende de `now()` — não cabe em coluna gerada — e a fórmula precisa
-- ser testável e explicável na interface. O banco guarda apenas a decisão
-- humana de discordar do cálculo.
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_temperature') then
    create type public.lead_temperature as enum ('hot', 'warm', 'cold');
  end if;
end
$$;

alter table public.leads
  add column if not exists temperature_override public.lead_temperature,
  add column if not exists temperature_override_at timestamptz;

comment on column public.leads.temperature_override is
  'Preenchido só quando alguém discorda do cálculo. Nulo = vale o automático.';

-- -----------------------------------------------------------------------------
-- 4. Transcrição de áudio
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'transcript_status') then
    create type public.transcript_status as enum (
      'pending',    -- áudio recebido, ainda não transcrito
      'done',
      'failed',     -- tentou e não conseguiu (o erro fica em transcript_error)
      'skipped'     -- sem chave configurada, ou tipo não suportado
    );
  end if;
end
$$;

alter table public.messages
  add column if not exists transcript text,
  add column if not exists transcript_status public.transcript_status,
  add column if not exists transcript_error text,
  add column if not exists transcribed_at timestamptz;

comment on column public.messages.transcript is
  'Texto do áudio. Fica junto da mensagem para a busca achar o que foi dito.';

-- Fila de transcrição: só áudio, só o que ainda não foi resolvido.
create index if not exists messages_transcricao_pendente_idx
  on public.messages (workspace_id, sent_at)
  where media_mime like 'audio/%' and transcript_status is null;

-- -----------------------------------------------------------------------------
-- 5. Resumo comercial
--
-- Quatro campos em vez de um texto corrido: são as quatro perguntas que a
-- pessoa responde ao reabrir uma conversa parada há uma semana. `notes_summary`
-- já existia sem uso desde a Fase 2 e vira o resumo em prosa.
-- -----------------------------------------------------------------------------

alter table public.leads
  add column if not exists summary_need text,
  add column if not exists summary_moment text,
  add column if not exists summary_preference text,
  add column if not exists summary_open_point text,
  add column if not exists summary_generated_at timestamptz,
  add column if not exists summary_model text,
  add column if not exists summary_source_count integer;

comment on column public.leads.notes_summary is
  'Resumo comercial em prosa, gerado por IA. Vazio enquanto não houver chave.';
comment on column public.leads.summary_source_count is
  'Quantas mensagens/notas entraram no resumo — mostra o quanto ele é confiável.';

-- -----------------------------------------------------------------------------
-- 6. Resultado comercial: oportunidades fechadas no período
--
-- O dashboard já dá os totais. O que faltava era a lista por trás do número:
-- qual venda, de qual produto, por quanto, e por que as perdidas se perderam.
-- `security invoker` como as demais — a RLS do usuário é quem filtra.
-- -----------------------------------------------------------------------------

create or replace function public.commercial_outcomes(
  p_workspace_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_status public.opportunity_status default null,
  p_product_id uuid default null,
  p_owner_id uuid default null
)
returns table (
  opportunity_id uuid,
  lead_id uuid,
  lead_name text,
  product_id uuid,
  product_name text,
  status public.opportunity_status,
  potential_value numeric,
  sold_value numeric,
  payment_method text,
  closed_at timestamptz,
  owner_id uuid,
  channel public.lead_channel,
  lost_reason text
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    o.id,
    l.id,
    l.name,
    o.product_id,
    p.name,
    o.status,
    o.potential_value,
    o.sold_value,
    o.payment_method,
    o.closed_at,
    l.owner_id,
    l.channel,
    r.label
  from public.opportunities o
  join public.leads l on l.id = o.lead_id
  left join public.products p on p.id = o.product_id
  left join public.lost_reasons r on r.id = l.lost_reason_id
  where o.workspace_id = p_workspace_id
    and o.deleted_at is null
    and l.deleted_at is null
    and o.status <> 'open'
    and o.closed_at >= p_from
    and o.closed_at < p_to
    and (p_status is null or o.status = p_status)
    and (p_product_id is null or o.product_id = p_product_id)
    and (p_owner_id is null or l.owner_id = p_owner_id)
  order by o.closed_at desc
  limit 500;
$$;

grant execute on function public.commercial_outcomes(
  uuid, timestamptz, timestamptz, public.opportunity_status, uuid, uuid
) to authenticated;
