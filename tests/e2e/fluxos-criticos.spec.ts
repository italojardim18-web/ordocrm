import { expect, test } from "@playwright/test";
import { CONTAS, entrar, nomeUnico } from "./helpers";

test.describe("autenticação e navegação", () => {
  test("rota protegida redireciona para o login", async ({ page }) => {
    await page.goto("/pipeline");
    await expect(page).toHaveURL(/\/login/);
  });

  test("credencial errada não entra e informa o erro", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(CONTAS.admin.email);
    await page.getByLabel("Senha").fill("senha-errada");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin entra e vê pipeline e dashboard", async ({ page }) => {
    await entrar(page);
    await expect(
      page.getByRole("heading", { name: "Pipeline", level: 1 }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(
      page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText(/dados reais do pipeline/)).toBeVisible();
  });
});

test.describe("ciclo comercial do lead", () => {
  test("cria lead, move de etapa e vê na lista", async ({ page }) => {
    await entrar(page);
    const nome = nomeUnico("E2E Lead");

    await page.getByRole("button", { name: "Novo lead" }).click();
    await page.getByLabel("Nome *").fill(nome);
    // Telefone único por execução: repetir o número dispara — corretamente —
    // o alerta de duplicidade do cadastro.
    await page
      .getByLabel("Telefone/WhatsApp")
      .fill(`679${Date.now().toString().slice(-8)}`);
    await page.getByRole("button", { name: "Criar lead" }).click();

    // O card aparece no quadro.
    await expect(page.getByText(nome).first()).toBeVisible({ timeout: 15_000 });

    // Move de etapa pelo menu do card (caminho acessível, sem arrastar).
    // `exact` separa o botão de menu do próprio card arrastável, que também
    // é exposto como button para o teclado.
    await page
      .getByRole("button", { name: `Ações de ${nome}`, exact: true })
      .click();
    await page.getByRole("menuitem", { name: "Qualificação" }).click();

    // A lista compartilha a mesma fonte de dados: o lead aparece com a etapa nova.
    await page.getByRole("button", { name: "Lista" }).click();
    const linha = page.getByRole("row").filter({ hasText: nome });
    await expect(linha).toBeVisible({ timeout: 15_000 });
    await expect(linha).toContainText("Qualificação");
  });

  test("agenda sessão e registra venda no Lead 360º", async ({ page }) => {
    await entrar(page);
    const nome = nomeUnico("E2E Venda");

    await page.getByRole("button", { name: "Novo lead" }).click();
    await page.getByLabel("Nome *").fill(nome);
    await page.getByRole("button", { name: "Criar lead" }).click();
    await expect(page.getByText(nome).first()).toBeVisible({ timeout: 15_000 });

    await page.getByRole("link", { name: nome }).first().click();
    await expect(
      page.getByRole("heading", { name: nome, level: 1 }),
    ).toBeVisible();

    // Agendamento
    const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const valor = `${amanha.toISOString().slice(0, 10)}T10:00`;
    await page.getByLabel("Data e hora").fill(valor);
    await page.getByRole("button", { name: "Agendar sessão" }).click();
    await expect(page.getByText("Agendada").first()).toBeVisible({
      timeout: 15_000,
    });

    // Venda: fecha oportunidade e move o lead para "Venda realizada"
    await page.getByRole("button", { name: "Registrar venda" }).click();
    await page.getByLabel(/Valor vendido/).fill("1500");
    await page.getByRole("button", { name: "Confirmar venda" }).click();

    await expect(page.getByText("Ganha").first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Venda realizada").first()).toBeVisible();
  });

  test("perda exige motivo", async ({ page }) => {
    await entrar(page);
    const nome = nomeUnico("E2E Perda");

    await page.getByRole("button", { name: "Novo lead" }).click();
    await page.getByLabel("Nome *").fill(nome);
    await page.getByRole("button", { name: "Criar lead" }).click();
    await expect(page.getByText(nome).first()).toBeVisible({ timeout: 15_000 });

    await page.getByRole("link", { name: nome }).first().click();
    await page.getByRole("button", { name: "Marcar como perdido" }).click();

    const dialogo = page.getByRole("dialog");
    await expect(dialogo).toBeVisible();

    // Sem motivo, o envio é barrado e o diálogo continua aberto.
    await dialogo.getByRole("button", { name: /Confirmar|Marcar/ }).last().click();
    await expect(dialogo).toBeVisible();

    // Com motivo, a perda é registrada.
    await dialogo.getByLabel("Motivo *").selectOption({ index: 1 });
    await dialogo.getByRole("button", { name: /Confirmar|Marcar/ }).last().click();
    await expect(page.getByText("Perdido").first()).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe("captação pública", () => {
  test("formulário público cria lead no pipeline", async ({ page }) => {
    const nome = nomeUnico("E2E Formulário");

    await page.goto("/f/contato?utm_source=e2e&utm_medium=teste");
    await page.getByLabel("Nome *").fill(nome);
    await page.getByLabel("E-mail").fill(`e2e${Date.now()}@example.com`);

    // Espera o tempo mínimo antispam antes de enviar.
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "Enviar contato" }).click();
    await expect(page.getByRole("status")).toContainText(/Recebemos/i);

    // O lead chega ao pipeline com a origem correta.
    await entrar(page);
    await page.getByRole("button", { name: "Lista" }).click();
    await page.getByLabel(/Buscar/).fill(nome);
    const linha = page.getByRole("row").filter({ hasText: nome });
    await expect(linha).toBeVisible({ timeout: 15_000 });
    await expect(linha).toContainText(/Tráfego pago|Formulário/);
  });
});

test.describe("permissões do assistente", () => {
  test("não acessa áreas administrativas nem vê notas admin_only", async ({
    page,
  }) => {
    await entrar(page, CONTAS.assistente);

    // Configurações administrativas ficam fora do alcance.
    // O servidor redireciona quem não é admin — a URL nunca chega ao destino.
    for (const rota of [
      "/configuracoes/produtos",
      "/configuracoes/usuarios",
      "/configuracoes/integracoes",
    ]) {
      await page.goto(rota);
      await expect(page).toHaveURL(/\/pipeline/, { timeout: 15_000 });
    }

    // A nota admin_only do seed é invisível para o assistente.
    await page.goto("/pipeline/lead/33330000-0000-4000-8000-000000000005");
    await expect(page.getByText(/Negociação sensível/)).toHaveCount(0);
  });

  test("assistente opera o pipeline normalmente", async ({ page }) => {
    await entrar(page, CONTAS.assistente);
    await expect(
      page.getByRole("heading", { name: "Pipeline", level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Novo lead" })).toBeVisible();
  });
});
