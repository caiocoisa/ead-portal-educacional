"use client";

import { usePersistentAttribute } from "./usePersistentAttribute";

export type FontSize = "normal" | "large" | "extra-large";

const STORAGE_KEY = "ead-portal:font-size";

export function useFontSize() {
  const [fontSize, setFontSize] = usePersistentAttribute<FontSize>(
    STORAGE_KEY,
    "data-font-size",
    "normal"
  );
  return { fontSize, setFontSize };
}
