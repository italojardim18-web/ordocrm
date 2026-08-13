/**
 * RLS da Fase 2: estrutura restrita ao admin, notas admin_only invisíveis,
 * isolamento de leads e RPCs transacionais do pipeline.
 * Requer o stack local com migrations + seed (`supabase db reset`).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { config as loadEnv } from "dotenv";
import {
  adminClient,
  criarFixtures,
  limparFixtures,
  LEAD_A as LEAD_MARIANA,
  LEAD_B,
} from "./fixtures";

loadEnv({ path: ".env.local" });

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasStack = Boolean(SUPABASE_URL && ANON_KEY);

const WS_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
let PIPELINE_A = "";
let STAGE_NEW = "";
let STAGE_QUALIFICATION = "";


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

describe.skipIf(!hasStack)("RLS — CRM principal (Fase 2)", () => {
  let adminA: SupabaseClient;
  let assistantA: SupabaseClient;
  let adminB: SupabaseClient;

  const db = adminClient();

  beforeAll(async () => {
    const ok = await criarFixtures(db);
    if (!ok) throw new Error("workspaces sem pipeline — rode as migrations");

    const { data: pipeline } = await db
      .from("pipelines")
      .select("id")
      .eq("workspace_id", WS_A)
      .order("is_default", { ascending: false })
      .limit(1)
      .single();
    PIPELINE_A = pipeline!.id;

    const { data: etapas } = await db
      .from("pipeline_stages")
      .select("id")
      .eq("pipeline_id", PIPELINE_A)
      .order("position")
      .limit(2);
    STAGE_NEW = etapas![0].id;
    STAGE_QUALIFICATION = etapas![1]?.id ?? etapas![0].id;
    [adminA, assistantA, adminB] = await Promise.all([
      signIn("admin@praxis.dev"),
      signIn("assistente@praxis.dev"),
      signIn("admin@outra.dev"),
    ]);
  });

  afterAll(async () => {
    await limparFixtures(db);
  });

  it("leads são isolados por workspace", async () => {
    const { data } = await adminA.from("leads").select("id, workspace_id");
    expect(data!.length).toBeGreaterThan(0);
    expect(data!.every((l) => l.workspace_id === WS_A)).toBe(true);
    expect(data!.some((l) => l.id === LEAD_B)).toBe(false);
  });

  it("assistente não cria nem edita produtos e etapas", async () => {
    const { error: productError } = await assistantA.from("products").insert({
      workspace_id: WS_A,
      name: "Produto irregular",
    });
    expect(productError).not.toBeNull();

    await assistantA
      .from("pipeline_stages")
      .update({ name: "hackeada" })
      .eq("id", STAGE_NEW);
    const { data: stage } = await assistantA
      .from("pipeline_stages")
      .select("name")
      .eq("id", STAGE_NEW)
      .single();
    expect(stage?.name).toBe("Novo lead");
  });

  it("admin gerencia produtos", async () => {
    const { data, error } = await adminA
      .from("products")
      .insert({ workspace_id: WS_A, name: "Produto de teste RLS" })
      .select("id")
      .single();
    expect(error).toBeNull();

    await adminA.from("products").delete().eq("id", data!.id);
  });

  it("nota admin_only é invisível ao assistente", async () => {
    const { data: adminNotes } = await adminA
      .from("notes")
      .select("id, visibility")
      .eq("visibility", "admin_only");
    expect(adminNotes!.length).toBeGreaterThan(0);

    const { data: assistantNotes } = await assistantA
      .from("notes")
      .select("id, visibility");
    expect(
      assistantNotes!.every((n) => n.visibility === "team"),
    ).toBe(true);
  });

  it("assistente não cria nota admin_only, mas cria nota de equipe", async () => {
    const {
      data: { user },
    } = await assistantA.auth.getUser();

    const { error: adminOnlyError } = await assistantA.from("notes").insert({
      workspace_id: WS_A,
      lead_id: LEAD_MARIANA,
      author_id: user!.id,
      body: "tentativa admin_only",
      visibility: "admin_only",
    });
    expect(adminOnlyError).not.toBeNull();

    const { data: teamNote, error: teamError } = await assistantA
      .from("notes")
      .insert({
        workspace_id: WS_A,
        lead_id: LEAD_MARIANA,
        author_id: user!.id,
        body: "nota de equipe do teste",
        visibility: "team",
      })
      .select("id")
      .single();
    expect(teamError).toBeNull();

    await assistantA
      .from("notes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", teamNote!.id);
  });

  it("mudança de etapa direta é bloqueada (histórico obrigatório)", async () => {
    const { error } = await adminA
      .from("leads")
      .update({ stage_id: STAGE_QUALIFICATION })
      .eq("id", LEAD_MARIANA);
    expect(error).not.toBeNull();
  });

  it("move_lead_stage move, grava histórico e respeita workspace", async () => {
    const { error } = await assistantA.rpc("move_lead_stage", {
      p_lead_id: LEAD_MARIANA,
      p_stage_id: STAGE_QUALIFICATION,
      p_position: 500,
    });
    expect(error).toBeNull();

    const { data: history } = await assistantA
      .from("lead_stage_history")
      .select("to_stage_type")
      .eq("lead_id", LEAD_MARIANA)
      .order("created_at", { ascending: false })
      .limit(1);
    expect(history?.[0]?.to_stage_type).toBe("qualification");

    // Devolve para a etapa original.
    await assistantA.rpc("move_lead_stage", {
      p_lead_id: LEAD_MARIANA,
      p_stage_id: STAGE_NEW,
      p_position: 1000,
    });

    // Outro workspace não move leads alheios.
    const { error: crossError } = await adminB.rpc("move_lead_stage", {
      p_lead_id: LEAD_MARIANA,
      p_stage_id: STAGE_QUALIFICATION,
      p_position: 500,
    });
    expect(crossError).not.toBeNull();
  });

  it("mark_lead_lost exige motivo e reactivate_lead preserva histórico", async () => {
    const { data: created } = await adminA
      .from("leads")
      .insert({
        workspace_id: WS_A,
        pipeline_id: PIPELINE_A,
        stage_id: STAGE_NEW,
        position: 9000,
        name: "Lead Teste Perda",
        channel: "manual",
      })
      .select("id")
      .single();
    const leadId = created!.id;

    const { error: noReason } = await adminA.rpc("mark_lead_lost", {
      p_lead_id: leadId,
      p_lost_reason_id: null,
    });
    expect(noReason).not.toBeNull();

    const { error: lostError } = await adminA.rpc("mark_lead_lost", {
      p_lead_id: leadId,
      p_lost_reason_id: LOST_REASON,
      p_note: "sem retorno",
    });
    expect(lostError).toBeNull();

    const { error: reactivateError } = await adminA.rpc("reactivate_lead", {
      p_lead_id: leadId,
      p_stage_id: STAGE_QUALIFICATION,
    });
    expect(reactivateError).toBeNull();

    const { data: lead } = await adminA
      .from("leads")
      .select("reactivated_count, lost_reason_id")
      .eq("id", leadId)
      .single();
    expect(lead?.reactivated_count).toBe(1);
    expect(lead?.lost_reason_id).toBeNull();

    const { count } = await adminA
      .from("lead_stage_history")
      .select("id", { count: "exact", head: true })
      .eq("lead_id", leadId);
    expect(count).toBeGreaterThanOrEqual(2);

    await adminA
      .from("leads")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", leadId);
  });

  it("merge_leads é exclusivo do admin", async () => {
    const { error } = await assistantA.rpc("merge_leads", {
      p_primary_id: LEAD_MARIANA,
      p_duplicate_id: LEAD_B,
    });
    expect(error).not.toBeNull();
  });

  it("normalização de contato acontece no banco", async () => {
    // Cria o próprio lead: testes anteriores mexem no da fixture (mesclagem,
    // mudança de etapa) e o resultado dependeria da ordem de execução.
    const { data: stage } = await adminA
      .from("pipeline_stages")
      .select("id, pipeline_id")
      .order("position")
      .limit(1)
      .single();

    const { data: criado } = await adminA
      .from("leads")
      .insert({
        workspace_id: WS_A,
        pipeline_id: stage!.pipeline_id,
        stage_id: stage!.id,
        position: 0,
        name: "Fixture normalização",
        phone: "(67) 90000-0009",
        email: "  MAIUSCULO@Example.COM  ",
      })
      .select("phone_normalized, email_normalized")
      .single();

    expect(criado?.phone_normalized).toBe("5567900000009");
    expect(criado?.email_normalized).toBe("maiusculo@example.com");
  });
});

if (!hasStack) {
  describe("RLS — CRM principal (Fase 2)", () => {
    it.skip("ignorado: stack local do Supabase indisponível", () => {});
  });
}
