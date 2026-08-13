import { describe, expect, it } from "vitest";
import {
  dedupeHash,
  formSubmissionSchema,
  hasContact,
  MIN_FILL_MS,
  type FormSubmission,
} from "@/lib/channels/form-intake";
import { rateLimit } from "@/lib/channels/rate-limit";

describe("validação do formulário público", () => {
  it("exige nome com pelo menos 2 caracteres", () => {
    expect(formSubmissionSchema.safeParse({ name: "A" }).success).toBe(false);
    expect(formSubmissionSchema.safeParse({ name: "Ana" }).success).toBe(true);
  });

  it("recusa e-mail inválido", () => {
    expect(
      formSubmissionSchema.safeParse({ name: "Ana", email: "não-é-email" })
        .success,
    ).toBe(false);
  });

  it("exige ao menos telefone ou e-mail", () => {
    expect(hasContact({ name: "Ana" })).toBe(false);
    expect(hasContact({ name: "Ana", phone: "67999990000" })).toBe(true);
    expect(hasContact({ name: "Ana", email: "a@b.com" })).toBe(true);
  });

  it("aceita o honeypot no schema (tratado depois com resposta genérica)", () => {
    const result = formSubmissionSchema.safeParse({
      name: "Robo",
      email: "spam@example.com",
      website: "http://spam.example",
    });
    expect(result.success).toBe(true);
  });
});

describe("deduplicação de envios", () => {
  const submission: FormSubmission = {
    name: "Ana Souza",
    email: "ana@example.com",
    phone: "(67) 99999-0000",
  };

  it("mesmo contato na mesma janela gera o mesmo hash", () => {
    const now = new Date("2026-08-13T12:00:00Z");
    expect(dedupeHash("contato", submission, now)).toBe(
      dedupeHash("contato", submission, new Date("2026-08-13T12:05:00Z")),
    );
  });

  it("janelas diferentes geram hashes diferentes", () => {
    expect(
      dedupeHash("contato", submission, new Date("2026-08-13T12:00:00Z")),
    ).not.toBe(
      dedupeHash("contato", submission, new Date("2026-08-13T12:30:00Z")),
    );
  });

  it("formulários diferentes não colidem", () => {
    const now = new Date("2026-08-13T12:00:00Z");
    expect(dedupeHash("contato", submission, now)).not.toBe(
      dedupeHash("supervisao", submission, now),
    );
  });

  it("telefone com máscara diferente gera o mesmo hash", () => {
    const now = new Date("2026-08-13T12:00:00Z");
    const masked: FormSubmission = { ...submission, phone: "67 99999 0000" };
    expect(dedupeHash("contato", submission, now)).toBe(
      dedupeHash("contato", masked, now),
    );
  });
});

describe("tempo mínimo de preenchimento", () => {
  it("usa um limiar plausível para humanos", () => {
    expect(MIN_FILL_MS).toBeGreaterThanOrEqual(1500);
  });
});

describe("rate limit", () => {
  it("bloqueia após o limite na janela", () => {
    const key = `teste-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    }
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("chaves diferentes não interferem", () => {
    const a = `teste-a-${Math.random()}`;
    const b = `teste-b-${Math.random()}`;
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).allowed).toBe(false);
    expect(rateLimit(b, 1, 60_000).allowed).toBe(true);
  });
});
