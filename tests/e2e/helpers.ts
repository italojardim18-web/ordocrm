import { expect, type Page } from "@playwright/test";

export const CONTAS = {
  admin: { email: "admin@praxis.dev", senha: "praxis123!" },
  assistente: { email: "assistente@praxis.dev", senha: "praxis123!" },
};

export async function entrar(
  page: Page,
  conta: { email: string; senha: string } = CONTAS.admin,
) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(conta.email);
  await page.getByLabel("Senha").fill(conta.senha);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(/\/(pipeline|dashboard)?$/);
}

/** Nome único por execução: os testes rodam contra o banco local persistente. */
export function nomeUnico(prefixo: string): string {
  return `${prefixo} ${Date.now().toString().slice(-6)}`;
}

export async function esperarToast(page: Page, texto: string | RegExp) {
  await expect(page.getByText(texto).first()).toBeVisible({ timeout: 15_000 });
}
