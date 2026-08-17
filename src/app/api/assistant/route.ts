import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";
import { generateAICompletion } from "@/lib/ai/client";

export async function POST(req: NextRequest) {
  const context = await getSessionContext();
  if (!context) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const { prompt, patientName, stage, category } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt inválido." }, { status: 400 });
    }

    const patientContext = patientName ? `Paciente em foco: ${patientName}. ` : "";
    const stageContext = stage ? `Etapa no CRM: ${stage}. ` : "";
    const categoryContext = category ? `Área da consulta: ${category}. ` : "";

    const systemPrompt = `
Você é o ORDO Assistant, o Copiloto Clínico, Financeiro e Estratégico de Inteligência Artificial integrado ao ORDO CRM.
Você é um especialista sênior em Psicologia Clínica, Psiquiatria, Gestão de Consultórios de Saúde Mental, Legislação do CFP/CFM e Inteligência Financeira para profissionais da saúde.

Você auxilia terapeutas, psicólogos e médicos em 4 grandes pilares fundamentais:

1. 🧠 PRÁTICA CLÍNICA & SAÚDE MENTAL:
   - Discussão de hipóteses diagnósticas e critérios do DSM-5-TR e CID-11.
   - Sugestões de intervenções e técnicas baseadas em evidências (TCC, Psicanálise, ACT, DBT, Sistêmica, Humanista, Fenomenologia, Gestalt, etc.).
   - Protocolos de manejo de crises, ideação suicida, surtos psicóticos, ataques de pânico e encaminhamento psiquiátrico.
   - Estruturação de documentos psicológicos conforme a Resolução CFP nº 06/2019 (Declaração, Atestado, Relatório Psicológico, Laudo e Parecer).
   - Manejo do setting terapêutico, enquadre, faltas, transferência/contratransferência e término de tratamento.

2. 💰 FINANÇAS, TRIBUTAÇÃO & PRECIFICAÇÃO:
   - Cálculo de valor de hora clínica, custos fixos/variáveis e formação de honorários.
   - Modelos de cobrança (sessão avulsa, pacote mensal pré-pago, reajuste anual).
   - Tributação do profissional de saúde: Carnê-Leão, Livro Caixa, deduções legais, DMED, Simples Nacional vs. PF.
   - Emissão de recibos e notas fiscais para reembolso de convênios (Unimed, Bradesco, Amil, SulAmérica, etc.).
   - Gestão ética e elegante de inadimplência e atrasos.

3. 🚀 DESENVOLVIMENTO DE CARREIRA & GESTÃO:
   - Posicionamento profissional ético e atração de pacientes particulares qualificados.
   - Prevenção do Burnout do terapeuta, organização da rotina clínica e supervisão.
   - Estratégias de fidelização e redução de abandono de tratamento.

4. 💬 COMUNICAÇÃO & OPERAÇÃO NO WHATSAPP:
   - Redação de mensagens humanizadas, acolhedoras, empáticas e sem tom apelativo ou puramente comercial.
   - Confirmações de sessões com link do Google Meet, follow-ups de pacientes inativos e informativos de recesso.

DIRETRIZES DE RESPOSTA:
- Responda em português do Brasil com linguagem sofisticada, acolhedora, precisa e prática.
- Use formatação Markdown rica (títulos, marcadores, passos práticos e blocos de destaque).
- Quando o usuário pedir um texto de mensagem ou modelo de documento, forneça o texto pronto e formatado para cópia.
${patientContext}${stageContext}${categoryContext}
`;

    // 1. Tenta gerar via Cliente de IA Unificado (Ollama Local prioritário -> Groq -> OpenAI -> Gemini)
    const aiResponse = await generateAICompletion({
      systemPrompt,
      userPrompt: prompt,
      temperature: 0.5,
    });

    if (aiResponse && aiResponse.text) {
      return NextResponse.json({ reply: aiResponse.text, model: aiResponse.model });
    }

    // 2. Fallback para Motor Clínico Heurístico Estruturado
    const reply = generateComprehensiveClinicalResponse(prompt, patientName);
    return NextResponse.json({ reply, model: "Motor Clínico ORDO (NLP Integrado)" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao processar consulta com o assistente." },
      { status: 500 },
    );
  }
}

