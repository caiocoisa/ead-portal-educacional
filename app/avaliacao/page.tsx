"use client";

import { useJourneyGuard } from "@/lib/journey/useJourneyGuard";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { JourneyLayout } from "@/components/journey/JourneyLayout";
import { ModuleAssessmentStep } from "@/components/journey/ModuleAssessmentStep";

export default function AvaliacaoPage() {
  const { isChecking, progress } = useJourneyGuard("avaliacao");

  if (isChecking || !progress) return <JourneyLoading />;

  return (
    <JourneyLayout userName={progress.userName} step="avaliacao">
      <ModuleAssessmentStep />
    </JourneyLayout>
  );
}
