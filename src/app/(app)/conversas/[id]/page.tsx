import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { isWithinServiceWindow } from "@/lib/channels/meta";
import { createClient } from "@/lib/supabase/server";
import { channelLabel, formatBRL, formatDate, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, provider, lead_id, last_inbound_at, unread_count")
    .eq("id", id)
    .maybeSingle<{
      id: string;
      provider: string;
      lead_id: string | null;
      last_inbound_at: string | null;
      unread_count: number;
    }>();

  if (!conversation) notFound();

  const [{ data: messages }, { data: connection }, { data: todas }, { data: lead }] =
    await Promise.all([
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
      supabase
        .from("conversations")
        .select(
          "id, provider, last_message_at, last_message_preview, unread_count, leads (name)",
        )
        .eq("workspace_id", context.workspace.id)
        .order("last_message_at", { ascending: false, nullsFirst: false })
        .limit(50)
        .returns<ConversationItem[]>(),
      conversation.lead_id
        ? supabase
            .from("leads")
            .select(
              "id, name, phone, email, city, state, channel, potential_value, created_at, engaged_at, pipeline_stages (name), lead_product_interests (products (name))",
            )
            .eq("id", conversation.lead_id)
            .maybeSingle<LeadContext>()
        : Promise.resolve({ data: null }),
    ]);

  const withinWindow = isWithinServiceWindow(conversation.last_inbound_at);
  const titulo = lead?.name ?? "Contato sem cadastro";

  return (
    <section className="flex h-[calc(100svh-7rem)] min-h-0 gap-4">
      <MarkReadOnMount
        conversationId={id}
        unreadCount={conversation.unread_count}
      />

      {/* Coluna esquerda: as outras conversas. Some no celular, onde a lista
          é uma tela própria. */}
      <aside className="hidden w-64 shrink-0 flex-col rounded-lg border bg-card lg:flex">
        <h2 className="border-b px-4 py-3 text-sm font-medium">Conversas</h2>
        <ul className="min-h-0 flex-1 divide-y overflow-y-auto">
          {(todas ?? []).map((item) => {
            const ativa = item.id === id;
            return (
              <li key={item.id}>
                <Link
                  href={`/conversas/${item.id}`}
                  aria-current={ativa ? "page" : undefined}
                  className={`block px-4 py-3 transition-colors ${
                    ativa ? "bg-secondary" : "hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {item.leads?.name ?? "Sem cadastro"}
                    </span>
                    {item.unread_count > 0 ? (
                      <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                        {item.unread_count}
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.last_message_preview ?? "—"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Centro: o chat. É o que importa, então fica no meio e ocupa o resto. */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-lg border bg-card">
        <header className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <Link
            href="/conversas"
            className="text-sm text-muted-foreground hover:underline lg:hidden"
          >
            ←
          </Link>
          <h1 className="truncate text-base font-medium">{titulo}</h1>
          <Badge variant="secondary" className="text-[10px]">
            {channelLabel(conversation.provider)}
          </Badge>
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
                className={`max-w-[75%] rounded-lg px-3 py-2 ${
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
          conversationId={id}
          withinWindow={withinWindow}
          channelConnected={connection?.status === "connected"}
        />
      </div>

      {/* Coluna direita: o contexto comercial, à mão enquanto se responde. */}
      <aside className="hidden w-72 shrink-0 flex-col gap-3 overflow-y-auto rounded-lg border bg-card p-4 xl:flex">
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
