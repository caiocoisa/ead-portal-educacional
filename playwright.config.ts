import { defineConfig, devices } from "@playwright/test";

// Porta própria (3100) para não colidir com o `npm run dev` (3000).
const PORT = 3100;

// Os testes rodam contra o build de produção, como recomenda a guia de
// Playwright do Next.js (node_modules/next/dist/docs/01-app/02-guides/testing).
export default defineConfig({
  testDir: "./tests",
  testMatch: ["e2e/**/*.spec.ts", "a11y/**/*.spec.ts"],
  // Um processo por vez: com vários navegadores em paralelo, a máquina de
  // desenvolvimento esgotou o tempo ao criar contextos (12,9 min e 4 falhas
  // de timeout na primeira execução; 18 s e 0 falhas com um processo).
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "pt-BR",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
