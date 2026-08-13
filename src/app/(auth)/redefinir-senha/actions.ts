"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resetPasswordSchema } from "@/lib/validation";

export interface ResetState {
  error?: string;
}

export async function resetPassword(
  _prevState: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessão expirada. Solicite um novo link de recuperação." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Não foi possível redefinir a senha. Tente novamente." };
  }

  redirect("/pipeline");
}
