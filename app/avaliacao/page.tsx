"use client";

import { useHydrated } from "@/lib/journey/useHydrated";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { JourneyLayout } from "@/components/journey/JourneyLayout";
import { ModuleAssessmentStep } from "@/components/journey/ModuleAssessmentStep";

/** Página livre: espera só a leitura das respostas salvas, para retomar de onde parou. */
export default function AvaliacaoPage() {
  const isHydrated = useHydrated();

  if (!isHydrated) return <JourneyLoading />;

  return (
    <JourneyLayout>
      <ModuleAssessmentStep />
    </JourneyLayout>
  );
}
