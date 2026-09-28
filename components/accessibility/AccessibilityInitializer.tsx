"use client";

import { useTheme } from "@heroui/react";
import { useFontSize } from "@/lib/preferences/useFontSize";
import { useHighContrast } from "@/lib/preferences/useHighContrast";

/**
 * Garante que tema, tamanho de fonte e alto contraste sejam aplicados
 * (atributos `data-*` no `<html>`) desde o primeiro carregamento da
 * página, mesmo com os controles visíveis apenas dentro do drawer de
 * acessibilidade (que só monta o conteúdo quando aberto).
 */
export function AccessibilityInitializer() {
  useTheme();
  useFontSize();
  useHighContrast();
  return null;
}
