import type { AssessmentResult } from "@/types/quiz";
import type { UserProgress } from "@/types/progress";
import type { UserProgressRepository } from "./UserProgressRepository";

const STORAGE_KEY = "ead-portal:user-progress";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read(): UserProgress | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProgress;
  } catch {
    return null;
  }
}

function write(progress: UserProgress): UserProgress {
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
  return progress;
}

export class LocalStorageUserProgressRepository
  implements UserProgressRepository
{
  getCurrent(): UserProgress | null {
    return read();
  }

  create(userName: string): UserProgress {
    const now = new Date().toISOString();
    const progress: UserProgress = {
      userId: crypto.randomUUID(),
      userName,
      currentStep: "video",
      videoCompleted: false,
      assessmentResult: null,
      createdAt: now,
      updatedAt: now,
    };
    return write(progress);
  }

  markVideoCompleted(): UserProgress | null {
    const current = read();
    if (!current) return null;
    const updated: UserProgress = {
      ...current,
      videoCompleted: true,
      currentStep: "avaliacao",
      updatedAt: new Date().toISOString(),
    };
    return write(updated);
  }

  saveAssessmentResult(result: AssessmentResult): UserProgress | null {
    const current = read();
    if (!current) return null;
    const updated: UserProgress = {
      ...current,
      assessmentResult: result,
      currentStep: "relatorio",
      updatedAt: new Date().toISOString(),
    };
    return write(updated);
  }

  resetJourney(): UserProgress | null {
    const current = read();
    if (!current) return null;
    const updated: UserProgress = {
      ...current,
      currentStep: "video",
      videoCompleted: false,
      assessmentResult: null,
      updatedAt: new Date().toISOString(),
    };
    return write(updated);
  }

  clearAll(): void {
    if (isBrowser()) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
}
