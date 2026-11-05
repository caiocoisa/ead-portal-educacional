import { expect, test } from "@playwright/test";
import { STORAGE, seedState } from "../helpers/progress";

const TITULO = "Planejar com IA sem perder a didática";

test.describe("e-book no portal", () => {
  test("abre sem identificação, sem ser redirecionado, e mostra o leitor", async ({ page }) => {
    await page.goto("/ebook");
    await expect(page).toHaveURL(/\/ebook$/);
    await expect(page.getByRole("heading", { level: 1, name: TITULO })).toBeVisible();

    const leitor = page.frameLocator("iframe");
    await expect(page.locator("iframe")).toHaveAttribute("title", /leitor interativo de 18 páginas/);
    await expect(leitor.getByRole("heading", { level: 1, name: TITULO })).toBeVisible();
    await expect(leitor.locator("#pos")).toContainText("Página 1 de 18");
  });

  test("a página inicial leva ao e-book e o cabeçalho do e-book volta ao curso", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "E-book", exact: true }).click();
    await expect(page).toHaveURL(/\/ebook$/);
    await page.getByRole("link", { name: "Voltar ao curso" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByLabel("Como podemos te chamar?")).toBeVisible();
  });

  test("a página inicial também convida ao e-book no corpo da tela", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Leia o guia em e-book/ }).click();
    await expect(page).toHaveURL(/\/ebook$/);
  });

  test("quem está na jornada abre o e-book e volta à mesma etapa, sem perder o progresso", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/avaliacao");
    const antes = await page.evaluate((k) => localStorage.getItem(k), STORAGE.progress);

    await page.getByRole("link", { name: "E-book" }).click();
    await expect(page).toHaveURL(/\/ebook$/);
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE.progress)).toBe(antes);

    await page.getByRole("link", { name: "Voltar ao curso" }).click();
    await expect(page).toHaveURL(/\/avaliacao$/);
  });

  test("o leitor navega por botões, teclado e sumário dentro do portal", async ({ page }) => {
    await page.goto("/ebook");
    const leitor = page.frameLocator("iframe");
    const pos = leitor.locator("#pos");

    await leitor.getByRole("button", { name: /Próxima/ }).click();
    await expect(pos).toContainText("Página 2 de 18");
    await leitor.getByRole("button", { name: /Anterior/ }).click();
    await expect(pos).toContainText("Página 1 de 18");

    await leitor.getByRole("button", { name: "Sumário" }).click();
    await expect(pos).toContainText("Página 3 de 18");
    await leitor.getByRole("link", { name: /Monte o seu comando/ }).click();
    await expect(pos).toContainText("Página 9 de 18");

    await leitor.getByRole("button", { name: /Próxima/ }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(pos).toContainText("Página 8 de 18");
  });

  test("o elemento interativo do capítulo 2 funciona dentro do portal", async ({ page }) => {
    await page.goto("/ebook");
    const leitor = page.frameLocator("iframe");
    await leitor.getByRole("button", { name: "Sumário" }).click();
    await leitor.getByRole("link", { name: /Monte o seu comando/ }).click();
    await leitor.getByRole("button", { name: "Preencher com exemplo" }).click();
    await expect(leitor.locator("#m-conta")).toContainText("4 de 4");
    await expect(leitor.locator("#m-saida")).toContainText("Aja como designer instrucional");
  });

  test("o PDF e o leitor em tela cheia estão publicados e acessíveis por link", async ({ page, request }) => {
    await page.goto("/ebook");
    const pdf = page.getByRole("link", { name: "Baixar em PDF" });
    await expect(pdf).toHaveAttribute("href", "/ebook/ebook-planejar-com-ia.pdf");
    const resposta = await request.get("/ebook/ebook-planejar-com-ia.pdf");
    expect(resposta.status()).toBe(200);
    expect(resposta.headers()["content-type"]).toContain("pdf");

    const telaCheia = page.getByRole("link", { name: /Abrir em tela cheia/ });
    await expect(telaCheia).toHaveAttribute("target", "_blank");
    await expect(telaCheia).toHaveAttribute("rel", /noopener/);
    expect((await request.get("/ebook/leitor.html")).status()).toBe(200);
  });

  test("o leitor respeita o alto contraste e o tamanho de fonte salvos no portal", async ({ page }) => {
    await seedState(page, { preferences: { contrast: "high", fontSize: "extra-large" } });
    await page.goto("/ebook");
    const html = page.frameLocator("iframe").locator("html");
    await expect(html).toHaveAttribute("data-contrast", "high");
    await expect(html).toHaveAttribute("data-font-size", "extra-large");
    await expect(html).toHaveClass(/fluid/); // fonte ampliada usa a leitura fluida
  });

  test("mudar o contraste no portal com o e-book aberto chega ao leitor", async ({ page }) => {
    await page.goto("/ebook");
    const html = page.frameLocator("iframe").locator("html");
    await expect(html).toHaveAttribute("data-contrast", "normal");
    await page.evaluate((k) => localStorage.setItem(k, "high"), STORAGE.contrast);
    await expect(html).toHaveAttribute("data-contrast", "high");
  });
});
