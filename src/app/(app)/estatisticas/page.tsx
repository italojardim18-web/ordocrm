import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAnalyticsData } from "@/lib/crm/stats-queries";
import { formatBRL, channelLabel } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { OrdoSymbol } from "@/components/ordo-mark";
import { StatsClient } from "./stats-client";

export const metadata: Metadata = { title: "Estatísticas & Relatórios" };

export default async function StatisticsPage() {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const supabase = await createClient();

  const [{ data: wsData }, data] = await Promise.all([
    supabase
      .from("workspaces")
      .select("monthly_revenue_goal, monthly_clients_goal")
      .eq("id", context.workspace.id)
      .maybeSingle<{ monthly_revenue_goal: number; monthly_clients_goal: number }>(),
    getAnalyticsData(context.workspace.id),
  ]);

  const currentRevenueGoal = wsData?.monthly_revenue_goal ? Number(wsData.monthly_revenue_goal) : data.metas.metaFaturamentoMensal;
  const currentClientsGoal = wsData?.monthly_clients_goal ? Number(wsData.monthly_clients_goal) : data.metas.metaNovosPacientes;

  // Recalcula percentuais com base nas metas salvas pelo usuário.
  // A meta é mensal, então o numerador é o mês corrente — não o histórico.
  const realizadoNoMes = data.vendas.receitaMesAtual;
  const pacientesNoMes = data.metas.novosPacientesAtual;
  const percentualAtingido = Math.min(100, Math.round((realizadoNoMes / currentRevenueGoal) * 100));
  const percentualPacientes = Math.min(100, Math.round((pacientesNoMes / currentClientsGoal) * 100));

  const isAdmin = context.membership.role === "admin";

  return (
    <section className="flex flex-col gap-6 print:gap-4 print:p-0">
      {/* Cabeçalho Oficial Timbrado EXCLUSIVO PARA IMPRESSÃO / PDF */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-primary pb-4 mb-2">
        <div className="flex items-center gap-3">
          <OrdoSymbol className="size-9 text-primary" />
          <div className="flex flex-col">
            <span className="font-heading text-2xl font-bold tracking-[0.25em] text-primary">
              ORDO
            </span>
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
              Relatório Executivo · {context.workspace.displayName}
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Clínica & Consultório</p>
          <p>Emissão: {new Date().toLocaleDateString("pt-BR")}</p>
        </div>
      </div>

      {/* Cabeçalho da Tela (Oculta botões na impressão) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
              Estatísticas & Relatórios
            </h1>
            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
              Todo o período
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Visão consolidada de vendas, ROI, atividades, produtos, metas personalizadas e origens de leads.
          </p>
        </div>

        {/* Botões de Ação (Definir Metas e Confeccionar Relatório) */}
        <StatsClient
          data={data}
          isAdmin={isAdmin}
          currentRevenueGoal={currentRevenueGoal}
          currentClientsGoal={currentClientsGoal}
        />
      </div>

      {/* 1. Análise de Vendas & Relatório Consolidado (Cards Principais) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:gap-2 break-inside-avoid">
        <div className="ordo-card p-5 print:p-3.5 print:border print:shadow-none flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>RECEITA TOTAL</span>
            <span className="text-base print:hidden">💰</span>
          </div>
          <div>
            <span className="font-heading text-3xl print:text-2xl font-bold text-primary tabular-nums">
              {formatBRL(data.vendas.receitaTotal)}
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              Oportunidades ganhas
            </p>
          </div>
        </div>

        <div className="ordo-card p-5 print:p-3.5 print:border print:shadow-none flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>TICKET MÉDIO</span>
            <span className="text-base print:hidden">🏷️</span>
          </div>
          <div>
            <span className="font-heading text-3xl print:text-2xl font-bold text-primary tabular-nums">
              {formatBRL(data.vendas.ticketMedio)}
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              Por consulta / fechamento
            </p>
          </div>
        </div>

        <div className="ordo-card p-5 print:p-3.5 print:border print:shadow-none flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>TAXA DE CONVERSÃO</span>
            <span className="text-base print:hidden">🎯</span>
          </div>
          <div>
            <span className="font-heading text-3xl print:text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {data.vendas.taxaConversao}%
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              {data.vendas.oportunidadesGanhas} ganhas de {data.vendas.totalOportunidades} propostas
            </p>
          </div>
        </div>

        <div className="ordo-card p-5 print:p-3.5 print:border print:shadow-none flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>PIPELINE EM ABERTO</span>
            <span className="text-base print:hidden">📈</span>
          </div>
          <div>
            <span className="font-heading text-3xl print:text-2xl font-bold text-primary tabular-nums">
              {formatBRL(data.vendas.faturamentoProjetado)}
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              Potencial em negociação ativa
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Relatório de Metas Personalizadas + Vendas por Produtos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 print:grid-cols-12 print:gap-3">
        {/* Relatório de Metas Personalizadas */}
        <div className="ordo-card p-6 print:p-4 print:border print:shadow-none lg:col-span-6 print:col-span-6 flex flex-col justify-between gap-4 break-inside-avoid">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg print:hidden">🎯</span>
              <h2 className="font-heading text-base font-bold text-primary">
                Relatório de Metas
              </h2>
            </div>
            <Badge variant="secondary" className="rounded-full text-xs">
              {percentualAtingido}% Atingido
            </Badge>
          </div>

          <div className="flex flex-col gap-4">
            {/* Meta 1: Faturamento */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">Meta de Faturamento</span>
                <span className="text-primary font-bold">
                  {formatBRL(realizadoNoMes)} / {formatBRL(currentRevenueGoal)}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percentualAtingido}%` }}
                />
              </div>
            </div>

            {/* Meta 2: Novos Pacientes */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">Meta de Novos Pacientes</span>
                <span className="text-primary font-bold">
                  {pacientesNoMes} / {currentClientsGoal} pacientes
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#b2966f]"
                  style={{ width: `${percentualPacientes}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/50">
            💡 Faltam <strong>{formatBRL(Math.max(0, currentRevenueGoal - realizadoNoMes))}</strong> para bater 100% da meta deste mês.
          </p>
        </div>

        {/* Relatório de Vendas por Produtos */}
        <div className="ordo-card p-6 print:p-4 print:border print:shadow-none lg:col-span-6 print:col-span-6 flex flex-col gap-3 break-inside-avoid">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg print:hidden">📦</span>
              <h2 className="font-heading text-base font-bold text-primary">
                Vendas por Produto & Serviço
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Faturamento</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {data.vendasPorProduto.length > 0 ? (
              data.vendasPorProduto.map((p) => (
                <div key={p.produtoId} className="flex flex-col gap-1 rounded-xl border border-border/60 p-2.5 bg-card/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{p.produtoNome}</span>
                    <span className="font-bold text-primary">{formatBRL(p.faturamento)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{p.vendasQtd} contratação(ões)</span>
                    <span>{p.percentualTotal}% do total</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic py-4 text-center">
                Nenhum produto cadastrado com vendas ainda.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid: ROI por Canal + Relatório de Atividades */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 print:grid-cols-12 print:gap-3 break-inside-avoid">
        {/* ROI e Desempenho por Origem do Lead */}
        <div className="ordo-card p-6 print:p-4 print:border print:shadow-none lg:col-span-7 print:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg print:hidden">📊</span>
              <h2 className="font-heading text-base font-bold text-primary">
                ROI & Conversão por Origem
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Eficiência</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Canal</th>
                  <th className="pb-2 font-medium text-center">Leads</th>
                  <th className="pb-2 font-medium text-center">Vendas</th>
                  <th className="pb-2 font-medium text-right">Receita</th>
                  <th className="pb-2 font-medium text-right">Conversão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {data.origensLead.map((o) => {
                  const roi = data.roiPorCanal.find((r) => r.canal === o.origem);
                  const receita = roi?.receita ?? 0;
                  const ganhos = roi?.ganhos ?? 0;
                  const taxa = roi?.taxaConversao ?? 0;

                  return (
                    <tr key={o.origem}>
                      <td className="py-2.5 font-semibold text-foreground">
                        {channelLabel(o.origem)}
                      </td>
                      <td className="py-2.5 text-center tabular-nums">{o.quantidade}</td>
                      <td className="py-2.5 text-center tabular-nums">{ganhos}</td>
                      <td className="py-2.5 text-right font-bold text-primary tabular-nums">{formatBRL(receita)}</td>
                      <td className="py-2.5 text-right font-semibold text-emerald-700">
                        {taxa}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relatório por Atividades */}
        <div className="ordo-card p-6 print:p-4 print:border print:shadow-none lg:col-span-5 print:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg print:hidden">⚡</span>
              <h2 className="font-heading text-base font-bold text-primary">
                Atividades da Equipe
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Produtividade</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-border/70 bg-card p-3 flex flex-col gap-0.5">
              <span className="text-[11px] text-muted-foreground">Mensagens WhatsApp</span>
              <span className="font-heading text-xl font-bold text-primary">
                {data.atividades.mensagensRecebidas + data.atividades.mensagensEnviadas}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {data.atividades.mensagensEnviadas} enviadas
              </span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-3 flex flex-col gap-0.5">
              <span className="text-[11px] text-muted-foreground">Tarefas Feitas</span>
              <span className="font-heading text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {data.atividades.tarefasConcluidas}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {data.atividades.tarefasPendentes} pendentes
              </span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-3 flex flex-col gap-0.5">
              <span className="text-[11px] text-muted-foreground">Sessões Agendadas</span>
              <span className="font-heading text-xl font-bold text-primary">
                {data.atividades.sessoesAgendadas}
              </span>
              <span className="text-[10px] text-muted-foreground">Agenda Google</span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-3 flex flex-col gap-0.5">
              <span className="text-[11px] text-muted-foreground">Sessões Feitas</span>
              <span className="font-heading text-xl font-bold text-primary">
                {data.atividades.sessoesRealizadas}
              </span>
              <span className="text-[10px] text-muted-foreground">Status concluído</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
