import { NextResponse, type NextRequest } from "next/server";
import {
  normalizeBridgeEvent,
  verifyBridgeSignature,
  type BridgeEnvelope,
} from "@/lib/channels/bridge";
import { decryptToken } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { salvarMidia } from "@/lib/channels/media";

/**
 * Entrada da ponte de dispositivo conectado.
 *
 * Mesmo contrato de segurança do webhook da Meta: assinatura HMAC do corpo
 * bruto conferida antes de qualquer processamento, e idempotência por evento
 * em `webhook_events`. A ingestão reaproveita `ingest_channel_message`, então
 * lead, conversa e inbox se comportam exatamente como no transporte oficial.
 */

interface BridgeConnection {
  workspace_id: string;
  bridge_secret_enc: string | null;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-ordo-signature");

  const admin = createAdminClient();
  const { data: connections } = await admin
    .from("channel_connections")
    .select("workspace_id, bridge_secret_enc")
    .eq("provider", "whatsapp")
    .eq("transport", "bridge")
    .eq("status", "connected")
    .returns<BridgeConnection[]>();

  if (!connections?.length) {
    return NextResponse.json({ ignored: true });
  }

  const connection = connections.find((candidate) => {
    if (!candidate.bridge_secret_enc) return false;
    try {
      return verifyBridgeSignature(
        rawBody,
        signature,
        decryptToken(candidate.bridge_secret_enc),
      );
    } catch {
      return false;
    }
  });

  if (!connection) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  let envelope: BridgeEnvelope;
  try {
    envelope = JSON.parse(rawBody) as BridgeEnvelope;
  } catch {
    return new NextResponse("invalid json", { status: 400 });
  }

  // Evento de estado da sessão: só atualiza o painel de saúde.
  if (envelope.event === "state") {
    await admin
      .from("channel_connections")
      .update({
        bridge_state: envelope.state ?? null,
        bridge_state_at: new Date().toISOString(),
      })
      .eq("workspace_id", connection.workspace_id)
      .eq("provider", "whatsapp");
    return NextResponse.json({ ok: true });
  }

  const messages = normalizeBridgeEvent(envelope);

  for (const message of messages) {
    const { error: duplicate } = await admin.from("webhook_events").insert({
      workspace_id: connection.workspace_id,
      provider: "whatsapp",
      external_event_id: message.externalEventId,
      // Sem o base64: o registro de eventos é para auditoria e idempotência,
      // não para guardar arquivo.
      payload: { ...message, media: message.media ? "[arquivo]" : null } as unknown as Record<string, unknown>,
    });

    if (duplicate) continue; // evento repetido

    const { data: ingested, error: ingestError } = await admin.rpc("ingest_channel_message", {
      p_workspace_id: connection.workspace_id,
      p_provider: "whatsapp",
      p_external_conversation_id: message.externalConversationId,
      p_external_message_id: message.externalMessageId,
      p_sender_external_id: message.senderExternalId,
      p_sender_name: message.senderName,
      p_body: message.body,
      p_sent_at: message.sentAt,
      p_media_type: message.mediaType,
      p_media_url: null,
      p_direction: message.outbound ? "outbound" : "inbound",
      p_phone: message.phone,
    });

    // O eco do celular é tratado dentro da RPC, pela direção — remendar aqui
    // com UPDATEs zerava a janela de atendimento da conversa.

    await admin
      .from("webhook_events")
      .update({
        status: ingestError ? "failed" : "processed",
        error: ingestError ? ingestError.message.slice(0, 300) : null,
        processed_at: new Date().toISOString(),
      })
      .eq("provider", "whatsapp")
      .eq("workspace_id", connection.workspace_id)
      .eq("external_event_id", message.externalEventId);
  }

  await admin
    .from("channel_connections")
    .update({
      last_event_at: new Date().toISOString(),
      bridge_state: "conectado",
      bridge_state_at: new Date().toISOString(),
    })
    .eq("workspace_id", connection.workspace_id)
    .eq("provider", "whatsapp");

  return NextResponse.json({ ok: true, processed: messages.length });
}
