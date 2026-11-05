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
    // Saídas dos testes.
    "playwright-report/**",
    "test-results/**",
    "coverage/**",
    // `testes/` guarda evidências e scripts Node em CommonJS (verificadores de
    // documentação e rastreabilidade), não código do produto.
    "testes/**",
  ]),
]);

export default eslintConfig;
