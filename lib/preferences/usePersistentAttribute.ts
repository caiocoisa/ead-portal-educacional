"use client";

import { useCallback, useState } from "react";
import { useIsomorphicLayoutEffect } from "@heroui/react";

/**
 * Persiste uma preferência em `localStorage` e reflete o valor resolvido
 * como atributo `data-*` no `<html>` — mesmo padrão do `useTheme()` nativo
 * do HeroUI, para tema/tamanho de fonte/contraste ficarem consistentes.
 */
export function usePersistentAttribute<T extends string>(
  storageKey: string,
  attributeName: string,
  defaultValue: T
) {
  const [value, setValueState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    return (window.localStorage.getItem(storageKey) as T | null) ?? defaultValue;
  });

  useIsomorphicLayoutEffect(() => {
    document.documentElement.setAttribute(attributeName, value);
  }, [attributeName, value]);

  const setValue = useCallback(
    (next: T) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, next);
      }
      setValueState(next);
    },
    [storageKey]
  );

  return [value, setValue] as const;
}
