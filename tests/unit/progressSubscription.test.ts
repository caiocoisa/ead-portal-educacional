import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import {
  EMPTY_PROGRESS_SNAPSHOT,
  LocalStorageProgressRepository,
  PROGRESS_EVENT,
  STORAGE_KEYS,
} from "@/services/user-progress/LocalStorageProgressRepository";
import { emptyProgress } from "@/services/user-progress/migrate";
import type { AssessmentResult } from "@/types/quiz";

const result: AssessmentResult = {
  answers: [{ questionId: "q1", selectedOptionIndex: 1, correct: true }],
  correctCount: 1,
  totalCount: 1,
};

describe("leitura estável e assinatura do progresso", () => {
  let repository: LocalStorageProgressRepository;
  let listener: Mock<() => void>;
  let unsubscribe: () => void;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageProgressRepository();
    listener = vi.fn<() => void>();
    unsubscribe = repository.subscribe(listener);
  });

  afterEach(() => {
    unsubscribe();
  });

  describe("getSnapshot", () => {
    it("devolve o mesmo objeto enquanto nada mudou, o que o React exige", () => {
      const first = repository.getSnapshot();
      expect(repository.getSnapshot()).toBe(first);
      expect(repository.getSnapshot()).toBe(first);
    });

    it("sem nada salvo, tem o conteúdo da visão vazia", () => {
      expect(repository.getSnapshot()).toEqual(EMPTY_PROGRESS_SNAPSHOT);
      expect(EMPTY_PROGRESS_SNAPSHOT).toEqual({ ...emptyProgress(), ebook: { pagesSeen: [] } });
    });

    it("a visão vazia do servidor não lê o armazenamento ao ser criada, o que quebraria a hidratação", async () => {
      // Com o progresso já salvo, o módulo é carregado do zero, como acontece ao abrir a página.
      localStorage.setItem(STORAGE_KEYS.ebookPages, JSON.stringify([1, 2, 3]));
      localStorage.setItem(
        STORAGE_KEYS.progress,
        JSON.stringify({ ...emptyProgress(), mapa: { elementsSeen: ["publico"] } }),
      );
      vi.resetModules();
      const recemCarregado = await import("@/services/user-progress/LocalStorageProgressRepository");
      expect(recemCarregado.EMPTY_PROGRESS_SNAPSHOT).toEqual({ ...emptyProgress(), ebook: { pagesSeen: [] } });
    });

    it("devolve um objeto novo depois de uma escrita", () => {
      const before = repository.getSnapshot();
      repository.markMapElement("publico");
      const after = repository.getSnapshot();
      expect(after).not.toBe(before);
      expect(after.mapa.elementsSeen).toEqual(["publico"]);
      expect(repository.getSnapshot()).toBe(after);
    });

    it("não muda por causa de outras chaves do localStorage", () => {
      const before = repository.getSnapshot();
      localStorage.setItem("heroui-theme", "dark");
      localStorage.setItem("ead-portal:font-size", "large");
      expect(repository.getSnapshot()).toBe(before);
    });

    it("acompanha o que outro contexto gravou, como o leitor do e-book", () => {
      const before = repository.getSnapshot();
      localStorage.setItem(STORAGE_KEYS.ebookPages, JSON.stringify([2, 1, 9]));
      const after = repository.getSnapshot();
      expect(after).not.toBe(before);
      expect(after.ebook.pagesSeen).toEqual([1, 2, 9]);
    });

    it("migra o formato antigo na primeira leitura e depois permanece estável", () => {
      localStorage.setItem(
        STORAGE_KEYS.progress,
        JSON.stringify({
          userId: "u-1",
          userName: "Marina",
          currentStep: "relatorio",
          videoCompleted: true,
          assessmentResult: result,
          createdAt: "2026-11-01T10:00:00.000Z",
          updatedAt: "2026-11-02T10:00:00.000Z",
        }),
      );
      const first = repository.getSnapshot();
      expect(first.version).toBe(2);
      expect(first.avaliacao.result).toEqual(result);
      expect(repository.getSnapshot()).toBe(first);
      expect(localStorage.getItem(STORAGE_KEYS.progress)).not.toContain("Marina");
    });

    it("apagar tudo volta à visão vazia", () => {
      repository.markMapElement("publico");
      repository.clearAll();
      expect(repository.getSnapshot()).toEqual(EMPTY_PROGRESS_SNAPSHOT);
    });
  });

  describe("subscribe", () => {
    it("avisa depois de cada escrita que muda algo", () => {
      repository.markMapElement("publico");
      repository.markEbookPage(3);
      repository.saveAnswer("q1", 2);
      repository.saveAssessmentResult(result);
      repository.markReportOpened();
      repository.setVideoProgress(10, 5);
      repository.resetAssessment();
      expect(listener).toHaveBeenCalledTimes(7);
    });

    it("não avisa quando a operação não muda nada", () => {
      repository.markMapElement("publico");
      repository.markEbookPage(3);
      repository.markReportOpened();
      listener.mockClear();

      repository.markMapElement("publico");
      repository.markMapElement("inexistente" as never);
      repository.markEbookPage(3);
      repository.markEbookPage(99);
      repository.saveAnswer("q1", -1);
      repository.markReportOpened();
      expect(listener).not.toHaveBeenCalled();
    });

    it("avisa ao apagar tudo", () => {
      repository.clearAll();
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("avisa quando o leitor do e-book, em outra janela, grava as páginas", () => {
      localStorage.setItem(STORAGE_KEYS.ebookPages, "[1]");
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEYS.ebookPages }));
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("avisa quando outra aba grava o progresso e quando o armazenamento é limpo", () => {
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEYS.progress }));
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it("ignora mudanças de outras chaves", () => {
      window.dispatchEvent(new StorageEvent("storage", { key: "heroui-theme" }));
      window.dispatchEvent(new StorageEvent("storage", { key: "ead-portal:contrast" }));
      expect(listener).not.toHaveBeenCalled();
    });

    it("para de avisar depois de cancelar a assinatura", () => {
      unsubscribe();
      repository.markMapElement("publico");
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEYS.progress }));
      window.dispatchEvent(new Event(PROGRESS_EVENT));
      expect(listener).not.toHaveBeenCalled();
    });

    it("cada assinante recebe o seu aviso", () => {
      const other = vi.fn<() => void>();
      const cancelOther = repository.subscribe(other);
      repository.markMapElement("objetivos");
      cancelOther();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(other).toHaveBeenCalledTimes(1);
    });
  });
});
