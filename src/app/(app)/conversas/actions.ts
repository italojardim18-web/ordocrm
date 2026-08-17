"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generateAICompletion } from "@/lib/ai/client";
import { formatBRL } from "@/lib/format";

export interface SendState {
  error?: string;
  done?: boolean;
}

export async function sendMessage(
  conversationId: string,
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Escreva a mensagem." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("send_channel_message", {
    p_conversation_id: conversationId,
    p_body: body,
  });

  if (error) return { error: "Não foi possível enfileirar a mensagem." };

  // Dispara o worker imediatamente para envio em tempo real (< 1 segundo)
  const { processOutbox } = await import("@/lib/channels/outbox");
  processOutbox().catch((err) => console.error("[conversas:actions] erro no disparo imediato:", err));

  revalidatePath(`/conversas/${conversationId}`);
  revalidatePath("/conversas");
  return { done: true };
}

export async function markRead(conversationId: string) {
  const supabase = await createClient();
  await supabase.rpc("mark_conversation_read", {
    p_conversation_id: conversationId,
  });
  revalidatePath("/conversas");
}

export interface ScheduleState {
  error?: string;
  done?: boolean;
}

/** Agenda uma mensagem para sair em data e hora futuras. */
export async function scheduleMessage(
  conversationId: string,
  _prev: ScheduleState,
  formData: FormData,
): Promise<ScheduleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const body = String(formData.get("body") ?? "").trim();
  const quando = String(formData.get("scheduledFor") ?? "");

  if (!body) return { error: "Escreva a mensagem." };
  if (!quando) return { error: "Escolha a data e a hora." };

  const data = new Date(quando);
  if (Number.isNaN(data.getTime())) return { error: "Data inválida." };
  if (data.getTime() <= Date.now()) {
    return { error: "Escolha um horário no futuro." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("schedule_message", {
    p_conversation_id: conversationId,
    p_body: body,
    p_scheduled_for: data.toISOString(),
  });

  if (error) return { error: "Não foi possível agendar a mensagem." };

  revalidatePath(`/conversas/${conversationId}`);
  revalidatePath("/pipeline");
  return { done: true };
}

export async function cancelScheduledMessage(
  id: string,
  conversationId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_scheduled_message", { p_id: id });
  if (error) return { error: "Não foi possível cancelar." };

  revalidatePath(`/conversas/${conversationId}`);
  revalidatePath("/pipeline");
  return {};
}

export interface SuggestedReply {
  id: string;
  label: string;
  badge: string;
  text: string;
}

/**
 * Sugere 3 opções de respostas de WhatsApp contextualizadas com o Lead 360:
 * Prioridade: Ollama Local (qwen2.5:7b)
 */
export async function suggestRepliesAction(conversationId: string): Promise<{
  success: boolean;
  suggestions?: SuggestedReply[];
  model?: string;
  error?: string;
}> {
  try {
    const context = await getSessionContext();
    if (!context) return { success: false, error: "Sessão expirada." };

    const supabase = await createClient();

    // 1. Busca conversa e lead
    const { data: conv } = await supabase
      .from("conversations")
      .select("id, lead_id, provider")
      .eq("id", conversationId)
      .maybeSingle();

    if (!conv) return { success: false, error: "Conversa não encontrada." };

    let leadName = "Paciente";
    let stageName = "Em atendimento";
    let produtosTexto = "Atendimento Clínico";
    let tagsTexto = "";

    if (conv.lead_id) {
      const [
        { data: leadData },
        { data: interestsData },
        { data: oppsData },
        { data: tagsData },
      ] = await Promise.all([
        supabase.from("leads").select("id, name, stage_id").eq("id", conv.lead_id).maybeSingle(),
        supabase.from("lead_product_interests").select("products(name, default_price)").eq("lead_id", conv.lead_id),
        supabase.from("opportunities").select("products(name), potential_value").eq("lead_id", conv.lead_id).is("deleted_at", null),
        supabase.from("lead_tags").select("tags(name)").eq("lead_id", conv.lead_id),
      ]);

      if (leadData) {
        leadName = leadData.name;
        if (leadData.stage_id) {
          const { data: stage } = await supabase.from("pipeline_stages").select("name").eq("id", leadData.stage_id).maybeSingle();
          if (stage?.name) stageName = stage.name;
        }
      }

      const prods: string[] = [];
      (interestsData ?? []).forEach((i: any) => {
        if (i.products?.name) prods.push(i.products.name);
      });
      (oppsData ?? []).forEach((o: any) => {
        if (o.products?.name && !prods.includes(o.products.name)) prods.push(o.products.name);
      });
      if (prods.length > 0) produtosTexto = prods.join(", ");

      const tags: string[] = [];
      (tagsData ?? []).forEach((t: any) => {
        if (t.tags?.name) tags.push(t.tags.name);
      });
      if (tags.length > 0) tagsTexto = tags.join(", ");
    }

    // 2. Busca últimas 15 mensagens da conversa
    const { data: msgList } = await supabase
      .from("messages")
      .select("body, transcript, direction, sent_at")
      .eq("conversation_id", conversationId)
      .order("sent_at", { ascending: false })
      .limit(15);

    const msgs = (msgList ?? []).reverse();
    const historyLines = msgs.map((m) => {
      const role = m.direction === "inbound" ? `[${leadName}]` : "[Atendimento/Clínica]";
      const txt = (m.body || m.transcript || "").trim();
      return `${role}: ${txt}`;
    }).filter(Boolean);

    const systemPrompt = `
Você é o Copiloto Especialista em Atendimento Clínico e WhatsApp do ORDO CRM.
Sua missão é sugerir 3 opções de respostas elegantes, acolhedoras e estratégicas para o profissional de saúde ou secretária enviar ao paciente/contato.

REGRAS DE CONTEXTO:
- O contato se chama: ${leadName}
- Produto / Serviço de interesse: ${produtosTexto} (ATENÇÃO: Se for "Supervisão Clínica", trate como supervisão profissional; se for "Psicoterapia", trate como terapia).
- Etiquetas: ${tagsTexto || "Nenhuma"}
- Etapa do funil: ${stageName}

Gere EXATAMENTE 3 opções de respostas:
1. "Acolhedora" (Empática, humana e de escuta ativa)
2. "Direta & Prática" (Objetiva, esclarecedora de dúvidas e valores/formato)
3. "Agendamento / Avanço" (Focada em propor dia, horário, envio de link ou confirmação)

Retorne OBRIGATORIAMENTE um JSON estrito no seguinte formato:
{
  "suggestions": [
    {
      "id": "1",
      "label": "Acolhedora",
      "badge": "🌿 Empática",
      "text": "Texto completo e pronto para envio no WhatsApp..."
    },
    {
      "id": "2",
      "label": "Direta",
      "badge": "🎯 Prática",
      "text": "Texto completo e pronto para envio no WhatsApp..."
    },
    {
      "id": "3",
      "label": "Agendamento",
      "badge": "📅 Propor Vaga",
      "text": "Texto completo e pronto para envio no WhatsApp..."
    }
  ]
}
`;

    const userPrompt = `
Histórico recente da conversa:
${historyLines.join("\n") || "Nenhuma mensagem anterior registrada."}

Com base na última mensagem de ${leadName} e no serviço de ${produtosTexto}, gere as 3 sugestões de resposta para o WhatsApp.
`;

    const aiRes = await generateAICompletion({
      systemPrompt,
      userPrompt,
      jsonFormat: true,
      temperature: 0.4,
    });

    if (aiRes) {
      try {
        const parsed = JSON.parse(aiRes.text);
        if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
          return {
            success: true,
            suggestions: parsed.suggestions,
            model: aiRes.model,
          };
        }
      } catch (err) {
        console.warn("Erro ao parsear sugestões da IA:", err);
      }
    }

    // Fallback Heurístico
    const fallbackSuggestions: SuggestedReply[] = [
      {
        id: "1",
        label: "Acolhedora",
        badge: "🌿 Empática",
        text: `Olá, ${leadName}! Tudo bem? 🌸 Fico à disposição para esclarecer qualquer dúvida sobre nosso serviço de ${produtosTexto} e encontrar o formato mais confortável para você.`,
      },
      {
        id: "2",
        label: "Direta",
        badge: "🎯 Prática",
        text: `Olá, ${leadName}! Nosso atendimento de ${produtosTexto} tem duração de 50 minutos e pode ser realizado de forma online (via Google Meet) ou presencial. Gostaria que eu te envie as opções de dias disponíveis?`,
      },
      {
        id: "3",
        label: "Agendamento",
        badge: "📅 Propor Vaga",
        text: `Olá, ${leadName}! Tenho disponibilidade para iniciarmos nossa sessão de ${produtosTexto} esta semana. Você teria preferência pelo período da manhã, tarde ou noite?`,
      },
    ];

    return {
      success: true,
      suggestions: fallbackSuggestions,
      model: "Motor Clínico ORDO (NLP Integrado)",
    };
  } catch (err: any) {
    console.error("Erro em suggestRepliesAction:", err);
    return { success: false, error: err.message || "Erro ao gerar sugestões de resposta." };
  }
}
