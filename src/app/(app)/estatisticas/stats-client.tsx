"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateWorkspaceGoals } from "./actions";
import type { AnalyticsData } from "@/lib/crm/stats-queries";
import { formatBRL, channelLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface StatsClientProps {
  data: AnalyticsData;
  isAdmin: boolean;
  currentRevenueGoal: number;
  currentClientsGoal: number;
}

export function StatsClient({
  data,
  isAdmin,
  currentRevenueGoal,
  currentClientsGoal,
}: StatsClientProps) {
  const router = useRouter();

  // Estados dos Modais
  const [modalMetasOpen, setModalMetasOpen] = useState(false);
  const [modalRelatorioOpen, setModalRelatorioOpen] = useState(false);
  const [relatorioGerado, setRelatorioGerado] = useState<null | {
    titulo: string;
    periodo: string;
    modulos: string[];
    dataGeracao: string;
  }>(null);

  // Formulário de Metas
  const [revenueGoalInput, setRevenueGoalInput] = useState(String(currentRevenueGoal));
  const [clientsGoalInput, setClientsGoalInput] = useState(String(currentClientsGoal));
  const [savingMetas, startSavingMetas] = useTransition();

  // Formulário de Relatório
  const [periodo, setPeriodo] = useState("mes_atual");
  const [incluirVendas, setIncluirVendas] = useState(true);
  const [incluirRoi, setIncluirRoi] = useState(true);
  const [incluirAtividades, setIncluirAtividades] = useState(true);
  const [incluirProdutos, setIncluirProdutos] = useState(true);
  const [incluirMetas, setIncluirMetas] = useState(true);

  function handleSaveMetas(e: React.FormEvent) {
    e.preventDefault();
    const rev = parseFloat(revenueGoalInput.replace(/[^\d.,]/g, "").replace(",", "."));
    const cli = parseInt(clientsGoalInput, 10);

    if (isNaN(rev) || rev <= 0 || isNaN(cli) || cli <= 0) {
      toast.error("Por favor, preencha valores válidos.");
      return;
    }

    startSavingMetas(async () => {
      const res = await updateWorkspaceGoals(rev, cli);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Metas personalizadas salvas com sucesso!");
        setModalMetasOpen(false);
        router.refresh();
      }
    });
  }

  function handleGerarRelatorio() {
    const modulos: string[] = [];
    if (incluirVendas) modulos.push("Vendas & Faturamento");
    if (incluirRoi) modulos.push("ROI & Origens");
    if (incluirAtividades) modulos.push("Atividades da Equipe");
    if (incluirProdutos) modulos.push("Desempenho por Produto");
    if (incluirMetas) modulos.push("Atingimento de Metas");

    const periodoLabels: Record<string, string> = {
      mes_atual: "Mês Atual (Em andamento)",
      mes_passado: "Mês Anterior",
      trimestre: "Último Trimestre",
      ano: "Ano Atual",
    };

    setRelatorioGerado({
      titulo: `Relatório Executivo de Performance`,
      periodo: periodoLabels[periodo] || "Período Selecionado",
      modulos,
      dataGeracao: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setModalRelatorioOpen(false);
    toast.success("Relatório confeccionado com sucesso!");
  }

  return (
    <>
      {/* Botões de Ação Personalizados no Topo */}
      <div className="flex items-center gap-3">
        {isAdmin ? (
          <Button
            variant="outline"
            onClick={() => setModalMetasOpen(true)}
            className="rounded-full px-4 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10 transition-all shadow-xs"
          >
            🎯 Definir Metas
          </Button>
        ) : null}

        <Button
          onClick={() => setModalRelatorioOpen(true)}
          className="rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-xs"
        >
          📄 Confeccionar Relatório
        </Button>
      </div>

      {/* Relatório Gerado em Destaque */}
      {relatorioGerado ? (
        <div className="ordo-card p-6 print:p-4 flex flex-col gap-4 border-2 border-primary/40 bg-card shadow-lg print:border-none print:shadow-none break-inside-avoid">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl print:hidden">📄</span>
                <h2 className="font-heading text-lg font-bold text-primary">
                  {relatorioGerado.titulo}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Período: <strong>{relatorioGerado.periodo}</strong> · Gerado em: {relatorioGerado.dataGeracao}
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="rounded-full text-xs font-semibold text-primary border-primary/40"
              >
                🖨️ Imprimir / Salvar PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRelatorioGerado(null)}
                className="rounded-full text-xs text-muted-foreground"
              >
                ✕ Fechar
              </Button>
            </div>
          </div>

          {/* Sumário Executivo do Relatório */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 print:grid-cols-3 bg-muted/30 p-3.5 rounded-2xl border border-border/60">
            <div>
              <span className="text-[11px] text-muted-foreground block">Faturamento Realizado</span>
              <span className="font-heading text-xl font-bold text-primary">
                {formatBRL(data.vendas.receitaTotal)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Conversão de Propostas</span>
              <span className="font-heading text-xl font-bold text-emerald-700">
                {data.vendas.taxaConversao}%
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Meta Mensal Atingida</span>
              <span className="font-heading text-xl font-bold text-primary">
                {data.metas.percentualAtingido}%
              </span>
            </div>
          </div>

          <div className="text-xs text-foreground leading-relaxed flex flex-col gap-1.5 print:hidden">
            <h4 className="font-bold text-primary uppercase tracking-wider text-[11px]">
              Módulos Inclusos na Confecção:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {relatorioGerado.modulos.map((m) => (
                <Badge key={m} variant="secondary" className="rounded-full text-xs font-medium">
                  ✓ {m}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal: Definir Metas Personalizadas */}
      {modalMetasOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="ordo-card w-full max-w-md p-6 flex flex-col gap-5 bg-card shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h3 className="font-heading text-lg font-bold text-primary">
                  Definir Metas do Workspace
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalMetasOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMetas} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Meta de Faturamento Mensal (R$)
                </label>
                <Input
                  type="number"
                  step="500"
                  required
                  value={revenueGoalInput}
                  onChange={(e) => setRevenueGoalInput(e.target.value)}
                  placeholder="Ex.: 30000"
                  className="rounded-xl text-sm"
                />
                <span className="text-[11px] text-muted-foreground">
                  Valor total em vendas/consultas desejado por mês.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Meta de Novos Pacientes / Fechamentos
                </label>
                <Input
                  type="number"
                  step="1"
                  required
                  value={clientsGoalInput}
                  onChange={(e) => setClientsGoalInput(e.target.value)}
                  placeholder="Ex.: 15"
                  className="rounded-xl text-sm"
                />
                <span className="text-[11px] text-muted-foreground">
                  Quantidade de novos pacientes que você pretende fechar por mês.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalMetasOpen(false)}
                  className="rounded-full text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={savingMetas}
                  className="rounded-full px-5 text-xs font-semibold text-primary-foreground"
                >
                  {savingMetas ? "Salvando..." : "Salvar Metas"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal: Confeccionar Relatório Personalizado */}
      {modalRelatorioOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="ordo-card w-full max-w-lg p-6 flex flex-col gap-5 bg-card shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📄</span>
                <h3 className="font-heading text-lg font-bold text-primary">
                  Confeccionar Relatório Personalizado
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalRelatorioOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Seleção de Período */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-foreground">
                  1. Selecione o Período
                </label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="h-10 rounded-xl border border-border bg-card px-3 text-xs shadow-xs"
                >
                  <option value="mes_atual">Mês Atual (Em andamento)</option>
                  <option value="mes_passado">Mês Anterior</option>
                  <option value="trimestre">Último Trimestre</option>
                  <option value="ano">Ano Atual</option>
                </select>
              </div>

              {/* Seleção de Módulos a Incluir */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-foreground">
                  2. Módulos e Detalhes do Relatório
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-muted/20 cursor-pointer hover:bg-muted/40">
                    <input
                      type="checkbox"
                      checked={incluirVendas}
                      onChange={(e) => setIncluirVendas(e.target.checked)}
                      className="size-4 accent-primary"
                    />
                    <span>💰 Análise de Vendas & Ticket</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-muted/20 cursor-pointer hover:bg-muted/40">
                    <input
                      type="checkbox"
                      checked={incluirRoi}
                      onChange={(e) => setIncluirRoi(e.target.checked)}
                      className="size-4 accent-primary"
                    />
                    <span>🌐 ROI & Origens do Lead</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-muted/20 cursor-pointer hover:bg-muted/40">
                    <input
                      type="checkbox"
                      checked={incluirAtividades}
                      onChange={(e) => setIncluirAtividades(e.target.checked)}
                      className="size-4 accent-primary"
                    />
                    <span>⚡ Produtividade da Equipe</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-muted/20 cursor-pointer hover:bg-muted/40">
                    <input
                      type="checkbox"
                      checked={incluirProdutos}
                      onChange={(e) => setIncluirProdutos(e.target.checked)}
                      className="size-4 accent-primary"
                    />
                    <span>📦 Vendas por Produto</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-muted/20 cursor-pointer hover:bg-muted/40 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={incluirMetas}
                      onChange={(e) => setIncluirMetas(e.target.checked)}
                      className="size-4 accent-primary"
                    />
                    <span>🎯 Progresso e Atingimento de Metas</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalRelatorioOpen(false)}
                  className="rounded-full text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleGerarRelatorio}
                  className="rounded-full px-5 text-xs font-semibold text-primary-foreground"
                >
                  Gerar Relatório Executivo ↗
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
