import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { moduleContent } from "../../content/module";
import {
  ALL_EBOOK_PAGES,
  seedState,
  STORAGE,
  type Contrast,
  type FontSize,
  type SeedProgress,
  type Theme,
} from "../helpers/progress";

const THEMES: Theme[] = ["light", "dark"];
const CONTRASTS: Contrast[] = ["normal", "high"];
const FONT_SIZES: FontSize[] = ["normal", "large", "extra-large"];

// WCAG 2.2 AA, a meta declarada no PRD (seção 4).
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

interface Screen {
  name: string;
  path: string;
  /** O que o aluno já viu antes de abrir a tela; sem isso, quem acabou de chegar. */
  progress?: SeedProgress;
  /** Elemento que só existe quando a tela terminou de carregar. */
  ready: (page: Page) => Locator;
}

const SCREENS: Screen[] = [
  { name: "início", path: "/", ready: (p) => p.getByRole("heading", { level: 1 }) },
  {
    name: "início com progresso",
    path: "/",
    progress: { ebookPages: ALL_EBOOK_PAGES, mapElements: ["publico", "objetivos"] },
    // Só no cartão da primeira tela: a régua da trilha também tem esse texto, mas fica escondida
    // abaixo de 1500 px, e um localizador que encontra dois elementos é recusado.
    ready: (p) => p.getByRole("region", { name: "Sua trilha" }).getByText(/Progresso da trilha: 38%/),
  },
  { name: "vídeo", path: "/video", ready: (p) => p.getByText("Vídeo em breve") },
  {
    name: "avaliação",
    path: "/avaliacao",
    ready: (p) => p.getByRole("button", { name: "Confirmar resposta" }),
  },
  {
    name: "relatório",
    path: "/relatorio",
    progress: { assessmentDone: true },
    ready: (p) => p.getByText("Relatório final"),
  },
  {
    name: "relatório sem resultado",
    path: "/relatorio",
    ready: (p) => p.getByText(/Você ainda não fez a avaliação/),
  },
  // O axe analisa também o leitor incorporado (iframe de mesma origem), na capa.
  {
    name: "e-book",
    path: "/ebook",
    ready: (p) => p.frameLocator("iframe").getByRole("button", { name: /Próxima/ }),
  },
  {
    name: "mapa",
    path: "/mapa",
    ready: (p) => p.getByRole("heading", { level: 1, name: "Mapa do alinhamento" }),
  },
  {
    name: "quadrinho",
    path: "/quadrinho",
    ready: (p) => p.getByRole("heading", { level: 1, name: "Quadrinho: duas sugestões da IA" }),
  },
];

// Falsos positivos conhecidos do axe-core. Cada item é estreito (regra + elemento)
// e vira uma anotação no resultado do teste; qualquer outra violação continua falhando.
const FALSOS_POSITIVOS = [
  {
    id: "aria-allowed-attr",
    elemento: 'data-slot="meter"',
    motivo:
      'O React Aria define role="meter progressbar" (lista de papéis válida no ARIA, com ' +
      "progressbar como alternativa para navegadores sem suporte a meter). O axe-core 4.14 não " +
      'reconhece a lista: com role="meter" ou role="progressbar" sozinhos, o mesmo elemento passa.',
  },
];

async function auditar(page: Page) {
  const { violations: todas } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const violations = todas.filter((v) => {
    const conhecido = FALSOS_POSITIVOS.find(
      (f) => f.id === v.id && v.nodes.every((n) => n.html.includes(f.elemento))
    );
    if (conhecido) {
      test.info().annotations.push({ type: "falso positivo conhecido", description: `${v.id}: ${conhecido.motivo}` });
    }
    return !conhecido;
  });
  const resumo = violations.map(
    (v) =>
      `${v.id} [${v.impact}] ${v.help}: ${v.nodes.length} elemento(s), ex.: ` +
      `${v.nodes[0]?.target.join(" ")} → ${(v.nodes[0]?.html ?? "").replace(/\s+/g, " ").slice(0, 170)} ` +
      `[${(v.nodes[0]?.failureSummary ?? "").replace(/\s+/g, " ").slice(0, 200)}]`
  );
  expect(resumo, "violações de acessibilidade (axe-core, WCAG 2.2 AA)").toEqual([]);
}

async function aguardarPreferencias(page: Page, theme: Theme, contrast: Contrast, fontSize: FontSize) {
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", theme);
  await expect(html).toHaveAttribute("data-contrast", contrast);
  await expect(html).toHaveAttribute("data-font-size", fontSize);
}

// Cada tela em cada uma das 12 combinações de tema × contraste × tamanho de fonte.
for (const theme of THEMES) {
  for (const contrast of CONTRASTS) {
    for (const fontSize of FONT_SIZES) {
      test.describe(`tema ${theme}, contraste ${contrast}, fonte ${fontSize}`, () => {
        for (const screen of SCREENS) {
          test(`tela de ${screen.name}`, async ({ page }) => {
            await seedState(page, { progress: screen.progress, preferences: { theme, contrast, fontSize } });
            await page.goto(screen.path);
            await aguardarPreferencias(page, theme, contrast, fontSize);
            await expect(screen.ready(page)).toBeVisible();
            await auditar(page);
          });
        }
      });
    }
  }
}

