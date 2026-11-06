import { EBOOK_TOTAL_PAGES, MAPA_ELEMENT_IDS } from "@/content/materiais";
import type { ProgressSnapshot } from "@/types/progress";

/**
 * Regras da trilha (docs/plano-implementacao-fluxo-v3.md, seção 4.1): a partir do progresso
 * salvo, calcula o percentual, o estado de cada item, o progresso geral e o próximo sugerido.
 * Módulo puro, sem React nem acesso ao navegador.
 */

export type TrailItemId = "video" | "ebook" | "mapa" | "avaliacao" | "relatorio";

export interface TrailItemDefinition {
  id: TrailItemId;
  label: string;
  /** Rótulo curto, para cabeçalhos e barras com pouco espaço. */
  shortLabel: string;
  href: string;
}

/** Itens da trilha, na ordem sugerida. */
export const TRAIL_ITEMS: readonly TrailItemDefinition[] = [
  { id: "video", label: "Vídeo", shortLabel: "Vídeo", href: "/video" },
  { id: "ebook", label: "E-book", shortLabel: "E-book", href: "/ebook" },
  { id: "mapa", label: "Mapa interativo", shortLabel: "Mapa", href: "/mapa" },
  { id: "avaliacao", label: "Avaliação", shortLabel: "Avaliação", href: "/avaliacao" },
  { id: "relatorio", label: "Relatório", shortLabel: "Relatório", href: "/relatorio" },
];

/** A partir deste percentual o item vale como concluído. */
export const DONE_THRESHOLD_PERCENT = 80;

/**
 * - `soon`: ainda não disponível (vídeo sem link); fora do progresso geral e do próximo sugerido.
 * - `todo`: não iniciado (0%).
 * - `doing`: em andamento (de 1% até abaixo do limite).
 * - `done`: concluído (a partir do limite).
 */
export type TrailStatus = "soon" | "todo" | "doing" | "done";

export interface TrailItemState extends TrailItemDefinition {
  status: TrailStatus;
  available: boolean;
  /** Percentual inteiro, de 0 a 100. */
  percent: number;
  /** Unidades vistas e total (páginas, elementos, perguntas); nulos quando não se aplica. */
  seen: number | null;
  total: number | null;
}

export interface TrailState {
  items: TrailItemState[];
  /** Média dos percentuais dos itens disponíveis, arredondada. */
  overallPercent: number;
  /** Primeiro item disponível, na ordem da trilha, que ainda não foi concluído. */
  next: TrailItemId | null;
}

export interface TrailOptions {
  /** Falso enquanto o vídeo não tem link (`youtubeVideoId` nulo). */
  videoAvailable: boolean;
  /** Identificadores das perguntas da avaliação atual. */
  questionIds: readonly string[];
}

function ratioPercent(seen: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((Math.min(seen, total) / total) * 100);
}

function statusFor(percent: number): TrailStatus {
  if (percent >= DONE_THRESHOLD_PERCENT) return "done";
  return percent > 0 ? "doing" : "todo";
}

function measure(
  id: TrailItemId,
  progress: ProgressSnapshot,
  options: TrailOptions,
): { percent: number; seen: number | null; total: number | null } {
  switch (id) {
    case "video":
      return { percent: Math.round(progress.video.percent), seen: null, total: null };
    case "ebook": {
      const seen = progress.ebook.pagesSeen.length;
      return { percent: ratioPercent(seen, EBOOK_TOTAL_PAGES), seen, total: EBOOK_TOTAL_PAGES };
    }
    case "mapa": {
      const seen = progress.mapa.elementsSeen.length;
      return { percent: ratioPercent(seen, MAPA_ELEMENT_IDS.length), seen, total: MAPA_ELEMENT_IDS.length };
    }
    case "avaliacao": {
      const total = options.questionIds.length;
      // Com o resultado salvo, a avaliação foi concluída, mesmo que as perguntas tenham mudado.
      if (progress.avaliacao.result) return { percent: 100, seen: total, total };
      const seen = options.questionIds.filter((questionId) =>
        Object.prototype.hasOwnProperty.call(progress.avaliacao.answers, questionId),
      ).length;
      return { percent: ratioPercent(seen, total), seen, total };
    }
    case "relatorio":
      return { percent: progress.relatorio.openedAt ? 100 : 0, seen: null, total: null };
  }
}

export function buildTrail(progress: ProgressSnapshot, options: TrailOptions): TrailState {
  const items = TRAIL_ITEMS.map((definition): TrailItemState => {
    const available = definition.id !== "video" || options.videoAvailable;
    if (!available) {
      return { ...definition, status: "soon", available, percent: 0, seen: null, total: null };
    }
    const { percent, seen, total } = measure(definition.id, progress, options);
    return { ...definition, status: statusFor(percent), available, percent, seen, total };
  });

  const counted = items.filter((item) => item.available);
  const overallPercent =
    counted.length === 0
      ? 0
      : Math.round(counted.reduce((sum, item) => sum + item.percent, 0) / counted.length);
  const next = counted.find((item) => item.status !== "done")?.id ?? null;

  return { items, overallPercent, next };
}
