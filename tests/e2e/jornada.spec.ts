import { expect, test, type Page } from "@playwright/test";
import { moduleContent } from "../../content/module";
import type { Question } from "../../types/quiz";
import { ALL_EBOOK_PAGES, STORAGE, seedState } from "../helpers/progress";

const questions = moduleContent.questions;

/** Lê e interpreta uma chave do `localStorage` da página. */
async function stored(page: Page, key: string): Promise<unknown> {
  const raw = await page.evaluate((k) => localStorage.getItem(k), key);
  return raw === null ? null : JSON.parse(raw);
}

async function confirmCorrect(page: Page, question: Question) {
  await page
    .getByRole("radio", { name: question.options[question.correctOptionIndex].slice(0, 60) })
    .check({ force: true });
  await page.getByRole("button", { name: "Confirmar resposta" }).click();
}

const trilha = (page: Page) => page.getByRole("region", { name: "Sua trilha" });
const navegacaoDaTrilha = (page: Page) => page.getByRole("navigation", { name: "Trilha do curso" });

test.describe("fluxo livre", () => {
  test("todas as rotas abrem sem progresso e nenhuma redireciona", async ({ page }) => {
    for (const rota of ["/video", "/avaliacao", "/relatorio", "/ebook", "/mapa", "/quadrinho"]) {
      await page.goto(rota);
      await expect(page).toHaveURL(new RegExp(`${rota}$`));
    }
  });

  test("a primeira tela não pede nome e mostra a trilha com os cinco itens", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByLabel("Como podemos te chamar?")).toHaveCount(0);

    await expect(trilha(page).getByRole("listitem")).toHaveCount(5);
    await expect(trilha(page).getByText("Progresso da trilha: 0%")).toBeVisible();
    await expect(page.getByRole("link", { name: "Começar pelo e-book" })).toBeVisible();
  });

  test("quem já tem progresso não é redirecionado e vê o próximo passo", async ({ page }) => {
    await seedState(page, { progress: { ebookPages: ALL_EBOOK_PAGES, mapElements: ["publico", "objetivos"] } });
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(trilha(page).getByText("Progresso da trilha: 38%")).toBeVisible();

    await page.getByRole("link", { name: "Continuar: Mapa interativo" }).click();
    await expect(page).toHaveURL(/\/mapa$/);
  });

  test("o vídeo aparece desativado, sem link, na primeira tela e no cabeçalho", async ({ page }) => {
    await page.goto("/");
    await expect(trilha(page).getByRole("link", { name: /Vídeo/ })).toHaveCount(0);
    await expect(trilha(page).getByText("Em breve")).toBeVisible();

    await page.goto("/avaliacao");
    await expect(navegacaoDaTrilha(page).getByRole("button", { name: /Vídeo/ })).toBeDisabled();
    await expect(navegacaoDaTrilha(page).getByRole("link", { name: /Vídeo/ })).toHaveCount(0);
  });

  test("a página de vídeo avisa que ele ainda não foi publicado, sem botão de concluir", async ({ page }) => {
    await page.goto("/video");
    await expect(page.getByText("Vídeo em breve")).toBeVisible();
    await expect(page.getByRole("button", { name: "Concluir" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Ler o e-book" })).toBeVisible();
  });

  test("o cabeçalho da jornada mostra o percentual de cada item e marca a página atual", async ({ page }) => {
    await seedState(page, { progress: { ebookPages: ALL_EBOOK_PAGES, mapElements: ["publico", "objetivos"] } });
    await page.goto("/avaliacao");
    const nav = navegacaoDaTrilha(page);
    await expect(nav.getByRole("link", { name: /Avaliação/ })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: /E-book/ })).toContainText("100%");
    await expect(nav.getByRole("link", { name: /Mapa/ })).toContainText("50%");
    await expect(page.getByText("Trilha 38%")).toBeVisible();
  });

  test("o menu do cabeçalho leva a cada material sem perder o que foi visto", async ({ page }) => {
    await seedState(page, { progress: { mapElements: ["publico"] } });
    await page.goto("/avaliacao");
    await navegacaoDaTrilha(page).getByRole("link", { name: /E-book/ }).click();
    await expect(page).toHaveURL(/\/ebook$/);
    expect(await stored(page, STORAGE.progress)).toMatchObject({ mapa: { elementsSeen: ["publico"] } });
  });
});

