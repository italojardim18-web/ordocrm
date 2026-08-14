import type { AppointmentRow, LeadDetail, TaskRow } from "@/lib/crm/types";
import { formatDateTime } from "@/lib/format";

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
    <div className="ordo-card-compact p-5 flex flex-col gap-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            ⚡
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Linha de continuidade
          </span>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
          Fluxo 360°
        </span>
      </div>

      <div className="relative flex flex-col gap-4 border-l-2 border-primary/20 pl-4 text-xs">
        {/* 1. Entrada / Primeiro Contato */}
        <div className="relative flex flex-col gap-0.5">
          <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-card bg-primary" />
          <span className="font-semibold text-foreground">Entrada do Lead</span>
          <span className="text-muted-foreground text-[11px]">
            {formatDateTime(lead.created_at)}
          </span>
        </div>

        {/* 2. Última Interação */}
        {lead.last_interaction_at ? (
          <div className="relative flex flex-col gap-0.5">
            <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-card bg-primary" />
            <span className="font-semibold text-foreground">Última conversa do cliente</span>
            <span className="text-muted-foreground text-[11px]">
              {formatDateTime(lead.last_interaction_at)}
            </span>
          </div>
        ) : null}

        {/* 3. Follow-up / Próximo Retorno */}
        {lead.follow_up_at ? (
          <div className="relative flex flex-col gap-0.5 rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/20 -ml-2">
            <div className="absolute -left-[13px] top-3 size-2.5 rounded-full border-2 border-card bg-amber-500" />
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-xs">
              <span>📌 Retorno agendado</span>
            </div>
            <span className="text-amber-800/90 dark:text-amber-300/80 text-[11px]">
              {formatDateTime(lead.follow_up_at)}
              {lead.follow_up_note ? ` — "${lead.follow_up_note}"` : ""}
            </span>
          </div>
        ) : (
          <div className="relative flex flex-col gap-0.5">
            <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-card bg-muted-foreground/40" />
            <span className="text-muted-foreground italic text-[11px]">
              Nenhum follow-up agendado
            </span>
          </div>
        )}

        {/* 4. Próxima Sessão / Agenda */}
        {nextAppointment ? (
          <div className="relative flex flex-col gap-0.5 rounded-xl bg-emerald-500/10 p-2.5 border border-emerald-500/20 -ml-2">
            <div className="absolute -left-[13px] top-3 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 text-xs">
              <span>📅 {nextAppointment.title}</span>
            </div>
            <span className="text-emerald-800/90 dark:text-emerald-300/80 text-[11px]">
              {formatDateTime(nextAppointment.starts_at)}
            </span>
          </div>
        ) : null}

        {/* 5. Tarefas / Lembretes Pendentes da Equipe */}
        {pendingTasks.length > 0 ? (
          <div className="relative flex flex-col gap-1.5">
            <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-card bg-primary" />
            <span className="font-semibold text-foreground">
              Tarefas da equipe ({pendingTasks.length})
            </span>
            <ul className="flex flex-col gap-1 pl-1 text-[11px] text-muted-foreground">
              {pendingTasks.slice(0, 3).map((t) => (
                <li key={t.id} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-primary/60" />
                  <span className="truncate">{t.title}</span>
                  {t.due_at ? (
                    <span className="text-[10px] opacity-75">
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
