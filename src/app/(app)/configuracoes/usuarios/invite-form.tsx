"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { createInvitation, type InviteState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteForm() {
  const [state, formAction, pending] = useActionState<InviteState, FormData>(
    createInvitation,
    {},
  );
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!state.inviteUrl) return;
    await navigator.clipboard.writeText(state.inviteUrl);
    setCopied(true);
    toast.success("Link do convite copiado.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convidar usuário</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-56 flex-1 flex-col gap-2">
            <Label htmlFor="inviteEmail">E-mail</Label>
            <Input
              id="inviteEmail"
              name="email"
              type="email"
              placeholder="pessoa@exemplo.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="inviteRole">Papel</Label>
            <select
              id="inviteRole"
              name="role"
              defaultValue="assistant"
              className="border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm shadow-xs focus-visible:ring-[3px]"
            >
              <option value="assistant">Assistente</option>
              <option value="admin">Administrador(a)</option>
            </select>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Gerando…" : "Gerar convite"}
          </Button>
        </form>

        {state.error ? (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        {state.inviteUrl ? (
          <div className="flex flex-col gap-2 rounded-md border bg-muted p-3">
            <p className="text-sm">
              Convite criado para <strong>{state.invitedEmail}</strong>. Envie o
              link abaixo — ele é exibido apenas uma vez e expira em 7 dias.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded bg-card px-2 py-1 text-xs">
                {state.inviteUrl}
              </code>
              <Button type="button" variant="outline" size="sm" onClick={copyLink}>
                {copied ? "Copiado" : "Copiar link"}
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
