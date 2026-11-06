import { EBOOK_TOTAL_PAGES, MAPA_ELEMENT_IDS } from "@/content/materiais";
import type { MapNodeId } from "@/content/mapa";
import { PROGRESS_VERSION, type JourneyStep, type ProgressV2 } from "@/types/progress";
import type { AnsweredQuestion, AssessmentResult } from "@/types/quiz";

/**
 * Leitura segura do que está salvo no `localStorage`: sanear o formato v2 e migrar o v1.
 * Funções puras, sem acesso ao navegador, para cobrir com testes muitos casos ruins.
 */

export interface ParsedProgress {
  progress: ProgressV2;
  /** Verdadeiro quando o conteúdo era v1 e foi convertido: quem lê deve regravar em v2. */
  migrated: boolean;
}

const V1_STEPS: readonly JourneyStep[] = ["video", "avaliacao", "relatorio"];

export function emptyProgress(): ProgressV2 {
  return {
    version: PROGRESS_VERSION,
    updatedAt: null,
    video: { percent: 0, positionSeconds: 0 },
    mapa: { elementsSeen: [] },
    avaliacao: { answers: {}, result: null },
    relatorio: { openedAt: null },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toIndex(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}

function toPercent(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function toSeconds(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

function toTimestamp(value: unknown): string | null {
  return typeof value === "string" && value !== "" ? value : null;
}

/** Aceita só um `AssessmentResult` completo e bem formado; qualquer defeito vira nulo. */
export function toAssessmentResult(value: unknown): AssessmentResult | null {
  if (!isRecord(value) || !Array.isArray(value.answers)) return null;
  const correctCount = toIndex(value.correctCount);
  const totalCount = toIndex(value.totalCount);
  if (correctCount === null || totalCount === null) return null;

  const answers: AnsweredQuestion[] = [];
  for (const item of value.answers) {
    if (!isRecord(item) || typeof item.questionId !== "string") return null;
    const selectedOptionIndex = toIndex(item.selectedOptionIndex);
    if (selectedOptionIndex === null || typeof item.correct !== "boolean") return null;
    answers.push({ questionId: item.questionId, selectedOptionIndex, correct: item.correct });
  }
  return { answers, correctCount, totalCount };
}

/** Páginas válidas do e-book (inteiros de 1 ao total), sem repetição e em ordem crescente. */
export function sanitizeEbookPages(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const pages = new Set<number>();
  for (const page of value) {
    if (typeof page === "number" && Number.isInteger(page) && page >= 1 && page <= EBOOK_TOTAL_PAGES) {
      pages.add(page);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

function sanitizeV2(stored: Record<string, unknown>): ProgressV2 {
  const video = isRecord(stored.video) ? stored.video : {};
  const mapa = isRecord(stored.mapa) ? stored.mapa : {};
  const avaliacao = isRecord(stored.avaliacao) ? stored.avaliacao : {};
  const relatorio = isRecord(stored.relatorio) ? stored.relatorio : {};

  const elementsSeen: MapNodeId[] = [];
  if (Array.isArray(mapa.elementsSeen)) {
    for (const id of mapa.elementsSeen) {
      const known = MAPA_ELEMENT_IDS.find((element) => element === id);
      if (known && !elementsSeen.includes(known)) elementsSeen.push(known);
    }
  }

  const answers: Record<string, number> = {};
  if (isRecord(avaliacao.answers)) {
    for (const [questionId, option] of Object.entries(avaliacao.answers)) {
      const index = toIndex(option);
      if (index !== null) answers[questionId] = index;
    }
  }

  return {
    version: PROGRESS_VERSION,
    updatedAt: toTimestamp(stored.updatedAt),
    video: { percent: toPercent(video.percent), positionSeconds: toSeconds(video.positionSeconds) },
    mapa: { elementsSeen },
    avaliacao: { answers, result: toAssessmentResult(avaliacao.result) },
    relatorio: { openedAt: toTimestamp(relatorio.openedAt) },
  };
}

/**
 * Converte o formato v1 (uma etapa corrente, com nome): o nome e o identificador somem,
 * e o que o modelo antigo nunca registrou (e-book e mapa) começa vazio.
 */
function migrateV1(stored: Record<string, unknown>): ProgressV2 {
  const result = toAssessmentResult(stored.assessmentResult);
  const answers: Record<string, number> = {};
  for (const answer of result?.answers ?? []) {
    answers[answer.questionId] = answer.selectedOptionIndex;
  }
  const updatedAt = toTimestamp(stored.updatedAt);

  return {
    ...emptyProgress(),
    updatedAt,
    video: { percent: stored.videoCompleted === true ? 100 : 0, positionSeconds: 0 },
    avaliacao: { answers, result },
    relatorio: { openedAt: stored.currentStep === "relatorio" ? (updatedAt ?? new Date().toISOString()) : null },
  };
}

/**
 * Lê o texto salvo. Devolve `null` (sem lançar erro) para: nada salvo, JSON inválido,
 * formato desconhecido ou versão que este código não conhece.
 */
export function parseStoredProgress(raw: string | null): ParsedProgress | null {
  if (!raw) return null;

  let stored: unknown;
  try {
    stored = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(stored)) return null;

  if (stored.version === undefined) {
    const isV1 = typeof stored.currentStep === "string" && V1_STEPS.includes(stored.currentStep as JourneyStep);
    return isV1 ? { progress: migrateV1(stored), migrated: true } : null;
  }
  if (stored.version === PROGRESS_VERSION) {
    return { progress: sanitizeV2(stored), migrated: false };
  }
  return null;
}
