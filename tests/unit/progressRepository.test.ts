import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LocalStorageProgressRepository,
  STORAGE_KEYS,
} from "@/services/user-progress/LocalStorageProgressRepository";
import { emptyProgress } from "@/services/user-progress/migrate";
import type { AssessmentResult } from "@/types/quiz";

const result: AssessmentResult = {
  answers: [{ questionId: "q1", selectedOptionIndex: 1, correct: true }],
  correctCount: 1,
  totalCount: 1,
};

function saved(key: string): unknown {
  const raw = localStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
}

describe("LocalStorageProgressRepository", () => {
  let repository: LocalStorageProgressRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageProgressRepository();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("leitura", () => {
    it("sem nada salvo, devolve a visão vazia e não grava nada", () => {
      expect(repository.get()).toEqual({ ...emptyProgress(), ebook: { pagesSeen: [] } });
      expect(localStorage.length).toBe(0);
    });

    it("conteúdo corrompido vale como sem progresso, sem lançar erro", () => {
      localStorage.setItem(STORAGE_KEYS.progress, "{isso não é json");
      expect(repository.get()).toEqual({ ...emptyProgress(), ebook: { pagesSeen: [] } });
    });

    it("versão desconhecida vale como sem progresso", () => {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify({ version: 3, mapa: { elementsSeen: ["publico"] } }));
      expect(repository.get().mapa.elementsSeen).toEqual([]);
    });

    it("depois de conteúdo corrompido, uma escrita recomeça do zero", () => {
      localStorage.setItem(STORAGE_KEYS.progress, "{isso não é json");
      const snapshot = repository.markMapElement("publico");
      expect(snapshot.mapa.elementsSeen).toEqual(["publico"]);
      expect(saved(STORAGE_KEYS.progress)).toMatchObject({ version: 2 });
    });
  });

  describe("migração na primeira leitura", () => {
    const v1 = {
      userId: "u-1",
      userName: "Marina",
      currentStep: "relatorio",
      videoCompleted: true,
      assessmentResult: result,
      createdAt: "2026-11-01T10:00:00.000Z",
      updatedAt: "2026-11-02T10:00:00.000Z",
    };

    it("devolve o progresso antigo já no modelo novo e regrava em v2", () => {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(v1));
      const snapshot = repository.get();
      expect(snapshot.version).toBe(2);
      expect(snapshot.avaliacao.result).toEqual(result);
      expect(snapshot.video.percent).toBe(100);
      expect(saved(STORAGE_KEYS.progress)).toMatchObject({ version: 2 });
      expect(JSON.stringify(saved(STORAGE_KEYS.progress))).not.toContain("Marina");
    });

    it("a segunda leitura devolve o mesmo, sem migrar de novo", () => {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(v1));
      const first = repository.get();
      const rawAfterFirst = localStorage.getItem(STORAGE_KEYS.progress);
      expect(repository.get()).toEqual(first);
      expect(localStorage.getItem(STORAGE_KEYS.progress)).toBe(rawAfterFirst);
    });
  });

  describe("e-book", () => {
    it("registra as páginas numa chave própria, sem repetição e em ordem", () => {
      repository.markEbookPage(7);
      repository.markEbookPage(2);
      const snapshot = repository.markEbookPage(7);
      expect(snapshot.ebook.pagesSeen).toEqual([2, 7]);
      expect(saved(STORAGE_KEYS.ebookPages)).toEqual([2, 7]);
      expect(localStorage.getItem(STORAGE_KEYS.progress)).toBeNull();
    });

    it.each([0, 19, -1, 2.5, Number.NaN, Number.POSITIVE_INFINITY])(
      "ignora a página inválida %s",
      (page) => {
        expect(repository.markEbookPage(page).ebook.pagesSeen).toEqual([]);
        expect(localStorage.getItem(STORAGE_KEYS.ebookPages)).toBeNull();
      },
    );

    it("lê páginas gravadas por outro contexto, como o leitor em tela cheia", () => {
      localStorage.setItem(STORAGE_KEYS.ebookPages, JSON.stringify([3, 1, 99, 3]));
      expect(repository.get().ebook.pagesSeen).toEqual([1, 3]);
    });

    it("lista corrompida vale como nenhuma página vista", () => {
      localStorage.setItem(STORAGE_KEYS.ebookPages, "[1, 2");
      expect(repository.get().ebook.pagesSeen).toEqual([]);
    });
  });

  describe("mapa", () => {
    it("registra cada elemento uma vez, na ordem em que foram abertos", () => {
      repository.markMapElement("objetivos");
      repository.markMapElement("publico");
      const snapshot = repository.markMapElement("objetivos");
      expect(snapshot.mapa.elementsSeen).toEqual(["objetivos", "publico"]);
    });

    it("ignora um elemento que não existe", () => {
      const snapshot = repository.markMapElement("inexistente" as never);
      expect(snapshot.mapa.elementsSeen).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEYS.progress)).toBeNull();
    });
  });

  describe("avaliação", () => {
    it("guarda cada resposta confirmada e a retoma em uma nova leitura", () => {
      repository.saveAnswer("q1", 2);
      repository.saveAnswer("q2", 0);
      repository.saveAnswer("q1", 3);
      const reopened = new LocalStorageProgressRepository().get();
      expect(reopened.avaliacao.answers).toEqual({ q1: 3, q2: 0 });
    });

    it.each([
      ["índice negativo", "q1", -1],
      ["índice fracionário", "q1", 1.5],
      ["índice que não é número", "q1", Number.NaN],
      ["pergunta sem identificador", "", 0],
    ])("ignora %s", (_nome, questionId, option) => {
      expect(repository.saveAnswer(questionId, option).avaliacao.answers).toEqual({});
    });

    it("guarda o resultado sem apagar as respostas", () => {
      repository.saveAnswer("q1", 1);
      const snapshot = repository.saveAssessmentResult(result);
      expect(snapshot.avaliacao.result).toEqual(result);
      expect(snapshot.avaliacao.answers).toEqual({ q1: 1 });
    });

    it("refazer a avaliação apaga respostas e resultado e preserva o resto", () => {
      repository.markMapElement("publico");
      repository.markEbookPage(4);
      repository.markReportOpened();
      repository.saveAnswer("q1", 1);
      repository.saveAssessmentResult(result);

      const snapshot = repository.resetAssessment();
      expect(snapshot.avaliacao).toEqual({ answers: {}, result: null });
      expect(snapshot.mapa.elementsSeen).toEqual(["publico"]);
      expect(snapshot.ebook.pagesSeen).toEqual([4]);
      expect(snapshot.relatorio.openedAt).not.toBeNull();
    });
  });

  describe("relatório", () => {
    it("conta como visto ao abrir e guarda só a primeira abertura", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-11-06T10:00:00.000Z"));
      const first = repository.markReportOpened();
      expect(first.relatorio.openedAt).toBe("2026-11-06T10:00:00.000Z");

      vi.setSystemTime(new Date("2026-11-06T11:00:00.000Z"));
      const second = repository.markReportOpened();
      expect(second.relatorio.openedAt).toBe("2026-11-06T10:00:00.000Z");
    });
  });

  describe("vídeo", () => {
    it("o percentual nunca diminui e a posição acompanha o ponto mais recente", () => {
      repository.setVideoProgress(60, 90);
      const snapshot = repository.setVideoProgress(20, 30);
      expect(snapshot.video).toEqual({ percent: 60, positionSeconds: 30 });
    });

    it("limita o percentual a 100 e a posição a zero ou mais", () => {
      expect(repository.setVideoProgress(180, -5).video).toEqual({ percent: 100, positionSeconds: 0 });
    });

    it("ignora valores que não são números", () => {
      expect(repository.setVideoProgress(Number.NaN, 10).video).toEqual({ percent: 0, positionSeconds: 0 });
    });
  });

  describe("gravação", () => {
    it("registra o momento da última escrita", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-11-06T09:00:00.000Z"));
      expect(repository.markMapElement("atividades").updatedAt).toBe("2026-11-06T09:00:00.000Z");
    });

    it("uma operação sem efeito não grava nem muda a data", () => {
      repository.markMapElement("publico");
      const before = localStorage.getItem(STORAGE_KEYS.progress);
      repository.markMapElement("publico");
      expect(localStorage.getItem(STORAGE_KEYS.progress)).toBe(before);
    });

    it("sem espaço para gravar, não lança erro e devolve o estado desta chamada", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("cheio", "QuotaExceededError");
      });
      expect(() => repository.markEbookPage(3)).not.toThrow();
      expect(repository.markMapElement("publico").mapa.elementsSeen).toEqual(["publico"]);
    });
  });

  describe("apagar tudo", () => {
    it("remove o progresso e as páginas do e-book", () => {
      repository.markEbookPage(5);
      repository.markMapElement("publico");
      repository.clearAll();
      expect(localStorage.getItem(STORAGE_KEYS.progress)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.ebookPages)).toBeNull();
      expect(repository.get()).toEqual({ ...emptyProgress(), ebook: { pagesSeen: [] } });
    });

    it("preserva as preferências de acessibilidade", () => {
      localStorage.setItem("heroui-theme", "dark");
      localStorage.setItem("ead-portal:font-size", "large");
      repository.markMapElement("publico");
      repository.clearAll();
      expect(localStorage.getItem("heroui-theme")).toBe("dark");
      expect(localStorage.getItem("ead-portal:font-size")).toBe("large");
    });
  });
});
