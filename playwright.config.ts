import { defineConfig, devices } from "@playwright/test";

/**
 * E2E dos fluxos críticos. Pressupõe o stack local do Supabase no ar
 * (`supabase start`) com o seed aplicado (`supabase db reset`).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // os testes compartilham o mesmo banco local
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    locale: "pt-BR",
    timezoneId: "America/Campo_Grande",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/login",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
