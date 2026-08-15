/**
 * RLS da Fase 4: conversas, mensagens, webhooks e formulários.
 * Requer o stack local com migrations + seed.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { config as loadEnv } from "dotenv";
import {
  adminClient,
  criarFixtures,
  limparFixtures,
  CONVERSATION,
  WS_A,
} from "./fixtures";

loadEnv({ path: ".env.local" });

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasStack = Boolean(SUPABASE_URL && ANON_KEY);



const PASSWORD = "praxis123!";

async function signIn(email: string): Promise<SupabaseClient> {
  const client = createClient(SUPABASE_URL!, ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { error } = await client.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (error) throw new Error(`login de ${email} falhou: ${error.message}`);
  return client;
}

describe.skipIf(!hasStack)("RLS — canais e conversas (Fase 4)", () => {
  let adminA: SupabaseClient;
  let assistantA: SupabaseClient;
  let adminB: SupabaseClient;
  let anon: SupabaseClient;

  const db = adminClient();

  beforeAll(async () => {
    // A suíte cria o que precisa: não depende do seed de desenvolvimento.
    const ok = await criarFixtures(db);
    if (!ok) throw new Error("workspaces sem pipeline — rode as migrations");
    [adminA, assistantA, adminB] = await Promise.all([
      signIn("admin@praxis.dev"),
      signIn("assistente@praxis.dev"),
      signIn("admin@outra.dev"),
    ]);
    anon = createClient(SUPABASE_URL!, ANON_KEY!, {
      auth: { persistSession: false },
    });
  });

  // A suíte chama send_channel_message, que enfileira envio de verdade. Se
  // uma ponte estiver conectada a este banco, uma sobra viraria mensagem real
  // para um número de terceiro — por isso a fila é limpa ao final.
  afterAll(async () => {
    await limparFixtures(db);
  });

  it("conversas e mensagens são isoladas por workspace", async () => {
    const { data: own } = await adminA.from("conversations").select("id");
    expect((own ?? []).length).toBeGreaterThan(0);

    const { data: other } = await adminB.from("conversations").select("id");
    expect(other ?? []).toHaveLength(0);

    const { data: otherMessages } = await adminB.from("messages").select("id");
    expect(otherMessages ?? []).toHaveLength(0);
  });

  it("assistente lê e responde conversas, mas não escreve mensagem direto", async () => {
    const { data: messages } = await assistantA
      .from("messages")
      .select("id, body")
      .eq("conversation_id", CONVERSATION);
    expect((messages ?? []).length).toBeGreaterThan(0);

    const { error: directInsert } = await assistantA.from("messages").insert({
      workspace_id: WS_A,
      conversation_id: CONVERSATION,
      provider: "whatsapp",
      direction: "outbound",
      body: "insert direto proibido",
    });
    expect(directInsert).not.toBeNull();

    const { error: rpcError } = await assistantA.rpc("send_channel_message", {
      p_conversation_id: CONVERSATION,
      p_body: "resposta pelo CRM",
    });
    expect(rpcError).toBeNull();
  });

  it("mensagem enviada entra na fila de saída como pendente", async () => {
    const { data: outbox } = await adminA
      .from("outbox_messages")
      .select("status, provider")
      .eq("workspace_id", WS_A);
    expect((outbox ?? []).length).toBeGreaterThan(0);
    expect(outbox!.some((row) => row.status === "pending")).toBe(true);
  });

  it("workspace vizinho não envia mensagem em conversa alheia", async () => {
    const { error } = await adminB.rpc("send_channel_message", {
      p_conversation_id: CONVERSATION,
      p_body: "invasão",
    });
    expect(error).not.toBeNull();
  });

  it("assistente não vê webhooks, fila nem conexões de canal", async () => {
    const { data: events } = await assistantA
      .from("webhook_events")
      .select("id");
    expect(events ?? []).toHaveLength(0);

    const { data: outbox } = await assistantA
      .from("outbox_messages")
      .select("id");
    expect(outbox ?? []).toHaveLength(0);

    const { data: channels } = await assistantA
      .from("channel_connections")
      .select("id");
    expect(channels ?? []).toHaveLength(0);
  });

  it("segredos das conexões de canal são ilegíveis mesmo para admin", async () => {
    const { error } = await adminA
      .from("channel_connections")
      .select("app_secret_enc, access_token_enc");
    expect(error).not.toBeNull();

    const { error: safeError } = await adminA
      .from("channel_connections")
      .select("id, provider, status");
    expect(safeError).toBeNull();
  });

  it("ingestão de mensagem não é exposta a usuários autenticados", async () => {
    const { error } = await adminA.rpc("ingest_channel_message", {
      p_workspace_id: WS_A,
      p_provider: "whatsapp",
      p_external_conversation_id: "1",
      p_external_message_id: "forjada",
      p_sender_external_id: "1",
      p_sender_name: "x",
      p_body: "x",
    });
    expect(error).not.toBeNull();
  });

  it("anônimo não lê conversas, leads nem formulários enviados", async () => {
    const { data: conversations } = await anon
      .from("conversations")
      .select("id");
    expect(conversations ?? []).toHaveLength(0);

    const { data: leads } = await anon.from("leads").select("id");
    expect(leads ?? []).toHaveLength(0);

    const { data: submissions } = await anon
      .from("form_submissions")
      .select("id");
    expect(submissions ?? []).toHaveLength(0);
  });

  it("assistente não altera a configuração do formulário público", async () => {
    const { error } = await assistantA
      .from("form_endpoints")
      .update({ slug: "sequestrado" })
      .eq("workspace_id", WS_A);

    const { data: endpoint } = await assistantA
      .from("form_endpoints")
      .select("slug")
      .eq("workspace_id", WS_A)
      .eq("slug", "contato")
      .maybeSingle();

    expect(error === null ? endpoint?.slug : "contato").toBe("contato");
  });
});

if (!hasStack) {
  describe("RLS — canais e conversas (Fase 4)", () => {
    it.skip("ignorado: stack local do Supabase indisponível", () => {});
  });
}
