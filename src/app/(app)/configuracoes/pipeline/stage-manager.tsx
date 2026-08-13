"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addStage,
  archiveStage,
  deleteStage,
  renameStage,
  swapStagePositions,
  type StageState,
} from "./actions";
import type { Stage } from "@/lib/crm/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STAGE_TYPE_LABELS: Record<string, string> = {
  new: "Novo lead",
  qualification: "Qualificação",
  follow_up_pre_session: "Follow-up pré-sessão",
  alignment_session: "Sessão de alinhamento",
  follow_up_post_session: "Follow-up pós-sessão",
  won: "Venda",
  lost: "Perda",
  custom: "Personalizada",
};

function RenameForm({ stage, onDone }: { stage: Stage; onDone: () => void }) {
  const action = renameStage.bind(null, stage.id);
  const [state, formAction, pending] = useActionState<StageState, FormData>(
    async (prev, formData) => {
      const result = await action(prev, formData);
      if (result.done) {
        toast.success("Etapa renomeada. Relatórios não são afetados.");
        onDone();
      }
      return result;
    },
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="stageName">Nome visível</Label>
        <Input id="stageName" name="name" defaultValue={stage.name} required />
        <p className="text-xs text-muted-foreground">
          O tipo interno ({STAGE_TYPE_LABELS[stage.stage_type]}) permanece — as
          métricas continuam corretas.
        </p>
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Salvando…" : "Renomear"}
      </Button>
    </form>
  );
}

function AddForm({
  pipelineId,
  onDone,
}: {
  pipelineId: string;
  onDone: () => void;
}) {
  const action = addStage.bind(null, pipelineId);
  const [state, formAction, pending] = useActionState<StageState, FormData>(
    async (prev, formData) => {
      const result = await action(prev, formData);
      if (result.done) {
        toast.success("Etapa criada.");
        onDone();
      }
      return result;
    },
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="newStageName">Nome</Label>
        <Input id="newStageName" name="name" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="newStageType">Tipo semântico (para relatórios)</Label>
        <select
          id="newStageType"
          name="stageType"
          defaultValue="custom"
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
        >
          {Object.entries(STAGE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Criando…" : "Criar etapa"}
      </Button>
    </form>
  );
}

export function StageManager({
  pipelineId,
  pipelineName,
  stages,
  leadCounts,
}: {
  pipelineId: string;
  pipelineName: string;
  stages: Stage[];
  leadCounts: Record<string, number>;
}) {
  const [renaming, setRenaming] = useState<Stage | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<Stage | null>(null);
  const [targetStageId, setTargetStageId] = useState("");
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Pipeline: <strong>{pipelineName}</strong>
        </p>
        <Button onClick={() => setAdding(true)}>Nova etapa</Button>
      </div>

      <Card>
        <CardContent>
          <ul className="divide-y">
            {stages.map((stage, index) => (
              <li
                key={stage.id}
                className="flex flex-wrap items-center gap-2 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Mover ${stage.name} para cima`}
                    disabled={index === 0 || pending}
                    onClick={() =>
                      run(() =>
                        swapStagePositions(stage.id, stages[index - 1].id),
                      )
                    }
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Mover ${stage.name} para baixo`}
                    disabled={index === stages.length - 1 || pending}
                    onClick={() =>
                      run(() =>
                        swapStagePositions(stage.id, stages[index + 1].id),
                      )
                    }
                  >
                    ↓
                  </Button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{stage.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Tipo: {STAGE_TYPE_LABELS[stage.stage_type]} ·{" "}
                    {leadCounts[stage.id] ?? 0} lead(s)
                  </p>
                </div>
                <Badge variant="secondary">
                  {STAGE_TYPE_LABELS[stage.stage_type]}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRenaming(stage)}
                >
                  Renomear
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    run(async () => {
                      const result = await archiveStage(stage.id);
                      if (!result.error) toast.success("Etapa arquivada.");
                      return result;
                    })
                  }
                >
                  Arquivar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    setDeleting(stage);
                    setTargetStageId("");
                  }}
                >
                  Excluir
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog
        open={renaming !== null}
        onOpenChange={(open) => !open && setRenaming(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear etapa</DialogTitle>
          </DialogHeader>
          {renaming ? (
            <RenameForm stage={renaming} onDone={() => setRenaming(null)} />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova etapa</DialogTitle>
          </DialogHeader>
          <AddForm pipelineId={pipelineId} onDone={() => setAdding(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir etapa</DialogTitle>
            <DialogDescription>
              {deleting && (leadCounts[deleting.id] ?? 0) > 0
                ? `A etapa "${deleting.name}" tem ${leadCounts[deleting.id]} lead(s). Escolha para onde eles vão.`
                : `Confirma excluir a etapa "${deleting?.name}"? Esta ação não pode ser desfeita.`}
            </DialogDescription>
          </DialogHeader>
          {deleting && (leadCounts[deleting.id] ?? 0) > 0 ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="targetStage">Etapa de destino</Label>
              <select
                id="targetStage"
                value={targetStageId}
                onChange={(event) => setTargetStageId(event.target.value)}
                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
              >
                <option value="">Selecione…</option>
                {stages
                  .filter((s) => s.id !== deleting.id)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={
                pending ||
                (deleting !== null &&
                  (leadCounts[deleting.id] ?? 0) > 0 &&
                  !targetStageId)
              }
              onClick={() => {
                if (!deleting) return;
                run(async () => {
                  const result = await deleteStage(
                    deleting.id,
                    targetStageId || null,
                  );
                  if (!result.error) {
                    toast.success("Etapa excluída.");
                    setDeleting(null);
                  }
                  return result;
                });
              }}
            >
              Excluir etapa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
