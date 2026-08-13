"use server";

import { createClient } from "@/lib/supabase/server";
import { recoverSchema } from "@/lib/validation";

export interface RecoverState {
  error?: string;
  done?: boolean;
}

export async function recoverPassword(
  _prevState: RecoverState,
  formData: FormData,
): Promise<RecoverState> {
  const parsed = recoverSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/redefinir-senha`,
  });

  // Resposta idêntica com ou sem cadastro: evita enumeração de e-mails.
  return { done: true };
}
