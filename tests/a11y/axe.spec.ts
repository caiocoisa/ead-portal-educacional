import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { moduleContent } from "../../content/module";
import {
  seedState,
  type Contrast,
  type FontSize,
  type Theme,
} from "../helpers/progress";
import type { JourneyStep } from "../../types/progress";

const THEMES: Theme[] = ["light", "dark"];
const CONTRASTS: Contrast[] = ["normal", "high"];
const FONT_SIZES: FontSize[] = ["normal", "large", "extra-large"];

// WCAG 2.2 AA, a meta declarada no PRD (seção 4).
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

interface Screen {
  name: string;
  path: string;
  step?: JourneyStep;
  /** Elemento que só existe quando a tela terminou de carregar. */
  ready: (page: Page) => Locator;
}

const SCREENS: Screen[] = [
  { name: "início", path: "/", ready: (p) => p.getByRole("heading", { level: 1 }) },
  { name: "vídeo", path: "/video", step: "video", ready: (p) => p.getByRole("button", { name: "Concluir" }) },
  {
    name: "avaliação",
    path: "/avaliacao",
    step: "avaliacao",
    ready: (p) => p.getByRole("button", { name: "Confirmar resposta" }),
  },
  { name: "relatório", path: "/relatorio", step: "relatorio", ready: (p) => p.getByText("Relatório final") },
  // O axe analisa também o leitor incorporado (iframe de mesma origem), na capa.
  {
    name: "e-book",
    path: "/ebook",
    ready: (p) => p.frameLocator("iframe").getByRole("button", { name: /Próxima/ }),
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
            await seedState(page, { step: screen.step, preferences: { theme, contrast, fontSize } });
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
        await seedState(page, { step: "avaliacao", preferences });
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
          // Recarrega para limpar a confirmação anterior e testar cada nível isolado.
          await page.goto("/avaliacao");
          await page.getByRole("radio", { name: question.options[indice].slice(0, 60) }).check({ force: true });
          await page.getByRole("button", { name: "Confirmar resposta" }).click();
          await expect(page.getByText(titulo).first()).toBeVisible();
          await auditar(page);
        }
      });

      test("relatório, aba do gabarito comentado com o primeiro item aberto", async ({ page }) => {
        await seedState(page, { step: "relatorio", preferences });
        await page.goto("/relatorio");
        await aguardarPreferencias(page, theme, contrast, "normal");
        await page.getByRole("tab", { name: "Gabarito comentado" }).click();
        await page.getByRole("button", { name: /Pergunta 1/ }).click();
        await auditar(page);
      });

      test("menu de acessibilidade aberto", async ({ page }) => {
        await seedState(page, { step: "video", preferences });
        await page.goto("/video");
        await aguardarPreferencias(page, theme, contrast, "normal");
        await page.getByRole("button", { name: "Abrir menu de acessibilidade" }).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await auditar(page);
      });
    });
  }
}
