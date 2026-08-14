"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  archiveLead,
  unarchiveLead,
  markEngaged,
  markLost,
  moveLead,
  reactivateLead,
  setLeadOwner,
  type SimpleState,
} from "../../actions";
import type { LeadDetail, LostReason, Member, Stage } from "@/lib/crm/types";
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
  const [stageId, setStageId] = useState(lead.stage_id);
  const [lostOpen, setLostOpen] = useState(false);
  const [arquivarOpen, setArquivarOpen] = useState(false);
  const [naoComercial, setNaoComercial] = useState(false);
  const [motivoArquivo, setMotivoArquivo] = useState("");
  const [reactivateStage, setReactivateStage] = useState("");
  const [pending, startTransition] = useTransition();

  const currentStage = stages.find((s) => s.id === lead.stage_id);
  const isLost = currentStage?.stage_type === "lost";

  const [lostState, lostAction, lostPending] = useActionState<
    SimpleState,
    FormData
  >(
    async (prev, formData) => {
      const result = await markLost.bind(null, lead.id)(prev, formData);
      if (result.done) {
        toast.success("Lead marcado como perdido.");
        setLostOpen(false);
      }
      return result;
    },
    {},
  );

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
            onChange={(event) => setStageId(event.target.value)}
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
          >
            {stages
              .filter((s) => s.stage_type !== "lost")
              .map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
          </select>
          <Button
            size="sm"
            disabled={pending || stageId === lead.stage_id}
            onClick={() =>
              startTransition(async () => {
                const result = await moveLead(lead.id, stageId, 0);
                if (result.error) toast.error(result.error);
                else toast.success("Lead movido.");
              })
            }
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
        <div className="flex items-center gap-2">
          <select
            aria-label="Etapa para reativação"
            value={reactivateStage}
            onChange={(event) => setReactivateStage(event.target.value)}
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
          >
            <option value="">Reativar para…</option>
            {stages
              .filter((s) => s.stage_type !== "lost")
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
                else toast.success("Lead reativado — histórico preservado.");
              })
            }
          >
            Reativar
          </Button>
        </div>
      ) : (
        <div className="ml-auto flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setLostOpen(true)}
        >
          Marcar como perdido
        </Button>
        {lead.archived_at ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              startTransition(async () => {
                const r = await unarchiveLead(lead.id);
                if (r.error) toast.error(r.error);
                else toast.success("Lead de volta ao pipeline.");
              })
            }
          >
            Desarquivar
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setArquivarOpen(true)}
          >
            Arquivar
          </Button>
        )}
        </div>
      )}

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

      <Dialog open={lostOpen} onOpenChange={setLostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como perdido</DialogTitle>
            <DialogDescription>
              O motivo é obrigatório e alimenta o relatório de perdas. O lead
              pode ser reativado depois, com o histórico preservado.
            </DialogDescription>
          </DialogHeader>
          <form action={lostAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="lostReason">Motivo *</Label>
              <select
                id="lostReason"
                name="reasonId"
                required
                defaultValue=""
                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
              >
                <option value="" disabled>
                  Selecione…
                </option>
                {lostReasons.map((reason) => (
                  <option key={reason.id} value={reason.id}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lostNote">Observação (opcional)</Label>
              <Input id="lostNote" name="note" maxLength={300} />
            </div>
            {lostState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {lostState.error}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLostOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={lostPending}>
                {lostPending ? "Salvando…" : "Confirmar perda"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
