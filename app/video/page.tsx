"use client";

import { useJourneyGuard } from "@/lib/journey/useJourneyGuard";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { JourneyLayout } from "@/components/journey/JourneyLayout";
import { ModuleVideoStep } from "@/components/journey/ModuleVideoStep";

export default function VideoPage() {
  const { isChecking, progress } = useJourneyGuard("video");

  if (isChecking || !progress) return <JourneyLoading />;

  return (
    <JourneyLayout userName={progress.userName} step="video">
      <ModuleVideoStep />
    </JourneyLayout>
  );
}
