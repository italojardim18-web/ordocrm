"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import { sendMessage, type SendState } from "../actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function Composer({
  conversationId,
  withinWindow,
  channelConnected,
}: {
  conversationId: string;
  withinWindow: boolean;
  channelConnected: boolean;
}) {
  const [state, formAction, pending] = useActionState<SendState, FormData>(
    async (prev, formData) => {
      const result = await sendMessage(conversationId, prev, formData);
      if (result.done) toast.success("Mensagem enfileirada para envio.");
      return result;
    },
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-2 border-t p-4">
      <Label htmlFor="messageBody" className="sr-only">
        Mensagem
      </Label>
      <textarea
        id="messageBody"
        name="body"
        rows={3}
        required
        placeholder="Escreva sua resposta…"
        className="border-input rounded-md border bg-transparent p-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
      />

      {!withinWindow ? (
        <p className="text-xs text-brass-foreground">
          <strong>Fora da janela de 24 horas.</strong> A plataforma só aceita
          mensagem de texto livre até 24h após a última mensagem do contato;
          depois disso é preciso usar um template aprovado. A mensagem ficará na
          fila e pode ser recusada pelo canal.
        </p>
      ) : null}

      {!channelConnected ? (
        <p className="text-xs text-muted-foreground">
          Canal ainda não conectado — a mensagem fica registrada no CRM e na
          fila de saída, sem envio real.
        </p>
      ) : null}

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="sm" disabled={pending} className="self-end">
        {pending ? "Enviando…" : "Enviar"}
      </Button>
    </form>
  );
}
