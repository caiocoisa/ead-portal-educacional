import type { AssessmentResult } from "./quiz";

export type JourneyStep = "video" | "avaliacao" | "relatorio";

export interface UserProgress {
  userId: string;
  userName: string;
  currentStep: JourneyStep;
  videoCompleted: boolean;
  assessmentResult: AssessmentResult | null;
  createdAt: string;
  updatedAt: string;
}
