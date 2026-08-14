import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const context = await getSessionContext();
  if (!context) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt inválido." }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 1. Tenta Groq (Llama 3 70B / 8B Turbo) se configurado
    if (groqKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  "Você é o ORDO Assistant, o assistente inteligente e humanizado integrado ao ORDO CRM. Você auxilia psicólogos, médicos e secretárias na redação de mensagens acolhedoras para WhatsApp, criação de follow-ups elegantes, confirmação de consultas, propostas terapêuticas e otimização do atendimento. Mantenha um tom profissional, acolhedor, sofisticado e conciso. Responda em português do Brasil.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) return NextResponse.json({ reply: text });
        }
      } catch (err) {
        console.warn("Groq assistant fallback:", err);
      }
    }

    // 2. Tenta OpenAI se Groq não estiver disponível
    if (openaiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Você é o ORDO Assistant, o assistente inteligente do ORDO CRM. Auxilie em redação de mensagens acolhedoras de WhatsApp, follow-up de pacientes, confirmação de agendamentos e estratégias de atendimento clínico. Responda em português de forma clara e elegante.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) return NextResponse.json({ reply: text });
        }
      } catch (err) {
        console.warn("OpenAI assistant fallback:", err);
      }
    }

    // 3. Fallback inteligente baseado em templates locais se nenhuma chave estiver configurada
    const lower = prompt.toLowerCase();
    let reply = "";

    if (lower.includes("confirma") || lower.includes("lembrete")) {
      reply =
        "Olá [Nome], tudo bem? Passando para confirmar nossa sessão agendada para amanhã, às [Horário]. O link da sala virtual é: [Link do Google Meet]. Qualquer dúvida ou necessidade de ajuste, fico à disposição!";
    } else if (lower.includes("follow") || lower.includes("retorno") || lower.includes("sumiu")) {
      reply =
        "Olá [Nome], como você está? Lembrei de você hoje e queria saber como tem passado desde nossa última conversa. Ficou alguma dúvida sobre como funciona nosso atendimento? Estou por aqui se quiser dar continuidade!";
    } else if (lower.includes("valor") || lower.includes("proposta") || lower.includes("preço")) {
      reply =
        "Olá [Nome]! Sobre nosso atendimento, o investimento por sessão é de R$ [Valor], com duração de 50 minutos. Temos também a opção do plano mensal com condições especiais. Gostaria de verificar os horários disponíveis para esta semana?";
    } else if (lower.includes("acolhimento") || lower.includes("primeir") || lower.includes("ansiedade")) {
      reply =
        "Olá [Nome], seja muito bem-vindo(a)! Sei que dar esse primeiro passo em busca de acompanhamento exige coragem e cuidado. Nosso espaço é totalmente seguro e confidencial. Como posso te ajudar hoje?";
    } else {
      reply =
        "Entendido! Para essa demanda, sugiro a seguinte mensagem de atendimento humanizado:\n\n'Olá [Nome], tudo bem? Espero que esteja tendo uma excelente semana. Gostaria de saber como você está e se podemos te apoiar com o seu agendamento.'\n\n💡 Dica: Personalize o nome do paciente e o contexto do contato.";
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao processar mensagem do assistente." },
      { status: 500 },
    );
  }
}
