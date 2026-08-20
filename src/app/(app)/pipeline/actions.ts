"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth";
import { findDuplicates } from "@/lib/crm/queries";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { triggerStageAutomation } from "@/lib/crm/stage-automation";
import { isStageLost } from "@/lib/crm/stages";

const uuid = z.uuid();

const channelEnum = z.enum([
  "form",
  "whatsapp",
  "instagram",
  "paid_traffic",
  "manual",
]);

// -----------------------------------------------------------------------------
// Movimentação (Kanban / menu)
// -----------------------------------------------------------------------------

export async function moveLead(
  leadId: string,
  stageId: string,
  position: number,
): Promise<{ error?: string }> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({ leadId: uuid, stageId: uuid, position: z.number().finite() })
    .safeParse({ leadId, stageId, position });
  if (!parsed.success) return { error: "Movimentação inválida." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("move_lead_stage", {
    p_lead_id: leadId,
    p_stage_id: stageId,
    p_position: position,
  });

  if (error) return { error: "Não foi possível mover o lead." };

  // Verifica o tipo da etapa de destino e sincroniza lost_at / status de reativação
  const admin = createAdminClient();
  const { data: targetStage } = await supabase
    .from("pipeline_stages")
    .select("id, name, stage_type")
    .eq("id", stageId)
    .maybeSingle();

  if (targetStage && isStageLost(targetStage)) {
    await admin
      .from("leads")
      .update({
        lost_at: new Date().toISOString(),
        reactivation_status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    // Fecha oportunidades abertas
    await admin
      .from("opportunities")
      .update({
        status: "lost",
        closed_at: new Date().toISOString(),
      })
      .eq("lead_id", leadId)
      .eq("status", "open");
  }

  // Dispara gatilho automático de mensagem via WhatsApp caso a etapa possua automação ativa
  triggerStageAutomation(leadId, stageId, context.workspace.id).catch((err) =>
    console.error("Erro ao disparar automação de etapa:", err),
  );

  revalidatePath("/pipeline");
  revalidatePath("/agente-ia");
  revalidatePath(`/pipeline/lead/${leadId}`);
  return {};
}

export async function markLeadLostFromKanban(params: {
  leadId: string;
  stageId: string;
  position: number;
  lostReasonId?: string | null;
  note?: string | null;
  enableReactivation?: boolean;
}): Promise<{ error?: string }> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({
      leadId: uuid,
      stageId: uuid,
      position: z.number().finite(),
      lostReasonId: z.string().optional().nullable(),
      note: z.string().max(3000).optional().nullable(),
      enableReactivation: z.boolean().optional(),
    })
    .safeParse(params);
  if (!parsed.success) return { error: "Dados inválidos para perda do lead." };

  const supabase = await createClient();
  const admin = createAdminClient();

  // Resolve um UUID válido de motivo de perda do workspace
  let finalReasonId: string | null = null;
  if (params.lostReasonId && uuid.safeParse(params.lostReasonId).success) {
    const { data: validReason } = await admin
      .from("lost_reasons")
      .select("id")
      .eq("id", params.lostReasonId)
      .eq("workspace_id", context.workspace.id)
      .maybeSingle();
    if (validReason) finalReasonId = validReason.id;
  }

  if (!finalReasonId) {
    const { data: firstReason } = await admin
      .from("lost_reasons")
      .select("id")
      .eq("workspace_id", context.workspace.id)
      .eq("is_active", true)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstReason) {
      finalReasonId = firstReason.id;
    } else {
      const { data: createdReason } = await admin
        .from("lost_reasons")
        .insert({
          workspace_id: context.workspace.id,
          label: "Outro motivo / Não especificado",
          position: 1000,
          is_active: true,
        })
        .select("id")
        .single();
      finalReasonId = createdReason?.id || null;
    }
  }

  // 1. Move o lead para a etapa de perda e atualiza histórico transacional
  const { error: moveError } = await supabase.rpc("move_lead_stage", {
    p_lead_id: params.leadId,
    p_stage_id: params.stageId,
    p_position: params.position,
  });

  if (moveError) return { error: "Erro ao mover lead para a etapa de perda." };

  // 2. Atualiza os dados da perda e status de reativação
  const { error: updateError } = await admin
    .from("leads")
    .update({
      lost_reason_id: finalReasonId,
      lost_note: params.note || null,
      lost_at: new Date().toISOString(),
      reactivation_status: params.enableReactivation !== false ? "pending" : "none",
      reactivated_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.leadId)
    .eq("workspace_id", context.workspace.id);

  if (updateError) {
    return { error: "Erro ao atualizar dados de perda: " + updateError.message };
  }

  // 3. Fecha oportunidades abertas como lost
  await admin
    .from("opportunities")
    .update({
      status: "lost",
      lost_reason_id: finalReasonId,
      notes: params.note || null,
      closed_at: new Date().toISOString(),
    })
    .eq("lead_id", params.leadId)
    .eq("workspace_id", context.workspace.id)
    .eq("status", "open");

  // 4. Registra atividade com as notas
  let reasonLabel = "Não informado";
  if (finalReasonId) {
    const { data: reason } = await admin
      .from("lost_reasons")
      .select("label")
      .eq("id", finalReasonId)
      .maybeSingle();
    if (reason?.label) reasonLabel = reason.label;
  }

  await admin.from("activities").insert({
    workspace_id: context.workspace.id,
    lead_id: params.leadId,
    type: "note",
    content: `🚨 Lead marcado como perdido.\nMotivo: ${reasonLabel}${params.note ? `\n\n${params.note}` : ""}`,
    meta: {
      action: "lead_lost",
      lost_reason_id: finalReasonId,
      reactivation_status: params.enableReactivation !== false ? "pending" : "none",
    },
    actor_id: context.user.id,
  });

  revalidatePath("/pipeline");
  revalidatePath("/agente-ia");
  revalidatePath(`/pipeline/lead/${params.leadId}`);
  revalidatePath("/resultado");
  revalidatePath("/dashboard");
  return {};
}

// -----------------------------------------------------------------------------
// Criação com alerta de duplicidade
// -----------------------------------------------------------------------------

const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(160),
  channel: channelEnum,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.email("E-mail inválido.").optional().or(z.literal("")),
  productId: z.union([uuid, z.literal("")]).optional(),
  ownerId: z.union([uuid, z.literal("")]).optional(),
  potentialValue: z.string().optional(),
  channelConnectionId: z.union([uuid, z.literal("")]).optional(),
});

