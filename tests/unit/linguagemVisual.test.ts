import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Regras visuais aprovadas (Task 68), cobradas nos fontes. O que o navegador calcula nas telas reais
 * fica em `tests/e2e/linguagem-visual.spec.ts`; aqui se pega o padrão antes de ele chegar à tela.
 */

const RAIZ = process.cwd();

function arquivosTsx(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) return arquivosTsx(caminho);
    return caminho.endsWith(".tsx") ? [caminho] : [];
  });
}

const FONTES = [...arquivosTsx(join(RAIZ, "app")), ...arquivosTsx(join(RAIZ, "components"))].map((caminho) => ({
  arquivo: relative(RAIZ, caminho).replaceAll("\\", "/"),
  linhas: readFileSync(caminho, "utf8").split(/\r?\n/),
}));

/** Linhas dos fontes que casam com o padrão, no formato `arquivo:linha`. */
function ocorrencias(padrao: RegExp): string[] {
  return FONTES.flatMap(({ arquivo, linhas }) =>
    linhas.flatMap((linha, indice) => (padrao.test(linha) ? [`${arquivo}:${indice + 1}  ${linha.trim().slice(0, 110)}`] : []))
  );
}

describe("linguagem visual nos fontes", () => {
  it("varre os componentes e as páginas (a varredura não está vazia)", () => {
    expect(FONTES.length).toBeGreaterThan(30);
  });

  it("nenhum cartão usa faixa colorida na lateral (borda lateral de 3 px ou mais)", () => {
    // `border-r-2` do rabinho do balão do quadrinho é decoração, não faixa: por isso o limite é 3 px.
    expect(ocorrencias(/\bborder-(?:l|r|s|e)-(?:[3-9]|\[)/)).toEqual([]);
  });

  it("nenhuma caixa chapada de 1 px: cartões usam `surface-*`, e molduras, `surface-frame`", () => {
    expect(ocorrencias(/\bborder border-\(--border\)/)).toEqual([]);
  });

  it("sombras vêm dos tokens, que somem no alto contraste (sem `shadow-sm`, `shadow-md` etc.)", () => {
    expect(ocorrencias(/\bshadow-(?:xs|sm|md|lg|xl|2xl|inner)\b/)).toEqual([]);
  });

  it("toda superfície usada existe no CSS (classe digitada errado não vira cartão)", () => {
    const css = readFileSync(join(RAIZ, "app/globals.css"), "utf8");
    const definidas = new Set([...css.matchAll(/\.((?:surface|panel|fill)-[a-z]+)\b/g)].map((m) => m[1]));
    expect(definidas.size).toBeGreaterThanOrEqual(10);

    const usadas = new Map<string, string>();
    for (const { arquivo, linhas } of FONTES) {
      linhas.forEach((linha, indice) => {
        for (const m of linha.matchAll(/(?<![\w-])((?:surface|panel|fill)-[a-z]+)(?![\w(-])/g)) {
          usadas.set(m[1], `${arquivo}:${indice + 1}`);
        }
      });
    }
    // `surface-secondary`, `surface-foreground` etc. são tokens do HeroUI, usados só entre parênteses.
    const inexistentes = [...usadas].filter(([classe]) => !definidas.has(classe));
    expect(inexistentes).toEqual([]);
    expect(usadas.size).toBeGreaterThanOrEqual(5);
  });
});
