"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Simulador de mensagem recebida — visível apenas em desenvolvimento. */
export function MessageSimulator() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [from, setFrom] = useState("5567999990001");
  const [name, setName] = useState("Contato Simulado");
  const [text, setText] = useState("Oi! Vim pelo Instagram, queria informações.");

  return (
    <div className="flex flex-col gap-3 rounded-md border border-dashed p-4">
      <p className="text-sm font-medium">
        Simulador de mensagem (apenas desenvolvimento)
      </p>
      <p className="text-xs text-muted-foreground">
        Exercita o caminho completo — normalização, idempotência, criação do
        lead e inbox — sem credenciais da Meta. Indisponível em produção.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="simFrom" className="text-xs">
            Telefone/ID
          </Label>
          <Input
            id="simFrom"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="simName" className="text-xs">
            Nome
          </Label>
          <Input
            id="simName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="simText" className="text-xs">
            Mensagem
          </Label>
          <Input
            id="simText"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const response = await fetch("/api/dev/simulate-message", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ provider: "whatsapp", from, name, text }),
            });
            if (response.ok) {
              toast.success("Mensagem simulada — veja em Conversas.");
              router.refresh();
            } else {
              toast.error("Falha ao simular mensagem.");
            }
          })
        }
      >
        {pending ? "Simulando…" : "Simular mensagem recebida"}
      </Button>
    </div>
  );
}
