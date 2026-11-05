/* Verifica o e-book preliminar (conteudo/ebook/preliminar/index.html).
 *
 * Uso:  node testes/ebook/verificar-ebook.js [--capturas <pasta>]
 *
 * Confere, para cada uma das páginas: estouro de conteúdo, violações de axe-core
 * (WCAG 2.2 AA), as quatro interações, a leitura em tela de celular e exporta o PDF.
 * Não altera nada além do PDF em conteudo/ebook/preliminar/.
 */
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");
const { chromium } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const RAIZ = path.resolve(__dirname, "..", "..");
const HTML = path.join(RAIZ, "conteudo", "ebook", "preliminar", "index.html");
const PDF = path.join(RAIZ, "conteudo", "ebook", "preliminar", "ebook-preliminar.pdf");
const URL = pathToFileURL(HTML).href;
const idx = process.argv.indexOf("--capturas");
const CAPTURAS = idx > -1 ? process.argv[idx + 1] : null;

const falhas = [];
const ok = (m) => console.log("  ok  " + m);
const ruim = (m) => { falhas.push(m); console.log("  FALHA  " + m); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1100 } });
  const page = await ctx.newPage();
  const erros = [];
  page.on("pageerror", (e) => erros.push(String(e)));
  // Imagens opcionais em arte/ (E3-*.png) ainda não existem: o e-book cai na arte
  // provisória por projeto, então esse erro de carregamento é esperado.
  page.on("console", (m) => { if (m.type() === "error" && !/ERR_FILE_NOT_FOUND/.test(m.text())) erros.push(m.text()); });
  await page.goto(URL);

  const total = await page.locator(".page").count();
  console.log(`\n[1] Páginas: ${total}`);
  total === 18 ? ok("18 páginas") : ruim(`esperado 18 páginas, encontrado ${total}`);

  console.log("\n[2] Estouro de conteúdo e axe-core por página (desktop, 720x960 escalado)");
  if (CAPTURAS) fs.mkdirSync(CAPTURAS, { recursive: true });
  for (let i = 1; i <= total; i++) {
    await page.evaluate((n) => { location.hash = "#p" + n; }, i);
    await page.reload();
    const info = await page.evaluate(() => {
      const p = document.querySelector(".page:not([hidden])");
      const b = p.querySelector(".body");
      return { id: p.id, sobra: b ? b.scrollHeight - b.clientHeight : 0 };
    });
    if (info.sobra > 1) ruim(`p${i}: conteúdo estoura ${info.sobra}px além da área útil`);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    if (r.violations.length) {
      r.violations.forEach((v) => ruim(`p${i}: axe ${v.id} (${v.nodes.length}) ${v.help}`));
    }
    if (CAPTURAS) await page.locator("#stage").screenshot({ path: path.join(CAPTURAS, `p${String(i).padStart(2, "0")}.png`) });
  }
  if (!falhas.length) ok("nenhum estouro e nenhuma violação de axe-core em 18 páginas");

  console.log("\n[3] Interações");
  const ir = async (n) => { await page.goto(URL + "#p" + n); await page.reload(); };
  // cartões que revelam
  await ir(6);
  const b = page.getByRole("button", { name: "Objetivos" });
  await b.click();
  (await b.getAttribute("aria-expanded")) === "true" && (await page.locator("#r2").isVisible()) ? ok("cartão revela a pergunta-chave") : ruim("cartão não revelou");
  // montador
  await ir(9);
  await page.getByRole("button", { name: "Preencher com exemplo" }).click();
  const conta = await page.locator("#m-conta").innerText();
  const saida = await page.locator("#m-saida").innerText();
  /4 de 4/.test(conta) && /^Aja como designer/.test(saida) && /Formato:/.test(saida) ? ok("montador compõe o comando com 4 pilares") : ruim(`montador: "${conta}" / "${saida.slice(0, 40)}"`);
  await page.getByRole("button", { name: "Limpar" }).click();
  /0 de 4/.test(await page.locator("#m-conta").innerText()) ? ok("montador limpa") : ruim("montador não limpou");
  // caça às falhas
  await ir(12);
  const it = page.locator('.item[data-grupo="falhas"]');
  await it.nth(0).getByRole("button", { name: "Manter" }).click();
  await it.nth(1).getByRole("button", { name: "Ajustar" }).click();
  await it.nth(2).getByRole("button", { name: "Manter" }).click(); // errado de propósito
  const pl = await page.locator('[data-placar="falhas"]').innerText();
  /2 de 4/.test(pl) ? ok("caça às falhas pontua certo e errado (2 de 4)") : ruim("placar da caça: " + pl);
  (await it.nth(2).locator(".fb.no").count()) === 1 ? ok("erro recebe retorno 'Releia'") : ruim("sem retorno de erro");
  // quem faz o quê
  await ir(15);
  const q = page.locator('.item[data-grupo="papel"]');
  for (let i = 0; i < 6; i++) {
    const certa = await q.nth(i).getAttribute("data-correta");
    await q.nth(i).locator(`[data-escolha="${certa}"]`).click();
  }
  /6 de 6/.test(await page.locator('[data-placar="papel"]').innerText()) ? ok("quem faz o quê: 6 de 6") : ruim("placar de quem faz o quê");

  console.log("\n[4] Navegação");
  await ir(1);
  await page.keyboard.press("ArrowRight");
  /Página 2 de 18/.test(await page.locator("#pos").innerText()) ? ok("seta → avança") : ruim("seta → não avançou");
  await page.keyboard.press("End");
  /Página 18 de 18/.test(await page.locator("#pos").innerText()) && (await page.locator("#btn-next").isDisabled()) ? ok("End vai à última e desabilita 'Próxima'") : ruim("End");
  await page.getByRole("button", { name: "Sumário" }).click();
  /Página 3 de 18/.test(await page.locator("#pos").innerText()) ? ok("botão Sumário") : ruim("botão Sumário");
  await page.getByRole("link", { name: /Monte o seu comando/ }).click();
  /Página 9 de 18/.test(await page.locator("#pos").innerText()) ? ok("link do sumário leva à página 9") : ruim("link do sumário");

  console.log("\n[5] Celular (390x844)");
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const mp = await m.newPage();
  for (const n of [1, 6, 9, 12, 15]) {
    await mp.goto(URL + "#p" + n); await mp.reload();
    const h = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    h > 1 ? ruim(`p${n}: rolagem horizontal de ${h}px no celular`) : ok(`p${n}: sem rolagem horizontal`);
    if (CAPTURAS && (n === 6 || n === 12)) await mp.screenshot({ path: path.join(CAPTURAS, `celular-p${n}.png`) });
  }
  await m.close();

  console.log("\n[6] PDF");
  const pp = await ctx.newPage();
  await pp.goto(URL);
  await pp.emulateMedia({ media: "print" });
  await pp.pdf({ path: PDF, width: "720px", height: "960px", printBackground: true, preferCSSPageSize: true });
  const bin = fs.readFileSync(PDF, "latin1");
  const paginas = (bin.match(/\/Type\s*\/Page[^s]/g) || []).length;
  const kb = Math.round(fs.statSync(PDF).size / 1024);
  paginas === 18 ? ok(`PDF com 18 páginas (${kb} KB)`) : ruim(`PDF com ${paginas} páginas, esperado 18 (${kb} KB)`);

  if (erros.length) ruim("erros no console: " + erros.slice(0, 3).join(" | "));
  await browser.close();
  console.log(falhas.length ? `\nRESULTADO: ${falhas.length} falha(s).` : "\nRESULTADO: tudo verificado.");
  process.exit(falhas.length ? 1 : 0);
})();
