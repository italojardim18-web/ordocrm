import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteForm } from "./invite-form";
import { MemberRowActions, RevokeInvitationButton } from "./member-actions";

export const metadata: Metadata = { title: "Usuários" };

interface MemberRow {
  id: string;
  user_id: string;
  role: "admin" | "assistant";
  is_active: boolean;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface InvitationRow {
  id: string;
  email: string;
  role: "admin" | "assistant";
  status: string;
  expires_at: string;
}

export default async function UsersPage() {
  const context = await requireAdmin();
  const supabase = await createClient();

  const [{ data: members }, { data: invitations }] = await Promise.all([
    supabase
      .from("workspace_members")
      .select("id, user_id, role, is_active")
      .eq("workspace_id", context.workspace.id)
      .order("created_at", { ascending: true })
      .returns<MemberRow[]>(),
    supabase
      .from("workspace_invitations")
      .select("id, email, role, status, expires_at")
      .eq("workspace_id", context.workspace.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .returns<InvitationRow[]>(),
  ]);

  const userIds = (members ?? []).map((m) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"])
    .returns<ProfileRow[]>();

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-primary">Usuários</h1>

      <InviteForm />

      <Card>
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {(members ?? []).map((member) => {
              const profile = profileById.get(member.user_id);
              const isSelf = member.user_id === context.user.id;
              return (
                <li
                  key={member.id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {profile?.full_name || "Sem nome"}
                      {isSelf ? (
                        <span className="text-muted-foreground"> (você)</span>
                      ) : null}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                  <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                    {member.role === "admin" ? "Administrador(a)" : "Assistente"}
                  </Badge>
                  {!member.is_active ? (
                    <Badge variant="outline">Desativado</Badge>
                  ) : null}
                  {!isSelf ? (
                    <MemberRowActions
                      memberId={member.id}
                      role={member.role}
                      isActive={member.is_active}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convites pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          {(invitations ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum convite pendente.
            </p>
          ) : (
            <ul className="divide-y">
              {(invitations ?? []).map((invitation) => (
                <li
                  key={invitation.id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Expira em{" "}
                      {new Date(invitation.expires_at).toLocaleDateString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                  <Badge
                    variant={
                      invitation.role === "admin" ? "default" : "secondary"
                    }
                  >
                    {invitation.role === "admin"
                      ? "Administrador(a)"
                      : "Assistente"}
                  </Badge>
                  <RevokeInvitationButton invitationId={invitation.id} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
