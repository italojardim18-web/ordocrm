import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // `server-only` só existe no bundler do Next; nos testes é inócuo.
      "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts"),
    },
  },
});
