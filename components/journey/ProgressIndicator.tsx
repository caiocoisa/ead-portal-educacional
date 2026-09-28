import type { JourneyStep } from "@/types/progress";

const STEP_ORDER: JourneyStep[] = ["video", "avaliacao", "relatorio"];
const STEP_LABELS: Record<JourneyStep, string> = {
  video: "Vídeo",
  avaliacao: "Avaliação",
  relatorio: "Relatório",
};

interface ProgressIndicatorProps {
  step: JourneyStep;
}

export function ProgressIndicator({ step }: ProgressIndicatorProps) {
  const currentIndex = STEP_ORDER.indexOf(step);

  return (
    <ol
      aria-label={`Progresso da jornada: etapa ${currentIndex + 1} de ${STEP_ORDER.length}, ${STEP_LABELS[step]}`}
      className="flex items-center gap-2"
    >
      {STEP_ORDER.map((item, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li
            key={item}
            aria-current={isCurrent ? "step" : undefined}
            className="flex items-center gap-2"
          >
            <span
              aria-hidden="true"
              className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                isDone || isCurrent
                  ? "bg-(--accent) text-(--accent-foreground)"
                  : "border border-(--border) text-(--muted)"
              }`}
            >
              {isDone ? "✓" : index + 1}
            </span>
            <span
              className={`hidden text-sm sm:inline ${
                isCurrent ? "font-semibold" : "text-(--muted)"
              }`}
            >
              {STEP_LABELS[item]}
            </span>
            {index < STEP_ORDER.length - 1 ? (
              <span
                aria-hidden="true"
                className={`h-0.5 w-6 sm:w-10 ${
                  isDone ? "bg-(--accent)" : "bg-(--border)"
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
