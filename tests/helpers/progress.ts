import type { Page } from "@playwright/test";
import { moduleContent } from "../../content/module";
import { gradeQuiz } from "../../lib/quiz/gradeQuiz";
import type { JourneyStep, UserProgress } from "../../types/progress";

/** Chaves reais de `localStorage` usadas pelo portal. */
export const STORAGE = {
  progress: "ead-portal:user-progress",
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

/** Monta um `UserProgress` válido para a etapa pedida. */
export function buildProgress(step: JourneyStep): UserProgress {
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
  /** Etapa em que o aluno já está; sem ela, ninguém se identificou ainda. */
  step?: JourneyStep;
  preferences?: Partial<Preferences>;
}

/** Grava progresso e preferências no `localStorage` antes de a página carregar. */
export async function seedState(page: Page, options: SeedOptions = {}) {
  const preferences = { ...DEFAULT_PREFERENCES, ...options.preferences };
  const progress = options.step ? JSON.stringify(buildProgress(options.step)) : null;
  await page.addInitScript(
    ({ keys, progress, preferences }) => {
      localStorage.setItem(keys.theme, preferences.theme);
      localStorage.setItem(keys.fontSize, preferences.fontSize);
      localStorage.setItem(keys.contrast, preferences.contrast);
      if (progress) localStorage.setItem(keys.progress, progress);
    },
    { keys: STORAGE, progress, preferences }
  );
}
