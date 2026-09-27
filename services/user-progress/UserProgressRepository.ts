import type { AssessmentResult } from "@/types/quiz";
import type { UserProgress } from "@/types/progress";

export interface UserProgressRepository {
  getCurrent(): UserProgress | null;
  create(userName: string): UserProgress;
  markVideoCompleted(): UserProgress | null;
  saveAssessmentResult(result: AssessmentResult): UserProgress | null;
  resetJourney(): UserProgress | null;
  /** Apaga todo o progresso, incluindo `userId`/`userName` (volta para a identificação). */
  clearAll(): void;
}
