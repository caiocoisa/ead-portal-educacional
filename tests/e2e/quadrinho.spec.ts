import { expect, test, type Page } from "@playwright/test";

const TITULO = "Quadrinho: duas sugestões da IA";

async function irParaPainel(page: Page, numero: number) {
  for (let atual = 1; atual < numero; atual++) {
    const proximo = page.getByRole("button", { name: "Próximo" });
    // Os painéis 4 e 5 têm decisão: só se avança com a resposta certa.
    if (atual === 4) await page.getByRole("button", { name: /A oficina não cabe na rotina/ }).click();
    if (atual === 5) await page.getByRole("button", { name: /Confere de novo com as lentes/ }).click();
    await proximo.click();
  }
  await expect(page.getByText(`Painel ${numero} de 6`)).toBeVisible();
}

test.describe("quadrinho no portal", () => {
  test("abre sem identificação, sem ser redirecionado, no primeiro painel", async ({ page }) => {
    await page.goto("/quadrinho");
    await expect(page).toHaveURL(/\/quadrinho$/);
    await expect(page.getByRole("heading", { level: 1, name: TITULO })).toBeVisible();
    await expect(page.getByText("Painel 1 de 6")).toBeVisible();
    await expect(page.getByRole("img", { name: /Marina, sorrindo, trabalha ao notebook/ })).toBeVisible();
    await expect(page.getByText(/Semana 3 do meu curso de fotografia/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Anterior" })).toBeDisabled();
  });

  test("a primeira decisão só libera o próximo painel com a resposta certa, e explica cada erro", async ({ page }) => {
    await page.goto("/quadrinho");
    await irParaPainel(page, 4);

    const proximo = page.getByRole("button", { name: "Próximo" });
    await expect(page.getByText("O que Marina deve notar na sugestão A?")).toBeVisible();
    await expect(proximo).toBeDisabled();
    await expect(page.getByText("Escolha a resposta certa para continuar.")).toBeVisible();

    await page.getByRole("button", { name: /O plano não combina com o objetivo/ }).click();
    await expect(page.getByRole("status").getByText(/Ainda não\./)).toBeVisible();
    await expect(page.getByRole("status")).toContainText("Escolha outra opção.");
    await expect(proximo).toBeDisabled();

    await page.getByRole("button", { name: /A oficina não cabe na rotina/ }).click();
    await expect(page.getByRole("status").getByText(/Correto\./)).toBeVisible();
    await expect(page.getByRole("status")).toContainText("lente da viabilidade");
    await expect(proximo).toBeEnabled();

    await proximo.click();
    await expect(page.getByText("Painel 5 de 6")).toBeVisible();
  });

  test("percorre os seis painéis, chega ao fim com os links e permite ler de novo", async ({ page }) => {
    await page.goto("/quadrinho");
    await irParaPainel(page, 6);

    await expect(page.getByText("A IA propõe. Eu confiro e decido.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Explorar o mapa interativo" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ler o e-book" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Próximo" })).toHaveCount(0);

    await page.getByText("Para ir além (opcional)").click();
    await expect(page.getByText(/alinhamento entre objetivo, atividade e avaliação/)).toBeVisible();

    await page.getByRole("button", { name: "Ler de novo" }).click();
    await expect(page.getByText("Painel 1 de 6")).toBeVisible();
  });

  test("voltar a um painel já respondido mantém a resposta certa", async ({ page }) => {
    await page.goto("/quadrinho");
    await irParaPainel(page, 5);
    await page.getByRole("button", { name: "Anterior" }).click();
    await expect(page.getByText("Painel 4 de 6")).toBeVisible();
    await expect(page.getByRole("status").getByText(/Correto\./)).toBeVisible();
    await expect(page.getByRole("button", { name: "Próximo" })).toBeEnabled();
  });

  test("o roteiro em texto mostra os seis painéis e as respostas das decisões", async ({ page }) => {
    await page.goto("/quadrinho");
    await page.getByRole("button", { name: "Roteiro em texto" }).click();

    const painéis = page.getByRole("article");
    await expect(painéis).toHaveCount(6);
    await expect(page.getByRole("heading", { level: 2, name: "Painel 1" })).toBeVisible();
    await expect(page.getByText(/oficina ao vivo toda quarta/i)).toBeVisible();
    await expect(page.getByText("(resposta certa)")).toHaveCount(2);
    await expect(page.getByText("Painel 1 de 6")).toHaveCount(0);

    await page.getByRole("button", { name: "Painel a painel" }).click();
    await expect(page.getByText("Painel 1 de 6")).toBeVisible();
  });

  test("o menu superior traz os três materiais e marca a página atual", async ({ page }) => {
    await page.goto("/quadrinho");
    const menu = page.getByRole("navigation", { name: "Materiais e navegação do portal" });
    await expect(menu.getByRole("link", { name: "Quadrinho" })).toHaveAttribute("aria-current", "page");
    await expect(menu.getByRole("link", { name: "E-book" })).not.toHaveAttribute("aria-current", "page");
    await expect(menu.getByRole("link", { name: "Mapa interativo" })).toBeVisible();

    await menu.getByRole("link", { name: "Mapa interativo" }).click();
    await expect(page).toHaveURL(/\/mapa$/);
  });

  test("a tela principal continua destacando só o e-book e o mapa", async ({ page }) => {
    await page.goto("/");
    const materiais = page.getByRole("region", { name: "Materiais de estudo" });
    await expect(materiais.getByRole("link")).toHaveCount(2);
    await expect(materiais.getByRole("link", { name: /quadrinho/i })).toHaveCount(0);
    // O quadrinho aparece no menu superior.
    await page.getByRole("navigation", { name: "Materiais e navegação do portal" }).getByRole("link", { name: "Quadrinho" }).click();
    await expect(page).toHaveURL(/\/quadrinho$/);
  });

  test("em tela pequena não há rolagem horizontal e o balão fica abaixo da imagem", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/quadrinho");
    await expect(page.getByText(/Semana 3 do meu curso de fotografia/)).toBeVisible();
    const rolagemHorizontal = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(rolagemHorizontal).toBeLessThanOrEqual(1);
    const imagem = await page.getByRole("img", { name: /Marina, sorrindo, trabalha ao notebook/ }).boundingBox();
    const balao = await page.getByText(/Semana 3 do meu curso de fotografia/).first().boundingBox();
    expect(imagem && balao && balao.y >= imagem.y + imagem.height - 1).toBe(true);
  });
});
