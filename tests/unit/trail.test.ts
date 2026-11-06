import { describe, expect, it } from "vitest";
import { moduleContent } from "@/content/module";
import { EBOOK_TOTAL_PAGES } from "@/content/materiais";
import {
  buildTrail,
  describeTrailItem,
  DONE_THRESHOLD_PERCENT,
  TRAIL_ITEMS,
  type TrailItemId,
  type TrailOptions,
} from "@/lib/journey/trail";
import { trailOptions } from "@/lib/journey/trailOptions";
import { emptyProgress } from "@/services/user-progress/migrate";
import type { ProgressSnapshot } from "@/types/progress";
import type { AssessmentResult } from "@/types/quiz";

const OPTIONS: TrailOptions = { videoAvailable: false, questionIds: ["q1", "q2", "q3", "q4"] };
const WITH_VIDEO: TrailOptions = { ...OPTIONS, videoAvailable: true };

const result: AssessmentResult = {
  answers: [{ questionId: "q1", selectedOptionIndex: 0, correct: true }],
  correctCount: 1,
  totalCount: 1,
};

function pages(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

function progress(overrides: Partial<ProgressSnapshot> = {}): ProgressSnapshot {
  return { ...emptyProgress(), ebook: { pagesSeen: [] }, ...overrides };
}

function item(state: ReturnType<typeof buildTrail>, id: TrailItemId) {
  const found = state.items.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`item ${id} ausente`);
  return found;
}

describe("itens da trilha", () => {
  it("seguem a ordem sugerida: vídeo, e-book, mapa, avaliação e relatório", () => {
    expect(TRAIL_ITEMS.map((definition) => definition.id)).toEqual([
      "video",
      "ebook",
      "mapa",
      "avaliacao",
      "relatorio",
    ]);
  });

  it("têm rótulo, rótulo curto e rota próprios, sem repetição", () => {
    const hrefs = TRAIL_ITEMS.map((definition) => definition.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const definition of TRAIL_ITEMS) {
      expect(definition.label).not.toBe("");
      expect(definition.shortLabel).not.toBe("");
      expect(definition.href.startsWith("/")).toBe(true);
    }
  });

  it("o limite para concluir é 80%", () => {
    expect(DONE_THRESHOLD_PERCENT).toBe(80);
  });
});

describe("opções tiradas do conteúdo do módulo", () => {
  it("o vídeo só conta quando tem link", () => {
    expect(trailOptions.videoAvailable).toBe(moduleContent.youtubeVideoId !== null);
  });

  it("a avaliação mede as perguntas que existem, sem repetir identificador", () => {
    expect(trailOptions.questionIds).toEqual(moduleContent.questions.map((question) => question.id));
    expect(new Set(trailOptions.questionIds).size).toBe(trailOptions.questionIds.length);
    expect(trailOptions.questionIds.length).toBeGreaterThan(0);
  });
});

describe("buildTrail: sem progresso", () => {
  const state = buildTrail(progress(), OPTIONS);

  it("tudo em 0%, o vídeo marcado como em breve e o geral em 0", () => {
    expect(state.overallPercent).toBe(0);
    expect(item(state, "video")).toMatchObject({ status: "soon", available: false, percent: 0 });
    for (const id of ["ebook", "mapa", "avaliacao", "relatorio"] as const) {
      expect(item(state, id)).toMatchObject({ status: "todo", available: true, percent: 0 });
    }
  });

  it("o próximo sugerido é o e-book, porque o vídeo ainda não existe", () => {
    expect(state.next).toBe("ebook");
  });

  it("informa as unidades de cada material", () => {
    expect(item(state, "ebook")).toMatchObject({ seen: 0, total: EBOOK_TOTAL_PAGES });
    expect(item(state, "mapa")).toMatchObject({ seen: 0, total: 4 });
    expect(item(state, "avaliacao")).toMatchObject({ seen: 0, total: 4 });
    expect(item(state, "relatorio")).toMatchObject({ seen: null, total: null });
    expect(item(state, "video")).toMatchObject({ seen: null, total: null });
  });
});

