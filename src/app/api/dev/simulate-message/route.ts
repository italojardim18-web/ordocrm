import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { normalizeMetaWebhook } from "@/lib/channels/meta";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Simulador de mensagem recebida — APENAS desenvolvimento.
 * Permite exercitar o fluxo completo (normalização → ingestão idempotente →
 * inbox) sem credenciais da Meta. Nunca disponível em produção.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("not found", { status: 404 });
  }

  const context = await requireAdmin();
  const { provider = "whatsapp", from, name, text } = await request.json();

  const messageId = `sim.${Date.now()}`;
  const payload =
    provider === "instagram"
      ? {
          object: "instagram",
          entry: [
            {
              id: "ig-account",
              messaging: [
                {
                  sender: { id: from },
                  recipient: { id: "ig-account" },
                  timestamp: Date.now(),
                  message: { mid: messageId, text },
                },
              ],
            },
          ],
        }
      : {
          object: "whatsapp_business_account",
          entry: [
            {
              id: "waba",
              changes: [
                {
                  field: "messages",
                  value: {
                    metadata: { phone_number_id: "sim-phone" },
                    contacts: [{ wa_id: from, profile: { name } }],
                    messages: [
                      {
                        id: messageId,
                        from,
                        timestamp: String(Math.floor(Date.now() / 1000)),
                        type: "text",
                        text: { body: text },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        };

  const { messages } = normalizeMetaWebhook(payload as never);
  const admin = createAdminClient();
  const results = [];

  for (const message of messages) {
    const { error: duplicate } = await admin.from("webhook_events").insert({
      workspace_id: context.workspace.id,
      provider: message.provider,
      external_event_id: message.externalEventId,
      payload: { ...message, simulated: true },
    });

    if (duplicate) {
      results.push({ deduped: true });
      continue;
    }

    const { data, error } = await admin.rpc("ingest_channel_message", {
      p_workspace_id: context.workspace.id,
      p_provider: message.provider,
      p_external_conversation_id: message.externalConversationId,
      p_external_message_id: message.externalMessageId,
      p_sender_external_id: message.senderExternalId,
      p_sender_name: message.senderName,
      p_body: message.body,
      p_sent_at: message.sentAt,
      p_media_type: message.mediaType,
      p_media_url: null,
    });

    await admin
      .from("webhook_events")
      .update({
        status: error ? "failed" : "processed",
        error: error ? error.message.slice(0, 300) : null,
        processed_at: new Date().toISOString(),
      })
      .eq("workspace_id", context.workspace.id)
      .eq("provider", message.provider)
      .eq("external_event_id", message.externalEventId);

    results.push({ error: error?.message ?? null, data });
  }

  return NextResponse.json({ ok: true, results });
}
