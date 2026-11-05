/* Gera as imagens do e-book a partir das ilustrações da Marina (Task 64).
 *
 * Uso:  node scripts/preparar-arte-ebook.mjs
 *
 * Lê testes/imagens-ia/E1-estilo-A.png e E2-cena-01..06.png (geradas por você) e
 * grava versões WebP leves em public/ebook/arte/. Requer o `sharp`, que o Next já
 * instala como dependência.
 */
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origem = path.join(raiz, "testes", "imagens-ia");
const destino = path.join(raiz, "public", "ebook", "arte");
mkdirSync(destino, { recursive: true });

const WEBP = { quality: 82, effort: 5 };
const trabalhos = [
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    de: `E2-cena-0${n}.png`,
    para: `marina-cena-0${n}.webp`,
    fazer: (img) => img.webp(WEBP),
  })),
  { de: "E1-estilo-A.png", para: "marina-retrato.webp", fazer: (img) => img.webp(WEBP) },
  // Recortes de rosto, usados nas caixas "Dica da Marina".
  {
    de: "E1-estilo-A.png",
    para: "marina-rosto-sorriso.webp",
    fazer: (img) => img.extract({ left: 392, top: 14, width: 250, height: 250 }).resize(200, 200).webp(WEBP),
  },
  {
    de: "E2-cena-04.png",
    para: "marina-rosto-atenta.webp",
    fazer: (img) => img.extract({ left: 175, top: 55, width: 330, height: 330 }).resize(200, 200).webp(WEBP),
  },
];

let falhou = false;
for (const t of trabalhos) {
  const arquivo = path.join(origem, t.de);
  if (!existsSync(arquivo)) {
    console.error(`FALTA ${t.de} em testes/imagens-ia/`);
    falhou = true;
    continue;
  }
  const saida = path.join(destino, t.para);
  await t.fazer(sharp(arquivo)).toFile(saida);
  console.log(`${t.para.padEnd(28)} ${Math.round(statSync(saida).size / 1024)} KB`);
}
process.exit(falhou ? 1 : 0);
