import { expect, test, type Page } from "@playwright/test";
import { seedState, type Preferences } from "../helpers/progress";

/**
 * A barra de rolagem é estilizada em `app/globals.css` e em `public/ebook/leitor.html`. O Chromium
 * em modo headless não desenha barras, mas informa o estilo calculado de cada parte (`::-webkit-scrollbar*`),
 * que é o que estes testes leem: a forma (fina, polegar arredondado), as cores de cada tema e o contraste
 * mínimo de 3:1 (WCAG 1.4.11) contra a página e contra os cartões.
 */

/**
 * `polegar` é a cor exata esperada em cada modo: sem ela, um modo sem estilo próprio passaria
 * despercebido. No alto contraste a cor é a do texto, conferida num teste à parte.
 */
const MODOS: Array<{ nome: string; preferencias: Partial<Preferences>; polegar?: string }> = [
  { nome: "tema claro", preferencias: { theme: "light" }, polegar: "rgb(111, 127, 153)" },
  { nome: "tema escuro", preferencias: { theme: "dark" }, polegar: "rgb(93, 127, 176)" },
  { nome: "alto contraste", preferencias: { theme: "light", contrast: "high" } },
];

interface Barra {
  largura: string;
  altura: string;
  raio: string;
  borda: string;
  polegar: string;
  trilho: string;
  corDoTexto: string;
  fundoDaPagina: string;
  fundoDoCartao: string;
  /** Contraste do polegar com a página, com o cartão, e o do polegar em hover com o de repouso. */
  contrasteComPagina: number;
  contrasteComCartao: number;
  hoverMaisForte: boolean;
}

/**
 * As preferências salvas só chegam ao `<html>` depois da hidratação. Ler antes disso devolveria as
 * cores do tema claro e faria qualquer modo parecer correto; por isso espera o atributo aparecer.
 */
async function aguardarPreferencias(page: Page, preferencias: Partial<Preferences>) {
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", preferencias.theme ?? "light");
  if (preferencias.contrast === "high") {
    await expect(html).toHaveAttribute("data-contrast", "high");
  }
}

/** O navegador devolve `lab(...)` para cores do tema e `rgb(...)` para o polegar; converte para comparar. */
async function corEmRgb(page: Page, cor: string): Promise<string> {
  return page.evaluate((valor) => {
    const tela = document.createElement("canvas");
    tela.width = tela.height = 1;
    const contexto = tela.getContext("2d")!;
    contexto.fillStyle = valor;
    contexto.fillRect(0, 0, 1, 1);
    const [r, g, b] = contexto.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  }, cor);
}

/** Lê o estilo calculado da barra do documento; roda no navegador. */
async function lerBarra(page: Page): Promise<Barra> {
  return page.evaluate(() => {
    const para = (cor: string) => {
      const tela = document.createElement("canvas");
      tela.width = tela.height = 1;
      const contexto = tela.getContext("2d")!;
      contexto.clearRect(0, 0, 1, 1);
      contexto.fillStyle = cor;
      contexto.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = contexto.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a };
    };
    const luminancia = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const [x, y, z] = [r, g, b].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * x + 0.7152 * y + 0.0722 * z;
    };
    const contraste = (a: string, b: string) => {
      const [maior, menor] = [luminancia(para(a)), luminancia(para(b))].sort((p, q) => q - p);
      return (maior + 0.05) / (menor + 0.05);
    };
    const raiz = document.documentElement;
    const barra = getComputedStyle(raiz, "::-webkit-scrollbar");
    const polegar = getComputedStyle(raiz, "::-webkit-scrollbar-thumb");
    const trilho = getComputedStyle(raiz, "::-webkit-scrollbar-track");
    const estilo = getComputedStyle(raiz);
    const fundoDaPagina = getComputedStyle(document.body).backgroundColor;
    const fundoDoCartao = estilo.getPropertyValue("--surface").trim();
    const hover = estilo.getPropertyValue("--scroll-thumb-hover").trim();
    const repouso = estilo.getPropertyValue("--scroll-thumb").trim();
    return {
      largura: barra.width,
      altura: barra.height,
      raio: polegar.borderTopLeftRadius,
      borda: polegar.borderTopWidth,
      polegar: polegar.backgroundColor,
      trilho: trilho.backgroundColor,
      corDoTexto: getComputedStyle(document.body).color,
      fundoDaPagina,
      fundoDoCartao,
      contrasteComPagina: contraste(polegar.backgroundColor, fundoDaPagina),
      contrasteComCartao: contraste(polegar.backgroundColor, fundoDoCartao),
      hoverMaisForte: contraste(hover, fundoDaPagina) >= contraste(repouso, fundoDaPagina),
    };
  });
}

