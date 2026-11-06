"use client";

import { useMemo } from "react";
import { buildTrail, type TrailState } from "./trail";
import { trailOptions } from "./trailOptions";
import { useProgress } from "./useProgress";

/** Estado da trilha (percentuais, progresso geral e próximo sugerido), sempre atualizado. */
export function useTrail(): TrailState {
  const progress = useProgress();
  return useMemo(() => buildTrail(progress, trailOptions), [progress]);
}
