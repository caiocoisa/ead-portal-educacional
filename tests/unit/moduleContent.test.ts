import { describe, expect, it } from "vitest";
import { moduleContent } from "@/content/module";

// Integridade do banco de questões: pega erros de digitação nos índices e
// itens malformados antes de chegarem ao aluno. Vale para qualquer quantidade
// de perguntas, inclusive depois do banco v2 (Task 47).
describe("conteúdo do módulo (content/module.ts)", () => {
  const { questions } = moduleContent;

  it("tem pelo menos uma pergunta", () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  it("usa identificadores de pergunta únicos", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe.each(questions.map((q) => [q.id, q] as const))("pergunta %s", (_id, q) => {
    it("tem competência e enunciado preenchidos", () => {
      expect(q.topic.trim()).not.toBe("");
      expect(q.prompt.length).toBeGreaterThan(0);
    });

    it("tem pelo menos duas alternativas, todas preenchidas e distintas", () => {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.every((o) => o.trim() !== "")).toBe(true);
      expect(new Set(q.options).size).toBe(q.options.length);
    });

    it("aponta a alternativa correta para um índice existente", () => {
      expect(Number.isInteger(q.correctOptionIndex)).toBe(true);
      expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctOptionIndex).toBeLessThan(q.options.length);
    });

    it("tem uma alternativa de erro próximo válida e diferente da correta", () => {
      const near = q.feedback.near.optionIndex;
      expect(Number.isInteger(near)).toBe(true);
      expect(near).toBeGreaterThanOrEqual(0);
      expect(near).toBeLessThan(q.options.length);
      expect(near).not.toBe(q.correctOptionIndex);
    });

    it("tem os três retornos pedagógicos preenchidos", () => {
      expect(q.feedback.correct.trim()).not.toBe("");
      expect(q.feedback.near.message.trim()).not.toBe("");
      expect(q.feedback.far.trim()).not.toBe("");
    });
  });
});
