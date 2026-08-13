import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { acceptAsCurrentUser } from "./actions";
import { InviteSignupForm } from "./signup-form";

interface InvitationInfo {
  workspace_name: string;
  email: string;
  role: "admin" | "assistant";
  status: "pending" | "accepted" | "revoked" | "expired";
  expires_at: string;
}

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error: acceptFailed } = await searchParams;

  const supabase = await createClient();

  const [{ data }, userResult] = await Promise.all([
    supabase.rpc("get_invitation_public", { raw_token: token }),
    supabase.auth.getUser(),
  ]);

  const invitation = (data as InvitationInfo[] | null)?.[0];
  const user = userResult.data.user;

  const invalid =
    !invitation ||
    invitation.status !== "pending" ||
    new Date(invitation.expires_at) < new Date();

  if (invalid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convite indisponível</CardTitle>
          <CardDescription>
            Este convite não existe, já foi utilizado ou expirou. Peça um novo
            convite ao administrador do workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Ir para o login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const roleLabel =
    invitation.role === "admin" ? "administrador(a)" : "assistente";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convite para {invitation.workspace_name}</CardTitle>
        <CardDescription>
          Você foi convidado(a) como {roleLabel}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {acceptFailed ? (
          <p role="alert" className="text-sm text-destructive">
            Não foi possível aceitar o convite. Tente novamente.
          </p>
        ) : null}
        {user ? (
          user.email?.toLowerCase() === invitation.email.toLowerCase() ? (
            <form action={acceptAsCurrentUser.bind(null, token)}>
              <Button type="submit" className="w-full">
                Aceitar convite
              </Button>
            </form>
          ) : (
            <p className="text-sm">
              Este convite foi enviado para <strong>{invitation.email}</strong>,
              mas você está conectado(a) como <strong>{user.email}</strong>.
              Saia da conta atual para aceitar o convite.
            </p>
          )
        ) : (
          <InviteSignupForm token={token} email={invitation.email} />
        )}
      </CardContent>
    </Card>
  );
}
