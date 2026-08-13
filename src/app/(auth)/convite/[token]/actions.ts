"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { acceptInviteSchema } from "@/lib/validation";

export interface AcceptInviteState {
  error?: string;
}

/** Convidado sem conta: cria a conta e aceita o convite. */
export async function signUpAndAccept(
  token: string,
  inviteEmail: string,
  _prevState: AcceptInviteState,
  formData: FormData,
): Promise<AcceptInviteState> {
  const parsed = acceptInviteSchema.safeParse({
    fullName: formData.get("fullName"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email: inviteEmail,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (signUpError) {
    if (signUpError.code === "user_already_exists") {
      return {
        error:
          "Já existe uma conta com este e-mail. Entre primeiro e abra o link do convite novamente.",
      };
    }
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  const { error: acceptError } = await supabase.rpc("accept_invitation", {
    raw_token: token,
  });

  if (acceptError) {
    return { error: "Conta criada, mas o convite não pôde ser aceito." };
  }

  redirect("/pipeline");
}

/** Convidado já autenticado com o e-mail do convite. */
export async function acceptAsCurrentUser(token: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("accept_invitation", {
    raw_token: token,
  });

  if (error) {
    redirect(`/convite/${token}?error=1`);
  }

  redirect("/pipeline");
}
