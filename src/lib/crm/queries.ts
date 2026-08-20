import { createClient } from "@/lib/supabase/server";
import type {
  ActivityRow,
  AppointmentRow,
  ChannelConnectionItem,
  CommercialOutcomeRow,
  HistoryRow,
  LeadCard,
  LeadDetail,
  LostReason,
  Member,
  Note,
  OperationalOverview,
  OpportunityRow,
  Product,
  Stage,
  TagItem,
  TaskRow,
} from "./types";

export async function getDefaultPipeline(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pipelines")
    .select("id, name")
    .eq("workspace_id", workspaceId)
    .is("archived_at", null)
    .order("is_default", { ascending: false })
    .order("position", { ascending: true })
    .limit(1);
  return data?.[0] ?? null;
}

export async function getStages(pipelineId: string): Promise<Stage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pipeline_stages")
    .select("id, name, stage_type, position, archived_at")
    .eq("pipeline_id", pipelineId)
    .is("archived_at", null)
    .order("position", { ascending: true })
    .returns<Stage[]>();
  return data ?? [];
}

/**
 * Leads do pipeline (Kanban e lista usam esta mesma consulta).
 * Limite alto o suficiente para a operação atual; paginação server-side
 * completa entra quando o volume justificar (registrado em decisões).
 */
export async function getBoardLeads(
  pipelineId: string,
  channelConnectionId?: string | null,
): Promise<LeadCard[]> {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(
      `id, name, stage_id, position, channel, phone, email, potential_value,
       owner_id, engaged_at, created_at,
       follow_up_at, follow_up_note, last_interaction_at,
       temperature_override, temperature_override_at,
       channel_connection_id,
       lead_product_interests (product_id),
       tasks (id, due_at, completed_at),
       lead_tags (tags (id, name, color))`,
    )
    .eq("pipeline_id", pipelineId)
    .is("deleted_at", null)
    .is("archived_at", null);

  if (channelConnectionId) {
    query = query.eq("channel_connection_id", channelConnectionId);
  }

  const { data } = await query
    .order("position", { ascending: true })
    .limit(500);

  return (data ?? []).map((row: any) => ({
    ...row,
    tags: (row.lead_tags ?? [])
      .map((lt: any) => lt.tags)
      .filter(Boolean) as TagItem[],
  })) as LeadCard[];
}

export async function getProducts(
  workspaceId: string,
  onlyActive = false,
): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("id, name, category, description, default_price, is_active")
    .eq("workspace_id", workspaceId)
    .order("name", { ascending: true });
  if (onlyActive) query = query.eq("is_active", true);
  const { data } = await query.returns<Product[]>();
  return data ?? [];
}

export async function getLostReasons(
  workspaceId: string,
): Promise<LostReason[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lost_reasons")
    .select("id, label, is_active")
    .eq("workspace_id", workspaceId)
    .eq("is_active", true)
    .order("position", { ascending: true })
    .returns<LostReason[]>();

  if (data && data.length > 0) {
    return data;
  }

  // Se não houver motivos cadastrados no workspace, inicializa automaticamente
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const defaultReasons = [
      { label: "Preço / Condições de pagamento", position: 1000 },
      { label: "Optou por concorrente / outro profissional", position: 2000 },
      { label: "Sem interesse no momento", position: 3000 },
      { label: "Não respondeu aos contatos (Sem retorno)", position: 4000 },
      { label: "Horário / Local incompatível", position: 5000 },
      { label: "Outro motivo", position: 6000 },
    ];

    const { data: inserted } = await admin
      .from("lost_reasons")
      .insert(
        defaultReasons.map((r) => ({
          workspace_id: workspaceId,
          label: r.label,
          position: r.position,
          is_active: true,
        }))
      )
      .select("id, label, is_active")
      .returns<LostReason[]>();

    if (inserted && inserted.length > 0) {
      return inserted;
    }
  } catch (err) {
    console.error("Erro ao inicializar motivos padrão de perda:", err);
  }

  return [
    { id: "default-preco", label: "Preço / Condições de pagamento", is_active: true },
    { id: "default-concorrente", label: "Optou por concorrente / outro profissional", is_active: true },
    { id: "default-sem-interesse", label: "Sem interesse no momento", is_active: true },
    { id: "default-sem-retorno", label: "Não respondeu aos contatos (Sem retorno)", is_active: true },
    { id: "default-horario", label: "Horário / Local incompatível", is_active: true },
    { id: "default-outro", label: "Outro motivo", is_active: true },
  ];
}

