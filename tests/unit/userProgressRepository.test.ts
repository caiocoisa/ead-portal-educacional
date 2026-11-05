import { beforeEach, describe, expect, it } from "vitest";
import { LocalStorageUserProgressRepository } from "@/services/user-progress/LocalStorageUserProgressRepository";
import type { AssessmentResult } from "@/types/quiz";

const STORAGE_KEY = "ead-portal:user-progress";

const result: AssessmentResult = {
  answers: [{ questionId: "q1", selectedOptionIndex: 1, correct: true }],
  correctCount: 1,
  totalCount: 1,
};

describe("LocalStorageUserProgressRepository", () => {
  let repository: LocalStorageUserProgressRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageUserProgressRepository();
  });

  it("não tem progresso antes de alguém se identificar", () => {
    expect(repository.getCurrent()).toBeNull();
  });

  it("create começa pela etapa de vídeo, sem vídeo concluído nem resultado", () => {
    const progress = repository.create("Marina");
    expect(progress.userName).toBe("Marina");
    expect(progress.currentStep).toBe("video");
    expect(progress.videoCompleted).toBe(false);
    expect(progress.assessmentResult).toBeNull();
    expect(progress.userId).not.toBe("");
    expect(repository.getCurrent()).toEqual(progress);
  });

  it("markVideoCompleted libera a avaliação", () => {
    repository.create("Marina");
    const progress = repository.markVideoCompleted();
    expect(progress?.videoCompleted).toBe(true);
    expect(progress?.currentStep).toBe("avaliacao");
  });

  it("saveAssessmentResult guarda o resultado e libera o relatório", () => {
    repository.create("Marina");
    repository.markVideoCompleted();
    const progress = repository.saveAssessmentResult(result);
    expect(progress?.assessmentResult).toEqual(result);
    expect(progress?.currentStep).toBe("relatorio");
  });

  it("resetJourney volta ao vídeo, apaga o resultado e mantém a identidade", () => {
    const created = repository.create("Marina");
    repository.markVideoCompleted();
    repository.saveAssessmentResult(result);
    const progress = repository.resetJourney();
    expect(progress?.currentStep).toBe("video");
    expect(progress?.videoCompleted).toBe(false);
    expect(progress?.assessmentResult).toBeNull();
    expect(progress?.userId).toBe(created.userId);
    expect(progress?.userName).toBe("Marina");
  });

  it("clearAll apaga tudo, inclusive o nome", () => {
    repository.create("Marina");
    repository.clearAll();
    expect(repository.getCurrent()).toBeNull();
  });

  it("as operações de escrita sem progresso prévio não fazem nada", () => {
    expect(repository.markVideoCompleted()).toBeNull();
    expect(repository.saveAssessmentResult(result)).toBeNull();
    expect(repository.resetJourney()).toBeNull();
  });

  it("devolve nulo, sem lançar erro, quando o conteúdo salvo está corrompido", () => {
    localStorage.setItem(STORAGE_KEY, "{isso não é json");
    expect(repository.getCurrent()).toBeNull();
  });
});
