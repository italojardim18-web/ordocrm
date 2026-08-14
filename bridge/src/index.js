import { createServer } from "node:http";
import { assertConfig, config } from "./config.js";
import { verifyIncomingSignature } from "./ordo-client.js";
import {
  enviarTexto,
  estadoAtual,
  iniciarWhatsapp,
  listarSessoes,
  estadoSessao,
  iniciarSessao,
  pararSessao,
  obterQrBase64,
} from "./whatsapp.js";
import { iniciarAgendador, pararAgendador } from "./agendador.js";

/**
 * Ponte ORDO ↔ WhatsApp (multi-sessão).
 *
 * Rotas:
 *   GET  /health              → estado geral
 *   GET  /sessions             → lista todas as sessões e estados
 *   GET  /sessions/:id         → estado + QR de uma sessão
 *   GET  /sessions/:id/qr      → QR code como data URL base64
 *   POST /sessions/:id/start   → inicia uma nova sessão
 *   POST /sessions/:id/stop    → para uma sessão
 *   POST /send                 → envia mensagem (assinado)
 */

assertConfig();

function parseUrl(url) {
  const [path, query] = (url ?? "").split("?");
  return { path: path.replace(/\/+$/, ""), query: new URLSearchParams(query ?? "") };
}

const servidor = createServer(async (req, res) => {
  const responder = (status, corpo) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(corpo));
  };

  const { path } = parseUrl(req.url);

  // ── GET /health ──────────────────────────────────────────────
  if (req.method === "GET" && path === "/health") {
    return responder(200, { ok: true, estado: estadoAtual(), sessions: listarSessoes() });
  }

  // ── GET /sessions ────────────────────────────────────────────
  if (req.method === "GET" && path === "/sessions") {
    return responder(200, { sessions: listarSessoes() });
  }

  // ── GET /sessions/:id ────────────────────────────────────────
  const sessionMatch = path.match(/^\/sessions\/([a-zA-Z0-9_-]+)$/);
  if (req.method === "GET" && sessionMatch) {
    const info = estadoSessao(sessionMatch[1]);
    if (!info) return responder(404, { erro: "sessão não encontrada" });
    return responder(200, info);
  }

  // ── GET /sessions/:id/qr ─────────────────────────────────────
  const qrMatch = path.match(/^\/sessions\/([a-zA-Z0-9_-]+)\/qr$/);
  if (req.method === "GET" && qrMatch) {
    const qr = await obterQrBase64(qrMatch[1]);
    if (!qr) return responder(404, { erro: "QR não disponível (sessão já conectada ou inexistente)" });
    return responder(200, { qr });
  }

  // ── POST /sessions/:id/start ─────────────────────────────────
  const startMatch = path.match(/^\/sessions\/([a-zA-Z0-9_-]+)\/start$/);
  if (req.method === "POST" && startMatch) {
    try {
      await iniciarSessao(startMatch[1]);
      return responder(200, { ok: true, sessionId: startMatch[1] });
    } catch (erro) {
      return responder(500, { erro: erro.message });
    }
  }

  // ── POST /sessions/:id/stop ──────────────────────────────────
  const stopMatch = path.match(/^\/sessions\/([a-zA-Z0-9_-]+)\/stop$/);
  if (req.method === "POST" && stopMatch) {
    await pararSessao(stopMatch[1]);
    return responder(200, { ok: true });
  }

  // ── POST /send ───────────────────────────────────────────────
  if (req.method === "POST" && path === "/send") {
    let corpoBruto = "";
    for await (const pedaco of req) corpoBruto += pedaco;

    if (!verifyIncomingSignature(corpoBruto, req.headers["x-ordo-signature"])) {
      return responder(401, { erro: "assinatura inválida" });
    }

    let payload;
    try {
      payload = JSON.parse(corpoBruto);
    } catch {
      return responder(400, { erro: "json inválido" });
    }

    const { to, text, sessionId } = payload;
    if (!to || !text) {
      return responder(400, { erro: "informe 'to' e 'text'" });
    }

    try {
      const id = await enviarTexto(String(to), String(text), sessionId ?? "principal");
      return responder(200, { ok: true, externalMessageId: id });
    } catch (erro) {
      console.error("[send] falhou:", erro.message);
      return responder(503, { erro: erro.message });
    }
  }

  return responder(404, { erro: "rota inexistente" });
});

servidor.listen(config.port, () => {
  console.log(`[ponte] ouvindo em http://localhost:${config.port}`);
  console.log(`[ponte] ORDO em ${config.ordoUrl}`);
});

iniciarAgendador();

iniciarWhatsapp().catch((erro) => {
  console.error("[ponte] não consegui iniciar o WhatsApp:", erro.message);
  process.exit(1);
});

for (const sinal of ["SIGINT", "SIGTERM"]) {
  process.on(sinal, () => {
    console.log("\n[ponte] encerrando…");
    pararAgendador();
    servidor.close(() => process.exit(0));
  });
}
