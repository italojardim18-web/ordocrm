import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  normalizeBridgeEvent,
  phoneFromJid,
  signBridgePayload,
  verifyBridgeSignature,
  type BridgeEnvelope,
} from "@/lib/channels/bridge";

const SEGREDO = "segredo-compartilhado-de-teste";

function envelope(overrides: Partial<BridgeEnvelope["message"]> = {}) {
  return {
    event: "message" as const,
    messages: [
      {
        id: "3EB0ABC123",
        from: "5567999110001@s.whatsapp.net",
        pushName: "Maria Silva",
        text: "Oi, queria saber sobre supervisão",
        timestamp: 1755100800,
        fromMe: false,
        isGroup: false,
        ...overrides,
      },
    ],
  };
}

describe("identificação do contato", () => {
  it("extrai o número do JID", () => {
    expect(phoneFromJid("5567999110001@s.whatsapp.net")).toBe("5567999110001");
  });

  it("descarta o sufixo de dispositivo", () => {
    expect(phoneFromJid("5567999110001:12@s.whatsapp.net")).toBe("5567999110001");
  });
});

describe("normalização dos eventos da ponte", () => {
  it("converte mensagem recebida para o formato interno", () => {
    const [mensagem] = normalizeBridgeEvent(envelope());

    expect(mensagem.provider).toBe("whatsapp");
    expect(mensagem.externalMessageId).toBe("3EB0ABC123");
    expect(mensagem.senderExternalId).toBe("5567999110001");
    expect(mensagem.externalConversationId).toBe("5567999110001");
    expect(mensagem.senderName).toBe("Maria Silva");
    expect(mensagem.body).toBe("Oi, queria saber sobre supervisão");
    expect(mensagem.outbound).toBe(false);
    expect(mensagem.sentAt).toBe(new Date(1755100800 * 1000).toISOString());
  });

  it("usa prefixo próprio no id do evento para não colidir com a Cloud API", () => {
    const [mensagem] = normalizeBridgeEvent(envelope());
    expect(mensagem.externalEventId).toBe("br:3EB0ABC123");
  });

  it("marca como saída o eco do celular", () => {
    const [mensagem] = normalizeBridgeEvent(envelope({ fromMe: true }));
    expect(mensagem.outbound).toBe(true);
  });

  it("ignora conversas em grupo", () => {
    expect(normalizeBridgeEvent(envelope({ isGroup: true }))).toHaveLength(0);
  });

  it("ignora mensagem sem id ou sem remetente", () => {
    expect(
      normalizeBridgeEvent(envelope({ id: undefined as never })),
    ).toHaveLength(0);
    expect(
      normalizeBridgeEvent(envelope({ from: undefined as never })),
    ).toHaveLength(0);
  });

  it("carrega o telefone quando a ponte resolveu o LID", () => {
    const [mensagem] = normalizeBridgeEvent(
      envelope({ from: "88880204222603@lid", phone: "5567999110001" }),
    );
    expect(mensagem.senderExternalId).toBe("88880204222603");
    expect(mensagem.phone).toBe("5567999110001");
  });

  it("deixa o telefone vazio quando o LID não foi resolvido", () => {
    // Melhor campo vazio do que um LID que ninguém consegue discar.
    const [mensagem] = normalizeBridgeEvent(
      envelope({ from: "88880204222603@lid" }),
    );
    expect(mensagem.senderExternalId).toBe("88880204222603");
    expect(mensagem.phone).toBeNull();
  });

  it("aceita mídia sem texto", () => {
    const [mensagem] = normalizeBridgeEvent(
      envelope({ text: null, mediaType: "image" }),
    );
    expect(mensagem.body).toBeNull();
    expect(mensagem.mediaType).toBe("image");
  });

  it("cai para o horário atual quando o timestamp é inválido", () => {
    const [mensagem] = normalizeBridgeEvent(envelope({ timestamp: 0 }));
    expect(Number.isNaN(Date.parse(mensagem.sentAt))).toBe(false);
  });

  it("envelope de estado não produz mensagens", () => {
    expect(
      normalizeBridgeEvent({ event: "state", state: "conectado" }),
    ).toHaveLength(0);
  });

  it("aceita tanto `message` quanto `messages`", () => {
    const unico: BridgeEnvelope = {
      event: "message",
      message: envelope().messages[0],
    };
    expect(normalizeBridgeEvent(unico)).toHaveLength(1);
  });
});

describe("assinatura HMAC entre ORDO e ponte", () => {
  const corpo = JSON.stringify(envelope());

  it("aceita a assinatura correta, com e sem prefixo", () => {
    const assinatura = signBridgePayload(corpo, SEGREDO);
    expect(verifyBridgeSignature(corpo, assinatura, SEGREDO)).toBe(true);
    expect(verifyBridgeSignature(corpo, `sha256=${assinatura}`, SEGREDO)).toBe(
      true,
    );
  });

  it("recusa segredo diferente", () => {
    const assinatura = signBridgePayload(corpo, "outro-segredo");
    expect(verifyBridgeSignature(corpo, assinatura, SEGREDO)).toBe(false);
  });

  it("recusa corpo adulterado", () => {
    const assinatura = signBridgePayload(corpo, SEGREDO);
    const adulterado = corpo.replace("supervisão", "outra coisa");
    expect(verifyBridgeSignature(adulterado, assinatura, SEGREDO)).toBe(false);
  });

  it("recusa assinatura ausente ou malformada", () => {
    expect(verifyBridgeSignature(corpo, null, SEGREDO)).toBe(false);
    expect(verifyBridgeSignature(corpo, "", SEGREDO)).toBe(false);
    expect(verifyBridgeSignature(corpo, "sha256=zz", SEGREDO)).toBe(false);
  });

  it("é compatível com o HMAC gerado pela ponte", () => {
    // A ponte assina com createHmac direto; os dois lados precisam bater.
    const daPonte = createHmac("sha256", SEGREDO).update(corpo, "utf8").digest("hex");
    expect(verifyBridgeSignature(corpo, `sha256=${daPonte}`, SEGREDO)).toBe(true);
  });
});
