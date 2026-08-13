import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

/**
 * Criptografia de tokens de integração (AES-256-GCM).
 * A chave vem de INTEGRATION_TOKEN_KEY (32 bytes em base64) e existe apenas
 * no servidor. Formato do texto cifrado: base64(iv || tag || ciphertext).
 */
function getKey(): Buffer {
  const raw = process.env.INTEGRATION_TOKEN_KEY;
  if (!raw) {
    throw new Error(
      "INTEGRATION_TOKEN_KEY ausente — gere 32 bytes: openssl rand -base64 32",
    );
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("INTEGRATION_TOKEN_KEY deve ter 32 bytes em base64.");
  }
  return key;
}

export function encryptToken(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptToken(payload: string): string {
  const key = getKey();
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}
