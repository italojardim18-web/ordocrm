"use client";

import { useEffect, useState } from "react";
import type { LostReason } from "@/lib/crm/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/format";

const FALLBACK_LOST_REASONS: LostReason[] = [
  { id: "fallback-preco", label: "Preço / Condições de pagamento ou parcelamento", is_active: true },
  { id: "fallback-concorrente", label: "Optou por concorrente / outro profissional", is_active: true },
  { id: "fallback-sem-interesse", label: "Sem interesse ou pausou acompanhamento", is_active: true },
  { id: "fallback-sem-retorno", label: "Parou de responder após valor/proposta", is_active: true },
  { id: "fallback-horario", label: "Horário / Agenda incompatível", is_active: true },
  { id: "fallback-saude-pessoal", label: "Imprevisto pessoal ou familiar", is_active: true },
  { id: "fallback-outro", label: "Outro motivo", is_active: true },
];

const CLINICAL_SUGGESTIONS = [
  "Avaliação Neuropsicológica (TDAH / Autismo)",
  "Psicoterapia (Ansiedade / Depressão)",
  "Laudo para Concurso / Perícia / Faculdade",
  "Dificuldade de Aprendizagem Infantil",
  "Burnout / Estresse Profissional",
  "Orientação Parental / Familiar",
];

const APPROACH_SUGGESTIONS = [
  "💳 Oferecer parcelamento facilitado / nova condição",
  "⏰ Oferecer novos horários / flexibilidade de agenda",
  "🌿 Check-in empático e acolhedor (sem pressão comercial)",
  "📄 Explicar facilidade de recibos e reembolso do plano",
  "💡 Apresentar novo formato ou modalidade de atendimento",
];

export interface MarkLostLeadData {
  id: string;
  name: string;
  potential_value?: number | null;
  lost_reason_id?: string | null;
  lost_note?: string | null;
}

interface MarkLostDialogProps {
  lead: MarkLostLeadData | null;
  lostStageId: string | null;
  targetPosition?: number;
  lostReasons?: LostReason[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    leadId: string;
    lostStageId: string;
    position: number;
    lostReasonId: string;
    note: string;
    enableReactivation: boolean;
  }) => Promise<void>;
}

