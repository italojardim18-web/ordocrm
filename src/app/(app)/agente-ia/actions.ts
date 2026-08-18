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

import { generateAIReactivationMessage } from "@/lib/ai/reactivation-ai";

export async function generateReactivationMessageAction(leadId: string): Promise<{
  error?: string;
  message?: string;
  modelUsed?: string;
  strategyTitle?: string;
}> {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  const parsed = uuid.safeParse(leadId);
  if (!parsed.success) return { error: "Lead inválido." };

  const supabase = await createClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .select(`
      id,
      name,
      phone,
      lost_at,
      lost_note,
      lost_reasons (label),
      conversations (
        id,
        messages (body, direction, created_at)
      )
    `)
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id)
    .single();

  if (error || !lead) {
    return { error: "Lead não encontrado." };
  }

  const conv = (lead.conversations as any)?.[0];
  const recentMessages: { body: string; direction: "inbound" | "outbound" }[] = [];
  if (conv?.messages) {
    const sorted = [...conv.messages].sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    for (const m of sorted.slice(-6)) {
      if (m.body) {
        recentMessages.push({
          body: m.body,
          direction: m.direction,
        });
      }
    }
  }

  const now = Date.now();
  const lostTime = lead.lost_at ? new Date(lead.lost_at).getTime() : now;
  const daysPassed = Math.max(0, Math.floor((now - lostTime) / (1000 * 60 * 60 * 24)));

  const result = await generateAIReactivationMessage({
    leadName: lead.name,
    lostReason: (lead.lost_reasons as any)?.label || null,
    lostNote: lead.lost_note || null,
    daysPassed,
    recentMessages,
    workspaceName: context.workspace.name,
  });

  return {
    message: result.message,
    modelUsed: result.modelUsed,
    strategyTitle: result.strategyTitle,
  };
}

export async function triggerManualReactivation(leadId: string, customMessage?: string) {
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
      .select("id, name, phone, channel_connection_id, lost_at, lost_note, lost_reasons (label), conversations (id, external_conversation_id)")
      .eq("id", leadId)
      .eq("workspace_id", context.workspace.id)
      .single(),
    supabase
      .from("workspaces")
      .select("reactivation_template, reactivation_channel_connection_id, name")
      .eq("id", context.workspace.id)
      .single(),
  ]);

  if (!lead) return { error: "Lead não encontrado." };

  let mensagemFinal = customMessage?.trim();

  if (!mensagemFinal) {
    // Se não passou mensagem customizada, tenta gerar com IA baseada no contexto ou no template
    const primeiroNome = lead.name.split(" ")[0] || "Olá";
    if (lead.lost_note || (lead.lost_reasons as any)?.label) {
      const aiResult = await generateAIReactivationMessage({
        leadName: lead.name,
        lostReason: (lead.lost_reasons as any)?.label,
        lostNote: lead.lost_note,
        workspaceName: ws?.name,
      });
      mensagemFinal = aiResult.message;
    } else {
      const template = ws?.reactivation_template || "Olá [Nome], tudo bem? Como você tem passado desde nosso último contato?";
      mensagemFinal = template.replace(/\[Nome\]/gi, primeiroNome);
    }
  }

  const conv = (lead.conversations as any)?.[0];
  if (!conv) {
    return { error: "Este lead não possui uma conversa de WhatsApp associada. Verifique se o telefone está cadastrado." };
  }

  const admin = createAdminClient();

  // 1. Enfileira a mensagem de saída na conversa
  const { error: msgError } = await admin.from("messages").insert({
    workspace_id: context.workspace.id,
    conversation_id: conv.id,
    provider: "whatsapp",
    direction: "outbound",
    status: "pending",
    body: mensagemFinal,
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
    content: `Mensagem de reativação enviada via WhatsApp:\n"${mensagemFinal}"`,
    meta: { trigger: "manual_reactivation" },
  });

  revalidatePath("/agente-ia");
  revalidatePath(`/pipeline/lead/${leadId}`);
  return { success: true, message: mensagemFinal };
}

export async function dismissLeadReactivation(leadId: string) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  const parsed = uuid.safeParse(leadId);
  if (!parsed.success) return { error: "Lead inválido." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("leads")
    .update({
      reactivation_status: "dismissed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Erro ao remover da fila: " + error.message };

  revalidatePath("/agente-ia");
  return { success: true };
}

export async function updateStageAutomationSettings(params: {
  stageId: string;
  enabled: boolean;
  template: string;
  reminder24h?: boolean;
  reminderTemplate?: string;
}) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  if (context.membership.role !== "admin") {
    return { error: "Apenas administradores podem alterar as automações." };
  }

  const parsed = uuid.safeParse(params.stageId);
  if (!parsed.success) return { error: "Etapa inválida." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("pipeline_stages")
    .update({
      automation_message_enabled: params.enabled,
      automation_message_template: params.template?.trim() || null,
      automation_reminder_24h: Boolean(params.reminder24h),
      automation_reminder_template: params.reminderTemplate?.trim() || null,
    })
    .eq("id", params.stageId);

  if (error) {
    return { error: "Erro ao salvar gatilho da etapa: " + error.message };
  }

  revalidatePath("/agente-ia");
  revalidatePath("/pipeline");
  return { success: true };
}
