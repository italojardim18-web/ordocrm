/**
 * Fórmulas do dashboard validadas contra um dataset sintético de resultado
 * conhecido: cada número esperado é calculado à mão no comentário.
 *
 * Cenário (workspace isolado, período de referência = agosto/2026):
 *   L1 ganhou   — engajou, sessão realizada, venda de 1000
 *   L2 ganhou   — engajou, sessão realizada, venda de 500 (2 oportunidades)
 *   L3 perdido  — engajou, sessão realizada, sem venda
 *   L4          — engajou, sem sessão
 *   L5          — não engajou
 *   L6 reativado — engajou, passou por lost e voltou (não duplica no funil)
 *   L7 fora do período (julho) — não entra em nenhuma contagem
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasStack = Boolean(SUPABASE_URL && SERVICE_KEY);

const WS = "eeee0000-0000-4000-8000-00000000000f";
const PIPELINE = "eeee0000-0000-4000-8000-0000000000f1";
const PRODUCT = "eeee0000-0000-4000-8000-0000000000f2";
const REASON = "eeee0000-0000-4000-8000-0000000000f3";

const STAGES = {
  new: "eeee1000-0000-4000-8000-000000000001",
  qualification: "eeee1000-0000-4000-8000-000000000002",
  session: "eeee1000-0000-4000-8000-000000000004",
  won: "eeee1000-0000-4000-8000-000000000006",
  lost: "eeee1000-0000-4000-8000-000000000007",
};

const leadId = (n: number) =>
  `eeee2000-0000-4000-8000-00000000000${n}`;

// Período de referência: agosto de 2026.
const FROM = "2026-08-01T00:00:00Z";
const TO = "2026-09-01T00:00:00Z";
const IN = "2026-08-10T12:00:00Z";
const OUT = "2026-07-10T12:00:00Z";

let db: SupabaseClient;

/** Falha alto e claro: seed silencioso produz teste que passa por engano. */
async function insert(table: string, rows: unknown) {
  const { error } = await db.from(table).insert(rows as never);
  if (error) throw new Error(`seed ${table}: ${error.message}`);
}

