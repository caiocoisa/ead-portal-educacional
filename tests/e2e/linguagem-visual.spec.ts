import { expect, test, type Page } from "@playwright/test";
import { MODOS_VISUAIS, aguardarPreferencias } from "../helpers/modos";
import { seedState } from "../helpers/progress";

/**
 * Linguagem visual (Task 68): as classes de superfície de `app/globals.css`, nos três modos.
 *
 * O axe marca texto sobre gradiente como "incompleto", não como violação, então o contraste do texto
 * sobre as DUAS PONTAS de cada gradiente é conferido aqui, com as cores reais calculadas pelo navegador.
 */

interface Superficie {
  classe: string;
  /** Tokens das pontas do gradiente (conferidos fora do alto contraste). */
  pontas: string[];
  /** Tokens de cor de texto que aparecem sobre a superfície. */
  textos: string[];
}

/** O fundo da página não é uma classe: é o `body`, e todo texto solto fica sobre ele. */
const PAGINA = "pagina";

const SUPERFICIES: Superficie[] = [
  {
    classe: PAGINA,
    pontas: ["--page-from", "--page-to", "--glow-blue", "--glow-gold"],
    textos: ["--foreground", "--muted"],
  },
  { classe: "surface-card", pontas: ["--card-from", "--card-to"], textos: ["--foreground", "--muted"] },
  { classe: "surface-tint", pontas: ["--tint-from", "--tint-to"], textos: ["--foreground", "--muted"] },
  {
    classe: "surface-highlight",
    pontas: ["--highlight-from", "--highlight-to"],
    textos: ["--foreground", "--muted"],
  },
  {
    classe: "surface-success",
    pontas: ["--success-tint-from", "--success-tint-to"],
    textos: ["--foreground", "--muted", "--success"],
  },
  {
    classe: "surface-danger",
    pontas: ["--danger-tint-from", "--danger-tint-to"],
    textos: ["--foreground", "--muted", "--danger-text"],
  },
  { classe: "surface-hero", pontas: ["--hero-from", "--hero-mid", "--hero-to"], textos: ["--on-hero"] },
  { classe: "surface-primary", pontas: ["--primary-from", "--primary-to"], textos: ["--accent-foreground"] },
];

interface Medida {
  classe: string;
  imagem: string;
  sombra: string;
  bordaTopo: string;
  bordaTopoCor: string;
  bordaBase: string;
  fundoSolido: string;
  corDoTexto: string;
  /** rgb de cada ponta do gradiente e de cada cor de texto, resolvidas pelo navegador. */
  pontas: Record<string, string>;
  textos: Record<string, string>;
  /** Pior contraste de cada texto contra as pontas (fora do alto contraste) ou contra o fundo sólido. */
  contrastes: Record<string, number>;
}

/** Cria uma amostra de cada superfície e mede o que o navegador calculou; roda dentro da página. */
async function medirSuperficies(page: Page, superficies: Superficie[]): Promise<Medida[]> {
  return page.evaluate((lista) => {
    const tela = document.createElement("canvas");
    tela.width = tela.height = 1;
    const contexto = tela.getContext("2d")!;
    const paraRgb = (cor: string) => {
      contexto.clearRect(0, 0, 1, 1);
      contexto.fillStyle = cor;
      contexto.fillRect(0, 0, 1, 1);
      const [r, g, b] = contexto.getImageData(0, 0, 1, 1).data;
      return { r, g, b };
    };
    const luminancia = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const [x, y, z] = [r, g, b].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * x + 0.7152 * y + 0.0722 * z;
    };
    const contraste = (a: string, b: string) => {
      const [maior, menor] = [luminancia(paraRgb(a)), luminancia(paraRgb(b))].sort((p, q) => q - p);
      return (maior + 0.05) / (menor + 0.05);
    };
    const texto = ({ r, g, b }: { r: number; g: number; b: number }) => `rgb(${r}, ${g}, ${b})`;
    /** Cor de um token, resolvida pelo navegador (cobre `color-mix` e `var()` encadeados). */
    const resolver = (token: string, propriedade: "color" | "backgroundColor") => {
      const sonda = document.createElement("span");
      sonda.style[propriedade] = `var(${token})`;
      document.body.append(sonda);
      const valor = getComputedStyle(sonda)[propriedade];
      sonda.remove();
      return valor;
    };
    const altoContraste = document.documentElement.getAttribute("data-contrast") === "high";

    return lista.map((s) => {
      const ehPagina = s.classe === "pagina";
      const caixa = document.createElement("div");
      caixa.className = ehPagina ? "" : s.classe;
      document.body.append(caixa);
      const estilo = getComputedStyle(caixa);
      const pontas: Record<string, string> = {};
      for (const token of s.pontas) pontas[token] = texto(paraRgb(resolver(token, "backgroundColor")));
      const textos: Record<string, string> = {};
      for (const token of s.textos) textos[token] = texto(paraRgb(resolver(token, "color")));
      const contrastes: Record<string, number> = {};
      for (const token of s.textos) {
        // Alto contraste não tem gradiente: vale o fundo sólido da própria superfície.
        const fundoSolido = ehPagina ? getComputedStyle(document.body).backgroundColor : estilo.backgroundColor;
        const fundos = altoContraste ? [fundoSolido] : Object.values(pontas);
        contrastes[token] = Math.min(...fundos.map((fundo) => contraste(textos[token], fundo)));
      }
      const medida: Medida = {
        classe: s.classe,
        imagem: estilo.backgroundImage,
        sombra: estilo.boxShadow,
        bordaTopo: estilo.borderTopWidth,
        bordaTopoCor: estilo.borderTopColor,
        bordaBase: estilo.borderBottomWidth,
        fundoSolido: estilo.backgroundColor,
        corDoTexto: estilo.color,
        pontas,
        textos,
        contrastes,
      };
      caixa.remove();
      return medida;
    });
  }, superficies);
}

