"use client";

import { useActionState } from "react";
import Link from "next/link";
import { recoverPassword, type RecoverState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RecoverPasswordPage() {
  const [state, formAction, pending] = useActionState<RecoverState, FormData>(
    recoverPassword,
    {},
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
      </CardHeader>
      <CardContent>
        {state.done ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm">
              Se existir uma conta com este e-mail, você receberá um link para
              redefinir a senha. Verifique também a caixa de spam.
            </p>
            <Button asChild variant="outline">
              <Link href="/login">Voltar ao login</Link>
            </Button>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            {state.error ? (
              <p role="alert" className="text-sm text-destructive">
                {state.error}
              </p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending ? "Enviando…" : "Enviar link de recuperação"}
            </Button>
            <Link
              href="/login"
              className="text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Voltar ao login
            </Link>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
