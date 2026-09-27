import type { AssessmentResult, Question } from "@/types/quiz";

/** Corrige o quiz comparando as respostas selecionadas com o gabarito. */
export function gradeQuiz(
  questions: Question[],
  answers: Record<string, number>
): AssessmentResult {
  const answeredQuestions = questions.map((question) => {
    const selectedOptionIndex = answers[question.id];
    return {
      questionId: question.id,
      selectedOptionIndex,
      correct: selectedOptionIndex === question.correctOptionIndex,
    };
  });

  const correctCount = answeredQuestions.filter((a) => a.correct).length;

  return {
    answers: answeredQuestions,
    correctCount,
    totalCount: questions.length,
  };
}
