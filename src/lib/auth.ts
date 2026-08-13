import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MemberRole = "admin" | "assistant";

export interface SessionContext {
  user: { id: string; email: string };
  profile: { fullName: string | null };
  membership: { id: string; role: MemberRole };
  workspace: {
    id: string;
    name: string;
    timezone: string;
    displayName: string;
    logoUrl: string | null;
  };
}

interface MembershipRow {
  id: string;
  role: MemberRole;
  workspaces: {
    id: string;
    name: string;
    timezone: string;
    workspace_branding: {
      display_name: string | null;
      logo_url: string | null;
    } | null;
  };
}

/**
 * Resolve usuário autenticado + workspace ativo (primeiro vínculo ativo).
 * Retorna null quando o usuário não pertence a nenhum workspace.
 */
export async function getSessionContext(): Promise<SessionContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: memberships, error: membershipError }, { data: profile }] =
    await Promise.all([
    supabase
      .from("workspace_members")
      .select(
        "id, role, workspaces (id, name, timezone, workspace_branding (display_name, logo_url))",
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .returns<MembershipRow[]>(),
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
  ]);

  if (membershipError) {
    // Falha transitória de rede/API não é "sem acesso": propaga para o
    // error boundary em vez de mostrar um estado enganoso.
    console.error("[auth] membership query failed:", membershipError.code);
    throw new Error("Não foi possível carregar o workspace. Recarregue a página.");
  }

  const membership = memberships?.[0];
  if (!membership?.workspaces) {
    return null;
  }

  const ws = membership.workspaces;

  return {
    user: { id: user.id, email: user.email ?? "" },
    profile: { fullName: profile?.full_name ?? null },
    membership: { id: membership.id, role: membership.role },
    workspace: {
      id: ws.id,
      name: ws.name,
      timezone: ws.timezone,
      displayName: ws.workspace_branding?.display_name || ws.name,
      logoUrl: ws.workspace_branding?.logo_url ?? null,
    },
  };
}

/** Igual a getSessionContext, mas exige papel de administrador. */
export async function requireAdmin(): Promise<SessionContext> {
  const context = await getSessionContext();
  if (!context) redirect("/sem-acesso");
  if (context.membership.role !== "admin") redirect("/pipeline");
  return context;
}
