/**
 * RLS e RPCs da Fase 3: agendamentos, oportunidades, vendas e proteção dos
 * tokens de calendário. Requer o stack local com migrations + seed.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { config as loadEnv } from "dotenv";
import { adminClient, criarFixtures, limparFixtures } from "./fixtures";

loadEnv({ path: ".env.local" });

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasStack = Boolean(SUPABASE_URL && ANON_KEY);

const WS_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PIPELINE_A = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const STAGE_NEW = "c0000000-0000-4000-8000-000000000001";
const STAGE_WON = "c0000000-0000-4000-8000-000000000006";
const PRODUCT = "11110000-0000-4000-8000-000000000001";
const LOST_REASON = "22220000-0000-4000-8000-000000000001";
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

async function createLead(client: SupabaseClient, name: string) {
  const { data, error } = await client
    .from("leads")
    .insert({
      workspace_id: WS_A,
      pipeline_id: PIPELINE_A,
      stage_id: STAGE_NEW,
      position: 9999,
      name,
      channel: "manual",
    })
    .select("id")
    .single();
  if (error) throw new Error(`falha ao criar lead: ${error.message}`);
  return data!.id as string;
}

describe.skipIf(!hasStack)("RLS — processo comercial (Fase 3)", () => {
  let adminA: SupabaseClient;
  let assistantA: SupabaseClient;
  let adminB: SupabaseClient;

  const db = adminClient();

  afterAll(async () => {
    await limparFixtures(db);
  });

  beforeAll(async () => {
    await criarFixtures(db);
    [adminA, assistantA, adminB] = await Promise.all([
      signIn("admin@praxis.dev"),
      signIn("assistente@praxis.dev"),
      signIn("admin@outra.dev"),
    ]);
  });

  it("agendamentos e oportunidades são isolados por workspace", async () => {
    const { data: appointments } = await adminB.from("appointments").select("id");
    expect(appointments ?? []).toHaveLength(0);

    const { data: opportunities } = await adminB
      .from("opportunities")
      .select("id");
    expect(opportunities ?? []).toHaveLength(0);

    const { data: ownAppointments } = await adminA
      .from("appointments")
      .select("id");
    expect((ownAppointments ?? []).length).toBeGreaterThan(0);
  });

  it("assistente registra sessão e altera o estado", async () => {
    const leadId = await createLead(assistantA, "Lead Teste Sessão");

    const { data: appointment, error } = await assistantA
      .from("appointments")
      .insert({
        workspace_id: WS_A,
        lead_id: leadId,
        title: "Sessão de alinhamento",
        starts_at: new Date(Date.now() + 86_400_000).toISOString(),
        ends_at: new Date(Date.now() + 90_000_000).toISOString(),
      })
      .select("id")
      .single();
    expect(error).toBeNull();

    const { error: updateError } = await assistantA
      .from("appointments")
      .update({ status: "completed" })
      .eq("id", appointment!.id);
    expect(updateError).toBeNull();

    const { data: updated } = await assistantA
      .from("appointments")
      .select("status")
      .eq("id", appointment!.id)
      .single();
    expect(updated?.status).toBe("completed");
  });

  it("register_sale fecha a oportunidade e move o lead para Venda realizada", async () => {
    const leadId = await createLead(adminA, "Lead Teste Venda");

    const { data: opportunity } = await adminA
      .from("opportunities")
      .insert({
        workspace_id: WS_A,
        lead_id: leadId,
        product_id: PRODUCT,
        status: "open",
        potential_value: 2400,
      })
      .select("id")
      .single();

    const { error } = await adminA.rpc("register_sale", {
      p_lead_id: leadId,
      p_product_id: PRODUCT,
      p_sold_value: 2200,
      p_payment_method: "Pix",
      p_opportunity_id: opportunity!.id,
    });
    expect(error).toBeNull();

    const { data: closed } = await adminA
      .from("opportunities")
      .select("status, sold_value, closed_at")
      .eq("id", opportunity!.id)
      .single();
    expect(closed?.status).toBe("won");
    expect(Number(closed?.sold_value)).toBe(2200);
    expect(closed?.closed_at).not.toBeNull();

    const { data: lead } = await adminA
      .from("leads")
      .select("stage_id")
      .eq("id", leadId)
      .single();
    expect(lead?.stage_id).toBe(STAGE_WON);

    // O histórico registra a passagem para "won" (base do funil).
    const { data: history } = await adminA
      .from("lead_stage_history")
      .select("to_stage_type")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(1);
    expect(history?.[0]?.to_stage_type).toBe("won");
  });

  it("register_sale recusa oportunidade já fechada e valor negativo", async () => {
    const leadId = await createLead(adminA, "Lead Teste Venda Inválida");

    const { error: negative } = await adminA.rpc("register_sale", {
      p_lead_id: leadId,
      p_product_id: PRODUCT,
      p_sold_value: -100,
    });
    expect(negative).not.toBeNull();

    const { data: opportunityId } = await adminA.rpc("register_sale", {
      p_lead_id: leadId,
      p_product_id: PRODUCT,
      p_sold_value: 1000,
    });

    const { error: reclose } = await adminA.rpc("register_sale", {
      p_lead_id: leadId,
      p_product_id: PRODUCT,
      p_sold_value: 1000,
      p_opportunity_id: opportunityId,
    });
    expect(reclose).not.toBeNull();
  });

  it("workspace vizinho não registra venda em lead alheio", async () => {
    const leadId = await createLead(adminA, "Lead Teste Isolamento Venda");

    const { error } = await adminB.rpc("register_sale", {
      p_lead_id: leadId,
      p_product_id: PRODUCT,
      p_sold_value: 500,
    });
    expect(error).not.toBeNull();
  });

  it("marcar lead como perdido fecha as oportunidades abertas", async () => {
    const leadId = await createLead(adminA, "Lead Teste Perda Comercial");

    await adminA.from("opportunities").insert({
      workspace_id: WS_A,
      lead_id: leadId,
      product_id: PRODUCT,
      status: "open",
      potential_value: 900,
    });

    const { error } = await adminA.rpc("mark_lead_lost", {
      p_lead_id: leadId,
      p_lost_reason_id: LOST_REASON,
      p_note: "sem retorno",
    });
    expect(error).toBeNull();

    const { data: opportunities } = await adminA
      .from("opportunities")
      .select("status")
      .eq("lead_id", leadId);
    expect(opportunities!.every((o) => o.status === "lost")).toBe(true);
  });

  it("tokens de calendário são ilegíveis para usuários autenticados", async () => {
    const { error } = await adminA
      .from("calendar_connections")
      .select("access_token_enc, refresh_token_enc");
    expect(error).not.toBeNull();

    // As colunas não sensíveis continuam acessíveis ao admin.
    const { error: safeError } = await adminA
      .from("calendar_connections")
      .select("id, status, calendar_id");
    expect(safeError).toBeNull();
  });

  it("assistente não enxerga conexões nem eventos de sincronização", async () => {
    const { data: connections } = await assistantA
      .from("calendar_connections")
      .select("id");
    expect(connections ?? []).toHaveLength(0);

    const { data: syncEvents } = await assistantA
      .from("calendar_sync_events")
      .select("id");
    expect(syncEvents ?? []).toHaveLength(0);
  });
});

if (!hasStack) {
  describe("RLS — processo comercial (Fase 3)", () => {
    it.skip("ignorado: stack local do Supabase indisponível", () => {});
  });
}
