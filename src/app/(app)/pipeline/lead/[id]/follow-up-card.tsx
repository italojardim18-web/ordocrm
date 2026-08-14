"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setLeadFollowUp } from "../../actions";
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
        toast.success("Follow-up atualizado com sucesso.");
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
    <Card className={isOverdue ? "border-destructive/50 bg-destructive/5" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Próximo retorno (Follow-up)</CardTitle>
          {initialFollowUpAt ? (
            <span className="text-xs font-medium text-muted-foreground">
              {isOverdue ? (
                <span className="text-destructive font-semibold">Atrasado</span>
              ) : (
                `Agendado: ${formatDateTime(initialFollowUpAt)}`
              )}
            </span>
          ) : null}
        </div>
        <CardDescription>
          Data e hora em que este lead precisa ser retomado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="flex flex-col gap-3">
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
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="follow_up_note" className="text-xs font-medium text-muted-foreground">
              Objetivo do retorno
            </label>
            <textarea
              id="follow_up_note"
              placeholder="Ex: Verificar se leu a proposta e tirar dúvidas sobre horários"
              value={note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              disabled={isPending}
              rows={2}
              className="border-input w-full rounded-md border bg-transparent p-2 text-xs shadow-xs focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            {initialFollowUpAt ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={isPending}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Remover retorno
              </Button>
            ) : <span />}
            <Button type="submit" size="sm" disabled={isPending} className="text-xs">
              {isPending ? "Salvando..." : "Salvar retorno"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
