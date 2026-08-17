import { createClient } from "@/lib/supabase/server";

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
 * Analisa mensagens do WhatsApp, notas clínicas/comerciais e agendamentos.
 * Utiliza LLM (Groq / OpenAI / Gemini) ou Motor Heurístico de Alta Precisão.
 */
export async function generateLeadAISummary(
  workspaceId: string,
  leadId: string,
): Promise<{ success: boolean; data?: AISummaryResult; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Busca dados do Lead de forma direta e segura (sem joins frágeis)
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, name, phone, email, status, temperature, origin, notes_summary, metadata, stage_id, workspace_id")
      .eq("id", leadId)
      .is("deleted_at", null)
      .maybeSingle();

    if (leadError) {
      console.error("Erro na busca do lead:", leadError);
      return { success: false, error: `Erro no banco de dados: ${leadError.message}` };
    }

    if (!lead) {
      return { success: false, error: "Lead não encontrado no consultório." };
    }

    // Busca nome da etapa do pipeline
    let stageName = "Em atendimento";
    if (lead.stage_id) {
      const { data: stage } = await supabase
        .from("pipeline_stages")
        .select("name")
        .eq("id", lead.stage_id)
        .maybeSingle();
      if (stage?.name) stageName = stage.name;
    }

    // 2. Busca conversa e mensagens do WhatsApp
    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("lead_id", leadId)
      .maybeSingle();

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

    // 3. Busca anotações do Lead (tabela notes)
    const { data: notes } = await supabase
      .from("notes")
      .select("body, created_at")
      .eq("lead_id", leadId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true })
      .limit(20);

    // 4. Busca agendamentos (tabela appointments)
    const { data: appointments } = await supabase
      .from("appointments")
      .select("title, status, starts_at")
      .eq("lead_id", leadId)
      .is("deleted_at", null)
      .order("starts_at", { ascending: false })
      .limit(5);

    // Contagem de fontes analisadas
    const sourceCount = messages.length + (notes?.length || 0) + (appointments?.length || 0);

    // Montar texto do histórico para a IA
    const historyLines: string[] = [];

    messages.forEach((m) => {
      const sender = m.direction === "inbound" ? `[Paciente/Lead ${lead.name}]` : "[Clínica/Atendimento]";
      const content = (m.body || m.transcript || "").trim();
      if (content) {
        historyLines.push(`${sender}: ${content}`);
      }
    });

    if (notes && notes.length > 0) {
      notes.forEach((n) => {
        if (n.body?.trim()) {
          historyLines.push(`[Anotação Clínica/Comercial]: ${n.body.trim()}`);
        }
      });
    }

    if (appointments && appointments.length > 0) {
      appointments.forEach((a) => {
        historyLines.push(`[Sessão Agendada]: ${a.title} (Status: ${a.status}, Data: ${a.starts_at})`);
      });
    }

    const conversationText = historyLines.join("\n");

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let result: AISummaryResult | null = null;

    // TENTATIVA 1: Groq Llama 3.3 70B
    if (!result && groqKey) {
      result = await callGroqSummary(lead.name, conversationText, sourceCount);
    }

    // TENTATIVA 2: OpenAI GPT-4o-mini
    if (!result && openaiKey) {
      result = await callOpenAISummary(lead.name, conversationText, sourceCount);
    }

    // TENTATIVA 3: Gemini 1.5 Flash
    if (!result && geminiKey) {
      result = await callGeminiSummary(lead.name, conversationText, geminiKey, sourceCount);
    }

    // TENTATIVA 4: Motor Heurístico Especializado Clínico (Fallback Local)
    if (!result) {
      result = generateHeuristicSummary(lead, stageName, messages, notes || [], appointments || [], sourceCount);
    }

    // Salvar no Banco de Dados
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

