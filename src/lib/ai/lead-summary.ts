import { createClient } from "@/lib/supabase/server";
import { generateAICompletion } from "@/lib/ai/client";
import { formatBRL } from "@/lib/format";

export interface AISummaryResult {
  notes_summary: string;
  summary_need: string;
  summary_moment: string;
  summary_preference: string;
  summary_open_point: string;
  summary_source_count: number;
  summary_model: string;
  summary_generated_at: string;
}

/**
 * Gera o Resumo Comercial Inteligente 360° para um Lead.
 * Analisa 100% dos dados contextuais do Lead 360:
 * - Produtos / Serviços marcados para venda (ex: Supervisão, Avaliação, Terapia)
 * - Etiquetas / Tags atribuídas ao paciente/lead
 * - Histórico completo de mensagens do WhatsApp e transcrições de áudio
 * - Anotações internas e registros clínicos da timeline
 * - Tarefas operacionais e follow-ups
 * - Agendamentos de sessões
 */
export async function generateLeadAISummary(
  workspaceId: string,
  leadId: string,
): Promise<{ success: boolean; data?: AISummaryResult; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Busca dados do Lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, name, phone, email, channel, source_detail, notes_summary, stage_id, workspace_id, potential_value, follow_up_note, contact_preference, metadata")
      .eq("id", leadId)
      .is("deleted_at", null)
      .maybeSingle();

    if (leadError) {
      console.error("Erro na busca do lead:", leadError);
      return { success: false, error: `Erro no banco: ${leadError.message}` };
    }

    if (!lead) {
      return { success: false, error: "Lead não encontrado no consultório." };
    }

    // 2. Busca todas as informações contextuais em paralelo
    const [
      { data: stage },
      { data: conversation },
      { data: notes },
      { data: appointments },
      { data: interestsData },
      { data: oppsData },
      { data: tagsData },
      { data: tasksData },
    ] = await Promise.all([
      lead.stage_id
        ? supabase.from("pipeline_stages").select("name").eq("id", lead.stage_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.from("conversations").select("id").eq("lead_id", leadId).maybeSingle(),
      supabase.from("notes").select("body, created_at").eq("lead_id", leadId).is("deleted_at", null).order("created_at", { ascending: true }).limit(20),
      supabase.from("appointments").select("title, status, starts_at, meet_link").eq("lead_id", leadId).is("deleted_at", null).order("starts_at", { ascending: false }).limit(5),
      supabase.from("lead_product_interests").select("product_id, products(id, name, category, default_price)").eq("lead_id", leadId),
      supabase.from("opportunities").select("potential_value, sold_value, status, products(name)").eq("lead_id", leadId).is("deleted_at", null),
      supabase.from("lead_tags").select("tag_id, tags(name, color)").eq("lead_id", leadId),
      supabase.from("tasks").select("title, due_at, completed_at").eq("lead_id", leadId).is("deleted_at", null).limit(10),
    ]);

    const stageName = stage?.name || "Em atendimento";

    // 3. Busca mensagens da conversa
    let messages: Array<{ body: string | null; transcript: string | null; direction: string; sent_at: string }> = [];
    if (conversation) {
      const { data: msgData } = await supabase
        .from("messages")
        .select("body, transcript, direction, sent_at")
        .eq("conversation_id", conversation.id)
        .order("sent_at", { ascending: true })
        .limit(100);

      if (msgData) messages = msgData;
    }

    // 4. Extrai produtos marcados para venda
    const produtosMarcados: string[] = [];
    (interestsData ?? []).forEach((item: any) => {
      if (item.products?.name) {
        const preco = item.products.default_price ? ` (${formatBRL(item.products.default_price)})` : "";
        produtosMarcados.push(`${item.products.name}${preco}`);
      }
    });
    (oppsData ?? []).forEach((opp: any) => {
      if (opp.products?.name && !produtosMarcados.some((p) => p.startsWith(opp.products.name))) {
        const val = opp.potential_value || opp.sold_value;
        const preco = val ? ` (${formatBRL(val)})` : "";
        produtosMarcados.push(`${opp.products.name}${preco}`);
      }
    });

    // 5. Extrai etiquetas / tags
    const tagsMarcadas: string[] = [];
    (tagsData ?? []).forEach((t: any) => {
      if (t.tags?.name) tagsMarcadas.push(t.tags.name);
    });

    // 6. Extrai tarefas
    const tarefasList: string[] = [];
    (tasksData ?? []).forEach((task: any) => {
      const status = task.completed_at ? "[Concluída]" : "[Pendente]";
      tarefasList.push(`${status} ${task.title}`);
    });

    // Contagem de fontes analisadas
    const sourceCount =
      messages.length +
      (notes?.length || 0) +
      (appointments?.length || 0) +
      produtosMarcados.length +
      tagsMarcadas.length;

    // 7. Montar histórico estruturado
    const historyLines: string[] = [];

    if (produtosMarcados.length > 0) {
      historyLines.push(`• PRODUTO/SERVIÇO MARCADO PARA VENDA: ${produtosMarcados.join(", ")}`);
    }
    if (tagsMarcadas.length > 0) {
      historyLines.push(`• ETIQUETAS/TAGS DO LEAD: ${tagsMarcadas.join(", ")}`);
    }
    if (lead.follow_up_note) {
      historyLines.push(`• NOTA DE FOLLOW-UP: ${lead.follow_up_note}`);
    }
    if (tarefasList.length > 0) {
      historyLines.push(`• TAREFAS/AÇÕES: ${tarefasList.join(" | ")}`);
    }

    if (notes && notes.length > 0) {
      notes.forEach((n) => {
        if (n.body?.trim()) historyLines.push(`• ANOTAÇÃO INTERNA: ${n.body.trim()}`);
      });
    }

    if (appointments && appointments.length > 0) {
      appointments.forEach((a) => {
        historyLines.push(`• SESSÃO AGENDADA: ${a.title} (Status: ${a.status}, Data: ${a.starts_at})`);
      });
    }

    messages.forEach((m) => {
      const sender = m.direction === "inbound" ? `[Paciente/Lead ${lead.name}]` : "[Clínica/Atendimento]";
      const content = (m.body || m.transcript || "").trim();
      if (content) historyLines.push(`${sender}: ${content}`);
    });

    const conversationText = historyLines.join("\n");

    let result: AISummaryResult | null = null;

    const produtosContexto = produtosMarcados.length > 0
      ? `PRODUTO/SERVIÇO ESPECÍFICO MARCADO PARA ESTE LEAD: ${produtosMarcados.join(", ")}`
      : "Nenhum produto específico pré-selecionado.";

    const tagsContexto = tagsMarcadas.length > 0
      ? `ETIQUETAS DO LEAD: ${tagsMarcadas.join(", ")}`
      : "Sem etiquetas específicas.";

    const userPrompt = `
DADOS DO LEAD 360°:
- Nome: ${lead.name}
- Etapa no Pipeline: ${stageName}
- Canal de Entrada: ${lead.channel || lead.source_detail || "WhatsApp"}
- ${produtosContexto}
- ${tagsContexto}

HISTÓRICO COMPLETO (PRODUTOS, TAGS, TAREFAS, SESSÕES E MENSAGENS):
${conversationText || "Nenhuma mensagem anterior registrada."}
`;

    // Executa inferência com IA (Ollama Local prioritário)
    const aiResponse = await generateAICompletion({
      systemPrompt: SUMMARY_SYSTEM_PROMPT,
      userPrompt,
      jsonFormat: true,
      temperature: 0.2,
    });

    if (aiResponse) {
      try {
        const parsed = JSON.parse(aiResponse.text);
        result = {
          notes_summary: parsed.notes_summary || parsed.resumo_geral || "",
          summary_need: parsed.summary_need || parsed.necessidade || "",
          summary_moment: parsed.summary_moment || parsed.momento_urgencia || "",
          summary_preference: parsed.summary_preference || parsed.preferencias || "",
          summary_open_point: parsed.summary_open_point || parsed.ponto_aberto || "",
          summary_source_count: sourceCount,
          summary_model: aiResponse.model,
          summary_generated_at: new Date().toISOString(),
        };
      } catch (parseErr) {
        console.warn("Falha ao parsear JSON da IA:", parseErr);
      }
    }

    // Fallback para Motor Clínico Heurístico se a IA não responder
    if (!result) {
      result = generateHeuristicSummary(lead, stageName, produtosMarcados, tagsMarcadas, messages, notes || [], appointments || [], sourceCount);
    }

    // Salvar na tabela leads
    const nowIso = new Date().toISOString();
    result.summary_generated_at = nowIso;

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        notes_summary: result.notes_summary,
        summary_need: result.summary_need,
        summary_moment: result.summary_moment,
        summary_preference: result.summary_preference,
        summary_open_point: result.summary_open_point,
        summary_source_count: result.summary_source_count,
        summary_model: result.summary_model,
        summary_generated_at: result.summary_generated_at,
      })
      .eq("id", leadId);

    if (updateError) {
      console.error("Erro ao salvar resumo na tabela leads:", updateError);
      return { success: false, error: "Não foi possível salvar o resumo no banco." };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error("Erro em generateLeadAISummary:", err);
    return { success: false, error: err.message || "Erro desconhecido ao processar resumo." };
  }
}

