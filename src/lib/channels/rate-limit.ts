import "server-only";
import { createHash } from "node:crypto";

/**
 * Rate limit por janela deslizante, em memória do processo.
 * Suficiente para o MVP (instância única). Em produção com várias instâncias,
 * trocar por armazenamento compartilhado — registrado em product-decisions.
 */
const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    hits.set(key, recent);
    return { allowed: false, retryAfterSeconds: Math.max(retryAfter, 1) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Limpeza oportunista para a memória não crescer indefinidamente.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** IP nunca é gravado em claro: guardamos apenas o hash. */
export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(`${ip}:${process.env.INTEGRATION_TOKEN_KEY ?? "praxis"}`)
    .digest("hex")
    .slice(0, 32);
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "desconhecido"
  );
}
