"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { cancelScheduledMessage } from "../actions";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";

export interface ScheduledMessage {
  id: string;
  body: string;
  scheduled_for: string;
  status: "pending" | "sent" | "cancelled" | "failed";
  error: string | null;
}

const ROTULOS: Record<ScheduledMessage["status"], string> = {
  pending: "agendada",
  sent: "enviada",
  cancelled: "cancelada",
  failed: "falhou",
};

/**
 * Mensagens que ainda vão sair. Só as pendentes aparecem: as já enviadas
 * viram mensagem normal na conversa, e repetir aqui seria ruído.
 */
export function ScheduledList({
  conversationId,
  scheduled,
}: {
  conversationId: string;
  scheduled: ScheduledMessage[];
}) {
  const [pending, startTransition] = useTransition();
  const aguardando = scheduled.filter((s) => s.status === "pending");

  if (aguardando.length === 0) return null;

  return (
    <div className="border-t bg-muted/40 px-4 py-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        Agendadas ({aguardando.length})
      </p>
      <ul className="flex flex-col gap-2">
        {aguardando.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate">{item.body}</p>
              <p className="text-xs text-brass-foreground">
                sai em {formatDateTime(item.scheduled_for)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const r = await cancelScheduledMessage(item.id, conversationId);
                  if (r.error) toast.error(r.error);
                  else toast.success("Agendamento cancelado.");
                })
              }
            >
              Cancelar
            </Button>
          </li>
        ))}
      </ul>
      <p className="sr-only">
        {ROTULOS.pending}: {aguardando.length}
      </p>
    </div>
  );
}
