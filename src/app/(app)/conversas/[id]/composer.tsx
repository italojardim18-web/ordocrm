"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import {
  scheduleMessage,
  sendMessage,
  type ScheduleState,
  type SendState,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Sugere um horário padrão: amanhã de manhã, hora cheia. */
function amanhaDeManha(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Fora de 8h–21h a mensagem chega em horário incomum para contato comercial. */
function horarioIncomum(valor: string): boolean {
  if (!valor) return false;
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return false;
  const h = d.getHours();
  return h < 8 || h >= 21;
}

export function Composer({
  conversationId,
  withinWindow,
  channelConnected,
}: {
  conversationId: string;
  withinWindow: boolean;
  channelConnected: boolean;
}) {
  const [agendando, setAgendando] = useState(false);
  const [quando, setQuando] = useState(amanhaDeManha);

  const [state, formAction, pending] = useActionState<SendState, FormData>(
    async (prev, formData) => {
      const result = await sendMessage(conversationId, prev, formData);
      if (result.done) toast.success("Mensagem enfileirada para envio.");
      return result;
    },
    {},
  );

  const [agState, agAction, agPending] = useActionState<ScheduleState, FormData>(
    async (prev, formData) => {
      const result = await scheduleMessage(conversationId, prev, formData);
      if (result.done) {
        toast.success("Mensagem agendada.");
        setAgendando(false);
      }
      return result;
    },
    {},
  );

  const emUso = agendando ? agState : state;

  return (
    <form
      action={agendando ? agAction : formAction}
      className="flex flex-col gap-2 border-t p-4"
    >
      <Label htmlFor="messageBody" className="sr-only">
        Mensagem
      </Label>
      <textarea
        id="messageBody"
        name="body"
        rows={2}
        required
        placeholder={
          agendando
            ? "Escreva a mensagem que será enviada na data escolhida…"
            : "Escreva sua resposta… (Enter envia, Shift+Enter quebra linha)"
        }
        onKeyDown={(event) => {
          // No modo agendamento o Enter não envia: falta escolher o horário.
          if (!agendando && event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        className="border-input rounded-md border bg-transparent p-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
      />

      {agendando ? (
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="scheduledFor" className="text-xs">
              Enviar em
            </Label>
            <Input
              id="scheduledFor"
              name="scheduledFor"
              type="datetime-local"
              required
              value={quando}
              onChange={(e) => setQuando(e.target.value)}
              className="w-56"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Sai sozinha no horário escolhido, desde que o ORDO esteja ligado. Se
            atrasar mais de 4 horas, não é enviada — chegaria fora de contexto.
          </p>
          {horarioIncomum(quando) ? (
            <p className="w-full text-xs text-brass-foreground">
              Esse horário está fora do expediente (8h–21h). A mensagem vai
              chegar assim mesmo — confirme se é isso que você quer.
            </p>
          ) : null}
        </div>
      ) : null}

      {!withinWindow && !agendando ? (
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

      {emUso.error ? (
        <p role="alert" className="text-sm text-destructive">
          {emUso.error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setAgendando((v) => !v)}
        >
          {agendando ? "Enviar agora" : "Agendar…"}
        </Button>
        <Button type="submit" size="sm" disabled={pending || agPending}>
          {agendando
            ? agPending
              ? "Agendando…"
              : "Agendar"
            : pending
              ? "Enviando…"
              : "Enviar"}
        </Button>
      </div>
    </form>
  );
}
