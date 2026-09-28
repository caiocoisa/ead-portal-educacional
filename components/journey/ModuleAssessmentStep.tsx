"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { moduleContent } from "@/content/module";
import { gradeQuiz } from "@/lib/quiz/gradeQuiz";
import { resolveFeedback } from "@/lib/quiz/resolveFeedback";
import type { ResolvedFeedback } from "@/lib/quiz/resolveFeedback";
import { userProgressRepository } from "@/services/user-progress";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";
import { AnswerFeedback } from "@/components/quiz/AnswerFeedback";

const questions = moduleContent.questions;

export function ModuleAssessmentStep() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<ResolvedFeedback | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  function handleConfirm() {
    if (selectedOptionIndex === null) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOptionIndex }));
    setFeedback(resolveFeedback(currentQuestion, selectedOptionIndex));
  }

  function handleContinue() {
    const finalAnswers = { ...answers, [currentQuestion.id]: selectedOptionIndex! };

    if (isLastQuestion) {
      const result = gradeQuiz(questions, finalAnswers);
      userProgressRepository.saveAssessmentResult(result);
      router.push("/relatorio");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOptionIndex(null);
    setFeedback(null);
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Card>
        <Card.Header>
          <Card.Title>Avaliação</Card.Title>
          <Card.Description>
            Pergunta {currentIndex + 1} de {questions.length}
          </Card.Description>
        </Card.Header>
      </Card>

      <QuestionRenderer
        question={currentQuestion}
        index={currentIndex}
        selectedOptionIndex={selectedOptionIndex}
        onSelect={setSelectedOptionIndex}
        isDisabled={feedback !== null}
      />

      {feedback ? (
        <>
          <AnswerFeedback level={feedback.level} message={feedback.message} />
          <Button onPress={handleContinue} fullWidth>
            {isLastQuestion ? "Ver relatório final" : "Próxima pergunta"}
          </Button>
        </>
      ) : (
        <Button
          isDisabled={selectedOptionIndex === null}
          onPress={handleConfirm}
          fullWidth
        >
          Confirmar resposta
        </Button>
      )}
    </div>
  );
}
