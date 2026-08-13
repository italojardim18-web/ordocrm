import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Dados de apoio das suítes de RLS.
 *
 * Antes, os testes dependiam do seed de desenvolvimento. Isso quebrou quando o
 * banco local virou o ambiente real de uso e os dados de exemplo foram
 * removidos: as suítes falhavam como se houvesse defeito de código.
 *
 * Agora cada suíte cria o que precisa e apaga no fim — roda igual num banco
 * vazio ou num banco em uso, sem deixar rastro.
 */

export const WS_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
export const WS_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
export const LEAD_A = "33330000-0000-4000-8000-0000000000f1";
export const LEAD_B = "33330000-0000-4000-8000-0000000000f2";
export const CONVERSATION = "66660000-0000-4000-8000-0000000000f1";
export const NOTE_ADMIN_ONLY = "77770000-0000-4000-8000-0000000000f1";

export function adminClient(): SupabaseClient {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Primeira etapa e pipeline de cada workspace, para pendurar os leads. */
async function pipelineDe(db: SupabaseClient, workspaceId: string) {
  const { data: pipeline } = await db
    .from("pipelines")
    .select("id")
    .eq("workspace_id", workspaceId)
    .order("is_default", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!pipeline) return null;

  const { data: stage } = await db
    .from("pipeline_stages")
    .select("id")
    .eq("pipeline_id", pipeline.id)
    .order("position")
    .limit(1)
    .maybeSingle();

  return stage ? { pipelineId: pipeline.id, stageId: stage.id } : null;
}

export async function criarFixtures(db: SupabaseClient): Promise<boolean> {
  const a = await pipelineDe(db, WS_A);
  const b = await pipelineDe(db, WS_B);
  if (!a || !b) return false;

  const base = { position: 0, channel: "whatsapp" as const, reactivated_count: 0 };

  await db.from("leads").upsert([
    {
      ...base,
      id: LEAD_A,
      workspace_id: WS_A,
      pipeline_id: a.pipelineId,
      stage_id: a.stageId,
      name: "Fixture Lead A",
      phone: "(67) 90000-0001",
    },
    {
      ...base,
      id: LEAD_B,
      workspace_id: WS_B,
      pipeline_id: b.pipelineId,
      stage_id: b.stageId,
      name: "Fixture Lead B",
      phone: "(11) 90000-0002",
    },
  ]);

  const { data: admin } = await db
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", WS_A)
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();

  if (admin) {
    await db.from("notes").upsert({
      id: NOTE_ADMIN_ONLY,
      workspace_id: WS_A,
      lead_id: LEAD_A,
      author_id: admin.user_id,
      body: "Fixture: nota reservada ao administrador",
      visibility: "admin_only",
    });
  }

  await db.from("conversations").upsert({
    id: CONVERSATION,
    workspace_id: WS_A,
    lead_id: LEAD_A,
    provider: "whatsapp",
    external_conversation_id: "5567900000001",
    last_inbound_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
    last_message_preview: "Fixture",
    unread_count: 0,
  });

  const agora = new Date();
  const fim = new Date(agora.getTime() + 3600_000);
  await db.from("appointments").upsert({
    id: "88880000-0000-4000-8000-0000000000f1",
    workspace_id: WS_A,
    lead_id: LEAD_A,
    title: "Fixture: sessão",
    starts_at: agora.toISOString(),
    ends_at: fim.toISOString(),
    status: "scheduled",
  });

  await db.from("messages").upsert({
    workspace_id: WS_A,
    conversation_id: CONVERSATION,
    provider: "whatsapp",
    external_message_id: "fixture.msg.1",
    direction: "inbound",
    status: "delivered",
    sender_external_id: "5567900000001",
    body: "Fixture: mensagem recebida",
  });

  return true;
}

/** Remove tudo que a suíte criou, inclusive o que ela enfileirou para envio. */
export async function limparFixtures(db: SupabaseClient) {
  await db.from("outbox_messages").delete().in("workspace_id", [WS_A, WS_B]);
  await db.from("conversations").delete().eq("id", CONVERSATION);
  await db.from("appointments").delete().eq("id", "88880000-0000-4000-8000-0000000000f1");
  await db.from("leads").delete().in("id", [LEAD_A, LEAD_B]);
  // Leads criados pelos próprios testes, identificados pelo prefixo.
  await db.from("leads").delete().like("name", "Fixture%");
  await db.from("leads").delete().like("name", "Lead Teste%");
}
