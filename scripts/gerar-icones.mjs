/* Gera os ícones do portal: livro aberto dourado sobre azul-marinho, com um ponto
 * verde (a IA). Usa as cores do portal (marinho #0b2545, dourado #c9a227, verde #157347).
 *
 * Uso:  node scripts/gerar-icones.mjs
 *
 * Grava app/icon.svg, app/apple-icon.png e app/favicon.ico (convenções do Next:
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md).
 * Requer o `sharp`, que o Next já instala como dependência.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "app");

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0b2545"/>
  <path d="M32 22c-4.5-3.2-11-4.2-18-3v26c7-1.2 13.5-.2 18 3 4.5-3.2 11-4.2 18-3V19c-7-1.2-13.5-.2-18 3z" fill="#c9a227"/>
  <path d="M32 22v26" stroke="#0b2545" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="49" cy="16" r="7" fill="#157347" stroke="#0b2545" stroke-width="2.6"/>
</svg>
`;

writeFileSync(path.join(app, "icon.svg"), SVG);

const png = (tamanho) => sharp(Buffer.from(SVG), { density: 600 }).resize(tamanho, tamanho).png({ compressionLevel: 9 }).toBuffer();

writeFileSync(path.join(app, "apple-icon.png"), await png(180));

// ICO com imagens PNG embutidas (16, 32 e 48 px), formato aceito por todos os navegadores atuais.
const tamanhos = [16, 32, 48];
const imagens = await Promise.all(tamanhos.map(png));
const cabecalho = Buffer.alloc(6);
cabecalho.writeUInt16LE(0, 0); // reservado
cabecalho.writeUInt16LE(1, 2); // tipo: ícone
cabecalho.writeUInt16LE(tamanhos.length, 4);
let deslocamento = 6 + 16 * tamanhos.length;
const entradas = imagens.map((img, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(tamanhos[i], 0); // largura
  e.writeUInt8(tamanhos[i], 1); // altura
  e.writeUInt16LE(1, 4); // planos
  e.writeUInt16LE(32, 6); // bits por pixel
  e.writeUInt32LE(img.length, 8);
  e.writeUInt32LE(deslocamento, 12);
  deslocamento += img.length;
  return e;
});
writeFileSync(path.join(app, "favicon.ico"), Buffer.concat([cabecalho, ...entradas, ...imagens]));

console.log("app/icon.svg, app/apple-icon.png e app/favicon.ico gerados.");
