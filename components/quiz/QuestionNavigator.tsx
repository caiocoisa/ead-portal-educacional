import { Chip, ProgressCircle, Tooltip } from "@heroui/react";
import type { Question } from "@/types/quiz";

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  /** IDs das perguntas já respondidas (confirmadas). */
  answeredIds: Set<string>;
  /** IDs das perguntas respondidas corretamente. */
  correctIds: Set<string>;
  onNavigate: (index: number) => void;
}

/**
 * Menu lateral (em telas pequenas vira uma faixa horizontal no topo) com o
 * estado de cada pergunta, permitindo navegar livremente entre elas.
 */
export function QuestionNavigator({
  questions,
  currentIndex,
  answeredIds,
  correctIds,
  onNavigate,
}: QuestionNavigatorProps) {
  const answeredCount = answeredIds.size;
  const percent = (answeredCount / questions.length) * 100;

  return (
    <nav
      aria-label="Perguntas da avaliação"
      className="flex shrink-0 flex-col gap-2 rounded-xl border border-(--border) bg-(--surface) p-3 lg:w-64 lg:gap-3 lg:overflow-y-auto lg:p-4"
    >
      <div className="hidden items-center gap-3 lg:flex">
        <ProgressCircle
          value={percent}
          size="lg"
          color="accent"
          aria-label={`${answeredCount} de ${questions.length} perguntas respondidas`}
        >
          <ProgressCircle.Track>
            <ProgressCircle.TrackCircle />
            <ProgressCircle.FillCircle />
          </ProgressCircle.Track>
        </ProgressCircle>
        <div className="flex flex-col">
          <span className="font-semibold">
            {answeredCount} de {questions.length}
          </span>
          <span className="text-sm text-(--muted)">respondidas</span>
        </div>
      </div>

      <p className="text-sm font-medium lg:hidden">
        {answeredCount} de {questions.length} respondidas
      </p>
      <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = answeredIds.has(question.id);
          const isCorrect = correctIds.has(question.id);
          const statusLabel = !isAnswered
            ? "não respondida"
            : isCorrect
              ? "correta"
              : "incorreta";
          return (
            <li key={question.id} className="shrink-0">
              <Tooltip delay={300}>
              <Tooltip.Trigger>
              <button
                type="button"
                onClick={() => onNavigate(index)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Pergunta ${index + 1}, ${statusLabel}`}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isCurrent
                    ? "border-(--accent) bg-(--accent) text-(--accent-foreground)"
                    : "border-(--border) hover:bg-(--surface-secondary)"
                }`}
              >
                <span className="font-medium">Pergunta {index + 1}</span>
                <Chip
                  size="sm"
                  variant={isCurrent ? "primary" : "soft"}
                  color={!isAnswered ? "default" : isCorrect ? "success" : "danger"}
                  className="ml-auto hidden lg:inline-flex"
                >
                  <Chip.Label>
                    {!isAnswered ? "Pendente" : isCorrect ? "Correta" : "Revisar"}
                  </Chip.Label>
                </Chip>
                <span aria-hidden="true" className="lg:hidden">
                  {!isAnswered ? "○" : isCorrect ? "✓" : "✗"}
                </span>
              </button>
              </Tooltip.Trigger>
              <Tooltip.Content>{question.topic}</Tooltip.Content>
              </Tooltip>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