/** Motor Heurístico de Fallback Amplo para Clínico, Financeiro e Gestão */
function generateComprehensiveClinicalResponse(prompt: string, patientName?: string): string {
  const name = patientName || "[Nome do Paciente]";
  const lower = prompt.toLowerCase();

  // 1. FINANÇAS & PRECIFICAÇÃO
  if (lower.includes("precificar") || lower.includes("hora clínica") || lower.includes("honorário") || lower.includes("quanto cobrar")) {
    return `### 💡 Guia de Precificação da Hora Clínica

Para calcular o valor justo da sua sessão, utilize a fórmula recomendada de gestão para consultórios:

$$\\text{Valor da Sessão} = \\frac{\\text{Custos Fixos} + \\text{Investimentos/Supervisão} + \\text{Meta de Pró-Labore}}{\\text{Horas Atendidas no Mês (com margem de 15\\% de faltas)}}$$

**Passo a Passo Prático:**
1. **Calcule os custos fixos mensais:** Aluguel, sublocação, plataformas (ORDO CRM, prontuário), CRP/CFM, anuidade e contabilidade.
2. **Defina seu teto de atendimento sustentável:** Entre 20 e 25 sessões semanais para evitar exaustão e sobrecarga emocional.
3. **Considere a margem de oscilação:** Preveja 15% de cancelamentos ou semanas de recesso.
4. **Formato de Contratação:** Oferecer pacotes mensais pré-pagos (ex: 4 sessões mensais pagas no início do mês) garante fluxo de caixa estável e reduz faltas em mais de 70%.`;
  }

  if (lower.includes("imposto") || lower.includes("carnê-leão") || lower.includes("carne leao") || lower.includes("livro caixa") || lower.includes("dmed")) {
    return `### 📊 Orientações Fiscais & Tributárias para Consultórios

• **Carnê-Leão (Mensal Obrigatório):** Psicólogos e médicos que atendem pessoa física devem escriturar mensalmente os recebimentos no portal e-CAC da Receita Federal.
• **Livro Caixa (Deduções Legais):** Você pode deduzir despesas diretamente ligadas ao exercício da profissão:
  - Aluguel/condomínio do consultório ou taxa de sublocação.
  - Softwares clínicos e ferramentas de gestão (ORDO CRM).
  - Anuidade do CRP/CFM e cursos de pós-graduação/supervisão técnica.
  - Energia, internet e material de escritório.
• **DMED (Declaração de Serviços Médicos e de Saúde):** Deve ser enviada anualmente informando CPF e valores recebidos de cada paciente para validação na malha fina da Receita.`;
  }

  // 2. DOCUMENTOS CFP
  if (lower.includes("laudo") || lower.includes("atestado") || lower.includes("relatório") || lower.includes("parecer") || lower.includes("cfp")) {
    return `### 📄 Estrutura de Documentos Psicológicos (Resolução CFP nº 06/2019)

Os 5 tipos oficiais de documentos e suas finalidades:

1. **Declaração:** Informa apenas comparecimento, dias e horários das sessões (sem sigilo de diagnóstico).
2. **Atestado Psicológico:** Certifica condições de saúde mental, aptidão ou necessidade de afastamento com base em avaliação prévia.
3. **Relatório Psicológico:** Descreve a evolução do caso, demanda, procedimentos e conclusões terapêuticas para outros profissionais ou escolas.
4. **Laudo Psicológico:** Documento pericial e conclusivo resultante de processo formal de Avaliação Psicológica.
5. **Parecer Psicológico:** Resposta técnica e fundamentada a uma consulta específica sobre questão psicológica.

⚠️ **Estrutura obrigatória:** Identificação, Descrição da Demanda, Procedimento, Análise e Conclusão com assinatura e número de registro no CRP.`;
  }

  // 3. MANEJO CLÍNICO & CRISES
  if (lower.includes("suicíd") || lower.includes("suicid") || lower.includes("crise") || lower.includes("automutila") || lower.includes("emergência")) {
    return `### 🚨 Protocolo de Manejo de Crise & Risco Imediato

1. **Avaliação de Letalidade & Intencionalidade:**
   - Investigue plano, acesso a meios e histórico prévio de tentativas.
   - Mantenha postura empática, calma e sem julgamentos moralistas.
2. **Quebra Ética de Sigilo (Art. 9º do Código de Ética CFP):**
   - Em caso de risco iminente à vida, o sigilo profissional deve ser quebrado no estrito limite necessário para proteger o paciente.
3. **Acionamento da Rede de Apoio:**
   - Notifique imediatamente o contato de emergência cadastrado no prontuário.
   - Encaminhe para avaliação psiquiátrica de urgência ou Pronto Atendimento / UPA.
4. **Contatos de Suporte 24h:**
   - **CVV (Centro de Valorização da Vida):** Telefone **188** (gratuito).
   - **SAMU:** 192 (em caso de intoxicação ou emergência médica).`;
  }

  // 4. MENSAGENS E ATENDIMENTO
  if (lower.includes("confirma") || lower.includes("lembrete")) {
    return `Olá, ${name}! Tudo bem? 🌿

Passando para confirmar nossa sessão agendada para **amanhã, às [Horário]**.

📍 **Modalidade:** [Online via Google Meet / Consultório Presencial]
🔗 **Link da sala:** [Link do Google Meet]

Caso precise de qualquer ajuste, fico à disposição. Até breve!`;
  }

  return `### 🌿 Análise e Orientação Clínica ORDO

Sobre a sua solicitação a respeito de "${prompt}":

1. **Abordagem Recomendada:**
   - Avalie o enquadre terapêutico e o alinhamento de expectativas com o paciente.
   - Mantenha a clareza na comunicação e o registro detalhado em prontuário.
2. **Próximos Passos Práticos:**
   - Formalize os acordos de horários, valores e termos de sigilo.
   - Utilize as ferramentas do ORDO CRM para acompanhar o ciclo de acompanhamento.

💡 *Dica:* Estou conectado à sua **IA Local (Ollama)** e pronto para responder dúvidas detalhadas sobre casos clínicos, tributação, documentos CFP e estratégias de consultório!`;
}
