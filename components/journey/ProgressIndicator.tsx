import { ProgressBar } from "@heroui/react";
import type { JourneyStep } from "@/types/progress";

const STEP_ORDER: JourneyStep[] = ["video", "avaliacao", "relatorio"];
const STEP_LABELS: Record<JourneyStep, string> = {
  video: "Vídeo",
  avaliacao: "Avaliação",
  relatorio: "Relatório final",
};

interface ProgressIndicatorProps {
  step: JourneyStep;
}

export function ProgressIndicator({ step }: ProgressIndicatorProps) {
  const currentIndex = STEP_ORDER.indexOf(step);
  const value = ((currentIndex + 1) / STEP_ORDER.length) * 100;

  return (
    <div className="flex w-full flex-col gap-1">
      <ProgressBar
        value={value}
        minValue={0}
        maxValue={100}
        aria-label={`Progresso da jornada: ${STEP_LABELS[step]}`}
      >
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
      <span className="text-sm text-zinc-500">
        Etapa {currentIndex + 1} de {STEP_ORDER.length}: {STEP_LABELS[step]}
      </span>
    </div>
  );
}
