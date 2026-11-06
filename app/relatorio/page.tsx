"use client";

import { useEffect } from "react";
import { useHydrated } from "@/lib/journey/useHydrated";
import { useProgress } from "@/lib/journey/useProgress";
import { progressRepository } from "@/services/user-progress";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { JourneyLayout } from "@/components/journey/JourneyLayout";
import { FinalReport } from "@/components/journey/FinalReport";
import { ReportEmptyState } from "@/components/journey/ReportEmptyState";

/** Página livre: conta como vista ao abrir, com ou sem resultado da avaliação. */
export default function RelatorioPage() {
  const isHydrated = useHydrated();
  const { result } = useProgress().avaliacao;

  useEffect(() => {
    progressRepository.markReportOpened();
  }, []);

  if (!isHydrated) return <JourneyLoading />;

  return (
    <JourneyLayout>
      {result ? <FinalReport assessmentResult={result} /> : <ReportEmptyState />}
    </JourneyLayout>
  );
}
