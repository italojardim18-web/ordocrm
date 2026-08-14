"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { toggleTask } from "../pipeline/actions";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function TeamTasksCard({ tasks, currentUserId }: TeamTasksCardProps) {
  const [pending, startTransition] = useTransition();

  function handleComplete(taskId: string) {
    startTransition(async () => {
      const res = await toggleTask(taskId, true);
      if (res === undefined) toast.success("Lembrete/Tarefa concluída!");
      else toast.error("Não foi possível concluir.");
    });
  }

  return (
    <Card className="border-indigo-500/20 bg-indigo-500/[0.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-1.5 text-indigo-950 dark:text-indigo-200">
            <span>📌</span> Meus Lembretes e Tarefas da Equipe
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {tasks.length} pendente(s)
          </Badge>
        </div>
        <CardDescription>
          Recados e tarefas atribuídos diretamente ao seu perfil pela equipe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2.5">
          {tasks.map((task) => {
            const isOverdue =
              task.due_at && new Date(task.due_at).getTime() < Date.now();
            return (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card p-2.5 shadow-2xs"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-foreground truncate">
                      {task.title}
                    </span>
                    {isOverdue ? (
                      <span className="rounded bg-destructive/10 px-1.5 py-0.2 text-[9px] font-semibold text-destructive">
                        Atrasado
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    {task.leads ? (
                      <Link
                        href={`/pipeline/lead/${task.lead_id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        Lead: {task.leads.name}
                      </Link>
                    ) : null}
                    {task.due_at ? (
                      <span>Vencimento: {formatDateTime(task.due_at)}</span>
                    ) : null}
                  </div>
                </div>

                <Button
                  size="xs"
                  variant="outline"
                  disabled={pending}
                  onClick={() => handleComplete(task.id)}
                  className="shrink-0 text-xs hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
                >
                  ✓ Concluir
                </Button>
              </li>
            );
          })}

          {tasks.length === 0 ? (
            <li className="py-4 text-center text-xs text-muted-foreground italic">
              Nenhum lembrete ou tarefa atribuída a você no momento.
            </li>
          ) : null}
        </ul>
      </CardContent>
    </Card>
  );
}
