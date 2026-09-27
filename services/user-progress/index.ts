import { LocalStorageUserProgressRepository } from "./LocalStorageUserProgressRepository";
import type { UserProgressRepository } from "./UserProgressRepository";

export const userProgressRepository: UserProgressRepository =
  new LocalStorageUserProgressRepository();

export type { UserProgressRepository };
