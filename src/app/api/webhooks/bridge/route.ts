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

function ehTelefoneValido(numero?: string | null): boolean {
  if (!numero) return false;
  const clean = String(numero).replace(/\D/g, "");
  // Telefones válidos têm entre 10 e 13 dígitos
  // LIDs do WhatsApp têm 14 ou mais dígitos (ex: 154648904220865)
  return clean.length >= 10 && clean.length <= 13;
}

function extrairNomeSaudacao(texto?: string | null): string | null {
  if (!texto) return null;
  const match = texto.match(
    /^(?:ol[aá]|oi|bom dia|boa tarde|boa noite|fala|prezado|prezada)[,\s]+([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+)?)/i,
  );
  if (match && match[1]) {
    const nome = match[1].trim();
    const blacklist = [
      "meu", "minha", "amigo", "amiga", "mestre", "doutor", "doutora",
      "dr", "dra", "pessoal", "todos", "tudo", "como", "gente", "galera", "bom", "boa",
      "beleza", "bem", "vai", "vc", "voce", "você",
    ];
    const partes = nome.split(/\s+/);
    if (partes.length === 2 && blacklist.includes(partes[1].toLowerCase())) {
      const primeiro = partes[0].toLowerCase();
      if (!blacklist.includes(primeiro)) {
        return partes[0];
      }
    }
    const primeiro = partes[0].toLowerCase();
    if (!blacklist.includes(primeiro)) {
      return nome;
    }
  }
  return null;
}

function ehNomeProprioOuInvalido(nome: string | null): boolean {
  if (!nome) return true;
  const n = nome.toLowerCase();
  const digits = nome.replace(/\D/g, "");
  return (
    digits.length >= 14 ||
    nome.startsWith("+") ||
    n.includes("neuropsicologo") ||
    n.includes("ítalo p jardim") ||
    n.includes("italo jardim") ||
    n.includes("secretária") ||
    n.includes("secretaria") ||
    n.includes("assistente virtual")
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-ordo-signature") ?? "";

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

  // Identifica as conexões específicas do Dr. Ítalo e da Secretária
  const drItaloConn = connections.find(
    (c) =>
      c.display_name?.toLowerCase().includes("italo") ||
      c.display_name?.toLowerCase().includes("ítalo") ||
      c.display_name?.toLowerCase().includes("dr"),
  ) ?? connections[0];

  const secretariaConn = connections.find(
    (c) =>
      c.display_name?.toLowerCase().includes("secretaria") ||
      c.display_name?.toLowerCase().includes("secretária"),
  );

  let specificConnectionId = drItaloConn.id;

  if (envelope.sessionId) {
    const sId = envelope.sessionId.toLowerCase();
    if (sId === "secretaria" && secretariaConn) {
      specificConnectionId = secretariaConn.id;
    } else if ((sId === "principal" || sId.includes("italo") || sId.includes("dr")) && drItaloConn) {
      specificConnectionId = drItaloConn.id;
    } else {
      const match = connections.find(
        (c) =>
          c.display_name?.toLowerCase() === sId ||
          c.id.toLowerCase() === sId,
      );
      if (match) {
        specificConnectionId = match.id;
      }
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

    // Resolve o telefone real: NUNCA usar LID como telefone!
    let phoneContato: string | null = null;
    if (ehTelefoneValido(message.phone)) {
      phoneContato = message.phone;
    } else if (ehTelefoneValido(message.externalConversationId)) {
      phoneContato = message.externalConversationId;
    }

    let nomeSender = message.senderName?.trim() || null;

    if (!nomeSender || message.outbound || ehNomeProprioOuInvalido(nomeSender)) {
      // 1. Tenta extrair o nome do cliente pela saudação na mensagem (ex: "Olá, Matheus!")
      const nomeSaudacao = extrairNomeSaudacao(message.body);
      if (nomeSaudacao) {
        nomeSender = nomeSaudacao;
      } else if (phoneContato) {
        nomeSender = `+${phoneContato}`;
      } else {
        nomeSender = "Contato WhatsApp";
      }
    }

    const { data: ingested, error: ingestError } = await admin.rpc("ingest_channel_message", {
      p_workspace_id: connection.workspace_id,
      p_provider: "whatsapp",
      p_external_conversation_id: message.externalConversationId,
      p_external_message_id: message.externalMessageId,
      p_sender_external_id: message.senderExternalId,
      p_sender_name: nomeSender,
      p_body: message.body,
      p_sent_at: message.sentAt,
      p_media_type: message.mediaType,
      p_media_url: null,
      p_direction: message.outbound ? "outbound" : "inbound",
      p_phone: phoneContato,
      p_channel_connection_id: specificConnectionId,
    });

    const outMessageId = ingested?.[0]?.out_message_id;
    const outConversationId = ingested?.[0]?.out_conversation_id;
    const outLeadId = ingested?.[0]?.out_lead_id;

    // Atualização de Lead existente caso venham novos dados reais
    if (outLeadId) {
      const updateLead: Record<string, any> = {};
      if (phoneContato) {
        updateLead.phone = phoneContato;
      }
      if (
        !message.outbound &&
        message.senderName &&
        !ehNomeProprioOuInvalido(message.senderName)
      ) {
        updateLead.name = message.senderName.trim();
      } else if (message.outbound) {
        const nomeSaudacao = extrairNomeSaudacao(message.body);
        if (nomeSaudacao) {
          const { data: leadAtual } = await admin.from("leads").select("name").eq("id", outLeadId).single();
          if (!leadAtual?.name || ehNomeProprioOuInvalido(leadAtual.name) || leadAtual.name === "Contato WhatsApp") {
            updateLead.name = nomeSaudacao;
          }
        }
      }

      // NUNCA sobrescrever a linha de um lead que já possui canal atribuído!
      const { data: existingLead } = await admin
        .from("leads")
        .select("channel_connection_id")
        .eq("id", outLeadId)
        .single();

      if (!existingLead?.channel_connection_id && specificConnectionId) {
        updateLead.channel_connection_id = specificConnectionId;
      }

      if (Object.keys(updateLead).length > 0) {
        await admin.from("leads").update(updateLead).eq("id", outLeadId);
      }
    }

    // Vincula a conversa à linha de WhatsApp correspondente
    if (outConversationId && specificConnectionId) {
      await admin
        .from("conversations")
        .update({ channel_connection_id: specificConnectionId })
        .eq("id", outConversationId);
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
