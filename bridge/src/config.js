import { randomBytes } from "node:crypto";

/**
 * Configuração da ponte. Tudo vem do ambiente: a ponte não guarda segredo
 * em arquivo além da sessão do WhatsApp.
 */
export const config = {
  /** URL do ORDO, ex.: https://ordo.seudominio.com */
  ordoUrl: process.env.ORDO_URL ?? "http://localhost:3000",
  /** Segredo compartilhado do HMAC — o mesmo cadastrado no ORDO. */
  sharedSecret: process.env.ORDO_BRIDGE_SECRET ?? "",
  /** Porta local para o ORDO pedir envios. */
  port: Number(process.env.BRIDGE_PORT ?? 8787),
  /** Onde a sessão do WhatsApp fica gravada. */
  sessionDir: process.env.BRIDGE_SESSION_DIR ?? "./sessao",
  /** Espera entre mensagens enviadas, para não parecer robô. */
  sendDelayMs: Number(process.env.BRIDGE_SEND_DELAY_MS ?? 1200),
  /** Acima disso a mídia não é baixada em base64 (protege memória e o payload HTTP). */
  maxMediaBytes: Number(process.env.BRIDGE_MAX_MEDIA_BYTES ?? 5 * 1024 * 1024),
  /** Onde o QR de pareamento é gravado como imagem. */
  qrFile: process.env.BRIDGE_QR_FILE ?? "./qr.png",
  /** Token do agendador de jobs do ORDO (mesmo valor do JOBS_SECRET de lá). */
  jobsSecret: process.env.JOBS_SECRET ?? "",
  /** Intervalo de processamento da fila de saída (3s para envio ultrarrápido). */
  outboxIntervalMs: Number(process.env.BRIDGE_OUTBOX_INTERVAL_MS ?? 3000),
};

export function assertConfig() {
  if (!config.sharedSecret) {
    console.error(
      [
        "ORDO_BRIDGE_SECRET não definido.",
        "",
        "Gere um segredo e use o MESMO valor no ORDO e aqui:",
        `  ${randomBytes(32).toString("hex")}`,
        "",
      ].join("\n"),
    );
    process.exit(1);
  }
}
