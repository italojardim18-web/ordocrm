import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});

export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.");

export const recoverSchema = z.object({
  email: z.email("Informe um e-mail válido."),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem.",
    path: ["confirm"],
  });

export const inviteSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  role: z.enum(["admin", "assistant"]),
});

export const acceptInviteSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome completo."),
  password: passwordSchema,
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome completo."),
});

export const workspaceSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(120),
  timezone: z.string().trim().min(1, "Informe o fuso horário."),
});

/** Monta o link de convite exibido ao administrador. */
export function buildInviteUrl(baseUrl: string, token: string) {
  return `${baseUrl.replace(/\/$/, "")}/convite/${token}`;
}

/** Iniciais para o avatar (ex.: "Ítalo Jardim" → "ÍJ"). */
export function initials(name: string | null | undefined) {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}
