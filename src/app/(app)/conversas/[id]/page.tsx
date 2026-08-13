import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { isWithinServiceWindow } from "@/lib/channels/meta";
import { createClient } from "@/lib/supabase/server";
import { channelLabel, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Composer } from "./composer";
import { MarkReadOnMount } from "./mark-read";

export const metadata: Metadata = { title: "Conversa" };

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

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select(
      "id, provider, lead_id, last_inbound_at, unread_count, leads (name, phone, email)",
    )
    .eq("id", id)
    .maybeSingle<{
      id: string;
      provider: string;
      lead_id: string | null;
      last_inbound_at: string | null;
      unread_count: number;
      leads: { name: string; phone: string | null; email: string | null } | null;
    }>();

  if (!conversation) notFound();

  const [{ data: messages }, { data: connection }] = await Promise.all([
    supabase
      .from("messages")
      .select("id, direction, status, body, media_type, sent_at")
      .eq("conversation_id", id)
      .order("sent_at", { ascending: true })
      .limit(200)
      .returns<MessageRow[]>(),
    supabase
      .from("channel_connections")
      .select("status")
      .eq("workspace_id", context.workspace.id)
      .eq("provider", conversation.provider)
      .maybeSingle(),
  ]);

  const withinWindow = isWithinServiceWindow(conversation.last_inbound_at);

  return (
    <section className="flex flex-col gap-4">
      <MarkReadOnMount
        conversationId={id}
        unreadCount={conversation.unread_count}
      />
      <Link
        href="/conversas"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Voltar às conversas
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-primary">
          {conversation.leads?.name ?? "Contato sem cadastro"}
        </h1>
        <Badge variant="secondary">
          {channelLabel(conversation.provider)}
        </Badge>
        {conversation.lead_id ? (
          <Link
            href={`/pipeline/lead/${conversation.lead_id}`}
            className="text-sm underline underline-offset-4"
          >
            Abrir lead
          </Link>
        ) : null}
      </div>

      <div className="flex flex-col rounded-lg border bg-card">
        <ol className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto p-4">
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
                  {message.body ??
                    `[${message.media_type ?? "mídia"} recebida]`}
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
            <li className="text-center text-sm text-muted-foreground">
              Nenhuma mensagem nesta conversa.
            </li>
          ) : null}
        </ol>

        <Composer
          conversationId={id}
          withinWindow={withinWindow}
          channelConnected={connection?.status === "connected"}
        />
      </div>
    </section>
  );
}
