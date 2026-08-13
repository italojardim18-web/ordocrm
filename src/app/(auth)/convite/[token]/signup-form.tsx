"use client";

import { useActionState } from "react";
import { signUpAndAccept, type AcceptInviteState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteSignupForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const action = signUpAndAccept.bind(null, token, email);
  const [state, formAction, pending] = useActionState<
    AcceptInviteState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="inviteEmail">E-mail</Label>
        <Input id="inviteEmail" value={email} disabled aria-readonly />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          minLength={2}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Criando conta…" : "Criar conta e entrar"}
      </Button>
    </form>
  );
}
