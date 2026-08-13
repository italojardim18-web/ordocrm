/**
 * Registra (ou atualiza) a conexão da ponte no ORDO.
 *
 * Gera um segredo compartilhado, cifra com INTEGRATION_TOKEN_KEY e grava em
 * channel_connections. Imprime o segredo em claro UMA vez, para você colocar
 * no ambiente da ponte — depois disso ele só existe cifrado.
 *
 * Uso:
 *   node scripts/configurar-ponte.mjs [--url http://localhost:8787] [--secret <hex>]
 */
import { createCipheriv, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function carregarEnv(caminho = ".env.local") {
  try {
    for (const linha of readFileSync(caminho, "utf8").split("\n")) {
      const limpa = linha.trim();
      if (!limpa || limpa.startsWith("#")) continue;
      const igual = limpa.indexOf("=");
      if (igual === -1) continue;
      const chave = limpa.slice(0, igual).trim();
      if (!process.env[chave]) {
        process.env[chave] = limpa.slice(igual + 1).trim();
      }
    }
  } catch {
    // Sem .env.local: assume variáveis já exportadas no ambiente.
  }
}

carregarEnv();

function cifrar(texto, chaveBase64) {
  const chave = Buffer.from(chaveBase64, "base64");
  if (chave.length !== 32) {
    throw new Error("INTEGRATION_TOKEN_KEY precisa ter 32 bytes em base64");
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", chave, iv);
  const cifrado = Buffer.concat([cipher.update(texto, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), cifrado]).toString("base64");
}

function arg(nome, padrao) {
  const i = process.argv.indexOf(`--${nome}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : padrao;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tokenKey = process.env.INTEGRATION_TOKEN_KEY;

if (!url || !serviceKey || !tokenKey) {
  console.error(
    "Faltam variáveis: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e INTEGRATION_TOKEN_KEY",
  );
  process.exit(1);
}

const bridgeUrl = arg("url", "http://localhost:8787");
const segredo = arg("secret", randomBytes(32).toString("hex"));

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const { data: workspaces, error: erroWs } = await db
  .from("workspaces")
  .select("id, name")
  .order("created_at")
  .limit(1);

if (erroWs || !workspaces?.length) {
  console.error("Não encontrei nenhum workspace:", erroWs?.message ?? "vazio");
  process.exit(1);
}

const workspace = workspaces[0];

const { error } = await db.from("channel_connections").upsert(
  {
    workspace_id: workspace.id,
    provider: "whatsapp",
    transport: "bridge",
    status: "connected",
    display_name: "WhatsApp (ponte)",
    bridge_url: bridgeUrl,
    bridge_secret_enc: cifrar(segredo, tokenKey),
    bridge_state: "aguardando_qr",
    bridge_state_at: new Date().toISOString(),
  },
  { onConflict: "workspace_id,provider" },
);

if (error) {
  console.error("Falhou ao gravar a conexão:", error.message);
  process.exit(1);
}

console.log(`\nConexão registrada para o workspace "${workspace.name}".`);
console.log(`Ponte esperada em: ${bridgeUrl}\n`);
console.log("Use este segredo no ambiente da ponte (aparece só agora):\n");
console.log(`  export ORDO_BRIDGE_SECRET="${segredo}"\n`);
