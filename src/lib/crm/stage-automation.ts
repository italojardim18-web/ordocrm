import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatTime } from "@/lib/format";

/**
 * Dispara automações configuradas para a etapa de destino do funil:
 * - Mensagem automática de confirmação / agendamento / instruções via WhatsApp
 * - Lembrete automático de 24h
 */
export async function triggerStageAutomation(
  leadId: string,
  stageId: string,
  workspaceId: string,
) {
  try {
    const admin = createAdminClient();

    // 1. Busca configurações de automação da etapa
    const { data: stage } = await admin
      .from("pipeline_stages")
      .select("id, name, stage_type, automation_message_enabled, automation_message_template, automation_reminder_24h, automation_reminder_template")
      .eq("id", stageId)
      .single();

    if (!stage || !stage.automation_message_enabled || !stage.automation_message_template?.trim()) {
      return { triggered: false };
    }

    // 2. Busca dados do lead, conversa e agendamento futuro
    const [
      { data: lead },
      { data: appointment },
    ] = await Promise.all([
      admin
        .from("leads")
        .select("id, name, phone, channel_connection_id, conversations (id, external_conversation_id)")
        .eq("id", leadId)
        .eq("workspace_id", workspaceId)
        .single(),
      admin
        .from("appointments")
        .select("id, starts_at, ends_at, meet_url, location, title")
        .eq("lead_id", leadId)
        .eq("workspace_id", workspaceId)
        .gte("starts_at", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
        .order("starts_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

    if (!lead) return { triggered: false, error: "Lead não encontrado." };

    const conv = (lead.conversations as any)?.[0];
    if (!conv) {
      console.log(`[automação:etapa] Lead ${leadId} não possui conversa de WhatsApp.`);
      return { triggered: false, reason: "sem_conversa" };
    }

    // 3. Formatação das variáveis do template
    const primeiroNome = lead.name.split(" ")[0] || "Olá";
    let dataFormatada = "na data combinada";
    let horarioFormatado = "no horário agendado";
    let linkMeet = "https://meet.google.com";

    if (appointment?.starts_at) {
      const d = new Date(appointment.starts_at);
      dataFormatada = formatDate(appointment.starts_at);
      horarioFormatado = formatTime(appointment.starts_at);
      if (appointment.meet_url) {
        linkMeet = appointment.meet_url;
      }
    }

    let mensagem = stage.automation_message_template
      .replace(/\[Nome\]/gi, primeiroNome)
      .replace(/\[Data\]/gi, dataFormatada)
      .replace(/\[Horario\]/gi, horarioFormatado)
      .replace(/\[LinkMeet\]/gi, linkMeet)
      .replace(/\[Profissional\]/gi, "Dr. Ítalo Jardim");

    // 4. Enfileira a mensagem de saída
    const { data: novaMsg, error: msgError } = await admin
      .from("messages")
      .insert({
        workspace_id: workspaceId,
        conversation_id: conv.id,
        provider: "whatsapp",
        direction: "outbound",
        status: "pending",
        body: mensagem,
        sent_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (msgError) {
      console.error("[automação:etapa] Erro ao criar mensagem:", msgError);
      return { triggered: false, error: msgError.message };
    }

    // 5. Registra atividade no histórico do lead
    await admin.from("activities").insert({
      workspace_id: workspaceId,
      lead_id: leadId,
      type: "message",
      content: `Gatilho automático da etapa "${stage.name}": "${mensagem.slice(0, 120)}..."`,
      meta: {
        trigger: "stage_change",
        stage_id: stageId,
        stage_name: stage.name,
      },
    });

    console.log(`[automação:etapa] Mensagem disparada para lead ${lead.name} na etapa ${stage.name}`);
    return { triggered: true, message: mensagem };
  } catch (err: any) {
    console.error("[automação:etapa] Falha ao processar gatilho:", err);
    return { triggered: false, error: err?.message };
  }
}
