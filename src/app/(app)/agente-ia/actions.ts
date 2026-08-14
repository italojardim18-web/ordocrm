"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const uuid = z.uuid();

export async function updateReactivationSettings(params: {
  enabled: boolean;
  days: number;
  template: string;
  channelConnectionId?: string | null;
}) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  if (context.membership.role !== "admin") {
    return { error: "Apenas administradores podem alterar as automações." };
  }

  const validDays = [15, 30, 45, 60];
  if (!validDays.includes(params.days)) {
    return { error: "Prazo inválido. Escolha 15, 30, 45 ou 60 dias." };
  }

  if (!params.template.trim()) {
    return { error: "O texto da mensagem de reativação é obrigatório." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("workspaces")
    .update({
      reactivation_enabled: params.enabled,
      reactivation_days: params.days,
      reactivation_template: params.template.trim(),
      reactivation_channel_connection_id: params.channelConnectionId || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", context.workspace.id);

  if (error) {
    return { error: "Erro ao salvar configurações: " + error.message };
  }

  revalidatePath("/agente-ia");
  revalidatePath("/pipeline");
  return { success: true };
}

export async function triggerManualReactivation(leadId: string) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  const parsed = uuid.safeParse(leadId);
  if (!parsed.success) return { error: "Lead inválido." };

  const supabase = await createClient();

  // Busca dados do lead, conversa e workspace
  const [
    { data: lead },
    { data: ws },
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("id, name, phone, channel_connection_id, lost_at, conversations (id, external_conversation_id)")
      .eq("id", leadId)
      .eq("workspace_id", context.workspace.id)
      .single(),
    supabase
      .from("workspaces")
      .select("reactivation_template, reactivation_channel_connection_id")
      .eq("id", context.workspace.id)
      .single(),
  ]);

  if (!lead) return { error: "Lead não encontrado." };

  const primeiroNome = lead.name.split(" ")[0] || "Olá";
  const template = ws?.reactivation_template || "Olá [Nome], tudo bem? Como você tem passado desde nosso último contato?";
  const mensagemFormatada = template.replace(/\[Nome\]/gi, primeiroNome);

  const conv = (lead.conversations as any)?.[0];
  if (!conv) {
    return { error: "Este lead não possui uma conversa de WhatsApp associada." };
  }

  const admin = createAdminClient();

  // 1. Enfileira a mensagem de saída na conversa
  const { error: msgError } = await admin.from("messages").insert({
    workspace_id: context.workspace.id,
    conversation_id: conv.id,
    provider: "whatsapp",
    direction: "outbound",
    status: "pending",
    body: mensagemFormatada,
    sent_at: new Date().toISOString(),
  });

  if (msgError) {
    return { error: "Erro ao registrar mensagem: " + msgError.message };
  }

  // 2. Atualiza status do lead
  await admin
    .from("leads")
    .update({
      reactivated_at: new Date().toISOString(),
      reactivation_status: "reactivated",
      reactivated_count: 1,
    })
    .eq("id", leadId);

  // 3. Registra atividade no lead
  await admin.from("activities").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    type: "message",
    content: `Mensagem de reativação enviada: "${mensagemFormatada.slice(0, 100)}..."`,
    meta: { trigger: "manual_reactivation" },
  });

  revalidatePath("/agente-ia");
  revalidatePath(`/pipeline/lead/${leadId}`);
  return { success: true, message: mensagemFormatada };
}
