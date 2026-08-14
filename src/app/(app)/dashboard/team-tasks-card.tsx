"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { toggleTask } from "../pipeline/actions";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";

export interface AssignedTaskItem {
  id: string;
  title: string;
  due_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  lead_id: string;
  leads: { id: string; name: string } | null;
}

interface TeamTasksCardProps {
  tasks: AssignedTaskItem[];
  currentUserId: string;
}

export function TeamTasksCard({ tasks }: TeamTasksCardProps) {
  const [pending, startTransition] = useTransition();

  function handleComplete(taskId: string) {
    startTransition(async () => {
      const res = await toggleTask(taskId, true);
      if (res === undefined) toast.success("Lembrete/Tarefa concluída!");
      else toast.error("Não foi possível concluir.");
    });
  }

  if (tasks.length === 0) return null;

  return (
    <div className="ordo-card p-6 flex flex-col gap-4 border-primary/20 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
            📌
          </span>
          <h3 className="font-heading text-lg font-bold text-primary tracking-tight">
            Lembretes e tarefas da equipe
          </h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
          {tasks.length} pendente(s)
        </span>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Recados e tarefas atribuídos diretamente ao seu perfil pela equipe (Secretária ⟷ Dr. Ítalo).
      </p>

      <ul className="flex flex-col gap-2.5 pt-1">
        {tasks.map((task) => {
          const isOverdue =
            task.due_at && new Date(task.due_at).getTime() < Date.now();
          return (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-xs transition-all hover:bg-muted/30"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs text-foreground truncate">
                    {task.title}
                  </span>
                  {isOverdue ? (
                    <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                      Atrasado
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  {task.leads ? (
                    <Link
                      href={`/pipeline/lead/${task.lead_id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      👤 Lead: {task.leads.name}
                    </Link>
                  ) : null}
                  {task.due_at ? (
                    <span>· Vencimento: {formatDateTime(task.due_at)}</span>
                  ) : null}
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => handleComplete(task.id)}
                className="rounded-full px-3 text-xs text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Concluir ✓
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
