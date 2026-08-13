-- =============================================================================
-- Fase 5 — Dashboard: funções agregadas executadas no banco.
--
-- Todas são `security invoker`: rodam sob a RLS do usuário, então um workspace
-- nunca soma dados de outro, mesmo que o parâmetro seja adulterado. Nenhuma
-- agregação acontece no navegador.
--
-- Convenções de data de referência (documentadas na UI em cada indicador):
--   novos leads .......... leads.created_at
--   engajados ............ leads.engaged_at
--   sessões agendadas .... appointments.created_at
--   sessões realizadas ... appointments.starts_at (sessão que ocorreu)
--   vendas e receita ..... opportunities.closed_at (status = 'won')
-- =============================================================================

-- Índices de apoio às agregações por período.
create index if not exists leads_engaged_idx
  on public.leads (workspace_id, engaged_at)
  where engaged_at is not null and deleted_at is null;

create index if not exists appointments_status_time_idx
  on public.appointments (workspace_id, status, starts_at)
  where deleted_at is null;

create index if not exists opportunities_won_idx
  on public.opportunities (workspace_id, closed_at)
  where status = 'won' and deleted_at is null;

-- -----------------------------------------------------------------------------
-- Resumo: cards principais e métricas derivadas
-- -----------------------------------------------------------------------------

