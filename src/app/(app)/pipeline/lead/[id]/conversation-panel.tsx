import Link from "next/link";
import { isWithinServiceWindow } from "@/lib/channels/meta";
import { createClient } from "@/lib/supabase/server";
import { channelLabel, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Composer } from "@/app/(app)/conversas/[id]/composer";

/**
 * A conversa dentro da página do lead.
 *
 * Responder é a ação mais frequente do dia a dia: obrigar a trocar de tela
 * para isso quebrava o fluxo. Aqui o chat fica no centro, com o cadastro de um
 * lado e o processo comercial do outro.
 */

interface MessageRow {
  id: string;
  direction: "inbound" | "outbound";
  status: string;
  body: string | null;
  media_type: string | null;
  sent_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "enviando",
  sent: "enviada",
  delivered: "entregue",
  read: "lida",
  failed: "falhou",
};

export async function ConversationPanel({
  leadId,
  workspaceId,
}: {
  leadId: string;
  workspaceId: string;
}) {
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, provider, last_inbound_at")
    .eq("lead_id", leadId)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle<{
      id: string;
      provider: string;
      last_inbound_at: string | null;
    }>();

  if (!conversation) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-lg border border-dashed bg-card p-8 text-center">
        <p className="font-medium">Nenhuma conversa com este lead.</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Quando ele mandar uma mensagem pelo WhatsApp, ela aparece aqui e você
          responde sem sair desta tela.
        </p>
      </div>
    );
  }

  const [{ data: messages }, { data: connection }] = await Promise.all([
    supabase
      .from("messages")
      .select("id, direction, status, body, media_type, sent_at")
      .eq("conversation_id", conversation.id)
      .order("sent_at", { ascending: true })
      .limit(200)
      .returns<MessageRow[]>(),
    supabase
      .from("channel_connections")
      .select("status")
      .eq("workspace_id", workspaceId)
      .eq("provider", conversation.provider)
      .maybeSingle(),
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-card">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <h2 className="text-sm font-medium">Conversa</h2>
        <Badge variant="secondary" className="text-[10px]">
          {channelLabel(conversation.provider)}
        </Badge>
        <Link
          href={`/conversas/${conversation.id}`}
          className="ml-auto text-xs text-muted-foreground hover:underline"
        >
          Abrir no inbox
        </Link>
      </header>

      <ol className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {(messages ?? []).map((message) => (
          <li
            key={message.id}
            className={`flex ${
              message.direction === "outbound" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.direction === "outbound"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">
                {message.body ?? `[${message.media_type ?? "mídia"} recebida]`}
              </p>
              <p
                className={`mt-1 text-[10px] ${
                  message.direction === "outbound"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {formatDateTime(message.sent_at)}
                {message.direction === "outbound"
                  ? ` · ${STATUS_LABELS[message.status] ?? message.status}`
                  : ""}
              </p>
            </div>
          </li>
        ))}
        {(messages ?? []).length === 0 ? (
          <li className="m-auto text-sm text-muted-foreground">
            Nenhuma mensagem nesta conversa.
          </li>
        ) : null}
      </ol>

      <Composer
        conversationId={conversation.id}
        withinWindow={isWithinServiceWindow(conversation.last_inbound_at)}
        channelConnected={connection?.status === "connected"}
      />
    </div>
  );
}