export interface CreateLeadState {
  error?: string;
  duplicates?: { id: string; name: string }[];
  createdId?: string;
}

export async function createLead(
  stageId: string,
  force: boolean,
  _prev: CreateLeadState,
  formData: FormData,
): Promise<CreateLeadState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = createLeadSchema.safeParse({
    name: formData.get("name"),
    channel: formData.get("channel"),
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    productId: formData.get("productId") ?? "",
    ownerId: formData.get("ownerId") ?? "",
    potentialValue: formData.get("potentialValue") ?? "",
    channelConnectionId: formData.get("channelConnectionId") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { name, channel } = parsed.data;
  const phone = parsed.data.phone || null;
  const email = parsed.data.email || null;

  if (!force) {
    const duplicates = await findDuplicates(context.workspace.id, phone, email);
    if (duplicates.length > 0) {
      return {
        duplicates: duplicates.map((d) => ({ id: d.id, name: d.name })),
      };
    }
  }

  const supabase = await createClient();

  const { data: stage } = await supabase
    .from("pipeline_stages")
    .select("id, pipeline_id, workspace_id")
    .eq("id", stageId)
    .maybeSingle();

  if (!stage || stage.workspace_id !== context.workspace.id) {
    return { error: "Etapa inválida." };
  }

  const potentialValue = parsed.data.potentialValue
    ? Number(parsed.data.potentialValue.replace(/\./g, "").replace(",", "."))
    : null;

  const { data: created, error } = await supabase
    .from("leads")
    .insert({
      workspace_id: context.workspace.id,
      pipeline_id: stage.pipeline_id,
      stage_id: stage.id,
      position: 0,
      name,
      channel,
      phone,
      email,
      owner_id: parsed.data.ownerId || null,
      channel_connection_id: parsed.data.channelConnectionId || null,
      potential_value:
        potentialValue !== null && Number.isFinite(potentialValue)
          ? potentialValue
          : null,
      created_by: context.user.id,
    })
    .select("id")
    .single();

  if (error || !created) return { error: "Não foi possível criar o lead." };

  if (parsed.data.productId) {
    await supabase.from("lead_product_interests").insert({
      workspace_id: context.workspace.id,
      lead_id: created.id,
      product_id: parsed.data.productId,
    });
  }

  revalidatePath("/pipeline");
  return { createdId: created.id };
}

// -----------------------------------------------------------------------------
// Lead 360°: cadastro, interesses, responsável
// -----------------------------------------------------------------------------

const updateLeadSchema = z.object({
  name: z.string().trim().min(1).max(160),
  socialName: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.email().optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  state: z.string().trim().max(2).optional().or(z.literal("")),
  contactPreference: z.string().trim().max(60).optional().or(z.literal("")),
  sourceDetail: z.string().trim().max(200).optional().or(z.literal("")),
  potentialValue: z.string().optional(),
  nextAction: z.string().trim().max(300).optional().or(z.literal("")),
});

export interface SimpleState {
  error?: string;
  done?: boolean;
}

export async function updateLead(
  leadId: string,
  _prev: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = updateLeadSchema.safeParse({
    name: formData.get("name"),
    socialName: formData.get("socialName") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    city: formData.get("city") ?? "",
    state: formData.get("state") ?? "",
    contactPreference: formData.get("contactPreference") ?? "",
    sourceDetail: formData.get("sourceDetail") ?? "",
    potentialValue: formData.get("potentialValue") ?? "",
    nextAction: formData.get("nextAction") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const potentialValue = parsed.data.potentialValue
    ? Number(parsed.data.potentialValue.replace(/\./g, "").replace(",", "."))
    : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      name: parsed.data.name,
      social_name: parsed.data.socialName || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      city: parsed.data.city || null,
      state: parsed.data.state ? parsed.data.state.toUpperCase() : null,
      contact_preference: parsed.data.contactPreference || null,
      source_detail: parsed.data.sourceDetail || null,
      potential_value:
        potentialValue !== null && Number.isFinite(potentialValue)
          ? potentialValue
          : null,
      next_action: parsed.data.nextAction || null,
    })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível salvar o cadastro." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  return { done: true };
}

export async function setLeadOwner(leadId: string, ownerId: string | null) {
  const context = await getSessionContext();
  if (!context) return;

  const supabase = await createClient();
  await supabase
    .from("leads")
    .update({ owner_id: ownerId })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);
  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
}

