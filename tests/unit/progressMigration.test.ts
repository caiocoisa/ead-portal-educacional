import { describe, expect, it } from "vitest";
import { mapNodes } from "@/content/mapa";
import { EBOOK_TOTAL_PAGES, MAPA_ELEMENT_IDS } from "@/content/materiais";
import {
  emptyProgress,
  parseStoredProgress,
  sanitizeEbookPages,
  toAssessmentResult,
} from "@/services/user-progress/migrate";
import type { AssessmentResult } from "@/types/quiz";

const result: AssessmentResult = {
  answers: [
    { questionId: "q1", selectedOptionIndex: 2, correct: true },
    { questionId: "q2", selectedOptionIndex: 0, correct: false },
  ],
  correctCount: 1,
  totalCount: 2,
};

/** Fixture do formato v1 (uma etapa corrente, com nome), como o portal salvava antes. */
function v1(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    userId: "u-123",
    userName: "Marina",
    currentStep: "video",
    videoCompleted: false,
    assessmentResult: null,
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-02T10:00:00.000Z",
    ...overrides,
  });
}

describe("constantes de conteúdo dos materiais", () => {
  it("os elementos do mapa são os mesmos de content/mapa.ts", () => {
    expect([...MAPA_ELEMENT_IDS]).toEqual(mapNodes.map((node) => node.id));
  });

  it("o e-book tem 18 páginas", () => {
    expect(EBOOK_TOTAL_PAGES).toBe(18);
  });
});

describe("parseStoredProgress: o que não é progresso", () => {
  it.each([
    ["nada salvo", null],
    ["texto vazio", ""],
    ["JSON inválido", "{isso não é json"],
    ["um número", "42"],
    ["uma lista", "[1, 2]"],
    ["texto solto", '"oi"'],
    ["objeto qualquer", '{"a": 1}'],
    ["v1 com etapa desconhecida", v1({ currentStep: "certificado" })],
    ["v1 com etapa de outro tipo", v1({ currentStep: 3 })],
    ["versão futura", JSON.stringify({ version: 3 })],
    ["versão em texto", JSON.stringify({ version: "2" })],
  ])("devolve nulo para %s", (_nome, raw) => {
    expect(parseStoredProgress(raw)).toBeNull();
  });
});

describe("parseStoredProgress: formato v2", () => {
  it("lê um progresso válido sem pedir regravação", () => {
    const saved = {
      ...emptyProgress(),
      updatedAt: "2026-11-05T12:00:00.000Z",
      video: { percent: 40, positionSeconds: 12.5 },
      mapa: { elementsSeen: ["publico", "objetivos"] },
      avaliacao: { answers: { q1: 2 }, result },
      relatorio: { openedAt: "2026-11-05T12:30:00.000Z" },
    };
    const parsed = parseStoredProgress(JSON.stringify(saved));
    expect(parsed?.migrated).toBe(false);
    expect(parsed?.progress).toEqual(saved);
  });

  it("completa o que faltar com o valor vazio", () => {
    const parsed = parseStoredProgress(JSON.stringify({ version: 2 }));
    expect(parsed?.progress).toEqual(emptyProgress());
  });

  it("sanea valores ruins sem perder o que é válido", () => {
    const parsed = parseStoredProgress(
      JSON.stringify({
        version: 2,
        updatedAt: 99,
        video: { percent: 250, positionSeconds: -4 },
        mapa: { elementsSeen: ["publico", "publico", "inexistente", 7, "avaliacao"] },
        avaliacao: { answers: { q1: 1, q2: -1, q3: 1.5, q4: "2", q5: 0 }, result: { answers: "x" } },
        relatorio: { openedAt: "" },
      }),
    );
    expect(parsed?.progress).toEqual({
      version: 2,
      updatedAt: null,
      video: { percent: 100, positionSeconds: 0 },
      mapa: { elementsSeen: ["publico", "avaliacao"] },
      avaliacao: { answers: { q1: 1, q5: 0 }, result: null },
      relatorio: { openedAt: null },
    });
  });

  it("trata percentual que não é número como zero", () => {
    const parsed = parseStoredProgress(JSON.stringify({ version: 2, video: { percent: "metade" } }));
    expect(parsed?.progress.video.percent).toBe(0);
  });
});

