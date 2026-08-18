import { generateAICompletion } from "./client";
import { SALES_OBJECTIONS_PLAYBOOK, type ObjectionFramework } from "./sales-playbook";

export interface GenerateReactivationInput {
  leadName: string;
  lostReason?: string | null;
  lostNote?: string | null;
  daysPassed?: number;
  recentMessages?: { body: string; direction: "inbound" | "outbound" }[];
  professionalName?: string | null;
  workspaceName?: string | null;
}

export interface GenerateReactivationResult {
  message: string;
  strategyTitle?: string;
  modelUsed: string;
  source: string;
}

/**
 * Encontra no playbook a estratégia de objeção mais aderente ao motivo/anotação
 */
function findMatchingPlaybookStrategy(
  lostReason?: string | null,
  lostNote?: string | null
): ObjectionFramework | null {
  const combined = `${lostReason || ""} ${lostNote || ""}`.toLowerCase();

  for (const item of SALES_OBJECTIONS_PLAYBOOK) {
    if (
      item.triggerKeywords.some((kw) =>
        combined.includes(kw.toLowerCase())
      )
    ) {
      return item;
    }
  }

  // Fallback se contiver termos comuns de preço/financeiro
  if (
    combined.includes("financeir") ||
    combined.includes("preço") ||
    combined.includes("preco") ||
    combined.includes("valor") ||
    combined.includes("caro")
  ) {
    return SALES_OBJECTIONS_PLAYBOOK[0];
  }

  // Fallback se for rotina ou tempo
  if (combined.includes("tempo") || combined.includes("rotina") || combined.includes("horário")) {
    return SALES_OBJECTIONS_PLAYBOOK[3];
  }

  return null;
}

/**
 * Gera mensagem de reativação de fallback altamente empática baseada no playbook
 */
function generateFallbackMessage(
  input: GenerateReactivationInput,
  strategy: ObjectionFramework | null
): string {
  const primeiroNome = input.leadName.trim().split(/\s+/)[0] || "Olá";

  if (strategy?.scriptSecretary) {
    let script = strategy.scriptSecretary.replace(/\[Nome\]/gi, primeiroNome);
    // Remove aspas caso estejam no script
    script = script.replace(/^"|"$/g, "");
    return script;
  }

  // Se houver anotação de preço/financeiro
  const noteLower = (input.lostNote || "").toLowerCase();
  if (noteLower.includes("preço") || noteLower.includes("valor") || noteLower.includes("parcel")) {
    return `Olá, ${primeiroNome}! Tudo bem? 🌿\n\nLembrei de você hoje e do acompanhamento que conversamos. Sei que o planejamento financeiro é fundamental, e queria te avisar que conseguimos flexibilizar as condições de pagamento e a emissão dos recibos para reembolso do seu plano de saúde.\n\nComo você tem passado? Se fizer sentido para você, podemos conversar com calma sobre como adaptar o formato para a sua realidade.`;
  }

  return `Olá, ${primeiroNome}, tudo bem? 🌿\n\nComo você tem passado desde nosso último contato? Lembrei de você hoje e queria saber como estão as coisas por aí.\n\nSe você ainda tiver interesse em retomar o acompanhamento ou se ficou alguma dúvida sobre como funciona o processo, estou à disposição para conversarmos sem nenhum compromisso.`;
}

/**
 * Gera mensagem de follow-up de reativação personalizada usando IA contextual
 */
