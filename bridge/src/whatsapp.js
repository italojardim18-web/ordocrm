import {
  downloadMediaMessage,
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import { mkdir } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import pino from "pino";
import { config } from "./config.js";
import { sendToOrdo } from "./ordo-client.js";

/**
 * Gerenciador de sessões WhatsApp multi-dispositivo.
 *
 * Cada sessão é um "aparelho conectado" independente — permite conectar
 * o número do Dr. Ítalo e o número da Secretária ao mesmo CRM.
 *
 * Cada sessão tem:
 * - Seu próprio diretório de autenticação (dentro de config.sessionDir)
 * - Seu próprio socket Baileys
 * - Seu próprio estado e QR code
 */

const logger = pino({ level: "silent" });

/** @type {Map<string, { socket: any, estado: string, lidMap: Map<string, string>, qrData: string|null }>} */
const sessoes = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (compartilhados entre sessões)
// ─────────────────────────────────────────────────────────────────────────────

function registrarContato(sessao, contato) {
  if (!contato) return;
  const jid = contato.id || contato.jid;
  const lid = contato.lid ? contato.lid.split("@")[0].split(":")[0] : null;
  const telefone = jid ? jid.split("@")[0].split(":")[0] : null;

  const nomeSalvo = contato.name || contato.notify || contato.verifiedName || null;

  if (lid && telefone && /^[0-9]{8,15}$/.test(telefone)) {
    sessao.lidMap.set(lid, telefone);
  }

  if (nomeSalvo) {
    if (telefone) sessao.contactMap.set(telefone, nomeSalvo);
    if (lid) sessao.contactMap.set(lid, nomeSalvo);
    if (jid) sessao.contactMap.set(jid, nomeSalvo);
  }
}

function ehTelefoneValido(numero) {
  if (!numero) return false;
  const clean = String(numero).replace(/\D/g, "");
  // Telefones válidos (com DDI e DDD) têm entre 10 e 13 dígitos
  // LIDs do WhatsApp têm 14 ou mais dígitos e não são números discáveis
  return clean.length >= 10 && clean.length <= 13;
}

function resolverTelefone(sessao, jid, alternativo) {
  if (!jid) return null;

  // Se veio JID alternativo (muitas vezes Baileys passa o JID real em remoteJidAlt)
  if (alternativo && (alternativo.endsWith("@s.whatsapp.net") || alternativo.endsWith("@c.us"))) {
    const telAlt = alternativo.split("@")[0].split(":")[0];
    if (ehTelefoneValido(telAlt)) return telAlt;
  }

  const usuario = jid.split("@")[0].split(":")[0];

  // Se já é um JID de usuário padrão (@s.whatsapp.net) e tem tamanho de telefone
  if ((jid.endsWith("@s.whatsapp.net") || jid.endsWith("@c.us")) && ehTelefoneValido(usuario)) {
    return usuario;
  }

  // Tenta resolver o LID no mapa de contatos
  const resolvido = sessao.lidMap.get(usuario);
  if (resolvido && ehTelefoneValido(resolvido)) {
    return resolvido;
  }

  // Se for LID e não foi resolvido ainda, NUNCA retorna o número do LID como telefone
  return null;
}

function resolverNomeContato(sessao, jid, telefone, message, fromMe, alternativo) {
  if (!jid) return null;
  const usuario = jid.split("@")[0].split(":")[0];
  const altUsuario = alternativo ? alternativo.split("@")[0].split(":")[0] : null;

  // 1. Nome salvo na agenda do WhatsApp
  const nomeAgenda =
    sessao.contactMap.get(usuario) ||
    (telefone ? sessao.contactMap.get(telefone) : null) ||
    (altUsuario ? sessao.contactMap.get(altUsuario) : null) ||
    sessao.contactMap.get(jid);

  if (nomeAgenda && nomeAgenda.trim()) {
    return nomeAgenda.trim();
  }

  // 2. Se a mensagem veio do cliente (fromMe: false), usa o pushName configurado pelo cliente no WhatsApp
  if (!fromMe && message.pushName && message.pushName.trim()) {
    return message.pushName.trim();
  }

  // 3. Se for fromMe: true (mensagem enviada pelo médico/secretária), NUNCA usar pushName da própria conta
  return null;
}

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

function extrairMetadadosMidia(message) {
  const m = message?.message;
  if (!m) return null;
  const node =
    m.imageMessage ?? m.videoMessage ?? m.audioMessage ??
    m.documentMessage ?? m.stickerMessage;
  if (!node) return null;
  return {
    mime: node.mimetype ?? null,
    filename: node.fileName ?? null,
    size: node.fileLength ? Number(node.fileLength) : null,
    duration: node.seconds ?? null,
  };
}

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

// ─────────────────────────────────────────────────────────────────────────────
// Gerenciamento de sessões
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lista todas as sessões e seus estados.
 */
export function listarSessoes() {
  const resultado = [];
  for (const [sessionId, sessao] of sessoes) {
    resultado.push({
      sessionId,
      estado: sessao.estado,
      hasQr: !!sessao.qrData,
    });
  }
  return resultado;
}

/**
 * Retorna o estado de uma sessão específica.
 */
export function estadoSessao(sessionId) {
  const sessao = sessoes.get(sessionId);
  if (!sessao) return null;
  return {
    sessionId,
    estado: sessao.estado,
    hasQr: !!sessao.qrData,
  };
}

/**
 * Estado geral: retorna "conectado" se qualquer sessão está conectada.
 * Compatibilidade com o endpoint /health existente.
 */
export function estadoAtual() {
  for (const sessao of sessoes.values()) {
    if (sessao.estado === "conectado") return "conectado";
  }
  if (sessoes.size === 0) return "sem_sessao";
  return "desconectado";
}

/**
 * Retorna o QR code de uma sessão como base64 data URL para exibição no CRM.
 */
export async function obterQrBase64(sessionId) {
  const sessao = sessoes.get(sessionId);
  if (!sessao?.qrData) return null;
  try {
    return await QRCode.toDataURL(sessao.qrData, { width: 512, margin: 2 });
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Iniciar / parar sessões
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inicia uma sessão do WhatsApp.
 *
 * @param {string} sessionId - Identificador único da sessão (ex: "principal", "secretaria")
 */
export async function iniciarSessao(sessionId) {
  if (sessoes.has(sessionId)) {
    console.log(`[whatsapp:${sessionId}] sessão já ativa, ignorando`);
    return sessoes.get(sessionId);
  }

  const sessionDir = join(config.sessionDir, sessionId);
  await mkdir(sessionDir, { recursive: true });

  const sessao = {
    socket: null,
    estado: "iniciando",
    lidMap: new Map(),
    contactMap: new Map(),
    qrData: null,
  };
  sessoes.set(sessionId, sessao);

  async function anunciarEstado(novo) {
    if (sessao.estado === novo) return;
    sessao.estado = novo;
    console.log(`[whatsapp:${sessionId}] estado: ${novo}`);
    await sendToOrdo({ event: "state", state: novo, sessionId }, { attempts: 2 });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const nomeAparelho = sessionId === "secretaria" ? "ORDO CRM (Secretária)" : "ORDO CRM (Dr. Ítalo)";

  const socket = makeWASocket({
    version,
    auth: state,
    logger,
    browser: [nomeAparelho, "Chrome", "1.0.0"],
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  sessao.socket = socket;

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("contacts.upsert", (contatos) =>
    contatos.forEach((c) => registrarContato(sessao, c)),
  );
  socket.ev.on("contacts.update", (contatos) =>
    contatos.forEach((c) => registrarContato(sessao, c)),
  );
  socket.ev.on("messaging-history.set", ({ contacts }) =>
    (contacts ?? []).forEach((c) => registrarContato(sessao, c)),
  );

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      sessao.qrData = qr;
      await anunciarEstado("aguardando_qr");
      console.log(
        `\n[whatsapp:${sessionId}] Escaneie o QR no WhatsApp do celular:\n` +
          "  Configurações → Aparelhos conectados → Conectar aparelho\n",
      );
      qrcode.generate(qr, { small: true });

      try {
        const qrFile = join(config.sessionDir, `qr-${sessionId}.png`);
        await QRCode.toFile(qrFile, qr, { width: 512, margin: 2 });
        console.log(`[whatsapp:${sessionId}] QR salvo em ${qrFile}`);
      } catch (erro) {
        console.warn(`[whatsapp:${sessionId}] não consegui salvar o QR:`, erro.message);
      }
    }

    if (connection === "open") {
      sessao.qrData = null; // QR não é mais necessário
      await anunciarEstado("conectado");
    }

    if (connection === "close") {
      const codigo = lastDisconnect?.error?.output?.statusCode;
      const deslogado = codigo === DisconnectReason.loggedOut;

      await anunciarEstado(deslogado ? "desconectado" : "reconectando");

      if (deslogado) {
        console.error(
          `[whatsapp:${sessionId}] sessão encerrada no celular. Remova e pareie de novo.`,
        );
        return;
      }

      console.warn(`[whatsapp:${sessionId}] conexão caiu, reconectando em 3s…`);
      sessoes.delete(sessionId);
      setTimeout(() => {
        iniciarSessao(sessionId).catch((erro) =>
          console.error(`[whatsapp:${sessionId}] falha ao reconectar:`, erro.message),
        );
      }, 3000);
    }
  });

  socket.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    const normalizadas = [];

    for (const message of messages) {
      const jid = message.key?.remoteJid;
      if (!jid) continue;
      if (jid.endsWith("@g.us") || jid === "status@broadcast") continue;

      const texto = extrairTexto(message);
      const midia = extrairTipoMidia(message);
      if (!texto && !midia) continue;

      let anexo = null;
      if (midia && midia !== "location") {
        const meta = extrairMetadadosMidia(message);
        const tamanho = meta?.size ?? 0;
        if (tamanho > config.maxMediaBytes) {
          console.warn(
            `[whatsapp:${sessionId}] mídia de ${Math.round(tamanho / 1048576)}MB acima do limite`,
          );
        } else {
          try {
            const buffer = await downloadMediaMessage(message, "buffer", {});
            anexo = {
              base64: buffer.toString("base64"),
              mime: meta?.mime ?? null,
              filename: meta?.filename ?? null,
              size: buffer.length,
              duration: meta?.duration ?? null,
            };
          } catch (erro) {
            console.warn(`[whatsapp:${sessionId}] não consegui baixar a mídia:`, erro.message);
          }
        }
      }

      const alternativo = message.key.remoteJidAlt ?? message.key.participantAlt;
      if (alternativo) {
        registrarContato(sessao, { lid: jid, jid: alternativo });
      }

      const fromMe = Boolean(message.key.fromMe);
      const phone = resolverTelefone(sessao, jid, alternativo);
      const nomeContato = resolverNomeContato(sessao, jid, phone, message, fromMe, alternativo);

      normalizadas.push({
        id: message.key.id,
        from: jid,
        phone,
        pushName: nomeContato,
        text: texto,
        mediaType: midia,
        media: anexo,
        timestamp: Number(message.messageTimestamp ?? 0) || null,
        fromMe,
        isGroup: false,
      });
    }

    if (normalizadas.length === 0) return;

    // Inclui o sessionId no envelope para o ORDO saber de qual linha veio
    await sendToOrdo({ event: "message", messages: normalizadas, sessionId });
  });

  return sessao;
}

/**
 * Para uma sessão e desconecta o socket.
 */
export async function pararSessao(sessionId) {
  const sessao = sessoes.get(sessionId);
  if (!sessao) return;
  try {
    sessao.socket?.end();
  } catch { /* ignorar */ }
  sessoes.delete(sessionId);
  console.log(`[whatsapp:${sessionId}] sessão encerrada`);
}

/**
 * Reseta uma sessão: encerra o socket, apaga a pasta de autenticação
 * e inicia um novo socket gerando um QR Code fresco para pareamento.
 */
export async function resetarSessao(sessionId) {
  await pararSessao(sessionId);
  const sessionDir = join(config.sessionDir, sessionId);
  try {
    const { rm } = await import("node:fs/promises");
    await rm(sessionDir, { recursive: true, force: true });
    console.log(`[whatsapp:${sessionId}] pasta de credenciais resetada`);
  } catch (err) {
    console.warn(`[whatsapp:${sessionId}] erro ao limpar pasta:`, err.message);
  }
  return await iniciarSessao(sessionId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Compatibilidade: iniciarWhatsapp() sobe todas as sessões existentes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inicia todas as sessões encontradas em disco + a sessão padrão.
 * Chamada no boot da ponte.
 */
export async function iniciarWhatsapp() {
  await mkdir(config.sessionDir, { recursive: true });

  // Detecta sessões existentes em disco
  const entradas = existsSync(config.sessionDir)
    ? readdirSync(config.sessionDir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : [];

  // Se não há nenhuma sessão em disco, cria a padrão ("principal")
  if (entradas.length === 0) {
    // Migra a sessão antiga (sem subpasta) para o novo formato
    const authOldFile = join(config.sessionDir, "creds.json");
    if (existsSync(authOldFile)) {
      console.log("[whatsapp] migrando sessão legada para formato multi-sessão…");
      const destDir = join(config.sessionDir, "principal");
      await mkdir(destDir, { recursive: true });
      // Move todos os arquivos da pasta de sessão antiga para a subpasta "principal"
      const { rename } = await import("node:fs/promises");
      const files = readdirSync(config.sessionDir, { withFileTypes: true })
        .filter((e) => e.isFile());
      for (const f of files) {
        await rename(join(config.sessionDir, f.name), join(destDir, f.name));
      }
      entradas.push("principal");
    } else {
      entradas.push("principal");
    }
  }

  console.log(`[whatsapp] iniciando ${entradas.length} sessão(ões): ${entradas.join(", ")}`);

  // Inicia todas as sessões em paralelo
  await Promise.all(entradas.map((id) => iniciarSessao(id)));
}

/**
 * Envia uma mensagem de texto por uma sessão específica.
 *
 * @param {string} identificador - Telefone ou LID do destinatário
 * @param {string} texto - Conteúdo da mensagem
 * @param {string} [sessionId] - Qual sessão usar (padrão: "principal")
 */
export async function enviarTexto(identificador, texto, sessionId = "principal") {
  const sessao = sessoes.get(sessionId);
  if (!sessao?.socket || sessao.estado !== "conectado") {
    throw new Error(`sessão "${sessionId}" não está conectada ao WhatsApp`);
  }

  const socket = sessao.socket;
  const limpo = String(identificador).replace(/\D/g, "");
  if (!limpo) throw new Error("destinatário vazio");

  let destino;

  if (limpo.length <= 13) {
    destino = `${limpo}@s.whatsapp.net`;
  } else {
    destino = `${limpo}@lid`;
  }

  // Delay mínimo de 150ms apenas para não engasgar o buffer de rede
  if (config.sendDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, Math.min(config.sendDelayMs, 200)));
  }

  const resultado = await socket.sendMessage(destino, { text: texto });
  return resultado?.key?.id ?? null;
}