export async function setLeadInterests(leadId: string, productIds: string[]) {
  const context = await getSessionContext();
  if (!context) return;

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("lead_product_interests")
    .select("id, product_id")
    .eq("lead_id", leadId)
    .eq("workspace_id", context.workspace.id);

  const currentIds = new Set((current ?? []).map((i) => i.product_id));
  const nextIds = new Set(productIds);

  const toRemove = (current ?? []).filter((i) => !nextIds.has(i.product_id));
  const toAdd = productIds.filter((id) => !currentIds.has(id));

  if (toRemove.length > 0) {
    await supabase
      .from("lead_product_interests")
      .delete()
      .in("id", toRemove.map((i) => i.id))
      .eq("workspace_id", context.workspace.id);
  }
  if (toAdd.length > 0) {
    await supabase.from("lead_product_interests").insert(
      toAdd.map((productId) => ({
        workspace_id: context.workspace.id,
        lead_id: leadId,
        product_id: productId,
      })),
    );
  }

  revalidatePath(`/pipeline/lead/${leadId}`);
}

/** Registra o engajamento uma única vez (sem pontuação). */
export async function markEngaged(leadId: string) {
  const context = await getSessionContext();
  if (!context) return;

  const supabase = await createClient();
  const now = new Date().toISOString();
  await supabase
    .from("leads")
    .update({ engaged_at: now, first_contact_at: now })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id)
    .is("engaged_at", null);
  revalidatePath(`/pipeline/lead/${leadId}`);
}

