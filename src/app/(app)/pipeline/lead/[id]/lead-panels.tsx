"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addNote,
  addTask,
  logActivity,
  toggleTask,
  type SimpleState,
} from "../../actions";
import type {
  ActivityRow,
  Member,
  Note,
  TaskRow,
} from "@/lib/crm/types";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function memberName(members: Member[], userId: string | null): string {
  if (!userId) return "Sistema";
  return members.find((m) => m.userId === userId)?.fullName ?? "—";
}

export function NotesPanel({
  leadId,
  notes,
  members,
  isAdmin,
}: {
  leadId: string;
  notes: Note[];
  members: Member[];
  isAdmin: boolean;
}) {
  const [state, formAction, pending] = useActionState<SimpleState, FormData>(
    async (prev, formData) => {
      const result = await addNote.bind(null, leadId)(prev, formData);
      if (result.done) toast.success("Nota salva.");
      return result;
    },
    {},
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form action={formAction} className="flex flex-col gap-2">
          <Label htmlFor="noteBody" className="sr-only">
            Nova nota
          </Label>
          <textarea
            id="noteBody"
            name="body"
            rows={3}
            required
            placeholder="Escreva uma nota…"
            className="border-input rounded-md border bg-transparent p-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <select
                name="visibility"
                defaultValue="team"
                aria-label="Visibilidade da nota"
                className="border-input h-8 rounded-md border bg-transparent px-2 text-xs shadow-xs"
              >
                <option value="team">Visível para a equipe</option>
                <option value="admin_only">Somente administradores</option>
              </select>
            ) : null}
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Salvando…" : "Adicionar nota"}
            </Button>
          </div>
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </form>

        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-md bg-muted p-3">
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{memberName(members, note.author_id)}</span>
                <span>·</span>
                <span>{formatDateTime(note.created_at)}</span>
                {note.visibility === "admin_only" ? (
                  <Badge variant="outline" className="text-[10px]">
                    Somente admin
                  </Badge>
                ) : null}
              </div>
              <p className="text-sm whitespace-pre-wrap">{note.body}</p>
            </li>
          ))}
          {notes.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Nenhuma nota ainda.
            </li>
          ) : null}
        </ul>
      </CardContent>
    </Card>
  );
}

export function TasksPanel({
  leadId,
  tasks,
  members,
  currentUserId,
}: {
  leadId: string;
  tasks: TaskRow[];
  members: Member[];
  currentUserId: string;
}) {
  const [state, formAction, pending] = useActionState<SimpleState, FormData>(
    async (prev, formData) => {
      const result = await addTask.bind(null, leadId)(prev, formData);
      if (result.done) toast.success("Tarefa criada.");
      return result;
    },
    {},
  );
  const [toggling, startTransition] = useTransition();

  const [now] = useState(() => Date.now());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarefas e follow-ups</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form action={formAction} className="flex flex-wrap items-end gap-2">
          <div className="flex min-w-48 flex-1 flex-col gap-2">
            <Label htmlFor="taskTitle">Nova tarefa</Label>
            <Input
              id="taskTitle"
              name="title"
              required
              placeholder="Ex.: retomar contato amanhã"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="taskDue">Vencimento</Label>
            <Input id="taskDue" name="dueAt" type="datetime-local" />
          </div>
          {members.length > 1 ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="taskAssignedTo">Atribuir para</Label>
              <select
                id="taskAssignedTo"
                name="assignedTo"
                aria-label="Responsável pela tarefa"
                className="border-input h-9 rounded-md border bg-transparent px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Eu mesmo</option>
                {members
                  .filter((m) => m.userId !== currentUserId)
                  .map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.fullName}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Criando…" : "Adicionar"}
          </Button>
          {state.error ? (
            <p role="alert" className="w-full text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </form>

        <ul className="flex flex-col gap-2">
          {tasks.map((task) => {
            const overdue =
              !task.completed_at &&
              task.due_at &&
              new Date(task.due_at).getTime() < now;
            return (
              <li
                key={task.id}
                className="flex items-start gap-2 rounded-md bg-muted p-3"
              >
                <input
                  type="checkbox"
                  aria-label={`Concluir tarefa: ${task.title}`}
                  checked={Boolean(task.completed_at)}
                  disabled={toggling}
                  onChange={(event) =>
                    startTransition(async () => {
                      await toggleTask(task.id, event.target.checked, leadId);
                    })
                  }
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      task.completed_at
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {task.due_at
                      ? `Vence em ${formatDateTime(task.due_at)}`
                      : "Sem vencimento"}
                    {" · "}
                    {memberName(members, task.assigned_to)}
                    {task.created_by && task.created_by !== task.assigned_to ? (
                      <span className="text-[10px] text-muted-foreground/70">
                        {" (criada por "}{memberName(members, task.created_by)}{")"}                      </span>
                    ) : null}
                  </p>
                </div>
                {overdue ? (
                  <Badge variant="destructive" className="text-[10px]">
                    Vencida
                  </Badge>
                ) : null}
              </li>
            );
          })}
          {tasks.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Nenhuma tarefa registrada.
            </li>
          ) : null}
        </ul>
      </CardContent>
    </Card>
  );
}

const ACTIVITY_LABELS: Record<ActivityRow["type"], string> = {
  call: "Ligação",
  message: "Mensagem",
  note: "Nota",
  task: "Tarefa",
  stage_change: "Mudança de etapa",
  system: "Sistema",
};

export function ActivityPanel({
  leadId,
  activities,
  members,
  createdAt,
}: {
  leadId: string;
  activities: ActivityRow[];
  members: Member[];
  createdAt: string;
}) {
  const [state, formAction, pending] = useActionState<SimpleState, FormData>(
    async (prev, formData) => {
      const result = await logActivity.bind(null, leadId)(prev, formData);
      if (result.done) toast.success("Atividade registrada.");
      return result;
    },
    {},
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form action={formAction} className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="activityType">Registrar</Label>
            <select
              id="activityType"
              name="type"
              defaultValue="call"
              className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
            >
              <option value="call">Ligação</option>
              <option value="message">Mensagem</option>
            </select>
          </div>
          <div className="flex min-w-48 flex-1 flex-col gap-2">
            <Label htmlFor="activityContent">Descrição</Label>
            <Input
              id="activityContent"
              name="content"
              required
              placeholder="Ex.: liguei, combinamos retorno na sexta"
            />
          </div>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Salvando…" : "Registrar"}
          </Button>
          {state.error ? (
            <p role="alert" className="w-full text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </form>

        <ol className="flex flex-col gap-3">
          {activities.map((activity) => (
            <li key={activity.id} className="flex gap-3">
              <div
                aria-hidden
                className="mt-1.5 size-2 shrink-0 rounded-full bg-positive"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">
                    {ACTIVITY_LABELS[activity.type]}
                  </span>
                  {activity.content ? ` — ${activity.content}` : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  {memberName(members, activity.actor_id)} ·{" "}
                  {formatDateTime(activity.created_at)}
                </p>
              </div>
            </li>
          ))}
          <li className="flex gap-3">
            <div
              aria-hidden
              className="mt-1.5 size-2 shrink-0 rounded-full bg-brass"
            />
            <div>
              <p className="text-sm font-medium">Lead criado</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(createdAt)}
              </p>
            </div>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
}
