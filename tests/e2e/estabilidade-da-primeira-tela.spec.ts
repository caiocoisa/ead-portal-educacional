import { expect, test, type Page } from "@playwright/test";

/**
 * A primeira tela não pode mudar de lugar quando a página hidrata. Antes, o botão contextual só existia
 * depois da hidratação e o cartão da trilha era trocado por um indicador menor: o conteúdo abaixo pulava
 * (374 px no celular), e um toque dado nesse intervalo se perdia. Isso causava a intermitência de
 * `responsivo.spec.ts` ("dá para rolar até o fim").
 *
 * O "antes da hidratação" é medido num navegador SEM JavaScript, que mostra exatamente o HTML do servidor.
 * As posições vêm de `boundingBox()`, que não depende de script na página.
 */

const TELAS = [
  { nome: "celular", width: 390, height: 844 },
  { nome: "tablet", width: 768, height: 1024 },
  { nome: "notebook", width: 1280, height: 720 },
  { nome: "tela larga", width: 1600, height: 900 },
] as const;

/** Topo de quatro pontos da página: o título, o link logo abaixo do botão, o cartão da trilha e o fim da página. */
async function posicoes(page: Page) {
  const topo = async (alvo: ReturnType<Page["locator"]>) => (await alvo.boundingBox())?.y ?? null;
  return {
    titulo: await topo(page.locator("h1")),
    // Só o do texto: o painel lateral também tem um atalho para os objetivos.
    link: await topo(page.locator("main a", { hasText: "Conheça os objetivos" })),
    // Em tela larga o cartão fica escondido (a trilha vai para a régua): `null` nos dois lados.
    cartao: await topo(page.locator("#trilha-title")),
    fim: await topo(page.getByText("Pronto para começar?")),
  };
}

for (const tela of TELAS) {
  test(`${tela.nome}: o conteúdo da primeira tela não muda de lugar quando a página hidrata`, async ({ browser, baseURL }) => {
    const viewport = { width: tela.width, height: tela.height };

    // HTML do servidor, sem hidratação.
    const semJs = await browser.newContext({ viewport, javaScriptEnabled: false, baseURL });
    const paginaSemJs = await semJs.newPage();
    await paginaSemJs.goto("/");
    const antes = await posicoes(paginaSemJs);
    await semJs.close();

    // Com JavaScript, depois da hidratação: o botão contextual só fica visível então.
    const comJs = await browser.newContext({ viewport, baseURL });
    const paginaComJs = await comJs.newPage();
    await paginaComJs.goto("/");
    await expect(paginaComJs.getByRole("link", { name: /Começar pelo e-book/ })).toBeVisible();
    const depois = await posicoes(paginaComJs);
    await comJs.close();

    // As quatro medidas existem (a do cartão só fora da tela larga) e não mudam de um lado para o outro.
    expect(antes.titulo, "título no HTML do servidor").not.toBeNull();
    expect(antes.link, "link no HTML do servidor").not.toBeNull();
    expect(antes.fim, "fim da página no HTML do servidor").not.toBeNull();
    if (tela.width < 1500) expect(antes.cartao, "cartão da trilha no HTML do servidor").not.toBeNull();

    for (const chave of ["titulo", "link", "cartao", "fim"] as const) {
      const a = antes[chave];
      const d = depois[chave];
      if (a === null || d === null) {
        expect(d, `${chave}: presente num lado e ausente no outro`).toBe(a);
        continue;
      }
      expect(Math.abs(d - a), `${chave} saiu do lugar: ${a}px antes, ${d}px depois da hidratação`).toBeLessThanOrEqual(1);
    }
  });
}
