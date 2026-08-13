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

/**
 * Mapa LID → telefone.
 *
 * O WhatsApp passou a endereçar contatos por LID (`@lid`), um identificador
 * interno que não é telefone. O evento de contatos traz os dois campos
 * juntos, então montamos a correspondência conforme ela aparece. Enquanto o
 * telefone não for conhecido, o lead fica sem telefone — melhor vazio do que
 * com um número que não disca.
 */
const lidParaTelefone = new Map();

function registrarContato(contato) {
  if (!contato?.lid || !contato?.jid) return;
  const lid = contato.lid.split("@")[0].split(":")[0];
  const telefone = contato.jid.split("@")[0].split(":")[0];
  if (lid && telefone && /^[0-9]{8,13}$/.test(telefone)) {
    lidParaTelefone.set(lid, telefone);
  }
}

/** Telefone real do JID, quando dá para saber. */
function resolverTelefone(jid) {
  const usuario = jid.split("@")[0].split(":")[0];
  if (jid.endsWith("@s.whatsapp.net") || jid.endsWith("@c.us")) return usuario;
  return lidParaTelefone.get(usuario) ?? null;
}

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

  // O WhatsApp entrega a correspondência LID ↔ telefone por aqui.
  socket.ev.on("contacts.upsert", (contatos) => contatos.forEach(registrarContato));
  socket.ev.on("contacts.update", (contatos) => contatos.forEach(registrarContato));
  socket.ev.on("messaging-history.set", ({ contacts }) =>
    (contacts ?? []).forEach(registrarContato),
  );

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

      // Algumas versões trazem o telefone junto da mensagem quando o
      // endereçamento é por LID.
      const alternativo = message.key.remoteJidAlt ?? message.key.participantAlt;
      if (alternativo) {
        registrarContato({ lid: jid, jid: alternativo });
      }

      normalizadas.push({
        id: message.key.id,
        from: jid,
        phone: resolverTelefone(jid),
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

/**
 * Envia uma mensagem de texto. Usado pelo ORDO ao processar a fila de saída.
 *
 * O identificador vem da conversa e pode ser telefone ou LID — desde que o
 * WhatsApp passou a endereçar por LID, montar sempre `@s.whatsapp.net`
 * entregaria no vazio.
 */
export async function enviarTexto(identificador, texto) {
  if (!socket || estado !== "conectado") {
    throw new Error(`sessão indisponível (estado: ${estado})`);
  }

  const limpo = String(identificador).replace(/\D/g, "");
  if (!limpo) throw new Error("destinatário vazio");

  let destino;

  // Até 13 dígitos é telefone (E.164 no Brasil); acima disso, LID.
  if (limpo.length <= 13) {
    const [existe] = await socket.onWhatsApp(`${limpo}@s.whatsapp.net`);
    if (!existe?.exists) {
      throw new Error("número não encontrado no WhatsApp");
    }
    destino = existe.jid;
  } else {
    destino = `${limpo}@lid`;
  }

  // Pequena pausa entre envios: rajada é o que mais chama atenção.
  await new Promise((resolve) => setTimeout(resolve, config.sendDelayMs));

  const resultado = await socket.sendMessage(destino, { text: texto });
  return resultado?.key?.id ?? null;
}
