import { describe, expect, it } from "vitest";
import {
  acceptInviteSchema,
  buildInviteUrl,
  initials,
  inviteSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/lib/validation";

describe("loginSchema", () => {
  it("aceita credenciais válidas", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "x" }).success,
    ).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    expect(
      loginSchema.safeParse({ email: "não-é-email", password: "x" }).success,
    ).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("exige senhas iguais", () => {
    const result = resetPasswordSchema.safeParse({
      password: "12345678",
      confirm: "87654321",
    });
    expect(result.success).toBe(false);
  });

  it("exige pelo menos 8 caracteres", () => {
    const result = resetPasswordSchema.safeParse({
      password: "1234567",
      confirm: "1234567",
    });
    expect(result.success).toBe(false);
  });
});

describe("inviteSchema", () => {
  it("só aceita papéis conhecidos", () => {
    expect(
      inviteSchema.safeParse({ email: "a@b.com", role: "root" }).success,
    ).toBe(false);
    expect(
      inviteSchema.safeParse({ email: "a@b.com", role: "assistant" }).success,
    ).toBe(true);
  });
});

describe("acceptInviteSchema", () => {
  it("exige nome e senha mínima", () => {
    expect(
      acceptInviteSchema.safeParse({ fullName: "A", password: "12345678" })
        .success,
    ).toBe(false);
    expect(
      acceptInviteSchema.safeParse({ fullName: "Ana Lima", password: "12345678" })
        .success,
    ).toBe(true);
  });
});

describe("buildInviteUrl", () => {
  it("monta o link sem barra duplicada", () => {
    expect(buildInviteUrl("http://localhost:3000/", "abc")).toBe(
      "http://localhost:3000/convite/abc",
    );
    expect(buildInviteUrl("http://localhost:3000", "abc")).toBe(
      "http://localhost:3000/convite/abc",
    );
  });
});

describe("initials", () => {
  it("usa primeira e última palavra", () => {
    expect(initials("Ítalo Paiva Jardim")).toBe("ÍJ");
  });

  it("lida com nome único e vazio", () => {
    expect(initials("Ana")).toBe("A");
    expect(initials("")).toBe("?");
    expect(initials(null)).toBe("?");
  });
});
