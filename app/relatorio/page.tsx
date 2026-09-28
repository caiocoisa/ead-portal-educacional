"use client";

import { useJourneyGuard } from "@/lib/journey/useJourneyGuard";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { JourneyLayout } from "@/components/journey/JourneyLayout";
import { FinalReport } from "@/components/journey/FinalReport";

export default function RelatorioPage() {
  const { isChecking, progress } = useJourneyGuard("relatorio");

  if (isChecking || !progress || !progress.assessmentResult) {
    return <JourneyLoading />;
  }

  return (
    <JourneyLayout userName={progress.userName} step="relatorio">
      <FinalReport assessmentResult={progress.assessmentResult} />
    </JourneyLayout>
  );
}