create or replace function public.dashboard_summary(
  p_workspace_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_pipeline_id uuid default null,
  p_product_id uuid default null,
  p_owner_id uuid default null,
  p_channel public.lead_channel default null
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
with
-- Coorte de leads criados no período (base das taxas de conversão).
cohort as (
  select l.*
  from public.leads l
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.created_at >= p_from
    and l.created_at < p_to
    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
    and (
      p_product_id is null
      or exists (
        select 1 from public.lead_product_interests i
        where i.lead_id = l.id and i.product_id = p_product_id
      )
    )
),
-- Leads que engajaram dentro do período (independe de quando entraram).
engaged as (
  select l.id
  from public.leads l
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.engaged_at >= p_from
    and l.engaged_at < p_to
    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
),
scheduled as (
  select a.id, a.lead_id
  from public.appointments a
  join public.leads l on l.id = a.lead_id
  where a.workspace_id = p_workspace_id
    and a.deleted_at is null
    and a.created_at >= p_from
    and a.created_at < p_to
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
),
completed as (
  select a.id, a.lead_id
  from public.appointments a
  join public.leads l on l.id = a.lead_id
  where a.workspace_id = p_workspace_id
    and a.deleted_at is null
    and a.status = 'completed'
    and a.starts_at >= p_from
    and a.starts_at < p_to
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
),
won as (
  select o.id, o.lead_id, o.sold_value, o.closed_at
  from public.opportunities o
  join public.leads l on l.id = o.lead_id
  where o.workspace_id = p_workspace_id
    and o.deleted_at is null
    and o.status = 'won'
    and o.closed_at >= p_from
    and o.closed_at < p_to
    and (p_product_id is null or o.product_id = p_product_id)
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
),
-- Denominador da taxa sessão → venda: leads com sessão realizada no período.
completed_leads as (select distinct lead_id from completed),
completed_then_won as (
  select count(distinct c.lead_id) as total
  from completed_leads c
  where exists (
    select 1 from public.opportunities o
    where o.lead_id = c.lead_id
      and o.status = 'won'
      and o.deleted_at is null
  )
),
-- Leads engajados no período que chegaram a ter sessão realizada (qualquer data).
engaged_then_session as (
  select count(distinct e.id) as total
  from engaged e
  where exists (
    select 1 from public.appointments a
    where a.lead_id = e.id
      and a.status = 'completed'
      and a.deleted_at is null
  )
),
-- Leads da coorte que converteram (conversão geral por coorte de entrada).
cohort_won as (
  select count(distinct c.id) as total
  from cohort c
  where exists (
    select 1 from public.opportunities o
    where o.lead_id = c.id
      and o.status = 'won'
      and o.deleted_at is null
  )
),
-- Tempos medianos, robustos a casos extremos.
timings as (
  select
    percentile_cont(0.5) within group (
      order by extract(epoch from (l.engaged_at - l.created_at)) / 3600
    ) filter (where l.engaged_at is not null) as median_hours_to_engage,
    percentile_cont(0.5) within group (
      order by extract(epoch from (first_appt.created_at - l.created_at)) / 86400
    ) filter (where first_appt.created_at is not null) as median_days_to_schedule
  from cohort l
  left join lateral (
    select min(a.created_at) as created_at
    from public.appointments a
    where a.lead_id = l.id and a.deleted_at is null
  ) first_appt on true
),
overdue as (
  select count(*) as total
  from public.tasks t
  where t.workspace_id = p_workspace_id
    and t.deleted_at is null
    and t.completed_at is null
    and t.due_at < now()
),
in_follow_up as (
  select count(*) as total
  from public.leads l
  join public.pipeline_stages s on s.id = l.stage_id
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and s.stage_type in ('follow_up_pre_session', 'follow_up_post_session')
    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
)
select jsonb_build_object(
  'new_leads', (select count(*) from cohort),
  'engaged_leads', (select count(*) from engaged),
  'appointments_scheduled', (select count(*) from scheduled),
  'appointments_completed', (select count(*) from completed),
  'sales_count', (select count(*) from won),
  'revenue', coalesce((select sum(sold_value) from won), 0),
  'average_ticket', case
    when (select count(*) from won) > 0
      then coalesce((select sum(sold_value) from won), 0) / (select count(*) from won)
    else null
  end,
  'leads_in_follow_up', (select total from in_follow_up),
  'overdue_tasks', (select total from overdue),
  'no_shows', (
    select count(*) from public.appointments a
    where a.workspace_id = p_workspace_id and a.deleted_at is null
      and a.status = 'no_show' and a.starts_at >= p_from and a.starts_at < p_to
  ),
  'cancellations', (
    select count(*) from public.appointments a
    where a.workspace_id = p_workspace_id and a.deleted_at is null
      and a.status = 'cancelled' and a.starts_at >= p_from and a.starts_at < p_to
  ),
  -- Taxas: null quando o denominador é zero (a UI mostra "—", nunca 0%).
  'rate_lead_to_engaged', case
    when (select count(*) from cohort) > 0
      then round((select count(*) from engaged)::numeric
                 / (select count(*) from cohort), 4)
    else null
  end,
  'rate_engaged_to_session', case
    when (select count(*) from engaged) > 0
      then round((select total from engaged_then_session)::numeric
                 / (select count(*) from engaged), 4)
    else null
  end,
  'rate_session_to_sale', case
    when (select count(*) from completed_leads) > 0
      then round((select total from completed_then_won)::numeric
                 / (select count(*) from completed_leads), 4)
    else null
  end,
  'rate_overall', case
    when (select count(*) from cohort) > 0
      then round((select total from cohort_won)::numeric
                 / (select count(*) from cohort), 4)
    else null
  end,
  'median_hours_to_engage',
    (select round(median_hours_to_engage::numeric, 1) from timings),
  'median_days_to_schedule',
    (select round(median_days_to_schedule::numeric, 1) from timings)
);
$$;

-- -----------------------------------------------------------------------------
-- Funil: por stage_type, a partir do histórico (não da etapa atual)
-- -----------------------------------------------------------------------------

create or replace function public.dashboard_funnel(
  p_workspace_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_pipeline_id uuid default null,
  p_owner_id uuid default null,
  p_channel public.lead_channel default null
)
returns table (stage_type public.stage_type, leads_reached bigint)
language sql
stable
security invoker
set search_path = public
as $$
  -- Coorte: leads criados no período. Um lead conta uma única vez em cada
  -- estágio que ATINGIU, mesmo que tenha passado por ele várias vezes
  -- (reativação não duplica).
  with cohort as (
    select l.id
    from public.leads l
    where l.workspace_id = p_workspace_id
      and l.deleted_at is null
      and l.created_at >= p_from
      and l.created_at < p_to
      and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
      and (p_owner_id is null or l.owner_id = p_owner_id)
      and (p_channel is null or l.channel = p_channel)
  ),
  reached as (
    select distinct h.lead_id, h.to_stage_type as st
    from public.lead_stage_history h
    join cohort c on c.id = h.lead_id
    where h.workspace_id = p_workspace_id
  )
  select st as stage_type, count(distinct lead_id) as leads_reached
  from reached
  group by st;
$$;

-- -----------------------------------------------------------------------------
-- Série temporal: leads, sessões, vendas e receita por dia
-- -----------------------------------------------------------------------------

create or replace function public.dashboard_timeseries(
  p_workspace_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_pipeline_id uuid default null
)
returns table (
  day date,
  new_leads bigint,
  sessions_completed bigint,
  sales bigint,
  revenue numeric
)
language sql
stable
security invoker
set search_path = public
as $$
  with days as (
    select generate_series(p_from::date, (p_to - interval '1 day')::date, '1 day')::date as day
  )
  select
    d.day,
    coalesce(l.total, 0) as new_leads,
    coalesce(a.total, 0) as sessions_completed,
    coalesce(o.total, 0) as sales,
    coalesce(o.revenue, 0) as revenue
  from days d
  left join (
    select created_at::date as day, count(*) as total
    from public.leads
    where workspace_id = p_workspace_id and deleted_at is null
      and created_at >= p_from and created_at < p_to
      and (p_pipeline_id is null or pipeline_id = p_pipeline_id)
    group by 1
  ) l on l.day = d.day
  left join (
    select starts_at::date as day, count(*) as total
    from public.appointments
    where workspace_id = p_workspace_id and deleted_at is null
      and status = 'completed'
      and starts_at >= p_from and starts_at < p_to
    group by 1
  ) a on a.day = d.day
  left join (
    select closed_at::date as day, count(*) as total, sum(sold_value) as revenue
    from public.opportunities
    where workspace_id = p_workspace_id and deleted_at is null
      and status = 'won'
      and closed_at >= p_from and closed_at < p_to
    group by 1
  ) o on o.day = d.day
  order by d.day;
$$;

-- -----------------------------------------------------------------------------
-- Recortes: origem, produto, responsável e motivo de perda
-- -----------------------------------------------------------------------------

create or replace function public.dashboard_breakdowns(
  p_workspace_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_pipeline_id uuid default null
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
with cohort as (
  select l.*
  from public.leads l
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.created_at >= p_from
    and l.created_at < p_to
    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
),
by_channel as (
  select
    c.channel::text as key,
    count(*) as leads,
    count(*) filter (
      where exists (
        select 1 from public.opportunities o
        where o.lead_id = c.id and o.status = 'won' and o.deleted_at is null
      )
    ) as conversions
  from cohort c
  group by c.channel
),
-- Receita por produto usa as oportunidades ganhas do período (não a coorte),
-- porque a venda pode fechar depois da janela em que o lead entrou.
by_product as (
  select
    p.name as key,
    count(o.id) as sales,
    coalesce(sum(o.sold_value), 0) as revenue
  from public.opportunities o
  join public.products p on p.id = o.product_id
  where o.workspace_id = p_workspace_id
    and o.deleted_at is null
    and o.status = 'won'
    and o.closed_at >= p_from
    and o.closed_at < p_to
  group by p.name
),
by_owner as (
  select
    coalesce(pr.full_name, 'Sem responsável') as key,
    count(distinct c.id) as leads,
    count(distinct o.id) as sales
  from cohort c
  left join public.profiles pr on pr.id = c.owner_id
  left join public.opportunities o
    on o.lead_id = c.id and o.status = 'won' and o.deleted_at is null
  group by 1
),
by_lost_reason as (
  select coalesce(r.label, 'Sem motivo informado') as key, count(*) as total
  from public.leads l
  left join public.lost_reasons r on r.id = l.lost_reason_id
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.lost_at >= p_from
    and l.lost_at < p_to
  group by 1
)
select jsonb_build_object(
  'by_channel', coalesce((select jsonb_agg(to_jsonb(b) order by b.leads desc) from by_channel b), '[]'::jsonb),
  'by_product', coalesce((select jsonb_agg(to_jsonb(b) order by b.revenue desc) from by_product b), '[]'::jsonb),
  'by_owner', coalesce((select jsonb_agg(to_jsonb(b) order by b.leads desc) from by_owner b), '[]'::jsonb),
  'by_lost_reason', coalesce((select jsonb_agg(to_jsonb(b) order by b.total desc) from by_lost_reason b), '[]'::jsonb)
);
$$;

grant execute on function public.dashboard_summary(
  uuid, timestamptz, timestamptz, uuid, uuid, uuid, public.lead_channel
) to authenticated;
grant execute on function public.dashboard_funnel(
  uuid, timestamptz, timestamptz, uuid, uuid, public.lead_channel
) to authenticated;
grant execute on function public.dashboard_timeseries(
  uuid, timestamptz, timestamptz, uuid
) to authenticated;
grant execute on function public.dashboard_breakdowns(
  uuid, timestamptz, timestamptz, uuid
) to authenticated;
