import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 30_000,
    // As suítes de RLS compartilham o mesmo banco local: em paralelo, a
    // limpeza de uma apaga as fixtures da outra no meio da execução.
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // `server-only` só existe no bundler do Next; nos testes é inócuo.
      "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts"),
    },
  },
});