export async function getMembers(workspaceId: string): Promise<Member[]> {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("workspace_members")
    .select("user_id, role")
    .eq("workspace_id", workspaceId)
    .eq("is_active", true);

  const ids = (members ?? []).map((m) => m.user_id);
  if (ids.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", ids);

  const nameById = new Map(
    (profiles ?? []).map((p) => [p.id, p.full_name ?? ""]),
  );

  return (members ?? []).map((m) => ({
    userId: m.user_id,
    fullName: nameById.get(m.user_id) || "Sem nome",
    role: m.role as Member["role"],
  }));
}

export interface LeadFull {
  lead: LeadDetail;
  notes: Note[];
  tasks: TaskRow[];
  activities: ActivityRow[];
  history: HistoryRow[];
  interests: string[];
  appointments: AppointmentRow[];
  opportunities: OpportunityRow[];
  tags: TagItem[];
}

export async function getWorkspaceTags(workspaceId: string): Promise<TagItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tags")
    .select("id, name, color")
    .eq("workspace_id", workspaceId)
    .order("name", { ascending: true })
    .returns<TagItem[]>();
  return data ?? [];
}

export async function getLeadTags(leadId: string): Promise<TagItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lead_tags")
    .select("tag_id, tags (id, name, color)")
    .eq("lead_id", leadId);

  return (data ?? [])
    .map((item: any) => item.tags)
    .filter(Boolean) as TagItem[];
}

export async function getLeadFull(leadId: string): Promise<LeadFull | null> {
  const supabase = await createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .is("deleted_at", null)
    .maybeSingle<LeadDetail>();

  if (!lead) return null;

  const [
    notes,
    tasks,
    activities,
    history,
    interests,
    appointments,
    opportunities,
    leadTags,
  ] = await Promise.all([
    supabase
      .from("notes")
      .select("id, body, visibility, author_id, created_at")
      .eq("lead_id", leadId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .returns<Note[]>(),
    supabase
      .from("tasks")
      .select("id, title, due_at, completed_at, assigned_to, created_at")
      .eq("lead_id", leadId)
      .is("deleted_at", null)
      .order("completed_at", { ascending: true, nullsFirst: true })
      .order("due_at", { ascending: true })
      .returns<TaskRow[]>(),
    supabase
      .from("activities")
      .select("id, type, content, actor_id, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<ActivityRow[]>(),
    supabase
      .from("lead_stage_history")
      .select("id, from_stage_type, to_stage_type, actor_id, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .returns<HistoryRow[]>(),
    supabase
      .from("lead_product_interests")
      .select("product_id")
      .eq("lead_id", leadId),
    supabase
      .from("appointments")
      .select(
        "id, title, starts_at, ends_at, status, meet_link, calendar_event_id, calendar_sync_status",
      )
      .eq("lead_id", leadId)
      .is("deleted_at", null)
      .order("starts_at", { ascending: false })
      .returns<AppointmentRow[]>(),
    supabase
      .from("opportunities")
      .select(
        "id, product_id, status, potential_value, sold_value, payment_method, closed_at, created_at",
      )
      .eq("lead_id", leadId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .returns<OpportunityRow[]>(),
    getLeadTags(leadId),
  ]);

  return {
    lead,
    notes: notes.data ?? [],
    tasks: tasks.data ?? [],
    activities: activities.data ?? [],
    history: history.data ?? [],
    interests: (interests.data ?? []).map((i) => i.product_id),
    appointments: appointments.data ?? [],
    opportunities: opportunities.data ?? [],
    tags: leadTags ?? [],
  };
}

/** Existe conexão de calendário ativa? (não expõe tokens) */
export async function isCalendarConnected(
  workspaceId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("calendar_connections")
    .select("id, calendar_id")
    .eq("workspace_id", workspaceId)
    .eq("provider", "google")
    .eq("status", "connected")
    .limit(1)
    .maybeSingle();
  return Boolean(data?.calendar_id);
}

/** Duplicados potenciais por telefone/e-mail normalizados (mesmo workspace). */
export async function findDuplicates(
  workspaceId: string,
  phone: string | null,
  email: string | null,
  excludeLeadId?: string,
) {
  const supabase = await createClient();
  const filters: string[] = [];

  const digits = phone?.replace(/\D/g, "") ?? "";
  const normalizedPhone =
    digits.length === 0
      ? null
      : digits.length === 10 || digits.length === 11
        ? `55${digits}`
        : digits;
  const normalizedEmail = email?.trim().toLowerCase() || null;

  if (normalizedPhone) filters.push(`phone_normalized.eq.${normalizedPhone}`);
  if (normalizedEmail) filters.push(`email_normalized.eq.${normalizedEmail}`);
  if (filters.length === 0) return [];

  let query = supabase
    .from("leads")
    .select("id, name, phone, email")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .or(filters.join(","))
    .limit(5);
  if (excludeLeadId) query = query.neq("id", excludeLeadId);

  const { data } = await query;
  return data ?? [];
}

/** Oportunidades fechadas (ganhas ou perdidas) no período para detalhamento. */
export async function getCommercialOutcomes(
  workspaceId: string,
  params: {
    from: Date;
    to: Date;
    status?: "won" | "lost" | null;
    productId?: string | null;
    ownerId?: string | null;
  },
): Promise<CommercialOutcomeRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("commercial_outcomes", {
    p_workspace_id: workspaceId,
    p_from: params.from.toISOString(),
    p_to: params.to.toISOString(),
    p_status: params.status ?? null,
    p_product_id: params.productId ?? null,
    p_owner_id: params.ownerId ?? null,
  });

  if (error) {
    console.error("Erro ao buscar commercial_outcomes:", error);
    return [];
  }

  return (data as CommercialOutcomeRow[]) ?? [];
}

/** Retorna a visão da operação em tempo real para o Dashboard. */
export async function getOperationalOverview(
  workspaceId: string,
  channelConnectionId?: string | null,
): Promise<OperationalOverview> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_operational_overview", {
    p_workspace_id: workspaceId,
    p_channel_connection_id: channelConnectionId || null,
  });

  if (error) {
    console.error("Erro ao buscar get_operational_overview:", error);
    return {
      open_conversations: 0,
      tasks_today: 0,
      appointments_week: 0,
      attention_proposals: 0,
      attention_no_next_step: 0,
      attention_upcoming_sessions: 0,
      pipeline_distribution: [],
    };
  }

  return data as unknown as OperationalOverview;
}

