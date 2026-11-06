"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_PROGRESS_SNAPSHOT, progressRepository } from "@/services/user-progress";
import type { ProgressSnapshot } from "@/types/progress";

/**
 * Progresso salvo, sempre atualizado: reage a escritas desta janela, do leitor do e-book
 * (dentro do `iframe`) e de outras abas. No servidor e na primeira renderização no navegador
 * devolve a visão vazia, o que evita diferença entre o HTML do servidor e o do cliente.
 */
export function useProgress(): ProgressSnapshot {
  return useSyncExternalStore(
    progressRepository.subscribe,
    progressRepository.getSnapshot,
    () => EMPTY_PROGRESS_SNAPSHOT,
  );
}
