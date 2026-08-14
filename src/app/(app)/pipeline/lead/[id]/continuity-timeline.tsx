import type { AppointmentRow, LeadDetail, TaskRow } from "@/lib/crm/types";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface ContinuityTimelineProps {
  lead: LeadDetail;
  tasks: TaskRow[];
  appointments: AppointmentRow[];
}

export function ContinuityTimeline({
  lead,
  tasks,
  appointments,
}: ContinuityTimelineProps) {
  const nextAppointment = appointments
    .filter((a) => a.status === "scheduled" && new Date(a.starts_at).getTime() >= Date.now())
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())[0];

  const pendingTasks = tasks.filter((t) => !t.completed_at);

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Linha de continuidade
        </span>
        <Badge variant="outline" className="text-[10px] text-muted-foreground">
          Histórico de fluxo
        </Badge>
      </div>

      <div className="relative flex flex-col gap-4 border-l-2 border-primary/20 pl-4 text-xs">
        {/* 1. Entrada / Primeiro Contato */}
        <div className="relative flex flex-col gap-0.5">
          <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-background bg-primary/70" />
          <span className="font-medium text-foreground">Entrada do Lead</span>
          <span className="text-muted-foreground">
            {formatDateTime(lead.created_at)}
          </span>
        </div>

        {/* 2. Última Interação */}
        {lead.last_interaction_at ? (
          <div className="relative flex flex-col gap-0.5">
            <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-background bg-primary/70" />
            <span className="font-medium text-foreground">Última conversa do cliente</span>
            <span className="text-muted-foreground">
              {formatDateTime(lead.last_interaction_at)}
            </span>
          </div>
        ) : null}

        {/* 3. Follow-up / Próximo Retorno */}
        {lead.follow_up_at ? (
          <div className="relative flex flex-col gap-0.5">
            <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-background bg-amber-500" />
            <div className="flex items-center gap-1.5 font-medium text-amber-900 dark:text-amber-300">
              <span>📌 Próximo retorno agendado</span>
            </div>
            <span className="text-muted-foreground">
              {formatDateTime(lead.follow_up_at)}
              {lead.follow_up_note ? ` — "${lead.follow_up_note}"` : ""}
            </span>
          </div>
        ) : (
          <div className="relative flex flex-col gap-0.5">
            <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-background bg-muted-foreground/40" />
            <span className="text-muted-foreground italic">
              Nenhum retorno (follow-up) agendado
            </span>
          </div>
        )}

        {/* 4. Próxima Sessão / Agenda */}
        {nextAppointment ? (
          <div className="relative flex flex-col gap-0.5">
            <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
            <div className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-300">
              <span>📅 {nextAppointment.title}</span>
            </div>
            <span className="text-muted-foreground">
              {formatDateTime(nextAppointment.starts_at)}
            </span>
          </div>
        ) : null}

        {/* 5. Tarefas / Lembretes Pendentes da Equipe */}
        {pendingTasks.length > 0 ? (
          <div className="relative flex flex-col gap-1">
            <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-background bg-indigo-500" />
            <span className="font-medium text-foreground">
              Tarefas da equipe ({pendingTasks.length})
            </span>
            <ul className="flex flex-col gap-1 pl-1 text-[11px] text-muted-foreground">
              {pendingTasks.slice(0, 3).map((t) => (
                <li key={t.id} className="flex items-center gap-1">
                  <span>•</span>
                  <span className="truncate">{t.title}</span>
                  {t.due_at ? (
                    <span className="text-[10px] text-foreground/70">
                      ({formatDateTime(t.due_at)})
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
