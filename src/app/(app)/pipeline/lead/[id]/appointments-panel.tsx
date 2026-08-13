"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createAppointment,
  setAppointmentStatus,
  type CommercialState,
} from "./commercial-actions";
import type { AppointmentRow } from "@/lib/crm/types";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_LABELS: Record<AppointmentRow["status"], string> = {
  scheduled: "Agendada",
  completed: "Realizada",
  cancelled: "Cancelada",
  no_show: "Não compareceu",
};

export function AppointmentsPanel({
  leadId,
  appointments,
  calendarConnected,
  leadHasEmail,
}: {
  leadId: string;
  appointments: AppointmentRow[];
  calendarConnected: boolean;
  leadHasEmail: boolean;
}) {
  const [force, setForce] = useState(false);
  const [pending, startTransition] = useTransition();

  const [state, formAction, submitting] = useActionState<
    CommercialState,
    FormData
  >(
    async (prev, formData) => {
      const result = await createAppointment(leadId, force, prev, formData);
      if (result.done) {
        toast.success("Sessão agendada.");
        setForce(false);
      }
      return result;
    },
    {},
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamentos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form action={formAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="apptTitle">Título</Label>
            <Input
              id="apptTitle"
              name="title"
              defaultValue="Sessão de alinhamento"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="apptStart">Data e hora</Label>
              <Input
                id="apptStart"
                name="startsAt"
                type="datetime-local"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="apptDuration">Duração (min)</Label>
              <Input
                id="apptDuration"
                name="durationMinutes"
                type="number"
                min={15}
                max={480}
                step={15}
                defaultValue={60}
                required
              />
            </div>
          </div>
          {calendarConnected ? (
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="withMeet" value="1" />
                Criar link do Google Meet
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="inviteLead"
                  value="1"
                  disabled={!leadHasEmail}
                />
                Convidar o lead por e-mail
                {!leadHasEmail ? (
                  <span className="text-muted-foreground">
                    (sem e-mail no cadastro)
                  </span>
                ) : null}
              </label>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Google Calendar não conectado — a sessão fica registrada apenas no
              CRM.
            </p>
          )}

          {state.warning ? (
            <div
              role="alert"
              className="flex flex-col gap-2 rounded-md border border-brass bg-muted p-3 text-sm"
            >
              <p>{state.warning}</p>
              {!state.done ? (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={force}
                    onChange={(event) => setForce(event.target.checked)}
                  />
                  Agendar mesmo assim
                </label>
              ) : null}
            </div>
          ) : null}

          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" size="sm" disabled={submitting} className="self-start">
            {submitting ? "Agendando…" : "Agendar sessão"}
          </Button>
        </form>

        <ul className="flex flex-col gap-2 border-t pt-4">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="flex flex-wrap items-center gap-2 rounded-md bg-muted p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {appointment.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(appointment.starts_at)}
                  {appointment.meet_link ? (
                    <>
                      {" · "}
                      <a
                        href={appointment.meet_link}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        Google Meet
                      </a>
                    </>
                  ) : null}
                </p>
                {appointment.calendar_sync_status === "error" ? (
                  <p className="text-xs text-destructive">
                    Falha ao sincronizar com o calendário.
                  </p>
                ) : null}
              </div>
              <Badge
                variant={
                  appointment.status === "completed"
                    ? "default"
                    : appointment.status === "scheduled"
                      ? "secondary"
                      : "outline"
                }
              >
                {STATUS_LABELS[appointment.status]}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={pending}>
                    Estado
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(
                    [
                      "completed",
                      "no_show",
                      "cancelled",
                      "scheduled",
                    ] as const
                  )
                    .filter((status) => status !== appointment.status)
                    .map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onSelect={() =>
                          startTransition(async () => {
                            const result = await setAppointmentStatus(
                              appointment.id,
                              leadId,
                              status,
                            );
                            if (result.error) toast.error(result.error);
                            else
                              toast.success(
                                `Sessão: ${STATUS_LABELS[status].toLowerCase()}.`,
                              );
                          })
                        }
                      >
                        {STATUS_LABELS[status]}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
          {appointments.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Nenhuma sessão agendada.
            </li>
          ) : null}
        </ul>
      </CardContent>
    </Card>
  );
}
