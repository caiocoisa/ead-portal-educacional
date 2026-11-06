// Verificador de consistência entre os documentos do projeto e o código.
// Uso: node testes/consistencia/verificar-docs.js
// Somente leitura. Sai com código 1 se encontrar inconsistências.
// Cobre: grafo de tasks, status × dependências, tabelas-resumo, plano × task-master,
// referências obsoletas, caminhos citados e citações arquivo:linha.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const ler = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r/g, "");
const existe = (rel) => fs.existsSync(path.join(root, rel));
let problemas = 0;
const falha = (msg) => { problemas++; console.log("  ✗ " + msg); };
const ok = (msg) => console.log("  ✓ " + msg);

// ---------- 1. task-master ----------
console.log("\n[1] task-master.md: grafo, status e prioridade");
const tm = ler("task-master.md");
const tasks = {};
for (const bloco of tm.split(/^### Task (?=\d+$)/m).slice(1)) {
  const id = Number(bloco.match(/^(\d+)/)[1]);
  const campo = (re) => (bloco.match(re) || [])[1];
  tasks[id] = {
    id,
    titulo: campo(/\*\*Title\*\* \| (.*?) \|/),
    status: campo(/\*\*Status\*\* \| `([\w-]+)`/),
    prioridade: campo(/\*\*Priority\*\* \| `(\w+)`/),
    deps: (campo(/\*\*Dependencies\*\* \| `\[(.*?)\]`/) || "").split(",").map((s) => s.trim()).filter(Boolean).map(Number),
    fase: Number(campo(/\*\*Phase\*\* \| (\d+)/))
  };
}
// Bloqueios externos documentados (a dependência formal está concluída, mas a task
// depende de algo fora do task-master). Task 35: legendas só após o vídeo real existir.
const BLOQUEIO_EXTERNO = new Set([35]);
const ids = Object.keys(tasks).map(Number).sort((a, b) => a - b);
console.log("  tasks lidas:", ids.length, "(de", ids[0], "a", ids[ids.length - 1] + ")");
for (const id of ids) {
  const t = tasks[id];
  if (!t.titulo || !t.status || !t.prioridade || Number.isNaN(t.fase)) falha(`Task ${id}: campo ausente ${JSON.stringify({ t: !!t.titulo, s: t.status, p: t.prioridade, f: t.fase })}`);
  for (const d of t.deps) {
    if (!tasks[d]) falha(`Task ${id}: dependência ${d} não existe`);
    if (d === id) falha(`Task ${id}: depende de si mesma`);
    if (d > id && id < 39) falha(`Task ${id}: depende de task posterior ${d}`);
  }
}
// ciclos
const visitando = new Set(), visitado = new Set();
(function () {
  function dfs(n, trilha) {
    if (visitando.has(n)) { falha("ciclo: " + [...trilha, n].join(" → ")); return; }
    if (visitado.has(n)) return;
    visitando.add(n);
    (tasks[n]?.deps || []).forEach((d) => dfs(d, [...trilha, n]));
    visitando.delete(n); visitado.add(n);
  }
  ids.forEach((i) => dfs(i, []));
})();
// status × dependências
for (const id of ids) {
  const t = tasks[id];
  const todasProntas = t.deps.every((d) => tasks[d]?.status === "done");
  if (t.status === "blocked" && todasProntas && !BLOQUEIO_EXTERNO.has(id)) falha(`Task ${id} está blocked, mas todas as dependências estão done (deveria ser pending)`);
  if (t.status === "pending" && !todasProntas) falha(`Task ${id} está pending, mas há dependência não concluída: ${t.deps.filter((d) => tasks[d]?.status !== "done").join(", ")}`);
  if (t.status === "done" && !todasProntas) falha(`Task ${id} está done com dependência não concluída: ${t.deps.filter((d) => tasks[d]?.status !== "done").join(", ")}`);
}
// cabeçalho
const total = Number((tm.match(/Total de tasks: (\d+)/) || [])[1]);
total === ids.length ? ok(`cabeçalho: Total de tasks = ${total}`) : falha(`cabeçalho diz ${total} tasks, há ${ids.length}`);

// "Estado consolidado": os números do parágrafo devem bater com o status real das tasks
const contagem = {};
ids.forEach((i) => { contagem[tasks[i].status] = (contagem[tasks[i].status] || 0) + 1; });
const estado = (tm.match(/### Estado consolidado[^\n]*\n\n([\s\S]*?)\n\n/) || [])[1] || "";
if (!estado) falha('seção "Estado consolidado" não encontrada no task-master.md');
for (const m of estado.matchAll(/(\d+)\s+`(done|in-progress|pending|blocked)`/g)) {
  const real = contagem[m[2]] || 0;
  Number(m[1]) === real ? ok(`estado consolidado: ${m[1]} ${m[2]}`) : falha(`estado consolidado diz ${m[1]} ${m[2]}, o status real é ${real}`);
}
console.log("  contagem real por status:", JSON.stringify(contagem));

// tabelas-resumo
const resumo = tm.split("## Resumo")[1] || "";
const porFase = {};
for (const m of resumo.matchAll(/^\| (\d+) — [^|]*\| ([\d, ]+) \|/gm)) {
  m[2].split(",").map((s) => Number(s.trim())).forEach((i) => { (porFase[i] = porFase[i] || []).push(Number(m[1])); });
}
for (const id of ids) {
  const f = porFase[id];
  if (!f) falha(`Task ${id} não aparece na tabela "Tasks por fase"`);
  else if (f.length > 1) falha(`Task ${id} aparece ${f.length}x em "Tasks por fase"`);
  else if (f[0] !== tasks[id].fase) falha(`Task ${id}: fase ${tasks[id].fase} no bloco, ${f[0]} na tabela-resumo`);
}
const porPrio = {};
for (const m of resumo.matchAll(/^\| (high|medium|low) \| ([\d, ]+) \|/gm)) {
  m[2].split(",").map((s) => Number(s.trim())).forEach((i) => { (porPrio[i] = porPrio[i] || []).push(m[1]); });
}
for (const id of ids) {
  const p = porPrio[id];
  if (!p) falha(`Task ${id} não aparece em "Tasks por prioridade"`);
  else if (p.length > 1) falha(`Task ${id} aparece ${p.length}x em "Tasks por prioridade"`);
  else if (p[0] !== tasks[id].prioridade) falha(`Task ${id}: prioridade ${tasks[id].prioridade} no bloco, ${p[0]} na tabela-resumo`);
}
console.log("  tabelas-resumo conferidas");

// ---------- 2. plano-evolucao-v2.md × task-master ----------
console.log("\n[2] plano-evolucao-v2.md (seção 8) × task-master.md");
const plano = ler("plano-evolucao-v2.md");
const sec8 = plano.split(/^## 8\. /m)[1].split(/^## 9\. /m)[0];
const noPlano = {};
for (const linha of sec8.split("\n")) {
  if (!linha.startsWith("|")) continue;
  const c = linha.split("|").map((s) => s.replace(/\*/g, "").trim());
  const id = Number(c[2]);
  if (!id || id < 39) continue;
  const bruto = c[c.length - 2];
  const deps = [];
  if (bruto !== "—") {
    for (const parte of bruto.split(",").map((s) => s.trim())) {
      const faixa = parte.match(/^(\d+)[–-](\d+)$/);
      if (faixa) for (let n = Number(faixa[1]); n <= Number(faixa[2]); n++) deps.push(n);
      else deps.push(Number(parte));
    }
  }
  noPlano[id] = { deps };
}
for (let id = 39; id <= ids[ids.length - 1]; id++) {
  if (!noPlano[id]) { falha(`Task ${id} existe no task-master e não está na tabela da seção 8 do plano`); continue; }
  const a = [...noPlano[id].deps].sort((x, y) => x - y).join(","), b = [...(tasks[id]?.deps || [])].sort((x, y) => x - y).join(",");
  if (a !== b) falha(`Task ${id}: dependências divergem (plano [${a}] × task-master [${b}])`);
}
Object.keys(noPlano).forEach((i) => { if (!tasks[i]) falha(`plano cita a Task ${i}, que não existe no task-master`); });

// ---------- 3. referências obsoletas ----------
console.log("\n[3] Referências numéricas possivelmente obsoletas");
const documentos = ["PRD.md", "README.md", "task-master.md", "plano-evolucao-v2.md", "plano-adequacao-design-instrucional.md",
  ...fs.readdirSync(path.join(root, "docs")).filter((f) => f.endsWith(".md")).map((f) => "docs/" + f)];
const ultima = ids[ids.length - 1];
for (const doc of documentos) {
  ler(doc).split("\n").forEach((l, i) => {
    for (const m of l.matchAll(/Tasks? (\d+)[–-](\d+)/g)) {
      const a = Number(m[1]), b = Number(m[2]);
      if (a === 39 && b < ultima) console.log(`  ? ${doc}:${i + 1}  "${m[0]}" (última task existente: ${ultima})`);
    }
    for (const m of l.matchAll(/\bTasks? (\d+)\b/g)) {
      if (Number(m[1]) > ultima) falha(`${doc}:${i + 1} cita Task ${m[1]}, que não existe`);
    }
  });
}

// ---------- 4. caminhos citados ----------
console.log("\n[4] Caminhos citados entre crases que não existem");
const prefixos = /^(app|components|content|docs|lib|services|types|public|testes|pesquisa|templates|conteudo|prototipos)\//;
// índice de nomes de arquivo sem pasta (ex.: `FinalReport.tsx`)
const porNome = {};
(function varrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ".next", "testes"].includes(e.name)) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) varrer(abs);
    else (porNome[e.name] = porNome[e.name] || []).push(path.relative(root, abs).replace(/\\/g, "/"));
  }
})(root);
// Caminhos PLANEJADOS por uma task ainda não concluída: é esperado que não existam.
const PLANEJADOS = {
  "public/img/": 63, "public/img/hero.svg": 63, "public/img/objetivos.svg": 63, "public/img/jornada.svg": 63,
  "content/video-transcript.ts": 36, "components/ui/FlipCard.tsx": 37,
  "pesquisa/benchmark-concorrentes.md": 41, "pesquisa/auditoria-instrucional.md": 42,
  "pesquisa/referencias-visuais.md": 57, "docs/adr-modelo-de-jornada.md": 46, "content/materials.ts": 52,
  "docs/design-system-v2.md": 59, "docs/prototipos.md": 60, "testes/plataformas-ebook/": 58,
  "conteudo/ebook/publicacao.md": 61, "public/materiais/_teste/": 44, "registro.md": 64
};
// Caminhos HISTÓRICOS (Tasks 1–27): previstos no planejamento original e que mudaram.
const HISTORICOS = {
  "app/providers.tsx": "HeroUI v3 não usa Provider", "tailwind.config.ts": "Tailwind v4 configura por CSS",
  "next.config.js": "o arquivo é next.config.ts", "components/public/IdentificationModal.tsx": "substituído por WelcomeHero (Task 16)",
  "components/journey/JourneyNavbar.tsx": "substituído por JourneyLayout e TrailNav",
  // Removidos no fluxo livre (PR A, docs/plano-implementacao-fluxo-v3.md). Os documentos de
  // diagnóstico (revisao-fluxo-ux.md) os citam como evidência do estado antigo, e isso segue válido.
  "services/user-progress/UserProgressRepository.ts": "removido no fluxo livre; substituído por ProgressRepository",
  "services/user-progress/LocalStorageUserProgressRepository.ts": "removido no fluxo livre; substituído por LocalStorageProgressRepository",
  "lib/journey/useJourneyGuard.ts": "removido: o fluxo é livre, sem guarda de etapas",
  "components/journey/ProgressIndicator.tsx": "removido; substituído por TrailNav",
  "components/journey/RestartJourneyModal.tsx": "removido; substituído por RestartAssessmentModal",
  "components/video/VideoSkeleton.tsx": "removido: a página de vídeo mostra 'Vídeo em breve'",
  "UserProgressRepository.ts": "removido no fluxo livre",
  "LocalStorageUserProgressRepository.ts": "removido no fluxo livre",
  "useJourneyGuard.ts": "removido no fluxo livre",
  "ProgressIndicator.tsx": "removido; substituído por TrailNav",
  "RestartJourneyModal.tsx": "removido; substituído por RestartAssessmentModal",
  "VideoSkeleton.tsx": "removido"
};
const RAMOS_GIT = new Set(["docs/evolucao-v2"]); // nomes de branch citados nos documentos, não caminhos
const planejados = [], historicos = [];
for (const doc of documentos) {
  const ausentes = new Set();
  for (const m of ler(doc).matchAll(/`([^`\n]+)`/g)) {
    let p = m[1].trim().replace(/:\d+(-\d+)?$/, "");
    const bare = /^[\w.-]+\.(md|ts|tsx|json|mjs|js|css)$/.test(p);
    if (!prefixos.test(p) && !bare) continue;
    if (/[*<>{}\[\]()]|\s/.test(p)) continue;
    if (bare && !p.includes("/")) {
      if (porNome[p] || existe(p)) continue; // existe em alguma pasta
    } else if (existe(p)) continue;
    if (RAMOS_GIT.has(p)) continue;
    ausentes.add(p);
  }
  for (const p of ausentes) {
    if (PLANEJADOS[p]) planejados.push(`${doc}: ${p} (planejado na Task ${PLANEJADOS[p]})`);
    else if (HISTORICOS[p]) historicos.push(`${doc}: ${p} (${HISTORICOS[p]})`);
    else falha(`${doc}: caminho citado não existe e não está planejado: ${p}`);
  }
}
console.log(`  planejados e ainda não criados: ${planejados.length} · históricos já substituídos: ${historicos.length}`);
historicos.forEach((h) => console.log("  ~ " + h));

// ---------- 5. citações arquivo:linha ----------
console.log("\n[5] Citações arquivo:linha (conferir o conteúdo)");
for (const doc of ["docs/revisao-fluxo-ux.md", "docs/matriz-rastreabilidade.md"]) {
  const vistos = new Set();
  for (const m of ler(doc).matchAll(/`?([\w./\-]+\.(?:tsx|ts|css|md)):(\d+)(?:-(\d+))?`?/g)) {
    const chave = m[0];
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    let rel = m[1];
    if (!existe(rel)) {
      const cand = porNome[path.basename(rel)] || [];
      // Arquivo removido de propósito: a citação é a evidência do diagnóstico antigo, e continua válida.
      if (cand.length === 0 && (HISTORICOS[rel] || HISTORICOS[path.basename(rel)])) {
        console.log(`  ~ ${rel}:${m[2]}  (${HISTORICOS[rel] || HISTORICOS[path.basename(rel)]})`);
        continue;
      }
      if (cand.length !== 1) { falha(`${doc}: ${rel} não resolve para um único arquivo (${cand.length})`); continue; }
      rel = cand[0];
    }
    const linhas = ler(rel).split("\n");
    const ini = Number(m[2]), fim = Number(m[3] || m[2]);
    if (ini > linhas.length) { falha(`${doc}: ${rel}:${ini} está além do fim do arquivo (${linhas.length} linhas)`); continue; }
    console.log(`  ${rel}:${ini}${fim !== ini ? "-" + fim : ""}  →  ${linhas[ini - 1].trim().slice(0, 90)}`);
  }
}

console.log("\n" + (problemas ? `RESULTADO: ${problemas} inconsistência(s) encontrada(s).` : "RESULTADO: nenhuma inconsistência encontrada."));
process.exit(problemas ? 1 : 0);
