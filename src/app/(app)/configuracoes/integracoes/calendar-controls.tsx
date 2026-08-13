"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { chooseCalendar, disconnectGoogle } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function CalendarPicker({
  calendars,
  currentId,
}: {
  calendars: { id: string; summary: string }[];
  currentId: string | null;
}) {
  const [selected, setSelected] = useState(currentId ?? "");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="calendarSelect">Calendário das sessões</Label>
        <select
          id="calendarSelect"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          className="border-input h-9 min-w-56 rounded-md border bg-transparent px-3 text-sm shadow-xs"
        >
          <option value="">Selecione…</option>
          {calendars.map((calendar) => (
            <option key={calendar.id} value={calendar.id}>
              {calendar.summary}
            </option>
          ))}
        </select>
      </div>
      <Button
        size="sm"
        disabled={pending || !selected || selected === currentId}
        onClick={() =>
          startTransition(async () => {
            const name =
              calendars.find((c) => c.id === selected)?.summary ?? selected;
            const result = await chooseCalendar(selected, name);
            if (result.error) toast.error(result.error);
            else toast.success("Calendário definido.");
          })
        }
      >
        Salvar
      </Button>
    </div>
  );
}

export function DisconnectButton() {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        Desconectar
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        Remover conexão e tokens?
      </span>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await disconnectGoogle();
            toast.success("Google Calendar desconectado.");
            setConfirming(false);
          })
        }
      >
        Confirmar
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Cancelar
      </Button>
    </div>
  );
}
