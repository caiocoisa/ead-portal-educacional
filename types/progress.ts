import type { MapNodeId } from "@/content/mapa";
import type { AssessmentResult } from "./quiz";

/** Versão do esquema salvo no `localStorage`. */
export const PROGRESS_VERSION = 2;

/**
 * Progresso salvo em `ead-portal:user-progress`: o estado de cada item da trilha, sem
 * identificação do aluno. O e-book **não** entra aqui: o leitor estático grava as páginas
 * vistas numa chave própria (ver `ProgressSnapshot`).
 *
 * O formato anterior (uma etapa corrente, com nome) é migrado na leitura; ver
 * `services/user-progress/migrate.ts`.
 */
export interface ProgressV2 {
  version: typeof PROGRESS_VERSION;
  /** Momento da última escrita; nulo enquanto não houver progresso. */
  updatedAt: string | null;
  /** Percentual assistido (0 a 100) e posição, em segundos, para retomar. */
  video: { percent: number; positionSeconds: number };
  /** Elementos do mapa já abertos, na ordem em que apareceram. */
  mapa: { elementsSeen: MapNodeId[] };
  avaliacao: {
    /** Alternativa confirmada por pergunta (`questionId` para índice da alternativa). */
    answers: Record<string, number>;
    result: AssessmentResult | null;
  };
  /** Conta como visto ao abrir; guarda o primeiro momento de abertura. */
  relatorio: { openedAt: string | null };
}

/** Visão completa lida pela interface: o que está salvo mais as páginas do e-book. */
export interface ProgressSnapshot extends ProgressV2 {
  /** Páginas do e-book já exibidas (de 1 a 18), sem repetição e em ordem crescente. */
  ebook: { pagesSeen: number[] };
}
