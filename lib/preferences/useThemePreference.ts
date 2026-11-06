"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@heroui/react";
import { themeStore, type ThemePreference } from "./stores";

export type { ThemePreference };

/**
 * Tema escolhido. Quem aplica o tema no `<html>` é o `useTheme` do HeroUI; o valor exibido vem do
 * armazenamento compartilhado, que no servidor e na hidratação vale `system` (o `useTheme` lê o
 * `localStorage` já na primeira renderização do navegador e divergiria do HTML do servidor).
 */
export function useThemePreference() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );
  const { setTheme: applyTheme } = useTheme();

  function setTheme(next: ThemePreference) {
    applyTheme(next); // grava na mesma chave e aplica o tema
    themeStore.notify();
  }

  return { theme, setTheme };
}