test.describe("cabeçalho único e layout compartilhado", () => {
  const ROTAS = ["/", "/video", "/ebook", "/mapa", "/avaliacao", "/relatorio", "/quadrinho"];

  test("cada página tem um só cabeçalho, com a trilha de cinco itens e o progresso geral", async ({ page }) => {
    for (const rota of ROTAS) {
      await page.goto(rota);
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(navegacaoDaTrilha(page).getByRole("listitem")).toHaveCount(5);
      await expect(page.getByText(/^Trilha \d+%$/)).toBeVisible();
    }
  });

  test("o cabeçalho não é remontado ao navegar entre as páginas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("banner").evaluate((el) => el.setAttribute("data-teste", "mesmo"));

    await navegacaoDaTrilha(page).getByRole("link", { name: /^E-book/ }).click();
    await expect(page).toHaveURL(/\/ebook$/);
    await expect(page.getByRole("banner")).toHaveAttribute("data-teste", "mesmo");

    await navegacaoDaTrilha(page).getByRole("link", { name: /^Mapa/ }).click();
    await expect(page).toHaveURL(/\/mapa$/);
    await expect(page.getByRole("banner")).toHaveAttribute("data-teste", "mesmo");
  });

  test("o item atual da trilha vem da URL, em cada página, e só um por vez", async ({ page }) => {
    const paginas = [
      ["/ebook", /^E-book/],
      ["/mapa", /^Mapa/],
      ["/avaliacao", /^Avaliação/],
      ["/relatorio", /^Relatório/],
    ] as const;
    for (const [rota, nome] of paginas) {
      await page.goto(rota);
      await expect(navegacaoDaTrilha(page).getByRole("link", { name: nome })).toHaveAttribute("aria-current", "page");
      await expect(navegacaoDaTrilha(page).locator('[aria-current="page"]')).toHaveCount(1);
    }

    // Na primeira tela nenhum item está atual; quem fica marcado é a marca.
    await page.goto("/");
    await expect(navegacaoDaTrilha(page).locator('[aria-current="page"]')).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Planejamento Pedagógico para EaD", exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("com fonte extra grande em tela estreita, a trilha quebra em linhas sem esconder item nem criar rolagem horizontal", async ({ page }) => {
    await seedState(page, { preferences: { fontSize: "extra-large" } });
    // 640 px: com 125% de fonte as cinco pílulas não cabem numa linha e precisam descer.
    // Provisório: no passo 7 do PR A, abaixo de 768 px a trilha passa para a barra inferior.
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto("/mapa");

    const itens = navegacaoDaTrilha(page).getByRole("listitem");
    await expect(itens).toHaveCount(5);
    for (let i = 0; i < 5; i += 1) await expect(itens.nth(i)).toBeVisible();

    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(sobra).toBeLessThanOrEqual(1);
    const todosDentro = await itens.evaluateAll((elementos) =>
      elementos.every((elemento) => elemento.getBoundingClientRect().right <= window.innerWidth)
    );
    expect(todosDentro).toBe(true);
  });

  test("a primeira tela rola por dentro da área de conteúdo e o cabeçalho continua à vista", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Conheça os objetivos/ }).click();
    await expect(page.locator("#objetivos-title")).toBeInViewport();
    await expect(page.getByRole("banner")).toBeInViewport();
  });
});

