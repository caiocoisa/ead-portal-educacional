import { expect, test } from "@playwright/test";
import { STORAGE, seedState } from "../helpers/progress";

const TITULO = "Planejar com IA sem perder a didática";
/** Nome do link da marca no cabeçalho, que leva à primeira tela. */
const MARCA = "Planejamento Pedagógico para EaD";

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

  test("a página inicial leva ao e-book pela trilha e a marca do cabeçalho volta ao curso", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Trilha do curso" }).getByRole("link", { name: /^E-book/ }).click();
    await expect(page).toHaveURL(/\/ebook$/);
    await page.getByRole("link", { name: MARCA, exact: true }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByLabel("Como podemos te chamar?")).toHaveCount(0);
  });

  test("a página inicial destaca o e-book em um cartão da tela principal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Ler o e-book/ }).click();
    await expect(page).toHaveURL(/\/ebook$/);
  });

  test("no e-book, o item da trilha da página atual é marcado com aria-current", async ({ page }) => {
    await page.goto("/ebook");
    const trilha = page.getByRole("navigation", { name: "Trilha do curso" });
    await expect(trilha.getByRole("link", { name: /^E-book/ })).toHaveAttribute("aria-current", "page");
    await expect(trilha.getByRole("link", { name: /^Mapa/ })).not.toHaveAttribute("aria-current", "page");
  });

  test("quem tem progresso abre o e-book pela trilha sem perder o que já foi salvo e volta ao curso", async ({ page }) => {
    await seedState(page, { progress: { mapElements: ["publico"], answers: { q1: 0 } } });
    await page.goto("/avaliacao");
    const antes = await page.evaluate((k) => localStorage.getItem(k), STORAGE.progress);

    await page.getByRole("navigation", { name: "Trilha do curso" }).getByRole("link", { name: /E-book/ }).click();
    await expect(page).toHaveURL(/\/ebook$/);
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE.progress)).toBe(antes);

    await page.getByRole("link", { name: MARCA, exact: true }).click();
    await expect(page).toHaveURL("/");
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

  // Task 65: o portal não oferece a ação de baixar o PDF. O motivo é de experiência (ler em PDF
  // empobrece o que o portal oferece) e não de proteção contra cópia.
  test("a página do e-book não oferece baixar o PDF: sem botão, sem link e sem o arquivo público", async ({ page, request }) => {
    await page.goto("/ebook");
    await expect(page.getByRole("heading", { level: 1, name: TITULO })).toBeVisible();

    await expect(page.getByRole("link", { name: /PDF/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /baixar|download/i })).toHaveCount(0);
    expect(await page.locator("a[download]").count()).toBe(0);
    expect(await page.locator('a[href$=".pdf"]').count()).toBe(0);

    // A URL antiga do arquivo deixou de existir: ele saiu de `public/`.
    expect((await request.get("/ebook/ebook-planejar-com-ia.pdf")).status()).toBe(404);
  });

  test("o leitor em tela cheia segue publicado e acessível por link", async ({ page, request }) => {
    await page.goto("/ebook");
    const telaCheia = page.getByRole("link", { name: /Abrir em tela cheia/ });
    await expect(telaCheia).toHaveAttribute("href", "/ebook/leitor.html");
    await expect(telaCheia).toHaveAttribute("target", "_blank");
    await expect(telaCheia).toHaveAttribute("rel", /noopener/);
    expect((await request.get("/ebook/leitor.html")).status()).toBe(200);
  });

  test("a contracapa do leitor não promete mais uma versão em PDF", async ({ page }) => {
    await page.goto("/ebook/leitor.html#p1");
    await expect(page.locator("body")).not.toContainText("em HTML e PDF");
    await expect(page.locator("body")).toContainText("as duas nesta mesma página");
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
