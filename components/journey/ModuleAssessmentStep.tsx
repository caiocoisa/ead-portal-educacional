"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { moduleContent } from "@/content/module";
import { gradeQuiz } from "@/lib/quiz/gradeQuiz";
import { resolveFeedback } from "@/lib/quiz/resolveFeedback";
import { userProgressRepository } from "@/services/user-progress";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";
import { QuestionNavigator } from "@/components/quiz/QuestionNavigator";
import { AnswerFeedback } from "@/components/quiz/AnswerFeedback";

const questions = moduleContent.questions;

export function ModuleAssessmentStep() {
  const router = useRouter();
  /** Respostas já confirmadas (bloqueadas, com retorno pedagógico). */
  const [answers, setAnswers] = useState<Record<string, number>>({});
  /** Alternativa marcada, ainda não confirmada, por pergunta. */
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const confirmedOption = answers[currentQuestion.id];
  const isConfirmed = confirmedOption !== undefined;
  const selectedOption = isConfirmed ? confirmedOption : drafts[currentQuestion.id];
  const feedback = isConfirmed
    ? resolveFeedback(currentQuestion, confirmedOption)
    : null;

  const answeredIds = useMemo(() => new Set(Object.keys(answers)), [answers]);
  const correctIds = useMemo(
    () =>
      new Set(
        questions
          .filter((q) => answers[q.id] === q.correctOptionIndex)
          .map((q) => q.id)
      ),
    [answers]
  );
  const allAnswered = answeredIds.size === questions.length;
  const nextPendingIndex = questions.findIndex(
    (q, i) => i > currentIndex && answers[q.id] === undefined
  );

  function handleSelect(optionIndex: number) {
    setDrafts((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  }

  function handleConfirm() {
    if (selectedOption === undefined) return;
    // O retorno aparece no alerta abaixo da pergunta (região `status`). Não há
    // toast: ele cobria o botão de avançar (UX-18) e duplicava o alerta (UX-15).
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOption }));
  }

  function handleFinish() {
    const result = gradeQuiz(questions, answers);
    userProgressRepository.saveAssessmentResult(result);
    router.push("/relatorio");
  }

  function renderAction() {
    if (!isConfirmed) {
      return (
        <Button isDisabled={selectedOption === undefined} onPress={handleConfirm}>
          Confirmar resposta
        </Button>
      );
    }
    if (allAnswered) {
      return <Button onPress={handleFinish}>Ver relatório final</Button>;
    }
    const target =
      nextPendingIndex !== -1
        ? nextPendingIndex
        : questions.findIndex((q) => answers[q.id] === undefined);
    return (
      <Button onPress={() => setCurrentIndex(target)}>Próxima pergunta</Button>
    );
  }

  return (
    <div className="flex h-full w-full max-w-5xl flex-col gap-4 lg:flex-row">
      <QuestionNavigator
        questions={questions}
        currentIndex={currentIndex}
        answeredIds={answeredIds}
        correctIds={correctIds}
        onNavigate={setCurrentIndex}
      />

      <section
        aria-label={`Pergunta ${currentIndex + 1} de ${questions.length}`}
        className="flex min-h-0 flex-1 flex-col rounded-xl border border-(--border) bg-(--surface)"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
          <QuestionRenderer
            question={currentQuestion}
            index={currentIndex}
            total={questions.length}
            selectedOptionIndex={selectedOption ?? null}
            onSelect={handleSelect}
            revealedCorrectIndex={isConfirmed ? currentQuestion.correctOptionIndex : undefined}
          />
          {/* Região de anúncio sempre presente: é ela que faz o leitor de tela ler
              o resultado ao confirmar (antes, quem anunciava era o toast). Vazia, o
              `empty:-mt-4` cancela o espaço que a coluna reservaria para ela. */}
          <div role="status" aria-live="polite" aria-atomic="true" className="empty:-mt-4">
            {feedback ? (
              <AnswerFeedback level={feedback.level} message={feedback.message} />
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-(--border) p-3 sm:px-6">
          <Button
            variant="ghost"
            isDisabled={currentIndex === 0}
            onPress={() => setCurrentIndex((i) => i - 1)}
          >
            ← Anterior
          </Button>
          {renderAction()}
        </div>
      </section>
    </div>
  );
}
