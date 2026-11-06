"use client";

import { useHydrated } from "@/lib/journey/useHydrated";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { JourneyMain } from "@/components/journey/JourneyMain";
import { ModuleAssessmentStep } from "@/components/journey/ModuleAssessmentStep";

/** Página livre: espera só a leitura das respostas salvas, para retomar de onde parou. */
export default function AvaliacaoPage() {
  const isHydrated = useHydrated();

  return (
    <JourneyMain>
      {isHydrated ? <ModuleAssessmentStep /> : <JourneyLoading fullScreen={false} />}
    </JourneyMain>
  );
}