// Estados que só aparecem depois de uma interação: retorno da avaliação, aba do
// gabarito e menu de acessibilidade aberto. Cobrem tema × contraste, na fonte normal.
for (const theme of THEMES) {
  for (const contrast of CONTRASTS) {
    test.describe(`estados interativos, tema ${theme}, contraste ${contrast}`, () => {
      const preferences = { theme, contrast, fontSize: "normal" as const };

      test("avaliação com os três níveis de retorno", async ({ page }) => {
        await seedState(page, { preferences });
        await page.goto("/avaliacao");
        await aguardarPreferencias(page, theme, contrast, "normal");

        const question = moduleContent.questions[0];
        const near = question.feedback.near.optionIndex;
        const far = question.options.findIndex((_, i) => i !== question.correctOptionIndex && i !== near);
        const alvo = [
          { indice: question.correctOptionIndex, titulo: "Resposta correta" },
          { indice: near, titulo: "Quase lá" },
          { indice: far, titulo: "Vamos revisar" },
        ];
        for (const { indice, titulo } of alvo) {
          // As respostas confirmadas ficam salvas e a avaliação retoma de onde parou; para testar
          // cada nível isolado, apaga o progresso e recarrega.
          await page.evaluate((chave) => localStorage.removeItem(chave), STORAGE.progress);
          await page.goto("/avaliacao");
          await page.getByRole("radio", { name: question.options[indice].slice(0, 60) }).check({ force: true });
          await page.getByRole("button", { name: "Confirmar resposta" }).click();
          await expect(page.getByText(titulo).first()).toBeVisible();
          await auditar(page);
        }
      });

      test("relatório, aba do gabarito comentado com o primeiro item aberto", async ({ page }) => {
        await seedState(page, { progress: { assessmentDone: true }, preferences });
        await page.goto("/relatorio");
        await aguardarPreferencias(page, theme, contrast, "normal");
        await page.getByRole("tab", { name: "Gabarito comentado" }).click();
        await page.getByRole("button", { name: /Pergunta 1/ }).click();
        await auditar(page);
      });

      test("quadrinho com decisão errada, decisão certa e o roteiro em texto", async ({ page }) => {
        await seedState(page, { preferences });
        await page.goto("/quadrinho");
        await aguardarPreferencias(page, theme, contrast, "normal");
        for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Próximo" }).click();
        await expect(page.getByText("Painel 4 de 6")).toBeVisible();
        await page.getByRole("button", { name: /O plano não combina com o objetivo/ }).click();
        await expect(page.getByRole("status").getByText(/Ainda não\./)).toBeVisible();
        await auditar(page);
        await page.getByRole("button", { name: /A oficina não cabe na rotina/ }).click();
        await expect(page.getByRole("status").getByText(/Correto\./)).toBeVisible();
        await auditar(page);
        await page.getByRole("button", { name: "Roteiro em texto" }).click();
        await expect(page.getByRole("article")).toHaveCount(6);
        await auditar(page);
      });

      test("mapa com um elemento selecionado e a visão em lista", async ({ page }) => {
        await seedState(page, { preferences });
        await page.goto("/mapa");
        await aguardarPreferencias(page, theme, contrast, "normal");
        await page.getByRole("button", { name: /^Objetivos/ }).click();
        await expect(page.getByRole("region", { name: "Detalhe do elemento" }).getByRole("heading", { level: 2, name: "Objetivos" })).toBeVisible();
        await auditar(page);
        await page.getByRole("button", { name: "Percurso guiado" }).click();
        await auditar(page);
        await page.getByRole("button", { name: "Lista", exact: true }).click();
        await expect(page.getByRole("article")).toHaveCount(4);
        await auditar(page);
      });

      test("régua de acessibilidade, antes e depois de aumentar a fonte", async ({ page }) => {
        await seedState(page, { preferences });
        await page.goto("/mapa");
        await aguardarPreferencias(page, theme, contrast, "normal");
        const regua = page.getByRole("group", { name: "Controles de acessibilidade" });
        await expect(regua).toBeVisible();
        await auditar(page);

        await regua.getByRole("button", { name: /^A\+ Fonte/ }).click();
        await expect(page.locator("html")).toHaveAttribute("data-font-size", "large");
        await auditar(page);
      });
    });
  }
}

// Larguras em que a interface muda de forma: o celular (topo enxuto, linha de ajustes e barra inferior
// da trilha), o tablet, e a tela larga (régua da trilha à esquerda e painel de acessibilidade à
// direita). Cada uma em cada combinação de tema × contraste.
const LARGURAS = [
  { nome: "celular", width: 390, height: 844, fontSize: "normal" as const },
  { nome: "celular com fonte extra grande", width: 390, height: 844, fontSize: "extra-large" as const },
  { nome: "tablet", width: 800, height: 900, fontSize: "normal" as const },
  { nome: "tela larga", width: 1600, height: 900, fontSize: "normal" as const },
];
const ROTAS_POR_LARGURA = [
  { rota: "/", ready: (p: Page) => p.getByRole("heading", { level: 1 }) },
  { rota: "/mapa", ready: (p: Page) => p.getByRole("heading", { level: 1, name: "Mapa do alinhamento" }) },
  { rota: "/avaliacao", ready: (p: Page) => p.getByRole("button", { name: "Confirmar resposta" }) },
];

for (const theme of THEMES) {
  for (const contrast of CONTRASTS) {
    for (const largura of LARGURAS) {
      test(`${largura.nome}, tema ${theme}, contraste ${contrast}: primeira tela, mapa e avaliação`, async ({ page }) => {
        await page.setViewportSize({ width: largura.width, height: largura.height });
        await seedState(page, {
          progress: { ebookPages: ALL_EBOOK_PAGES, mapElements: ["publico", "objetivos"] },
          preferences: { theme, contrast, fontSize: largura.fontSize },
        });
        for (const { rota, ready } of ROTAS_POR_LARGURA) {
          await page.goto(rota);
          await aguardarPreferencias(page, theme, contrast, largura.fontSize);
          await expect(ready(page)).toBeVisible();
          await auditar(page);
        }
      });
    }
  }
}