async function abrirNoModo(page: Page, preferencias: (typeof MODOS_VISUAIS)[number]["preferencias"]) {
  await seedState(page, { preferences: preferencias });
  await page.goto("/");
  await aguardarPreferencias(page, preferencias);
}

test.describe("linguagem visual: superfícies, gradientes e sombras", () => {
  for (const modo of MODOS_VISUAIS) {
    const alto = modo.preferencias.contrast === "high";

    test(`${modo.nome}: texto com pelo menos 4,5:1 sobre todas as pontas de cada superfície`, async ({ page }) => {
      await abrirNoModo(page, modo.preferencias);
      const medidas = await medirSuperficies(page, SUPERFICIES);
      expect(medidas).toHaveLength(SUPERFICIES.length);
      for (const medida of medidas) {
        for (const [token, valor] of Object.entries(medida.contrastes)) {
          expect(valor, `${medida.classe}: ${token} (${medida.textos[token]}) sobre ${JSON.stringify(medida.pontas)}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });

    test(
      alto
        ? "alto contraste: sem gradiente nem sombra, borda de 2 px na cor do texto"
        : `${modo.nome}: gradiente, sombra e borda clara de 1 px`,
      async ({ page }) => {
        await abrirNoModo(page, modo.preferencias);
        const medidas = await medirSuperficies(page, SUPERFICIES);
        // O botão primário não tem borda nem sombra, e a página não é uma caixa: ficam de fora daqui.
        const visuais = medidas.filter((m) => m.classe !== "surface-primary" && m.classe !== PAGINA);
        for (const medida of visuais) {
          if (alto) {
            expect(medida.imagem, `${medida.classe} sem gradiente`).toBe("none");
            expect(medida.sombra, `${medida.classe} sem sombra`).toBe("none");
            expect(medida.bordaTopo, `${medida.classe} borda forte`).toBe("2px");
            // A borda tem a mesma cor do texto da página.
            const corDoTexto = await page.evaluate(() => getComputedStyle(document.body).color);
            expect(medida.bordaTopoCor, `${medida.classe} borda na cor do texto`).toBe(corDoTexto);
          } else {
            expect(medida.imagem, `${medida.classe} com gradiente`).toContain("gradient");
            expect(medida.sombra, `${medida.classe} com sombra`).not.toBe("none");
            expect(medida.bordaTopo, `${medida.classe} borda fina`).toBe("1px");
          }
        }
        // A faixa de destaque mantém o filete dourado embaixo (decorativo, 4 px).
        const hero = medidas.find((m) => m.classe === "surface-hero")!;
        expect(hero.bordaBase).toBe("4px");
        // O botão primário não tem borda nem sombra, só o gradiente (ou a cor sólida).
        const primario = medidas.find((m) => m.classe === "surface-primary")!;
        if (alto) expect(primario.imagem).toBe("none");
        else expect(primario.imagem).toContain("gradient");
      },
    );

    test(`${modo.nome}: o fundo da página e as barras de progresso seguem o modo`, async ({ page }) => {
      await abrirNoModo(page, modo.preferencias);
      const dados = await page.evaluate(() => {
        const progresso = document.createElement("div");
        progresso.className = "fill-progress";
        const concluido = document.createElement("div");
        concluido.className = "fill-done";
        document.body.append(progresso, concluido);
        const lidos = {
          pagina: getComputedStyle(document.body).backgroundImage,
          progresso: getComputedStyle(progresso).backgroundImage,
          concluido: getComputedStyle(concluido).backgroundImage,
          progressoSolido: getComputedStyle(progresso).backgroundColor,
        };
        progresso.remove();
        concluido.remove();
        return lidos;
      });
      for (const imagem of [dados.pagina, dados.progresso, dados.concluido]) {
        if (alto) expect(imagem).toBe("none");
        else expect(imagem).toContain("gradient");
      }
      // Sem gradiente, a barra continua com cor (não some).
      expect(dados.progressoSolido).not.toBe("rgba(0, 0, 0, 0)");
    });
  }

  test("o tema escuro tem pontas próprias: nenhuma superfície repete as cores do tema claro", async ({ page }) => {
    await abrirNoModo(page, { theme: "light" });
    const claro = await medirSuperficies(page, SUPERFICIES);

    const escuro = await (async () => {
      await seedState(page, { preferences: { theme: "dark" } });
      await page.reload();
      await aguardarPreferencias(page, { theme: "dark" });
      return medirSuperficies(page, SUPERFICIES);
    })();

    for (const superficie of SUPERFICIES) {
      const a = claro.find((m) => m.classe === superficie.classe)!;
      const b = escuro.find((m) => m.classe === superficie.classe)!;
      // Cada ponta, uma a uma: o botão primário e a faixa de destaque também mudam (o marinho some
      // contra o fundo escuro). Comparar o conjunto deixaria passar uma única ponta repetida do claro.
      for (const token of superficie.pontas) {
        expect(b.pontas[token], `${superficie.classe}: ${token} do escuro igual à do claro`).not.toBe(a.pontas[token]);
      }
    }
  });
});
