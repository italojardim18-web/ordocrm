import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import {
  FUNNEL_ORDER,
  formatPercent,
  resolvePeriod,
  type PeriodKey,
} from "@/lib/crm/dashboard";
import { getDashboardData } from "@/lib/crm/dashboard-queries";
import { getMembers, getProducts } from "@/lib/crm/queries";
import { createClient } from "@/lib/supabase/server";
import { formatBRL, formatDate, formatDateTime } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChannelChart,
  LostReasonsChart,
  RevenueByProductChart,
  TimeseriesChart,
} from "./charts";
import { DashboardFilters } from "./filters";

export const metadata: Metadata = { title: "Dashboard" };

const VALID_PERIODS = ["7d", "30d", "90d", "month", "year"] as const;

function parsePeriod(value: string | undefined): PeriodKey {
  return (VALID_PERIODS as readonly string[]).includes(value ?? "")
    ? (value as PeriodKey)
    : "30d";
}

/** Card de indicador. `hint` explica a fórmula — números sem contexto enganam. */
function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="@container">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-1">
          {label}
          <abbr
            title={hint}
            className="cursor-help text-muted-foreground no-underline"
            aria-label={`Como é calculado: ${hint}`}
          >
            ⓘ
          </abbr>
        </CardDescription>
        {/* Valores monetários são longos (R$ 40.020,00): o tamanho acompanha
            a largura do card para a receita nunca ser cortada. */}
        <CardTitle className="text-xl font-semibold text-primary tabular-nums break-words @min-[11rem]:text-2xl @min-[16rem]:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const params = await searchParams;
  const period = parsePeriod(params.periodo);

  const filters = {
    period,
    pipelineId: null,
    productId: params.produto || null,
    ownerId: params.responsavel || null,
    channel: params.origem || null,
  };

  const supabase = await createClient();
  const [
    data,
    products,
    members,
    { data: upcoming },
    { data: agendadas },
    { data: overdue },
  ] = await Promise.all([
      getDashboardData(context.workspace.id, filters),
      getProducts(context.workspace.id, true),
      getMembers(context.workspace.id),
      supabase
        .from("appointments")
        .select("id, title, starts_at, lead_id, leads (name)")
        .eq("workspace_id", context.workspace.id)
        .eq("status", "scheduled")
        .is("deleted_at", null)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at")
        .limit(5)
        .returns<
          {
            id: string;
            title: string;
            starts_at: string;
            lead_id: string;
            leads: { name: string } | null;
          }[]
        >(),
      supabase.rpc("upcoming_scheduled_messages", {
        p_workspace_id: context.workspace.id,
        p_limit: 5,
      }),
      supabase
        .from("tasks")
        .select("id, title, due_at, lead_id, leads (name)")
        .eq("workspace_id", context.workspace.id)
        .is("completed_at", null)
        .is("deleted_at", null)
        .lt("due_at", new Date().toISOString())
        .order("due_at")
        .limit(5)
        .returns<
          {
            id: string;
            title: string;
            due_at: string;
            lead_id: string;
            leads: { name: string } | null;
          }[]
        >(),
    ]);

  const { summary, funnel, timeseries, breakdowns } = data;
  const { from, to } = resolvePeriod(period);

  const funnelMap = new Map(funnel.map((row) => [row.stage_type, row.leads_reached]));
  const funnelTop = Math.max(
    ...FUNNEL_ORDER.map((stage) => funnelMap.get(stage.type) ?? 0),
    1,
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(from)} a {formatDate(new Date(to.getTime() - 1))} · dados
          reais do pipeline
        </p>
      </div>

      <DashboardFilters products={products} members={members} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <Metric
          label="Novos leads"
          value={String(summary.new_leads)}
          hint="Leads criados no período (data de criação do lead)."
        />
        <Metric
          label="Engajados"
          value={String(summary.engaged_leads)}
          hint="Leads que responderam, tiraram dúvidas ou iniciaram agendamento no período (data do primeiro engajamento)."
        />
        <Metric
          label="Sessões agendadas"
          value={String(summary.appointments_scheduled)}
          hint="Agendamentos criados no período (data de criação do agendamento)."
        />
        <Metric
          label="Sessões realizadas"
          value={String(summary.appointments_completed)}
          hint="Agendamentos marcados como realizados, contados na data da sessão."
        />
        <Metric
          label="Vendas"
          value={String(summary.sales_count)}
          hint="Oportunidades ganhas, contadas na data de fechamento."
        />
        <Metric
          label="Receita"
          value={formatBRL(summary.revenue)}
          hint="Soma do valor vendido das oportunidades ganhas no período."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Movimentação no período</CardTitle>
            <CardDescription>
              Novos leads, sessões realizadas e vendas por dia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimeseriesChart data={timeseries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funil</CardTitle>
            <CardDescription>
              Leads criados no período que <strong>atingiram</strong> cada
              etapa, pelo histórico — não pela posição atual no Kanban.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-2">
              {FUNNEL_ORDER.map((stage) => {
                const reached = funnelMap.get(stage.type) ?? 0;
                const width = Math.round((reached / funnelTop) * 100);
                return (
                  <li key={stage.type} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between text-sm">
                      <span>{stage.label}</span>
                      <span className="font-medium tabular-nums">{reached}</span>
                    </div>
                    <div
                      className="h-2 rounded-full bg-muted"
                      role="img"
                      aria-label={`${stage.label}: ${reached} leads`}
                    >
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric
          label="Lead → engajamento"
          value={formatPercent(summary.rate_lead_to_engaged)}
          hint="Leads engajados no período ÷ novos leads do período."
        />
        <Metric
          label="Engajamento → sessão"
          value={formatPercent(summary.rate_engaged_to_session)}
          hint="Leads engajados no período que tiveram sessão realizada ÷ leads engajados no período."
        />
        <Metric
          label="Sessão → venda"
          value={formatPercent(summary.rate_session_to_sale)}
          hint="Leads com sessão realizada no período que converteram ÷ leads com sessão realizada no período."
        />
        <Metric
          label="Conversão geral"
          value={formatPercent(summary.rate_overall)}
          hint="Leads criados no período que viraram venda ÷ novos leads do período (coorte de entrada)."
        />
        <Metric
          label="Ticket médio"
          value={formatBRL(summary.average_ticket)}
          hint="Receita do período ÷ número de vendas do período."
        />
        <Metric
          label="Em follow-up"
          value={String(summary.leads_in_follow_up)}
          hint="Leads que estão agora em etapas de follow-up (foto atual, não depende do período)."
        />
        <Metric
          label="Follow-ups vencidos"
          value={String(summary.overdue_tasks)}
          hint="Tarefas em aberto com vencimento anterior a hoje (foto atual)."
        />
        <Metric
          label="Faltas e cancelamentos"
          value={`${summary.no_shows} / ${summary.cancellations}`}
          hint="Sessões marcadas como não compareceu / canceladas, na data da sessão."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Por origem</CardTitle>
            <CardDescription>
              Leads criados no período e quantos viraram venda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChannelChart data={breakdowns.by_channel} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por produto</CardTitle>
            <CardDescription>
              Vendas fechadas no período, por produto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueByProductChart data={breakdowns.by_product} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Motivos de perda</CardTitle>
            <CardDescription>
              Leads marcados como perdidos no período.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LostReasonsChart data={breakdowns.by_lost_reason} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mensagens agendadas</CardTitle>
            <CardDescription>
              O que vai sair sozinho, por ordem de horário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {(agendadas ?? []).map((m: {
                id: string;
                lead_id: string | null;
                lead_name: string;
                body: string;
                scheduled_for: string;
              }) => (
                <li key={m.id} className="flex justify-between gap-2 text-sm">
                  {m.lead_id ? (
                    <Link
                      href={`/pipeline/lead/${m.lead_id}`}
                      className="truncate hover:underline"
                    >
                      {m.lead_name} · {m.body}
                    </Link>
                  ) : (
                    <span className="truncate">{m.body}</span>
                  )}
                  <span className="shrink-0 text-muted-foreground">
                    {formatDateTime(m.scheduled_for)}
                  </span>
                </li>
              ))}
              {(agendadas ?? []).length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  Nenhuma mensagem agendada.
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas sessões</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {(upcoming ?? []).map((appointment) => (
                <li key={appointment.id} className="flex justify-between gap-2 text-sm">
                  <Link
                    href={`/pipeline/lead/${appointment.lead_id}`}
                    className="truncate hover:underline"
                  >
                    {appointment.leads?.name ?? "Lead"} · {appointment.title}
                  </Link>
                  <span className="shrink-0 text-muted-foreground">
                    {formatDateTime(appointment.starts_at)}
                  </span>
                </li>
              ))}
              {(upcoming ?? []).length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  Nenhuma sessão agendada.
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follow-ups vencidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {(overdue ?? []).map((task) => (
                <li key={task.id} className="flex justify-between gap-2 text-sm">
                  <Link
                    href={`/pipeline/lead/${task.lead_id}`}
                    className="truncate hover:underline"
                  >
                    {task.leads?.name ?? "Lead"} · {task.title}
                  </Link>
                  <span className="shrink-0 text-destructive">
                    {formatDate(task.due_at)}
                  </span>
                </li>
              ))}
              {(overdue ?? []).length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  Nenhum follow-up vencido.
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
