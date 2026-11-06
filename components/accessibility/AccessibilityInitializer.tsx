"use client";

import { useIsomorphicLayoutEffect, useTheme } from "@heroui/react";
import { contrastStore, fontSizeStore } from "@/lib/preferences/stores";

/**
 * Garante que tema, tamanho de fonte e alto contraste sejam aplicados (atributos `data-*` no
 * `<html>`) desde o primeiro carregamento da página, antes de qualquer controle aparecer. O tema
 * é aplicado pelo `useTheme` do HeroUI; fonte e contraste, pelo valor salvo.
 */
export function AccessibilityInitializer() {
  useTheme();
  useIsomorphicLayoutEffect(() => {
    fontSizeStore.applyStored();
    contrastStore.applyStored();
  }, []);
  return null;
}
