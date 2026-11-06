import { expect, test, type Page } from "@playwright/test";
import { ALL_EBOOK_PAGES, STORAGE, seedState } from "../helpers/progress";

const CELULAR = { width: 390, height: 844 };
const NOTEBOOK = { width: 1280, height: 720 };
const TELA_LARGA = { width: 1600, height: 900 };

const controles = (page: Page) => page.getByRole("group", { name: "Controles de acessibilidade" });
const navegacaoDaTrilha = (page: Page) => page.getByRole("navigation", { name: "Trilha do curso" });

async function semRolagemHorizontal(page: Page) {
  return page.evaluate(() => {
    const main = document.querySelector("main");
    return {
      documento: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      conteudo: main ? main.scrollWidth - main.clientWidth : 0,
    };
  });
}

test.describe("controles de acessibilidade sempre visíveis", () => {
  for (const [nome, tela] of [["celular", CELULAR], ["notebook", NOTEBOOK], ["tela larga", TELA_LARGA]] as const) {
    test(`no ${nome} não há gaveta nem aba lateral: os ajustes estão à vista`, async ({ page }) => {
      await page.setViewportSize(tela);
      await page.goto("/");
      await expect(page.getByRole("button", { name: "Abrir menu de acessibilidade" })).toHaveCount(0);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      if (tela === TELA_LARGA) {
        await expect(page.getByRole("heading", { level: 2, name: "Acessibilidade" })).toBeVisible();
      } else {
        await expect(controles(page)).toBeVisible();
      }
    });
  }

  test("a régua muda fonte, contraste e tema, e lembra a escolha depois de recarregar", async ({ page }) => {
    await page.setViewportSize(NOTEBOOK);
    await page.goto("/mapa");
    const html = page.locator("html");
    const menos = controles(page).getByRole("button", { name: /^A− Fonte/ });
    const mais = controles(page).getByRole("button", { name: /^A\+ Fonte/ });

    await expect(menos).toBeDisabled();
    await mais.click();
    await expect(html).toHaveAttribute("data-font-size", "large");
    await mais.click();
    await expect(html).toHaveAttribute("data-font-size", "extra-large");
    await expect(mais).toBeDisabled();
    await menos.click();
    await expect(html).toHaveAttribute("data-font-size", "large");

    const contraste = controles(page).getByRole("button", { name: "Contraste" });
    await expect(contraste).toHaveAttribute("aria-pressed", "false");
    await contraste.click();
    await expect(contraste).toHaveAttribute("aria-pressed", "true");
    await expect(html).toHaveAttribute("data-contrast", "high");

    // O tema gira entre claro, escuro e o do sistema; o nome do botão diz o estado atual.
    const tema = controles(page).getByRole("button", { name: /^Tema, atual:/ });
    await expect(tema).toHaveAccessibleName(/atual: do sistema/);
    await tema.click();
    await expect(tema).toHaveAccessibleName(/atual: claro/);
    await tema.click();
    await expect(tema).toHaveAccessibleName(/atual: escuro/);
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(html).toHaveAttribute("data-font-size", "large");
    await expect(html).toHaveAttribute("data-contrast", "high");
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(controles(page).getByRole("button", { name: "Contraste" })).toHaveAttribute("aria-pressed", "true");
    await expect(controles(page).getByRole("button", { name: /^Tema, atual:/ })).toHaveAccessibleName(/atual: escuro/);
    await expect(controles(page).getByRole("button", { name: /^A− Fonte/ })).toBeEnabled();
  });

  test("o painel da tela larga e a régua do notebook mostram o mesmo estado (o armazenamento é compartilhado)", async ({ page }) => {
    await page.setViewportSize(TELA_LARGA);
    await page.goto("/");
    await page.getByRole("button", { name: "A+, fonte grande" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-font-size", "large");

    await page.setViewportSize(NOTEBOOK);
    await expect(controles(page).getByRole("button", { name: /^A− Fonte/ })).toBeEnabled();
    await controles(page).getByRole("button", { name: "Contraste" }).click();

    await page.setViewportSize(TELA_LARGA);
    await expect(page.getByRole("switch", { name: "Alto contraste" })).toBeChecked();
  });

  test("as preferências salvas valem já no primeiro carregamento, sem piscar o padrão", async ({ page }) => {
    await seedState(page, { preferences: { theme: "dark", contrast: "high", fontSize: "large" } });
    await page.setViewportSize(NOTEBOOK);
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-font-size", "large");
    await expect(html).toHaveAttribute("data-contrast", "high");
    await expect(controles(page).getByRole("button", { name: "Contraste" })).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("celular", () => {
  test.use({ viewport: CELULAR });

  test("topo enxuto, barra da trilha colada embaixo e a linha de ajustes logo acima dela", async ({ page }) => {
    await page.goto("/");
    const cabecalho = await page.getByRole("banner").boundingBox();
    const barra = await navegacaoDaTrilha(page).boundingBox();
    const linha = await controles(page).boundingBox();

    expect(cabecalho && cabecalho.height).toBeLessThanOrEqual(56);
    expect(barra && barra.y + barra.height).toBeGreaterThanOrEqual(CELULAR.height - 1);
    expect(linha && barra && linha.y + linha.height).toBeLessThanOrEqual((barra?.y ?? 0) + 1);
    // As pílulas do cabeçalho não existem aqui: só a barra de baixo.
    await expect(page.getByRole("banner").getByRole("navigation")).toHaveCount(0);
    await expect(page.getByRole("banner").getByText(/^Trilha \d+%$/)).toBeVisible();
  });

  test("a barra da trilha tem cinco itens, todos com alvo de toque de pelo menos 44 px", async ({ page }) => {
    await page.goto("/");
    const itens = navegacaoDaTrilha(page).locator("a, button");
    await expect(itens).toHaveCount(5);
    for (let i = 0; i < 5; i += 1) {
      const caixa = await itens.nth(i).boundingBox();
      expect(caixa && caixa.height).toBeGreaterThanOrEqual(44);
      expect(caixa && caixa.width).toBeGreaterThanOrEqual(44);
    }
    // Os quatro controles de acessibilidade também.
    const botoes = controles(page).getByRole("button");
    await expect(botoes).toHaveCount(4);
    for (let i = 0; i < 4; i += 1) {
      const caixa = await botoes.nth(i).boundingBox();
      expect(caixa && caixa.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("a barra leva aos materiais, marca o item atual e mantém o vídeo desativado", async ({ page }) => {
    await page.goto("/");
    await expect(navegacaoDaTrilha(page).getByRole("button", { name: /Vídeo/ })).toBeDisabled();
    await navegacaoDaTrilha(page).getByRole("link", { name: /^Mapa/ }).click();
    await expect(page).toHaveURL(/\/mapa$/);
    await expect(navegacaoDaTrilha(page).getByRole("link", { name: /^Mapa/ })).toHaveAttribute("aria-current", "page");
    await expect(navegacaoDaTrilha(page).locator('[aria-current="page"]')).toHaveCount(1);
  });

  test("a barra e a linha de ajustes continuam à vista em todas as páginas", async ({ page }) => {
    for (const rota of ["/", "/video", "/ebook", "/mapa", "/avaliacao", "/relatorio", "/quadrinho"]) {
      await page.goto(rota);
      await expect(navegacaoDaTrilha(page)).toBeInViewport();
      await expect(controles(page)).toBeInViewport();
    }
  });

  test("os cartões de materiais não aparecem no celular, para a trilha não ser empurrada", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("region", { name: "Materiais de estudo" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Sua trilha" })).toBeVisible();
  });

  test("a linha de ajustes muda a fonte", async ({ page }) => {
    await page.goto("/");
    await controles(page).getByRole("button", { name: /^A\+ Fonte/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-font-size", "large");
  });

  test("com fonte extra grande, nada passa da largura da tela, nem dentro da área de conteúdo", async ({ page }) => {
    await seedState(page, {
      progress: { ebookPages: ALL_EBOOK_PAGES, mapElements: ["publico", "objetivos"] },
      preferences: { fontSize: "extra-large" },
    });
    for (const rota of ["/", "/mapa", "/avaliacao"]) {
      await page.goto(rota);
      await expect(page.getByRole("banner")).toBeVisible();
      const sobra = await semRolagemHorizontal(page);
      expect(sobra.documento, `${rota}: rolagem horizontal no documento`).toBeLessThanOrEqual(1);
      expect(sobra.conteudo, `${rota}: conteúdo mais largo que a área de conteúdo`).toBeLessThanOrEqual(1);
    }
    // Nenhum rótulo da barra inferior é cortado.
    await page.goto("/");
    const cortados = await navegacaoDaTrilha(page).locator("a, button").evaluateAll((celulas) =>
      celulas.filter((celula) => celula.scrollWidth > celula.clientWidth + 1).length
    );
    expect(cortados).toBe(0);
  });

  test("a trilha, a linha de ajustes e a barra não escondem o conteúdo: dá para rolar até o fim", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Conheça os objetivos/ }).click();
    await expect(page.locator("#objetivos-title")).toBeInViewport();
    const barra = await navegacaoDaTrilha(page).boundingBox();
    const titulo = await page.locator("#objetivos-title").boundingBox();
    expect(titulo && barra && titulo.y + titulo.height <= barra.y).toBe(true);
  });
});

test.describe("tablet", () => {
  test("com fonte extra grande a 768 px as pílulas do cabeçalho descem para outra linha, sem esconder item", async ({ page }) => {
    await seedState(page, { preferences: { fontSize: "extra-large" } });
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/mapa");

    const itens = navegacaoDaTrilha(page).getByRole("listitem");
    await expect(itens).toHaveCount(5);
    for (let i = 0; i < 5; i += 1) await expect(itens.nth(i)).toBeVisible();
    const sobra = await semRolagemHorizontal(page);
    expect(sobra.documento).toBeLessThanOrEqual(1);
    const todosDentro = await itens.evaluateAll((elementos) =>
      elementos.every((elemento) => elemento.getBoundingClientRect().right <= window.innerWidth)
    );
    expect(todosDentro).toBe(true);
    // Com a quebra, as pílulas ocupam mais de uma linha.
    const alturas = await itens.evaluateAll((elementos) => new Set(elementos.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    expect(alturas).toBeGreaterThan(1);
  });

  test("a primeira tela empilha o texto e a trilha, e a régua de acessibilidade fica à direita", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto("/");
    const trilha = await page.getByRole("region", { name: "Sua trilha" }).boundingBox();
    const titulo = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(trilha && titulo && trilha.y > titulo.y + titulo.height).toBe(true);
    const regua = await page.getByRole("complementary", { name: "Acessibilidade" }).boundingBox();
    expect(regua && regua.x + regua.width).toBeGreaterThanOrEqual(799);
  });
});

test.describe("tela larga", () => {
  test.use({ viewport: TELA_LARGA });

  test("a régua da trilha fica à esquerda e o painel de acessibilidade à direita, em todas as páginas", async ({ page }) => {
    for (const rota of ["/", "/mapa", "/avaliacao", "/relatorio"]) {
      await page.goto(rota);
      const esquerda = page.getByRole("complementary", { name: "Sua trilha" });
      const direita = page.getByRole("complementary", { name: "Acessibilidade e navegação da página" });
      await expect(esquerda).toBeVisible();
      await expect(direita).toBeVisible();
      await expect(esquerda.getByRole("listitem")).toHaveCount(5);
      // O cabeçalho continua com as pílulas da trilha.
      await expect(navegacaoDaTrilha(page)).toBeVisible();
    }
  });

  test("o painel traz os controles completos, e 'Nesta página' só aparece na primeira tela", async ({ page }) => {
    await page.goto("/");
    const painel = page.getByRole("complementary", { name: "Acessibilidade e navegação da página" });
    await expect(painel.getByRole("group", { name: "Tamanho da fonte" })).toBeVisible();
    await expect(painel.getByRole("switch", { name: "Alto contraste" })).toBeVisible();
    await expect(painel.getByRole("group", { name: "Tema" })).toBeVisible();
    await expect(painel.getByRole("heading", { level: 2, name: "Nesta página" })).toBeVisible();

    await page.goto("/mapa");
    await expect(painel.getByRole("heading", { level: 2, name: "Nesta página" })).toHaveCount(0);
  });

  test("um atalho de 'Nesta página' leva à seção, com o cabeçalho sempre à vista", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("complementary", { name: "Acessibilidade e navegação da página" }).getByRole("link", { name: "Perguntas frequentes" }).click();
    await expect(page.locator("#faq-title")).toBeInViewport();
    await expect(page.getByRole("banner")).toBeInViewport();
  });

  test("a régua marca a página atual e apaga o progresso depois de confirmar", async ({ page }) => {
    await seedState(page, { progress: { ebookPages: ALL_EBOOK_PAGES, mapElements: ["publico"] } });
    await page.goto("/mapa");
    const esquerda = page.getByRole("complementary", { name: "Sua trilha" });
    await expect(esquerda.getByRole("link", { name: /Mapa interativo/ })).toHaveAttribute("aria-current", "page");
    await expect(esquerda.getByText(/Progresso da trilha: [1-9]/)).toBeVisible();

    await esquerda.getByRole("button", { name: "Apagar meu progresso" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Apagar progresso" }).click();
    await expect(esquerda.getByText("Progresso da trilha: 0%")).toBeVisible();
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE.progress)).toBeNull();
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE.ebookPages)).toBeNull();
  });

  test("o vídeo segue desativado na régua da trilha", async ({ page }) => {
    await page.goto("/");
    const esquerda = page.getByRole("complementary", { name: "Sua trilha" });
    await expect(esquerda.getByRole("button", { name: /Vídeo/ })).toBeDisabled();
    await expect(esquerda.getByRole("link", { name: /Vídeo/ })).toHaveCount(0);
  });
});
