import { describe, expect, it } from "vitest";
import { moduleContent } from "@/content/module";
import { resolveFeedback } from "@/lib/quiz/resolveFeedback";

describe("resolveFeedback", () => {
  for (const question of moduleContent.questions) {
    describe(`pergunta ${question.id}`, () => {
      it("acerto devolve o retorno de acerto", () => {
        const result = resolveFeedback(question, question.correctOptionIndex);
        expect(result.level).toBe("correct");
        expect(result.message).toBe(question.feedback.correct);
      });

      it("a alternativa de erro próximo devolve o retorno de erro próximo", () => {
        const result = resolveFeedback(question, question.feedback.near.optionIndex);
        expect(result.level).toBe("near");
        expect(result.message).toBe(question.feedback.near.message);
      });

      it("as demais alternativas devolvem o retorno de erro distante", () => {
        question.options.forEach((_, index) => {
          if (index === question.correctOptionIndex) return;
          if (index === question.feedback.near.optionIndex) return;
          const result = resolveFeedback(question, index);
          expect(result.level).toBe("far");
          expect(result.message).toBe(question.feedback.far);
        });
      });
    });
  }
});