describe("buildTrail: os casos dos protótipos aprovados", () => {
  it("e-book completo e dois elementos do mapa dão 38% no geral e o mapa como próximo", () => {
    const state = buildTrail(
      progress({ ebook: { pagesSeen: pages(18) }, mapa: { elementsSeen: ["publico", "objetivos"] } }),
      OPTIONS,
    );
    expect(item(state, "ebook")).toMatchObject({ status: "done", percent: 100 });
    expect(item(state, "mapa")).toMatchObject({ status: "doing", percent: 50, seen: 2, total: 4 });
    expect(state.overallPercent).toBe(38);
    expect(state.next).toBe("mapa");
  });

  it("no relatório do protótipo o geral é 94% e o mapa em 75% segue em andamento", () => {
    const state = buildTrail(
      progress({
        ebook: { pagesSeen: pages(18) },
        mapa: { elementsSeen: ["publico", "objetivos", "atividades"] },
        avaliacao: { answers: { q1: 0, q2: 1, q3: 2, q4: 0 }, result },
        relatorio: { openedAt: "2026-11-06T10:00:00.000Z" },
      }),
      OPTIONS,
    );
    expect(item(state, "mapa")).toMatchObject({ status: "doing", percent: 75 });
    expect(item(state, "avaliacao")).toMatchObject({ status: "done", percent: 100 });
    expect(item(state, "relatorio")).toMatchObject({ status: "done", percent: 100 });
    expect(state.overallPercent).toBe(94);
    expect(state.next).toBe("mapa");
  });
});

describe("buildTrail: o limite de 80% para concluir", () => {
  it("14 páginas do e-book (78%) ainda estão em andamento; 15 (83%) concluem", () => {
    const antes = buildTrail(progress({ ebook: { pagesSeen: pages(14) } }), OPTIONS);
    const depois = buildTrail(progress({ ebook: { pagesSeen: pages(15) } }), OPTIONS);
    expect(item(antes, "ebook")).toMatchObject({ status: "doing", percent: 78 });
    expect(item(depois, "ebook")).toMatchObject({ status: "done", percent: 83 });
  });

  it("3 de 4 perguntas (75%) não concluem a avaliação; 4 de 4 concluem", () => {
    const tres = buildTrail(progress({ avaliacao: { answers: { q1: 0, q2: 0, q3: 0 }, result: null } }), OPTIONS);
    const quatro = buildTrail(
      progress({ avaliacao: { answers: { q1: 0, q2: 0, q3: 0, q4: 0 }, result: null } }),
      OPTIONS,
    );
    expect(item(tres, "avaliacao")).toMatchObject({ status: "doing", percent: 75, seen: 3 });
    expect(item(quatro, "avaliacao")).toMatchObject({ status: "done", percent: 100, seen: 4 });
  });

  it("uma página só já é 'em andamento' e arredonda para cima", () => {
    const state = buildTrail(progress({ ebook: { pagesSeen: [4] } }), OPTIONS);
    expect(item(state, "ebook")).toMatchObject({ status: "doing", percent: 6 });
  });
});

describe("buildTrail: avaliação", () => {
  it("ignora respostas de perguntas que não existem mais", () => {
    const state = buildTrail(
      progress({ avaliacao: { answers: { q1: 0, antiga: 1, outra: 2 }, result: null } }),
      OPTIONS,
    );
    expect(item(state, "avaliacao")).toMatchObject({ seen: 1, percent: 25 });
  });

  it("com o resultado salvo vale como concluída, mesmo sem as respostas", () => {
    const state = buildTrail(progress({ avaliacao: { answers: {}, result } }), OPTIONS);
    expect(item(state, "avaliacao")).toMatchObject({ status: "done", percent: 100, seen: 4, total: 4 });
  });

  it("não confunde o nome de uma propriedade herdada com uma resposta", () => {
    const state = buildTrail(progress(), { ...OPTIONS, questionIds: ["constructor", "toString"] });
    expect(item(state, "avaliacao")).toMatchObject({ seen: 0, percent: 0 });
  });

  it("sem perguntas não divide por zero", () => {
    const state = buildTrail(progress(), { ...OPTIONS, questionIds: [] });
    expect(item(state, "avaliacao")).toMatchObject({ percent: 0, total: 0 });
    expect(Number.isFinite(state.overallPercent)).toBe(true);
  });
});

