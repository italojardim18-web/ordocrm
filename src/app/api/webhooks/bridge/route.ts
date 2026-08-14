import { NextResponse, type NextRequest } from "next/server";
import {
  normalizeBridgeEvent,
  verifyBridgeSignature,
  type BridgeEnvelope,
} from "@/lib/channels/bridge";
import { decryptToken } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { salvarMidia } from "@/lib/channels/media";
import { processarTranscricaoAudio } from "@/lib/channels/transcribe";

/**
 * Entrada da ponte de dispositivo conectado (WhatsApp Multi-sessão).
 *
 * Recebe mensagens de texto e mídia (áudios, imagens, documentos, vídeos),
 * salva os arquivos no bucket do Storage, dispara transcrição de áudios
 * e vincula à linha/sessão correspondente.
 */

interface BridgeConnection {
  id: string;
  workspace_id: string;
  bridge_secret_enc: string | null;
  display_name: string | null;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-ordo-signature");

  const admin = createAdminClient();
  const { data: connections } = await admin
    .from("channel_connections")
    .select("id, workspace_id, bridge_secret_enc, display_name")
    .eq("provider", "whatsapp")
    .eq("transport", "bridge")
    .returns<BridgeConnection[]>();

  if (!connections?.length) {
    return NextResponse.json({ ignored: true });
  }

  const connection = connections.find((candidate) => {
    if (!candidate.bridge_secret_enc) {
      // Se não tem segredo cadastrado por linha, usa o ORDO_BRIDGE_SECRET global
      const globalSecret = process.env.ORDO_BRIDGE_SECRET;
      if (!globalSecret) return true;
      return verifyBridgeSignature(rawBody, signature, globalSecret);
    }
    try {
      return verifyBridgeSignature(
        rawBody,
        signature,
        decryptToken(candidate.bridge_secret_enc),
      );
    } catch {
      return false;
    }
  }) ?? connections[0];

  let envelope: BridgeEnvelope & { sessionId?: string };
  try {
    envelope = JSON.parse(rawBody);
  } catch {
    return new NextResponse("invalid json", { status: 400 });
  }

  // Identifica a conexão de canal específica por sessionId
  let specificConnectionId = connection.id;
  if (envelope.sessionId) {
    const sessionId = envelope.sessionId;
    const targetName =
      sessionId === "principal"
        ? "Dr. Ítalo"
        : sessionId === "secretaria"
          ? "Secretária"
          : sessionId.charAt(0).toUpperCase() + sessionId.slice(1);

    const match = connections.find(
      (c) =>
        c.display_name?.toLowerCase() === targetName.toLowerCase() ||
        c.display_name?.toLowerCase() === sessionId.toLowerCase(),
    );
    if (match) {
      specificConnectionId = match.id;
    }
  }

  // Evento de estado da sessão: só atualiza o painel de saúde.
  if (envelope.event === "state") {
    await admin
      .from("channel_connections")
      .update({
        bridge_state: envelope.state ?? null,
        bridge_state_at: new Date().toISOString(),
      })
      .eq("id", specificConnectionId);
    return NextResponse.json({ ok: true });
  }

  const messages = normalizeBridgeEvent(envelope);

  for (const message of messages) {
    const { error: duplicate } = await admin.from("webhook_events").insert({
      workspace_id: connection.workspace_id,
      provider: "whatsapp",
      external_event_id: message.externalEventId,
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

    const outMessageId = ingested?.[0]?.out_message_id;
    const outConversationId = ingested?.[0]?.out_conversation_id;
    const outLeadId = ingested?.[0]?.out_lead_id;

    // Vincula a conversa e o lead à linha de WhatsApp correspondente
    if (outConversationId && specificConnectionId) {
      await admin
        .from("conversations")
        .update({ channel_connection_id: specificConnectionId })
        .eq("id", outConversationId);
    }
    if (outLeadId && specificConnectionId) {
      await admin
        .from("leads")
        .update({ channel_connection_id: specificConnectionId })
        .eq("id", outLeadId);
    }

    // Se a mensagem trouxe mídia (áudio, foto, documento, vídeo), salva no Storage
    if (message.media && outConversationId && outMessageId) {
      const mediaSalva = await salvarMidia(
        connection.workspace_id,
        outConversationId,
        message.externalMessageId,
        message.media,
      );

      if (mediaSalva) {
        await admin
          .from("messages")
          .update({
            media_path: mediaSalva.path,
            media_mime: mediaSalva.mime,
            media_size: mediaSalva.size,
            media_filename: mediaSalva.filename,
            media_duration_seconds: mediaSalva.duration,
            transcript_status: message.mediaType === "audio" ? "pending" : null,
          })
          .eq("id", outMessageId);

        // Se for mensagem de áudio, dispara transcrição assíncrona
        if (message.mediaType === "audio" && message.media.base64) {
          try {
            const buffer = Buffer.from(message.media.base64, "base64");
            // Executa transcrição
            processarTranscricaoAudio(
              outMessageId,
              buffer,
              mediaSalva.mime ?? "audio/ogg",
              mediaSalva.filename ?? "audio.ogg",
            ).catch((err) => {
              console.error("[webhook:transcribe] erro ao transcrever:", err);
            });
          } catch {
            // buffer inválido
          }
        }
      }
    }

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
    .eq("id", specificConnectionId);

  return NextResponse.json({ ok: true, processed: messages.length });
}
