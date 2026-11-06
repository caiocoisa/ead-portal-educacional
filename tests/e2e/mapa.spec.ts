import { expect, test } from "@playwright/test";
import { STORAGE, seedState } from "../helpers/progress";

const NOS = /^(Público|Objetivos|Atividades|Avaliação)/;

test.describe("mapa interativo no portal", () => {
  test("abre sem identificação, sem ser redirecionado, e mostra os quatro elementos", async ({ page }) => {
    await page.goto("/mapa");
    await expect(page).toHaveURL(/\/mapa$/);
    await expect(page.getByRole("heading", { level: 1, name: "Mapa do alinhamento" })).toBeVisible();

    const nos = page.getByRole("button", { name: NOS });
    await expect(nos).toHaveCount(4);
    for (const no of await nos.all()) await expect(no).toHaveAttribute("aria-pressed", "false");
  });

  test("escolher um elemento mostra conceito, exemplo e a falha típica da IA", async ({ page }) => {
    await page.goto("/mapa");
    await page.getByRole("button", { name: /^Atividades/ }).click();

    const painel = page.getByRole("region", { name: "Detalhe do elemento" });
    await expect(painel.getByRole("heading", { level: 2, name: "Atividades" })).toBeVisible();
    for (const termo of ["Conceito", "Exemplo", "Falha típica da IA", "Pergunta de auditoria", "Comando de ajuste"]) {
      await expect(painel.getByText(termo, { exact: true })).toBeVisible();
    }
    await expect(painel.getByText("Conexões")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Atividades/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("as setas do teclado movem o foco entre os elementos, com volta ao começo", async ({ page }) => {
    await page.goto("/mapa");
    const publico = page.getByRole("button", { name: /^Público/ });
    await publico.focus();

    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("button", { name: /^Objetivos/ })).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(publico).toBeFocused();
    await page.keyboard.press("ArrowLeft"); // do primeiro volta ao último
    await expect(page.getByRole("button", { name: /^Avaliação/ })).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /^Avaliação/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("o percurso guiado leva pelos quatro elementos e termina na conclusão", async ({ page }) => {
    await page.goto("/mapa");
    await page.getByRole("button", { name: "Percurso guiado" }).click();

    const painel = page.getByRole("region", { name: "Detalhe do elemento" });
    await expect(painel.getByText("Passo 1 de 4")).toBeVisible();
    await expect(painel.getByRole("heading", { level: 2, name: "Público" })).toBeVisible();
    await expect(painel.getByRole("button", { name: "Anterior" })).toBeDisabled();

    for (const [passo, titulo] of [[2, "Objetivos"], [3, "Atividades"], [4, "Avaliação"]] as const) {
      await painel.getByRole("button", { name: "Próximo" }).click();
      await expect(painel.getByText(`Passo ${passo} de 4`)).toBeVisible();
      await expect(painel.getByRole("heading", { level: 2, name: titulo })).toBeVisible();
    }

    await painel.getByRole("button", { name: "Concluir" }).click();
    await expect(painel.getByRole("heading", { level: 2, name: "Escolha um elemento" })).toBeVisible();
    await expect(painel.getByText(/Alinhar é fazer os quatro elementos contarem a mesma história/)).toBeVisible();
  });

  test("a lista mostra os quatro elementos com o mesmo conteúdo e dá para voltar ao mapa", async ({ page }) => {
    await page.goto("/mapa");
    await page.getByRole("button", { name: "Lista", exact: true }).click();

    const artigos = page.getByRole("article");
    await expect(artigos).toHaveCount(4);
    await expect(artigos.first().getByText("Falha típica da IA")).toBeVisible();
    await expect(page.getByRole("button", { name: NOS })).toHaveCount(0);

    await page.getByRole("button", { name: "Mapa", exact: true }).click();
    await expect(page.getByRole("button", { name: NOS })).toHaveCount(4);
  });

  test("em tela pequena só existe a lista, sem o diagrama", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/mapa");
    await expect(page.getByRole("article")).toHaveCount(4);
    await expect(page.getByRole("button", { name: NOS })).toHaveCount(0);
    const rolagemHorizontal = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(rolagemHorizontal).toBeLessThanOrEqual(1);
  });

  test("a trilha do cabeçalho marca a página atual e leva ao e-book", async ({ page }) => {
    await page.goto("/mapa");
    const trilha = page.getByRole("navigation", { name: "Trilha do curso" });
    await expect(trilha.getByRole("link", { name: /^Mapa/ })).toHaveAttribute("aria-current", "page");
    await trilha.getByRole("link", { name: /^E-book/ }).click();
    await expect(page).toHaveURL(/\/ebook$/);
  });

  test("a página inicial destaca o mapa em um cartão e na trilha do cabeçalho", async ({ page }) => {
    await page.goto("/");
    const materiais = page.getByRole("region", { name: "Materiais de estudo" });
    await expect(materiais.getByRole("link")).toHaveCount(2);
    await materiais.getByRole("link", { name: /Explorar o mapa interativo/ }).click();
    await expect(page).toHaveURL(/\/mapa$/);

    await page.getByRole("link", { name: "Planejamento Pedagógico para EaD", exact: true }).click();
    await page.getByRole("navigation", { name: "Trilha do curso" }).getByRole("link", { name: /^Mapa/ }).click();
    await expect(page).toHaveURL(/\/mapa$/);
  });

  test("quem tem progresso abre o mapa pela trilha sem perder o que já foi salvo e volta ao curso", async ({ page }) => {
    await seedState(page, { progress: { ebookPages: [1, 2], answers: { q1: 0 } } });
    await page.goto("/avaliacao");
    const antes = await page.evaluate((k) => localStorage.getItem(k), STORAGE.progress);

    await page.getByRole("navigation", { name: "Trilha do curso" }).getByRole("link", { name: /Mapa/ }).click();
    await expect(page).toHaveURL(/\/mapa$/);
    // Em tela larga só existe o diagrama: abrir a página, sem escolher um elemento, não grava nada.
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE.progress)).toBe(antes);

    await page.getByRole("link", { name: "Planejamento Pedagógico para EaD", exact: true }).click();
    await expect(page).toHaveURL("/");
  });
});