/** Chamada Groq Llama 3.3 70B */
async function callGroqSummary(patientName: string, history: string, sourceCount: number): Promise<AISummaryResult | null> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SUMMARY_SYSTEM_PROMPT },
          { role: "user", content: `Paciente: ${patientName}\n\nHistórico:\n${history || "Sem mensagens anteriores."}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return {
      notes_summary: parsed.notes_summary || parsed.resumo_geral || "",
      summary_need: parsed.summary_need || parsed.necessidade || "",
      summary_moment: parsed.summary_moment || parsed.momento_urgencia || "",
      summary_preference: parsed.summary_preference || parsed.preferencias || "",
      summary_open_point: parsed.summary_open_point || parsed.ponto_aberto || "",
      summary_source_count: sourceCount,
      summary_model: "Llama 3.3 70B (Groq IA)",
      summary_generated_at: new Date().toISOString(),
    };
  } catch (err) {
    console.warn("Groq summary error:", err);
    return null;
  }
}

/** Chamada OpenAI GPT-4o-mini */
async function callOpenAISummary(patientName: string, history: string, sourceCount: number): Promise<AISummaryResult | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SUMMARY_SYSTEM_PROMPT },
          { role: "user", content: `Paciente: ${patientName}\n\nHistórico:\n${history || "Sem mensagens anteriores."}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return {
      notes_summary: parsed.notes_summary || parsed.resumo_geral || "",
      summary_need: parsed.summary_need || parsed.necessidade || "",
      summary_moment: parsed.summary_moment || parsed.momento_urgencia || "",
      summary_preference: parsed.summary_preference || parsed.preferencias || "",
      summary_open_point: parsed.summary_open_point || parsed.ponto_aberto || "",
      summary_source_count: sourceCount,
      summary_model: "GPT-4o mini (OpenAI)",
      summary_generated_at: new Date().toISOString(),
    };
  } catch (err) {
    console.warn("OpenAI summary error:", err);
    return null;
  }
}

