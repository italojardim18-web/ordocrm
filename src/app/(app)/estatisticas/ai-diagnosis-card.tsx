"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateAnalyticsAIDiagnosisAction } from "./actions";

interface AIDiagnosisProps {
  initialDiagnosis?: {
    overview?: string;
    opportunities?: string;
    actionPlan?: string[];
    bottlenecks?: string;
    model?: string;
    generatedAt?: string;
  } | null;
}

export function AIAnalyticsDiagnosisCard({ initialDiagnosis }: AIDiagnosisProps) {
  const [isPending, startTransition] = useTransition();
  const [diagnosis, setDiagnosis] = useState(initialDiagnosis || null);

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await generateAnalyticsAIDiagnosisAction();
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        setDiagnosis(res.data);
        toast.success("Diagnóstico estratégico gerado com sucesso pela IA Local!");
      }
    });
  };

  const handleCopy = () => {
    if (!diagnosis) return;
    const text = [
      "📊 DIAGNÓSTICO ESTRATÉGICO & CLÍNICO ORDO",
      diagnosis.overview ? `\n• Visão Geral: ${diagnosis.overview}` : "",
      diagnosis.opportunities ? `\n• Oportunidades: ${diagnosis.opportunities}` : "",
      diagnosis.actionPlan?.length ? `\n• Plano de Ação:\n${diagnosis.actionPlan.map((a, i) => `  ${i + 1}. ${a}`).join("\n")}` : "",
      diagnosis.bottlenecks ? `\n• Gargalos & Prevenção: ${diagnosis.bottlenecks}` : "",
      diagnosis.model ? `\n(Gerado por ${diagnosis.model})` : "",
    ].filter(Boolean).join("\n");

    navigator.clipboard.writeText(text);
    toast.success("Diagnóstico copiado para a área de transferência!");
  };

  return (
    <Card className="border-[#521D2A]/30 bg-gradient-to-br from-[#521D2A]/[0.04] to-primary/[0.02] shadow-sm print:border print:shadow-none break-inside-avoid">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#521D2A] text-[#B2966F] text-lg font-bold shadow-xs">
              ✨
            </div>
            <div>
              <CardTitle className="text-base font-heading font-bold text-primary flex items-center gap-2">
                Diagnóstico & Inteligência Estratégica
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                  IA Local Ativa
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Análise executiva automatizada de faturamento, canais de aquisição, conversão e retenção clínica.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {diagnosis ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2.5 text-xs"
              >
                📋 Copiar
              </Button>
            ) : null}

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isPending}
              className="h-8 px-3 text-xs bg-[#521D2A] text-white hover:bg-[#6b2737] font-semibold shadow-xs"
            >
              {isPending ? "Analisando com IA Local..." : diagnosis ? "🔄 Atualizar Diagnóstico" : "✨ Gerar Diagnóstico com IA"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-xs">
        {!diagnosis ? (
          <div className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 p-6 text-center flex flex-col items-center gap-3 bg-white/40 dark:bg-stone-900/40">
            <span className="text-3xl">🧠</span>
            <div className="flex flex-col gap-1 max-w-md">
              <p className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                Nenhum diagnóstico gerado para este período ainda.
              </p>
              <p className="text-xs text-muted-foreground">
                Clique no botão <strong>"Gerar Diagnóstico com IA"</strong> para que o modelo processe os dados de faturamento, origens e gargalos do seu consultório e apresente insights práticos imediatos.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isPending}
              className="mt-1 bg-[#521D2A] text-white hover:bg-[#6b2737] text-xs font-semibold px-5"
            >
              {isPending ? "Processando métricas..." : "✨ Gerar Diagnóstico Agora"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
            {/* 1. Visão Geral Executiva */}
            {diagnosis.overview && (
              <div className="rounded-2xl bg-card border border-stone-200/80 dark:border-stone-800 p-3.5 leading-relaxed text-stone-800 dark:text-stone-200 shadow-2xs">
                <span className="font-bold text-primary text-[11px] uppercase tracking-wider block mb-1">
                  📊 Diagnóstico Geral da Operação
                </span>
                <p className="text-xs">{diagnosis.overview}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* 2. Oportunidades de Canais */}
              {diagnosis.opportunities && (
                <div className="rounded-2xl bg-card border border-stone-200/70 dark:border-stone-800 p-3.5 shadow-2xs flex flex-col gap-1">
                  <span className="font-bold text-primary text-[11px] uppercase tracking-wider flex items-center gap-1">
                    🎯 Canais & Oportunidades
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 text-xs leading-normal">
                    {diagnosis.opportunities}
                  </p>
                </div>
              )}

              {/* 3. Gargalos e Prevenção */}
              {diagnosis.bottlenecks && (
                <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 p-3.5 shadow-2xs flex flex-col gap-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    ⚠️ Gargalos & Prevenção de Faltas
                  </span>
                  <p className="text-amber-900 dark:text-amber-200 text-xs leading-normal">
                    {diagnosis.bottlenecks}
                  </p>
                </div>
              )}
            </div>

            {/* 4. Plano de Ação Prático */}
            {diagnosis.actionPlan && diagnosis.actionPlan.length > 0 && (
              <div className="rounded-2xl bg-card border border-stone-200/70 dark:border-stone-800 p-3.5 shadow-2xs flex flex-col gap-2">
                <span className="font-bold text-primary text-[11px] uppercase tracking-wider flex items-center gap-1">
                  🚀 3 Prioridades Estratégicas para Esta Semana
                </span>
                <ul className="flex flex-col gap-1.5 pl-1">
                  {diagnosis.actionPlan.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-700 dark:text-stone-300 text-xs">
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#521D2A] text-[10px] font-bold text-white mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadados de Geração */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 px-1">
              <span>Modelo: <strong className="text-foreground">{diagnosis.model || "Ollama Local"}</strong></span>
              {diagnosis.generatedAt && (
                <span>Atualizado às {new Date(diagnosis.generatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