// -----------------------------------------------------------------------------
// Notas, tarefas e atividades
// -----------------------------------------------------------------------------

export async function addNote(
  leadId: string,
  _prev: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const body = String(formData.get("body") ?? "").trim();
  const visibility =
    formData.get("visibility") === "admin_only" ? "admin_only" : "team";

  if (!body) return { error: "Escreva a nota antes de salvar." };
  if (visibility === "admin_only" && context.membership.role !== "admin") {
    return { error: "Apenas administradores criam notas restritas." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("notes").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    author_id: context.user.id,
    body,
    visibility,
  });

  if (error) return { error: "Não foi possível salvar a nota." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  return { done: true };
}

export async function addTask(
  leadId: string,
  _prev: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const title = String(formData.get("title") ?? "").trim();
  const dueAt = String(formData.get("dueAt") ?? "");
  // Permite atribuir a outro membro da equipe (ex: Dr. Ítalo → Secretária e vice-versa)
  const assignedToRaw = String(formData.get("assignedTo") ?? "").trim();
  const assignedTo = assignedToRaw || context.user.id;

  if (!title) return { error: "Descreva a tarefa." };

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    title,
    due_at: dueAt ? new Date(dueAt).toISOString() : null,
    assigned_to: assignedTo,
    created_by: context.user.id,
  });

  if (error) return { error: "Não foi possível criar a tarefa." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/dashboard");
  return { done: true };
}

export async function toggleTask(taskId: string, done: boolean, leadId?: string) {
  const context = await getSessionContext();
  if (!context) return;

  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({ completed_at: done ? new Date().toISOString() : null })
    .eq("id", taskId)
    .eq("workspace_id", context.workspace.id);
  if (leadId) revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/dashboard");
}

export async function logActivity(
  leadId: string,
  _prev: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const type = String(formData.get("type") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!["call", "message"].includes(type)) {
    return { error: "Tipo de atividade inválido." };
  }
  if (!content) return { error: "Descreva a atividade." };

  const supabase = await createClient();
  const { error } = await supabase.from("activities").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    type,
    content,
    actor_id: context.user.id,
  });

  if (error) return { error: "Não foi possível registrar a atividade." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  return { done: true };
}

// -----------------------------------------------------------------------------
// Perda e reativação
// -----------------------------------------------------------------------------

export async function markLost(
  leadId: string,
  _prev: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const reasonId = String(formData.get("reasonId") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!reasonId) return { error: "Escolha o motivo da perda." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_lead_lost", {
    p_lead_id: leadId,
    p_lost_reason_id: reasonId,
    p_note: note || null,
  });

  if (error) return { error: "Não foi possível marcar como perdido." };

  const admin = createAdminClient();
  await admin
    .from("leads")
    .update({
      reactivation_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  revalidatePath("/agente-ia");
  return { done: true };
}

export async function reactivateLead(
  leadId: string,
  stageId: string,
): Promise<{ error?: string }> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("reactivate_lead", {
    p_lead_id: leadId,
    p_stage_id: stageId,
  });

  if (error) return { error: "Não foi possível reativar o lead." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  return {};
}

/**
 * Arquiva o lead: sai do pipeline, conversa e histórico ficam.
 *
 * Marcando como não comercial, o contato deixa de gerar lead em mensagens
 * futuras — resolve de vez o parente que escreve toda semana.
 */
export async function archiveLead(
  leadId: string,
  reason: string | null,
  markNonCommercial: boolean,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("archive_lead", {
    p_lead_id: leadId,
    p_reason: reason,
    p_mark_non_commercial: markNonCommercial,
  });

  if (error) return { error: "Não foi possível arquivar." };

  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/lead/${leadId}`);
  return {};
}

export async function unarchiveLead(leadId: string): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("unarchive_lead", { p_lead_id: leadId });
  if (error) return { error: "Não foi possível desarquivar." };
  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/lead/${leadId}`);
  return {};
}

