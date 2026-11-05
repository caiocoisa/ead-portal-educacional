import { expect, test } from "@playwright/test";
import { moduleContent } from "../../content/module";
import { seedState } from "../helpers/progress";

const questions = moduleContent.questions;

test.describe("jornada do aluno", () => {
  test("sem progresso, as etapas internas levam de volta à página inicial", async ({ page }) => {
    for (const rota of ["/video", "/avaliacao", "/relatorio"]) {
      await page.goto(rota);
      await expect(page).toHaveURL("/");
    }
  });

  test("percurso completo: identificação, vídeo, avaliação, relatório e reinício", async ({ page }) => {
    // Fluxo longo (4 perguntas, várias interações cada): o limite padrão de 30 s
    // estoura em máquinas lentas, sem que nenhum passo esteja errado.
    test.setTimeout(90_000);
    await page.goto("/");
    await page.getByLabel("Como podemos te chamar?").fill("Aluna Teste");
    await page.getByRole("button", { name: "Iniciar minha jornada" }).click();
    await expect(page).toHaveURL(/\/video$/);

    // O vídeo real ainda não existe (youtubeVideoId nulo): o botão libera a etapa.
    await page.getByRole("button", { name: "Concluir" }).click();
    await expect(page).toHaveURL(/\/avaliacao$/);

    for (const [index, question] of questions.entries()) {
      await page
        .getByRole("radio", { name: question.options[question.correctOptionIndex].slice(0, 60) })
        .check({ force: true });
      await page.getByRole("button", { name: "Confirmar resposta" }).click();
      await expect(page.getByText("Resposta correta").first()).toBeVisible();

      const ultima = index === questions.length - 1;
      await page.getByRole("button", { name: ultima ? "Ver relatório final" : "Próxima pergunta" }).click();
    }

    await expect(page).toHaveURL(/\/relatorio$/);
    await expect(page.getByText("Relatório final")).toBeVisible();
    await expect(page.getByText(/perguntas \(100%\)/)).toBeVisible();

    await page.getByRole("button", { name: "Reiniciar jornada" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Reiniciar", exact: true }).click();
    await expect(page).toHaveURL(/\/video$/);
  });

  test("uma alternativa de erro próximo mostra o retorno 'Quase lá'", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/avaliacao");
    const question = questions[0];
    await page
      .getByRole("radio", { name: question.options[question.feedback.near.optionIndex].slice(0, 60) })
      .check({ force: true });
    await page.getByRole("button", { name: "Confirmar resposta" }).click();
    await expect(page.getByText("Quase lá").first()).toBeVisible();
  });

  test("uma alternativa de erro distante mostra o retorno 'Vamos revisar'", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/avaliacao");
    const question = questions[0];
    const far = question.options.findIndex(
      (_, i) => i !== question.correctOptionIndex && i !== question.feedback.near.optionIndex
    );
    await page.getByRole("radio", { name: question.options[far].slice(0, 60) }).check({ force: true });
    await page.getByRole("button", { name: "Confirmar resposta" }).click();
    await expect(page.getByText("Vamos revisar").first()).toBeVisible();
  });

  test("não é possível pular etapas: cada rota leva à etapa em que o aluno está", async ({ page }) => {
    await seedState(page, { step: "video" });
    await page.goto("/avaliacao");
    await expect(page).toHaveURL(/\/video$/);
    await page.goto("/relatorio");
    await expect(page).toHaveURL(/\/video$/);
  });

  test("quem já tem progresso é levado da página inicial à etapa em que parou", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/");
    await expect(page).toHaveURL(/\/avaliacao$/);
  });

  // ---- Dicas de ferramenta (tooltips). Regressão da correção de `nested-interactive`:
  // o gatilho deixou de ser um `div role="button"` com um botão dentro.

  test("a dica do botão 'Início' aparece ao passar o mouse", async ({ page }) => {
    await seedState(page, { step: "video" });
    await page.goto("/video");
    // O React Aria só abre a dica por mouse depois de uma interação por ponteiro.
    await page.mouse.click(2, 2);
    await page.getByRole("button", { name: "Início" }).hover();
    await expect(page.getByRole("tooltip")).toContainText("apaga o progresso");
  });

  test("a dica de uma pergunta do menu mostra a competência avaliada", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/avaliacao");
    await page.mouse.click(2, 2);
    await page.getByRole("button", { name: /^Pergunta 1 / }).hover();
    await expect(page.getByRole("tooltip")).toHaveText(questions[0].topic);
  });

  test("o menu de perguntas navega ao clicar, mesmo com o tooltip", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/avaliacao");
    await page.getByRole("button", { name: /^Pergunta 2 / }).click();
    await expect(page.getByRole("region", { name: /Pergunta 2 de/ })).toBeVisible();
  });

  // ---- Retorno da resposta. UX-15, UX-18 e UX-19 (docs/revisao-fluxo-ux.md) foram
  // resolvidos removendo o toast: o resultado aparece no alerta da tela, dentro de
  // uma região `status` que o leitor de tela anuncia.

  test("o retorno da resposta é anunciado por uma região status", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/avaliacao");
    const question = questions[0];
    await page
      .getByRole("radio", { name: question.options[question.correctOptionIndex].slice(0, 60) })
      .check({ force: true });
    await page.getByRole("button", { name: "Confirmar resposta" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Resposta correta" })).toBeVisible();
  });

  test("confirmar uma resposta não abre toast e o botão de avançar fica livre", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/avaliacao");
    const question = questions[0];
    await page
      .getByRole("radio", { name: question.options[question.correctOptionIndex].slice(0, 60) })
      .check({ force: true });
    await page.getByRole("button", { name: "Confirmar resposta" }).click();
    await expect(page.getByText("Resposta correta").first()).toBeVisible();
    await page.waitForTimeout(1500); // tempo que o toast antigo levava para cobrir o botão
    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Próxima pergunta" }).click({ timeout: 2000 });
    await expect(page.getByRole("region", { name: /Pergunta 2 de/ })).toBeVisible();
  });

  // ---- Atritos conhecidos (docs/revisao-fluxo-ux.md): descrevem o comportamento
  // desejado e passam a valer quando a Task correspondente for implementada.

  test.fixme("UX-01 (Task 53): permite rever o vídeo estando na avaliação", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/video");
    await expect(page).toHaveURL(/\/video$/);
  });

  test.fixme("UX-04 (Task 51): retoma as respostas confirmadas depois de recarregar", async ({ page }) => {
    await seedState(page, { step: "avaliacao" });
    await page.goto("/avaliacao");
    const question = questions[0];
    await page
      .getByRole("radio", { name: question.options[question.correctOptionIndex].slice(0, 60) })
      .check({ force: true });
    await page.getByRole("button", { name: "Confirmar resposta" }).click();
    await page.reload();
    await expect(page.getByText("Resposta correta").first()).toBeVisible();
  });
});
