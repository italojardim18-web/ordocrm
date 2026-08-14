"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStageAtEnd } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Coluna "+" no fim do quadro Kanban.
 *
 * Permite ao admin criar uma nova etapa no final do funil de vendas.
 */
export function NewStageColumn({
  pipelineId,
  isAdmin,
}: {
  pipelineId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [abrindo, setAbrindo] = useState(false);
  const [nome, setNome] = useState("");
  const [pendente, startTransition] = useTransition();

  if (!isAdmin) return null;

  function criar() {
    if (!nome.trim()) return;
    startTransition(async () => {
      const r = await createStageAtEnd(pipelineId, nome);
      if (r.error) {
        toast.error(r.error);
        return;
      }
      toast.success("Etapa criada.");
      setNome("");
      setAbrindo(false);
      router.refresh();
    });
  }

  if (!abrindo) {
    return (
      <div className="w-72 shrink-0 flex flex-col">
        <button
          type="button"
          onClick={() => setAbrindo(true)}
          className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border/80 bg-muted/20 text-sm font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-card hover:text-primary hover:shadow-xs focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-secondary text-base leading-none text-primary">
            +
          </span>
          <span>Nova etapa do funil</span>
        </button>
      </div>
    );
  }

  return (
    <div className="ordo-card-compact flex w-72 shrink-0 flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">Nova etapa</span>
        <button
          type="button"
          onClick={() => setAbrindo(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <Input
        autoFocus
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") criar();
          if (e.key === "Escape") setAbrindo(false);
        }}
        placeholder="Ex.: Reunião realizada..."
        maxLength={80}
        aria-label="Nome da nova etapa"
        className="rounded-xl text-xs"
      />
      <p className="text-[11px] text-muted-foreground leading-tight">
        A nova etapa entra no final do pipeline.
      </p>
      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAbrindo(false)}
          className="rounded-full text-xs"
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={criar}
          disabled={pendente || !nome.trim()}
          className="rounded-full px-4 text-xs font-semibold"
        >
          {pendente ? "Criando…" : "Criar coluna"}
        </Button>
      </div>
    </div>
  );
}
