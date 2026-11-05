import { defineConfig } from "vitest/config";

// Testes unitários (lib/, services/, content/). Os testes de ponta a ponta e
// de acessibilidade ficam em tests/e2e e tests/a11y e rodam no Playwright.
export default defineConfig({
  // O Vite resolve o alias "@/" do tsconfig sem plugin.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.ts"],
  },
});
