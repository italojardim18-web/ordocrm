"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { LeadDetail } from "@/lib/crm/types";
import { formatDateTime } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateLeadAISummaryAction, updateLeadSummary } from "@/app/(app)/pipeline/actions";

interface AISummaryCardProps {
  lead: LeadDetail;
}

export function AISummaryCard({ lead }: AISummaryCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  // Estados de edição manual
  const [need, setNeed] = useState(lead.summary_need || "");
  const [moment, setMoment] = useState(lead.summary_moment || "");
  const [preference, setPreference] = useState(lead.summary_preference || "");
  const [openPoint, setOpenPoint] = useState(lead.summary_open_point || "");
  const [notesSummary, setNotesSummary] = useState(lead.notes_summary || "");

  const hasSummary =
    lead.notes_summary ||
    lead.summary_need ||
    lead.summary_moment ||
    lead.summary_preference ||
    lead.summary_open_point;

  // Disparar geração/atualização com IA
  const handleGenerateSummary = () => {
    startTransition(async () => {
      const res = await generateLeadAISummaryAction(lead.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Resumo Comercial Inteligente gerado com sucesso!");
        setIsEditing(false);
      }
    });
  };

  // Salvar edições manuais
  const handleSaveManualEdit = () => {
    startTransition(async () => {
      const res = await updateLeadSummary(lead.id, {
        need: need.trim() || null,
        moment: moment.trim() || null,
        preference: preference.trim() || null,
        openPoint: openPoint.trim() || null,
        notesSummary: notesSummary.trim() || null,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Resumo atualizado!");
        setIsEditing(false);
      }
    });
  };

  // Copiar resumo 360° formatado
  const handleCopySummary = () => {
    const text = [
      `📋 Resumo Comercial do Paciente: ${lead.name}`,
      lead.notes_summary ? `\n• Síntese: ${lead.notes_summary}` : "",
      lead.summary_need ? `• 🎯 Necessidade: ${lead.summary_need}` : "",
      lead.summary_moment ? `• ⏳ Momento & Urgência: ${lead.summary_moment}` : "",
      lead.summary_preference ? `• 💡 Preferências: ${lead.summary_preference}` : "",
      lead.summary_open_point ? `• 📌 Ponto em Aberto: ${lead.summary_open_point}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text);
    toast.success("Resumo copiado para a área de transferência!");
  };

  if (!hasSummary && !isEditing) {
    return (
      <Card className="border-dashed border-stone-300 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-1.5 font-heading text-stone-900 dark:text-stone-100">
              <span className="text-primary">✨</span> Resumo Comercial Inteligente
            </CardTitle>
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Aguardando análise
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Estrutura automaticamente a queixa, momento e preferências do paciente a partir do histórico de conversas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground italic">
            Nenhum resumo gerado ainda. Clique no botão abaixo para analisar as mensagens, notas e agendamentos deste paciente.
          </p>
          <Button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isPending}
            className="w-full bg-[#521D2A] text-white hover:bg-[#6b2737] font-semibold text-xs shadow-sm"
          >
            {isPending ? "Analisando histórico com IA..." : "✨ Gerar Resumo Comercial com IA"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-primary/[0.03] shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-1.5 text-primary font-heading">
            <span>✨</span> Resumo Comercial Inteligente
          </CardTitle>
          
          <div className="flex items-center gap-1.5">
            {lead.summary_source_count ? (
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border border-primary/20">
                {lead.summary_source_count} interação(ões)
              </Badge>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="h-7 px-2 text-[11px]"
              title="Copiar resumo completo"
            >
              📋 Copiar
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={isPending}
              className="h-7 px-2.5 text-[11px] bg-[#521D2A] text-white hover:bg-[#6b2737]"
              title="Atualizar análise com IA"
            >
              {isPending ? "Analisando..." : "🔄 Atualizar"}
            </Button>
          </div>
        </div>

        {lead.summary_generated_at ? (
          <CardDescription className="text-[11px] flex items-center justify-between">
            <span>
              Atualizado em {formatDateTime(lead.summary_generated_at)}
              {lead.summary_model ? ` · ${lead.summary_model}` : ""}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary hover:underline text-[11px] font-medium"
            >
              {isEditing ? "Cancelar edição" : "Editar manualmente"}
            </button>
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-3 text-xs">
        {isEditing ? (
          /* MODO DE EDIÇÃO MANUAL */
          <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                Síntese Geral
              </label>
              <textarea
                value={notesSummary}
                onChange={(e) => setNotesSummary(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-background p-2 text-xs focus:outline-none focus:border-primary"
                placeholder="Síntese geral do paciente..."
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  🎯 Necessidade
                </label>
                <input
                  type="text"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  className="rounded-lg border border-stone-300 dark:border-stone-700 bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary"
                  placeholder="Queixa ou interesse..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  ⏳ Momento & Urgência
                </label>
                <input
                  type="text"
                  value={moment}
                  onChange={(e) => setMoment(e.target.value)}
                  className="rounded-lg border border-stone-300 dark:border-stone-700 bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary"
                  placeholder="Prontidão ou momento..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  💡 Preferências
                </label>
                <input
                  type="text"
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="rounded-lg border border-stone-300 dark:border-stone-700 bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary"
                  placeholder="Horários, modalidade..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  📌 Ponto em Aberto
                </label>
                <input
                  type="text"
                  value={openPoint}
                  onChange={(e) => setOpenPoint(e.target.value)}
                  className="rounded-lg border border-stone-300 dark:border-stone-700 bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary"
                  placeholder="Próximo passo..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-8 text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveManualEdit}
                disabled={isPending}
                className="h-8 text-xs bg-[#521D2A] text-white hover:bg-[#6b2737]"
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        ) : (
          /* MODO DE VISUALIZAÇÃO ESTRUTURADA */
          <>
            {lead.notes_summary ? (
              <div className="rounded-xl bg-card border border-stone-200/80 dark:border-stone-800 p-3 text-stone-800 dark:text-stone-200 leading-relaxed shadow-2xs font-sans">
                {lead.notes_summary}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {lead.summary_need ? (
                <div className="flex flex-col gap-1 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-card p-2.5 shadow-2xs">
                  <span className="font-semibold text-primary text-[11px] uppercase tracking-wider flex items-center gap-1">
                    🎯 Necessidade
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 text-xs leading-normal">
                    {lead.summary_need}
                  </p>
                </div>
              ) : null}

              {lead.summary_moment ? (
                <div className="flex flex-col gap-1 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-card p-2.5 shadow-2xs">
                  <span className="font-semibold text-primary text-[11px] uppercase tracking-wider flex items-center gap-1">
                    ⏳ Momento & Urgência
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 text-xs leading-normal">
                    {lead.summary_moment}
                  </p>
                </div>
              ) : null}

              {lead.summary_preference ? (
                <div className="flex flex-col gap-1 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-card p-2.5 shadow-2xs">
                  <span className="font-semibold text-primary text-[11px] uppercase tracking-wider flex items-center gap-1">
                    💡 Preferências / Restrições
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 text-xs leading-normal">
                    {lead.summary_preference}
                  </p>
                </div>
              ) : null}

              {lead.summary_open_point ? (
                <div className="flex flex-col gap-1 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-2.5 shadow-2xs">
                  <span className="font-semibold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    📌 Ponto em Aberto
                  </span>
                  <p className="text-amber-900 dark:text-amber-200 text-xs leading-normal">
                    {lead.summary_open_point}
                  </p>
                </div>
              ) : null}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
