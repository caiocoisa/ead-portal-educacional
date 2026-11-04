// Rastreabilidade banco de questões × roteiro do vídeo (Task 39).
// Uso: node testes/rastreabilidade/trace.js
// Somente leitura: não altera nenhum arquivo. Reutilizar no gate pós-gravação
// (apontar ROTEIRO para a transcrição real do vídeo final).
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const ROTEIRO = process.env.ROTEIRO || path.join(root, "roteiro_audiovisual_completo_v2.md");
const lerTexto = (p) => fs.readFileSync(p, "utf8").replace(/\r/g, "");

const roteiro = lerTexto(ROTEIRO);
const banco = lerTexto(path.join(root, "banco-questoes.md"));

// Carrega content/module.ts sem depender do compilador TypeScript.
let mod = null;
try {
  let src = lerTexto(path.join(root, "content", "module.ts"));
  src = src.replace(/^import type .*$/m, "");
  src = src.replace(/export interface ModuleContent \{[\s\S]*?\n\}\n/, "");
  src = src.replace("export const moduleContent: ModuleContent =", "const moduleContent =");
  mod = new Function(src + "\nreturn moduleContent;")();
} catch (e) {
  console.log("FALHA ao carregar content/module.ts:", e.message);
}

const strip = (s) =>
  s.replace(/[“”"'`*]/g, "").replace(/\s+/g, " ").replace(/\(Resposta Correta\)/gi, "").trim().toLowerCase();

// Linhas do roteiro com bloco e timestamp.
const rows = [];
let bloco = "";
for (const line of roteiro.split("\n")) {
  const h = line.match(/^### (Bloco [^:]+):/);
  if (h) bloco = h[1];
  const r = line.match(/^\| \*\*(\d\d:\d\d - \d\d:\d\d)\*\* \|(.*)$/);
  if (r) rows.push({ bloco, ts: r[1], text: strip(r[2]) });
}
console.log("Linhas do roteiro com timestamp:", rows.length);

function onde(termo) {
  const t = strip(termo);
  const achados = rows.filter((r) => r.text.includes(t));
  return { n: achados.length, em: achados.slice(0, 4).map((h) => h.bloco.replace("Bloco ", "B") + " " + h.ts.split(" - ")[0]) };
}

const termos = {
  Q1: ["alinhamento pedagógico", "alinhamento construtivo", "coerência didática", "objetivo", "múltipla escolha", "história da computação", "rotinas de código", "primeira lente"],
  Q2: ["quatro pilares", "papel", "contexto", "tarefa", "formato", "designer instrucional", "avaliação formativa"],
  Q3: ["viabilidade", "smartphone", "celular", "curadoria", "duas horas", "software pesado", "assíncron", "segunda lente"],
  Q4: ["assistente", "co-piloto", "validação", "empatia", "rigor metodológico", "responsabilidade", "somativ", "ortográf", "substitu", "linguagem"],
  Home: ["conteúdos"]
};
console.log("\n== Onde cada termo aparece no roteiro (bloco + início do trecho) ==");
for (const [q, lista] of Object.entries(termos)) {
  console.log(q);
  for (const k of lista) {
    const w = onde(k);
    console.log("  " + k.padEnd(26) + String(w.n).padStart(2) + "x  " + w.em.join(", "));
  }
}

if (mod) {
  console.log("\n== Alternativas: tamanho e posição da correta ==");
  mod.questions.forEach((q) => {
    const lens = q.options.map((o) => o.length);
    const maior = lens.indexOf(Math.max(...lens));
    console.log(q.id, "tamanhos", lens.join("/"), "| correta", q.correctOptionIndex, "| mais longa", maior, "| near", q.feedback.near.optionIndex);
  });

  console.log("\n== content/module.ts × banco-questoes.md (texto normalizado) ==");
  const blocos = banco.split(/^### Questão \d+:/m).slice(1);
  mod.questions.forEach((q, i) => {
    const b = blocos[i];
    const alts = [...b.matchAll(/^\* \*\*Alternativa ([A-D]):\*\*\s+(.*)$/gm)].map((m) => strip(m[2]));
    const enun = strip(b.split("**Enunciado:**")[1].split("* **Alternativa A")[0]);
    const fb = (rotulo) => strip(b.match(new RegExp("\\*\\*" + rotulo + " \\([^)]*\\):\\*\\*\\s+(.*)"))[1]);
    console.log(q.id, {
      alternativasIguais: q.options.every((o, k) => strip(o) === alts[k]),
      enunciadoIgual: enun === strip(q.prompt),
      acertoIgual: fb("Acerto") === strip(q.feedback.correct),
      proximoIgual: fb("Erro Próximo") === strip(q.feedback.near.message),
      distanteIgual: fb("Erro Distante") === strip(q.feedback.far)
    });
  });
  console.log("\ntópicos:", mod.questions.map((q) => q.id + "=" + q.topic).join(" | "));
}

console.log("\n== Referências a 'Bloco' no banco-questoes.md ==");
banco.split("\n").forEach((l, i) => {
  if (/Bloco/.test(l)) console.log("  linha " + (i + 1) + ": " + l.trim().slice(0, 150));
});
