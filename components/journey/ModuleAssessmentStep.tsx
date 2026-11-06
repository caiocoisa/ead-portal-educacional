"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { moduleContent } from "@/content/module";
import { useProgress } from "@/lib/journey/useProgress";
import { gradeQuiz } from "@/lib/quiz/gradeQuiz";
import { resolveFeedback } from "@/lib/quiz/resolveFeedback";
import { progressRepository } from "@/services/user-progress";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";
import { QuestionNavigator } from "@/components/quiz/QuestionNavigator";
import { AnswerFeedback } from "@/components/quiz/AnswerFeedback";

const questions = moduleContent.questions;

export function ModuleAssessmentStep() {
  const router = useRouter();
  /** Respostas já confirmadas (bloqueadas, com retorno pedagógico), salvas no progresso. */
  const answers = useProgress().avaliacao.answers;
  /** Alternativa marcada, ainda não confirmada, por pergunta. */
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  /**
   * Pergunta aberta. Nulo enquanto o aluno não navegou: aí vale a primeira sem resposta, o que
   * retoma de onde parou ao recarregar (ou a última, se todas já foram respondidas).
   */
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);

  const answeredIds = useMemo(
    () => new Set(questions.filter((q) => answers[q.id] !== undefined).map((q) => q.id)),
    [answers]
  );
  const allAnswered = answeredIds.size === questions.length;
  const firstPendingIndex = questions.findIndex((q) => answers[q.id] === undefined);
  const currentIndex =
    chosenIndex ?? (firstPendingIndex === -1 ? questions.length - 1 : firstPendingIndex);

  const currentQuestion = questions[currentIndex];
  const confirmedOption = answers[currentQuestion.id];
  const isConfirmed = confirmedOption !== undefined;
  const selectedOption = isConfirmed ? confirmedOption : drafts[currentQuestion.id];
  const feedback = isConfirmed
    ? resolveFeedback(currentQuestion, confirmedOption)
    : null;

  const correctIds = useMemo(
    () =>
      new Set(
        questions
          .filter((q) => answers[q.id] === q.correctOptionIndex)
          .map((q) => q.id)
      ),
    [answers]
  );
  const nextPendingIndex = questions.findIndex(
    (q, i) => i > currentIndex && answers[q.id] === undefined
  );

  function handleSelect(optionIndex: number) {
    setDrafts((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  }

  function handleConfirm() {
    if (selectedOption === undefined) return;
    // Fixa a pergunta aberta antes de gravar: sem isso, a primeira sem resposta passaria a ser a
    // seguinte e a tela pularia antes de mostrar o retorno.
    setChosenIndex(currentIndex);
    // O retorno aparece no alerta abaixo da pergunta (região `status`). Não há
    // toast: ele cobria o botão de avançar (UX-18) e duplicava o alerta (UX-15).
    progressRepository.saveAnswer(currentQuestion.id, selectedOption);
  }

  function handleFinish() {
    const result = gradeQuiz(questions, answers);
    progressRepository.saveAssessmentResult(result);
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
      <Button onPress={() => setChosenIndex(target)}>Próxima pergunta</Button>
    );
  }

  return (
    <div className="flex h-full w-full max-w-5xl flex-col gap-4 lg:flex-row">
      <QuestionNavigator
        questions={questions}
        currentIndex={currentIndex}
        answeredIds={answeredIds}
        correctIds={correctIds}
        onNavigate={setChosenIndex}
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
            onPress={() => setChosenIndex(currentIndex - 1)}
          >
            ← Anterior
          </Button>
          {renderAction()}
        </div>
      </section>
    </div>
  );
}
