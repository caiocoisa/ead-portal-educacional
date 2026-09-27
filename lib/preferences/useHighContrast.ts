"use client";

import { usePersistentAttribute } from "./usePersistentAttribute";

export type ContrastMode = "normal" | "high";

const STORAGE_KEY = "ead-portal:contrast";

export function useHighContrast() {
  const [contrast, setContrast] = usePersistentAttribute<ContrastMode>(
    STORAGE_KEY,
    "data-contrast",
    "normal"
  );
  return { contrast, setContrast };
}
