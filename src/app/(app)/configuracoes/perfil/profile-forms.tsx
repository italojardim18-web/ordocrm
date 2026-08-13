"use client";

import { useActionState } from "react";
import {
  changePassword,
  updateProfile,
  type ProfileState,
} from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForms({
  fullName,
  email,
  role,
}: {
  fullName: string;
  email: string;
  role: "admin" | "assistant";
}) {
  const [profileState, profileAction, profilePending] = useActionState<
    ProfileState,
    FormData
  >(updateProfile, {});
  const [passwordState, passwordAction, passwordPending] = useActionState<
    ProfileState,
    FormData
  >(changePassword, {});

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={profileAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={email} disabled aria-readonly />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Papel</Label>
              <div>
                <Badge variant="secondary">
                  {role === "admin" ? "Administrador(a)" : "Assistente"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={fullName}
                autoComplete="name"
                minLength={2}
                required
              />
            </div>
            {profileState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {profileState.error}
              </p>
            ) : null}
            {profileState.done ? (
              <p role="status" className="text-sm text-positive">
                Perfil atualizado.
              </p>
            ) : null}
            <Button type="submit" disabled={profilePending} className="self-start">
              {profilePending ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={passwordAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            {passwordState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {passwordState.error}
              </p>
            ) : null}
            {passwordState.done ? (
              <p role="status" className="text-sm text-positive">
                Senha alterada.
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={passwordPending}
              className="self-start"
            >
              {passwordPending ? "Salvando…" : "Alterar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
