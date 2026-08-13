import { beforeAll, describe, expect, it } from "vitest";

// Chave de teste (32 bytes) definida antes de importar o módulo.
process.env.INTEGRATION_TOKEN_KEY = Buffer.alloc(32, 7).toString("base64");

let encryptToken: (value: string) => string;
let decryptToken: (value: string) => string;

beforeAll(async () => {
  const mod = await import("@/lib/crypto");
  encryptToken = mod.encryptToken;
  decryptToken = mod.decryptToken;
});

describe("criptografia de tokens de integração", () => {
  it("faz round-trip do texto original", () => {
    const secret = "ya29.a0AfB_refresh_token_exemplo";
    expect(decryptToken(encryptToken(secret))).toBe(secret);
  });

  it("nunca produz o mesmo texto cifrado (IV aleatório)", () => {
    const secret = "mesmo-token";
    expect(encryptToken(secret)).not.toBe(encryptToken(secret));
  });

  it("o texto cifrado não contém o segredo em claro", () => {
    const secret = "segredo-super-sensivel";
    const encrypted = encryptToken(secret);
    expect(encrypted).not.toContain(secret);
    expect(Buffer.from(encrypted, "base64").toString("utf8")).not.toContain(
      secret,
    );
  });

  it("rejeita texto cifrado adulterado (autenticação GCM)", () => {
    const encrypted = encryptToken("token");
    const raw = Buffer.from(encrypted, "base64");
    raw[raw.length - 1] ^= 0xff;
    expect(() => decryptToken(raw.toString("base64"))).toThrow();
  });
});
