"use client";

import { useSyncExternalStore } from "react";
import { contrastStore, type ContrastMode } from "./stores";

export type { ContrastMode };

/** Contraste salvo. No servidor e na hidratação vale `normal`; o valor salvo entra depois. */
export function useHighContrast() {
  const contrast = useSyncExternalStore(
    contrastStore.subscribe,
    contrastStore.getSnapshot,
    contrastStore.getServerSnapshot
  );
  return { contrast, setContrast: contrastStore.set };
}
