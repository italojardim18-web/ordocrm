import Link from "next/link";
import { isWithinServiceWindow } from "@/lib/channels/meta";
import { createClient } from "@/lib/supabase/server";
import { channelLabel, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { MessageMedia } from "@/components/message-media";
import { Composer } from "@/app/(app)/conversas/[id]/composer";
import {
  ScheduledList,
  type ScheduledMessage,
} from "@/app/(app)/conversas/[id]/scheduled-list";

interface MessageRow {
  id: string;
  direction: "inbound" | "outbound";
  status: string;
  body: string | null;
  media_type: string | null;
  media_path: string | null;
  media_mime: string | null;
  media_filename: string | null;
  media_size: number | null;
  media_duration_seconds: number | null;
  transcript: string | null;
  transcript_status: string | null;
  transcript_error: string | null;
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
    .eq("workspace_id", workspaceId)
    .eq("lead_id", leadId)
    .maybeSingle<{
      id: string;
      provider: string;
      last_inbound_at: string | null;
    }>();

  if (!conversation) {
    return (
      <div className="ordo-card flex min-h-0 flex-1 flex-col items-center justify-center p-8 text-center">
        <span className="text-3xl mb-2">💬</span>
        <p className="font-semibold text-sm">Nenhuma conversa vinculada</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          As mensagens trocadas pelo WhatsApp ou Instagram aparecem aqui automaticamente.
        </p>
      </div>
    );
  }

  const [{ data: messages }, { data: connection }, { data: scheduled }] =
    await Promise.all([
      supabase
        .from("messages")
        .select(
          "id, direction, status, body, media_type, media_path, media_mime, media_filename, media_size, media_duration_seconds, transcript, transcript_status, transcript_error, sent_at",
        )
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
      supabase
        .from("scheduled_messages")
        .select("id, body, scheduled_for, status, error")
        .eq("conversation_id", conversation.id)
        .eq("status", "pending")
        .order("scheduled_for")
        .returns<ScheduledMessage[]>(),
    ]);

  return (
    <div className="ordo-card flex min-h-0 flex-1 flex-col overflow-hidden bg-card">
      <header className="flex items-center gap-2.5 border-b border-border/60 px-5 py-3.5 bg-card/80">
        <span className="text-sm font-bold text-foreground">Conversa</span>
        <Badge variant="secondary" className="rounded-full text-[10px] px-2.5 font-medium">
          {channelLabel(conversation.provider)}
        </Badge>
        <Link
          href={`/conversas/${conversation.id}`}
          className="ml-auto rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium text-primary hover:bg-secondary transition-colors"
        >
          Abrir no inbox ↗
        </Link>
      </header>

      <ol className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 bg-muted/15">
        {(messages ?? []).map((message) => (
          <li
            key={message.id}
            className={`flex ${
              message.direction === "outbound" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-2xs ${
                message.direction === "outbound"
                  ? "bg-primary text-primary-foreground rounded-br-xs"
                  : "bg-card border border-border/70 text-foreground rounded-bl-xs"
              }`}
            >
              {message.media_type ? (
                <div className="mb-1.5">
                  <MessageMedia
                    path={message.media_path}
                    mime={message.media_mime}
                    filename={message.media_filename}
                    size={message.media_size}
                    duration={message.media_duration_seconds}
                    legenda={message.body}
                    transcript={message.transcript}
                    transcriptStatus={message.transcript_status}
                    transcriptError={message.transcript_error}
                  />
                </div>
              ) : null}
              {message.body ? (
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.body}</p>
              ) : null}
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
          <li className="m-auto text-xs text-muted-foreground italic">
            Nenhuma mensagem nesta conversa ainda.
          </li>
        ) : null}
      </ol>

      <ScheduledList
        conversationId={conversation.id}
        scheduled={scheduled ?? []}
      />

      <footer className="border-t border-border/60 p-3 bg-card">
        <Composer
          conversationId={conversation.id}
          channelConnected={connection?.status === "connected"}
          withinWindow={isWithinServiceWindow(conversation.last_inbound_at)}
        />
      </footer>
    </div>
  );
}
