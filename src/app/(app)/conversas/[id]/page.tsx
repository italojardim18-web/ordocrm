import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { isWithinServiceWindow } from "@/lib/channels/meta";
import { createClient } from "@/lib/supabase/server";
import { channelLabel, formatBRL, formatDate, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { MessageMedia } from "@/components/message-media";
import { Button } from "@/components/ui/button";
import { Composer } from "./composer";
import { ScheduledList, type ScheduledMessage } from "./scheduled-list";
import { MarkReadOnMount } from "./mark-read";
import { RealtimeMessages } from "./realtime-messages";

export const metadata: Metadata = { title: "Conversa" };

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

interface ConversationItem {
  id: string;
  provider: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
  leads: { name: string } | null;
}

interface LeadContext {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  channel: string;
  potential_value: number | null;
  created_at: string;
  engaged_at: string | null;
  pipeline_stages: { name: string } | null;
  lead_product_interests: { products: { name: string } | null }[];
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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const selectedChannel = typeof sp.linha === "string" ? sp.linha : null;

  const context = await getSessionContext();
  if (!context) redirect("/login");

  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, provider, lead_id, last_inbound_at, unread_count, channel_connection_id")
    .eq("id", id)
    .maybeSingle<{
      id: string;
      provider: string;
      lead_id: string | null;
      last_inbound_at: string | null;
      unread_count: number;
      channel_connection_id: string | null;
    }>();

  if (!conversation) notFound();

  const [
    { data: messages },
    { data: connection },
    { data: todas },
    { data: lead },
    { data: scheduled },
  ] = await Promise.all([
      supabase
        .from("messages")
        .select("id, direction, status, body, media_type, media_path, media_mime, media_filename, media_size, media_duration_seconds, transcript, transcript_status, transcript_error, sent_at")
        .eq("conversation_id", id)
        .order("sent_at", { ascending: true })
        .limit(200)
        .returns<MessageRow[]>(),
      (conversation as any).channel_connection_id
        ? supabase
            .from("channel_connections")
            .select("status")
            .eq("id", (conversation as any).channel_connection_id)
            .maybeSingle()
        : supabase
            .from("channel_connections")
            .select("status")
            .eq("workspace_id", context.workspace.id)
            .eq("provider", conversation.provider)
            .eq("status", "connected")
            .limit(1)
            .maybeSingle(),
      (() => {
        let q = supabase
          .from("conversations")
          .select(
            "id, provider, last_message_at, last_message_preview, unread_count, channel_connection_id, leads (name)",
          )
          .eq("workspace_id", context.workspace.id)
          .order("last_message_at", { ascending: false, nullsFirst: false })
          .limit(50);

        if (selectedChannel) {
          q = q.eq("channel_connection_id", selectedChannel);
        }

        return q.returns<ConversationItem[]>();
      })(),
      conversation.lead_id
        ? supabase
            .from("leads")
            .select(
              "id, name, phone, email, city, state, channel, potential_value, created_at, engaged_at, pipeline_stages (name), lead_product_interests (products (name))",
            )
            .eq("id", conversation.lead_id)
            .maybeSingle<LeadContext>()
        : Promise.resolve({ data: null }),
      supabase
        .from("scheduled_messages")
        .select("id, body, scheduled_for, status, error")
        .eq("conversation_id", id)
        .eq("status", "pending")
        .order("scheduled_for")
        .returns<ScheduledMessage[]>(),
    ]);

  const withinWindow = isWithinServiceWindow(conversation.last_inbound_at);
  const titulo = lead?.name ?? "Contato sem cadastro";

  return (
    <section className="flex h-[calc(100svh-7rem)] min-h-0 gap-4">
      <MarkReadOnMount
        conversationId={id}
        unreadCount={conversation.unread_count}
      />
      <RealtimeMessages conversationId={id} />

      {/* Coluna esquerda: as outras conversas. */}
      <aside className="ordo-card hidden w-64 shrink-0 flex-col overflow-hidden bg-card md:flex xl:w-72">
        <div className="border-b border-border/60 px-4 py-3.5 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Conversas
          </h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
            {todas?.length ?? 0}
          </span>
        </div>
        <ul className="min-h-0 flex-1 divide-y divide-border/40 overflow-y-auto p-1.5">
          {(todas ?? []).map((item) => {
            const ativa = item.id === id;
            return (
              <li key={item.id}>
                <Link
                  href={`/conversas/${item.id}${selectedChannel ? `?linha=${selectedChannel}` : ""}`}
                  aria-current={ativa ? "page" : undefined}
                  className={`block rounded-xl px-3.5 py-3 transition-colors ${
                    ativa
                      ? "bg-secondary text-secondary-foreground font-medium shadow-2xs"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="truncate text-xs font-semibold">
                      {item.leads?.name ?? "Sem cadastro"}
                    </span>
                    {item.unread_count > 0 ? (
                      <span className="ml-auto rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground">
                        {item.unread_count}
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {item.last_message_preview ?? "—"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Centro: o chat principal */}
      <div className="ordo-card flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-card">
        <header className="flex flex-wrap items-center gap-2.5 border-b border-border/60 px-5 py-3.5 bg-card/80">
          <Link
            href="/conversas"
            className="text-xs text-muted-foreground hover:underline md:hidden"
          >
            ← Voltar
          </Link>
          <h1 className="truncate font-heading text-base font-bold text-foreground tracking-tight">
            {titulo}
          </h1>
          <Badge variant="secondary" className="rounded-full text-[10px] px-2.5 font-medium">
            {channelLabel(conversation.provider)}
          </Badge>
        </header>

        <ol className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5 bg-muted/15">
          {(messages ?? []).map((message) => (
            <li
              key={message.id}
              className={`flex ${
                message.direction === "outbound" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-2xs ${
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
              Nenhuma mensagem nesta conversa.
            </li>
          ) : null}
        </ol>

        <ScheduledList conversationId={id} scheduled={scheduled ?? []} />

        <Composer
          conversationId={id}
          withinWindow={withinWindow}
          channelConnected={connection?.status === "connected"}
        />
      </div>

      {/* Coluna direita: o contexto comercial, à mão enquanto se responde. */}
      <aside className="hidden w-60 shrink-0 flex-col gap-3 overflow-y-auto rounded-lg border bg-card p-4 lg:flex xl:w-72">
        <div>
          <h2 className="text-sm font-medium">{titulo}</h2>
          {lead?.pipeline_stages?.name ? (
            <Badge variant="outline" className="mt-1.5 text-[10px]">
              {lead.pipeline_stages.name}
            </Badge>
          ) : null}
        </div>

        {lead ? (
          <>
            <dl className="flex flex-col gap-2 border-t pt-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Telefone</dt>
                <dd>{lead.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">E-mail</dt>
                <dd className="truncate">{lead.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Origem</dt>
                <dd>{channelLabel(lead.channel)}</dd>
              </div>
              {lead.city ? (
                <div>
                  <dt className="text-xs text-muted-foreground">Cidade</dt>
                  <dd>
                    {lead.city}
                    {lead.state ? `/${lead.state}` : ""}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs text-muted-foreground">Valor potencial</dt>
                <dd>{formatBRL(lead.potential_value)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Lead desde</dt>
                <dd>{formatDate(lead.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Engajou</dt>
                <dd>{lead.engaged_at ? formatDate(lead.engaged_at) : "ainda não"}</dd>
              </div>
            </dl>

            {lead.lead_product_interests.length > 0 ? (
              <div className="border-t pt-3">
                <p className="mb-1.5 text-xs text-muted-foreground">
                  Produtos de interesse
                </p>
                <div className="flex flex-wrap gap-1">
                  {lead.lead_product_interests.map((i, n) => (
                    <Badge key={n} variant="secondary" className="text-[10px]">
                      {i.products?.name ?? "—"}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <Button asChild size="sm" variant="outline" className="mt-auto">
              <Link href={`/pipeline/lead/${lead.id}`}>Abrir lead completo</Link>
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Esta conversa ainda não está ligada a um lead.
          </p>
        )}
      </aside>
    </section>
  );
}
