/** Períodos oferecidos no filtro. `custom` usa as datas da URL. */
export const PERIOD_PRESETS = {
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  "90d": "Últimos 90 dias",
  month: "Este mês",
  year: "Este ano",
} as const;

export type PeriodKey = keyof typeof PERIOD_PRESETS;

export interface DashboardFilters {
  period: PeriodKey;
  pipelineId: string | null;
  productId: string | null;
  ownerId: string | null;
  channel: string | null;
}

/** Intervalo [from, to) — `to` exclusivo, para não contar o dia duas vezes. */
export function resolvePeriod(period: PeriodKey): { from: Date; to: Date } {
  const now = new Date();
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);
  to.setMilliseconds(to.getMilliseconds() + 1);

  const from = new Date(now);
  from.setHours(0, 0, 0, 0);

  switch (period) {
    case "7d":
      from.setDate(from.getDate() - 6);
      break;
    case "30d":
      from.setDate(from.getDate() - 29);
      break;
    case "90d":
      from.setDate(from.getDate() - 89);
      break;
    case "month":
      from.setDate(1);
      break;
    case "year":
      from.setMonth(0, 1);
      break;
  }

  return { from, to };
}

export interface DashboardSummary {
  new_leads: number;
  engaged_leads: number;
  appointments_scheduled: number;
  appointments_completed: number;
  sales_count: number;
  revenue: number;
  average_ticket: number | null;
  leads_in_follow_up: number;
  overdue_tasks: number;
  no_shows: number;
  cancellations: number;
  rate_lead_to_engaged: number | null;
  rate_engaged_to_session: number | null;
  rate_session_to_sale: number | null;
  rate_overall: number | null;
  median_hours_to_engage: number | null;
  median_days_to_schedule: number | null;
}

export interface FunnelRow {
  stage_type: string;
  leads_reached: number;
}

export interface TimeseriesRow {
  day: string;
  new_leads: number;
  sessions_completed: number;
  sales: number;
  revenue: number;
}

export interface Breakdowns {
  by_channel: { key: string; leads: number; conversions: number }[];
  by_product: { key: string; sales: number; revenue: number }[];
  by_owner: { key: string; leads: number; sales: number }[];
  by_lost_reason: { key: string; total: number }[];
}

export interface DashboardData {
  summary: DashboardSummary;
  funnel: FunnelRow[];
  timeseries: TimeseriesRow[];
  breakdowns: Breakdowns;
}

/** Ordem e rótulos do funil — independentes dos nomes das colunas do Kanban. */
export const FUNNEL_ORDER: { type: string; label: string }[] = [
  { type: "new", label: "Novo lead" },
  { type: "qualification", label: "Qualificação" },
  { type: "follow_up_pre_session", label: "Follow-up pré-sessão" },
  { type: "alignment_session", label: "Sessão de alinhamento" },
  { type: "follow_up_post_session", label: "Follow-up pós-sessão" },
  { type: "won", label: "Venda realizada" },
];

export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `${(value * 100).toFixed(1).replace(".", ",")}%`;
}