test.describe("barra de rolagem do portal", () => {
  for (const modo of MODOS) {
    test(`${modo.nome}: barra fina, polegar arredondado e com contraste de 3:1`, async ({ page }) => {
      await seedState(page, { preferences: modo.preferencias });
      await page.goto("/");
      await aguardarPreferencias(page, modo.preferencias);
      const barra = await lerBarra(page);

      // A cor de cada tema é a esperada (o alto contraste usa a cor do texto, testada abaixo).
      if (modo.polegar) expect(barra.polegar).toBe(modo.polegar);

      // Forma: nada da barra grossa do sistema, e o polegar é uma pílula recuada da borda.
      expect(barra.largura).toBe("12px");
      expect(barra.altura).toBe("12px");
      expect(barra.borda).toBe("3px");
      expect(Number.parseFloat(barra.raio)).toBeGreaterThanOrEqual(100);

      // O polegar existe e não é a cor padrão do sistema (transparente significaria estilo não aplicado).
      expect(barra.polegar).not.toBe("rgba(0, 0, 0, 0)");

      // Contraste de componente de interface: 3:1 com a página e com os cartões.
      expect(barra.contrasteComPagina).toBeGreaterThanOrEqual(3);
      expect(barra.contrasteComCartao).toBeGreaterThanOrEqual(3);
      expect(barra.hoverMaisForte).toBe(true);
    });
  }

  test("no alto contraste o polegar tem a cor do texto e o trilho aparece", async ({ page }) => {
    await seedState(page, { preferences: { contrast: "high" } });
    await page.goto("/");
    await aguardarPreferencias(page, { contrast: "high" });
    const barra = await lerBarra(page);
    expect(await corEmRgb(page, barra.polegar)).toBe(await corEmRgb(page, barra.corDoTexto));
    expect(barra.trilho).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("fora do alto contraste o trilho é transparente, sem caixa chapada", async ({ page }) => {
    await seedState(page);
    await page.goto("/");
    await aguardarPreferencias(page, {});
    const barra = await lerBarra(page);
    expect(barra.trilho).toBe("rgba(0, 0, 0, 0)");
  });
});

test.describe("barra de rolagem do leitor do e-book", () => {
  test("segue a mesma forma do portal, em azul claro sobre a moldura marinho", async ({ page }) => {
    await seedState(page);
    await page.goto("/ebook/leitor.html");
    const dados = await page.evaluate(() => {
      const raiz = document.documentElement;
      const barra = getComputedStyle(raiz, "::-webkit-scrollbar");
      const polegar = getComputedStyle(raiz, "::-webkit-scrollbar-thumb");
      return {
        largura: barra.width,
        borda: polegar.borderTopWidth,
        raio: polegar.borderTopLeftRadius,
        polegar: polegar.backgroundColor,
      };
    });
    expect(dados.largura).toBe("12px");
    expect(dados.borda).toBe("3px");
    expect(Number.parseFloat(dados.raio)).toBeGreaterThanOrEqual(100);
    expect(dados.polegar).toBe("rgb(141, 169, 196)");
  });

  test("no alto contraste o polegar do leitor é branco, com trilho visível", async ({ page }) => {
    await seedState(page, { preferences: { contrast: "high" } });
    await page.goto("/ebook/leitor.html");
    await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
    const dados = await page.evaluate(() => {
      const raiz = document.documentElement;
      return {
        polegar: getComputedStyle(raiz, "::-webkit-scrollbar-thumb").backgroundColor,
        trilho: getComputedStyle(raiz, "::-webkit-scrollbar-track").backgroundColor,
      };
    });
    expect(dados.polegar).toBe("rgb(255, 255, 255)");
    expect(dados.trilho).not.toBe("rgba(0, 0, 0, 0)");
  });
});
