import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  resolvePeriod,
  type Breakdowns,
  type DashboardData,
  type DashboardFilters,
  type DashboardSummary,
  type FunnelRow,
  type TimeseriesRow,
} from "./dashboard";

const EMPTY_SUMMARY: DashboardSummary = {
  new_leads: 0,
  engaged_leads: 0,
  appointments_scheduled: 0,
  appointments_completed: 0,
  sales_count: 0,
  revenue: 0,
  average_ticket: null,
  leads_in_follow_up: 0,
  overdue_tasks: 0,
  no_shows: 0,
  cancellations: 0,
  rate_lead_to_engaged: null,
  rate_engaged_to_session: null,
  rate_session_to_sale: null,
  rate_overall: null,
  median_hours_to_engage: null,
  median_days_to_schedule: null,
};

/**
 * Busca todos os dados do dashboard em paralelo.
 * As funções rodam sob RLS (`security invoker`), então o workspace do
 * parâmetro só produz resultado se o usuário pertencer a ele.
 */
export async function getDashboardData(
  workspaceId: string,
  filters: DashboardFilters,
): Promise<DashboardData> {
  const supabase = await createClient();
  const { from, to } = resolvePeriod(filters.period);

  const range = {
    p_workspace_id: workspaceId,
    p_from: from.toISOString(),
    p_to: to.toISOString(),
  };

  const [summary, funnel, timeseries, breakdowns] = await Promise.all([
    supabase.rpc("dashboard_summary", {
      ...range,
      p_pipeline_id: filters.pipelineId,
      p_product_id: filters.productId,
      p_owner_id: filters.ownerId,
      p_channel: filters.channel,
    }),
    supabase.rpc("dashboard_funnel", {
      ...range,
      p_pipeline_id: filters.pipelineId,
      p_owner_id: filters.ownerId,
      p_channel: filters.channel,
    }),
    supabase.rpc("dashboard_timeseries", {
      ...range,
      p_pipeline_id: filters.pipelineId,
    }),
    supabase.rpc("dashboard_breakdowns", {
      ...range,
      p_pipeline_id: filters.pipelineId,
    }),
  ]);

  return {
    summary: (summary.data as DashboardSummary | null) ?? EMPTY_SUMMARY,
    funnel: (funnel.data as FunnelRow[] | null) ?? [],
    timeseries: (timeseries.data as TimeseriesRow[] | null) ?? [],
    breakdowns:
      (breakdowns.data as Breakdowns | null) ?? {
        by_channel: [],
        by_product: [],
        by_owner: [],
        by_lost_reason: [],
      },
  };
}
