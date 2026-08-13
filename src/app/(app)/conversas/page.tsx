import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { channelLabel, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Conversas" };

interface ConversationRow {
  id: string;
  provider: string;
  lead_id: string | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
  leads: { name: string } | null;
}

export default async function ConversationsPage() {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const supabase = await createClient();
  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      "id, provider, lead_id, last_message_at, last_message_preview, unread_count, leads (name)",
    )
    .eq("workspace_id", context.workspace.id)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(100)
    .returns<ConversationRow[]>();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-primary">Conversas</h1>

      {(conversations ?? []).length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-card p-8 text-center">
          <p className="font-medium">Nenhuma conversa ainda.</p>
          <p className="max-w-md text-sm text-muted-foreground">
            As conversas aparecem aqui quando o WhatsApp ou o Instagram
            estiverem conectados em Configurações → Integrações.
          </p>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {(conversations ?? []).map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/conversas/${conversation.id}`}
                className="flex items-center gap-3 p-4 hover:bg-muted/60"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">
                      {conversation.leads?.name ?? "Contato sem cadastro"}
                    </p>
                    <Badge variant="secondary" className="text-[10px]">
                      {channelLabel(conversation.provider)}
                    </Badge>
                    {conversation.unread_count > 0 ? (
                      <Badge className="bg-positive text-[10px] text-primary-foreground">
                        {conversation.unread_count} nova(s)
                      </Badge>
                    ) : null}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {conversation.last_message_preview ?? "—"}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(conversation.last_message_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
