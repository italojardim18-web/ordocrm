import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Normalização dos webhooks oficiais da Meta (WhatsApp Cloud API e Instagram
 * Messaging). Puro: recebe payload, devolve eventos normalizados — sem I/O,
 * para ser testável com as fixtures da documentação.
 */

export type MetaProvider = "whatsapp" | "instagram";

export interface NormalizedMessage {
  provider: MetaProvider;
  externalEventId: string;
  externalConversationId: string;
  externalMessageId: string;
  senderExternalId: string;
  senderName: string | null;
  body: string | null;
  mediaType: string | null;
  sentAt: string;
  /** Identificador da conta que recebeu (phone_number_id ou ig id). */
  recipientAccountId: string | null;
}

export interface NormalizedStatus {
  provider: MetaProvider;
  externalEventId: string;
  externalMessageId: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
}

export interface NormalizedBatch {
  messages: NormalizedMessage[];
  statuses: NormalizedStatus[];
}

/**
 * Valida a assinatura X-Hub-Signature-256 (HMAC-SHA256 do corpo bruto com o
 * app secret). Comparação em tempo constante.
 */
export function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string,
): boolean {
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");
  const received = signatureHeader.slice("sha256=".length);

  if (received.length !== expected.length) return false;

  return timingSafeEqual(
    Buffer.from(received, "hex"),
    Buffer.from(expected, "hex"),
  );
}

function toIso(timestamp: string | number | undefined): string {
  if (timestamp === undefined) return new Date().toISOString();
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds)) return new Date().toISOString();
  return new Date(seconds * 1000).toISOString();
}

interface WhatsAppValue {
  metadata?: { phone_number_id?: string };
  contacts?: { wa_id?: string; profile?: { name?: string } }[];
  messages?: {
    id?: string;
    from?: string;
    timestamp?: string;
    type?: string;
    text?: { body?: string };
    image?: { mime_type?: string };
    audio?: { mime_type?: string };
    document?: { mime_type?: string };
  }[];
  statuses?: {
    id?: string;
    status?: string;
    timestamp?: string;
    recipient_id?: string;
  }[];
}

interface InstagramMessaging {
  sender?: { id?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: {
    mid?: string;
    text?: string;
    is_echo?: boolean;
    attachments?: { type?: string }[];
  };
}

interface MetaWebhookBody {
  object?: string;
  entry?: {
    id?: string;
    time?: number;
    changes?: { field?: string; value?: WhatsAppValue }[];
    messaging?: InstagramMessaging[];
  }[];
}

/** Converte o corpo do webhook da Meta em eventos normalizados. */
export function normalizeMetaWebhook(body: MetaWebhookBody): NormalizedBatch {
  const messages: NormalizedMessage[] = [];
  const statuses: NormalizedStatus[] = [];

  for (const entry of body.entry ?? []) {
    // ---- WhatsApp Cloud API ----
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value) continue;

      const phoneNumberId = value.metadata?.phone_number_id ?? null;
      const contactName = value.contacts?.[0]?.profile?.name ?? null;

      for (const message of value.messages ?? []) {
        if (!message.id || !message.from) continue;

        const mediaType =
          message.type && message.type !== "text" ? message.type : null;

        messages.push({
          provider: "whatsapp",
          // O id da mensagem é único e estável: serve de chave de idempotência.
          externalEventId: `wa:${message.id}`,
          externalConversationId: message.from,
          externalMessageId: message.id,
          senderExternalId: message.from,
          senderName: contactName,
          body: message.text?.body ?? null,
          mediaType,
          sentAt: toIso(message.timestamp),
          recipientAccountId: phoneNumberId,
        });
      }

      for (const status of value.statuses ?? []) {
        if (!status.id || !status.status) continue;
        const mapped =
          status.status === "sent" ||
          status.status === "delivered" ||
          status.status === "read" ||
          status.status === "failed"
            ? status.status
            : null;
        if (!mapped) continue;

        statuses.push({
          provider: "whatsapp",
          externalEventId: `wa-status:${status.id}:${status.status}`,
          externalMessageId: status.id,
          status: mapped,
          timestamp: toIso(status.timestamp),
        });
      }
    }

    // ---- Instagram Messaging ----
    for (const item of entry.messaging ?? []) {
      const message = item.message;
      // Echo = mensagem enviada pela própria conta; já registrada pelo CRM.
      if (!message?.mid || message.is_echo) continue;
      const senderId = item.sender?.id;
      if (!senderId) continue;

      messages.push({
        provider: "instagram",
        externalEventId: `ig:${message.mid}`,
        externalConversationId: senderId,
        externalMessageId: message.mid,
        senderExternalId: senderId,
        senderName: null,
        body: message.text ?? null,
        mediaType: message.attachments?.[0]?.type ?? null,
        sentAt: item.timestamp
          ? new Date(item.timestamp).toISOString()
          : new Date().toISOString(),
        recipientAccountId: item.recipient?.id ?? entry.id ?? null,
      });
    }
  }

  return { messages, statuses };
}

/**
 * Janela de atendimento de 24h (WhatsApp e Instagram): fora dela, texto livre
 * é recusado pela plataforma e é preciso usar template aprovado.
 */
export const SERVICE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function isWithinServiceWindow(
  lastInboundAt: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!lastInboundAt) return false;
  return now.getTime() - new Date(lastInboundAt).getTime() < SERVICE_WINDOW_MS;
}
