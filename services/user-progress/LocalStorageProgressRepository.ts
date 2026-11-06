import { MAPA_ELEMENT_IDS } from "@/content/materiais";
import type { MapNodeId } from "@/content/mapa";
import type { ProgressSnapshot, ProgressV2 } from "@/types/progress";
import type { AssessmentResult } from "@/types/quiz";
import { emptyProgress, parseStoredProgress, sanitizeEbookPages } from "./migrate";
import type { ProgressRepository } from "./ProgressRepository";

/** Chaves do `localStorage`. A do e-book é gravada também pelo leitor estático (`leitor.html`). */
export const STORAGE_KEYS = {
  progress: "ead-portal:user-progress",
  ebookPages: "ead-portal:ebook-pages",
} as const;

/**
 * Evento disparado na própria janela depois de cada escrita. O evento nativo `storage`
 * só chega às *outras* janelas (outras abas e o leitor do e-book dentro do `iframe`).
 */
export const PROGRESS_EVENT = "ead-portal:progress";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Gravação em melhor esforço: em modo privado ou sem espaço, o aluno segue sem salvar. */
function writeRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // sem armazenamento disponível: o estado vale só nesta chamada
  }
}

function notify(): void {
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

function readEbookPages(): number[] {
  const raw = readRaw(STORAGE_KEYS.ebookPages);
  if (!raw) return [];
  try {
    return sanitizeEbookPages(JSON.parse(raw));
  } catch {
    return [];
  }
}

/** Lê o que está salvo; conteúdo no formato v1 é migrado e regravado em v2 uma única vez. */
function readStored(): ProgressV2 | null {
  if (!isBrowser()) return null;
  const parsed = parseStoredProgress(readRaw(STORAGE_KEYS.progress));
  if (!parsed) return null;
  if (parsed.migrated) writeRaw(STORAGE_KEYS.progress, JSON.stringify(parsed.progress));
  return parsed.progress;
}

function toSnapshot(progress: ProgressV2): ProgressSnapshot {
  return { ...progress, ebook: { pagesSeen: isBrowser() ? readEbookPages() : [] } };
}

/**
 * Visão sem progresso, sempre o mesmo objeto: é o valor do servidor e da primeira renderização
 * do navegador (a hidratação). Por isso **não pode ler o armazenamento** ao ser criada: se
 * lesse, no navegador já viria com as páginas do e-book salvas, ficaria diferente da do
 * servidor e a hidratação falharia (erro React #418).
 */
export const EMPTY_PROGRESS_SNAPSHOT: ProgressSnapshot = Object.freeze({
  ...emptyProgress(),
  ebook: { pagesSeen: [] },
}) as ProgressSnapshot;

export class LocalStorageProgressRepository implements ProgressRepository {
  private cache: { signature: string; snapshot: ProgressSnapshot } | null = null;

  get(): ProgressSnapshot {
    return toSnapshot(readStored() ?? emptyProgress());
  }

  getSnapshot = (): ProgressSnapshot => {
    if (!isBrowser()) return EMPTY_PROGRESS_SNAPSHOT;
    // Lê primeiro (isso migra o formato antigo) e só então compara o que está salvo.
    const progress = readStored();
    const signature = `${readRaw(STORAGE_KEYS.progress) ?? ""}|${readRaw(STORAGE_KEYS.ebookPages) ?? ""}`;
    if (this.cache?.signature === signature) return this.cache.snapshot;

    const snapshot = toSnapshot(progress ?? emptyProgress());
    this.cache = { signature, snapshot };
    return snapshot;
  };

  subscribe = (listener: () => void): (() => void) => {
    if (!isBrowser()) return () => {};
    const onStorage = (event: StorageEvent) => {
      // `key` nulo é o `localStorage.clear()`.
      if (
        event.key === null ||
        event.key === STORAGE_KEYS.progress ||
        event.key === STORAGE_KEYS.ebookPages
      ) {
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(PROGRESS_EVENT, listener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(PROGRESS_EVENT, listener);
    };
  };

  markEbookPage(page: number): ProgressSnapshot {
    if (isBrowser() && Number.isInteger(page)) {
      const pages = readEbookPages();
      const next = sanitizeEbookPages([...pages, page]);
      if (next.length !== pages.length) {
        writeRaw(STORAGE_KEYS.ebookPages, JSON.stringify(next));
        notify();
      }
    }
    return this.get();
  }

  markMapElement(id: MapNodeId): ProgressSnapshot {
    return this.update((progress) => {
      if (!MAPA_ELEMENT_IDS.includes(id) || progress.mapa.elementsSeen.includes(id)) return null;
      return { ...progress, mapa: { elementsSeen: [...progress.mapa.elementsSeen, id] } };
    });
  }

  saveAnswer(questionId: string, optionIndex: number): ProgressSnapshot {
    return this.update((progress) => {
      if (!questionId || !Number.isInteger(optionIndex) || optionIndex < 0) return null;
      return {
        ...progress,
        avaliacao: {
          ...progress.avaliacao,
          answers: { ...progress.avaliacao.answers, [questionId]: optionIndex },
        },
      };
    });
  }

  saveAssessmentResult(result: AssessmentResult): ProgressSnapshot {
    return this.update((progress) => ({
      ...progress,
      avaliacao: { ...progress.avaliacao, result },
    }));
  }

  resetAssessment(): ProgressSnapshot {
    return this.update((progress) => ({
      ...progress,
      avaliacao: { answers: {}, result: null },
    }));
  }

  markReportOpened(): ProgressSnapshot {
    return this.update((progress) => {
      if (progress.relatorio.openedAt) return null;
      return { ...progress, relatorio: { openedAt: new Date().toISOString() } };
    });
  }

  setVideoProgress(percent: number, positionSeconds: number): ProgressSnapshot {
    return this.update((progress) => {
      if (!Number.isFinite(percent) || !Number.isFinite(positionSeconds)) return null;
      return {
        ...progress,
        video: {
          percent: Math.min(100, Math.max(progress.video.percent, percent)),
          positionSeconds: Math.max(0, positionSeconds),
        },
      };
    });
  }

  clearAll(): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.progress);
      window.localStorage.removeItem(STORAGE_KEYS.ebookPages);
    } catch {
      // sem armazenamento disponível: nada a apagar
    }
    notify();
  }

  /**
   * Lê, aplica a mudança e grava. Se `mutate` devolver nulo, nada muda e nada é gravado.
   * Fora do navegador, devolve a visão vazia sem gravar.
   */
  private update(mutate: (progress: ProgressV2) => ProgressV2 | null): ProgressSnapshot {
    if (!isBrowser()) return toSnapshot(emptyProgress());
    const current = readStored() ?? emptyProgress();
    const changed = mutate(current);
    if (!changed) return toSnapshot(current);

    const next: ProgressV2 = { ...changed, updatedAt: new Date().toISOString() };
    writeRaw(STORAGE_KEYS.progress, JSON.stringify(next));
    notify();
    return toSnapshot(next);
  }
}
