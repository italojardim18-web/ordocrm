"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { buildInviteUrl, inviteSchema } from "@/lib/validation";

export interface InviteState {
  error?: string;
  inviteUrl?: string;
  invitedEmail?: string;
}

export async function createInvitation(
  _prevState: InviteState,
  formData: FormData,
): Promise<InviteState> {
  const context = await requireAdmin();

  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_invitation", {
    ws_id: context.workspace.id,
    invitee_email: parsed.data.email,
    invitee_role: parsed.data.role,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Este e-mail já pertence a um membro do workspace." };
    }
    return { error: "Não foi possível criar o convite." };
  }

  const row = (data as { invitation_id: string; token: string }[] | null)?.[0];
  if (!row) {
    return { error: "Não foi possível criar o convite." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  revalidatePath("/configuracoes/usuarios");
  return {
    inviteUrl: buildInviteUrl(siteUrl, row.token),
    invitedEmail: parsed.data.email,
  };
}

export async function revokeInvitation(invitationId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.rpc("revoke_invitation", { invitation_id: invitationId });
  revalidatePath("/configuracoes/usuarios");
}

export async function changeMemberRole(
  memberId: string,
  newRole: "admin" | "assistant",
) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.rpc("change_member_role", {
    member_id: memberId,
    new_role: newRole,
  });
  revalidatePath("/configuracoes/usuarios");
  if (error) throw new Error("Não foi possível alterar o papel.");
}

export async function setMemberActive(memberId: string, active: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_member_active", {
    member_id: memberId,
    active,
  });
  revalidatePath("/configuracoes/usuarios");
  if (error) throw new Error("Não foi possível atualizar o membro.");
}
