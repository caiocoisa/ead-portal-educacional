import type { FeedbackLevel, Question } from "@/types/quiz";

export interface ResolvedFeedback {
  level: FeedbackLevel;
  message: string;
}

/** Determina o retorno pedagógico (acerto/erro próximo/erro distante) para a alternativa escolhida. */
export function resolveFeedback(
  question: Question,
  selectedOptionIndex: number
): ResolvedFeedback {
  if (selectedOptionIndex === question.correctOptionIndex) {
    return { level: "correct", message: question.feedback.correct };
  }
  if (selectedOptionIndex === question.feedback.near.optionIndex) {
    return { level: "near", message: question.feedback.near.message };
  }
  return { level: "far", message: question.feedback.far };
}
