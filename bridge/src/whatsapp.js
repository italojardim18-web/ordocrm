import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import { writeFile } from "node:fs/promises";
import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import pino from "pino";
import { config } from "./config.js";
import { sendToOrdo } from "./ordo-client.js";

/**
 * Sessão do WhatsApp como dispositivo conectado (mesmo mecanismo do WhatsApp
 * Web). O celular continua funcionando normalmente: esta é apenas mais uma
 * "aparelho conectado" na conta.
 */

const logger = pino({ level: "silent" });

let socket = null;
let estado = "iniciando";

export function estadoAtual() {
  return estado;
}

async function anunciarEstado(novo) {
  if (estado === novo) return;
  estado = novo;
  console.log(`[whatsapp] estado: ${novo}`);
  await sendToOrdo({ event: "state", state: novo }, { attempts: 2 });
}

/** Extrai o texto de qualquer um dos formatos que o WhatsApp usa. */
function extrairTexto(message) {
  const m = message?.message;
  if (!m) return null;
  return (
    m.conversation ??
    m.extendedTextMessage?.text ??
    m.imageMessage?.caption ??
    m.videoMessage?.caption ??
    m.documentMessage?.caption ??
    null
  );
}

/** Identifica mídia sem baixar o arquivo (anexos ficam para depois). */
function extrairTipoMidia(message) {
  const m = message?.message;
  if (!m) return null;
  if (m.imageMessage) return "image";
  if (m.videoMessage) return "video";
  if (m.audioMessage) return "audio";
  if (m.documentMessage) return "document";
  if (m.stickerMessage) return "sticker";
  if (m.locationMessage) return "location";
  return null;
}

export async function iniciarWhatsapp() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  socket = makeWASocket({
    version,
    auth: state,
    logger,
    // Sem "online" permanente: reduz consumo e não rouba notificação do celular.
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      await anunciarEstado("aguardando_qr");
      console.log(
        "\nEscaneie o QR no WhatsApp do celular:\n" +
          "  Configurações → Aparelhos conectados → Conectar aparelho\n",
      );
      qrcode.generate(qr, { small: true });

      // Também salva como imagem: mais fácil de escanear que o ASCII do
      // terminal. O arquivo é sobrescrito a cada QR novo e perde a validade
      // em segundos — não é segredo persistente.
      try {
        await QRCode.toFile(config.qrFile, qr, { width: 512, margin: 2 });
        console.log(`[whatsapp] QR também salvo em ${config.qrFile}`);
      } catch (erro) {
        console.warn("[whatsapp] não consegui salvar o QR como imagem:", erro.message);
      }
    }

    if (connection === "open") {
      await anunciarEstado("conectado");
    }

    if (connection === "close") {
      const codigo = lastDisconnect?.error?.output?.statusCode;
      const deslogado = codigo === DisconnectReason.loggedOut;

      await anunciarEstado(deslogado ? "desconectado" : "reconectando");

      if (deslogado) {
        console.error(
          "[whatsapp] sessão encerrada no celular. Apague a pasta da sessão e pareie de novo.",
        );
        return;
      }

      console.warn("[whatsapp] conexão caiu, reconectando em 3s…");
      setTimeout(() => {
        iniciarWhatsapp().catch((erro) =>
          console.error("[whatsapp] falha ao reconectar:", erro.message),
        );
      }, 3000);
    }
  });

  socket.ev.on("messages.upsert", async ({ messages, type }) => {
    // `notify` = mensagem nova de verdade; `append` costuma ser histórico.
    if (type !== "notify") return;

    const normalizadas = [];

    for (const message of messages) {
      const jid = message.key?.remoteJid;
      if (!jid) continue;

      // Grupos, status e transmissões não fazem parte do fluxo comercial.
      if (jid.endsWith("@g.us") || jid === "status@broadcast") continue;

      const texto = extrairTexto(message);
      const midia = extrairTipoMidia(message);
      if (!texto && !midia) continue;

      normalizadas.push({
        id: message.key.id,
        from: jid,
        pushName: message.pushName ?? null,
        text: texto,
        mediaType: midia,
        timestamp: Number(message.messageTimestamp ?? 0) || null,
        // Eco: mensagem que você mesmo mandou pelo celular.
        fromMe: Boolean(message.key.fromMe),
        isGroup: false,
      });
    }

    if (normalizadas.length === 0) return;

    await sendToOrdo({ event: "message", messages: normalizadas });
  });

  return socket;
}

/** Envia uma mensagem de texto. Usado pelo ORDO ao processar a fila de saída. */
export async function enviarTexto(telefone, texto) {
  if (!socket || estado !== "conectado") {
    throw new Error(`sessão indisponível (estado: ${estado})`);
  }

  const jid = `${telefone.replace(/\D/g, "")}@s.whatsapp.net`;

  // Confere se o número existe no WhatsApp antes de tentar entregar.
  const [existe] = await socket.onWhatsApp(jid);
  if (!existe?.exists) {
    throw new Error("número não encontrado no WhatsApp");
  }

  // Pequena pausa entre envios: rajada é o que mais chama atenção.
  await new Promise((resolve) => setTimeout(resolve, config.sendDelayMs));

  const resultado = await socket.sendMessage(existe.jid, { text: texto });
  return resultado?.key?.id ?? null;
}
