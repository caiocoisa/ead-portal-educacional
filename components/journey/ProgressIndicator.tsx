import { Check } from "lucide-react";
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
                  ? "bg-(--gold) text-(--brand)"
                  : "border border-white/50 text-white/80"
              }`}
            >
              {isDone ? <Check className="size-4" /> : index + 1}
            </span>
            <span
              className={`hidden text-sm sm:inline ${
                isCurrent ? "font-semibold" : "text-white/80"
              }`}
            >
              {STEP_LABELS[item]}
            </span>
            {index < STEP_ORDER.length - 1 ? (
              <span
                aria-hidden="true"
                className={`h-0.5 w-6 sm:w-10 ${
                  isDone ? "bg-(--gold)" : "bg-white/30"
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