/**
 * Cria uma etapa no fim do quadro.
 *
 * Ficava só em Configurações → Pipeline, longe de onde a necessidade aparece.
 * A etapa nasce como `custom`: não recebe significado nos relatórios, porque
 * os tipos semânticos (novo, qualificação, venda, perda) são fixos e é o que
 * mantém o funil comparável ao longo do tempo.
 */
export async function createStageAtEnd(
  pipelineId: string,
  name: string,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };
  if (context.membership.role !== "admin") {
    return { error: "Só administradores criam etapas." };
  }

  const limpo = name.trim();
  if (limpo.length < 1 || limpo.length > 80) {
    return { error: "O nome precisa ter entre 1 e 80 caracteres." };
  }

  const supabase = await createClient();

  const { data: ultima } = await supabase
    .from("pipeline_stages")
    .select("position")
    .eq("pipeline_id", pipelineId)
    .is("archived_at", null)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("pipeline_stages").insert({
    workspace_id: context.workspace.id,
    pipeline_id: pipelineId,
    name: limpo,
    stage_type: "custom",
    position: (ultima?.position ?? 0) + 1000,
  });

  if (error) return { error: "Não foi possível criar a etapa." };

  revalidatePath("/pipeline");
  return {};
}

// -----------------------------------------------------------------------------
// Operação diária: Follow-up, Temperatura e Resumo IA
// -----------------------------------------------------------------------------

export async function setLeadFollowUp(
  leadId: string,
  followUpAt: string | null,
  note: string | null,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({
      leadId: uuid,
      followUpAt: z.string().nullable().optional(),
      note: z.string().trim().max(500).nullable().optional(),
    })
    .safeParse({ leadId, followUpAt, note });

  if (!parsed.success) return { error: "Dados de follow-up inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      follow_up_at: parsed.data.followUpAt || null,
      follow_up_note: parsed.data.note || null,
    })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível salvar o follow-up." };

  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/dashboard");
  return {};
}

export async function completeLeadFollowUp(
  leadId: string,
  outcome: "completed" | "not_completed",
  note?: string | null,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({
      leadId: uuid,
      outcome: z.enum(["completed", "not_completed"]),
      note: z.string().trim().max(500).nullable().optional(),
    })
    .safeParse({ leadId, outcome, note });

  if (!parsed.success) return { error: "Dados inválidos." };

  const supabase = await createClient();

  const isCompleted = parsed.data.outcome === "completed";
  const motivoTexto = parsed.data.note ? ` ("${parsed.data.note}")` : "";
  const content = isCompleted
    ? `✅ Follow-up realizado com sucesso${motivoTexto}`
    : `⚠️ Follow-up marcado como não realizado / sem retorno${motivoTexto}`;

  // 1. Registra no histórico de atividades
  await supabase.from("activities").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    type: "system",
    content,
    actor_id: context.user.id,
  });

  // 2. Limpa o follow-up atual do lead e atualiza última interação se concluído
  const updateData: Record<string, any> = {
    follow_up_at: null,
    follow_up_note: null,
  };
  if (isCompleted) {
    updateData.last_interaction_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("leads")
    .update(updateData)
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível concluir o follow-up." };

  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/dashboard");
  return {};
}

