import { NextResponse, type NextRequest } from "next/server";
import {
  normalizeMetaWebhook,
  verifyMetaSignature,
  type MetaProvider,
} from "@/lib/channels/meta";
import { decryptToken } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Webhook oficial da Meta (WhatsApp Cloud API e Instagram Messaging).
 *
 * Segurança: valida a assinatura HMAC do corpo bruto com o app secret da
 * conexão antes de qualquer processamento. Idempotência: cada evento é
 * gravado em webhook_events com chave única (provider, workspace, event_id).
 */

interface ConnectionRow {
  workspace_id: string;
  provider: MetaProvider;
  app_secret_enc: string | null;
  verify_token_enc: string | null;
  phone_number_id: string | null;
  instagram_id: string | null;
}

async function loadConnections(): Promise<ConnectionRow[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("channel_connections")
    .select(
      "workspace_id, provider, app_secret_enc, verify_token_enc, phone_number_id, instagram_id",
    )
    .in("provider", ["whatsapp", "instagram"])
    .eq("status", "connected");
  return (data ?? []) as ConnectionRow[];
}

/** Handshake de verificação exigido pela Meta ao cadastrar a URL. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode !== "subscribe" || !token || !challenge) {
    return new NextResponse("bad request", { status: 400 });
  }

  const connections = await loadConnections();
  const matches = connections.some((connection) => {
    if (!connection.verify_token_enc) return false;
    try {
      return decryptToken(connection.verify_token_enc) === token;
    } catch {
      return false;
    }
  });

  if (!matches) {
    return new NextResponse("forbidden", { status: 403 });
  }

  return new NextResponse(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export async function POST(request: NextRequest) {
  // O corpo bruto é necessário para conferir a assinatura.
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  const connections = await loadConnections();
  if (connections.length === 0) {
    // Sem canal conectado não há o que processar (nem como validar).
    return NextResponse.json({ ignored: true }, { status: 200 });
  }

  const connection = connections.find((candidate) => {
    if (!candidate.app_secret_enc) return false;
    try {
      return verifyMetaSignature(
        rawBody,
        signature,
        decryptToken(candidate.app_secret_enc),
      );
    } catch {
      return false;
    }
  });

  if (!connection) {
    // Assinatura inválida: nada é gravado.
    return new NextResponse("invalid signature", { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new NextResponse("invalid json", { status: 400 });
  }

  const admin = createAdminClient();
  const { messages, statuses } = normalizeMetaWebhook(body as never);

  for (const message of messages) {
    // Idempotência: a constraint única recusa o evento repetido.
    const { error: duplicate } = await admin.from("webhook_events").insert({
      workspace_id: connection.workspace_id,
      provider: message.provider,
      external_event_id: message.externalEventId,
      payload: message as unknown as Record<string, unknown>,
    });

    if (duplicate) continue; // já processado

    const { error: ingestError } = await admin.rpc("ingest_channel_message", {
      p_workspace_id: connection.workspace_id,
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
        status: ingestError ? "failed" : "processed",
        error: ingestError ? ingestError.message.slice(0, 300) : null,
        processed_at: new Date().toISOString(),
      })
      .eq("provider", message.provider)
      .eq("workspace_id", connection.workspace_id)
      .eq("external_event_id", message.externalEventId);
  }

  for (const status of statuses) {
    const { error: duplicate } = await admin.from("webhook_events").insert({
      workspace_id: connection.workspace_id,
      provider: status.provider,
      external_event_id: status.externalEventId,
      payload: status as unknown as Record<string, unknown>,
      status: "processed",
      processed_at: new Date().toISOString(),
    });
    if (duplicate) continue;

    await admin
      .from("messages")
      .update({ status: status.status })
      .eq("workspace_id", connection.workspace_id)
      .eq("provider", status.provider)
      .eq("external_message_id", status.externalMessageId);
  }

  await admin
    .from("channel_connections")
    .update({ last_event_at: new Date().toISOString() })
    .eq("workspace_id", connection.workspace_id)
    .eq("provider", connection.provider);

  // A Meta exige 200 rápido; erros de processamento ficam em webhook_events.
  return NextResponse.json({ ok: true });
}