test.describe("avaliação e relatório", () => {
  test("percurso completo: perguntas, relatório e refazer só a avaliação", async ({ page }) => {
    // Fluxo longo (4 perguntas, várias interações cada): o limite padrão de 30 s
    // estoura em máquinas lentas, sem que nenhum passo esteja errado.
    test.setTimeout(90_000);
    await seedState(page, { progress: { mapElements: ["publico"] } });
    await page.goto("/avaliacao");

    for (const [index, question] of questions.entries()) {
      await confirmCorrect(page, question);
      await expect(page.getByText("Resposta correta").first()).toBeVisible();
      const ultima = index === questions.length - 1;
      await page.getByRole("button", { name: ultima ? "Ver relatório final" : "Próxima pergunta" }).click();
    }

    await expect(page).toHaveURL(/\/relatorio$/);
    await expect(page.getByText("Relatório final")).toBeVisible();
    await expect(page.getByText(/perguntas \(100%\)/)).toBeVisible();
    expect(await stored(page, STORAGE.progress)).toMatchObject({
      avaliacao: { result: { correctCount: questions.length, totalCount: questions.length } },
    });

    await page.getByRole("button", { name: "Refazer a avaliação" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Refazer", exact: true }).click();
    await expect(page).toHaveURL(/\/avaliacao$/);
    expect(await stored(page, STORAGE.progress)).toMatchObject({
      avaliacao: { answers: {}, result: null },
      mapa: { elementsSeen: ["publico"] },
    });
  });

  test("uma alternativa de erro próximo mostra o retorno 'Quase lá'", async ({ page }) => {
    await page.goto("/avaliacao");
    const question = questions[0];
    await page
      .getByRole("radio", { name: question.options[question.feedback.near.optionIndex].slice(0, 60) })
      .check({ force: true });
    await page.getByRole("button", { name: "Confirmar resposta" }).click();
    await expect(page.getByText("Quase lá").first()).toBeVisible();
  });

  test("uma alternativa de erro distante mostra o retorno 'Vamos revisar'", async ({ page }) => {
    await page.goto("/avaliacao");
    const question = questions[0];
    const far = question.options.findIndex(
      (_, i) => i !== question.correctOptionIndex && i !== question.feedback.near.optionIndex
    );
    await page.getByRole("radio", { name: question.options[far].slice(0, 60) }).check({ force: true });
    await page.getByRole("button", { name: "Confirmar resposta" }).click();
    await expect(page.getByText("Vamos revisar").first()).toBeVisible();
  });

  test("as respostas confirmadas sobrevivem a recarregar e a avaliação retoma da primeira sem resposta", async ({ page }) => {
    await page.goto("/avaliacao");
    await confirmCorrect(page, questions[0]);
    await expect(page.getByText("Resposta correta").first()).toBeVisible();

    await page.reload();
    await expect(page.getByRole("region", { name: /Pergunta 2 de/ })).toBeVisible();
    await page.getByRole("button", { name: /^Pergunta 1 / }).click();
    await expect(page.getByText("Resposta correta").first()).toBeVisible();
  });

  test("o relatório sem resultado conta como visto e leva à avaliação", async ({ page }) => {
    await page.goto("/relatorio");
    await expect(page.getByText(/Você ainda não fez a avaliação/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Ir para a avaliação" })).toHaveAttribute("href", "/avaliacao");

    await expect
      .poll(async () => ((await stored(page, STORAGE.progress)) as { relatorio: { openedAt: string | null } } | null)?.relatorio.openedAt)
      .not.toBeNull();
    await expect(page.getByText("Trilha 25%")).toBeVisible();
  });

  test("o relatório com resultado mostra o desempenho e também conta como visto", async ({ page }) => {
    await seedState(page, { progress: { assessmentDone: true } });
    await page.goto("/relatorio");
    await expect(page.getByText("Relatório final")).toBeVisible();
    await expect(page.getByText(/Você acertou/)).toBeVisible();
    await expect
      .poll(async () => ((await stored(page, STORAGE.progress)) as { relatorio: { openedAt: string | null } } | null)?.relatorio.openedAt)
      .not.toBeNull();
  });
});

test.describe("registro do que foi visto", () => {
  test("virar páginas do e-book as registra e a primeira tela mostra o percentual", async ({ page }) => {
    await page.goto("/ebook");
    const leitor = page.frameLocator("iframe");
    await expect(leitor.locator("#pos")).toContainText("Página 1 de 18");
    await leitor.getByRole("button", { name: /Próxima/ }).click();
    await leitor.getByRole("button", { name: /Próxima/ }).click();
    await expect(leitor.locator("#pos")).toContainText("Página 3 de 18");

    expect(await stored(page, STORAGE.ebookPages)).toEqual([1, 2, 3]);
    await page.goto("/");
    await expect(trilha(page).getByRole("link", { name: /E-book/ })).toContainText("17%");
  });

  test("abrir elementos do mapa os registra, e o percurso guiado completa os quatro", async ({ page }) => {
    await page.goto("/mapa");
    await page.getByRole("button", { name: /^Objetivos/ }).click();
    expect(await stored(page, STORAGE.progress)).toMatchObject({ mapa: { elementsSeen: ["objetivos"] } });

    await page.getByRole("button", { name: "Percurso guiado" }).click();
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Próximo" }).click();
    const saved = (await stored(page, STORAGE.progress)) as { mapa: { elementsSeen: string[] } };
    expect([...saved.mapa.elementsSeen].sort()).toEqual(["atividades", "avaliacao", "objetivos", "publico"]);
  });

  test("em tela pequena, a lista do mapa registra o elemento quando o título aparece", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/mapa");
    await expect(page.getByRole("heading", { level: 2, name: "Público" })).toBeVisible();
    await expect
      .poll(async () => ((await stored(page, STORAGE.progress)) as { mapa: { elementsSeen: string[] } } | null)?.mapa.elementsSeen ?? [])
      .toContain("publico");
  });

  test("abrir o e-book não altera o que foi salvo das outras partes", async ({ page }) => {
    await seedState(page, { progress: { mapElements: ["publico"], answers: { q1: 0 } } });
    await page.goto("/avaliacao");
    const antes = await stored(page, STORAGE.progress);
    await page.goto("/ebook");
    expect(await stored(page, STORAGE.progress)).toEqual(antes);
  });
});

test.describe("migração e reinício", () => {
  test("quem tinha progresso no formato antigo mantém o relatório e perde o nome", async ({ page }) => {
    await seedState(page, { legacy: "relatorio" });
    await page.goto("/relatorio");
    await expect(page.getByText("Relatório final")).toBeVisible();
    await expect(page.getByText(/perguntas \(/)).toBeVisible();

    const raw = await page.evaluate((k) => localStorage.getItem(k), STORAGE.progress);
    expect(raw).not.toContain("Aluna Teste");
    expect(JSON.parse(raw ?? "null")).toMatchObject({ version: 2 });
  });

  test("apagar o progresso pede confirmação, limpa tudo e mantém as preferências", async ({ page }) => {
    await seedState(page, {
      progress: { ebookPages: ALL_EBOOK_PAGES, mapElements: ["publico"] },
      preferences: { theme: "dark" },
    });
    await page.goto("/");
    await expect(trilha(page).getByText(/Progresso da trilha: [1-9]/)).toBeVisible();

    await trilha(page).getByRole("button", { name: "Apagar meu progresso" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Apagar progresso" }).click();

    await expect(trilha(page).getByText("Progresso da trilha: 0%")).toBeVisible();
    expect(await stored(page, STORAGE.progress)).toBeNull();
    expect(await stored(page, STORAGE.ebookPages)).toBeNull();
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE.theme)).toBe("dark");
  });

  test("cancelar o diálogo de apagar não mexe em nada", async ({ page }) => {
    await seedState(page, { progress: { mapElements: ["publico"] } });
    await page.goto("/");
    await trilha(page).getByRole("button", { name: "Apagar meu progresso" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Cancelar" }).click();
    expect(await stored(page, STORAGE.progress)).toMatchObject({ mapa: { elementsSeen: ["publico"] } });
  });
});

test.describe("interações da avaliação", () => {
  // ---- Dicas de ferramenta (tooltips). Regressão da correção de `nested-interactive`:
  // o gatilho deixou de ser um `div role="button"` com um botão dentro.

  test("a dica do botão 'Apagar meu progresso' aparece ao passar o mouse", async ({ page }) => {
    await page.goto("/");
    // O React Aria só abre a dica por mouse depois de uma interação por ponteiro.
    await page.mouse.click(2, 2);
    await page.getByRole("button", { name: "Apagar meu progresso" }).hover();
    await expect(page.getByRole("tooltip")).toContainText("Apaga todo o progresso");
  });

  test("a dica de uma pergunta do menu mostra a competência avaliada", async ({ page }) => {
    await page.goto("/avaliacao");
    await page.mouse.click(2, 2);
    await page.getByRole("button", { name: /^Pergunta 1 / }).hover();
    await expect(page.getByRole("tooltip")).toHaveText(questions[0].topic);
  });

  test("o menu de perguntas navega ao clicar, mesmo com o tooltip", async ({ page }) => {
    await page.goto("/avaliacao");
    await page.getByRole("button", { name: /^Pergunta 2 / }).click();
    await expect(page.getByRole("region", { name: /Pergunta 2 de/ })).toBeVisible();
  });

  // ---- Retorno da resposta. UX-15, UX-18 e UX-19 (docs/revisao-fluxo-ux.md) foram
  // resolvidos removendo o toast: o resultado aparece no alerta da tela, dentro de
  // uma região `status` que o leitor de tela anuncia.

  test("o retorno da resposta é anunciado por uma região status", async ({ page }) => {
    await page.goto("/avaliacao");
    await confirmCorrect(page, questions[0]);
    await expect(page.getByRole("status").filter({ hasText: "Resposta correta" })).toBeVisible();
  });

  test("confirmar uma resposta não abre toast e o botão de avançar fica livre", async ({ page }) => {
    await page.goto("/avaliacao");
    await confirmCorrect(page, questions[0]);
    await expect(page.getByText("Resposta correta").first()).toBeVisible();
    await page.waitForTimeout(1500); // tempo que o toast antigo levava para cobrir o botão
    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Próxima pergunta" }).click({ timeout: 2000 });
    await expect(page.getByRole("region", { name: /Pergunta 2 de/ })).toBeVisible();
  });
});
