import { describe, expect, it } from "vitest";
import { gradeQuiz } from "@/lib/quiz/gradeQuiz";
import type { Question } from "@/types/quiz";

function question(id: string, correctOptionIndex: number): Question {
  return {
    id,
    topic: `Tópico ${id}`,
    type: "text",
    prompt: "Enunciado",
    options: ["A", "B", "C", "D"],
    correctOptionIndex,
    feedback: { correct: "ok", near: { optionIndex: 0, message: "perto" }, far: "longe" },
  };
}

describe("gradeQuiz", () => {
  const questions = [question("q1", 1), question("q2", 2), question("q3", 0)];

  it("conta os acertos e o total", () => {
    const result = gradeQuiz(questions, { q1: 1, q2: 0, q3: 0 });
    expect(result.correctCount).toBe(2);
    expect(result.totalCount).toBe(3);
  });

  it("registra, por pergunta, a alternativa escolhida e se estava correta", () => {
    const result = gradeQuiz(questions, { q1: 1, q2: 0, q3: 0 });
    expect(result.answers).toEqual([
      { questionId: "q1", selectedOptionIndex: 1, correct: true },
      { questionId: "q2", selectedOptionIndex: 0, correct: false },
      { questionId: "q3", selectedOptionIndex: 0, correct: true },
    ]);
  });

  it("trata pergunta sem resposta como incorreta", () => {
    const result = gradeQuiz(questions, { q1: 1 });
    expect(result.correctCount).toBe(1);
    expect(result.answers[1].correct).toBe(false);
  });

  it("devolve zero acertos quando nada foi respondido", () => {
    const result = gradeQuiz(questions, {});
    expect(result.correctCount).toBe(0);
    expect(result.totalCount).toBe(3);
  });
});
