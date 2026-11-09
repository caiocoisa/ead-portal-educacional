import { Chip, ProgressCircle, Tooltip } from "@heroui/react";
import { Check, Circle, X } from "lucide-react";
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
      className="surface-card flex shrink-0 flex-col gap-2 rounded-xl p-3 lg:w-64 lg:gap-3 lg:overflow-y-auto lg:p-4"
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
          // Mesmo texto no chip visível e no `aria-label`: o nome acessível precisa
          // conter o texto visível (WCAG 2.5.3, regra `label-content-name-mismatch`).
          const statusText = !isAnswered ? "Pendente" : isCorrect ? "Correta" : "Revisar";
          return (
            <li key={question.id} className="shrink-0">
              <Tooltip delay={300}>
              {/* `render` faz do próprio <button> o gatilho do tooltip, em vez de
                  aninhá-lo num `div role="button"` (`nested-interactive` no axe-core). */}
              <Tooltip.Trigger<"button">
                render={(triggerProps) => (
              <button
                {...triggerProps}
                type="button"
                onClick={() => onNavigate(index)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Pergunta ${index + 1} ${statusText}`}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isCurrent
                    ? "surface-primary border-(--accent) text-(--accent-foreground)"
                    : "border-(--border) hover:bg-(--surface-secondary) hover:bg-(image:--grad-tint)"
                }`}
              >
                <span className="font-medium">Pergunta {index + 1}</span>
                {/* Espaço real entre o texto e o chip: sem ele o texto visível vira
                    "Pergunta 1Pendente" e não casa com o `aria-label`. */}
                {" "}
                <Chip
                  size="sm"
                  variant={isCurrent ? "primary" : "soft"}
                  color={!isAnswered ? "default" : isCorrect ? "success" : "danger"}
                  className="ml-auto hidden lg:inline-flex"
                >
                  <Chip.Label>{statusText}</Chip.Label>
                </Chip>
                <span aria-hidden="true" className="lg:hidden">
                  {!isAnswered ? (
                    <Circle className="size-4" />
                  ) : isCorrect ? (
                    <Check className="size-4" />
                  ) : (
                    <X className="size-4" />
                  )}
                </span>
              </button>
                )}
              />
              <Tooltip.Content>{question.topic}</Tooltip.Content>
              </Tooltip>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