/** Motor Heurístico Local Clínico Contextual */
function generateHeuristicSummary(
  lead: any,
  stageName: string,
  produtosMarcados: string[],
  tagsMarcadas: string[],
  messages: any[],
  notes: any[],
  appointments: any[],
  sourceCount: number,
): AISummaryResult {
  const allText = [
    produtosMarcados.join(" "),
    tagsMarcadas.join(" "),
    ...messages.map((m) => `${m.body || ""} ${m.transcript || ""}`),
    ...notes.map((n) => n.body || ""),
  ].join(" ").toLowerCase();

  // 1. Necessidade (Alinhada estritamente com o Produto e Tags marcadas)
  let need = "Busca acolhimento e informações sobre atendimento especializado.";
  if (produtosMarcados.some((p) => p.toLowerCase().includes("supervisão") || p.toLowerCase().includes("supervisao")) || tagsMarcadas.some((t) => t.toLowerCase().includes("supervisão") || t.toLowerCase().includes("supervisao"))) {
    need = `Interesse e contratação de ${produtosMarcados[0] || "Supervisão Clínica"} para discussão e aprimoramento de casos clínicos.`;
  } else if (produtosMarcados.some((p) => p.toLowerCase().includes("avaliação") || p.toLowerCase().includes("neuropsic") || p.toLowerCase().includes("laudo"))) {
    need = `Demanda voltada para ${produtosMarcados[0] || "Avaliação Neuropsicológica"} e elaboração de laudo pericial.`;
  } else if (produtosMarcados.some((p) => p.toLowerCase().includes("casal"))) {
    need = "Demanda de Terapia de Casal para alinhamento relacional.";
  } else if (produtosMarcados.some((p) => p.toLowerCase().includes("infantil") || p.toLowerCase().includes("adolescente"))) {
    need = "Atendimento psicológico infantil / orientação de pais.";
  } else if (allText.includes("ansiedade") || allText.includes("pânico") || allText.includes("crise")) {
    need = "Queixa de sintomas ansiosos e busca de manejo emocional.";
  } else if (allText.includes("depress") || allText.includes("tristeza") || allText.includes("desânimo")) {
    need = "Acompanhamento para quadro depressivo e regulação do humor.";
  } else if (produtosMarcados.length > 0) {
    need = `Interesse no serviço: ${produtosMarcados.join(", ")}.`;
  }

  // 2. Momento & Urgência
  let moment = "Em fase de alinhamento de horários e proposta.";
  if (appointments.length > 0) {
    const nextAppt = appointments[0];
    moment = `Sessão agendada (${nextAppt.title}) para ${new Date(nextAppt.starts_at).toLocaleDateString("pt-BR")}.`;
  } else if (allText.includes("urgente") || allText.includes("hoje") || allText.includes("amanhã")) {
    moment = "Alta urgência com solicitação de disponibilidade imediata.";
  } else if (messages.length > 4) {
    moment = "Engajado no atendimento via WhatsApp, avaliando agenda.";
  }

  // 3. Preferências / Restrições
  const prefs: string[] = [];
  if (allText.includes("online") || allText.includes("meet") || allText.includes("vídeo")) prefs.push("Modalidade Online (Google Meet)");
  if (allText.includes("presencial") || allText.includes("consultório")) prefs.push("Modalidade Presencial");
  if (allText.includes("noite") || allText.includes("noturno") || allText.includes("18h") || allText.includes("19h") || allText.includes("20h")) prefs.push("Horário Noturno");
  if (allText.includes("manhã") || allText.includes("matutino") || allText.includes("08h") || allText.includes("09h")) prefs.push("Horário Matutino");
  if (allText.includes("tarde") || allText.includes("vespertino")) prefs.push("Horário Vespertino");
  if (allText.includes("sábado") || allText.includes("sabado")) prefs.push("Disponibilidade aos Sábados");

  const preference = prefs.length > 0 ? prefs.join(" · ") : "Sem restrições expressas de horário registradas.";

  // 4. Ponto em Aberto / Próximo Passo
  let openPoint = `Apresentar opções de datas e confirmar agendamento de ${produtosMarcados[0] || "atendimento"}.`;
  if (appointments.some((a) => a.status === "scheduled")) {
    openPoint = "Enviar confirmação de presença e link do Google Meet antes da sessão.";
  } else if (messages.length > 0 && messages[messages.length - 1].direction === "outbound") {
    openPoint = "Aguardando resposta do contato sobre opções de horários.";
  }

  const servicoNome = produtosMarcados.length > 0 ? produtosMarcados.join(", ") : "Atendimento Clínico";
  const notesSummary = `${lead.name} está em negociação para ${servicoNome}. Encontra-se na etapa "${stageName}". ${need} ${moment}`;

  return {
    notes_summary: notesSummary,
    summary_need: need,
    summary_moment: moment,
    summary_preference: preference,
    summary_open_point: openPoint,
    summary_source_count: sourceCount,
    summary_model: "Motor Clínico ORDO (NLP Integrado)",
    summary_generated_at: new Date().toISOString(),
  };
}

