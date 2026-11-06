import { LocalStorageProgressRepository } from "./LocalStorageProgressRepository";
import { LocalStorageUserProgressRepository } from "./LocalStorageUserProgressRepository";
import type { ProgressRepository } from "./ProgressRepository";
import type { UserProgressRepository } from "./UserProgressRepository";

/** Modelo v2 (fluxo livre). Ainda sem uso na interface: entra nos passos 3 e 4 do PR A. */
export const progressRepository: ProgressRepository = new LocalStorageProgressRepository();

/** Modelo v1 (etapa corrente). Sai quando a interface trocar para o `progressRepository`. */
export const userProgressRepository: UserProgressRepository =
  new LocalStorageUserProgressRepository();

export type { ProgressRepository, UserProgressRepository };
