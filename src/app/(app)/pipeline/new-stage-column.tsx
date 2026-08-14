"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStageAtEnd } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Coluna "+" no fim do quadro.
 *
 * Criar etapa vivia em Configurações → Pipeline, longe de onde a vontade
 * aparece: é olhando o quadro que se percebe a falta de uma coluna.
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

  // Só admin cria etapa; para o assistente a coluna simplesmente não existe.
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
      <div className="w-64 shrink-0">
        <button
          type="button"
          onClick={() => setAbrindo(true)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span aria-hidden className="text-lg leading-none">
            +
          </span>
          Nova etapa
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-64 shrink-0 flex-col gap-2 rounded-lg border bg-card p-3">
      <Input
        autoFocus
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") criar();
          if (e.key === "Escape") setAbrindo(false);
        }}
        placeholder="Nome da etapa"
        maxLength={80}
        aria-label="Nome da nova etapa"
      />
      <p className="text-xs text-muted-foreground">
        Entra no fim do quadro. Os relatórios seguem usando as etapas
        semânticas — esta é organizacional.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setAbrindo(false)}>
          Cancelar
        </Button>
        <Button size="sm" onClick={criar} disabled={pendente || !nome.trim()}>
          {pendente ? "Criando…" : "Criar"}
        </Button>
      </div>
    </div>
  );
}
