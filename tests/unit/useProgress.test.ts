import { act, createElement, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useProgress } from "@/lib/journey/useProgress";
import { trailOptions } from "@/lib/journey/trailOptions";
import { useTrail } from "@/lib/journey/useTrail";
import { progressRepository } from "@/services/user-progress";
import { STORAGE_KEYS } from "@/services/user-progress/LocalStorageProgressRepository";

// Sem biblioteca de testes de componentes: monta com o react-dom em um elemento solto.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let renders = 0;

/** Conta as renderizações efetivadas (o efeito sem dependências roda a cada uma). */
const countRender = () => {
  renders += 1;
};

function ProgressProbe() {
  useEffect(countRender);
  const progress = useProgress();
  return createElement(
    "output",
    null,
    `mapa=${progress.mapa.elementsSeen.length};ebook=${progress.ebook.pagesSeen.length};respostas=${Object.keys(progress.avaliacao.answers).length}`,
  );
}

function TrailProbe() {
  const trail = useTrail();
  const ebook = trail.items.find((item) => item.id === "ebook");
  return createElement("output", null, `geral=${trail.overallPercent};ebook=${ebook?.percent};proximo=${trail.next}`);
}

function mount(component: () => ReturnType<typeof createElement>) {
  act(() => {
    root.render(createElement(component));
  });
}

describe("useProgress e useTrail", () => {
  beforeEach(() => {
    localStorage.clear();
    renders = 0;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("mostra o progresso que já estava salvo na primeira renderização", () => {
    progressRepository.markMapElement("publico");
    progressRepository.markEbookPage(5);
    mount(ProgressProbe);
    expect(container.textContent).toBe("mapa=1;ebook=1;respostas=0");
  });

  it("atualiza sozinho quando esta janela grava", () => {
    mount(ProgressProbe);
    expect(container.textContent).toBe("mapa=0;ebook=0;respostas=0");

    act(() => {
      progressRepository.markMapElement("objetivos");
      progressRepository.saveAnswer("q1", 2);
    });
    expect(container.textContent).toBe("mapa=1;ebook=0;respostas=1");
  });

  it("atualiza quando o leitor do e-book, em outra janela, grava as páginas", () => {
    mount(ProgressProbe);
    act(() => {
      localStorage.setItem(STORAGE_KEYS.ebookPages, JSON.stringify([1, 2, 3]));
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEYS.ebookPages }));
    });
    expect(container.textContent).toBe("mapa=0;ebook=3;respostas=0");
  });

  it("não entra em laço de renderização", () => {
    mount(ProgressProbe);
    act(() => {
      progressRepository.markMapElement("publico");
    });
    act(() => {
      progressRepository.markMapElement("publico"); // sem efeito: não deve renderizar de novo
    });
    expect(renders).toBeLessThanOrEqual(3);
  });

  it("volta ao vazio quando o progresso é apagado", () => {
    progressRepository.markMapElement("publico");
    mount(ProgressProbe);
    act(() => progressRepository.clearAll());
    expect(container.textContent).toBe("mapa=0;ebook=0;respostas=0");
  });

  it("depois de desmontar, uma escrita não renderiza nem lança erro", () => {
    mount(ProgressProbe);
    act(() => root.unmount());
    const antes = renders;
    expect(() => progressRepository.markMapElement("publico")).not.toThrow();
    expect(renders).toBe(antes);
    root = createRoot(container); // o afterEach desmonta de novo
  });

  // Os números abaixo supõem o vídeo ainda sem link (fora da média). Quando ele ganhar o link
  // em content/module.ts, este caso se pula: as regras com vídeo estão em trail.test.ts.
  it.skipIf(trailOptions.videoAvailable)("useTrail calcula o percentual e o próximo sugerido a partir do que está salvo", () => {
    for (let page = 1; page <= 18; page += 1) progressRepository.markEbookPage(page);
    mount(TrailProbe);
    expect(container.textContent).toBe("geral=25;ebook=100;proximo=mapa");

    act(() => {
      progressRepository.markMapElement("publico");
      progressRepository.markMapElement("objetivos");
    });
    expect(container.textContent).toBe("geral=38;ebook=100;proximo=mapa");
  });
});