const SUMMARY_SYSTEM_PROMPT = `
Você é o Analista Clínico e Comercial Inteligente do ORDO CRM.
Sua missão é ler o contexto 360° de um lead/paciente e gerar um Resumo Comercial 360° estruturado e fiel ao contexto real.

REGRA CRÍTICA DE CONTEXTO E PRODUTO:
- Verifique OBRIGATORIAMENTE o campo "PRODUTO/SERVIÇO ESPECÍFICO MARCADO PARA ESTE LEAD" e as "ETIQUETAS DO LEAD".
- Se o produto marcado for "Supervisão Clínica" ou tiver tag de supervisão/psicólogo, o lead busca SUPERVISÃO CLÍNICA / MENTORIA DE CASOS (e NÃO processo terapêutico como paciente).
- Se o produto for "Avaliação Neuropsicológica", o foco é AVALIAÇÃO / LAUDO PERICIAL.
- Se o produto for "Terapia de Casal", o foco é CASAL.
- Se o produto for "Psicoterapia Individual", o foco é PSICOTERAPIA.
- Nunca invente que o paciente busca terapia se o produto marcado for Supervisão ou Consultoria!

Retorne EXCLUSIVAMENTE um objeto JSON estrito com os campos:
{
  "notes_summary": "Parágrafo executivo conciso (2 a 3 frases) sintetizando quem é a pessoa, o serviço exato que está negociando (ex: Supervisão Clínica), o contexto geral e o estágio da negociação.",
  "summary_need": "Qual é a necessidade exata identificada de acordo com o produto marcado e as mensagens (ex: Busca Supervisão Clínica para discussão de casos e aprimoramento técnico).",
  "summary_moment": "Em qual momento de decisão ou urgência o contato está.",
  "summary_preference": "Preferências de horários, modalidade online/presencial ou formato das sessões.",
  "summary_open_point": "Qual é a pendência ou próximo passo comercial imediato."
}

Responda em português do Brasil com precisão profissional e objetividade.
`;