/** Chamada Gemini 1.5 Flash */
async function callGeminiSummary(patientName: string, history: string, apiKey: string, sourceCount: number): Promise<AISummaryResult | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SUMMARY_SYSTEM_PROMPT}\n\nPaciente: ${patientName}\n\nHistórico:\n${history || "Sem mensagens anteriores."}` },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return {
      notes_summary: parsed.notes_summary || parsed.resumo_geral || "",
      summary_need: parsed.summary_need || parsed.necessidade || "",
      summary_moment: parsed.summary_moment || parsed.momento_urgencia || "",
      summary_preference: parsed.summary_preference || parsed.preferencias || "",
      summary_open_point: parsed.summary_open_point || parsed.ponto_aberto || "",
      summary_source_count: sourceCount,
      summary_model: "Gemini 1.5 Flash (Google)",
      summary_generated_at: new Date().toISOString(),
    };
  } catch (err) {
    console.warn("Gemini summary error:", err);
    return null;
  }
}

/** Motor Heurístico Local Especializado em Clínicas de Psicologia & Saúde Mental */
function generateHeuristicSummary(
  lead: any,
  stageName: string,
  messages: any[],
  notes: any[],
  appointments: any[],
  sourceCount: number,
): AISummaryResult {
  const allText = [
    ...messages.map((m) => `${m.body || ""} ${m.transcript || ""}`),
    ...notes.map((n) => n.body || ""),
  ].join(" ").toLowerCase();

  // 1. Necessidade
  let need = "Busca acolhimento e informações sobre atendimento psicológico/clínico.";
  if (allText.includes("ansiedade") || allText.includes("pânico") || allText.includes("crise")) {
    need = "Queixa de sintomas ansiosos e busca de manejo emocional.";
  } else if (allText.includes("depress") || allText.includes("tristeza") || allText.includes("desânimo")) {
    need = "Acompanhamento para quadro depressivo e regulação do humor.";
  } else if (allText.includes("casal") || allText.includes("relacionamento") || allText.includes("marido") || allText.includes("esposa")) {
    need = "Terapia de casal / mediação de conflitos relacionais.";
  } else if (allText.includes("filho") || allText.includes("criança") || allText.includes("adolescente") || allText.includes("infantil")) {
    need = "Atendimento psicológico infantil/adolescente e orientação de pais.";
  } else if (allText.includes("laudo") || allText.includes("avaliação") || allText.includes("neuropsic") || allText.includes("tdah")) {
    need = "Processo de avaliação neuropsicológica e diagnóstico / laudo pericial.";
  } else if (allText.includes("luto") || allText.includes("perda")) {
    need = "Elaboração de luto e suporte em momento de perda recente.";
  }

  // 2. Momento & Urgência
  let moment = "Em fase inicial de sondagem e qualificação de horários.";
  if (appointments.length > 0) {
    const nextAppt = appointments[0];
    moment = `Consulta ${nextAppt.status === "scheduled" ? "agendada" : "em andamento"} (${nextAppt.title}).`;
  } else if (allText.includes("urgente") || allText.includes("hoje") || allText.includes("amanhã") || allText.includes("o quanto antes")) {
    moment = "Alta urgência: solicitou encaixe ou disponibilidade imediata.";
  } else if (allText.includes("preço") || allText.includes("valor") || allText.includes("quanto custa") || allText.includes("tabela")) {
    moment = "Fase de decisão financeira / avaliação de proposta de valor.";
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
  if (allText.includes("unimed") || allText.includes("plano") || allText.includes("convênio") || allText.includes("reembolso")) prefs.push("Interesse em Recibo para Reembolso");

  const preference = prefs.length > 0 ? prefs.join(" · ") : "Sem restrições expressas de horário ou modalidade registradas.";

  // 4. Ponto em Aberto / Próximo Passo
  let openPoint = "Apresentar opções de horários e valores da sessão.";
  if (appointments.some((a) => a.status === "scheduled")) {
    openPoint = "Enviar mensagem de confirmação de presença 24h antes da sessão.";
  } else if (allText.includes("chave pix") || allText.includes("pagamento") || allText.includes("cartão")) {
    openPoint = "Confirmar comprovante de pagamento da primeira consulta.";
  } else if (messages.length > 0 && messages[messages.length - 1].direction === "outbound") {
    openPoint = "Aguardando resposta do paciente sobre proposta enviada.";
  } else if (messages.length > 0 && messages[messages.length - 1].direction === "inbound") {
    openPoint = "Responder última mensagem do paciente e sugerir vaga.";
  }

  // 5. Síntese Geral
  const notesSummary = `Paciente ${lead.name}, captado(a) via ${lead.origin || "Indicação/WhatsApp"}. Encontra-se na etapa "${stageName}". ${need} ${moment}`;

  return {
    notes_summary: notesSummary,
    summary_need: need,
    summary_moment: moment,
    summary_preference: preference,
    summary_open_point: openPoint,
    summary_source_count: sourceCount,
    summary_model: "Motor Clínico ORDO (NLP Inteligente)",
    summary_generated_at: new Date().toISOString(),
  };
}

const SUMMARY_SYSTEM_PROMPT = `
Você é o Analista Clínico e Comercial Inteligente do ORDO CRM (plataforma de alto padrão para psicólogos, terapeutas e clínicas).
Sua missão é ler o histórico de mensagens, notas e agendamentos de um paciente/lead e extrair um Resumo Comercial 360° estruturado.

Você DEVE retornar OBRIGATORIAMENTE um JSON estrito no seguinte formato:
{
  "notes_summary": "Parágrafo executivo conciso (2 a 3 frases) sintetizando quem é o paciente, o contexto geral e o estágio da negociação clínica.",
  "summary_need": "Qual é a queixa principal, motivo da procura ou necessidade terapêutica/médica identificada (ex: Sintomas de ansiedade generalizada, Terapia de casal, Avaliação neuropsicológica).",
  "summary_moment": "Em qual momento de decisão ou urgência o paciente está (ex: Urgência alta com crise, Avaliando opções de preço, Consulta agendada).",
  "summary_preference": "Preferências de horários, dias da semana, modalidade online/presencial, recibo/reembolso ou restrições manifestadas.",
  "summary_open_point": "Qual é a pendência ou próximo passo comercial imediato (ex: Enviar horários de terça-feira à noite, Confirmar link do Meet, Aguardar comprovante Pix)."
}

Regras:
- Seja direto, clínico, profissional e focado na prática da saúde mental e consultórios.
- Responda em português do Brasil.
- Se algum ponto não for mencionado no histórico, preencha com uma inferência lógica ou "A ser explorado no primeiro contato".
`;
