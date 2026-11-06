"use client";

import { useSyncExternalStore } from "react";
import { fontSizeStore, type FontSize } from "./stores";

export type { FontSize };

/** Tamanho da fonte salvo. No servidor e na hidratação vale `normal`; o valor salvo entra depois. */
export function useFontSize() {
  const fontSize = useSyncExternalStore(
    fontSizeStore.subscribe,
    fontSizeStore.getSnapshot,
    fontSizeStore.getServerSnapshot
  );
  return { fontSize, setFontSize: fontSizeStore.set };
}
