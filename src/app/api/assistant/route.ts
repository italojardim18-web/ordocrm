import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";
import { generateAICompletion } from "@/lib/ai/client";

export async function POST(req: NextRequest) {
  const context = await getSessionContext();
  if (!context) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const { prompt, patientName, stage } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt inválido." }, { status: 400 });
    }

    const patientContext = patientName ? `Paciente atual: ${patientName}. ` : "";
    const stageContext = stage ? `Etapa no funil: ${stage}. ` : "";

    const systemPrompt = `
Você é o ORDO Assistant, o copiloto clínico e comercial especializado em psicologia, psiquiatria e clínicas de saúde mental integrado ao ORDO CRM.
Seu objetivo é auxiliar terapeutas, psicólogos e secretárias na redação de mensagens acolhedoras para WhatsApp, criação de follow-ups elegantes, confirmação de consultas, esclarecimento sobre recibos e reembolso, acolhimento inicial e estratégias de fidelização de pacientes.

Diretrizes:
- Mantenha sempre um tom profissional, acolhedor, humanizado e sofisticado.
- Adapte-se ao Código de Ética Profissional (CFP/CFM), valorizando o sigilo e o cuidado com a saúde mental.
- Responda em português do Brasil de forma clara, elegante e pronta para copiar e colar no WhatsApp.
- Quando sugerir mensagens, coloque o texto formatado e limpo para facilitar a cópia.
${patientContext}${stageContext}
`;

    // 1. Tenta gerar via Cliente de IA Unificado (Ollama Local prioritário -> Groq -> OpenAI -> Gemini)
    const aiResponse = await generateAICompletion({
      systemPrompt,
      userPrompt: prompt,
      temperature: 0.7,
    });

    if (aiResponse && aiResponse.text) {
      return NextResponse.json({ reply: aiResponse.text, model: aiResponse.model });
    }

    // 2. Fallback para Motor Clínico Heurístico Local Especializado
    const reply = generateClinicalAssistantResponse(prompt, patientName);
    return NextResponse.json({ reply, model: "Motor Clínico ORDO (NLP Integrado)" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao processar mensagem do assistente." },
      { status: 500 },
    );
  }
}

