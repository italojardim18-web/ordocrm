"use client";

import { useActionState, useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import {
  scheduleMessage,
  sendMessage,
  suggestRepliesAction,
  type ScheduleState,
  type SendState,
  type SuggestedReply,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

/** Sugere um horário padrão: amanhã de manhã, hora cheia. */
function amanhaDeManha(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Fora de 8h–21h a mensagem chega em horário incomum para contato comercial. */
function horarioIncomum(valor: string): boolean {
  if (!valor) return false;
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return false;
  const h = d.getHours();
  return h < 8 || h >= 21;
}

export function Composer({
  conversationId,
  withinWindow,
  channelConnected,
}: {
  conversationId: string;
  withinWindow: boolean;
  channelConnected: boolean;
}) {
  const [agendando, setAgendando] = useState(false);
  const [quando, setQuando] = useState(amanhaDeManha);
  const [messageText, setMessageText] = useState("");

  // Sugestões de IA
  const [isSuggesting, startSuggestTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<SuggestedReply[] | null>(null);
  const [aiModel, setAiModel] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [state, formAction, pending] = useActionState<SendState, FormData>(
    async (prev, formData) => {
      const result = await sendMessage(conversationId, prev, formData);
      if (result.done) {
        toast.success("Mensagem enfileirada para envio.");
        setMessageText("");
        setShowSuggestions(false);
      }
      return result;
    },
    {},
  );

  const [agState, agAction, agPending] = useActionState<ScheduleState, FormData>(
    async (prev, formData) => {
      const result = await scheduleMessage(conversationId, prev, formData);
      if (result.done) {
        toast.success("Mensagem agendada.");
        setAgendando(false);
        setMessageText("");
        setShowSuggestions(false);
      }
      return result;
    },
    {},
  );

  const handleFetchSuggestions = () => {
    setShowSuggestions(true);
    startSuggestTransition(async () => {
      const res = await suggestRepliesAction(conversationId);
      if (res.error) {
        toast.error(res.error);
      } else if (res.suggestions) {
        setSuggestions(res.suggestions);
        setAiModel(res.model || "Ollama Local");
      }
    });
  };

  const handleSelectSuggestion = (text: string) => {
    setMessageText(text);
    if (textareaRef.current) {
      textareaRef.current.value = text;
      textareaRef.current.focus();
    }
    toast.success("Sugestão aplicada no campo de mensagem!");
  };

  return (
    <form
      action={agendando ? agAction : formAction}
      className="flex flex-col gap-2.5 border-t p-4 bg-card/60 backdrop-blur-xs"
    >
      {/* Barra de Inteligência Artificial & Sugestões Rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFetchSuggestions}
            disabled={isSuggesting}
            className="h-7 text-xs font-semibold bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary flex items-center gap-1.5 shadow-2xs"
          >
            <span>✨</span>
            <span>{isSuggesting ? "Analisando contexto com IA..." : "Sugerir Respostas com IA"}</span>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
              Ollama
            </Badge>
          </Button>

          {showSuggestions && suggestions && (
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              ✕ Fechar sugestões
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAgendando(!agendando)}
          className="text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          {agendando ? "← Enviar agora" : "⏱ Agendar envio"}
        </button>
      </div>

      {/* Painel de Opções Sugeridas pela IA */}
      {showSuggestions && (
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-background p-3 flex flex-col gap-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-primary flex items-center gap-1.5">
              <span>🧠</span> Sugestões para condução do atendimento:
            </span>
            <span className="text-muted-foreground text-[10px]">
              {aiModel || "Ollama Local (qwen2.5:7b)"}
            </span>
          </div>

          {isSuggesting ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 italic">
              <span className="size-2 rounded-full bg-primary animate-ping" />
              <span>Lendo histórico e formulando melhores abordagens...</span>
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {suggestions.map((sug) => (
                <button
                  key={sug.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(sug.text)}
                  className="group flex flex-col text-left rounded-xl border border-stone-200 dark:border-stone-800 bg-card p-2.5 hover:border-primary hover:shadow-xs transition-all gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary">
                      {sug.badge}
                    </span>
                    <span className="text-[9px] text-muted-foreground group-hover:text-primary font-semibold">
                      Aplicar ↵
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300 line-clamp-3 leading-snug">
                    {sug.text}
                  </p>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}

      <Label htmlFor="messageBody" className="sr-only">
        Mensagem
      </Label>
      <textarea
        ref={textareaRef}
        id="messageBody"
        name="body"
        rows={2}
        required
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder={
          agendando
            ? "Escreva a mensagem que será enviada na data escolhida…"
            : "Escreva sua resposta… (Enter envia, Shift+Enter quebra linha)"
        }
        onKeyDown={(event) => {
          // No modo agendamento o Enter não envia: falta escolher o horário.
          if (!agendando && event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        className="border-input rounded-xl border bg-background p-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
      />

      {agendando ? (
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="scheduledFor" className="text-xs">
              Enviar em
            </Label>
            <Input
              id="scheduledFor"
              name="scheduledFor"
              type="datetime-local"
              required
              value={quando}
              onChange={(e) => setQuando(e.target.value)}
              className="w-56"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Sai sozinha no horário escolhido, desde que o ORDO esteja ligado. Se
            atrasar mais de 4 horas, não é enviada — chegaria fora de contexto.
          </p>
          {horarioIncomum(quando) ? (
            <p className="w-full text-xs text-brass-foreground">
              Esse horário está fora do expediente (8h–21h). A mensagem vai
              chegar assim mesmo — confirme se é isso que você quer.
            </p>
          ) : null}
        </div>
      ) : null}

      {!withinWindow && !agendando ? (
        <p className="text-xs text-brass-foreground">
          <strong>Fora da janela de 24 horas.</strong> A plataforma só aceita
          mensagem de texto livre até 24h após a última mensagem do contato;
          depois disso é preciso usar um template aprovado. A mensagem ficará na
          fila e pode ser recusada pelo canal.
        </p>
      ) : null}

      {!channelConnected ? (
        <p className="text-xs text-muted-foreground">
          Canal ainda não conectado — a mensagem fica registrada no CRM e na
          fila de saída, sem envio real.
        </p>
      ) : null}

      {/* Botões de Ação */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-muted-foreground">
          Pressione <strong>Enter</strong> para enviar
        </span>

        <Button
          type="submit"
          disabled={pending || agPending || !messageText.trim()}
          className="bg-[#521D2A] text-white hover:bg-[#6b2737] font-semibold text-xs px-5 h-8 rounded-xl shadow-xs"
        >
          {pending || agPending ? "Enviando..." : agendando ? "Agendar Mensagem" : "Enviar Mensagem ➔"}
        </Button>
      </div>
    </form>
  );
}
