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
}

const SHORTCUTS = [
  { label: "📌 Follow-up acolhedor", prompt: "Escreva uma mensagem acolhedora de follow-up para um paciente que não respondeu há 3 dias." },
  { label: "📅 Confirmar consulta", prompt: "Crie uma mensagem elegante para confirmar a sessão de amanhã com link do Google Meet." },
  { label: "💡 Apresentar valores", prompt: "Como posso apresentar o valor da consulta psicológica de forma empática e valorizada?" },
  { label: "🤝 Reativação de paciente", prompt: "Escreva uma mensagem de reativação para um paciente que interrompeu o tratamento há 2 meses." },
];

export function AppAssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Olá! Sou seu assistente de atendimento e gestão do ORDO CRM. Posso redigir mensagens para WhatsApp, criar follow-ups, roteiros de acolhimento ou tirar dúvidas. Em que posso te apoiar agora?",
      timestamp: "Agora",
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
    toast.success("Mensagem copiada para a área de transferência!");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Janela Flutuante do Chatbot */}
      {isOpen ? (
        <div className="ordo-card mb-3 w-[23rem] sm:w-96 flex h-[32rem] flex-col overflow-hidden bg-card shadow-2xl border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4">
          {/* Header do Chatbot */}
          <div className="bg-primary text-primary-foreground p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground">
                <OrdoSymbol className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xs font-bold tracking-wide">
                  ORDO Assistant IA
                </span>
                <span className="text-[10px] text-primary-foreground/75 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Assistente Operacional
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-primary-foreground/80 hover:bg-primary-foreground/15 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-xs bg-muted/15">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-2xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-xs"
                      : "bg-card border border-border/80 text-foreground rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.sender === "assistant" && m.id !== "welcome" ? (
                    <div className="mt-2.5 pt-2 border-t border-border/40 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(m.text)}
                        className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        📋 Copiar mensagem
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
              <div className="flex items-center gap-2 text-muted-foreground text-xs p-2 italic">
                <span className="size-2 rounded-full bg-primary animate-bounce" />
                <span>Digitando sugestão...</span>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {/* Atalhos Rápidos */}
          <div className="border-t border-border/50 bg-card p-2 overflow-x-auto flex gap-1.5 scrollbar-none">
            {SHORTCUTS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleSend(s.prompt)}
                disabled={loading}
                className="shrink-0 rounded-full bg-secondary/80 hover:bg-secondary px-2.5 py-1 text-[10px] font-semibold text-primary transition-colors border border-border/60"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input de Envio */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-border/80 bg-card p-2.5 flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite o que precisa criar..."
              disabled={loading}
              className="h-9 rounded-xl text-xs"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !input.trim()}
              className="rounded-xl h-9 px-3 text-xs bg-primary text-primary-foreground font-semibold"
            >
              Enviar
            </Button>
          </form>
        </div>
      ) : null}

      {/* Botão Flutuante do Chatbot (Ícone no Canto Inferior Direito) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir assistente de IA"
        className="group relative flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-all duration-200 hover:scale-108 active:scale-95 ring-4 ring-primary/20"
      >
        <span className="text-2xl transition-transform group-hover:rotate-12">
          🤖
        </span>

        {/* Badge Pulsante */}
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
          <span className="size-2 rounded-full bg-white animate-ping" />
        </span>
      </button>
    </div>
  );
}
