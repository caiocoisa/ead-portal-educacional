import {
  EMPTY_PROGRESS_SNAPSHOT,
  LocalStorageProgressRepository,
} from "./LocalStorageProgressRepository";
import type { ProgressRepository } from "./ProgressRepository";

/** Progresso do aluno no fluxo livre (estado de cada item da trilha). */
export const progressRepository: ProgressRepository = new LocalStorageProgressRepository();

export { EMPTY_PROGRESS_SNAPSHOT };
export type { ProgressRepository };
