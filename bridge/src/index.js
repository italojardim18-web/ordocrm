import { createServer } from "node:http";
import { assertConfig, config } from "./config.js";
import { verifyIncomingSignature } from "./ordo-client.js";
import { enviarTexto, estadoAtual, iniciarWhatsapp } from "./whatsapp.js";

/**
 * Ponte ORDO ↔ WhatsApp.
 *
 * Recebe: mensagens do WhatsApp → encaminha ao ORDO (assinadas).
 * Envia:  o ORDO chama POST /send (assinado) → entrega no WhatsApp.
 *
 * Precisa ficar ligada: a sessão é uma conexão persistente. Não funciona em
 * serverless.
 */

assertConfig();

const servidor = createServer(async (req, res) => {
  const responder = (status, corpo) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(corpo));
  };

  if (req.method === "GET" && req.url === "/health") {
    return responder(200, { ok: true, estado: estadoAtual() });
  }

  if (req.method !== "POST" || req.url !== "/send") {
    return responder(404, { erro: "rota inexistente" });
  }

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

  const { to, text } = payload;
  if (!to || !text) {
    return responder(400, { erro: "informe 'to' e 'text'" });
  }

  try {
    const id = await enviarTexto(String(to), String(text));
    return responder(200, { ok: true, externalMessageId: id });
  } catch (erro) {
    console.error("[send] falhou:", erro.message);
    // 503 sinaliza ao ORDO que vale tentar de novo depois.
    return responder(503, { erro: erro.message });
  }
});

servidor.listen(config.port, () => {
  console.log(`[ponte] ouvindo em http://localhost:${config.port}`);
  console.log(`[ponte] ORDO em ${config.ordoUrl}`);
});

iniciarWhatsapp().catch((erro) => {
  console.error("[ponte] não consegui iniciar o WhatsApp:", erro.message);
  process.exit(1);
});

for (const sinal of ["SIGINT", "SIGTERM"]) {
  process.on(sinal, () => {
    console.log("\n[ponte] encerrando…");
    servidor.close(() => process.exit(0));
  });
}
