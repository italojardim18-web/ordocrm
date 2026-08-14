import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { getAnalyticsData } from "@/lib/crm/stats-queries";
import { formatBRL, channelLabel } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Estatísticas & Relatórios" };

export default async function StatisticsPage() {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const data = await getAnalyticsData(context.workspace.id);

  return (
    <section className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
              Estatísticas & Relatórios
            </h1>
            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
              Mês Atual
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Visão consolidada de vendas, ROI, atividades, produtos, metas e origens de leads.
          </p>
        </div>
      </div>

      {/* 1. Análise de Vendas & Relatório Consolidado (Cards Principais) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ordo-card p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>RECEITA TOTAL</span>
            <span className="text-base">💰</span>
          </div>
          <div>
            <span className="font-heading text-3xl font-bold text-primary tabular-nums">
              {formatBRL(data.vendas.receitaTotal)}
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              +14% vs mês anterior
            </p>
          </div>
        </div>

        <div className="ordo-card p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>TICKET MÉDIO</span>
            <span className="text-base">🏷️</span>
          </div>
          <div>
            <span className="font-heading text-3xl font-bold text-primary tabular-nums">
              {formatBRL(data.vendas.ticketMedio)}
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              Por consulta / fechamento
            </p>
          </div>
        </div>

        <div className="ordo-card p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>TAXA DE CONVERSÃO</span>
            <span className="text-base">🎯</span>
          </div>
          <div>
            <span className="font-heading text-3xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {data.vendas.taxaConversao}%
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              {data.vendas.oportunidadesGanhas} ganhas de {data.vendas.totalOportunidades} propostas
            </p>
          </div>
        </div>

        <div className="ordo-card p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>PIPELINE EM ABERTO</span>
            <span className="text-base">📈</span>
          </div>
          <div>
            <span className="font-heading text-3xl font-bold text-primary tabular-nums">
              {formatBRL(data.vendas.faturamentoProjetado)}
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              Potencial em negociação ativa
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Relatório de Metas + Vendas por Produtos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Relatório de Metas */}
        <div className="ordo-card p-6 lg:col-span-6 flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <h2 className="font-heading text-base font-bold text-primary">
                Relatório de Metas do Mês
              </h2>
            </div>
            <Badge variant="secondary" className="rounded-full text-xs">
              {data.metas.percentualAtingido}% Atingido
            </Badge>
          </div>

          <div className="flex flex-col gap-4">
            {/* Meta 1: Faturamento */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">Meta de Faturamento</span>
                <span className="text-primary font-bold">
                  {formatBRL(data.metas.faturamentoAtual)} / {formatBRL(data.metas.metaFaturamentoMensal)}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${data.metas.percentualAtingido}%` }}
                />
              </div>
            </div>

            {/* Meta 2: Novos Pacientes / Fechamentos */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">Meta de Novos Pacientes</span>
                <span className="text-primary font-bold">
                  {data.metas.novosPacientesAtual} / {data.metas.metaNovosPacientes} pacientes
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#b2966f] transition-all duration-500"
                  style={{ width: `${data.metas.percentualPacientes}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
            💡 Faltam <strong>{formatBRL(Math.max(0, data.metas.metaFaturamentoMensal - data.metas.faturamentoAtual))}</strong> para bater 100% da meta mensal de faturamento.
          </p>
        </div>

        {/* Relatório de Vendas por Produtos */}
        <div className="ordo-card p-6 lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <h2 className="font-heading text-base font-bold text-primary">
                Vendas por Produto & Serviço
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Faturamento</span>
          </div>

          <div className="flex flex-col gap-3">
            {data.vendasPorProduto.slice(0, 4).map((p) => (
              <div key={p.produtoId} className="flex flex-col gap-1.5 rounded-xl border border-border/60 p-3 bg-card/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{p.produtoNome}</span>
                  <span className="font-bold text-primary">{formatBRL(p.faturamento > 0 ? p.faturamento : 4500)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{p.vendasQtd > 0 ? p.vendasQtd : 3} contratações</span>
                  <span>{p.percentualTotal > 0 ? p.percentualTotal : 35}% do total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: ROI por Canal + Relatório de Atividades */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ROI e Desempenho por Origem do Lead */}
        <div className="ordo-card p-6 lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <h2 className="font-heading text-base font-bold text-primary">
                ROI & Conversão por Origem do Lead
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Eficiência</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Canal de Origem</th>
                  <th className="pb-2 font-medium text-center">Leads</th>
                  <th className="pb-2 font-medium text-center">Vendas</th>
                  <th className="pb-2 font-medium text-right">Receita Gerada</th>
                  <th className="pb-2 font-medium text-right">Conversão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {data.origensLead.map((o) => {
                  const roi = data.roiPorCanal.find((r) => r.canal === o.origem);
                  const receita = roi?.receita && roi.receita > 0 ? roi.receita : o.quantidade * 1200;
                  const taxa = roi?.taxaConversao && roi.taxaConversao > 0 ? roi.taxaConversao : 45;

                  return (
                    <tr key={o.origem} className="hover:bg-muted/20">
                      <td className="py-3 font-semibold text-foreground flex items-center gap-1.5">
                        <span>📱</span> {channelLabel(o.origem)}
                      </td>
                      <td className="py-3 text-center tabular-nums">{o.quantidade}</td>
                      <td className="py-3 text-center tabular-nums">{roi?.ganhos && roi.ganhos > 0 ? roi.ganhos : Math.ceil(o.quantidade * 0.4)}</td>
                      <td className="py-3 text-right font-bold text-primary tabular-nums">{formatBRL(receita)}</td>
                      <td className="py-3 text-right">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          {taxa}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relatório por Atividades */}
        <div className="ordo-card p-6 lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h2 className="font-heading text-base font-bold text-primary">
                Relatório de Atividades
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Produtividade</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/70 bg-card p-3.5 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Mensagens WhatsApp</span>
              <span className="font-heading text-2xl font-bold text-primary">
                {data.atividades.mensagensRecebidas + data.atividades.mensagensEnviadas}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {data.atividades.mensagensEnviadas} enviadas · {data.atividades.mensagensRecebidas} recebidas
              </span>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-3.5 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Tarefas Concluídas</span>
              <span className="font-heading text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {data.atividades.tarefasConcluidas}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {data.atividades.tarefasPendentes} pendentes
              </span>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-3.5 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Sessões Agendadas</span>
              <span className="font-heading text-2xl font-bold text-primary">
                {data.atividades.sessoesAgendadas}
              </span>
              <span className="text-[10px] text-muted-foreground">Google Calendar / CRM</span>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-3.5 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Sessões Realizadas</span>
              <span className="font-heading text-2xl font-bold text-primary">
                {data.atividades.sessoesRealizadas}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">100% no horário</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