export async function generateAIReactivationMessage(
  input: GenerateReactivationInput
): Promise<GenerateReactivationResult> {
  const primeiroNome = input.leadName.trim().split(/\s+/)[0] || "Olá";
  const strategy = findMatchingPlaybookStrategy(input.lostReason, input.lostNote);

  const systemPrompt = `Você é um Assistente Clínico e Estrategista em Comunicação Terapêutica do ORDO CRM, especializado em Psicologia, Neuropsicologia e Saúde Mental.

Seu objetivo é redigir UMA ÚNICA MENSAGEM de WhatsApp para reatar contato com um paciente/lead que foi marcado como "Perdido" há algum tempo.

DIRETRIZES CRÍTICAS:
1. Tom: Extremamente acolhedor, empático, profissional e gentil. NUNCA soe como vendedor insistente, telemarketing ou spam.
2. Personalização com o Contexto da Perda:
   - Use o motivo registrado (${input.lostReason || "Contato pausado"}) e as anotações clínicas/objeções fornecidas pelo terapeuta ("${input.lostNote || "Sem anotações adicionais"}") para contextualizar a mensagem de forma sutil e natural.
   - Se a perda foi por PREÇO/VALOR: Acolha a questão financeira e mencione sutilmente flexibilidade nas condições, pacotes ou auxílio com reembolso de convênio.
   - Se foi por TEMPO/ROTINA: Destaque a flexibilidade de horários (online, início da manhã ou noites) e a importância do autocuidado em rotinas sobrecarregadas.
   - Se PAROU DE RESPONDER: Faça um check-in atencioso e acolhedor perguntando como a pessoa tem passado.
3. Formatação:
   - Comece com saudação natural: "Olá, ${primeiroNome}!" ou "Oi, ${primeiroNome}, tudo bem?"
   - Use 2 a 3 parágrafos curtos, ideais para leitura no WhatsApp.
   - Use 1 ou 2 emojis delicados (🌿, ✨, ☕, 💭).
   - Termine com uma pergunta aberta e acolhedora.
   - NUNCA inclua assinaturas formais de e-mail ou placeholders como "Att,", "Atenciosamente," ou "[Seu Nome]". A mensagem é enviada diretamente pelo WhatsApp.
4. Retorne APENAS o texto da mensagem pronto para ser enviado pelo WhatsApp, sem introduções, aspas extras ou explicações adicionais.`;

  let historicoTexto = "";
  if (input.recentMessages && input.recentMessages.length > 0) {
    historicoTexto = `\nÚLTIMAS MENSAGENS TROCADAS NA CONVERSA:\n` +
      input.recentMessages
        .slice(-5)
        .map((m) => `[${m.direction === "outbound" ? "Clínica" : "Paciente"}]: ${m.body}`)
        .join("\n");
  }

  const userPrompt = `DADOS DO PACIENTE:
- Nome: ${input.leadName} (chamar de ${primeiroNome})
- Motivo da Perda: ${input.lostReason || "Parou de responder / Pausou"}
- Anotações / Objeções informadas pelo profissional: ${input.lostNote || "Nenhuma anotação adicional informada"}
- Dias desde o encerramento do contato: ${input.daysPassed || "alguns"} dias
${strategy ? `- Diagnóstico Estratégico Sugerido: ${strategy.diagnosis}\n- Recomendação: ${strategy.strategy}` : ""}
${historicoTexto}

Redija a mensagem de reativação personalizada agora:`;

  try {
    const aiResponse = await generateAICompletion({
      systemPrompt,
      userPrompt,
      temperature: 0.4,
    });

    if (aiResponse && aiResponse.text) {
      let cleanText = aiResponse.text.trim();
      // Remove possíveis aspas delimitadoras
      if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
        cleanText = cleanText.slice(1, -1).trim();
      }
      // Remove possíveis assinaturas residuais como "Att, [Nome]" ou "[Seu Nome]"
      cleanText = cleanText
        .replace(/\n\s*(Att|Atenciosamente|Abraços|Carinhosamente)[,\s]*(\n.*)?$/i, "")
        .replace(/\[Seu Nome\]/gi, "")
        .replace(/\[Nome do Profissional\]/gi, "")
        .trim();

      return {
        message: cleanText,
        strategyTitle: strategy?.objection,
        modelUsed: aiResponse.model,
        source: aiResponse.source,
      };
    }
  } catch (err) {
    console.warn("Falha na geração via IA de reativação, aplicando playbook:", err);
  }

  // Fallback seguro de alta qualidade clínica
  const fallback = generateFallbackMessage(input, strategy);
  return {
    message: fallback,
    strategyTitle: strategy?.objection || "Reativação Acolhedora",
    modelUsed: "Playbook Clínico do ORDO",
    source: "local_nlp",
  };
}
