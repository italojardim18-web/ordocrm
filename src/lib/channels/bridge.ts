import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Ponte de dispositivo conectado (transporte não oficial).
 *
 * A ponte roda fora do ORDO, mantém a sessão do WhatsApp como dispositivo
 * conectado e entrega aqui os eventos já simplificados. Este módulo é puro:
 * normaliza o payload para o MESMO formato do adaptador oficial da Meta, de
 * modo que a ingestão, o inbox e os relatórios não saibam a diferença.
 */

export interface BridgeMedia {
  /** Conteúdo do arquivo em base64 (a ponte já baixou do WhatsApp). */
  base64: string;
  mime?: string | null;
  filename?: string | null;
  size?: number | null;
  duration?: number | null;
}

export interface BridgeMessage {
  /** ID da mensagem no WhatsApp — chave de idempotência. */
  id: string;
  /** JID do remetente, ex.: 5567999110001@s.whatsapp.net ou 8888…@lid */
  from: string;
  /** Telefone real, quando a ponte conseguiu resolver. Nunca um LID. */
  phone?: string | null;
  /** Nome do contato, quando disponível na agenda/perfil. */
  pushName?: string | null;
  text?: string | null;
  mediaType?: string | null;
  media?: BridgeMedia | null;
  /** Epoch em segundos, como o WhatsApp entrega. */
  timestamp?: number | string | null;
  /** true quando a mensagem foi enviada pelo próprio número (eco do celular). */
  fromMe?: boolean;
  /** true para conversas em grupo — ignoradas no fluxo comercial. */
  isGroup?: boolean;
}

export interface BridgeEnvelope {
  event: "message" | "status" | "state";
  message?: BridgeMessage;
  /** Estado da sessão: aguardando_qr | conectado | desconectado */
  state?: string;
  messages?: BridgeMessage[];
}

export interface NormalizedBridgeMessage {
  provider: "whatsapp";
  externalEventId: string;
  externalConversationId: string;
  externalMessageId: string;
  senderExternalId: string;
  senderName: string | null;
  /** Telefone de verdade, ou null. Campo vazio é melhor que um LID. */
  phone: string | null;
  body: string | null;
  mediaType: string | null;
  media: BridgeMedia | null;
  sentAt: string;
  /** Eco do celular: a mensagem é nossa, entra na conversa como saída. */
  outbound: boolean;
}

/** Extrai o número do JID: `5567999110001@s.whatsapp.net` → `5567999110001`. */
export function phoneFromJid(jid: string): string {
  return jid.split("@")[0].split(":")[0];
}

function toIso(timestamp: BridgeMessage["timestamp"]): string {
  if (timestamp === null || timestamp === undefined) {
    return new Date().toISOString();
  }
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return new Date().toISOString();
  }
  return new Date(seconds * 1000).toISOString();
}

/**
 * Converte o envelope da ponte em mensagens normalizadas.
 * Descarta grupos e mensagens sem identificador — o fluxo comercial é 1:1 e a
 * idempotência depende do id.
 */
export function normalizeBridgeEvent(
  envelope: BridgeEnvelope,
): NormalizedBridgeMessage[] {
  const items = envelope.messages ?? (envelope.message ? [envelope.message] : []);

  return items.flatMap((message) => {
    if (!message?.id || !message.from) return [];
    if (message.isGroup) return [];

    const phone = phoneFromJid(message.from);
    if (!phone) return [];

    return [
      {
        provider: "whatsapp" as const,
        // Prefixo próprio: um mesmo id nunca colide com o da Cloud API.
        externalEventId: `br:${message.id}`,
        externalConversationId: phone,
        externalMessageId: message.id,
        senderExternalId: phone,
        senderName: message.pushName?.trim() || null,
        phone: message.phone?.trim() || null,
        body: message.text?.trim() || null,
        mediaType: message.mediaType ?? null,
        // O arquivo em si não vai para webhook_events: base64 de 20MB no
        // registro de eventos inflaria o banco sem serventia.
        media: message.media ?? null,
        sentAt: toIso(message.timestamp),
        outbound: Boolean(message.fromMe),
      },
    ];
  });
}

/**
 * Assinatura HMAC-SHA256 do corpo bruto com o segredo compartilhado.
 * Mesmo desenho do webhook da Meta: comparação em tempo constante.
 */
export function signBridgePayload(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
}

export function verifyBridgeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;

  const received = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;

  const expected = signBridgePayload(rawBody, secret);
  if (received.length !== expected.length) return false;

  try {
    return timingSafeEqual(
      Buffer.from(received, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}
