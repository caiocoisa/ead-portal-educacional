"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Falso no servidor e na primeira renderização do navegador; verdadeiro depois. Serve para
 * esperar a leitura do progresso salvo antes de mostrar algo que dependa dele (por exemplo,
 * "você ainda não fez a avaliação"), sem piscar o estado vazio para quem já tem progresso.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
