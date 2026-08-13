import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // A ponte é um serviço Node independente, sem React: as regras de hooks
    // do Next não se aplicam (e confundem `useMultiFileAuthState` do Baileys
    // com um hook por causa do prefixo "use").
    "bridge/**",
  ]),
]);

export default eslintConfig;
