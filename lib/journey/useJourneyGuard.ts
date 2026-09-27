"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userProgressRepository } from "@/services/user-progress";
import type { JourneyStep, UserProgress } from "@/types/progress";

const STEP_ROUTES: Record<JourneyStep, string> = {
  video: "/video",
  avaliacao: "/avaliacao",
  relatorio: "/relatorio",
};

interface JourneyGuardResult {
  /** true enquanto o redirecionamento (se necessário) ainda não foi decidido. */
  isChecking: boolean;
  progress: UserProgress | null;
}

/**
 * Garante que o aluno só acesse `expectedStep` se o progresso salvo indicar
 * exatamente essa etapa; caso contrário, redireciona para a etapa correta
 * (ou para a página de boas-vindas, se não houver progresso).
 */
export function useJourneyGuard(expectedStep: JourneyStep): JourneyGuardResult {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const current = userProgressRepository.getCurrent();

    if (!current) {
      router.replace("/");
      return;
    }

    if (current.currentStep !== expectedStep) {
      router.replace(STEP_ROUTES[current.currentStep]);
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only localStorage check, not derived from render state
    setProgress(current);
    setIsChecking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expectedStep]);

  return { isChecking, progress };
}