/** Lista todas as conexões de canais (números de WhatsApp/Instagram) do workspace. */
export async function getChannelConnections(
  workspaceId: string,
): Promise<ChannelConnectionItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("channel_connections")
    .select("id, provider, display_name, phone_number, status, is_default, transport")
    .eq("workspace_id", workspaceId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    provider: row.provider,
    display_name: row.display_name,
    phone_number: row.phone_number,
    status: row.status,
    is_default: row.is_default,
    transport: row.transport,
  }));
}

/** Busca tarefas e lembretes atribuídos diretamente ao usuário (ex: criadas pela secretária). */
export async function getMyAssignedTasks(
  workspaceId: string,
  userId: string,
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select(
      `id, title, due_at, completed_at, created_by, lead_id,
       leads (id, name)`
    )
    .eq("workspace_id", workspaceId)
    .eq("assigned_to", userId)
    .is("completed_at", null)
    .is("deleted_at", null)
    .order("due_at", { ascending: true, nullsFirst: false })
    .limit(10)
    .returns<
      {
        id: string;
        title: string;
        due_at: string | null;
        completed_at: string | null;
        created_by: string | null;
        lead_id: string;
        leads: { id: string; name: string } | null;
      }[]
    >();

  return data ?? [];
}

export interface NavNotificationCounts {
  conversas: number;
  pipeline: number;
  agenda: number;
  contatos: number;
}

/** Busca contadores de notificações/alertas ativos para exibir badges nas abas e navegação. */
export async function getNavNotificationCounts(
  workspaceId: string,
): Promise<NavNotificationCounts> {
  const supabase = await createClient();

  const [
    { data: unreadConv },
    { count: overdueTasks },
    { count: dueFollowups },
    { count: todayAppointments },
  ] = await Promise.all([
    supabase
      .from("conversations")
      .select("unread_count")
      .eq("workspace_id", workspaceId)
      .gt("unread_count", 0),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .is("completed_at", null)
      .is("deleted_at", null)
      .lte("due_at", new Date().toISOString()),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .is("archived_at", null)
      .lte("follow_up_at", new Date().toISOString()),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "scheduled")
      .gte("starts_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
      .lt("starts_at", new Date(new Date().setHours(23, 59, 59, 999)).toISOString()),
  ]);

  const totalUnread = (unreadConv ?? []).reduce(
    (acc, curr) => acc + (curr.unread_count || 0),
    0,
  );
  const totalPipelineAlerts = (overdueTasks || 0) + (dueFollowups || 0);

  return {
    conversas: totalUnread,
    pipeline: totalPipelineAlerts,
    agenda: todayAppointments || 0,
    contatos: 0,
  };
}
