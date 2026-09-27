"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { moduleContent } from "@/content/module";
import { gradeQuiz } from "@/lib/quiz/gradeQuiz";
import { userProgressRepository } from "@/services/user-progress";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";

export function ModuleAssessmentStep() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const allAnswered = useMemo(
    () => moduleContent.questions.every((q) => answers[q.id] !== undefined),
    [answers]
  );

  function handleSelect(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    const result = gradeQuiz(moduleContent.questions, answers);
    userProgressRepository.saveAssessmentResult(result);
    router.push("/relatorio");
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Card>
        <Card.Header>
          <Card.Title>Avaliação</Card.Title>
          <Card.Description>
            Responda todas as perguntas para concluir o módulo.
          </Card.Description>
        </Card.Header>
      </Card>
      {moduleContent.questions.map((question, index) => (
        <QuestionRenderer
          key={question.id}
          question={question}
          index={index}
          selectedOptionIndex={answers[question.id] ?? null}
          onSelect={(optionIndex) => handleSelect(question.id, optionIndex)}
        />
      ))}
      <Button isDisabled={!allAnswered} onPress={handleSubmit} fullWidth>
        Enviar avaliação
      </Button>
    </div>
  );
}