describe("buildTrail: vídeo", () => {
  it("sem link, fica de fora do geral e nunca é o próximo, mesmo com percentual salvo", () => {
    const state = buildTrail(progress({ video: { percent: 100, positionSeconds: 0 } }), OPTIONS);
    expect(item(state, "video")).toMatchObject({ status: "soon", percent: 0 });
    expect(state.overallPercent).toBe(0);
    expect(state.next).toBe("ebook");
  });

  it("com link, entra na média e passa a ser o primeiro próximo sugerido", () => {
    const state = buildTrail(progress({ video: { percent: 40, positionSeconds: 30 } }), WITH_VIDEO);
    expect(item(state, "video")).toMatchObject({ status: "doing", available: true, percent: 40 });
    expect(state.overallPercent).toBe(8);
    expect(state.next).toBe("video");
  });

  it("com o vídeo concluído, o próximo passa para o e-book", () => {
    const state = buildTrail(progress({ video: { percent: 85, positionSeconds: 100 } }), WITH_VIDEO);
    expect(item(state, "video")).toMatchObject({ status: "done" });
    expect(state.next).toBe("ebook");
  });

  it("o percentual quebrado do vídeo é arredondado", () => {
    const state = buildTrail(progress({ video: { percent: 33.6, positionSeconds: 5 } }), WITH_VIDEO);
    expect(item(state, "video").percent).toBe(34);
  });
});

describe("buildTrail: relatório e fim da trilha", () => {
  it("conta como visto ao abrir", () => {
    const state = buildTrail(progress({ relatorio: { openedAt: "2026-11-06T10:00:00.000Z" } }), OPTIONS);
    expect(item(state, "relatorio")).toMatchObject({ status: "done", percent: 100 });
  });

  it("com tudo concluído, não há próximo e o geral é 100%", () => {
    const state = buildTrail(
      progress({
        ebook: { pagesSeen: pages(18) },
        mapa: { elementsSeen: ["publico", "objetivos", "atividades", "avaliacao"] },
        avaliacao: { answers: {}, result },
        relatorio: { openedAt: "2026-11-06T10:00:00.000Z" },
      }),
      OPTIONS,
    );
    expect(state.overallPercent).toBe(100);
    expect(state.next).toBeNull();
  });

  it("páginas além do total não passam de 100%", () => {
    const state = buildTrail(progress({ ebook: { pagesSeen: pages(25) } }), OPTIONS);
    expect(item(state, "ebook").percent).toBe(100);
  });

  it("o próximo sugerido pula o que já foi concluído, na ordem da trilha", () => {
    const state = buildTrail(
      progress({ ebook: { pagesSeen: pages(18) }, mapa: { elementsSeen: ["publico", "objetivos", "atividades", "avaliacao"] } }),
      OPTIONS,
    );
    expect(state.next).toBe("avaliacao");
  });
});

describe("describeTrailItem: a linha de estado da primeira tela", () => {
  const texto = (partial: Partial<ProgressSnapshot>, id: TrailItemId, options = OPTIONS) =>
    describeTrailItem(item(buildTrail(progress(partial), options), id));

  it("e-book: palavra de estado, páginas vistas e percentual", () => {
    expect(texto({}, "ebook")).toBe("Não iniciado · 0 de 18 páginas · 0%");
    expect(texto({ ebook: { pagesSeen: pages(3) } }, "ebook")).toBe("Em andamento · 3 de 18 páginas · 17%");
    expect(texto({ ebook: { pagesSeen: pages(18) } }, "ebook")).toBe("Concluído · 18 de 18 páginas · 100%");
  });

  it("mapa: elementos vistos", () => {
    expect(texto({ mapa: { elementsSeen: ["publico", "objetivos"] } }, "mapa")).toBe(
      "Em andamento · 2 de 4 elementos · 50%"
    );
  });

  it("avaliação concorda no feminino", () => {
    expect(texto({}, "avaliacao")).toBe("Não iniciada · 0 de 4 perguntas · 0%");
    expect(texto({ avaliacao: { answers: { q1: 0, q2: 0, q3: 0, q4: 0 }, result: null } }, "avaliacao")).toBe(
      "Concluída · 4 de 4 perguntas · 100%"
    );
  });

  it("relatório: visto ou ainda não aberto, sem unidades", () => {
    expect(texto({}, "relatorio")).toBe("Ainda não aberto · 0%");
    expect(texto({ relatorio: { openedAt: "2026-11-06T10:00:00.000Z" } }, "relatorio")).toBe("Visto · 100%");
  });

  it("vídeo sem link avisa que está fora do cálculo; com link mostra só o percentual", () => {
    expect(texto({}, "video")).toBe("Ainda não publicado · fora do cálculo do progresso");
    expect(texto({ video: { percent: 40, positionSeconds: 30 } }, "video", WITH_VIDEO)).toBe(
      "Em andamento · 40%"
    );
  });
});