describe("parseStoredProgress: migração do formato v1", () => {
  it("quem estava no vídeo começa tudo vazio", () => {
    const parsed = parseStoredProgress(v1());
    expect(parsed?.migrated).toBe(true);
    expect(parsed?.progress).toEqual({
      ...emptyProgress(),
      updatedAt: "2026-11-02T10:00:00.000Z",
    });
  });

  it("vídeo concluído vira 100% assistido", () => {
    const parsed = parseStoredProgress(v1({ currentStep: "avaliacao", videoCompleted: true }));
    expect(parsed?.progress.video).toEqual({ percent: 100, positionSeconds: 0 });
    expect(parsed?.progress.avaliacao).toEqual({ answers: {}, result: null });
    expect(parsed?.progress.relatorio.openedAt).toBeNull();
  });

  it("o resultado da avaliação é mantido e as respostas saem dele", () => {
    const parsed = parseStoredProgress(
      v1({ currentStep: "relatorio", videoCompleted: true, assessmentResult: result }),
    );
    expect(parsed?.progress.avaliacao.result).toEqual(result);
    expect(parsed?.progress.avaliacao.answers).toEqual({ q1: 2, q2: 0 });
  });

  it("quem estava no relatório já o tem como visto, na data da última atualização", () => {
    const parsed = parseStoredProgress(v1({ currentStep: "relatorio", assessmentResult: result }));
    expect(parsed?.progress.relatorio.openedAt).toBe("2026-11-02T10:00:00.000Z");
  });

  it("sem data de atualização, o relatório recebe a data da migração", () => {
    const parsed = parseStoredProgress(v1({ currentStep: "relatorio", updatedAt: undefined }));
    expect(parsed?.progress.updatedAt).toBeNull();
    expect(typeof parsed?.progress.relatorio.openedAt).toBe("string");
  });

  it("o resultado defeituoso é descartado, sem derrubar a migração", () => {
    const parsed = parseStoredProgress(
      v1({ currentStep: "relatorio", assessmentResult: { answers: [{ questionId: 1 }] } }),
    );
    expect(parsed?.progress.avaliacao).toEqual({ answers: {}, result: null });
  });

  it("não leva o nome nem o identificador para o formato novo", () => {
    const parsed = parseStoredProgress(v1({ currentStep: "avaliacao", videoCompleted: true }));
    const texto = JSON.stringify(parsed?.progress);
    expect(texto).not.toContain("Marina");
    expect(texto).not.toContain("u-123");
    expect(texto).not.toContain("userName");
  });
});

describe("toAssessmentResult", () => {
  it("aceita um resultado completo", () => {
    expect(toAssessmentResult(result)).toEqual(result);
  });

  it.each([
    ["nulo", null],
    ["sem respostas", { correctCount: 0, totalCount: 0 }],
    ["contagem negativa", { ...result, correctCount: -1 }],
    ["contagem fracionária", { ...result, totalCount: 2.5 }],
    ["resposta sem identificador", { ...result, answers: [{ selectedOptionIndex: 0, correct: true }] }],
    ["resposta com acerto em texto", { ...result, answers: [{ questionId: "q1", selectedOptionIndex: 0, correct: "sim" }] }],
  ])("recusa %s", (_nome, value) => {
    expect(toAssessmentResult(value)).toBeNull();
  });
});

describe("sanitizeEbookPages", () => {
  it("mantém só páginas de 1 a 18, sem repetição e em ordem", () => {
    expect(sanitizeEbookPages([5, 1, 5, 18, 0, 19, 2.5, "3", null, -2, 12])).toEqual([1, 5, 12, 18]);
  });

  it("devolve lista vazia quando não é uma lista", () => {
    expect(sanitizeEbookPages(undefined)).toEqual([]);
    expect(sanitizeEbookPages("1,2,3")).toEqual([]);
    expect(sanitizeEbookPages({ 0: 1 })).toEqual([]);
  });
});