async function seedScenario() {
  await insert("workspaces", { id: WS, name: "WS Dashboard Teste" });
  await insert("pipelines", {
    id: PIPELINE,
    workspace_id: WS,
    name: "Teste",
    is_default: true,
  });

  await insert("pipeline_stages", [
    { id: STAGES.new, workspace_id: WS, pipeline_id: PIPELINE, name: "Novo", stage_type: "new", position: 1 },
    { id: STAGES.qualification, workspace_id: WS, pipeline_id: PIPELINE, name: "Qual", stage_type: "qualification", position: 2 },
    { id: STAGES.session, workspace_id: WS, pipeline_id: PIPELINE, name: "Sessão", stage_type: "alignment_session", position: 4 },
    { id: STAGES.won, workspace_id: WS, pipeline_id: PIPELINE, name: "Ganho", stage_type: "won", position: 6 },
    { id: STAGES.lost, workspace_id: WS, pipeline_id: PIPELINE, name: "Perdido", stage_type: "lost", position: 7 },
  ]);

  await insert("products", {
    id: PRODUCT,
    workspace_id: WS,
    name: "Produto Teste",
  });
  await insert("lost_reasons", {
    id: REASON,
    workspace_id: WS,
    label: "Sem retorno",
  });

  // Todas as linhas do lote precisam das mesmas chaves: num insert em lote, o
  // PostgREST preenche a chave ausente com NULL explícito em vez do default
  // da coluna — e `reactivated_count` é NOT NULL.
  const base = {
    workspace_id: WS,
    pipeline_id: PIPELINE,
    position: 0,
    channel: "whatsapp" as const,
    reactivated_count: 0,
  };

  await insert("leads", [
    { ...base, id: leadId(1), name: "L1 Ganho", stage_id: STAGES.won, created_at: IN, engaged_at: IN },
    { ...base, id: leadId(2), name: "L2 Ganho", stage_id: STAGES.won, created_at: IN, engaged_at: IN },
    { ...base, id: leadId(3), name: "L3 Perdido", stage_id: STAGES.lost, created_at: IN, engaged_at: IN, lost_at: IN, lost_reason_id: REASON },
    { ...base, id: leadId(4), name: "L4 Sem sessão", stage_id: STAGES.qualification, created_at: IN, engaged_at: IN },
    { ...base, id: leadId(5), name: "L5 Sem engajar", stage_id: STAGES.new, created_at: IN },
    { ...base, id: leadId(6), name: "L6 Reativado", stage_id: STAGES.qualification, created_at: IN, engaged_at: IN, reactivated_count: 1 },
    { ...base, id: leadId(7), name: "L7 Fora do período", stage_id: STAGES.new, created_at: OUT, engaged_at: OUT },
  ]);

  // Histórico: todos entram em "new"; alguns avançam. L6 passa por lost e volta
  // para qualification (duas passagens por qualification — não pode duplicar).
  const h = (lead: number, stage: keyof typeof STAGES, type: string, at = IN) => ({
    workspace_id: WS,
    lead_id: leadId(lead),
    to_stage_id: STAGES[stage],
    to_stage_type: type,
    created_at: at,
  });

  await insert("lead_stage_history", [
    h(1, "new", "new"), h(1, "qualification", "qualification"), h(1, "session", "alignment_session"), h(1, "won", "won"),
    h(2, "new", "new"), h(2, "qualification", "qualification"), h(2, "session", "alignment_session"), h(2, "won", "won"),
    h(3, "new", "new"), h(3, "qualification", "qualification"), h(3, "session", "alignment_session"), h(3, "lost", "lost"),
    h(4, "new", "new"), h(4, "qualification", "qualification"),
    h(5, "new", "new"),
    h(6, "new", "new"), h(6, "qualification", "qualification"), h(6, "lost", "lost"), h(6, "qualification", "qualification"),
    h(7, "new", "new", OUT),
  ]);

  // Sessões: L1, L2 e L3 realizaram; L4 não tem.
  await insert("appointments", [
    { workspace_id: WS, lead_id: leadId(1), title: "S1", starts_at: IN, ends_at: "2026-08-10T13:00:00Z", status: "completed", created_at: IN },
    { workspace_id: WS, lead_id: leadId(2), title: "S2", starts_at: IN, ends_at: "2026-08-10T13:00:00Z", status: "completed", created_at: IN },
    { workspace_id: WS, lead_id: leadId(3), title: "S3", starts_at: IN, ends_at: "2026-08-10T13:00:00Z", status: "completed", created_at: IN },
    { workspace_id: WS, lead_id: leadId(4), title: "S4", starts_at: "2026-08-20T12:00:00Z", ends_at: "2026-08-20T13:00:00Z", status: "no_show", created_at: IN },
  ]);

  // Vendas: L1 = 1000; L2 = 500 (e uma oportunidade aberta, que não conta).
  await insert("opportunities", [
    { workspace_id: WS, lead_id: leadId(1), product_id: PRODUCT, status: "won", sold_value: 1000, closed_at: IN },
    { workspace_id: WS, lead_id: leadId(2), product_id: PRODUCT, status: "won", sold_value: 500, closed_at: IN },
    { workspace_id: WS, lead_id: leadId(2), product_id: PRODUCT, status: "open", potential_value: 900 },
  ]);
}

