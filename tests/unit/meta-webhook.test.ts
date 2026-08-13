import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  isWithinServiceWindow,
  normalizeMetaWebhook,
  verifyMetaSignature,
} from "@/lib/channels/meta";

// Fixtures no formato da documentação oficial da Meta.
const whatsappMessage = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WABA_ID",
      changes: [
        {
          field: "messages",
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "556799990000",
              phone_number_id: "PHONE_ID",
            },
            contacts: [
              { profile: { name: "Maria Silva" }, wa_id: "5567999110001" },
            ],
            messages: [
              {
                from: "5567999110001",
                id: "wamid.HBgMNTU2Nzk5OTExMDAwMQ",
                timestamp: "1755100800",
                text: { body: "Olá, quero saber sobre supervisão" },
                type: "text",
              },
            ],
          },
        },
      ],
    },
  ],
};

const whatsappStatus = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WABA_ID",
      changes: [
        {
          field: "messages",
          value: {
            metadata: { phone_number_id: "PHONE_ID" },
            statuses: [
              {
                id: "wamid.OUTBOUND1",
                status: "read",
                timestamp: "1755100900",
                recipient_id: "5567999110001",
              },
            ],
          },
        },
      ],
    },
  ],
};

const instagramMessage = {
  object: "instagram",
  entry: [
    {
      id: "IG_ACCOUNT_ID",
      time: 1755100800000,
      messaging: [
        {
          sender: { id: "IGSID_123" },
          recipient: { id: "IG_ACCOUNT_ID" },
          timestamp: 1755100800000,
          message: { mid: "mid.abc123", text: "Oi! Vi seu perfil" },
        },
      ],
    },
  ],
};

describe("assinatura do webhook da Meta", () => {
  const secret = "app-secret-de-teste";
  const body = JSON.stringify(whatsappMessage);
  const validSignature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

  it("aceita assinatura correta", () => {
    expect(verifyMetaSignature(body, validSignature, secret)).toBe(true);
  });

  it("recusa assinatura de outro segredo", () => {
    expect(verifyMetaSignature(body, validSignature, "outro-segredo")).toBe(
      false,
    );
  });

  it("recusa corpo adulterado", () => {
    const tampered = body.replace("supervisão", "outra coisa");
    expect(verifyMetaSignature(tampered, validSignature, secret)).toBe(false);
  });

  it("recusa cabeçalho ausente ou em formato inesperado", () => {
    expect(verifyMetaSignature(body, null, secret)).toBe(false);
    expect(verifyMetaSignature(body, "abc123", secret)).toBe(false);
    expect(verifyMetaSignature(body, "sha256=zz", secret)).toBe(false);
  });
});

describe("normalização do WhatsApp", () => {
  it("extrai a mensagem com id estável para idempotência", () => {
    const { messages } = normalizeMetaWebhook(whatsappMessage);
    expect(messages).toHaveLength(1);
    const [message] = messages;
    expect(message.provider).toBe("whatsapp");
    expect(message.externalMessageId).toBe("wamid.HBgMNTU2Nzk5OTExMDAwMQ");
    expect(message.externalEventId).toBe(
      "wa:wamid.HBgMNTU2Nzk5OTExMDAwMQ",
    );
    expect(message.senderExternalId).toBe("5567999110001");
    expect(message.senderName).toBe("Maria Silva");
    expect(message.body).toBe("Olá, quero saber sobre supervisão");
    expect(message.recipientAccountId).toBe("PHONE_ID");
  });

  it("converte timestamp em segundos para ISO", () => {
    const [message] = normalizeMetaWebhook(whatsappMessage).messages;
    expect(message.sentAt).toBe(new Date(1755100800 * 1000).toISOString());
  });

  it("normaliza status de entrega", () => {
    const { statuses, messages } = normalizeMetaWebhook(whatsappStatus);
    expect(messages).toHaveLength(0);
    expect(statuses).toHaveLength(1);
    expect(statuses[0].status).toBe("read");
    expect(statuses[0].externalMessageId).toBe("wamid.OUTBOUND1");
  });

  it("marca mensagens de mídia com o tipo", () => {
    const payload = structuredClone(whatsappMessage);
    const message = payload.entry[0].changes[0].value.messages[0] as Record<
      string,
      unknown
    >;
    message.type = "image";
    delete message.text;
    const [normalized] = normalizeMetaWebhook(payload).messages;
    expect(normalized.mediaType).toBe("image");
    expect(normalized.body).toBeNull();
  });
});

describe("normalização do Instagram", () => {
  it("extrai a mensagem do Direct", () => {
    const { messages } = normalizeMetaWebhook(instagramMessage);
    expect(messages).toHaveLength(1);
    expect(messages[0].provider).toBe("instagram");
    expect(messages[0].externalMessageId).toBe("mid.abc123");
    expect(messages[0].senderExternalId).toBe("IGSID_123");
  });

  it("ignora echo (mensagem enviada pela própria conta)", () => {
    const payload = structuredClone(instagramMessage);
    (payload.entry[0].messaging[0].message as Record<string, unknown>).is_echo =
      true;
    expect(normalizeMetaWebhook(payload).messages).toHaveLength(0);
  });
});

describe("payloads inesperados não quebram a normalização", () => {
  it("corpo vazio devolve lotes vazios", () => {
    expect(normalizeMetaWebhook({})).toEqual({ messages: [], statuses: [] });
    expect(normalizeMetaWebhook({ entry: [] })).toEqual({
      messages: [],
      statuses: [],
    });
  });

  it("mensagem sem id ou remetente é descartada", () => {
    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                messages: [{ timestamp: "1755100800", text: { body: "x" } }],
              },
            },
          ],
        },
      ],
    };
    expect(normalizeMetaWebhook(payload).messages).toHaveLength(0);
  });
});

describe("janela de atendimento de 24h", () => {
  const now = new Date("2026-08-13T12:00:00Z");

  it("dentro da janela quando a última mensagem do contato é recente", () => {
    expect(isWithinServiceWindow("2026-08-13T02:00:00Z", now)).toBe(true);
  });

  it("fora da janela após 24 horas", () => {
    expect(isWithinServiceWindow("2026-08-12T11:00:00Z", now)).toBe(false);
  });

  it("sem mensagem do contato, está fora da janela", () => {
    expect(isWithinServiceWindow(null, now)).toBe(false);
  });
});
