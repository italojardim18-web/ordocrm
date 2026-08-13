"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth";
import { findDuplicates } from "@/lib/crm/queries";
import { createClient } from "@/lib/supabase/server";

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

  revalidatePath("/pipeline");
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
    .eq("id", leadId);

  if (error) return { error: "Não foi possível salvar o cadastro." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  return { done: true };
}

export async function setLeadOwner(leadId: string, ownerId: string | null) {
  const supabase = await createClient();
  await supabase
    .from("leads")
    .update({ owner_id: ownerId })
    .eq("id", leadId);
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
    .eq("lead_id", leadId);

  const currentIds = new Set((current ?? []).map((i) => i.product_id));
  const nextIds = new Set(productIds);

  const toRemove = (current ?? []).filter((i) => !nextIds.has(i.product_id));
  const toAdd = productIds.filter((id) => !currentIds.has(id));

  if (toRemove.length > 0) {
    await supabase
      .from("lead_product_interests")
      .delete()
      .in("id", toRemove.map((i) => i.id));
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
  const supabase = await createClient();
  const now = new Date().toISOString();
  await supabase
    .from("leads")
    .update({ engaged_at: now, first_contact_at: now })
    .eq("id", leadId)
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

  if (!title) return { error: "Descreva a tarefa." };

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    title,
    due_at: dueAt ? new Date(dueAt).toISOString() : null,
    assigned_to: context.user.id,
    created_by: context.user.id,
  });

  if (error) return { error: "Não foi possível criar a tarefa." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  return { done: true };
}

export async function toggleTask(taskId: string, leadId: string, done: boolean) {
  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({ completed_at: done ? new Date().toISOString() : null })
    .eq("id", taskId);
  revalidatePath(`/pipeline/lead/${leadId}`);
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

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  return { done: true };
}

export async function reactivateLead(
  leadId: string,
  stageId: string,
): Promise<{ error?: string }> {
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
