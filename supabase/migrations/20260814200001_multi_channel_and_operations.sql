-- =============================================================================
-- Suporte Multi-Canal (Múltiplos WhatsApps) & Visão da Operação / Lembretes
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Suporte a múltiplos canais de WhatsApp no mesmo workspace
-- -----------------------------------------------------------------------------

-- Remove a restrição de apenas 1 conexão por provedor no workspace
alter table public.channel_connections
  drop constraint if exists channel_connections_workspace_id_provider_key;

-- Adiciona apelido/identificador da linha (ex: "Dr. Ítalo", "Recepção / Secretária")
alter table public.channel_connections
  add column if not exists phone_number text,
  add column if not exists is_default boolean not null default false;

-- Vincula a conversa explicitamente à linha de WhatsApp pela qual ela transita
alter table public.conversations
  add column if not exists channel_connection_id uuid references public.channel_connections (id) on delete set null;

create index if not exists conversations_channel_conn_idx
  on public.conversations (workspace_id, channel_connection_id);

-- Vincula o lead à linha de WhatsApp de origem (se houver)
alter table public.leads
  add column if not exists channel_connection_id uuid references public.channel_connections (id) on delete set null;

create index if not exists leads_channel_conn_idx
  on public.leads (workspace_id, channel_connection_id);

-- -----------------------------------------------------------------------------
-- 2. Lembretes e autor de tarefas (Secretária ➔ Dr. Ítalo)
-- -----------------------------------------------------------------------------

alter table public.tasks
  add column if not exists created_by uuid references auth.users (id) on delete set null;

create index if not exists tasks_assigned_to_idx
  on public.tasks (workspace_id, assigned_to, completed_at)
  where completed_at is null and deleted_at is null;

-- -----------------------------------------------------------------------------
-- 3. Função RPC: Visão da Operação (Dashboard)
-- -----------------------------------------------------------------------------

create or replace function public.get_operational_overview(
  p_workspace_id uuid,
  p_channel_connection_id uuid default null
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_open_conversations integer;
  v_tasks_today integer;
  v_appointments_week integer;
  v_attention_proposals integer;
  v_attention_no_next_step integer;
  v_attention_upcoming_sessions integer;
  v_pipeline_dist jsonb;
  v_now timestamptz := now();
  v_today_start timestamptz := date_trunc('day', now());
  v_today_end timestamptz := date_trunc('day', now()) + interval '1 day';
  v_week_start timestamptz := date_trunc('week', now());
  v_week_end timestamptz := date_trunc('week', now()) + interval '7 days';
begin
  -- 1. Conversas abertas (que tiveram mensagem recente e estão ativas)
  select count(distinct c.id) into v_open_conversations
  from public.conversations c
  join public.leads l on l.id = c.lead_id
  where c.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.archived_at is null
    and (p_channel_connection_id is null or c.channel_connection_id = p_channel_connection_id);

  -- 2. Tarefas e retornos para hoje
  select count(distinct id) into v_tasks_today
  from (
    select t.id
    from public.tasks t
    where t.workspace_id = p_workspace_id
      and t.completed_at is null
      and t.deleted_at is null
      and t.due_at >= v_today_start
      and t.due_at < v_today_end
    union
    select l.id
    from public.leads l
    where l.workspace_id = p_workspace_id
      and l.deleted_at is null
      and l.archived_at is null
      and l.follow_up_at >= v_today_start
      and l.follow_up_at < v_today_end
      and (p_channel_connection_id is null or l.channel_connection_id = p_channel_connection_id)
  ) sub;

  -- 3. Agendamentos da semana
  select count(*) into v_appointments_week
  from public.appointments a
  where a.workspace_id = p_workspace_id
    and a.deleted_at is null
    and a.status = 'scheduled'
    and a.starts_at >= v_week_start
    and a.starts_at < v_week_end;

  -- 4. Atenção: Propostas/Follow-ups aguardando retorno há mais de 48h
  select count(*) into v_attention_proposals
  from public.leads l
  join public.pipeline_stages s on s.id = l.stage_id
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.archived_at is null
    and s.stage_type in ('follow_up_pre_session', 'follow_up_post_session', 'qualification')
    and (l.last_interaction_at is null or l.last_interaction_at < v_now - interval '48 hours')
    and (p_channel_connection_id is null or l.channel_connection_id = p_channel_connection_id);

  -- 5. Atenção: Conversas/Leads ativos sem nenhum próximo passo (sem follow-up e sem tarefa)
  select count(*) into v_attention_no_next_step
  from public.leads l
  join public.pipeline_stages s on s.id = l.stage_id
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.archived_at is null
    and s.stage_type not in ('won', 'lost')
    and l.follow_up_at is null
    and not exists (
      select 1 from public.tasks t
      where t.lead_id = l.id
        and t.completed_at is null
        and t.deleted_at is null
    )
    and (p_channel_connection_id is null or l.channel_connection_id = p_channel_connection_id);

  -- 6. Atenção: Sessões da semana
  select count(*) into v_attention_upcoming_sessions
  from public.appointments a
  where a.workspace_id = p_workspace_id
    and a.deleted_at is null
    and a.status = 'scheduled'
    and a.starts_at >= v_now
    and a.starts_at < v_week_end;

  -- 7. Distribuição do pipeline por etapa
  select jsonb_agg(stage_data order by (stage_data->>'position')::integer) into v_pipeline_dist
  from (
    select jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'stage_type', s.stage_type,
      'position', s.position,
      'lead_count', count(l.id) filter (where l.deleted_at is null and l.archived_at is null and (p_channel_connection_id is null or l.channel_connection_id = p_channel_connection_id))
    ) as stage_data
    from public.pipeline_stages s
    left join public.leads l on l.stage_id = s.id
    where s.workspace_id = p_workspace_id
      and s.archived_at is null
    group by s.id, s.name, s.stage_type, s.position
  ) st;

  return jsonb_build_object(
    'open_conversations', coalesce(v_open_conversations, 0),
    'tasks_today', coalesce(v_tasks_today, 0),
    'appointments_week', coalesce(v_appointments_week, 0),
    'attention_proposals', coalesce(v_attention_proposals, 0),
    'attention_no_next_step', coalesce(v_attention_no_next_step, 0),
    'attention_upcoming_sessions', coalesce(v_attention_upcoming_sessions, 0),
    'pipeline_distribution', coalesce(v_pipeline_dist, '[]'::jsonb)
  );
end;
$$;

grant execute on function public.get_operational_overview(uuid, uuid) to authenticated;
