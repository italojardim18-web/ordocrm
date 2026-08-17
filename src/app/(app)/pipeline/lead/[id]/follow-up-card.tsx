"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setLeadFollowUp, completeLeadFollowUp } from "../../actions";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface FollowUpCardProps {
  leadId: string;
  initialFollowUpAt: string | null;
  initialNote: string | null;
}

export function FollowUpCard({
  leadId,
  initialFollowUpAt,
  initialNote,
}: FollowUpCardProps) {
  function toLocalDatetimeString(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  }

  const [followUpAt, setFollowUpAt] = useState<string>(
    initialFollowUpAt ? toLocalDatetimeString(new Date(initialFollowUpAt)) : "",
  );
  const [note, setNote] = useState<string>(initialNote ?? "");
  const [isPending, startTransition] = useTransition();

  function applyPreset(daysToAdd: number, hours: number, minutes: number) {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    d.setHours(hours, minutes, 0, 0);
    const str = toLocalDatetimeString(d);
    setFollowUpAt(str);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const iso = followUpAt ? new Date(followUpAt).toISOString() : null;
      const res = await setLeadFollowUp(leadId, iso, note);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Follow-up agendado com sucesso.");
      }
    });
  }

  function handleComplete(outcome: "completed" | "not_completed") {
    startTransition(async () => {
      const res = await completeLeadFollowUp(leadId, outcome, initialNote || note);
      if (res.error) {
        toast.error(res.error);
      } else {
        setFollowUpAt("");
        setNote("");
        if (outcome === "completed") {
          toast.success("✅ Follow-up registrado como CONCLUÍDO no histórico.");
        } else {
          toast.warning("⚠️ Follow-up registrado como NÃO REALIZADO no histórico.");
        }
      }
    });
  }

  function handleClear() {
    startTransition(async () => {
      setFollowUpAt("");
      setNote("");
      const res = await setLeadFollowUp(leadId, null, null);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Follow-up removido.");
      }
    });
  }

  const isOverdue =
    initialFollowUpAt && new Date(initialFollowUpAt).getTime() < Date.now();

  return (
    <Card className={isOverdue ? "border-amber-500/40 bg-amber-500/5 dark:border-amber-500/30" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span>⏰</span>
            <span>Retorno Comercial (Follow-up)</span>
          </CardTitle>
          {initialFollowUpAt ? (
            <span className="text-xs font-medium">
              {isOverdue ? (
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  ⚠️ Atrasado
                </span>
              ) : (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Agendado
                </span>
              )}
            </span>
          ) : null}
        </div>
        <CardDescription>
          Controle de retornos com registro no histórico de atividades do lead.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Painel do Follow-up Atual com Botões de Conclusão */}
        {initialFollowUpAt && (
          <div className="rounded-xl border border-primary/20 bg-muted/40 p-3 flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Retorno Pendente
                </span>
                <p className="text-sm font-semibold text-foreground">
                  📅 {formatDateTime(initialFollowUpAt)}
                </p>
                {initialNote ? (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    🎯 {initialNote}
                  </p>
                ) : (
                  <p className="text-xs italic text-muted-foreground mt-0.5">
                    Sem anotação de objetivo.
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleClear}
                disabled={isPending}
                className="text-[11px] text-muted-foreground hover:text-destructive h-7 px-2"
                title="Excluir retorno sem salvar no histórico"
              >
                Excluir
              </Button>
            </div>

            {/* Ações de Conclusão */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
              <Button
                type="button"
                size="sm"
                onClick={() => handleComplete("completed")}
                disabled={isPending}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <span>✅</span>
                <span>Concluído</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleComplete("not_completed")}
                disabled={isPending}
                className="flex-1 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 text-xs font-medium shadow-xs"
              >
                <span>⚠️</span>
                <span>Não Realizado</span>
              </Button>
            </div>
          </div>
        )}

        {/* Formulário para Agendar Próximo Retorno */}
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {initialFollowUpAt ? "Alterar ou Reagendar Retorno" : "Agendar Próximo Retorno"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => applyPreset(0, 16, 0)}
              disabled={isPending}
            >
              Hoje 16h
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => applyPreset(1, 9, 0)}
              disabled={isPending}
            >
              Amanhã 9h
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => applyPreset(3, 10, 0)}
              disabled={isPending}
            >
              Em 3 dias
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                const d = new Date();
                const day = d.getDay();
                const diff = (8 - day) % 7 || 7; // Próxima segunda
                applyPreset(diff, 9, 0);
              }}
              disabled={isPending}
            >
              Próxima segunda
            </Button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="follow_up_datetime" className="text-xs font-medium text-muted-foreground">
              Data e horário
            </label>
            <Input
              id="follow_up_datetime"
              type="datetime-local"
              value={followUpAt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFollowUpAt(e.target.value)}
              disabled={isPending}
              className="text-xs"
              required={Boolean(note && !followUpAt)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="follow_up_note" className="text-xs font-medium text-muted-foreground">
              Objetivo do retorno
            </label>
            <textarea
              id="follow_up_note"
              placeholder="Ex: Ligar para verificar se conseguiu falar com o cônjuge e fechar horários"
              value={note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              disabled={isPending}
              rows={2}
              className="border-input w-full rounded-md border bg-transparent p-2 text-xs shadow-xs focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !followUpAt}
              className="text-xs font-semibold"
            >
              {isPending ? "Salvando..." : initialFollowUpAt ? "Atualizar Retorno" : "Salvar Retorno"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
