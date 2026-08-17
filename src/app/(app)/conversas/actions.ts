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
 * Sugere 3 opções de respostas de WhatsApp com análise estrita de estado de diálogo:
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
      const role = m.direction === "inbound" ? `[${leadName} - Paciente]` : "[Atendimento / Clínica]";
      const txt = (m.body || m.transcript || "").trim();
      return `${role}: ${txt}`;
    }).filter(Boolean);

    // 3. Análise estrita do último emissor e estado de silêncio
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
    const isWaitingLeadReply = lastMsg?.direction === "outbound";
    const lastMessageContent = (lastMsg?.body || lastMsg?.transcript || "").trim();

    let dialogStateInfo = "";
    if (isWaitingLeadReply) {
      dialogStateInfo = `
⚠️ ESTADO CRÍTICO DO DIÁLOGO:
- A ÚLTIMA mensagem foi enviada pela CLÍNICA: "${lastMessageContent}".
- O CONTATO (${leadName}) AINDA NÃO RESPONDEU a essa mensagem!
- REGRA FUNDAMENTAL: NUNCA assuma que ${leadName} respondeu ou já tomou uma decisão (ex: se a clínica perguntou se falou com o marido e ela não respondeu, ela NÃO confirmou que falou!).
- OBJETIVO: Sugerir 3 abordagens de FOLLOW-UP gentil, respeitoso e acolhedor para reabrir a conversa e se colocar à disposição.
`;
    } else {
      dialogStateInfo = `
⚠️ ESTADO CRÍTICO DO DIÁLOGO:
- A ÚLTIMA mensagem foi enviada pelo CONTATO (${leadName}): "${lastMessageContent}".
- OBJETIVO: Responder estritamente ao que ${leadName} acabou de dizer, quebrando eventuais objeções e avançando o agendamento.
`;
    }

    const systemPrompt = `
Você é o Copiloto Especialista em Vendas Consultivas, Quebra de Objeções e Atendimento do ORDO CRM.
Sua missão é sugerir 3 opções de respostas de WhatsApp estritamente alinhadas com o estado real do diálogo.

REGRAS DE CONTEXTO & PLAYBOOK DE VENDAS:
- Contato: ${leadName}
- Produto / Serviço de interesse: ${produtosTexto}
- Etiquetas: ${tagsTexto || "Nenhuma"}
- Etapa do funil: ${stageName}
${dialogStateInfo}

DIRETRIZES DE RESPOSTA:
- NUNCA invente fatos ou respostas que o contato não escreveu.
- Se o contato está sem responder à pergunta anterior da clínica, sugira mensagens de follow-up empático (ex: "Passando para saber se está tudo bem", "Ficou alguma dúvida sobre os horários/valores?", "Para te ajudar caso ainda queira deixar a vaga pré-reservada").
- Se o contato acabou de falar algo, responda diretamente com empatia, esclarecimento e chamada para ação.

Gere EXATAMENTE 3 opções de respostas:
1. Opção 1: "🌿 Empática" (Acolhedora, humana e sem pressão)
2. Opção 2: "🛡️ Quebra de Objeção / Follow-up" (Estratégica para destravar a decisão ou apoiar a conversa)
3. Opção 3: "📅 Agendamento & Avanço" (Focada em propor dia, horário, envio de link ou confirmar vaga)

Retorne OBRIGATORIAMENTE um JSON estrito no formato:
{
  "suggestions": [
    {
      "id": "1",
      "label": "Empática",
      "badge": "🌿 Empática",
      "text": "Texto completo para envio..."
    },
    {
      "id": "2",
      "label": "Estratégica",
      "badge": "${isWaitingLeadReply ? "💬 Follow-up Acolhedor" : "🛡️ Quebra de Objeção"}",
      "text": "Texto completo para envio..."
    },
    {
      "id": "3",
      "label": "Agendamento",
      "badge": "📅 Propor Vaga",
      "text": "Texto completo para envio..."
    }
  ]
}
`;

    const userPrompt = `
Histórico completo e cronológico da conversa:
${historyLines.join("\n") || "Nenhuma mensagem anterior registrada."}

Analise quem mandou a última mensagem e gere as 3 sugestões adequadas ao estado atual do contato ${leadName}.
`;

    const aiRes = await generateAICompletion({
      systemPrompt,
      userPrompt,
      jsonFormat: true,
      temperature: 0.3,
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

    // Fallback Heurístico Contextual baseado na direção da última mensagem
    let fallbackSuggestions: SuggestedReply[] = [];
    if (isWaitingLeadReply) {
      fallbackSuggestions = [
        {
          id: "1",
          label: "Empática",
          badge: "🌿 Empática",
          text: `Olá, ${leadName}! Como você tem passado? 🌸 Passando apenas para saber se está tudo bem por aí e me colocar à disposição caso tenha ficado qualquer dúvida.`,
        },
        {
          id: "2",
          label: "Follow-up",
          badge: "💬 Follow-up Acolhedor",
          text: `Olá, ${leadName}! Tudo bem? Sei que a rotina pode ser bastante corrida, então fique à vontade para responder no seu tempo. Se precisar que eu te envie mais detalhes sobre as sessões ou o reembolso do convênio para te ajudar na decisão, me avise!`,
        },
        {
          id: "3",
          label: "Agendamento",
          badge: "📅 Pré-Reserva",
          text: `Olá, ${leadName}! Temos algumas opções de horários abertos para ${produtosTexto} esta semana. Gostaria que eu deixasse uma vaga pré-reservada para você enquanto vocês avaliam?`,
        },
      ];
    } else {
      fallbackSuggestions = [
        {
          id: "1",
          label: "Empática",
          badge: "🌿 Empática",
          text: `Olá, ${leadName}! Compreendo perfeitamente. Fico à sua total disposição para tirar qualquer dúvida e encontrar o melhor formato para iniciarmos.`,
        },
        {
          id: "2",
          label: "Quebra de Objeção",
          badge: "🛡️ Quebra de Objeção",
          text: `Olá, ${leadName}! Podemos estruturar o atendimento de ${produtosTexto} de forma muito flexível, inclusive com emissão de recibo para reembolso no seu plano de saúde. O que acha de fazermos uma primeira sessão experimental?`,
        },
        {
          id: "3",
          label: "Agendamento",
          badge: "📅 Propor Vaga",
          text: `Olá, ${leadName}! Tenho disponibilidade para ${produtosTexto} nos períodos da manhã ou noite esta semana. Qual horário se encaixa melhor na sua rotina?`,
        },
      ];
    }

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
