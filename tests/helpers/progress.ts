import type { Page } from "@playwright/test";
import { moduleContent } from "../../content/module";
import type { MapNodeId } from "../../content/mapa";
import { gradeQuiz } from "../../lib/quiz/gradeQuiz";
import type { ProgressV2 } from "../../types/progress";

/** Chaves reais de `localStorage` usadas pelo portal. */
export const STORAGE = {
  progress: "ead-portal:user-progress",
  ebookPages: "ead-portal:ebook-pages",
  theme: "heroui-theme",
  fontSize: "ead-portal:font-size",
  contrast: "ead-portal:contrast",
} as const;

export type Theme = "light" | "dark";
export type FontSize = "normal" | "large" | "extra-large";
export type Contrast = "normal" | "high";

export interface Preferences {
  theme: Theme;
  fontSize: FontSize;
  contrast: Contrast;
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: "light",
  fontSize: "normal",
  contrast: "normal",
};

/**
 * Respostas de exemplo que exercitam os três níveis de retorno pedagógico:
 * a 1ª pergunta é acertada, a 2ª cai no "erro próximo", a 3ª no "erro
 * distante", e assim por diante.
 */
export function sampleAnswers(): Record<string, number> {
  const answers: Record<string, number> = {};
  moduleContent.questions.forEach((question, index) => {
    const correct = question.correctOptionIndex;
    const near = question.feedback.near.optionIndex;
    const far = question.options.findIndex((_, i) => i !== correct && i !== near);
    answers[question.id] = [correct, near, far][index % 3];
  });
  return answers;
}

/** O que já foi visto, em termos do aluno. Tudo é opcional: sem nada, é quem acabou de chegar. */
export interface SeedProgress {
  /** Páginas do e-book vistas (de 1 a 18). */
  ebookPages?: number[];
  mapElements?: MapNodeId[];
  /** Respostas confirmadas, por pergunta; sem `assessmentDone`, a avaliação fica no meio. */
  answers?: Record<string, number>;
  /** Todas as perguntas respondidas e o resultado salvo (o relatório tem o que mostrar). */
  assessmentDone?: boolean;
  reportOpened?: boolean;
  videoPercent?: number;
}

/** Todas as páginas do e-book, de 1 a 18. */
export const ALL_EBOOK_PAGES = Array.from({ length: 18 }, (_, index) => index + 1);

/** Monta o progresso no formato salvo (v2) e as páginas do e-book, que ficam em outra chave. */
export function buildProgress(seed: SeedProgress): { progress: ProgressV2; ebookPages: number[] } {
  const answers = seed.assessmentDone ? sampleAnswers() : (seed.answers ?? {});
  const now = new Date().toISOString();
  return {
    progress: {
      version: 2,
      updatedAt: now,
      video: { percent: seed.videoPercent ?? 0, positionSeconds: 0 },
      mapa: { elementsSeen: seed.mapElements ?? [] },
      avaliacao: {
        answers,
        result: seed.assessmentDone ? gradeQuiz(moduleContent.questions, answers) : null,
      },
      relatorio: { openedAt: seed.reportOpened ? now : null },
    },
    ebookPages: seed.ebookPages ?? [],
  };
}

/** Progresso no formato antigo (v1: uma etapa corrente, com nome), para testar a migração. */
export function buildLegacyProgress(step: "video" | "avaliacao" | "relatorio"): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    userId: "00000000-0000-4000-8000-000000000000",
    userName: "Aluna Teste",
    currentStep: step,
    videoCompleted: step !== "video",
    assessmentResult:
      step === "relatorio" ? gradeQuiz(moduleContent.questions, sampleAnswers()) : null,
    createdAt: now,
    updatedAt: now,
  };
}

interface SeedOptions {
  /** O que o aluno já viu; sem isso, ninguém avançou ainda. */
  progress?: SeedProgress;
  /** Grava o formato antigo (v1) no lugar do novo. */
  legacy?: "video" | "avaliacao" | "relatorio";
  preferences?: Partial<Preferences>;
}

/** Grava progresso e preferências no `localStorage` antes de a página carregar. */
export async function seedState(page: Page, options: SeedOptions = {}) {
  const preferences = { ...DEFAULT_PREFERENCES, ...options.preferences };
  let progress: string | null = null;
  let ebookPages: string | null = null;
  if (options.legacy) {
    progress = JSON.stringify(buildLegacyProgress(options.legacy));
  } else if (options.progress) {
    const built = buildProgress(options.progress);
    progress = JSON.stringify(built.progress);
    ebookPages = built.ebookPages.length > 0 ? JSON.stringify(built.ebookPages) : null;
  }
  await page.addInitScript(
    ({ keys, progress, ebookPages, preferences }) => {
      localStorage.setItem(keys.theme, preferences.theme);
      localStorage.setItem(keys.fontSize, preferences.fontSize);
      localStorage.setItem(keys.contrast, preferences.contrast);
      if (progress) localStorage.setItem(keys.progress, progress);
      if (ebookPages) localStorage.setItem(keys.ebookPages, ebookPages);
    },
    { keys: STORAGE, progress, ebookPages, preferences }
  );
}
