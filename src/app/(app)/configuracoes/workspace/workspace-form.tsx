"use client";

import { useActionState } from "react";
import { updateWorkspace, type WorkspaceState } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WorkspaceForm({
  name,
  timezone,
  displayName,
}: {
  name: string;
  timezone: string;
  displayName: string;
}) {
  const [state, formAction, pending] = useActionState<WorkspaceState, FormData>(
    updateWorkspace,
    {},
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
        <CardDescription>
          O nome de exibição aparece na navegação e pode ser diferente do nome
          legal do workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome do workspace</Label>
            <Input id="name" name="name" defaultValue={name} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Nome de exibição (marca)</Label>
            <Input
              id="displayName"
              name="displayName"
              defaultValue={displayName}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="timezone">Fuso horário</Label>
            <Input
              id="timezone"
              name="timezone"
              defaultValue={timezone}
              placeholder="America/Campo_Grande"
              required
            />
            <p className="text-xs text-muted-foreground">
              Formato IANA, ex.: America/Campo_Grande, America/Sao_Paulo.
            </p>
          </div>
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          {state.done ? (
            <p role="status" className="text-sm text-positive">
              Workspace atualizado.
            </p>
          ) : null}
          <Button type="submit" disabled={pending} className="self-start">
            {pending ? "Salvando…" : "Salvar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