describe.skipIf(!hasStack)("fórmulas do dashboard", () => {
  let summary: Record<string, number | null>;

  beforeAll(async () => {
    db = createClient(SUPABASE_URL!, SERVICE_KEY!, {
      auth: { persistSession: false },
    });
    await db.from("workspaces").delete().eq("id", WS);
    await seedScenario();

    const { data, error } = await db.rpc("dashboard_summary", {
      p_workspace_id: WS,
      p_from: FROM,
      p_to: TO,
    });
    if (error) throw new Error(error.message);
    summary = data as Record<string, number | null>;
  });

  afterAll(async () => {
    if (db) await db.from("workspaces").delete().eq("id", WS);
  });

  it("conta apenas leads criados dentro do período", () => {
    // L1..L6 em agosto; L7 é de julho.
    expect(summary.new_leads).toBe(6);
  });

  it("conta engajados pela data de engajamento", () => {
    // L1, L2, L3, L4, L6 engajaram em agosto; L5 nunca; L7 em julho.
    expect(summary.engaged_leads).toBe(5);
  });

  it("separa sessões agendadas de realizadas", () => {
    expect(summary.appointments_scheduled).toBe(4);
    expect(summary.appointments_completed).toBe(3);
    expect(summary.no_shows).toBe(1);
    expect(summary.cancellations).toBe(0);
  });

  it("soma receita só das oportunidades ganhas", () => {
    // 1000 + 500; a oportunidade aberta de 900 não entra.
    expect(summary.sales_count).toBe(2);
    expect(Number(summary.revenue)).toBe(1500);
    expect(Number(summary.average_ticket)).toBe(750);
  });

  it("taxa lead → engajamento = engajados ÷ novos leads", () => {
    // 5 ÷ 6 = 0,8333
    expect(Number(summary.rate_lead_to_engaged)).toBeCloseTo(0.8333, 4);
  });

  it("taxa engajamento → sessão usa leads engajados com sessão realizada", () => {
    // L1, L2, L3 têm sessão realizada, de 5 engajados = 0,6
    expect(Number(summary.rate_engaged_to_session)).toBeCloseTo(0.6, 4);
  });

  it("taxa sessão → venda usa leads com sessão, não número de sessões", () => {
    // 3 leads com sessão realizada; 2 converteram = 0,6667
    expect(Number(summary.rate_session_to_sale)).toBeCloseTo(0.6667, 4);
  });

  it("conversão geral usa a coorte de entrada", () => {
    // 2 vendas ÷ 6 leads criados = 0,3333
    expect(Number(summary.rate_overall)).toBeCloseTo(0.3333, 4);
  });

  it("múltiplas oportunidades do mesmo lead não inflam a conversão", () => {
    // L2 tem 2 oportunidades (1 ganha, 1 aberta) mas conta como 1 lead.
    expect(Number(summary.rate_overall)).toBeLessThan(0.5);
  });

  it("funil conta cada lead uma vez por etapa atingida, mesmo com reativação", async () => {
    const { data } = await db.rpc("dashboard_funnel", {
      p_workspace_id: WS,
      p_from: FROM,
      p_to: TO,
    });
    const funnel = new Map(
      (data as { stage_type: string; leads_reached: number }[]).map((row) => [
        row.stage_type,
        Number(row.leads_reached),
      ]),
    );

    expect(funnel.get("new")).toBe(6); // todos da coorte
    expect(funnel.get("qualification")).toBe(5); // L1..L4 e L6 (L6 passou 2x, conta 1)
    expect(funnel.get("alignment_session")).toBe(3); // L1, L2, L3
    expect(funnel.get("won")).toBe(2); // L1, L2
    expect(funnel.get("lost")).toBe(2); // L3 e L6 (que depois voltou)
  });

  it("série temporal agrega por dia sem furos no intervalo", async () => {
    const { data } = await db.rpc("dashboard_timeseries", {
      p_workspace_id: WS,
      p_from: FROM,
      p_to: TO,
    });
    const rows = data as {
      day: string;
      new_leads: number;
      sales: number;
      revenue: number;
    }[];

    expect(rows).toHaveLength(31); // agosto tem 31 dias
    const day10 = rows.find((row) => row.day === "2026-08-10");
    expect(Number(day10?.new_leads)).toBe(6);
    expect(Number(day10?.sales)).toBe(2);
    expect(Number(day10?.revenue)).toBe(1500);

    const day11 = rows.find((row) => row.day === "2026-08-11");
    expect(Number(day11?.new_leads)).toBe(0);
  });

  it("recortes trazem origem, produto e motivo de perda", async () => {
    const { data } = await db.rpc("dashboard_breakdowns", {
      p_workspace_id: WS,
      p_from: FROM,
      p_to: TO,
    });
    const breakdowns = data as {
      by_channel: { key: string; leads: number; conversions: number }[];
      by_product: { key: string; sales: number; revenue: number }[];
      by_lost_reason: { key: string; total: number }[];
    };

    const whatsapp = breakdowns.by_channel.find((row) => row.key === "whatsapp");
    expect(Number(whatsapp?.leads)).toBe(6);
    expect(Number(whatsapp?.conversions)).toBe(2);

    expect(Number(breakdowns.by_product[0]?.revenue)).toBe(1500);

    const reason = breakdowns.by_lost_reason.find(
      (row) => row.key === "Sem retorno",
    );
    expect(Number(reason?.total)).toBe(1);
  });

  it("período sem dados devolve zeros e taxas nulas, nunca 0%", async () => {
    const { data } = await db.rpc("dashboard_summary", {
      p_workspace_id: WS,
      p_from: "2020-01-01T00:00:00Z",
      p_to: "2020-02-01T00:00:00Z",
    });
    const empty = data as Record<string, number | null>;

    expect(empty.new_leads).toBe(0);
    expect(Number(empty.revenue)).toBe(0);
    // Divisão por zero vira null (a UI mostra "—"): 0% seria mentira.
    expect(empty.rate_lead_to_engaged).toBeNull();
    expect(empty.rate_overall).toBeNull();
    expect(empty.average_ticket).toBeNull();
  });

  it("filtro de origem restringe a coorte", async () => {
    const { data } = await db.rpc("dashboard_summary", {
      p_workspace_id: WS,
      p_from: FROM,
      p_to: TO,
      p_channel: "instagram",
    });
    expect((data as Record<string, number>).new_leads).toBe(0);
  });
});

if (!hasStack) {
  describe("fórmulas do dashboard", () => {
    it.skip("ignorado: stack local do Supabase indisponível", () => {});
  });
}
