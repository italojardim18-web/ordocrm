import "server-only";
import { createHash } from "node:crypto";
import { z } from "zod";

export const formSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.email("E-mail inválido.").optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  utm_source: z.string().trim().max(120).optional().or(z.literal("")),
  utm_medium: z.string().trim().max(120).optional().or(z.literal("")),
  utm_campaign: z.string().trim().max(120).optional().or(z.literal("")),
  utm_content: z.string().trim().max(120).optional().or(z.literal("")),
  utm_term: z.string().trim().max(120).optional().or(z.literal("")),
  // Anti-spam: campo oculto que humanos não preenchem. Aceito pelo schema e
  // tratado depois com resposta genérica — nunca revelar a regra ao robô.
  website: z.string().max(200).optional().or(z.literal("")),
  // Milissegundos desde a renderização do formulário
  elapsed: z.coerce.number().optional(),
});

export type FormSubmission = z.infer<typeof formSubmissionSchema>;

/** Pelo menos uma forma de contato é obrigatória. */
export function hasContact(data: FormSubmission): boolean {
  return Boolean(data.phone?.trim() || data.email?.trim());
}

/** Preenchimento mais rápido que isto é quase certamente robô. */
export const MIN_FILL_MS = 2500;

/**
 * Hash de deduplicação: mesmo contato + mesma janela de 10 minutos = 1 lead.
 * Evita lead duplicado por clique repetido ou reenvio do formulário.
 */
export function dedupeHash(
  slug: string,
  data: FormSubmission,
  now = new Date(),
): string {
  const window = Math.floor(now.getTime() / (10 * 60 * 1000));
  const identity = [
    slug,
    data.email?.trim().toLowerCase() ?? "",
    (data.phone ?? "").replace(/\D/g, ""),
    data.name.trim().toLowerCase(),
    window,
  ].join("|");
  return createHash("sha256").update(identity).digest("hex");
}
