import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getChannelConnections } from "@/lib/crm/queries";
import { channelLabel, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/validation";

import { ChannelSelector } from "@/components/channel-selector";

export const metadata: Metadata = { title: "Conversas" };

interface ConversationRow {
  id: string;
  provider: string;
  lead_id: string | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
  channel_connection_id: string | null;
  leads: { name: string } | null;
}

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const sp = await searchParams;
  const selectedChannel = typeof sp.linha === "string" ? sp.linha : null;

  const supabase = await createClient();
  const channelConnections = await getChannelConnections(context.workspace.id);
  const activeChannelId = selectedChannel || channelConnections[0]?.id || null;

  const { data: conversations } = await (() => {
    let query = supabase
      .from("conversations")
      .select(
        "id, provider, lead_id, last_message_at, last_message_preview, unread_count, channel_connection_id, leads (name)",
      )
      .eq("workspace_id", context.workspace.id)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(100);

    if (activeChannelId) {
      query = query.eq("channel_connection_id", activeChannelId);
    }

    return query.returns<ConversationRow[]>();
  })();

  const channelOptions = channelConnections.map((ch) => ({
    id: ch.id,
    label: ch.display_name ?? ch.provider,
    phoneNumber: ch.phone_number,
  }));

  const channelMap = new Map(channelConnections.map((c) => [c.id, c.display_name ?? c.provider]));

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
            Conversas
          </h1>
          <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
            {conversations?.length ?? 0} ativas
          </span>

          {channelOptions.length > 0 ? (
            <div className="ml-1">
              <ChannelSelector channels={channelOptions} />
            </div>
          ) : null}
        </div>
      </div>

      {(conversations ?? []).length === 0 ? (
        <div className="ordo-card flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="text-3xl">💬</span>
          <p className="font-semibold text-sm">Nenhuma conversa nesta linha</p>
          <p className="max-w-md text-xs text-muted-foreground">
            {activeChannelId
              ? "Nenhuma conversa registrada nesta linha de atendimento. Novas mensagens aparecerão aqui automaticamente."
              : "As conversas aparecem aqui quando o WhatsApp ou o Instagram estiverem conectados em Configurações → Integrações."}
          </p>
        </div>
      ) : (
        <div className="ordo-card p-3 divide-y divide-border/50">
          {(conversations ?? []).map((conversation) => {
            const nome = conversation.leads?.name ?? "Contato sem cadastro";
            const linhaNome = conversation.channel_connection_id
              ? channelMap.get(conversation.channel_connection_id)
              : null;

            return (
              <Link
                key={conversation.id}
                href={`/conversas/${conversation.id}`}
                className="flex items-center gap-3.5 p-3.5 rounded-xl transition-colors hover:bg-muted/40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary font-bold text-xs ring-1 ring-border/60">
                  {initials(nome)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="truncate font-semibold text-xs text-foreground">
                      {nome}
                    </p>
                    <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0">
                      {channelLabel(conversation.provider)}
                    </Badge>
                    {linhaNome ? (
                      <span className="text-[10px] text-muted-foreground/75 rounded-full bg-muted px-2 py-0.5 font-medium">
                        📱 {linhaNome}
                      </span>
                    ) : null}
                    {conversation.unread_count > 0 ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {conversation.unread_count} nova(s)
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {conversation.last_message_preview ?? "—"}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground/80">
                  {formatDateTime(conversation.last_message_at)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
