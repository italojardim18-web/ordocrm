import { createHmac } from "node:crypto";
import { config } from "./config.js";
import { drenar, guardar } from "./spool.js";

/**
 * Cliente do ORDO. Toda requisição vai assinada com HMAC-SHA256 do corpo
 * bruto, exatamente como o ORDO verifica em /api/webhooks/bridge.
 */

function sign(body) {
  return createHmac("sha256", config.sharedSecret).update(body, "utf8").digest("hex");
}

/**
 * Entrega um envelope ao ORDO com retentativa e recuo exponencial.
 * A ponte não pode perder mensagem porque o ORDO estava reiniciando.
 */
async function entregar(envelope, attempts = 3) {
  const body = JSON.stringify(envelope);
  const url = `${config.ordoUrl.replace(/\/$/, "")}/api/webhooks/bridge`;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Ordo-Signature": `sha256=${sign(body)}`,
        },
        body,
      });

      if (response.ok) return { ok: true };

      // Erros 400, 401, 413, 422 são irrecuperáveis por repetição do mesmo payload
      if (response.status === 401) {
        console.error(
          "[ordo] assinatura recusada — o segredo daqui não confere com o do ORDO",
        );
        return { ok: false, unrecoverable: true };
      }

      if (response.status === 400 || response.status === 413 || response.status === 422) {
        console.error(
          `[ordo] payload recusado (${response.status}) — descartando para não travar a fila`,
        );
        return { ok: false, unrecoverable: true };
      }

      console.warn(`[ordo] resposta ${response.status} (tentativa ${attempt})`);
    } catch (error) {
      console.warn(`[ordo] falha de rede (tentativa ${attempt}):`, error.message);
    }

    if (attempt < attempts) {
      const espera = Math.min(2 ** attempt * 500, 30_000);
      await new Promise((resolve) => setTimeout(resolve, espera));
    }
  }

  return { ok: false, unrecoverable: false };
}

/**
 * Entrega um evento ao ORDO. Se não conseguir, guarda em disco e segue
 * tentando — evento de conversa não pode sumir porque o ORDO estava fora.
 * Eventos de estado (`state`) são descartáveis: o próximo já corrige.
 */
export async function sendToOrdo(envelope, { attempts = 3 } = {}) {
  const resultado = await entregar(envelope, attempts);
  if (resultado.ok || resultado.unrecoverable) return resultado.ok;

  if (envelope.event === "state") return false;

  await guardar(envelope);
  return false;
}

/** Reenvia o que ficou guardado. Chamado periodicamente e na partida. */
export async function drenarSpool() {
  return drenar((envelope) => entregar(envelope, 1));
}

export function verifyIncomingSignature(rawBody, header) {
  if (!header) return false;
  const received = header.startsWith("sha256=") ? header.slice(7) : header;
  const expected = sign(rawBody);
  if (received.length !== expected.length) return false;

  // Comparação em tempo constante sem depender de Buffer inválido.
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= received.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