export async function setLeadTemperatureOverride(
  leadId: string,
  override: "hot" | "warm" | "cold" | null,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({
      leadId: uuid,
      override: z.enum(["hot", "warm", "cold"]).nullable().optional(),
    })
    .safeParse({ leadId, override });

  if (!parsed.success) return { error: "Temperatura inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      temperature_override: parsed.data.override || null,
      temperature_override_at: parsed.data.override ? new Date().toISOString() : null,
    })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível atualizar a temperatura." };

  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/lead/${leadId}`);
  return {};
}

export async function updateLeadSummary(
  leadId: string,
  fields: {
    need?: string | null;
    moment?: string | null;
    preference?: string | null;
    openPoint?: string | null;
    notesSummary?: string | null;
  },
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({
      leadId: uuid,
      need: z.string().trim().max(1000).nullable().optional(),
      moment: z.string().trim().max(1000).nullable().optional(),
      preference: z.string().trim().max(1000).nullable().optional(),
      openPoint: z.string().trim().max(1000).nullable().optional(),
      notesSummary: z.string().trim().max(2000).nullable().optional(),
    })
    .safeParse({ leadId, ...fields });

  if (!parsed.success) return { error: "Dados de resumo inválidos." };

  const supabase = await createClient();
  const updateData: Record<string, string | null> = {};
  if (fields.need !== undefined) updateData.summary_need = fields.need;
  if (fields.moment !== undefined) updateData.summary_moment = fields.moment;
  if (fields.preference !== undefined) updateData.summary_preference = fields.preference;
  if (fields.openPoint !== undefined) updateData.summary_open_point = fields.openPoint;
  if (fields.notesSummary !== undefined) updateData.notes_summary = fields.notesSummary;

  const { error } = await supabase
    .from("leads")
    .update(updateData)
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível atualizar o resumo." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  return {};
}

/**
 * Dispara a geração inteligente do Resumo Comercial 360° do Lead
 * com IA / Motor Clínico NLP.
 */
export async function generateLeadAISummaryAction(leadId: string): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = uuid.safeParse(leadId);
  if (!parsed.success) return { error: "ID do lead inválido." };

  const { generateLeadAISummary } = await import("@/lib/ai/lead-summary");
  const res = await generateLeadAISummary(context.workspace.id, leadId);

  if (!res.success) {
    return { error: res.error || "Não foi possível gerar o resumo inteligente." };
  }

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  return {};
}

// -----------------------------------------------------------------------------
// Gerenciamento de Tags / Etiquetas Coloridas
// -----------------------------------------------------------------------------

export async function addTagToLead(
  leadId: string,
  tagId: string,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({ leadId: uuid, tagId: uuid })
    .safeParse({ leadId, tagId });
  if (!parsed.success) return { error: "IDs inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("lead_tags")
    .upsert(
      {
        workspace_id: context.workspace.id,
        lead_id: leadId,
        tag_id: tagId,
      },
      { onConflict: "lead_id,tag_id" },
    );

  if (error) return { error: "Não foi possível adicionar a etiqueta." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  revalidatePath("/contatos");
  return {};
}

export async function removeTagFromLead(
  leadId: string,
  tagId: string,
): Promise<SimpleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({ leadId: uuid, tagId: uuid })
    .safeParse({ leadId, tagId });
  if (!parsed.success) return { error: "IDs inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("lead_tags")
    .delete()
    .eq("lead_id", leadId)
    .eq("tag_id", tagId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível remover a etiqueta." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  revalidatePath("/contatos");
  return {};
}

export async function createWorkspaceTag(
  name: string,
  color: string,
): Promise<{ tag?: { id: string; name: string; color: string }; error?: string }> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = z
    .object({
      name: z.string().trim().min(1, "Nome da tag é obrigatório.").max(40),
      color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Cor hexadecimal inválida."),
    })
    .safeParse({ name, color });

  if (!parsed.success) return { error: "Dados da tag inválidos." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .insert({
      workspace_id: context.workspace.id,
      name: parsed.data.name,
      color: parsed.data.color,
    })
    .select("id, name, color")
    .single();

  if (error) return { error: "Erro ao criar tag: " + error.message };

  revalidatePath("/pipeline");
  return { tag: data };
}

