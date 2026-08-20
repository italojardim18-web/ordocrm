"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  archiveLead,
  unarchiveLead,
  markEngaged,
  moveLead,
  reactivateLead,
  setLeadOwner,
  markLeadLostFromKanban,
} from "../../actions";
import type { LeadDetail, LostReason, Member, Stage } from "@/lib/crm/types";
import { isStageLost } from "@/lib/crm/stages";
import { MarkLostDialog } from "../../mark-lost-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function LeadActions({
  lead,
  stages,
  lostReasons,
  members,
}: {
  lead: LeadDetail;
  stages: Stage[];
  lostReasons: LostReason[];
  members: Member[];
}) {
  const router = useRouter();
  const [stageId, setStageId] = useState(lead.stage_id);
  const [lostOpen, setLostOpen] = useState(false);
  const [targetLostStageId, setTargetLostStageId] = useState<string | null>(null);
  const [arquivarOpen, setArquivarOpen] = useState(false);
  const [naoComercial, setNaoComercial] = useState(false);
  const [motivoArquivo, setMotivoArquivo] = useState("");
  const [reactivateStage, setReactivateStage] = useState("");
  const [pending, startTransition] = useTransition();

  const currentStage = stages.find((s) => s.id === lead.stage_id);
  const isLost = isStageLost(currentStage);

  // Busca a primeira etapa de perda configurada no pipeline
  const defaultLostStage =
    stages.find((s) => isStageLost(s)) ??
    stages.find((s) => s.stage_type === "lost") ??
    currentStage;

  function handleOpenLostModal(stageToMoveId?: string) {
    setTargetLostStageId(stageToMoveId || defaultLostStage?.id || lead.stage_id);
    setLostOpen(true);
  }

  function handleStageSelectChange(newStageId: string) {
    setStageId(newStageId);
    const targetStage = stages.find((s) => s.id === newStageId);
    if (targetStage && isStageLost(targetStage)) {
      handleOpenLostModal(targetStage.id);
    }
  }

  function handleMove() {
    const targetStage = stages.find((s) => s.id === stageId);
    if (targetStage && isStageLost(targetStage)) {
      handleOpenLostModal(targetStage.id);
      return;
    }

    startTransition(async () => {
      const result = await moveLead(lead.id, stageId, 0);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Lead movido.");
        router.refresh();
      }
    });
  }

  async function handleConfirmLost(payload: {
    leadId: string;
    lostStageId: string;
    position: number;
    lostReasonId: string;
    note: string;
    enableReactivation: boolean;
  }) {
    startTransition(async () => {
      const res = await markLeadLostFromKanban({
        leadId: payload.leadId,
        stageId: payload.lostStageId,
        position: payload.position,
        lostReasonId: payload.lostReasonId,
        note: payload.note,
        enableReactivation: payload.enableReactivation,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          payload.enableReactivation
            ? "Lead marcado como perdido e adicionado à Fila de Reativação Automática!"
            : "Lead marcado como perdido."
        );
        setLostOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isLost ? (
        <>
          <Label htmlFor="stageSelect" className="text-sm text-muted-foreground">
            Etapa
          </Label>
          <select
            id="stageSelect"
            value={stageId}
            onChange={(event) => handleStageSelectChange(event.target.value)}
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
          >
            {stages
              .filter((s) => !isStageLost(s))
              .map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
          </select>
          <Button
            size="sm"
            disabled={pending || stageId === lead.stage_id}
            onClick={handleMove}
          >
            Mover
          </Button>
        </>
      ) : null}

      {!lead.engaged_at && !isLost ? (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await markEngaged(lead.id);
              toast.success("Engajamento registrado.");
            })
          }
        >
          Registrar engajamento
        </Button>
      ) : null}

      <Label htmlFor="ownerSelect" className="text-sm text-muted-foreground">
        Responsável
      </Label>
      <select
        id="ownerSelect"
        defaultValue={lead.owner_id ?? ""}
        onChange={(event) =>
          startTransition(async () => {
            await setLeadOwner(lead.id, event.target.value || null);
            toast.success("Responsável atualizado.");
          })
        }
        className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
      >
        <option value="">Ninguém</option>
        {members.map((member) => (
          <option key={member.userId} value={member.userId}>
            {member.fullName}
          </option>
        ))}
      </select>

      {isLost ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenLostModal()}
            className="rounded-2xl gap-2 text-xs font-bold border-2 border-rose-400/80 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:border-rose-500/50 dark:text-rose-300 py-2.5 px-4 shadow-sm hover:shadow-md cursor-pointer transition-all"
          >
            <span>✏️</span>
            <span>Editar Motivo, Objeções & Contexto da IA</span>
          </Button>

          <div className="flex items-center gap-2 border-l border-border/80 pl-3">
            <select
              aria-label="Etapa para reativação"
              value={reactivateStage}
              onChange={(event) => setReactivateStage(event.target.value)}
              className="border-input h-9.5 rounded-xl border bg-transparent px-3 text-xs shadow-xs font-medium"
            >
              <option value="">Reativar para…</option>
              {stages
                .filter((s) => !isStageLost(s))
                .map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
            </select>
            <Button
              size="sm"
              disabled={pending || !reactivateStage}
              onClick={() =>
                startTransition(async () => {
                  const result = await reactivateLead(lead.id, reactivateStage);
                  if (result.error) toast.error(result.error);
                  else {
                    toast.success("Lead reativado — histórico preservado.");
                    router.refresh();
                  }
                })
              }
              className="rounded-xl text-xs h-9.5 px-4 font-semibold shadow-xs"
            >
              Reativar
            </Button>
          </div>
        </div>
      ) : (
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {/* Botão de Emergência Vermelho para Perda & Reativação IA */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => handleOpenLostModal()}
            className="rounded-2xl font-bold gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 text-white shadow-lg hover:shadow-xl ring-2 ring-rose-500/50 hover:ring-rose-500 border border-rose-400/40 text-xs py-2.5 px-4.5 cursor-pointer transition-all"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-xs">🚨</span>
            <span>Marcar como Perdido & Iniciar Reativação IA</span>
          </Button>

          {lead.archived_at ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                startTransition(async () => {
                  const r = await unarchiveLead(lead.id);
                  if (r.error) toast.error(r.error);
                  else {
                    toast.success("Lead de volta ao pipeline.");
                    router.refresh();
                  }
                })
              }
              className="rounded-xl text-xs h-9"
            >
              Desarquivar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setArquivarOpen(true)}
              className="rounded-xl text-xs h-9"
            >
              Arquivar
            </Button>
          )}
        </div>
      )}

      {/* Modal Interativo de Perda & Fila de Reativação */}
      {lostOpen ? (
        <MarkLostDialog
          lead={{
            id: lead.id,
            name: lead.name,
            potential_value: lead.potential_value,
            lost_reason_id: lead.lost_reason_id,
            lost_note: lead.lost_note,
          }}
          lostStageId={targetLostStageId}
          lostReasons={lostReasons}
          isOpen={true}
          onClose={() => setLostOpen(false)}
          onConfirm={handleConfirmLost}
        />
      ) : null}

      <Dialog open={arquivarOpen} onOpenChange={setArquivarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arquivar lead</DialogTitle>
            <DialogDescription>
              Sai do pipeline; conversa e histórico continuam acessíveis.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="motivoArquivo">Motivo (opcional)</Label>
              <Input
                id="motivoArquivo"
                value={motivoArquivo}
                onChange={(e) => setMotivoArquivo(e.target.value)}
                placeholder="Colega de profissão, fornecedor, pessoal…"
                maxLength={200}
              />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={naoComercial}
                onChange={(e) => setNaoComercial(e.target.checked)}
              />
              <span>
                <strong>Não é contato comercial.</strong> Mensagens futuras
                desse número não criam lead — a conversa continua no inbox.
                Evita rearquivar a mesma pessoa toda semana.
              </span>
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setArquivarOpen(false)}>
                Cancelar
              </Button>
              <Button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const r = await archiveLead(
                      lead.id,
                      motivoArquivo.trim() || null,
                      naoComercial,
                    );
                    if (r.error) toast.error(r.error);
                    else {
                      toast.success(
                        naoComercial
                          ? "Arquivado. Esse contato não vira mais lead."
                          : "Lead arquivado.",
                      );
                      setArquivarOpen(false);
                      router.refresh();
                    }
                  })
                }
              >
                Arquivar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
