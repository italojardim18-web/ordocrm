"use client";

import { useState } from "react";
import type { LeadCard, LostReason } from "@/lib/crm/types";
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
import { formatBRL } from "@/lib/format";

interface MarkLostDialogProps {
  lead: LeadCard | null;
  lostStageId: string | null;
  targetPosition: number;
  lostReasons: LostReason[];
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
  targetPosition,
  lostReasons,
  isOpen,
  onClose,
  onConfirm,
}: MarkLostDialogProps) {
  const [selectedReasonId, setSelectedReasonId] = useState<string>(
    lostReasons[0]?.id ?? ""
  );
  const [note, setNote] = useState("");
  const [enableReactivation, setEnableReactivation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!lead || !lostStageId) return null;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReasonId) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        leadId: lead!.id,
        lostStageId: lostStageId!,
        position: targetPosition,
        lostReasonId: selectedReasonId,
        note: note.trim(),
        enableReactivation,
      });
      // Limpa formulário
      setNote("");
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
      <DialogContent className="max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6">
        <DialogHeader className="gap-1.5 pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold">
              ✕
            </span>
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              Marcar Lead como Perdido
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            O lead{" "}
            <strong className="text-foreground font-semibold">
              {lead.name}
            </strong>{" "}
            {lead.potential_value ? (
              <span>({formatBRL(lead.potential_value)}) </span>
            ) : null}
            será movido para a etapa de perda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="flex flex-col gap-4 pt-3">
          {/* Motivo da Perda */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lost-reason-select" className="text-xs font-semibold">
              Motivo da Perda <span className="text-rose-500">*</span>
            </Label>
            <select
              id="lost-reason-select"
              value={selectedReasonId}
              onChange={(e) => setSelectedReasonId(e.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-xs shadow-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
              required
            >
              <option value="" disabled>
                Selecione o motivo principal
              </option>
              {lostReasons.map((reason) => (
                <option key={reason.id} value={reason.id}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          {/* Objeções e Contexto Clínico */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="lost-note-input" className="text-xs font-semibold">
                Objeções & Detalhes da Perda (Contexto Clínico/Comercial)
              </Label>
              <span className="text-[10px] text-muted-foreground font-normal">
                Usado pela IA
              </span>
            </div>
            <textarea
              id="lost-note-input"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Paciente achou o valor da avaliação de R$ 4.800 elevado para pagamento à vista. Sugerido oferecer parcelamento em 12x ou verificar reembolso do plano Bradesco em 30 dias..."
              className="rounded-xl border border-border bg-background text-xs p-3 focus:ring-2 focus:ring-primary focus:outline-hidden resize-none"
              maxLength={1000}
            />
            <p className="text-[11px] text-muted-foreground leading-tight flex items-start gap-1">
              <span>✨</span>
              <span>
                A <strong>Inteligência Artificial</strong> analisará estas anotações e objeções para gerar uma mensagem de reativação acolhedora e personalizada.
              </span>
            </p>
          </div>

          {/* Opção de Envio para Fila de Reativação Automática */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
            <input
              type="checkbox"
              id="enable-reactivation-check"
              checked={enableReactivation}
              onChange={(e) => setEnableReactivation(e.target.checked)}
              className="mt-1 size-4 rounded border-primary text-primary focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="enable-reactivation-check"
              className="flex flex-col gap-0.5 cursor-pointer text-xs"
            >
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <span>🔁</span>
                <span>Incluir na Fila de Reativação Automática com IA</span>
              </span>
              <span className="text-muted-foreground text-[11px] leading-snug">
                Programa o acompanhamento para o prazo definido no workspace (ex: 15, 30 ou 45 dias) com mensagem contextualizada elaborada pela IA.
              </span>
            </label>
          </div>

          <DialogFooter className="gap-2 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || !selectedReasonId}
              className="rounded-xl text-xs gap-1.5 font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {isSubmitting ? (
                "Salvando perda…"
              ) : (
                <>
                  <span>✓</span>
                  <span>Confirmar e Enviar para Reativação</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
