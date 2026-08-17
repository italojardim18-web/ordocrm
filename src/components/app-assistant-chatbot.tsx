"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrdoSymbol } from "@/components/ordo-mark";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  model?: string;
}

const CATEGORY_SHORTCUTS = [
  {
    icon: "🛡️",
    label: "Quebra de Objeções",
    prompt: "O paciente achou o valor da sessão caro e perguntou se aceitamos convênio. Como a secretária/terapeuta deve responder para quebrar essa objeção com elegância e converter o atendimento?",
  },
  {
    icon: "💬",
    label: "Follow-up Paciente Sumido",
    prompt: "Escreva uma mensagem acolhedora e elegante de follow-up para um paciente que não respondeu há 3 dias após enviarmos os valores.",
  },
  {
    icon: "🧠",
    label: "Casos Clínicos & DSM-5",
    prompt: "Como fortalecer a aliança terapêutica e manejar a resistência inicial em pacientes com alta ansiedade?",
  },
  {
    icon: "💰",
    label: "Finanças & Hora Clínica",
    prompt: "Como calcular o valor ideal da minha hora clínica e estruturar pacotes mensais sustentáveis para evitar faltas?",
  },
  {
    icon: "📄",
    label: "Documentos CFP",
    prompt: "Quais os requisitos éticos e a estrutura obrigatória para emitir um Relatório Psicológico (Resolução CFP 06/2019)?",
  },
  {
    icon: "🚨",
    label: "Manejo de Crises",
    prompt: "Qual é o protocolo ético de quebra de sigilo e suporte em caso de ideação suicida ou risco iminente?",
  },
];

export function AppAssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Olá! Sou seu **Especialista em Vendas Consultivas, Quebra de Objeções & Prática Clínica ORDO** 🌿\n\nEstou conectado à sua **IA Local (Ollama)** e treinado em metodologias de negociação ética (NEPQ, SPIN Selling) para te apoiar em:\n• 🛡️ **Quebra de Objeções (Preço, Convênio, Online vs Presencial, 'Vou Pensar')**\n• 💬 **Condução de Atendimento & Scripts de WhatsApp**\n• 🧠 **Manejo Clínico & Hipóteses DSM-5**\n• 💰 **Precificação, Honorários & Finanças**\n• 📄 **Documentos CFP (Laudos/Relatórios/Atestados)**\n\nQual situação ou dúvida você gostaria de conduzir agora?",
      timestamp: "Agora",
      model: "Ollama Local (qwen2.5:7b)",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSend(textToSend?: string) {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na resposta da IA.");

      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: data.reply || "Desculpe, não consegui processar a resposta.",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        model: data.model || "Ollama Local",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao consultar o assistente.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Conteúdo copiado para a área de transferência!");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Janela Flutuante do Chatbot */}
      {isOpen ? (
        <div className="ordo-card mb-3 w-[24rem] sm:w-[26rem] flex h-[36rem] flex-col overflow-hidden bg-card shadow-2xl border-2 border-[#521D2A]/30 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header do Chatbot */}
          <div className="bg-[#291015] text-white p-4 flex items-center justify-between border-b border-[#521D2A] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-2xl bg-[#521D2A] text-[#B2966F] border border-[#B2966F]/40 shadow-inner">
                <OrdoSymbol className="size-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-xs font-bold tracking-wide text-white">
                    ORDO Assistant IA
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    IA Local Ativa
                  </span>
                </div>
                <span className="text-[10px] text-[#B2966F]">
                  Especialista Clínico, Financeiro & Gestão
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-7 items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors text-xs"
            >
              ✕
            </button>
          </div>

          {/* Atalhos Rápidos por Categoria */}
          <div className="bg-[#1E0B10]/40 border-b border-border/40 p-2 overflow-x-auto flex gap-1.5 kanban-scroll shrink-0">
            {CATEGORY_SHORTCUTS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(s.prompt)}
                disabled={loading}
                className="flex items-center gap-1 whitespace-nowrap rounded-xl bg-card border border-border/70 px-2.5 py-1 text-[10px] font-medium text-stone-700 dark:text-stone-300 hover:bg-[#521D2A] hover:text-white transition-all shrink-0 shadow-2xs"
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 text-xs bg-muted/10">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 shadow-2xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#521D2A] text-white rounded-br-xs"
                      : "bg-card border border-stone-200/80 dark:border-stone-800 text-foreground rounded-bl-xs"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {m.text}
                  </div>

                  {m.sender === "assistant" && m.id !== "welcome" ? (
                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground italic text-[9px]">
                        {m.model || "Ollama Local"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(m.text)}
                        className="font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        📋 Copiar resposta
                      </button>
                    </div>
                  ) : null}
                </div>
                <span className="text-[9px] text-muted-foreground/75 mt-0.5 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-xs p-3 italic bg-card rounded-2xl border border-border/50 max-w-[80%]">
                <span className="size-2 rounded-full bg-[#521D2A] animate-bounce" />
                <span>Consultando especialista clínico e financeiro...</span>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {/* Input de Envio */}
          <div className="border-t border-border/60 p-3 bg-card flex gap-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Tire dúvidas sobre casos clínicos, finanças, CFP..."
              disabled={loading}
              className="text-xs h-10 rounded-xl bg-background border-stone-300 dark:border-stone-700"
            />
            <Button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="h-10 px-3.5 bg-[#521D2A] text-white hover:bg-[#6b2737] rounded-xl shrink-0 font-semibold"
            >
              Enviar
            </Button>
          </div>
        </div>
      ) : null}

      {/* Botão Flutuante de Abertura */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex size-13 items-center justify-center rounded-2xl bg-[#521D2A] text-white shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-[#6b2737] border-2 border-[#B2966F]/50 ring-4 ring-black/10 relative"
        title="Abrir ORDO Assistant IA"
      >
        <OrdoSymbol className="size-7 text-[#B2966F] transition-transform group-hover:scale-110" />

        {/* Ponto indicador de IA Online */}
        <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
      </button>
    </div>
  );
}
