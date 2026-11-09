import { expect, test, type Page } from "@playwright/test";
import { MODOS_VISUAIS, aguardarPreferencias } from "../helpers/modos";
import { seedState } from "../helpers/progress";

/**
 * Linguagem visual (Task 68) nas telas reais: o que o navegador calcula nos cartões, nas réguas e no
 * mapa, nos três modos, e a varredura em tempo de execução contra faixas coloridas na lateral. As classes
 * em si, com contraste, estão em `linguagem-visual.spec.ts`.
 */

const NOTEBOOK = { width: 1280, height: 720 };

async function abrir(page: Page, rota: string, preferencias: (typeof MODOS_VISUAIS)[number]["preferencias"]) {
  await page.setViewportSize(NOTEBOOK);
  await seedState(page, { preferences: preferencias });
  await page.goto(rota);
  await aguardarPreferencias(page, preferencias);
}

/** Estilo calculado do elemento achado pelo seletor; roda no navegador. */
async function estiloDe(page: Page, seletor: string) {
  return page.locator(seletor).first().evaluate((el) => {
    const estilo = getComputedStyle(el);
    return {
      imagem: estilo.backgroundImage,
      sombra: estilo.boxShadow,
      bordaTopo: estilo.borderTopWidth,
      bordaEsquerda: estilo.borderLeftWidth,
      bordaDireita: estilo.borderRightWidth,
    };
  });
}

/**
 * Elementos com borda lateral grossa e sem a mesma borda no topo: é a "faixa colorida na lateral" que
 * a regra aprovada proíbe. Pega também as que vêm de componentes do HeroUI, que a varredura dos fontes não vê.
 */
async function faixasLaterais(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const achadas: string[] = [];
    for (const el of document.querySelectorAll("body *")) {
      const estilo = getComputedStyle(el);
      const topo = Number.parseFloat(estilo.borderTopWidth);
      for (const [lado, largura] of [
        ["esquerda", Number.parseFloat(estilo.borderLeftWidth)],
        ["direita", Number.parseFloat(estilo.borderRightWidth)],
      ] as const) {
        if (largura >= 3 && topo < largura) {
          achadas.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} (borda ${lado} ${largura}px)`);
        }
      }
    }
    return achadas;
  });
}

test.describe("superfícies nas telas", () => {
  for (const modo of MODOS_VISUAIS) {
    const alto = modo.preferencias.contrast === "high";

    test(`${modo.nome}: o cartão da trilha e a régua de acessibilidade ${alto ? "ficam sólidos, com borda forte" : "têm gradiente, sombra e borda clara"}`, async ({ page }) => {
      await abrir(page, "/", modo.preferencias);

      const cartao = await estiloDe(page, 'section[aria-labelledby="trilha-title"]');
      const regua = await estiloDe(page, 'aside[aria-label="Acessibilidade"]');

      if (alto) {
        expect(cartao.imagem).toBe("none");
        expect(cartao.sombra).toBe("none");
        expect(cartao.bordaTopo).toBe("2px");
        expect(regua.sombra).toBe("none");
        expect(regua.bordaEsquerda).toBe("2px");
      } else {
        expect(cartao.imagem).toContain("gradient");
        expect(cartao.sombra).not.toBe("none");
        expect(cartao.bordaTopo).toBe("1px");
        expect(regua.sombra).not.toBe("none");
        expect(regua.bordaEsquerda).toBe("1px");
      }
    });
  }

  test("no mapa, 'Falha típica da IA' é um cartão vermelho com a pílula do mesmo tom", async ({ page }) => {
    await abrir(page, "/mapa", { theme: "light" });
    await page.getByRole("button", { name: /^Atividades/ }).click();

    // Só o detalhe aberto: a lista de todos os elementos repete os mesmos rótulos.
    const detalhe = page.locator('[aria-label="Detalhe do elemento"]');
    const falha = detalhe.locator("dt", { hasText: "Falha típica da IA" });
    const conceito = detalhe.locator("dt", { hasText: /^Conceito$/ });
    await expect(falha).toBeVisible();

    const fundoDaPilula = (alvo: ReturnType<Page["locator"]>) => alvo.evaluate((el) => getComputedStyle(el).backgroundColor);
    const fundoDoCartao = (alvo: ReturnType<Page["locator"]>) =>
      alvo.evaluate((el) => getComputedStyle(el.parentElement!).backgroundImage);

    // A pílula do erro é de outra cor que a do "Conceito", e o cartão do erro leva gradiente (tinta vermelha).
    expect(await fundoDaPilula(falha)).not.toBe(await fundoDaPilula(conceito));
    expect(await fundoDoCartao(falha)).toContain("gradient");
    expect(await fundoDoCartao(falha)).not.toBe(await fundoDoCartao(conceito));
  });
});

test.describe("sem faixa colorida na lateral", () => {
  test("a primeira tela, o mapa e o quadrinho não têm borda lateral grossa em nenhum elemento", async ({ page }) => {
    await abrir(page, "/", { theme: "light" });
    expect(await faixasLaterais(page), "primeira tela").toEqual([]);

    await page.goto("/mapa");
    await page.getByRole("button", { name: /^Atividades/ }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Atividades" })).toBeVisible();
    expect(await faixasLaterais(page), "mapa com um elemento aberto").toEqual([]);

    await page.goto("/quadrinho");
    await expect(page.getByRole("button", { name: "Próximo" })).toBeVisible();
    expect(await faixasLaterais(page), "quadrinho").toEqual([]);
  });

  test("o quadrinho mostra o rótulo de cada fala em pílula cheia, e não só em texto cinza", async ({ page }) => {
    await abrir(page, "/quadrinho", { theme: "light" });
    // Os rótulos das falas (narrador, comando, IA) são pílulas: fundo preenchido e cantos arredondados.
    const pilulas = await page.locator("main p.uppercase").evaluateAll((itens) =>
      itens.map((el) => {
        const estilo = getComputedStyle(el);
        return { fundo: estilo.backgroundColor, raio: Number.parseFloat(estilo.borderTopLeftRadius) };
      })
    );
    expect(pilulas.length).toBeGreaterThan(0);
    for (const pilula of pilulas) {
      expect(pilula.fundo).not.toBe("rgba(0, 0, 0, 0)");
      expect(pilula.raio).toBeGreaterThanOrEqual(100);
    }
  });
});