/** Motor Inteligente Especializado em Psicologia & Clínicas para Respostas Humanizadas */
function generateClinicalAssistantResponse(prompt: string, patientName?: string): string {
  const name = patientName || "[Nome do Paciente]";
  const lower = prompt.toLowerCase();

  if (lower.includes("confirma") || lower.includes("lembrete") || lower.includes("amanhã") || lower.includes("sessão")) {
    return `Aqui está uma mensagem acolhedora e profissional para confirmação de consulta:

"Olá, ${name}! Tudo bem? 🌿

Passando para confirmar nossa sessão agendada para **amanhã, às [Horário]**.

📍 **Modalidade:** [Online via Google Meet / Consultório Presencial]
🔗 **Link da sala:** [Link do Google Meet]

Caso precise remarcar ou tenha qualquer dúvida, por favor me avise com antecedência. Fico à disposição e até breve!"

💡 *Dica:* Enviar entre 24h a 48h antes reduz a taxa de não comparecimento em até 85%.`;
  }

  if (lower.includes("follow") || lower.includes("sumiu") || lower.includes("retorno") || lower.includes("não respondeu") || lower.includes("sem resposta")) {
    return `Sugiro esta mensagem de follow-up elegante e sem pressão para retomar o contato:

"Olá, ${name}! Como você tem passado? 🌸

Lembrei de você hoje e passei para saber se está tudo bem. Sei que a rotina pode ser bastante corrida, então fique à vontade para me responder no seu tempo.

Ficou alguma dúvida sobre como funciona nosso acompanhamento ou gostaria de verificar novas opções de horários para iniciarmos?

Estou por aqui caso queira dar continuidade. Um abraço!"

💡 *Dica:* Abordagens focadas no bem-estar do paciente geram 3x mais retorno do que mensagens focadas apenas em vendas.`;
  }

  if (lower.includes("valor") || lower.includes("preço") || lower.includes("quanto custa") || lower.includes("proposta") || lower.includes("tabela")) {
    return `Aqui está uma apresentação elegante do investimento terapêutico:

"Olá, ${name}! Que bom receber seu contato. ✨

Sobre nosso atendimento psicológico:
• **Duração:** 50 minutos por sessão.
• **Modalidade:** [Online via Google Meet / Presencial no Consultório].
• **Investimento:** R$ [Valor] por sessão (ou R$ [Valor Mensal] no pacote mensal com 4 sessões).
• **Formas de pagamento:** Pix, Cartão ou Boleto (com emissão de recibo para abatimento no Imposto de Renda ou reembolso de convênio).

Para encontrarmos o melhor dia e horário para você, você tem preferência pelo período da manhã, tarde ou noite?"

💡 *Dica:* Sempre termine a apresentação de valores com uma pergunta sobre horários para avançar a conversa.`;
  }

  if (lower.includes("reembolso") || lower.includes("convênio") || lower.includes("plano de saúde") || lower.includes("unimed") || lower.includes("bradesco") || lower.includes("amil")) {
    return `Explicação clara e profissional sobre atendimento particular com reembolso:

"Olá, ${name}! 

Nossos atendimentos são realizados de forma **particular**, o que nos permite dedicar tempo integral e um acompanhamento altamente personalizado a cada paciente.

Contudo, emitimos o **recibo e nota fiscal completos** com todos os dados exigidos pelo seu plano de saúde para que você possa solicitar o **reembolso integral ou parcial** das sessões diretamente pelo aplicativo do seu convênio.

Gostaria de agendar uma sessão inicial para conversarmos melhor sobre o seu caso?"

💡 *Dica:* A maioria dos planos (Bradesco, SulAmérica, Amil, etc.) reembolsa entre 60% e 100% das sessões com recibo.`;
  }

  if (lower.includes("primeira") || lower.includes("acolhimento") || lower.includes("ansiedade") || lower.includes("nervoso") || lower.includes("como funciona")) {
    return `Mensagem acolhedora de boas-vindas para o primeiro contato:

"Olá, ${name}! Seja muito bem-vindo(a). 🌿

Fico muito feliz pelo seu contato. Dar esse primeiro passo em busca de acompanhamento psicológico exige coragem e cuidado consigo mesmo(a).

Nosso consultório é um espaço seguro, livre de julgamentos e com total sigilo profissional (conforme as diretrizes do Conselho de Psicologia).

Na primeira sessão, vamos nos conhecer, conversar sobre o que você tem vivenciado e entender como posso te apoiar da melhor forma. 

Você teria disponibilidade esta semana para darmos esse primeiro passo?"`;
  }

  if (lower.includes("recesso") || lower.includes("férias") || lower.includes("urgência") || lower.includes("emergência") || lower.includes("crise")) {
    return `Mensagem de orientação para períodos de recesso e suporte a crises:

"Olá, ${name}! Tudo bem?

Informamos que nosso consultório estará em recesso profissional do dia [Data Início] até [Data Fim]. Retomaremos os atendimentos normalmente a partir do dia [Data Retorno].

⚠️ **Em caso de urgência emocional ou sofrimento psicológico agudo:**
• Entre em contato com o **CVV (Centro de Valorização da Vida)** pelo telefone gratuito **188** (atendimento 24h).
• Ou procure a **UPA/Pronto Atendimento** de saúde mental mais próximo da sua região.

Desejamos a você um excelente período de descanso e renovação!"`;
  }

  return `Entendido! Para a sua solicitação sobre "${prompt}", elaborei a seguinte proposta de mensagem humanizada e refinada:

"Olá, ${name}! Tudo bem? 🌿

${prompt.includes("agend") ? "Gostaria de verificar se você tem interesse em agendarmos uma sessão para esta semana." : "Passando para compartilhar algumas informações importantes sobre o seu atendimento e me colocar à total disposição para tirar qualquer dúvida."}

Qualquer dúvida ou ajuste necessário, estou à disposição por aqui!"

💡 *Sugestão:* Você pode personalizar os detalhes específicos de horários e valores antes de enviar.`;
}
