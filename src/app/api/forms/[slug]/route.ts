import { NextResponse, type NextRequest } from "next/server";
import {
  dedupeHash,
  formSubmissionSchema,
  hasContact,
  MIN_FILL_MS,
} from "@/lib/channels/form-intake";
import { clientIp, hashIp, rateLimit } from "@/lib/channels/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Captação pública de leads por formulário.
 * Sem usuário autenticado: usa service_role, mas o workspace é resolvido
 * pelo slug do endpoint (dado do servidor), nunca por entrada do cliente.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const ip = clientIp(request.headers);
  const limit = rateLimit(`form:${slug}:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde um instante." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let raw: unknown;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    raw = contentType.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return NextResponse.json({ error: "Envio inválido." }, { status: 400 });
  }

  const parsed = formSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot e tempo mínimo: resposta 200 genérica para não ensinar o robô.
  if (data.website || (data.elapsed !== undefined && data.elapsed < MIN_FILL_MS)) {
    return NextResponse.json({ ok: true });
  }

  if (!hasContact(data)) {
    return NextResponse.json(
      { error: "Informe telefone ou e-mail para contato." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: endpoint } = await admin
    .from("form_endpoints")
    .select(
      "id, workspace_id, name, pipeline_id, product_id, owner_id, is_active, success_message, submissions_count",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!endpoint || !endpoint.is_active) {
    return NextResponse.json(
      { error: "Formulário indisponível." },
      { status: 404 },
    );
  }

  const hash = dedupeHash(slug, data);

  // Envio repetido na mesma janela: responde sucesso sem criar outro lead.
  const { data: existing } = await admin
    .from("form_submissions")
    .select("id")
    .eq("form_endpoint_id", endpoint.id)
    .eq("dedupe_hash", hash)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  // Pipeline e primeira etapa
  const pipelineId =
    endpoint.pipeline_id ??
    (
      await admin
        .from("pipelines")
        .select("id")
        .eq("workspace_id", endpoint.workspace_id)
        .is("archived_at", null)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle()
    ).data?.id;

  if (!pipelineId) {
    return NextResponse.json(
      { error: "Formulário sem pipeline configurado." },
      { status: 500 },
    );
  }

  const { data: stage } = await admin
    .from("pipeline_stages")
    .select("id, stage_type")
    .eq("pipeline_id", pipelineId)
    .is("archived_at", null)
    .order("position")
    .limit(1)
    .maybeSingle();

  if (!stage) {
    return NextResponse.json(
      { error: "Pipeline sem etapas configuradas." },
      { status: 500 },
    );
  }

  const { data: lead, error: leadError } = await admin
    .from("leads")
    .insert({
      workspace_id: endpoint.workspace_id,
      pipeline_id: pipelineId,
      stage_id: stage.id,
      position: 0,
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      channel: data.utm_source ? "paid_traffic" : "form",
      source_detail: "Formulário público",
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_content: data.utm_content || null,
      utm_term: data.utm_term || null,
      owner_id: endpoint.owner_id,
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    return NextResponse.json(
      { error: "Não foi possível registrar seu contato." },
      { status: 500 },
    );
  }

  await admin.from("lead_stage_history").insert({
    workspace_id: endpoint.workspace_id,
    lead_id: lead.id,
    to_stage_id: stage.id,
    to_stage_type: stage.stage_type,
  });

  if (endpoint.product_id) {
    await admin.from("lead_product_interests").insert({
      workspace_id: endpoint.workspace_id,
      lead_id: lead.id,
      product_id: endpoint.product_id,
    });
  }

  const rawObj = (typeof raw === "object" && raw !== null) ? (raw as Record<string, any>) : {};
  const answers = rawObj.answers || {};

  // Formatar resumo das respostas para anotação no prontuário do Lead
  let responsesSummary = "";
  if (typeof answers === "object" && Object.keys(answers).length > 0) {
    responsesSummary = Object.entries(answers)
      .map(([k, v]) => `• ${k}: ${v}`)
      .join("\n");
  }

  if (data.message || responsesSummary) {
    const noteContent = [
      data.message ? `Mensagem: ${data.message}` : null,
      responsesSummary ? `Respostas do Formulário (${endpoint.name || "ORDO Forms"}):\n${responsesSummary}` : null,
    ].filter(Boolean).join("\n\n");

    await admin.from("notes").insert({
      workspace_id: endpoint.workspace_id,
      lead_id: lead.id,
      content: noteContent,
    });
  }

  await admin.from("form_submissions").insert({
    workspace_id: endpoint.workspace_id,
    form_endpoint_id: endpoint.id,
    lead_id: lead.id,
    payload: {
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      message: data.message || null,
      answers: answers,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
    },
    dedupe_hash: hash,
    ip_hash: hashIp(ip),
  });

  // Atualizar contador de submissões
  try {
    await admin
      .from("form_endpoints")
      .update({
        submissions_count: ((endpoint as any).submissions_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", endpoint.id);
  } catch (err) {
    console.error("Erro ao incrementar submissions_count:", err);
  }

  return NextResponse.json({
    ok: true,
    message: endpoint.success_message ?? "Recebemos seu contato!",
  });
}