export function MarkLostDialog({
  lead,
  lostStageId,
  targetPosition = 0,
  lostReasons = [],
  isOpen,
  onClose,
  onConfirm,
}: MarkLostDialogProps) {
  const activeReasons = lostReasons.length > 0 ? lostReasons : FALLBACK_LOST_REASONS;

  const [selectedReasonId, setSelectedReasonId] = useState<string>("");
  const [complaint, setComplaint] = useState("");
  const [objection, setObjection] = useState("");
  const [approach, setApproach] = useState("");
  const [daysOption, setDaysOption] = useState<number>(30);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [enableReactivation, setEnableReactivation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializa e sincroniza os campos a partir das anotações salvas ou limpa para novo
  useEffect(() => {
    if (isOpen) {
      setSelectedReasonId(() => {
        if (lead?.lost_reason_id && activeReasons.some((r) => r.id === lead.lost_reason_id)) {
          return lead.lost_reason_id;
        }
        return activeReasons[0]?.id ?? "";
      });

      // Tenta recuperar campos se já existirem na nota
      const rawNote = lead?.lost_note || "";
      if (rawNote.includes("Queixa Principal:") || rawNote.includes("Objeção / Barreira:")) {
        const lines = rawNote.split("\n");
        let q = "";
        let obj = "";
        let app = "";
        let add = "";

        for (const line of lines) {
          if (line.includes("Queixa Principal:")) q = line.replace(/.*Queixa Principal:\s*/i, "").trim();
          else if (line.includes("Objeção / Barreira:")) obj = line.replace(/.*Objeção \/ Barreira:\s*/i, "").trim();
          else if (line.includes("Abordagem para Reativação:")) app = line.replace(/.*Abordagem para Reativação:\s*/i, "").trim();
          else if (line.includes("Detalhes adicionais:")) add = line.replace(/.*Detalhes adicionais:\s*/i, "").trim();
        }

        setComplaint(q);
        setObjection(obj);
        setApproach(app);
        setAdditionalNotes(add);
      } else {
        setComplaint("");
        setObjection(rawNote);
        setApproach("");
        setAdditionalNotes("");
      }

      setDaysOption(30);
      setEnableReactivation(true);
      setIsSubmitting(false);
    }
  }, [isOpen, activeReasons, lead?.id, lead?.lost_reason_id, lead?.lost_note]);

  if (!lead || !lostStageId) return null;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReasonId) return;

    // Compila os campos estruturados para a IA
    const parts: string[] = [];
    if (complaint.trim()) parts.push(`🎯 Queixa Principal: ${complaint.trim()}`);
    if (objection.trim()) parts.push(`🚧 Objeção / Barreira: ${objection.trim()}`);
    if (approach.trim()) parts.push(`💡 Abordagem para Reativação: ${approach.trim()}`);
    parts.push(`⏱️ Prazo sugerido: ${daysOption} dias`);
    if (additionalNotes.trim()) parts.push(`📝 Detalhes adicionais: ${additionalNotes.trim()}`);

    const compiledNote = parts.join("\n");

    setIsSubmitting(true);
    try {
      await onConfirm({
        leadId: lead!.id,
        lostStageId: lostStageId!,
        position: targetPosition,
        lostReasonId: selectedReasonId,
        note: compiledNote,
        enableReactivation,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-7">
        <DialogHeader className="gap-2 pb-3 border-b border-border/80">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 text-lg font-bold shadow-xs">
              🚨
            </span>
            <div className="flex flex-col">
              <DialogTitle className="font-heading text-xl font-bold text-foreground">
                Marcar Perda & Configurar Reativação com IA
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Preencha o diagnóstico da perda. A Inteligência Artificial usará estas informações para reativar o paciente no momento certo.
              </DialogDescription>
            </div>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 rounded-xl bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/50">
            <span>Paciente: <strong className="text-foreground">{lead.name}</strong></span>
            {lead.potential_value ? (
              <span>• Valor estimado: <strong className="text-emerald-600 dark:text-emerald-400">{formatBRL(lead.potential_value)}</strong></span>
            ) : null}
          </div>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="flex flex-col gap-5 pt-3">
          {/* 1. Motivo Principal da Perda */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lost-reason-select" className="text-xs font-bold text-foreground flex items-center gap-1">
              <span>1. Motivo Principal da Perda / Desistência</span>
              <span className="text-rose-500">*</span>
            </Label>
            <select
              id="lost-reason-select"
              value={selectedReasonId}
              onChange={(e) => setSelectedReasonId(e.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-xs shadow-xs focus:ring-2 focus:ring-primary focus:outline-hidden font-medium"
              required
            >
              <option value="" disabled>
                Selecione o motivo principal
              </option>
              {activeReasons.map((reason) => (
                <option key={reason.id} value={reason.id}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Queixa / Dor Clínica do Paciente */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="complaint-input" className="text-xs font-bold text-foreground">
                2. Qual era a Queixa / Necessidade Principal do Paciente?
              </Label>
              <span className="text-[10px] font-semibold text-primary/80">Essencial para a IA</span>
            </div>
            <input
              id="complaint-input"
              type="text"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Ex: Avaliação Neuropsicológica para foco e suspeita de TDAH em adulto..."
              className="h-10 rounded-xl border border-border bg-background px-3 text-xs shadow-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
            {/* Sugestões rápidas */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {CLINICAL_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setComplaint(sug)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    complaint === sug
                      ? "bg-primary text-primary-foreground border-primary font-semibold"
                      : "bg-muted/30 hover:bg-muted/70 text-muted-foreground border-border/60"
                  }`}
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Principal Objeção ou Barreira */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="objection-input" className="text-xs font-bold text-foreground">
                3. Qual foi a Principal Objeção ou Barreira Mencionada?
              </Label>
              <span className="text-[10px] text-muted-foreground">O que o paciente disse/fez?</span>
            </div>
            <textarea
              id="objection-input"
              rows={3}
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
              placeholder="Ex: Achou o valor à vista elevado para o momento. Pediu se podia parcelar em 10x ou se o plano cobria. Disse que retornaria no próximo mês..."
              className="rounded-xl border border-border bg-background text-xs p-3 focus:ring-2 focus:ring-primary focus:outline-hidden resize-none"
              maxLength={800}
            />
          </div>

          {/* 4. Abordagem / Oferta Futura para Reativação */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-foreground">
              4. Qual a Melhor Abordagem para Reativar este Paciente no Futuro?
            </Label>
            <div className="flex flex-col gap-1.5">
              {APPROACH_SUGGESTIONS.map((app) => (
                <label
                  key={app}
                  onClick={() => setApproach(app)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    approach === app
                      ? "bg-primary/10 border-primary text-foreground font-semibold shadow-xs"
                      : "bg-background hover:bg-muted/30 border-border text-muted-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name="approach_radio"
                    checked={approach === app}
                    onChange={() => setApproach(app)}
                    className="size-3.5 text-primary border-border focus:ring-primary"
                  />
                  <span>{app}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Prazo de Reativação e Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Prazo */}
            <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-muted/20 p-3.5">
              <Label className="text-xs font-bold text-foreground">
                5. Prazo Recomendado para Reativação
              </Label>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[15, 30, 45, 60].map((dias) => (
                  <button
                    key={dias}
                    type="button"
                    onClick={() => setDaysOption(dias)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      daysOption === dias
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-background hover:bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {dias} dias {dias === 30 ? "(Padrão)" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Reativação com IA */}
            <div className="flex flex-col justify-between rounded-2xl border border-primary/30 bg-primary/5 p-3.5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="enable-reactivation-check"
                  checked={enableReactivation}
                  onChange={(e) => setEnableReactivation(e.target.checked)}
                  className="mt-0.5 size-4.5 rounded-md border-primary text-primary focus:ring-primary cursor-pointer accent-primary"
                />
                <label
                  htmlFor="enable-reactivation-check"
                  className="flex flex-col gap-0.5 cursor-pointer text-xs"
                >
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <span>✨</span>
                    <span>Fila de Reativação com IA</span>
                  </span>
                  <span className="text-muted-foreground text-[11px] leading-snug">
                    O paciente será inserido na fila e a IA gerará uma mensagem personalizada baseada nestas respostas.
                  </span>
                </label>
              </div>
              <Badge variant="secondary" className="w-fit text-[10px] mt-2 font-semibold">
                ✓ Recomendado para não perder oportunidades
              </Badge>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-3 border-t border-border/70 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-10 px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || !selectedReasonId}
              className="rounded-xl text-xs h-10 px-5 gap-2 font-bold bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-md hover:shadow-lg border border-rose-500 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                "Gravando perda & programando IA…"
              ) : (
                <>
                  <span>🚨</span>
                  <span>Confirmar Perda & Iniciar Reativação</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

