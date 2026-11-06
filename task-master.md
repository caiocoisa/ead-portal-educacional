# Task Master — Portal de Planejamento Pedagógico para EaD com Apoio de IA (MVP)

> Gerado em: 2026-09-27 · Revisado em: 2026-11-04
> Baseado em: `PRD.md` (raiz do repositório, versão MVP de escopo reduzido)
> Total de tasks: 64 (15 do MVP + 12 de refinamento pós-deploy + 11 de
> adequação a design instrucional + 26 de evolução v2)

## Visão geral

Portal web em Next.js (App Router) na Vercel, com biblioteca de componentes
NextUI/HeroUI e persistência local (`localStorage`) isolada em um
repositório de serviço. Escopo reduzido ao **core**: o aluno informa o
nome, assiste a **um único vídeo** (YouTube), responde a uma avaliação e
recebe um **relatório final**, podendo reiniciar a jornada. Conteúdo
(vídeo + quiz) é definido em um arquivo de seed no código — **sem** área
administrativa, sem múltiplos módulos e sem i18n na v1 (a alternância de
tema foi acrescentada depois, na Task 18; ver PRD seção 9 para o backlog
futuro).

**Estado em 2026-11-04:** as Tasks 1–29 estão implementadas e o portal
está em produção (ver "Infraestrutura existente" e "Status atual" no fim
deste documento). As Tasks 1–15 partiram de um repositório vazio
(histórico); as demais evoluem o que já existe.

**Fora de escopo (não gerar tasks):** área administrativa, múltiplos
módulos em sequência, i18n, exportação/certificação do relatório,
acompanhamento de múltiplos alunos (PRD seção 9). A alternância de tema,
antes listada aqui, foi implementada na Task 18.

---

## Infraestrutura existente (já implementada) ✅

Situação em 2026-11-04. A versão original deste documento dizia
"nenhuma": as Tasks 1–15 partiram de um repositório vazio.

- **Stack (declarada no `package.json`):** Next.js 16.3.6 (App Router),
  React 19.2.8, `@heroui/react` ^3.2.6, Tailwind 4, `lucide-react`
  ^1.48.0, TypeScript 5.
- **Scripts:** `dev`, `build`, `start` e `lint`. **Não há** script de
  teste, nem Playwright, axe-core ou testes unitários como dependências:
  as auditorias das Tasks 1–27 foram avulsas (ver Task 45).
- **Implantação:** Vercel, `https://ead-portal-educacional.vercel.app/`.
  Conferida em 2026-11-04: o conteúdo publicado corresponde a
  `content/landing.ts`, e o `main` local e o remoto estão no mesmo commit.
- **Persistência:** `localStorage`, via `services/user-progress`.
- **Neste clone o `node_modules` não está instalado:** rodar
  `npm install` antes de qualquer task de código ou de testes.
- **Verificador da documentação:** `node testes/consistencia/verificar-docs.js`
  confere o grafo de tasks, as tabelas-resumo, o plano e as citações
  arquivo:linha.

---

## Regras de execução

- Uma task só pode começar quando TODAS as suas `dependencies` estiverem `done`.
- Tasks com `dependencies: []` podem começar imediatamente.
- Status possíveis: `pending` | `in-progress` | `done` | `blocked` | `deferred`.
- `in-progress` marca uma task com execução parcial registrada (ex.:
  Tasks 44 e 64). Um `blocked` pode decorrer de uma dependência externa
  documentada, mesmo com as dependências formais concluídas (ex.: Task 35,
  que espera o vídeo gravado).
- Atribuição inicial: `dependencies == []` → `pending`; caso contrário → `blocked`.
- Todas as tasks pertencem ao único repositório do projeto:
  `ead-portal-educacional` (clone local em
  `C:\Users\caio.silva\caiosilvadossantos\ead-portal-educacional`; remoto
  no GitHub, `caiocoisa/ead-portal-educacional`; substitui o caminho Linux
  da versão original).

---

## Tasks

### Task 1
| Field | Value |
|---|---|
| **ID** | 1 |
| **Title** | Inicializar projeto Next.js (App Router) + TypeScript + Tailwind + NextUI + config Vercel |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 3 |
| **Dependencies** | `[]` |
| **Phase** | 0 — Setup |
| **Repositório** | ead-portal-educacional |

**Description:**
Cria a base do projeto Next.js com App Router, TypeScript, Tailwind CSS e
NextUI/HeroUI com o tema padrão único da biblioteca, pronta para deploy na
Vercel, servindo de fundação para todas as demais tasks.

**Details:**
- `npx create-next-app@latest` com TypeScript, App Router, Tailwind CSS,
  ESLint habilitados; `src/` opcional conforme convenção do time.
- Instalar `@heroui/react` (ou `@nextui-org/react`, conforme disponibilidade
  no momento da implementação) + `framer-motion` (peer dependency);
  configurar `app/providers.tsx` com `HeroUIProvider` usando o **tema
  padrão único** da biblioteca (sem `next-themes`/alternância — fora de
  escopo nesta v1, PRD seção 9).
- Configurar scripts em `package.json` (`dev`, `build`, `start`, `lint`).
- Inicializar repositório git local (`git init`, primeiro commit) já que o
  diretório do projeto não é um repositório git ainda.
- Criar estrutura de pastas inicial: `app/`, `components/`, `lib/`,
  `services/`, `types/`, `content/`.
- Conectar o repositório a um projeto na Vercel (import do repositório) e
  confirmar que o deploy inicial (página padrão) sobe com sucesso — isso
  destrava deploys contínuos para as próximas tasks.

**Files:**
- `package.json` — dependências e scripts
- `tsconfig.json` — configuração TypeScript
- `tailwind.config.ts` — configuração Tailwind
- `app/providers.tsx` — provider do NextUI/HeroUI
- `app/layout.tsx` — layout raiz inicial
- `.gitignore`, `next.config.js`

**Test strategy:**
`npm run dev` inicia sem erros; `npm run build` conclui com sucesso; deploy
inicial na Vercel renderiza a página padrão publicamente.

**Acceptance criteria:**
- [ ] Projeto Next.js App Router roda localmente (`npm run dev`).
- [ ] Build de produção (`npm run build`) sem erros.
- [ ] Repositório git inicializado com primeiro commit.
- [ ] Projeto conectado à Vercel com deploy inicial acessível publicamente.

**Source:** PRD seção 10 (Stack); critério de aceite (seção 8, item "deploy")

---

### Task 2
| Field | Value |
|---|---|
| **ID** | 2 |
| **Title** | Definir tipos de domínio (Question, ChatMessage, AssessmentResult, UserProgress) |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 2 |
| **Dependencies** | `[1]` |
| **Phase** | 1 — Domínio e conteúdo |
| **Repositório** | ead-portal-educacional |

**Description:**
Define, em TypeScript, todas as estruturas de dados do domínio descritas no
PRD (versão reduzida — um único módulo, sem admin), usadas pelo seed de
conteúdo (Task 3), pelo repositório de progresso (Task 4) e por toda a
aplicação.

**Details:**
- `Question`, `ChatMessage`, `options: string[]`, `correctOptionIndex` —
  exatamente conforme a seção 3.2.2 do PRD.
- `AssessmentResult` (por pergunta: alternativa escolhida + acerto/erro;
  pontuação total).
- `UserProgress` (`userId`, `userName`, `currentStep`: `"video" |
  "avaliacao" | "relatorio"`, `videoCompleted: boolean`,
  `assessmentResult`, `createdAt`, `updatedAt`) — conforme seção 3.3 do PRD.

**Files:**
- `types/quiz.ts` — `Question`, `ChatMessage`, `AssessmentResult`
- `types/progress.ts` — `UserProgress`

**Test strategy:**
Tipos compilam sem erros (`tsc --noEmit`); revisão manual comparando campo a
campo com a tabela da seção 3.3 e a estrutura da seção 3.2.2 do PRD.

**Acceptance criteria:**
- [ ] Todos os campos da seção 3.3 do PRD estão representados nos tipos.
- [ ] `Question`/`ChatMessage` seguem exatamente a estrutura da seção 3.2.2.
- [ ] Projeto compila sem erros de tipo.

**Source:** PRD seção 3.2.2, seção 3.3

---

### Task 3
| Field | Value |
|---|---|
| **ID** | 3 |
| **Title** | Seed de conteúdo do módulo (vídeo + quiz) hardcoded no código |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 2 |
| **Dependencies** | `[2]` |
| **Phase** | 1 — Domínio e conteúdo |
| **Repositório** | ead-portal-educacional |

**Description:**
Define o conteúdo do único módulo do MVP (URL do vídeo do YouTube + lista de
perguntas do quiz) diretamente em um arquivo de dados no código — sem
CRUD, sem backend de conteúdo (PRD seção 9).

**Details:**
- Vídeo de exemplo **não listado ("unlisted")**, sem monetização (PRD
  seção 3.2.1).
- Pelo menos 1 pergunta tipo `text` e 1 pergunta tipo `chat_simulation`
  (seção 3.2.2 do PRD), cada uma com pelo menos 2 alternativas e uma
  `correctOptionIndex` válida.
- Exportar uma constante única (ex. `moduleContent`) consumida pelas
  páginas de vídeo (Task 8) e avaliação (Task 12) — nenhum outro ponto do
  código deve duplicar esse conteúdo.

**Files:**
- `content/module.ts` — vídeo + perguntas do quiz

**Test strategy:**
Importar `moduleContent` em um teste simples e validar que a estrutura
respeita os tipos da Task 2 (`Question[]`, `videoUrl: string`).

**Acceptance criteria:**
- [ ] Conteúdo do módulo (vídeo + quiz) definido em um único arquivo.
- [ ] Vídeo é não listado, sem monetização.
- [ ] Pelo menos uma pergunta de cada tipo (`text`, `chat_simulation`).

**Source:** PRD seção 3.2.1, seção 3.2.2, seção 10

---

### Task 4
| Field | Value |
|---|---|
| **ID** | 4 |
| **Title** | Implementar `UserProgressRepository` sobre `localStorage` |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 4 |
| **Dependencies** | `[2]` |
| **Phase** | 1 — Domínio e conteúdo |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementa a camada de serviço isolada que persiste `UserProgress` em
`localStorage`, servindo como única porta de acesso ao progresso do aluno —
pronta para futura migração a backend (PRD seção 9) sem alterar os
consumidores.

**Details:**
- Interface `UserProgressRepository` com métodos: `getCurrent()`,
  `create(userName)`, `markVideoCompleted()`,
  `saveAssessmentResult(result)`, `resetJourney()`.
- Implementação concreta `LocalStorageUserProgressRepository` — chave fixa
  no `localStorage` (ex. `ead-portal:user-progress`), serialização JSON,
  `createdAt`/`updatedAt` atualizados automaticamente em cada escrita.
- `resetJourney()` deve resetar `currentStep` para `"video"`,
  `videoCompleted` para `false` e `assessmentResult` para `undefined`,
  mantendo `userId`/`userName` (regra explícita da seção 3.3 do PRD).
- Tratar ausência de dados (SSR/primeira visita) retornando `null` de forma
  segura, sem lançar exceção em ambiente sem `window`.

**Files:**
- `services/user-progress/UserProgressRepository.ts` — interface
- `services/user-progress/LocalStorageUserProgressRepository.ts` — implementação
- `services/user-progress/index.ts` — instância singleton exportada

**Test strategy:**
Testes unitários (ex. Vitest com mock de `localStorage`) cobrindo: criação
de novo usuário, marcação de vídeo concluído, gravação de
`assessmentResult`, `resetJourney()` preservando `userId`/`userName`,
persistência entre "recarregamentos" (nova instância lendo o mesmo
`localStorage`).

**Acceptance criteria:**
- [ ] Progresso é lido/escrito corretamente em `localStorage`.
- [ ] `resetJourney()` mantém `userId`/`userName` e zera o restante.
- [ ] Nenhum consumidor acessa `localStorage` diretamente (só via repositório).

**Source:** PRD seção 3.3, seção 10

---

### Task 5
| Field | Value |
|---|---|
| **ID** | 5 |
| **Title** | Guarda de navegação da jornada (bloqueio de etapas fora de ordem + retomada) |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[4]` |
| **Phase** | 2 — Fluxo do aluno |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementa a lógica central de controle de navegação: impede que o aluno
acesse uma etapa fora da sequência (`video` → `avaliacao` → `relatorio`) e
garante a retomada exata ao reabrir o portal — regra central da seção 3.2
do PRD.

**Details:**
- Hook `useJourneyGuard(expectedStep)` usado pelas páginas de vídeo
  (Task 8), avaliação (Task 12) e relatório (Task 13):
  1. Lê `UserProgress` (Task 4).
  2. Se não houver `UserProgress`, redireciona para a página de boas-vindas
     (Task 6).
  3. Se `currentStep` do progresso for diferente da etapa solicitada,
     redireciona para a rota correspondente ao `currentStep` real
     (bloqueio de "pular" etapa).
- Estrutura de rotas: `/video`, `/avaliacao`, `/relatorio`.

**Files:**
- `lib/journey/useJourneyGuard.ts` — lógica de guarda

**Test strategy:**
Testes de integração simulando: acesso direto a `/relatorio` sem ter
concluído vídeo/avaliação (deve redirecionar para `/video`); acesso a
`/avaliacao` sem `videoCompleted` (deve redirecionar para `/video`);
recarregar a página no meio de uma etapa mantém a etapa correta.

**Acceptance criteria:**
- [ ] Acesso fora de ordem sempre redireciona para a etapa correta.
- [ ] Progresso é retomado exatamente ao recarregar/reabrir o portal.

**Source:** PRD seção 3.2; critérios de aceite (seção 8)

---

### Task 6
| Field | Value |
|---|---|
| **ID** | 6 |
| **Title** | Página de boas-vindas + captura de nome do aluno |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 4 |
| **Dependencies** | `[1, 4]` |
| **Phase** | 2 — Fluxo do aluno |
| **Repositório** | ead-portal-educacional |

**Description:**
Cria a página inicial pública (sem login), apresentando o propósito do
portal, CTA de entrada ("Iniciar minha jornada") e a captura do nome do
aluno, gerando `userId` e criando o `UserProgress` inicial.

**Details:**
- Rota `app/page.tsx` — página de boas-vindas com `Card`/`Button` (NextUI)
  de CTA.
- Ao clicar no CTA: `Modal`/`Input` (NextUI) para captura de nome
  (validação simples de campo obrigatório).
- Ao confirmar: gerar `userId` (`crypto.randomUUID()`) e chamar
  `UserProgressRepository.create(userName)` (Task 4).
- Se já existir `UserProgress` no `localStorage` (retorno do aluno), pular
  a captura de nome e redirecionar direto para a rota correspondente ao
  `currentStep` salvo.
- Redirecionar para `/video` após a criação do progresso.

**Files:**
- `app/page.tsx` — página de boas-vindas
- `components/public/WelcomeHero.tsx` — bloco de apresentação + CTA
- `components/public/IdentificationModal.tsx` — captura de nome

**Test strategy:**
Acessar a página sem progresso salvo exibe o CTA; informar um nome cria
`UserProgress` e redireciona para `/video`; reabrir o portal com progresso
existente pula a captura de nome e vai direto para a etapa salva.

**Acceptance criteria:**
- [ ] Página pública acessível sem autenticação, com CTA visível.
- [ ] `userId` gerado localmente ao informar o nome.
- [ ] Retorno de aluno existente não repete a captura de nome.

**Source:** PRD seção 3.1, seção 6; critério de aceite (seção 8)

---

### Task 7
| Field | Value |
|---|---|
| **ID** | 7 |
| **Title** | Componente `VideoPlayer` com YouTube IFrame Player API |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 7 |
| **Dependencies** | `[1]` |
| **Phase** | 2 — Fluxo do aluno |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementa o componente reutilizável de player de vídeo do YouTube usando a
IFrame Player API, com todos os comandos/eventos mapeados na seção 3.2.1 do
PRD, isolado de qualquer lógica de progresso.

**Details:**
- Carregar dinamicamente `https://www.youtube.com/iframe_api` (uma única
  vez por página, via hook `useYouTubeIframeApi()`).
- Instanciar player com `enablejsapi=1` e domínio `youtube-nocookie.com`.
- Expor via props/callbacks: `onProgress({ currentTime, duration, percent
  })`, `onStateChange(state)`, `onEnded()`.
- Implementar `seekTo(segundos)` para retomar de onde o usuário parou —
  receber `initialTime` via prop.
- Ocultar controles nativos (`controls: 0`) e construir controles próprios
  com `Button` do NextUI (play/pause), documentando no código o limite
  descrito no PRD (reforço de UX, não bloqueio à prova de manipulação).
- Componente não decide o que fazer com "90% assistido" — apenas emite o
  evento; a decisão de marcar `videoCompleted` é da Task 8.

**Files:**
- `components/video/VideoPlayer.tsx` — componente do player
- `components/video/useYouTubeIframeApi.ts` — hook de carregamento da API

**Test strategy:**
Testar manualmente com o vídeo de exemplo (Task 3): play/pause pelos
controles customizados, `seekTo()` inicial posiciona no tempo correto,
evento `ENDED` disparado ao terminar o vídeo, `getCurrentTime()`/
`getDuration()` retornam valores coerentes.

**Acceptance criteria:**
- [ ] Player carrega via IFrame API com `enablejsapi=1` e `youtube-nocookie.com`.
- [ ] Eventos `onStateChange`/`ENDED` e leitura de tempo funcionam.
- [ ] `seekTo()` reposiciona o vídeo no tempo informado via prop.

**Source:** PRD seção 3.2.1

---

### Task 8
| Field | Value |
|---|---|
| **ID** | 8 |
| **Title** | Página de vídeo (integração + marcação de `videoCompleted` + transição) |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[3, 5, 6, 7]` |
| **Phase** | 2 — Fluxo do aluno |
| **Repositório** | ead-portal-educacional |

**Description:**
Página da etapa "vídeo": renderiza o `VideoPlayer` (Task 7) com o conteúdo
do seed (Task 3), marca `videoCompleted = true` ao atingir 90% ou `ENDED`,
e libera o avanço para a avaliação — vídeo carregado sob demanda (lazy).

**Details:**
- Rota `app/video/page.tsx`, protegida por `useJourneyGuard("video")`
  (Task 5).
- Calcular `% assistido` a partir de `onProgress`; ao atingir ≥ 90% ou
  evento `ENDED`, chamar `UserProgressRepository.markVideoCompleted()`
  (Task 4) e atualizar `currentStep` para `"avaliacao"`.
- Botão "Concluir" alternativo, habilitado sempre, como fallback manual.
- Ao marcar `videoCompleted`, navegar para `/avaliacao` (Task 12).
- Vídeo deve ser lazy-loaded (ex. `next/dynamic` para o player), sem
  bloquear o carregamento inicial da página.
- Passar `initialTime` salvo (se houver) para o `VideoPlayer` retomar.

**Files:**
- `app/video/page.tsx` — página de vídeo
- `components/journey/ModuleVideoStep.tsx` — orquestração do player + progresso

**Test strategy:**
Assistir ao vídeo até 90% marca a etapa como concluída automaticamente;
clicar "Concluir" também marca; recarregar a página no meio do vídeo retoma
do tempo salvo; navegação para avaliação só é possível após conclusão.

**Acceptance criteria:**
- [ ] `videoCompleted` marcado automaticamente a ~90% ou `ENDED`.
- [ ] Botão "Concluir" manual funciona como fallback.
- [ ] Vídeo é carregado sob demanda (lazy), sem bloquear o carregamento inicial.

**Source:** PRD seção 3.2 (item 1), seção 3.2.1, seção 4; critério de aceite (seção 8)

---

### Task 9
| Field | Value |
|---|---|
| **ID** | 9 |
| **Title** | Componente de Quiz (tipos "texto" e "simulação de chat") |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 6 |
| **Dependencies** | `[2]` |
| **Phase** | 3 — Avaliação |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementa o componente de renderização de uma pergunta do quiz, suportando
os dois tipos definidos na seção 3.2.2 do PRD: texto simples e simulação de
conversa (bolhas usuário/assistente), com alternativas de resposta única.

**Details:**
- `QuestionRenderer` recebe uma `Question` (Task 2) e renderiza:
  - Tipo `text`: enunciado em texto simples (`Card`).
  - Tipo `chat_simulation`: lista de `ChatMessage` renderizada como bolhas
    de conversa, diferenciando visualmente `role: "user"` de `role:
    "assistant"` (alinhamento/cor distintos, usando tokens do tema do
    NextUI, sem cor hardcoded).
- Alternativas (`options`) renderizadas como grupo de seleção única
  (`RadioGroup` do NextUI), retornando o índice selecionado via callback
  `onSelect(optionIndex)`.
- Componente é "burro" (não sabe se a resposta está certa) — a correção é
  responsabilidade da Task 10.

**Files:**
- `components/quiz/QuestionRenderer.tsx` — renderização de uma pergunta
- `components/quiz/ChatSimulationBubbles.tsx` — bolhas de conversa
- `components/quiz/OptionsRadioGroup.tsx` — seleção de alternativa única

**Test strategy:**
Renderizar uma pergunta de cada tipo com o conteúdo de exemplo (Task 3);
verificar seleção de alternativa única (não permite múltipla seleção);
verificar navegação por teclado e labels ARIA nas alternativas.

**Acceptance criteria:**
- [ ] Pergunta tipo `text` renderiza corretamente.
- [ ] Pergunta tipo `chat_simulation` renderiza bolhas usuário/assistente distintas.
- [ ] Seleção de alternativa é sempre única, acessível via teclado.

**Source:** PRD seção 3.2.2; seção 4 (Acessibilidade)

---

### Task 10
| Field | Value |
|---|---|
| **ID** | 10 |
| **Title** | Lógica de correção e cálculo de pontuação do quiz (`gradeQuiz`) |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 3 |
| **Dependencies** | `[2, 9]` |
| **Phase** | 3 — Avaliação |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementa a lógica pura de correção do quiz: compara as respostas
escolhidas com `correctOptionIndex` de cada `Question`, calcula a pontuação
total e retorna o `AssessmentResult`.

**Details:**
- Função pura `gradeQuiz(questions: Question[], answers: number[]):
  AssessmentResult` — retorna, por pergunta, alternativa escolhida +
  booleano de acerto, além da pontuação total (ex. `acertos/total`).
- Garantir que todas as perguntas tenham sido respondidas antes de permitir
  a submissão (validação de formulário na Task 12).

**Files:**
- `lib/quiz/gradeQuiz.ts` — função pura de correção

**Test strategy:**
Testes unitários de `gradeQuiz` com casos: todas corretas, todas
incorretas, mistas.

**Acceptance criteria:**
- [ ] `gradeQuiz` calcula corretamente acertos/erros e pontuação total.

**Source:** PRD seção 3.2.2 (regras do quiz)

---

### Task 11
| Field | Value |
|---|---|
| **ID** | 11 |
| **Title** | Layout com indicador de progresso da jornada |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 3 |
| **Dependencies** | `[1, 4]` |
| **Phase** | 3 — Avaliação |
| **Repositório** | ead-portal-educacional |

**Description:**
Cria um layout compartilhado leve para as páginas de vídeo, avaliação e
relatório, com um indicador de progresso (`Progress`/`Steps` do NextUI)
mostrando a etapa atual da jornada (1 de 3, 2 de 3, 3 de 3).

**Details:**
- `app/layout.tsx` (ou um layout específico para as rotas
  `/video`, `/avaliacao`, `/relatorio`) com `Navbar` simples e
  `ProgressIndicator`.
- Personalização de mensagens usando `userName` (ex. cabeçalho "Olá,
  {userName}") lido via `UserProgressRepository` (Task 4).
- Layout deve funcionar em mobile e desktop (breakpoints NextUI/Tailwind).

**Files:**
- `components/journey/JourneyNavbar.tsx` — navbar com nome do usuário
- `components/journey/ProgressIndicator.tsx` — indicador de progresso

**Test strategy:**
Navegar entre `/video`, `/avaliacao` e `/relatorio` mantém o indicador de
progresso consistente com a etapa atual; testar em viewport mobile e
desktop.

**Acceptance criteria:**
- [ ] Indicador de progresso reflete a etapa atual (vídeo/avaliação/relatório).
- [ ] Layout responsivo mobile/desktop.

**Source:** PRD seção 7; seção 4 (Responsividade)

---

### Task 12
| Field | Value |
|---|---|
| **ID** | 12 |
| **Title** | Página de avaliação do módulo |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 4 |
| **Dependencies** | `[3, 5, 9, 10, 11]` |
| **Phase** | 3 — Avaliação |
| **Repositório** | ead-portal-educacional |

**Description:**
Página da etapa "avaliação": exibe todas as perguntas do quiz do seed
(Task 3) usando `QuestionRenderer` (Task 9), coleta as respostas e submete
a correção (Task 10) ao final.

**Details:**
- Rota `app/avaliacao/page.tsx`, protegida por
  `useJourneyGuard("avaliacao")` (Task 5).
- Renderizar uma `QuestionRenderer` por pergunta, mantendo estado local das
  respostas selecionadas.
- Botão "Enviar avaliação" (`Button` do NextUI) desabilitado até todas as
  perguntas terem resposta selecionada.
- Ao enviar: chamar `gradeQuiz` (Task 10),
  `UserProgressRepository.saveAssessmentResult(result)` (Task 4), atualizar
  `currentStep` para `"relatorio"` e navegar para `/relatorio` (Task 13).

**Files:**
- `app/avaliacao/page.tsx` — página de avaliação
- `components/journey/ModuleAssessmentStep.tsx` — orquestração do quiz

**Test strategy:**
Responder todas as perguntas habilita o envio; enviar navega para o
relatório final com `assessmentResult` correto; tentar acessar a etapa sem
ter concluído o vídeo é bloqueado (via Task 5).

**Acceptance criteria:**
- [ ] Todas as perguntas do módulo são exibidas e respondidas antes do envio.
- [ ] Envio calcula e persiste o resultado, avançando para o relatório.
- [ ] Acesso bloqueado sem `videoCompleted = true`.

**Source:** PRD seção 3.2 (item 2); critério de aceite (seção 8)

---

### Task 13
| Field | Value |
|---|---|
| **ID** | 13 |
| **Title** | Página de relatório final + "Reiniciar jornada" com confirmação |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 4 |
| **Dependencies** | `[4, 5, 11, 12]` |
| **Phase** | 3 — Avaliação |
| **Repositório** | ead-portal-educacional |

**Description:**
Exibe o resultado da avaliação (seção 3.2.3 do PRD) e implementa a ação
"Reiniciar jornada", com modal de confirmação antes de executar (ação
destrutiva).

**Details:**
- Rota `app/relatorio/page.tsx`, protegida por
  `useJourneyGuard("relatorio")` (Task 5).
- Exibir `assessmentResult` (pontuação, acertos/erros) em `Card`, com
  feedback visual usando tokens do tema (sem cor hardcoded).
- Botão "Reiniciar jornada" abre `Modal` de confirmação do NextUI (título
  claro sobre a irreversibilidade da ação).
- Ao confirmar: chamar `UserProgressRepository.resetJourney()` (Task 4) e
  navegar para `/video`. Exibir `Toast` de confirmação de sucesso.
- Não implementar exportação em PDF/certificado — apenas exibição em tela
  (fora de escopo, PRD seção 9).

**Files:**
- `app/relatorio/page.tsx` — página de relatório final
- `components/journey/RestartJourneyModal.tsx` — modal de confirmação + ação

**Test strategy:**
Concluir a avaliação exibe o relatório com o resultado correto; clicar em
"Reiniciar jornada" abre o modal; cancelar não altera nada; confirmar zera
o progresso e redireciona para o vídeo; tentar acessar `/relatorio` sem ter
enviado a avaliação é bloqueado (via Task 5).

**Acceptance criteria:**
- [ ] Relatório exibe o resultado da avaliação corretamente.
- [ ] Ação de reiniciar exige confirmação explícita antes de executar.
- [ ] Após confirmar, progresso é zerado e o usuário retorna ao vídeo.

**Source:** PRD seção 3.2.3, seção 3.3; critério de aceite (seção 8)

---

### Task 14
| Field | Value |
|---|---|
| **ID** | 14 |
| **Title** | Revisão de acessibilidade básica (contraste, foco, teclado, ARIA) |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 3 |
| **Dependencies** | `[13]` |
| **Phase** | 4 — Qualidade e deploy |
| **Repositório** | ead-portal-educacional |

**Description:**
Revisa a aplicação quanto aos requisitos de acessibilidade da seção 4 do
PRD: contraste mínimo AA, foco visível, navegação por teclado e labels
ARIA nos componentes interativos.

**Details:**
- Verificar contraste AA (WCAG) no tema único do NextUI.
- Garantir foco visível em todos os elementos interativos (`Button`,
  `Input`, alternativas do quiz, controles de vídeo).
- Testar navegação completa por teclado em: captura de nome, vídeo,
  avaliação, relatório, reinício de jornada.
- Adicionar/revisar labels ARIA em componentes interativos custom (ex.
  bolhas de chat, controles de vídeo customizados).

**Files:**
- (revisão cruzada dos componentes criados nas Tasks 6–13; ajustes
  pontuais conforme achados)

**Test strategy:**
Checklist manual de navegação 100% por teclado em cada tela; ferramenta
automatizada de auditoria de acessibilidade (ex. axe/Lighthouse) sem
violações de nível AA críticas.

**Acceptance criteria:**
- [ ] Contraste AA validado no tema único.
- [ ] Navegação por teclado funcional em todo o fluxo.
- [ ] Componentes interativos custom possuem labels ARIA adequadas.

**Source:** PRD seção 4 (Acessibilidade)

---

### Task 15
| Field | Value |
|---|---|
| **ID** | 15 |
| **Title** | Deploy final na Vercel + QA e mapeamento dos critérios de aceite |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 3 |
| **Dependencies** | `[13, 14]` |
| **Phase** | 4 — Qualidade e deploy |
| **Repositório** | ead-portal-educacional |

**Description:**
Task final de validação: confirma o deploy de produção na Vercel e percorre
cada um dos 10 critérios de aceite da seção 8 do PRD, registrando o
mapeamento critério → task(s) responsável(is).

**Details:**
Executar manualmente o roteiro completo de ponta a ponta em produção e
marcar cada critério:
1. Área pública sem autenticação + CTA → Task 6.
2. Nome informado gera `userId` e leva ao vídeo → Task 6.
3. Vídeo marca conclusão → Task 8.
4. Avaliação só após vídeo concluído → Tasks 5, 8, 12.
5. Quiz suporta os dois tipos de pergunta, resposta única → Task 9.
6. Envio calcula e exibe resultado no relatório → Tasks 10, 12, 13.
7. Bloqueio de acesso fora de ordem → Task 5.
8. Progresso mantido ao recarregar → Tasks 4, 5.
9. Reiniciar jornada com confirmação → Task 13.
10. Aplicação implantada e acessível na Vercel → Task 1 (deploy inicial) +
    validação final desta task.

Qualquer critério não satisfeito deve gerar correção nas tasks
correspondentes antes de considerar o MVP pronto.

**Files:**
- (nenhum arquivo novo — task de validação; correções pontuais, se
  necessário, nos arquivos das tasks referenciadas)

**Test strategy:**
Checklist executável dos 10 critérios de aceite da seção 8 do PRD, em
produção (URL da Vercel), com evidência (print ou nota) de cada um sendo
satisfeito.

**Acceptance criteria:**
- [x] Todos os 10 critérios de aceite da seção 8 verificados e satisfeitos
      em produção.
- [x] URL de produção na Vercel funcional e compartilhável.

**Validado em produção (2026-09-27):** https://ead-portal-educacional.vercel.app/
Roteiro completo (Playwright) rodado contra a URL pública: boas-vindas → CTA
→ identificação → vídeo → "Concluir" → quiz (3 perguntas, tipos texto e
chat_simulation) → envio → relatório final → reiniciar jornada (cancelar e
confirmar) → reload mantendo a etapa. Guarda de navegação bloqueou acesso
direto a `/relatorio` sem progresso, redirecionando para `/`. Nenhum erro de
JS capturado.

**Source:** PRD seção 8 (Critérios de aceite)

---

### Task 16
| Field | Value |
|---|---|
| **ID** | 16 |
| **Title** | Redesign da tela de boas-vindas: aparência de portal + entrada em etapa única |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 4 |
| **Dependencies** | `[6]` |
| **Phase** | 5 — Refinamento de UX |
| **Repositório** | ead-portal-educacional |

**Description:**
Feedback do usuário (2026-09-27): a tela inicial atual (`WelcomeHero`,
Task 6) está visualmente pobre para uma tela de portal — é só um `Card`
centralizado — e força duas etapas (clicar no CTA para só então revelar o
campo de nome). Redesenhar para parecer um portal de verdade e reduzir a
entrada a uma etapa única.

**Details:**
- Adicionar um header/topo à página (`app/page.tsx`), com identidade do
  portal (nome/logo textual), distinto do conteúdo do hero — hoje não há
  nenhum header, só o card de identificação.
- Adicionar uma seção de apresentação do portal (o que é, o que o aluno
  vai encontrar: vídeo + avaliação + relatório) **antes ou ao lado** do
  formulário de entrada — hoje só existe o título do módulo e uma frase
  curta.
- **Unificar em uma etapa única**: o campo de nome (`Input` do HeroUI) deve
  estar visível desde o primeiro carregamento da página, junto da
  descrição do portal — remover o clique intermediário em "Iniciar minha
  jornada" que hoje só revela o formulário (`components/public/WelcomeHero.tsx`,
  estado `showForm`).
- Manter o comportamento já existente e testado: se já houver
  `UserProgress` salvo, pular direto para a etapa correspondente (sem
  mostrar essa tela) — não alterar essa lógica, só o layout/fluxo de quem
  ainda não tem progresso.
- Manter a mesma stack (Next.js + HeroUI, sem novas dependências) e o
  tema único já definido (seção 5 do PRD).

**Files:**
- `app/page.tsx` — adicionar header/seção de apresentação
- `components/public/WelcomeHero.tsx` — remover a etapa intermediária
  (`showForm`), unificando descrição + formulário de nome numa tela só

**Test strategy:**
Revisão visual (checklist manual) comparando com a observação de UX da
seção 3.1 do PRD; teste de que o campo de nome aparece imediatamente ao
carregar `/` (sem progresso salvo) e que o fluxo de retomada (usuário com
progresso salvo) continua pulando essa tela, sem regressão nos testes
end-to-end já existentes (Playwright) e na auditoria de acessibilidade
(axe-core).

**Acceptance criteria:**
- [x] Página inicial tem header/identidade de portal, visualmente distinto
      de um card solto.
- [x] Página inicial explica do que se trata o portal (vídeo + avaliação +
      relatório), não só o CTA.
- [x] Campo de nome visível na primeira renderização, sem etapa
      intermediária de clique no CTA.
- [x] Retomada de progresso existente continua funcionando sem regressão.

**Implementado em:** `components/public/PortalHeader.tsx` (novo),
`components/public/WelcomeHero.tsx` (removido o estado `showForm`; agora
mostra descrição + lista de features + formulário de nome numa única
tela), `app/page.tsx` (inclui o header). Validado com Playwright (campo de
nome visível já no primeiro load, fluxo de retomada intacto) e axe-core
(0 violações).

**Source:** Feedback do usuário (2026-09-27); PRD seção 3.1

---

### Task 17
| Field | Value |
|---|---|
| **ID** | 17 |
| **Title** | Skeleton no lugar do vídeo real (conteúdo do módulo ainda não definido) |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 2 |
| **Dependencies** | `[8]` |
| **Phase** | 5 — Refinamento de UX |
| **Repositório** | ead-portal-educacional |

**Description:**
Pedido do usuário (2026-09-27): o vídeo em `content/module.ts` apontava
para um ID de exemplo real do YouTube (placeholder), mas o vídeo
definitivo do módulo ainda não existe. Substituído por um skeleton visual
no lugar do player, deixando claro que o conteúdo será adicionado depois.

**Details:**
- `content/module.ts`: `youtubeVideoId` agora é `string | null`; valor
  atual `null` (sem vídeo definido).
- Novo componente `components/video/VideoSkeleton.tsx` — placeholder no
  formato `aspect-video` (mesma proporção do player real, para não pular
  layout quando o vídeo for adicionado), com `Skeleton` do HeroUI e texto
  "O vídeo deste módulo será adicionado em breve.".
- `components/journey/ModuleVideoStep.tsx`: renderiza `VideoPlayer` só
  quando `moduleContent.youtubeVideoId` existe; caso contrário, renderiza
  `VideoSkeleton`. O botão "Concluir" (fallback manual, já existente)
  continua funcionando normalmente com o skeleton, permitindo avançar a
  jornada mesmo sem vídeo real.

**Files:**
- `content/module.ts`
- `components/video/VideoSkeleton.tsx` (novo)
- `components/journey/ModuleVideoStep.tsx`

**Test strategy:**
Playwright: `/video` exibe o texto do skeleton e o botão "Concluir" ainda
avança para `/avaliacao`. axe-core: 0 violações.

**Acceptance criteria:**
- [x] Sem vídeo real definido, a etapa de vídeo mostra um skeleton, não um
      player quebrado ou um vídeo de exemplo real.
- [x] Botão "Concluir" continua permitindo avançar a jornada.
- [x] Ao definir um `youtubeVideoId` real futuramente, o player volta a
      aparecer automaticamente (sem mudança de código além do valor).

**Source:** Pedido do usuário (2026-09-27)

---

### Task 18
| Field | Value |
|---|---|
| **ID** | 18 |
| **Title** | Alternância de tema light/dark |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 3 |
| **Dependencies** | `[6, 9, 11]` |
| **Phase** | 6 — Acessibilidade estendida |
| **Repositório** | ead-portal-educacional |

**Description:**
Pedido do usuário (2026-09-27): trazer de volta a alternância de tema
light/dark (removida do escopo do MVP na redução inicial, PRD seção 9,
item 4). O HeroUI v3 já traz um hook `useTheme()` nativo (persiste em
`localStorage`, resolve `"system"` pela preferência do SO, aplica
`data-theme` no `<html>`) — não foi necessário nenhuma lib nova.

**Details:**
- **Bug corrigido antes de implementar:** `app/globals.css` tinha
  `--background`/`--foreground` fixos em `:root`, sobrescrevendo
  incondicionalmente os tokens (já theme-aware) do HeroUI — o tema nunca
  mudaria visualmente. Removidos; `--color-background`/`--color-foreground`
  (usados em `app/layout.tsx`) agora seguem os tokens nativos do HeroUI.
- `components/accessibility/ThemeToggle.tsx` — grupo de 3 botões
  (Claro/Escuro/Sistema) usando `useTheme()` do `@heroui/react`.
- Adicionado a `PortalHeader` (área pública) e ao header da
  `JourneyLayout` (vídeo/avaliação/relatório).
- Refatoradas cores `zinc-*` hardcoded (que não seguiam tema) para tokens
  do HeroUI (`--muted`, `--border`, `--surface-secondary`, `--accent`) em
  todos os componentes que as usavam — necessário para o dark mode não
  ficar com texto/bolhas de chat ilegíveis.
- **Segundo bug encontrado ao testar:** o `--muted` padrão do tema claro
  do HeroUI só atinge 4.43:1 de contraste (abaixo do mínimo AA de 4.5:1) —
  detectado pela varredura axe-core depois da refatoração acima (que
  passou a usar `--muted` em vários lugares). Corrigido com um override
  escopado só ao tema claro (`:root[data-theme="light"] { --muted: ... }`);
  o tema escuro já não tinha esse problema.

**Files:**
- `app/globals.css`
- `components/accessibility/ThemeToggle.tsx` (novo)
- `components/public/PortalHeader.tsx`, `components/journey/JourneyLayout.tsx`
- `components/public/WelcomeHero.tsx`, `components/video/VideoSkeleton.tsx`,
  `components/journey/ProgressIndicator.tsx`, `components/journey/FinalReport.tsx`,
  `components/quiz/ChatSimulationBubbles.tsx` (refactor de cores para tokens)

**Test strategy:**
Playwright alternando os 3 valores de tema e verificando `data-theme` no
`<html>` e persistência entre reloads; axe-core em light e dark (0
violações, incluindo contraste dos botões primary/danger já ajustados).

**Acceptance criteria:**
- [x] Alternância manual entre claro/escuro/sistema funcional em todas as
      telas.
- [x] Preferência persiste entre sessões (via `localStorage`, chave nativa
      do HeroUI).
- [x] Nenhum componente com cor hardcoded fora dos tokens do tema (NFR da
      seção 4 do PRD).

**Source:** Pedido do usuário (2026-09-27); PRD seção 4, seção 9 (item 4)

---

### Task 19
| Field | Value |
|---|---|
| **ID** | 19 |
| **Title** | Controles de acessibilidade: tamanho de fonte e alto contraste |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 4 |
| **Dependencies** | `[18]` |
| **Phase** | 6 — Acessibilidade estendida |
| **Repositório** | ead-portal-educacional |

**Description:**
Pedido do usuário (2026-09-27), junto com a Task 18. Adiciona dois novos
controles de acessibilidade, persistidos localmente e aplicados via
atributos `data-*` no `<html>`, no mesmo padrão do `useTheme()` nativo do
HeroUI (sem lib nova).

**Details:**
- `lib/preferences/usePersistentAttribute.ts` — hook genérico
  (`localStorage` + `data-*` no `<html>`), reaproveitado pelos dois
  controles abaixo.
- `lib/preferences/useFontSize.ts` — `"normal" | "large" | "extra-large"`,
  aplica `data-font-size`; `app/globals.css` mapeia cada valor para uma
  escala de `font-size` no `html` (112.5%/125%), afetando toda a UI (a
  maioria dos tamanhos de texto do Tailwind usa `rem`).
- `lib/preferences/useHighContrast.ts` — `"normal" | "high"`, aplica
  `data-contrast`; `app/globals.css` sobrescreve `--muted`/`--border`/
  `--focus` para o valor de `--foreground` (máximo contraste) e reforça o
  anel de foco (`outline` mais grosso) quando ativo.
- `components/accessibility/FontSizeControl.tsx` — grupo de 3 botões
  (A/A+/A++).
- `components/accessibility/HighContrastToggle.tsx` — `Switch` do HeroUI.
- `components/accessibility/AccessibilityControls.tsx` — agrupa
  `ThemeToggle` + `FontSizeControl` + `HighContrastToggle`; substituiu o
  uso direto de `ThemeToggle` na `PortalHeader`/`JourneyLayout`.

**Files:**
- `lib/preferences/usePersistentAttribute.ts`,
  `lib/preferences/useFontSize.ts`, `lib/preferences/useHighContrast.ts` (novos)
- `components/accessibility/FontSizeControl.tsx`,
  `components/accessibility/HighContrastToggle.tsx`,
  `components/accessibility/AccessibilityControls.tsx` (novos)
- `app/globals.css`

**Test strategy:**
Playwright alternando tamanho de fonte e alto contraste, conferindo os
atributos `data-font-size`/`data-contrast` no `<html>` e persistência entre
reloads; axe-core em todas as combinações relevantes (alto contraste
ligado/desligado × light/dark) — 0 violações.

**Acceptance criteria:**
- [x] Tamanho de fonte ajustável em pelo menos 3 níveis, refletindo em
      toda a interface.
- [x] Alto contraste ativável, aumentando o contraste de textos
      secundários e do anel de foco.
- [x] Ambas as preferências persistem entre sessões, independente da
      identificação do aluno (funcionam já na tela de boas-vindas).

**Source:** Pedido do usuário (2026-09-27); PRD seção 4 (Acessibilidade)

---

### Task 20
| Field | Value |
|---|---|
| **ID** | 20 |
| **Title** | Reformular conteúdo e mecânica da avaliação a partir de `banco-questoes.md` |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 6 |
| **Dependencies** | `[9, 10, 12]` |
| **Phase** | 7 — Conteúdo pedagógico definitivo |
| **Repositório** | ead-portal-educacional |

**Description:**
Pedido do usuário (2026-09-27): substituir o conteúdo de exemplo do quiz
(genérico, sobre "prompts de LLM") pelo banco de questões definitivo em
`banco-questoes.md` — 4 questões de cenário sobre planejamento pedagógico
para EaD com apoio de IA, cada uma com **retorno pedagógico categorizado**
por proximidade da resposta (acerto / erro próximo / erro distante). Isso
exigiu reformular a **mecânica** da avaliação, não só o conteúdo: o banco
especifica validação imediata por pergunta (não mais "responder tudo e
enviar no final").

**Details:**
- `types/quiz.ts`: `Question` ganhou o campo `feedback` (`QuestionFeedback`
  — mensagens de acerto, de um erro próximo específico por índice de
  alternativa, e de erro distante para as demais); novo tipo
  `FeedbackLevel = "correct" | "near" | "far"`.
- `lib/quiz/resolveFeedback.ts` (novo) — função pura que decide o nível e
  a mensagem de feedback a partir da alternativa escolhida.
- `content/module.ts` — as 3 perguntas de exemplo foram substituídas pelas
  4 do banco (Alinhamento Pedagógico, Arquitetura de Comandos/Prompts,
  Auditoria Crítica de sugestões da IA, Papel do educador), com
  `correctOptionIndex`/`feedback` fiéis ao documento.
- `components/journey/ModuleAssessmentStep.tsx` — **reescrito**: de "todas
  as perguntas na tela + botão Enviar" para **uma pergunta por vez**, com
  botão "Confirmar resposta" → exibe `AnswerFeedback` (painel colorido:
  verde/acerto, amarelo/erro próximo, vermelho/erro distante) → botão
  "Próxima pergunta" (ou "Ver relatório final" na última) libera o avanço.
  Alternativas ficam bloqueadas (`isDisabled`) após a confirmação.
- `components/quiz/AnswerFeedback.tsx` (novo) — usa o componente `Alert`
  do HeroUI (`status="success"|"warning"|"danger"`) para o painel de
  feedback.
- `components/quiz/OptionsRadioGroup.tsx`, `QuestionRenderer.tsx` — ganharam
  a prop `isDisabled`, propagada até o `RadioGroup` para travar a resposta
  após a confirmação.
- O resultado agregado (`AssessmentResult`/`gradeQuiz`, Task 10) não
  mudou de forma — continua acumulando `answers[]` + `correctCount`/
  `totalCount`, agora computado ao final da última pergunta em vez de um
  clique único de "enviar".
- **Nota:** um segundo arquivo, `roteiro_audiovisual_completo.md`, também
  apareceu no diretório nesta mesma leva (roteiro de gravação do vídeo
  real do módulo, ~27min, mesmo tema). Não gerou mudança de código nesta
  task — fica registrado aqui como referência para quando o vídeo for
  gravado e `content/module.ts` → `youtubeVideoId` (Task 17) for
  preenchido.

**Files:**
- `types/quiz.ts`
- `lib/quiz/resolveFeedback.ts` (novo)
- `content/module.ts`
- `components/journey/ModuleAssessmentStep.tsx`
- `components/quiz/AnswerFeedback.tsx` (novo)
- `components/quiz/OptionsRadioGroup.tsx`, `components/quiz/QuestionRenderer.tsx`

**Test strategy:**
Playwright cobrindo as 4 perguntas com uma resposta de cada nível (acerto,
erro próximo, erro distante), verificando o título/status do painel de
feedback (`data-slot="alert-root"`) e o bloqueio do `RadioGroup` após
confirmar; regressão completa da jornada (identificação → vídeo → 4
perguntas → relatório → reiniciar → reload) sem erros de JS; axe-core nos
3 níveis de feedback × light/dark (0 violações).

**Acceptance criteria:**
- [x] As 4 questões do `banco-questoes.md` estão implementadas com gabarito
      e feedback fiéis ao documento.
- [x] Cada pergunta exige confirmação individual antes de liberar o
      avanço; alternativas ficam bloqueadas após confirmar.
- [x] O painel de feedback reflete corretamente o nível (verde/amarelo/
      vermelho) e a mensagem correspondente à alternativa escolhida.
- [x] O relatório final ao término da 4ª pergunta continua exibindo a
      pontuação agregada corretamente.

**Source:** Pedido do usuário (2026-09-27) — `banco-questoes.md`

---

### Task 21
| Field | Value |
|---|---|
| **ID** | 21 |
| **Title** | Relatório final com comentários por pergunta + remoção de travessões da tela inicial |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 2 |
| **Dependencies** | `[13, 20]` |
| **Phase** | 7 — Conteúdo pedagógico definitivo |
| **Repositório** | ead-portal-educacional |

**Description:**
Pedido do usuário (2026-09-27): (1) o relatório final mostrava só
✅/❌ por pergunta, sem o comentário pedagógico; reformulado para exibir a
mesma mensagem categorizada (acerto/erro próximo/erro distante) usada na
etapa de avaliação (Task 20), agora como revisão. (2) o texto da tela
inicial (`content/module.ts` → `description`) tinha um travessão; reescrito
em duas frases sem esse caractere.

**Details:**
- `components/journey/FinalReport.tsx` — para cada resposta, busca a
  `Question` correspondente em `moduleContent.questions` e reaproveita
  `resolveFeedback()` (Task 20) para renderizar um `AnswerFeedback` (o
  mesmo painel colorido da avaliação) por pergunta, no lugar da linha de
  texto simples anterior.
- `content/module.ts` — descrição do módulo reescrita sem travessão,
  mantendo o mesmo conteúdo.

**Files:**
- `components/journey/FinalReport.tsx`
- `content/module.ts`

**Test strategy:**
Playwright: relatório final com respostas de acerto/erro próximo/erro
distante mostra os 4 painéis de feedback com título e mensagem corretos;
checagem de que o texto da tela inicial não contém `—`. axe-core no
relatório em light/dark (0 violações). Regressão completa da jornada.

**Acceptance criteria:**
- [x] Relatório final exibe o comentário/observação pedagógica de cada
      pergunta, não só o status de acerto/erro.
- [x] Texto da tela inicial não contém travessões.
- [x] Nenhuma regressão na jornada, guarda de navegação ou acessibilidade.

**Source:** Pedido do usuário (2026-09-27)

---

### Task 22
| Field | Value |
|---|---|
| **ID** | 22 |
| **Title** | Mover controles de acessibilidade para um drawer lateral retrátil |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 4 |
| **Dependencies** | `[18, 19]` |
| **Phase** | 6 — Acessibilidade estendida |
| **Repositório** | ead-portal-educacional |

**Description:**
Pedido do usuário (2026-09-27): na tela de avaliação, os controles de
acessibilidade (tema, tamanho de fonte, alto contraste) inline no header
empurravam o conteúdo principal (a pergunta) para baixo. Movidos para um
menu lateral retrátil (`Drawer` do HeroUI, `placement="right"`) — some do
fluxo do layout quando fechado, abre como overlay por cima do conteúdo
quando expandido, sem empurrar nada.

**Details:**
- `components/accessibility/AccessibilityControls.tsx` — reescrito para
  envolver `ThemeToggle`/`FontSizeControl`/`HighContrastToggle` num
  `Drawer.Root` do HeroUI, com um botão compacto "Acessibilidade" como
  gatilho (`Drawer.Trigger`, que já é o próprio elemento pressionável do
  HeroUI — sem o problema de interativo aninhado encontrado antes em
  `AlertDialog.Trigger`/`Popover.Trigger`).
- **Bug encontrado e corrigido:** como o conteúdo do `Drawer.Body` só é
  montado quando aberto, os hooks `useTheme()`/`useFontSize()`/
  `useHighContrast()` (que aplicam os atributos `data-*` no `<html>` via
  efeito de montagem) paravam de rodar no carregamento da página — o tema/
  tamanho de fonte/contraste salvos só eram aplicados depois que o usuário
  abria o menu pelo menos uma vez. Corrigido com
  `components/accessibility/AccessibilityInitializer.tsx` (novo), montado
  sempre em `app/layout.tsx`, que só chama os três hooks (sem renderizar
  UI) para garantir a aplicação imediata independente do estado do drawer.
- `Drawer.Trigger` não aceita `variant`/`size` do HeroUI diretamente no
  tipo (só props do `Button` primitivo do react-aria); usado
  `buttonVariants` de `@heroui/styles` para estilizar sem depender de
  nomes de classe internos.

**Files:**
- `components/accessibility/AccessibilityControls.tsx`
- `components/accessibility/AccessibilityInitializer.tsx` (novo)
- `app/layout.tsx`

**Test strategy:**
Playwright: controles de tema não aparecem inline por padrão; abrir o
drawer revela os controles e alterá-los funciona (`data-theme` muda);
fechar o drawer não deixa nada bloqueando cliques na pergunta; `data-theme`/
`data-font-size`/`data-contrast` já aplicados logo no carregamento da
página, sem precisar abrir o drawer (regressão do bug acima). axe-core com
o drawer aberto e fechado, em `/`, `/video` e `/avaliacao` — 0 violações.
Regressão completa da jornada e de persistência de preferências.

**Acceptance criteria:**
- [x] Controles de acessibilidade não ocupam espaço fixo no layout —
      ficam escondidos até o usuário abrir o menu.
- [x] Menu abre/fecha como overlay lateral, sem empurrar o conteúdo
      principal (a pergunta, no caso da avaliação).
- [x] Preferências salvas continuam sendo aplicadas imediatamente no
      carregamento da página, mesmo com o menu fechado.

**Source:** Pedido do usuário (2026-09-27)

---

### Task 23
| Field | Value |
|---|---|
| **ID** | 23 |
| **Title** | Reposicionar o gatilho "Acessibilidade" como aba fixa na lateral da tela |
| **Status** | `done` |
| **Priority** | `low` |
| **Complexity** | 1 |
| **Dependencies** | `[22]` |
| **Phase** | 6 — Acessibilidade estendida |
| **Repositório** | ead-portal-educacional |

**Description:**
Pedido do usuário (2026-09-27): mesmo depois da Task 22, o botão
"Acessibilidade" ainda ficava numa linha própria no header, em posição de
destaque acima do conteúdo — na tela de avaliação isso ainda competia com
a pergunta. Reposicionado como uma aba fixa na borda esquerda da tela
(`position: fixed`), fora do fluxo do layout.

**Details:**
- `components/accessibility/AccessibilityControls.tsx` — `Drawer.Trigger`
  ganhou classes `fixed left-0 top-1/2 -translate-y-1/2` (aba vertical
  grudada na lateral, texto em `[writing-mode:vertical-rl]`), em vez de
  `buttonVariants` sozinho ocupando uma linha do header. `aria-label`
  adicionado para manter o nome acessível independente da rotação visual
  do texto.
- Como o elemento passa a ser `position: fixed`, ele é removido do fluxo
  normal do documento — não precisou de nenhuma mudança em
  `PortalHeader.tsx`/`JourneyLayout.tsx`, que continuam só chamando
  `<AccessibilityControls />` sem reservar espaço extra para ele.
- **Fix de acompanhamento (mesmo dia):** o texto "Acessibilidade" vazava
  para fora do botão. Causa: a classe base `.button`/`.button--sm` do
  HeroUI fixa `height` (~32–36px) pensando em texto horizontal; com
  `writing-mode: vertical-rl`, essa altura física passa a ser o espaço
  disponível *na direção do texto* (inline-size), pequeno demais para as
  14 letras de "Acessibilidade" com `white-space: nowrap`. Corrigido
  sobrescrevendo com `!h-auto !w-auto !px-2 !py-3`, deixando a caixa
  crescer conforme o conteúdo em vez de usar a altura fixa do componente.

**Files:**
- `components/accessibility/AccessibilityControls.tsx`

**Test strategy:**
Playwright: bounding box do gatilho confirma posição na borda esquerda
(`x < 50`) com o header/pergunta permanecendo no topo da tela; clique na
aba lateral ainda abre o drawer corretamente. axe-core no drawer aberto/
fechado em `/`, `/video` e `/avaliacao` (0 violações); matriz completa de
tema × contraste × tamanho de fonte revalidada (0 violações); regressão
completa da jornada e do fluxo de avaliação.

**Acceptance criteria:**
- [x] O gatilho de acessibilidade não ocupa mais uma posição de destaque
      no topo do conteúdo principal.
- [x] O gatilho fica fixo na lateral da tela, acessível em qualquer
      posição de rolagem.
- [x] Nenhuma regressão funcional ou de acessibilidade.

**Source:** Pedido do usuário (2026-09-27)

---

### Task 24
| Field | Value |
|---|---|
| **ID** | 24 |
| **Title** | Seções de apresentação do curso na página inicial (objetivos, público, pré-requisitos, resultados, como funciona, formato, FAQ) |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 5 |
| **Dependencies** | `[16]` |
| **Phase** | 8 — Página inicial completa |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementado diretamente no GitHub (PR #1, branch
`claude/course-portal-sections-lsqlok`, mesclada em `main` fora desta
sessão — identificada e documentada aqui em 2026-10-18). Expande a página
inicial (Task 16 cobria só o header + formulário em etapa única) com o
conteúdo completo do curso, em seções navegáveis por âncora.

**Details:**
- `content/landing.ts` (novo) — centraliza `courseObjectives`,
  `targetAudience`, `prerequisites`, `learningOutcomes`, `journeySteps`,
  `courseFormat`, `faqs`.
- `components/public/CourseSections.tsx` (novo) — renderiza as seções
  "Objetivos do curso", "A quem se destina", "Pré-requisitos", "O que você
  será capaz de fazer ao final", "Como funciona", "Formato e recursos",
  "Perguntas frequentes" e um rodapé de CTA, cada uma com `id` ancorável.
- `components/public/FaqAccordion.tsx` (novo) — acordeão do HeroUI para as
  5 perguntas frequentes.
- `components/public/WelcomeHero.tsx` — ganhou um link "Conheça os
  objetivos, o público e os pré-requisitos" (`#objetivos-title`) levando
  às novas seções.
- `app/page.tsx` — passou a renderizar `<CourseSections />` abaixo do
  hero.

**Files:**
- `content/landing.ts` (novo)
- `components/public/CourseSections.tsx` (novo)
- `components/public/FaqAccordion.tsx` (novo)
- `components/public/WelcomeHero.tsx`, `app/page.tsx`

**Test strategy:**
Revisão manual do conteúdo (fiel ao tema do PRD, seção 1); verificação de
que cada âncora (`#objetivos-title`, etc.) rola corretamente; acordeão da
FAQ abre/fecha via teclado.

**Acceptance criteria:**
- [x] Página inicial apresenta objetivos, público-alvo, pré-requisitos,
      resultados esperados, como funciona a jornada, formato/recursos e
      FAQ, além do formulário de entrada.
- [x] Conteúdo centralizado em um único arquivo (`content/landing.ts`),
      sem duplicação entre componentes.

**Source:** PR #1 no GitHub (`claude/course-portal-sections-lsqlok`),
mesclada antes desta revisão; PRD seção 3.1

---

### Task 25
| Field | Value |
|---|---|
| **ID** | 25 |
| **Title** | Menu lateral de navegação livre entre perguntas da avaliação + ajuste de altura ao viewport |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 5 |
| **Dependencies** | `[20, 22]` |
| **Phase** | 8 — Página inicial completa |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementado diretamente no GitHub (PR #2, mesma branch — identificada e
documentada aqui em 2026-10-18). Substitui a navegação estritamente
sequencial da avaliação (Task 20: só "Próxima pergunta" linear) por um
menu lateral que lista todas as perguntas com status e permite saltar
livremente entre elas. Também ajusta o layout da jornada para ocupar
exatamente a altura da tela, sem rolagem da página inteira.

**Details:**
- `components/quiz/QuestionNavigator.tsx` (novo) — lista (`lg:w-64`
  lateral; faixa horizontal rolável em telas pequenas) com um botão por
  pergunta mostrando número, tópico (`Tooltip`) e status
  (pendente/correta/revisar via `Chip`/ícone), além de um `ProgressCircle`
  com o total respondido. `onNavigate(index)` troca a pergunta atual sem
  nenhuma restrição de ordem.
- `components/journey/ModuleAssessmentStep.tsx` — reescrito: estado
  separado para `answers` (confirmadas) e `drafts` (selecionadas, não
  confirmadas) por pergunta; botão "← Anterior"/"Próxima pergunta" (ou
  "Ver relatório final", habilitado só quando todas as perguntas estão
  confirmadas); o `QuestionNavigator` fica ao lado do card da pergunta.
  Confirmar uma resposta continua travando a alternativa e exibindo o
  painel de feedback (Task 20) — o que muda é só a liberdade de ordem de
  navegação entre perguntas, não a mecânica de confirmação individual.
- `components/journey/JourneyLayout.tsx` — layout recalculado para
  `h-dvh`/`overflow-hidden` com cabeçalho fixo (`shrink-0`) e só a `main`
  rolando internamente quando necessário — antes, o scroll da página
  inteira competia com o conteúdo em telas pequenas.
- `components/journey/ModuleVideoStep.tsx` — player limitado a
  `max-w-[min(100%,calc(50dvh*16/9))]` para caber na altura disponível
  sem cortar o card.
- Um PR intermediário (`a3ea848`, "Resolve conflitos com a main mantendo a
  versão atualizada das telas") resolveu conflitos de merge com o estado
  do `main` desta sessão (Tasks 20–23) — sem perda de funcionalidade de
  nenhum dos dois lados.

**Files:**
- `components/quiz/QuestionNavigator.tsx` (novo)
- `components/journey/ModuleAssessmentStep.tsx`,
  `components/journey/JourneyLayout.tsx`,
  `components/journey/ModuleVideoStep.tsx`

**Test strategy:**
Navegar livremente entre as 4 perguntas pelo menu lateral, respondendo
fora de ordem (ex. pergunta 3 antes da 1); confirmar que "Ver relatório
final" só habilita com as 4 confirmadas; verificar que o layout não gera
rolagem da página inteira em viewports comuns (apenas da área de
conteúdo quando o texto é longo).

**Acceptance criteria:**
- [x] Menu lateral lista todas as perguntas com status correto
      (pendente/correta/revisar) e permite navegação livre entre elas.
- [x] Confirmação individual por pergunta (Task 20) continua obrigatória
      antes de contar como respondida.
- [x] Layout da jornada ocupa a altura do viewport sem rolagem
      desnecessária da página.

**Source:** PR #2 no GitHub (`claude/course-portal-sections-lsqlok`),
mesclada antes desta revisão; PRD seção 3.2.2

---

### Task 26
| Field | Value |
|---|---|
| **ID** | 26 |
| **Title** | Destaque de alternativas, toasts e tooltips na avaliação; abas e desempenho por competência no relatório; estados de carregamento |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 5 |
| **Dependencies** | `[20, 21, 25]` |
| **Phase** | 8 — Página inicial completa |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementado diretamente no GitHub (PR #3, mesma branch — identificada e
documentada aqui em 2026-10-18). Reforça o retorno pedagógico da
avaliação com destaque visual e toasts, e reformula o relatório final em
abas com desempenho por competência. Adiciona também um estado de
carregamento explícito enquanto o progresso salvo é verificado.

**Details:**
- `types/quiz.ts`/`content/module.ts` — `Question` ganhou o campo
  `topic` (ex. "Alinhamento pedagógico", "Comandos para a IA",
  "Curadoria da IA", "Papel do educador"), usado no relatório.
- `components/quiz/QuestionRenderer.tsx`/`OptionsRadioGroup.tsx` —
  ganharam `revealedCorrectIndex`: após confirmar, a alternativa correta é
  destacada visualmente (independente de qual foi escolhida), reforçando
  o retorno pedagógico já exibido no painel de `AnswerFeedback`.
- `components/journey/ModuleAssessmentStep.tsx` — ao confirmar, dispara
  um `toast` (`@heroui/react`) de sucesso/atenção/erro conforme o nível do
  feedback (correct/near/far).
- `components/journey/HomeResetButton.tsx` — ganhou `Tooltip` explicando a
  ação ("Volta à tela de boas-vindas e apaga o progresso").
- `components/journey/FinalReport.tsx` — reescrito com `Tabs`: aba
  "Resumo" (um `Meter` por pergunta, rotulado pelo `topic`, "Dominada"/
  "Vale revisar") e aba "Gabarito comentado" (`Accordion` com o painel de
  `AnswerFeedback` de cada pergunta, reaproveitado da Task 21).
- `components/journey/JourneyLoading.tsx` (novo) — `Spinner` + `Skeleton`
  exibido enquanto o progresso salvo é verificado; usado em
  `WelcomeHero.tsx` (antes mostrava uma tela em branco até a checagem do
  `localStorage` terminar).

**Files:**
- `types/quiz.ts`, `content/module.ts`
- `components/quiz/QuestionRenderer.tsx`, `components/quiz/OptionsRadioGroup.tsx`
- `components/journey/ModuleAssessmentStep.tsx`,
  `components/journey/HomeResetButton.tsx`,
  `components/journey/FinalReport.tsx`
- `components/journey/JourneyLoading.tsx` (novo)
- `components/public/WelcomeHero.tsx`

**Test strategy:**
Confirmar uma resposta em cada nível (acerto/erro próximo/erro distante)
e verificar o destaque da alternativa correta + o toast correspondente;
no relatório, checar os valores de `Meter` por competência na aba Resumo
e o conteúdo do `Accordion` na aba Gabarito comentado; recarregar `/` e
confirmar que `JourneyLoading` aparece brevemente antes do redirecionamento
(quando há progresso salvo) ou do formulário (quando não há).

**Acceptance criteria:**
- [x] Alternativa correta é destacada visualmente após a confirmação, em
      toda pergunta.
- [x] Toast reflete o nível do feedback (sucesso/atenção/erro).
      *(Atualização de 2026-11-05: o toast foi removido; ver Task 45.)*
- [x] Relatório final mostra desempenho por competência (aba Resumo) e o
      gabarito comentado por pergunta (aba Gabarito comentado).
- [x] Estado de carregamento visível enquanto o progresso salvo é
      verificado, sem tela em branco.

**Source:** PR #3 no GitHub (`claude/course-portal-sections-lsqlok`),
mesclada antes desta revisão; PRD seção 3.2.2, 3.2.3

---

### Task 27
| Field | Value |
|---|---|
| **ID** | 27 |
| **Title** | Paleta marinho/dourado/verde/branco, ícones Lucide e espaços reservados para imagens |
| **Status** | `done` |
| **Priority** | `low` |
| **Complexity** | 3 |
| **Dependencies** | `[18, 24, 26]` |
| **Phase** | 8 — Página inicial completa |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementado diretamente no GitHub (PR #4, mesma branch — identificada e
documentada aqui em 2026-10-18). Substitui os emojis usados nas novas
seções (Tasks 24–26) por ícones da biblioteca `lucide-react`, aplica uma
identidade visual própria (marinho/dourado/verde/branco) sobre os tokens
padrão do HeroUI, e reserva espaços para as ilustrações que ainda não
foram produzidas.

**Details:**
- `package.json` — nova dependência `lucide-react`.
- Todos os ícones informativos de `content/landing.ts`,
  `components/public/WelcomeHero.tsx`,
  `components/journey/ProgressIndicator.tsx`,
  `components/quiz/QuestionNavigator.tsx` passam a usar componentes
  `lucide-react` (ex. `GraduationCap`, `ClipboardList`, `ChartColumn`),
  com `aria-hidden="true"` quando puramente decorativos.
- `app/globals.css` — novos tokens `--brand` (`#0b2545`, marinho) e
  `--gold` (`#c9a227`, dourado), e remapeamento de `--accent`/`--success`/
  `--warning` para a paleta do portal, com variantes dedicadas em
  `:root[data-theme="dark"]` (o marinho perde contraste no escuro) —
  todas as combinações comentadas no próprio arquivo com a razão de
  contraste calculada (AA).
- `components/ui/ImagePlaceholder.tsx` (novo) — espaço reservado
  (`border-dashed`, ícone, rótulo e dica de caminho/tamanho) para cada
  ilustração ainda não produzida (hero, objetivos, jornada); aceita um
  `src` opcional para quando a imagem definitiva for adicionada em
  `public/img/`, sem precisar trocar o componente que o usa.
- `components/journey/JourneyLayout.tsx` — cabeçalho repintado com
  `bg-(--brand)`/`text-white`/borda inferior `--gold`; `Avatar` com a
  inicial do nome do aluno.

**Files:**
- `package.json`
- `app/globals.css`
- `components/ui/ImagePlaceholder.tsx` (novo)
- `content/landing.ts`, `components/public/WelcomeHero.tsx`,
  `components/public/CourseSections.tsx`,
  `components/journey/ProgressIndicator.tsx`,
  `components/journey/JourneyLayout.tsx`,
  `components/quiz/QuestionNavigator.tsx`

**Test strategy:**
Revisão visual em light/dark; auditoria de contraste (axe-core ou
cálculo manual) nas novas combinações de `--accent`/`--success`/
`--warning`; verificação de que nenhum emoji permanece nas telas
afetadas; placeholders de imagem renderizam com o rótulo/dica corretos
quando `src` não é informado.

**Acceptance criteria:**
- [x] Nenhum emoji usado como ícone de UI nas seções afetadas — todos via
      `lucide-react`.
- [x] Paleta marinho/dourado/verde/branco aplicada de forma consistente,
      com contraste AA validado em light e dark.
- [x] Ilustrações ainda não produzidas aparecem como espaço reservado
      claro (não como imagem quebrada ou espaço vazio sem explicação).

**Source:** PR #4 no GitHub (`claude/course-portal-sections-lsqlok`),
mesclada antes desta revisão; PRD seção 4, seção 5

---

### Task 28
| Field | Value |
|---|---|
| **ID** | 28 |
| **Title** | Guia de estilo curto documentado (paleta, ícones, tipografia, componentes-padrão) |
| **Status** | `done` |
| **Priority** | `low` |
| **Complexity** | 2 |
| **Dependencies** | `[27]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 a partir de `plano-adequacao-design-instrucional.md`
(prática 1 — "Consistency Is Key"). Extrai, para um documento curto e
legível fora do código, as decisões de identidade visual que hoje só
existem implícitas em `app/globals.css` e nos comentários das Tasks
18–19, 27 — útil para quem for criar um segundo módulo no futuro (PRD
seção 9) sem precisar reler o CSS inteiro.

**Details:**
- Novo `docs/guia-de-estilo.md`: paleta (`--brand`/`--gold`/tokens do
  HeroUI remapeados, com as razões de contraste já calculadas em
  `app/globals.css`), tipografia (escalas de `--font-size` da Task 19),
  ícones (`lucide-react`, Task 27), lista de componentes-padrão do HeroUI
  usados no portal (`Card`, `Tabs`, `Accordion`, `Meter`, `Drawer`,
  `Tooltip`, etc.) e a convenção de nunca usar cor hardcoded fora de
  tokens (PRD seção 5).
- Documentação pura — nenhuma mudança de código ou comportamento visual.

**Files:**
- `docs/guia-de-estilo.md` (novo)

**Test strategy:**
Revisão manual comparando cada afirmação do guia com o `app/globals.css`
e os componentes atuais — nenhuma divergência entre o documento e o
código em produção.

**Acceptance criteria:**
- [x] Paleta, tipografia, ícones e componentes-padrão documentados em um
      único arquivo, fora do código-fonte.
- [x] Nenhuma informação do guia contradiz o que está implementado.

**Implementado em:** `docs/guia-de-estilo.md` (novo) — paleta completa
(tokens de marca `--brand`/`--gold` + remapeamentos do HeroUI com razões
de contraste, incluindo as variantes de tema escuro e alto contraste),
tipografia (fonte + 3 níveis de `data-font-size`), catálogo vivo dos 21
ícones `lucide-react` em uso e dos 23 componentes HeroUI em uso, em 19
linhas agrupadas (com os
dois padrões de implementação já conhecidos: interativo aninhado e
preferências sempre aplicadas), convenções de layout
(`ImagePlaceholder`, cabeçalho da jornada) e instrução de como manter o
guia atualizado. Extraído por inspeção direta de `app/globals.css` e
`grep` dos imports reais de `lucide-react`/`@heroui/react` em todo o
código — sem nenhuma informação inventada.

**Source:** `plano-adequacao-design-instrucional.md`, seção 1 (prática
"Consistency Is Key"); aprovado pelo usuário em 2026-10-18

---

### Task 29
| Field | Value |
|---|---|
| **ID** | 29 |
| **Title** | Segmentar o roteiro v2 do vídeo em capítulos nomeados |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 2 |
| **Dependencies** | `[]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 2 — "Create an Immersive Multimedia
Experience"). O roteiro `roteiro_audiovisual_completo_v2.md` já existe,
mas descreve um único bloco narrativo de ~30 minutos; o artigo de
referência recomenda evitar vídeo longo sem pontos de navegação. Esta
task revisa o **documento do roteiro** (não o vídeo em si, que ainda não
foi gravado) para marcar explicitamente os capítulos que deverão ser
cadastrados como "chapters" do YouTube quando o vídeo for publicado.

**Details:**
- Revisar `roteiro_audiovisual_completo_v2.md` e anotar, para cada bloco
  já existente (1, 2, 3, 4A, 4B, 5), um título curto de capítulo e o
  timestamp de início — material pronto para colar na descrição do vídeo
  no YouTube Studio no momento da publicação (recurso nativo de
  "chapters" do YouTube, não exige mudança no player do portal).
- Esta task é **pré-requisito de conteúdo** para a Task 30 (dividir o
  vídeo em partes) — a segmentação em capítulos aqui é o que informa onde
  cortar, caso a Task 30 seja levada adiante.
- Não depende de nenhuma outra task — pode ser feita a qualquer momento,
  mesmo antes da gravação.

**Files:**
- `roteiro_audiovisual_completo_v2.md`

**Test strategy:**
Revisão manual: cada capítulo proposto cobre um bloco inteiro do roteiro,
sem sobreposição nem lacuna de tempo; timestamps coerentes com a duração
total (~30min) já documentada.

**Acceptance criteria:**
- [x] Lista de capítulos (título + timestamp) cobrindo o roteiro
      completo, pronta para uso no YouTube Studio.
- [x] Nenhuma mudança de conteúdo pedagógico do roteiro — só marcação de
      capítulos.

**Implementado em:** nova seção "Capítulos para o YouTube (chapters)"
em `roteiro_audiovisual_completo_v2.md`, logo após a Ficha
Técnica/Mapeamento de Artefatos e antes do Roteiro Audiovisual
Detalhado. Contém um bloco de texto pronto para colar na descrição do
vídeo no YouTube Studio (6 capítulos, 00:00 a 26:30) e uma tabela de
rastreabilidade capítulo → bloco do roteiro → faixa de tempo, cobrindo
os 30 minutos completos sem sobreposição nem lacuna. Nenhum conteúdo
pedagógico do roteiro foi alterado.

**Source:** `plano-adequacao-design-instrucional.md`, seção 2 (P0);
aprovado pelo usuário em 2026-10-18

---

### Task 30
| Field | Value |
|---|---|
| **ID** | 30 |
| **Title** | Dividir o vídeo único em múltiplos vídeos curtos (um por momento pedagógico) |
| **Status** | `pending` |
| **Priority** | `medium` |
| **Complexity** | 7 |
| **Dependencies** | `[29]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 2). Substitui o vídeo único de ~30min por
2–3 vídeos curtos (ex. conceito → demonstração → auditoria/correção),
cada um marcando conclusão de forma independente — reduz a "parede de
vídeo" criticada pelo artigo e abre caminho para microlearning. É a mais
complexa das tarefas aprovadas porque **exige mudança de modelo de
dados**, não só de conteúdo.

**Details:**
- Depende da Task 29 definir os pontos de corte entre vídeos.
- `types/quiz.ts`/`types/progress.ts`: `ModuleContent.youtubeVideoId:
  string | null` precisa virar uma lista ordenada de vídeos (ex.
  `videos: { id: string; youtubeVideoId: string | null; title: string
  }[]`); `UserProgress` precisa rastrear qual vídeo da lista está em
  andamento/concluído (hoje só existe `videoCompleted: boolean` — Task 4).
- `components/journey/ModuleVideoStep.tsx`/`VideoPlayer.tsx` (Task 7–8):
  passam a navegar entre vídeos da lista antes de liberar `/avaliacao`,
  mantendo o `VideoSkeleton` (Task 17) em qualquer vídeo da lista ainda
  sem `youtubeVideoId`.
- `useJourneyGuard` (Task 5) não muda de forma (ainda é só
  `video → avaliacao → relatorio`); a divisão em múltiplos vídeos é
  **interna** à etapa "vídeo", sem novo `currentStep`.
- **Decisão a confirmar antes de iniciar:** como os vídeos reais ainda
  não existem, avaliar se vale a pena fazer essa mudança de modelo agora
  (sem conteúdo real para validar) ou só quando o primeiro vídeo for
  gravado — ver nota de dependência "vídeo real" nas Tasks 34/36.

**Files:**
- `types/quiz.ts`, `types/progress.ts`
- `content/module.ts`
- `services/user-progress/*`
- `components/journey/ModuleVideoStep.tsx`, `components/video/VideoPlayer.tsx`

**Test strategy:**
Playwright: progresso através de 2–3 vídeos de teste, cada um marcando
conclusão independentemente; `/avaliacao` só libera depois do último
vídeo da lista; retomada exata ao recarregar no meio do segundo vídeo.

**Acceptance criteria:**
- [ ] `ModuleContent`/`UserProgress` suportam uma lista ordenada de
      vídeos, não só um único `youtubeVideoId`.
- [ ] Avanço para `/avaliacao` só ocorre após todos os vídeos da lista
      serem concluídos.
- [ ] Nenhuma regressão no fluxo de guarda de navegação (Task 5).

**Source:** `plano-adequacao-design-instrucional.md`, seção 2 (P1);
aprovado pelo usuário em 2026-10-18

---

### Task 31
| Field | Value |
|---|---|
| **ID** | 31 |
| **Title** | Reformular a Questão 3 como atividade interativa "antes/depois" |
| **Status** | `pending` |
| **Priority** | `medium` |
| **Complexity** | 4 |
| **Dependencies** | `[9, 20]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 2). A Questão 3 de `banco-questoes.md`
(auditoria de viabilidade técnica/logística) hoje é só um parágrafo de
cenário com alternativas, igual às outras três. Transformá-la em uma
comparação visual "antes/depois" (a proposta original da IA vs. a
proposta corrigida) aproxima a avaliação de um *branching scenario* leve,
sem exigir motor de simulação completo.

**Details:**
- Avaliar se isso exige um novo `type` em `Question` (ex.
  `"before_after"`, ao lado de `"text"`/`"chat_simulation"`, Task 2/9) ou
  se pode ser resolvido só com `ChatMessage[]`/layout customizado dentro
  do `prompt` já existente — decisão técnica a tomar na implementação,
  mantendo o gabarito/feedback (`correctOptionIndex`, `feedback`) de
  `banco-questoes.md` inalterado.
- Conteúdo pedagógico (texto do cenário, alternativas, feedback) não
  muda — só a apresentação visual da Questão 3 dentro de
  `QuestionRenderer` (Task 9).

**Files:**
- `types/quiz.ts` (se novo `type` for necessário)
- `content/module.ts` (questão `q3`)
- `components/quiz/QuestionRenderer.tsx`

**Test strategy:**
Playwright: Questão 3 renderiza a comparação antes/depois corretamente
nos 3 níveis de feedback (acerto/erro próximo/erro distante, Task 20);
axe-core sem violações na nova apresentação.

**Acceptance criteria:**
- [ ] Questão 3 apresenta visualmente a proposta original da IA e uma
      versão corrigida, não só texto corrido.
- [ ] Gabarito e feedback pedagógico de `banco-questoes.md` preservados
      sem alteração de conteúdo.

**Source:** `plano-adequacao-design-instrucional.md`, seção 2 (P1);
aprovado pelo usuário em 2026-10-18

---

### Task 32
| Field | Value |
|---|---|
| **ID** | 32 |
| **Title** | Exercício prático opcional ("escreva seu próprio comando para a IA") |
| **Status** | `pending` |
| **Priority** | `low` |
| **Complexity** | 3 |
| **Dependencies** | `[9]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 2). Reforça o "mão na massa" citado pelo
artigo (também relevante na prática 6): um campo opcional, sem avaliação
automática, onde o aluno escreve seu próprio comando estruturado para um
assistente de IA (usando os quatro pilares da Task 20 — papel, contexto,
tarefa, formato) e o mantém só para reflexão própria.

**Details:**
- Novo bloco, provavelmente ao final da etapa de avaliação ou do
  relatório final, com um `TextField`/`Textarea` do HeroUI — "Pratique
  você mesmo: escreva um comando para a IA usando os quatro pilares" —
  **sem** envio a nenhum backend (coerente com a arquitetura 100%
  client-side, PRD seção 10); salvar localmente (`localStorage`, mesmo
  padrão da Task 4) só para o aluno não perder o texto ao navegar.
  Explicitamente não é corrigido nem compartilhado — é só um espaço de
  prática pessoal.
- Marcar claramente como **opcional** (não bloqueia avanço de etapa).

**Files:**
- Novo componente em `components/quiz/` ou `components/journey/`
  (nome a definir na implementação)
- Possível extensão pontual de `services/user-progress/` para persistir o
  rascunho (opcional; avaliar se vale a pena ou se um estado local
  efêmero já basta)

**Test strategy:**
Playwright: campo aceita texto livre, não bloqueia navegação para a
próxima etapa, texto persiste ao recarregar a página (se a persistência
for implementada). axe-core sem violações.

**Acceptance criteria:**
- [ ] Aluno pode escrever um comando próprio num campo claramente opcional.
- [ ] Nenhuma correção/avaliação automática é aplicada a esse texto.
- [ ] Nenhuma regressão no fluxo obrigatório da jornada.

**Source:** `plano-adequacao-design-instrucional.md`, seção 2 (P2);
aprovado pelo usuário em 2026-10-18

---

### Task 33
| Field | Value |
|---|---|
| **ID** | 33 |
| **Title** | Canal de contato assíncrono (link de suporte na home e no relatório final) |
| **Status** | `pending` |
| **Priority** | `medium` |
| **Complexity** | 1 |
| **Dependencies** | `[13, 24]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 3 — "Provide Opportunities for
Connection"). Como o portal não tem conta/backend (PRD seção 6), não é
viável um fórum ou grupo de estudo nesta v1 — mas o artigo recomenda, no
mínimo, deixar claro como o aluno encontra ajuda num ambiente assíncrono.
Resolvido com um link simples, sem exigir nenhuma infraestrutura nova.

**Details:**
- Adicionar um link de contato (`mailto:` ou formulário externo simples,
  a definir) visível em dois pontos: próximo à FAQ da página inicial
  (`components/public/CourseSections.tsx`, Task 24) e no relatório final
  (`components/journey/FinalReport.tsx`, Task 26) — "Ainda com dúvidas?
  Fale com a gente".
- Não exige nenhuma mudança de infraestrutura (sem backend novo) — é só
  um link estático.

**Files:**
- `content/landing.ts` (texto/URL do canal de contato)
- `components/public/CourseSections.tsx`, `components/journey/FinalReport.tsx`

**Test strategy:**
Revisão manual: link visível e funcional nas duas telas; axe-core
confirma `aria-label`/texto do link compreensível fora de contexto
("Fale com a gente", não "clique aqui").

**Acceptance criteria:**
- [ ] Canal de contato visível na página inicial e no relatório final.
- [ ] Nenhuma infraestrutura de backend introduzida só para isso.

**Source:** `plano-adequacao-design-instrucional.md`, seção 3 (P1);
aprovado pelo usuário em 2026-10-18

---

### Task 34
| Field | Value |
|---|---|
| **ID** | 34 |
| **Title** | Revisão de todos os enunciados do banco de questões após as mudanças de conteúdo (Tasks 28–33) |
| **Status** | `blocked` |
| **Priority** | `medium` |
| **Complexity** | 3 |
| **Dependencies** | `[28, 29, 30, 31, 32, 33]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 4 — "Make Course Content Digestible").
Pedido explícito do usuário: revisar **todas** as perguntas do banco de
questões só depois que as tasks das seções 1, 2 e 3 do plano
(Tasks 28–33) estiverem concluídas — qualquer uma delas pode mudar o que
o vídeo ensina, como a Questão 3 é apresentada, ou o tom geral do
conteúdo (guia de estilo), então revisar antes seria retrabalho.

**Details:**
- Reler as 4 perguntas de `content/module.ts`/`banco-questoes.md` à luz
  de: (a) guia de estilo (Task 28, tom/linguagem), (b) estrutura final do
  vídeo após segmentação/divisão (Tasks 29–30, pode mudar a ordem em que
  conceitos são ensinados), (c) nova apresentação da Questão 3 (Task 31),
  (d) exercício prático opcional (Task 32, pode revelar lacunas de
  conteúdo), (e) canal de contato (Task 33, pode já ter trazido dúvidas
  reais de early adopters a incorporar).
- Além da revisão de conteúdo, aplicar a melhoria de apresentação já
  identificada no plano: separar visualmente o **parágrafo de contexto**
  do cenário da **pergunta objetiva** em cada enunciado (ex. a frase final
  em destaque/`<strong>`), facilitando a leitura (`QuestionRenderer`,
  Task 9).
- Gabarito/feedback (`correctOptionIndex`/`feedback`) só muda se a
  revisão de conteúdo identificar necessidade real — não é uma reescrita
  automática.

**Files:**
- `content/module.ts`
- `components/quiz/QuestionRenderer.tsx`
- `banco-questoes.md` (se o conteúdo de referência precisar de ajuste)

**Test strategy:**
Revisão manual de conteúdo (checklist comparando cada pergunta com o
vídeo final e o guia de estilo); Playwright + axe-core de regressão nas 4
perguntas após qualquer ajuste de apresentação.

**Acceptance criteria:**
- [ ] Todas as 4 perguntas revisadas após a conclusão das Tasks 28–33.
- [ ] Enunciados apresentam separação visual clara entre contexto e
      pergunta objetiva.
- [ ] Nenhuma regressão no gabarito/feedback pedagógico existente.

**Source:** `plano-adequacao-design-instrucional.md`, seção 4 (P1);
aprovado pelo usuário em 2026-10-18

---

### Task 35
| Field | Value |
|---|---|
| **ID** | 35 |
| **Title** | Legendas em português no vídeo real (pendente de gravação) |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 2 |
| **Dependencies** | `[17]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 5 — "Make It Accessible"), **com a
ressalva explícita do usuário**: esta task fica registrada agora, mas só
pode ser executada e validada quando houver um vídeo real publicado —
hoje `content/module.ts` → `youtubeVideoId` ainda é `null` (Task 17). É
a lacuna de acessibilidade mais crítica do portal (afeta diretamente
alunos surdos/com deficiência auditiva), por isso prioridade `high`
mesmo bloqueada.

**Details:**
- **Bloqueio real: não é outra task do task-master, é a gravação e
  publicação do vídeo** (processo de produção já documentado em
  `roteiro_audiovisual_completo_v2.md` + capítulos da Task 29). A
  dependência `[17]` aqui é só a referência formal no task-master; o
  gate verdadeiro é "existe `youtubeVideoId` real".
  Ao publicar o vídeo no YouTube: anexar legenda em português via YouTube
  Studio (legenda enviada manualmente ou **legenda automática revisada
  por humano** — nunca publicar só a automática sem revisão, por
  precisão terminológica pedagógica).
- Nenhuma mudança de código no portal é necessária — o embed do YouTube
  (Task 7) já exibe legendas nativamente quando existem no vídeo.
- Validar, após a publicação, que a legenda aparece corretamente no
  player embedado do portal (não só no youtube.com).

**Files:**
- Nenhum arquivo do portal (ação de produção de conteúdo no YouTube
  Studio) — só `task-master.md` registra o lembrete até lá.

**Test strategy:**
Manual, após a publicação: abrir `/video` no portal, ativar legendas no
player embedado, confirmar sincronismo com o áudio em pelo menos 3
trechos do vídeo.

**Acceptance criteria:**
- [ ] (bloqueado até existir vídeo real) Legenda em português revisada
      por humano, anexada ao vídeo no YouTube.
- [ ] Legenda visível e sincronizada no player embedado do portal.

**Source:** `plano-adequacao-design-instrucional.md`, seção 5 (P0);
aprovado pelo usuário em 2026-10-18, com a ressalva de validação só após
vídeos reais existirem

---

### Task 36
| Field | Value |
|---|---|
| **ID** | 36 |
| **Title** | Transcrição textual completa do(s) vídeo(s) em seção expansível na tela |
| **Status** | `blocked` |
| **Priority** | `medium` |
| **Complexity** | 3 |
| **Dependencies** | `[29, 30]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 5). Publica a locução integral do vídeo
como texto acessível diretamente na página `/video`, dentro de uma seção
colapsada por padrão ("Ler transcrição do vídeo") — ajuda tanto
acessibilidade (leitura em vez de áudio) quanto digestibilidade (Ctrl+F,
revisão rápida sem reassistir). O conteúdo-fonte já existe na coluna
"Locução Integral do Instrutor" de `roteiro_audiovisual_completo_v2.md`.

**Details:**
- Depende da Task 29 (capítulos) e, principalmente, da Task 30 (se o
  vídeo for dividido em partes, a transcrição deve ser organizada por
  vídeo, não como um bloco único) — por isso `blocked` até a estrutura
  final do vídeo estar decidida.
- `components/journey/ModuleVideoStep.tsx`: adicionar um `Accordion`/
  `Disclosure` do HeroUI (mesmo padrão de `FaqAccordion`, Task 24) abaixo
  do player/skeleton, com a transcrição completa — colapsado por padrão
  para não competir visualmente com o vídeo (mesmo cuidado de espaço já
  aplicado à Task 22/23 na avaliação).
- Conteúdo da transcrição: adaptar a coluna de locução do roteiro v2 para
  texto corrido legível (remover marcações de tempo/indicações visuais
  destinadas à produção, manter só a fala).

**Files:**
- `components/journey/ModuleVideoStep.tsx`
- Novo arquivo de conteúdo para a transcrição (ex.
  `content/video-transcript.ts`, formato a definir)

**Test strategy:**
Playwright: seção de transcrição começa colapsada, expande ao clicar,
texto corresponde ao roteiro final; axe-core sem violações na página de
vídeo com a seção expandida e colapsada.

**Acceptance criteria:**
- [ ] Transcrição completa disponível na tela de vídeo, numa seção
      expansível colapsada por padrão.
- [ ] Texto organizado por vídeo, caso a Task 30 tenha dividido o
      conteúdo em múltiplas partes.

**Source:** `plano-adequacao-design-instrucional.md`, seção 5 (P1);
aprovado pelo usuário em 2026-10-18

---

### Task 37
| Field | Value |
|---|---|
| **ID** | 37 |
| **Title** | Avaliar um "flip card" na página inicial |
| **Status** | `pending` |
| **Priority** | `low` |
| **Complexity** | 2 |
| **Dependencies** | `[24]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 6 — "Engage the Learner's Senses"). O
artigo cita *flip cards* como um dos recursos de engajamento junto com
*accordions*/*tabs* (já usados — Tasks 24, 26). Esta task é
explicitamente uma **avaliação**, não uma implementação garantida: decidir
em qual seção da home (ex. "Objetivos do curso" ou "O que você será
capaz de fazer ao final") um cartão com verso/frente (pergunta-gancho no
frente, conceito-chave no verso) agrega valor, sem forçar o padrão em
toda a página.

**Details:**
- Protótipo de 1–2 cartões com `transform: rotateY()`/CSS (sem lib nova)
  numa única seção de `CourseSections.tsx` (Task 24), com fallback
  acessível (o conteúdo do verso também deve ser alcançável via teclado/
  leitor de tela, não só por hover/clique visual — cuidado explícito de
  acessibilidade, dado o padrão já estabelecido nas Tasks 14/18/19).
- Se o protótipo não agregar clareza (ex. escapar do fluxo de leitura
  linear da página), reverter e manter os `Card`s estáticos atuais — esta
  task aceita "não implementar" como resultado válido, desde que a
  avaliação fique registrada.

**Files:**
- `components/public/CourseSections.tsx`
- Possível novo `components/ui/FlipCard.tsx`, só se o protótipo for
  aprovado

**Test strategy:**
Revisão manual de UX do protótipo; axe-core + navegação por teclado
confirmando que o conteúdo do verso é acessível sem depender de hover.

**Acceptance criteria:**
- [ ] Protótipo avaliado em pelo menos uma seção da home.
- [ ] Decisão registrada (adotar ou manter os cartões estáticos atuais),
      com justificativa.
- [ ] Se adotado, acessível via teclado/leitor de tela sem depender de
      hover.

**Source:** `plano-adequacao-design-instrucional.md`, seção 6 (P2);
aprovado pelo usuário em 2026-10-18

---

### Task 38
| Field | Value |
|---|---|
| **ID** | 38 |
| **Title** | Link de feedback pós-curso no relatório final |
| **Status** | `pending` |
| **Priority** | `medium` |
| **Complexity** | 1 |
| **Dependencies** | `[13]` |
| **Phase** | 9 — Adequação a design instrucional (D2L) |
| **Repositório** | ead-portal-educacional |

**Description:**
Aprovado em 2026-10-18 (prática 7 — "Iteration and Reiteration"). A
lacuna mais sistêmica identificada no plano: até agora nenhuma melhoria
veio de dados de alunos reais. Primeiro passo, de custo mínimo e
compatível com a arquitetura 100% client-side (PRD seção 10): um link
para um formulário externo simples (ex. Google Forms) no relatório
final, perguntando nota de satisfação, se alguma pergunta pareceu
confusa, e comentário livre.

**Details:**
- `components/journey/FinalReport.tsx` (Task 26): adicionar um `Button`/
  link "Avalie o curso" próximo ao `RestartJourneyModal`, apontando para
  um formulário externo (URL a definir pelo usuário — não exige nenhum
  backend novo no portal).
- Não implementar telemetria agregada nem coleta automática de respostas
  do quiz nesta task — isso é a Tarefa 38 (não aprovada) do plano
  original, que exigiria introduzir server-side pela primeira vez no
  portal e foi deliberadamente deixada de fora desta rodada de aprovação.

**Files:**
- `components/journey/FinalReport.tsx`

**Test strategy:**
Revisão manual: link visível no relatório final, abre o formulário
externo numa nova aba; axe-core sem violações.

**Acceptance criteria:**
- [ ] Link de feedback pós-curso visível no relatório final.
- [ ] Nenhuma infraestrutura de backend introduzida só para isso.

**Source:** `plano-adequacao-design-instrucional.md`, seção 7 (P1);
aprovado pelo usuário em 2026-10-18

---

### Task 39
| Field | Value |
|---|---|
| **ID** | 39 |
| **Title** | Matriz de rastreabilidade banco de questões × roteiro do vídeo |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 3 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
Frente A de `plano-evolucao-v2.md`. Verifica, questão a questão, se o que
o banco cobra foi de fato ensinado no roteiro v2, e em que nível
cognitivo.

**Details:**
- Matriz: objetivo de aprendizagem → trecho do roteiro (bloco +
  timestamp) → questão → alternativa correta → feedback, com o nível de
  Bloom de cada item.
- Partir dos achados C1–C6 do plano (fontes divergentes, terminologia da
  Questão 1 só ensinada no Bloco 5, Questão 2 idêntica ao Bloco 3,
  cenários repetidos, termos soltos na Questão 4, uma pergunta por
  competência) e acrescentar o que surgir.
- Classificar cada divergência como bloqueante, ajustar ou aceitável.
- Propor a fonte única de verdade do banco.
- Análise apenas: nenhuma alteração em `content/module.ts` ou no roteiro.

**Files:**
- `docs/matriz-rastreabilidade.md` (novo)

**Test strategy:**
Revisão por amostragem: sortear 3 linhas da matriz e conferir manualmente
cada trecho citado do roteiro.

**Acceptance criteria:**
- [x] Toda questão aparece na matriz, com trecho do vídeo que a sustenta
      ou a lacuna registrada.
- [x] Cada divergência tem classificação e proposta.

**Implementado em:** `docs/matriz-rastreabilidade.md` (novo) e
`testes/rastreabilidade/trace.js` (script de rastreamento reutilizável).
10 divergências (D-01 a D-10) classificadas: 1 **bloqueante para a
gravação** (D-08: numeração contraditória das "lentes" entre os Blocos 4B
e 5), 8 a ajustar e 1 aceitável. Achados novos em relação ao plano:
alternativa correta mais longa em 3 de 4 questões (D-07); a home promete
cinco elementos de planejamento, o vídeo ensina quatro (D-09). Pendente: a
revisão do usuário sobre a classificação e a proposta de fonte única.

**Source:** `plano-evolucao-v2.md`, frente A; decisão D2

---

### Task 40
| Field | Value |
|---|---|
| **ID** | 40 |
| **Title** | Percurso e revisão heurística do fluxo de experiência do usuário |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 3 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
Frente B. Mapeia o percurso completo (home → vídeo → avaliação →
relatório → reinício) e revisa com heurísticas de usabilidade, partindo
dos atritos já verificados no código.

**Details:**
- Base: U1 (sem volta ao vídeo, `useJourneyGuard.ts:38`), U2 ("Concluir"
  burla o bloqueio, `ModuleVideoStep.tsx:57`), U3 (avanço automático a
  90%), U4 (relatório sem prescrição), U5 (modelo linear), U6 (vídeo
  inexistente).
- Revisão heurística (Nielsen) com severidade por atrito.
- Protótipo de baixa fidelidade do fluxo-alvo, coerente com a decisão D1
  (hub opcional, cartão de transição ao fim do vídeo, remediação nos
  "Vale revisar").
- O teste de usabilidade com pessoas fica na Task 55.

**Files:**
- `docs/revisao-fluxo-ux.md` (novo)

**Test strategy:**
Revisão manual: cada atrito aponta para um arquivo e linha ou para uma
tela reproduzível.

**Acceptance criteria:**
- [x] Cada atrito tem severidade, evidência e proposta.
- [x] Fluxo-alvo desenhado e consistente com D1.

**Implementado em:** `docs/revisao-fluxo-ux.md` (novo). 17 atritos com
arquivo e linha, 3 de severidade 4: sem volta ao vídeo (UX-01), respostas
da avaliação só em memória (UX-04) e vídeo inexistente (UX-13). Achados
novos: o avanço automático a 90% dispara aos 27:00, dentro da síntese
final do vídeo (UX-03); "Início" apaga todo o progresso e a home some para
quem já tem progresso (UX-09); o player só tem Play e Pause, sem
capítulos nem legendas (UX-11). **A aplicação não foi executada** (o clone
não tem `node_modules`): itens "a verificar" vão para a Task 55.

**Source:** `plano-evolucao-v2.md`, frente B; decisão D1

---

### Task 41
| Field | Value |
|---|---|
| **ID** | 41 |
| **Title** | Benchmark de concorrentes de EaD (pesquisa na web) |
| **Status** | `in-progress` |
| **Priority** | `medium` |
| **Complexity** | 4 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
Frente C. Observa como plataformas de cursos curtos e de formação
estruturam a experiência, para identificar práticas que o portal não tem.

**Details:**
- Definir os critérios **antes** da coleta. Candidatos a validar:
  Coursera, Khan Academy, Google Skillshop, Fundação Bradesco/EVG,
  Sebrae, Escola Virtual.Gov/ENAP, Alura, Udemy, Descomplica.
- Dimensões: onboarding, estrutura do módulo, duração e fragmentação do
  vídeo, materiais complementares, avaliação e feedback, remediação,
  gamificação e certificado, acessibilidade, comunidade, retomada de
  progresso.
- Registrar só o que se observa, com link e data de acesso. Não copiar
  conteúdo de terceiros.

**Files:**
- `pesquisa/benchmark-concorrentes.md` (novo)

**Test strategy:**
Revisão: toda afirmação sobre um concorrente tem fonte e data.

**Acceptance criteria:**
- [ ] Critérios de seleção e de análise declarados antes dos resultados.
- [ ] Matriz comparativa com fonte verificável em cada célula.

**Andamento (2026-11-04):** entregue `pesquisa/benchmark-concorrentes.md`,
com critérios declarados antes da coleta, 9 plataformas e cada afirmação
marcada por confiança (**O** página oficial lida; **R** resumo de busca
sobre página oficial; **N** notícia ou blog). Achados: regra de aprovação
explícita e **tentativas ilimitadas** são comuns (Coursera, Skillshop);
Fundação Bradesco publica "todos os módulos e nota ≥ 70%" e emite
certificados **de conclusão e de participação**; Skillshop permite **pular
módulos** pela verificação prévia. **Pendente para concluir:** a maior
parte das células está em **R** ou **N**; faltam as páginas oficiais da
Escola Virtual.Gov, Sebrae, Coursera, Khan Academy e Udemy (bloquearam ou
renderizam por JavaScript), a Descomplica e a observação de uma página de
curso real. Precisa de navegador conectado ou capturas de tela.

**Source:** `plano-evolucao-v2.md`, frente C

---

### Task 42
| Field | Value |
|---|---|
| **ID** | 42 |
| **Title** | Auditoria instrucional (Gagné, Merrill, Bloom, Kirkpatrick) |
| **Status** | `done` |
| **Priority** | `medium` |
| **Complexity** | 3 |
| **Dependencies** | `[39, 40]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
Frente C. Aplica referenciais que o plano D2L (Tasks 28–38) não cobriu,
sem repetir os 7 critérios já revisados.

**Details:**
- Eventos de instrução de Gagné, princípios de Merrill (tarefa centrada
  em problema, ativação, demonstração, aplicação, integração), taxonomia
  de Bloom e níveis de Kirkpatrick.
- Foco no que falta: ativação de conhecimento prévio, prática guiada,
  transferência.

**Files:**
- `pesquisa/auditoria-instrucional.md` (novo)

**Test strategy:**
Revisão manual contra a matriz da Task 39 e o percurso da Task 40.

**Acceptance criteria:**
- [x] Cada referencial aplicado com lacunas e propostas.
- [x] Nenhuma repetição dos 7 critérios D2L.

**Implementado em:** `pesquisa/auditoria-instrucional.md` (novo). Gagné:
1 de 9 eventos atende, 6 parciais, 2 não atendem (3, recordação, e 9,
transferência). Merrill: 1 de 5 atende; faltam **ativação** e
**integração**. Bloom: **os objetivos O3 e O4 pedem aplicar, analisar,
avaliar e criar, mas a avaliação mede lembrar e compreender.** Kirkpatrick:
só o Nível 2 existe (fraco); **o Nível 4 (resultado educacional) não está
definido em nenhum documento**, e a página oficial recomenda começar por
ele. 8 lacunas (I-01 a I-08) com proposta e task de decisão; várias
**ampliam o escopo das Tasks 46, 47 e 48**. As classificações são
julgamento do autor; o vídeo ainda não existe. Pendente: revisão do
usuário.

**Source:** `plano-evolucao-v2.md`, frente C

---

### Task 43
| Field | Value |
|---|---|
| **ID** | 43 |
| **Title** | Engenharia reversa de roteiros: ebook, quadrinho e mapa interativo (pesquisa na web) |
| **Status** | `in-progress` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
Frente D, decisão D3 (três mídias). Desmonta bons exemplos de cada mídia
para extrair um esqueleto reutilizável de roteiro e um padrão de
storytelling.

**Details:**
- Para cada mídia, selecionar 4–6 exemplos com critério explícito.
  Pontos de partida a validar: tipos de conteúdo do H5P, explicadores
  interativos e StoryMaps (mapa); HQs educativas de não ficção
  (quadrinho); guias de bolso e ebooks de método e **ebooks interativos
  publicados em FlipHTML5 e Genially** (ebook; requisito R1), observando
  também o **design visual**: capa, sumário clicável, abertura de
  capítulo e elementos interativos.
- Ficha padrão por exemplo: promessa e público, estrutura com contagens,
  ritmo, recurso de storytelling, mecanismo de engajamento, fecho, o que
  funciona e o que não serve ao nosso caso.
- Destilar esqueleto, limites de tamanho, regras de tom e checklist de
  qualidade; validar reaplicando ao roteiro do vídeo.

**Files:**
- `pesquisa/engenharia-reversa/{mapa,quadrinho,ebook}.md` (novos)
- `templates/roteiro-{mapa,quadrinho,ebook}.md` (novos)

**Test strategy:**
Cada decisão de estrutura aponta para ao menos um exemplo observado.

**Acceptance criteria:**
- [ ] Um template e uma checklist por mídia.
- [ ] Esqueleto validado contra o roteiro do vídeo.

**Andamento (2026-11-04):** entregues `pesquisa/engenharia-reversa/mapa.md`,
`quadrinho.md` e `ebook.md` (fichas com fonte, data e o que **não** foi
observado) e `templates/roteiro-{mapa,quadrinho,ebook}.md` (com checklist e
validação contra o roteiro v2: o esqueleto cabe nas três mídias).
**Evidência desigual:** mapa com 4 fontes boas; quadrinho com 4, mas sem ler
páginas reais e sem as dez regras do artigo da PLOS; ebook com apenas
fontes de fornecedores (3 páginas falharam). **Pendente para concluir:**
exemplos reais de quadrinho e de ebook, de preferência indicados pelo
usuário, e a revisão dele sobre os esqueletos.

**Source:** `plano-evolucao-v2.md`, frente D; decisão D3

---

### Task 44
| Field | Value |
|---|---|
| **ID** | 44 |
| **Title** | Testes de capacidade do Claude Design (decisão D4 e requisito R2) |
| **Status** | `in-progress` |
| **Priority** | `high` |
| **Complexity** | 4 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
Executa o plano de testes `docs/plano-testes-claude-design.md` para
descobrir formatos de exportação, fidelidade à identidade visual,
consistência de personagem, interatividade, acessibilidade e direitos de
uso, **antes** do brief das peças (Task 49).

**Details:**
- **Ferramenta (decisão D0):** o Design interno ao Claude (tipos de
  artefato "Design" e "Design System"). O Claude Design avulso fecha em
  14/12/2026 e não é usado.
- 15 casos (CD-01 a CD-15), alguns executados por você na ferramenta
  ([U]) e outros por inspeção dos arquivos e scripts do projeto ([C]).
  Os casos CD-12 a CD-15 verificam o que o requisito R2 exige da
  ferramenta: tokens exportáveis, protótipo multi-tela com navegação e
  sobreposições, três explorações distintas e representação de elementos
  externos incorporados.
- **Se os casos CD-12 a CD-15 falharem, parar e consultar o usuário**
  antes de trocar de ferramenta (R2 exige o Claude Design).
- Peças de teste com conteúdo fictício, guardadas em
  `testes/claude-design/` (fora do portal).
- Ao fim, preencher a tabela de resultados e escolher uma das variantes
  V1–V5.

**Files:**
- `docs/plano-testes-claude-design.md` (resultados)
- `testes/claude-design/` (peças de teste)

**Test strategy:**
O próprio plano de testes; CD-11 usa `npm run build` e `npm run lint`.

**Acceptance criteria:**
- [ ] Os 15 casos executados e registrados com evidência.
- [ ] Variante adotada e justificativa registradas.

**Andamento (2026-11-04):** registrados CD-01 (parcial), CD-03, CD-04,
CD-05 e CD-15, com a variante **V6** indicada (Claude Design para layout,
interação e composição; ilustração por IA de imagem, ver Task 64). Peças
de teste em `testes/claude-design/pecas-teste/` (fontes do artefato
privado) e `testes/claude-design/pecas-teste-local/` (versão em HTML
puro, usada na avaliação, porque o link do artefato não abriu para o
usuário). Pendentes: CD-02 e CD-06 a CD-14; CD-06, CD-07, CD-09 e CD-11
dependem de `npm install` e da Task 45.

**Source:** `plano-evolucao-v2.md`, frente E; decisão D4

---

### Task 45
| Field | Value |
|---|---|
| **ID** | 45 |
| **Title** | Infraestrutura de testes reproduzível (Playwright, axe-core e testes unitários) |
| **Status** | `done` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
O `package.json` hoje só tem `dev`, `build`, `start` e `lint`; as
auditorias de Playwright e axe-core citadas nas Tasks 1–27 foram
avulsas. Esta task as torna reproduzíveis, para que as tasks de código
seguintes tenham rede de segurança.

**Details:**
- Adicionar Playwright e `@axe-core/playwright` como dependências de
  desenvolvimento; testes unitários para `lib/` e para o repositório de
  progresso.
- Scripts no `package.json` (ex. `test`, `test:e2e`, `test:a11y`).
- Teste de base da jornada atual (home → vídeo → avaliação →
  relatório → reinício) e auditoria axe nas combinações de tema ×
  contraste × tamanho de fonte.
- **Pré-requisito:** `npm install` (o clone não tem `node_modules`).
- Registrar no `package.json` o script `docs:check`
  (`node testes/consistencia/verificar-docs.js`). A pasta `testes/`
  guarda evidências e verificadores de documentação e pesquisa; `tests/`
  fica para os testes automatizados do código.
- Antes de qualquer código, ler o guia relevante em
  `node_modules/next/dist/docs/` (`AGENTS.md`).

**Files:**
- `package.json`, `package-lock.json`
- Configuração de testes e `tests/` (novos)

**Test strategy:**
Os scripts rodam do zero em máquina limpa e passam contra o `main`.

**Acceptance criteria:**
- [x] Scripts de teste documentados e funcionando.
- [x] Linha de base verde antes de qualquer task de código da Fase 13.

**Implementado em (2026-11-05):** `vitest.config.mts`, `playwright.config.ts`,
`tests/helpers/progress.ts`, `tests/unit/` (4 arquivos, **46 testes**),
`tests/e2e/jornada.spec.ts` (11 testes e 2 `fixme`) e `tests/a11y/axe.spec.ts`
(**60 casos**: 4 telas × 12 combinações de tema, contraste e fonte, mais 12
estados interativos). Scripts `test`, `test:watch`, `test:e2e`, `test:a11y` e
`docs:check`. `devDependencies`: Vitest 4.1.12 (a 5.x exige `@types/node` 22 ou
superior e o projeto fixa a 20), jsdom, Playwright 1.64.1 e `@axe-core/playwright`
4.14.0. Ajustes em `.gitignore` e `eslint.config.mjs` (ignora `testes/`, scripts
CommonJS de evidência que quebravam o `npm run lint` na branch do PR #5).
`workers: 1`, porque em paralelo a máquina estourou o tempo.

**Linha de base verde:** `lint`, tipos e `build` passam; unitários 46/46; E2E 11
passam e 2 `fixme` (UX-01 e UX-04); acessibilidade 60/60.

**A auditoria encontrou defeitos reais no produto, corrigidos nesta task** (o
registro anterior de "0 violações" não alcançava as Tasks 24–27, feitas direto
no GitHub): (1) `nested-interactive`: `Tooltip.Trigger` envolvendo `Button` no
cabeçalho e no menu de perguntas (WCAG 4.1.2); (2) `label-content-name-mismatch`
no menu de perguntas e nos botões de fonte (WCAG 2.5.3); (3) contraste do texto
vermelho no tema escuro, 2,6:1, com o novo token `--danger-text`; (4) contraste do
hover do botão primário no tema escuro, 3,95:1, com o novo `--accent-hover`.
**Falso positivo conhecido do axe-core 4.14, filtrado de forma estreita e
anotada:** `aria-allowed-attr` no `Meter`, porque o React Aria usa
`role="meter progressbar"` e o axe não reconhece a lista de papéis (provado com
um experimento isolado). **Atritos descobertos pelo E2E e resolvidos por decisão
do usuário (2026-11-05):** UX-18 (o toast cobria o botão de avançar e pausava o
fechamento no hover), UX-19 (botão "Close" do toast em inglês) e UX-15 (toast
duplicando o alerta), todos resolvidos **removendo o toast de confirmação**; o
retorno da resposta passa a ser anunciado por uma região `status`, com testes
(`docs/revisao-fluxo-ux.md`).

**Source:** `plano-evolucao-v2.md`, frente F e seção 11

---

### Task 46
| Field | Value |
|---|---|
| **ID** | 46 |
| **Title** | Síntese, matriz de lacunas e ADR do modelo de jornada |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 3 |
| **Dependencies** | `[39, 40, 41, 42, 43]` |
| **Phase** | 11 — Evolução v2: decisão |
| **Repositório** | ead-portal-educacional |

**Description:**
Consolida o diagnóstico em uma matriz de lacunas (portal × concorrentes ×
referencial instrucional) e registra a decisão do modelo de jornada.

**Details:**
- Matriz com impacto, esforço e dependência por lacuna.
- ADR do modelo: hub opcional (D1), banco híbrido (D2), três mídias (D3).
- **Reavaliar o fluxo do usuário com os novos artefatos (UX-21,
  `docs/revisao-fluxo-ux.md`) antes de registrar o ADR:** o e-book e o mapa
  já existem como rotas públicas separadas, fora da jornada (o quadrinho
  virá), o que coloca em questão a D1 (hub opcional) e o fluxo-alvo da
  seção 4 do documento. Esta task só registra o ADR depois dessa análise.
- Registrar que a D5 segue em aberto até o vídeo final.

**Files:**
- `docs/adr-modelo-de-jornada.md` (novo)

**Test strategy:**
Revisão: cada lacuna aponta para uma task ou para uma justificativa de
descarte.

**Acceptance criteria:**
- [ ] Matriz de lacunas priorizada.
- [ ] ADR registrado e aprovado.

**Source:** `plano-evolucao-v2.md`, seção 10; decisões D1–D3

---

### Task 47
| Field | Value |
|---|---|
| **ID** | 47 |
| **Title** | Banco de questões v2: itens-núcleo e variantes com cenário novo |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[46, 31, 32, 33]` |
| **Phase** | 11 — Evolução v2: decisão |
| **Repositório** | ead-portal-educacional |

**Description:**
Decisão D2 (opção C). Mantém as 4 questões atuais como núcleo e acrescenta
variantes em outra disciplina e outro público, chegando a 8–12 itens, com
2–3 por competência. Depende das Tasks 31–33 para preservar a ordem pedida
na aprovação da Task 34.

**Details:**
- Definir `content/module.ts` como fonte única; `banco-questoes.md` é
  gerado a partir dele ou aposentado.
- Corrigir lacunas de **ensino** apontadas pela Task 39 no roteiro v2
  (ex. introduzir "coerência didática" já nos Blocos 1 e 4A).
- Manter rastreabilidade por trecho do roteiro em cada item, para
  localizar rapidamente o que mudar quando o vídeo final existir (campo
  `source`, ex. `{ block: "B4A", at: "17:00", lens: 1 }`).
- **Achados da Task 39 a tratar aqui:** unificar a numeração das lentes
  no roteiro antes de gravar (D-08, bloqueante); escolher um termo entre
  "alinhamento pedagógico" e "alinhamento construtivo" (D-02); decidir
  se o vídeo passa a ensinar "conteúdos" ou se a home passa a prometer
  quatro elementos (D-09); igualar o tamanho das alternativas e criar
  distratores a partir de equívocos reais (D-07); glossário único das
  quatro competências (D-10).
- Decidir aqui se as variantes entram na primeira passada ou só no
  "refazer as erradas".
- **Pendente (D5):** a divisão entre esta task e a parte de apresentação
  da Task 34 será definida quando o vídeo final existir.

**Files:**
- `content/module.ts`, `types/quiz.ts`
- `roteiro_audiovisual_completo_v2.md`, `banco-questoes.md`

**Test strategy:**
Revisão contra a matriz da Task 39; testes unitários de `gradeQuiz` e
`resolveFeedback` com os novos itens.

**Acceptance criteria:**
- [ ] 2–3 itens por competência, com núcleo preservado.
- [ ] Nenhum termo da alternativa correta é inédito para o aluno.
- [ ] Todo item tem trecho de roteiro vinculado.

**Source:** `plano-evolucao-v2.md`, frente A; decisão D2

---

### Task 48
| Field | Value |
|---|---|
| **ID** | 48 |
| **Title** | Roteiros das três mídias (mapa, quadrinho e ebook) |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[43, 46, 47]` |
| **Phase** | 12 — Evolução v2: produção de conteúdo |
| **Repositório** | ead-portal-educacional |

**Description:**
Escreve os roteiros usando os templates da Task 43, com cenários novos
(nunca os das questões) e mapeados às competências do banco v2.

**Details:**
- **Mapa interativo:** os 4 vértices do alinhamento; cada nó traz conceito,
  exemplo e a falha típica que a IA comete.
- **Quadrinho:** uma professora audita duas sugestões da IA em outra
  disciplina; bifurcações de decisão.
- **Ebook (guia de bolso), requisito R1:** fórmula
  Papel-Contexto-Tarefa-Formato, as 4 lentes, checklist e modelos de
  comando; cartão de referência derivado dos artefatos estáticos 1, 2 e 8
  do vídeo. O roteiro define obrigatoriamente **capa, sumário e capítulos
  estruturados** em ordem lógica, cada capítulo com abertura (objetivo),
  desenvolvimento e fecho (síntese ou checklist), **pelo menos um elemento
  interativo por capítulo** e **linguagem clara** para o público-alvo
  (frases curtas, termo técnico definido no primeiro uso, glossário).
- Matriz de cobertura peça × competência × questão.
- **Ebook (versão definitiva, 2026-11-05):** adiantado sem liberar esta
  task: `conteudo/ebook/roteiro.md`, `public/ebook/leitor.html` e
  `public/ebook/ebook-planejar-com-ia.pdf`, publicados no portal pela rota
  `/ebook`. O restante desta task (revisão por educadores e matriz
  definitiva) continua `blocked`.
- **Mapa interativo (2026-11-05):** também adiantado sem liberar esta task:
  `conteudo/mapa/roteiro.md`, `content/mapa.ts` e o componente
  `components/materials/ConceptMap.tsx`, publicados na rota `/mapa`. Faltam
  as ilustrações dos quatro nós (prompts em `docs/prompts-ilustracao.md`,
  seção 5.4) e a revisão por educadores (Task 50).
- **Quadrinho (2026-11-05):** também adiantado sem liberar esta task:
  `conteudo/quadrinho/roteiro.md`, `content/quadrinho.ts` e o componente
  `components/materials/ComicReader.tsx`, publicados na rota `/quadrinho`,
  com as seis cenas da Task 64 (as mesmas do ebook). Falta a revisão por
  educadores (Task 50); cenas próprias e um episódio 2 ficam para depois.

**Files:**
- `conteudo/{mapa,quadrinho,ebook}/` (novos)

**Test strategy:**
Checklist de qualidade da Task 43 aplicada a cada roteiro.

**Acceptance criteria:**
- [ ] Cada roteiro com objetivo, competências e questões cobertas.
- [ ] Nenhum cenário repete o de uma questão.

**Source:** `plano-evolucao-v2.md`, frente E; decisão D3

---

### Task 49
| Field | Value |
|---|---|
| **ID** | 49 |
| **Title** | Brief e produção das peças no Claude Design |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 6 |
| **Dependencies** | `[44, 48, 58, 59, 64]` |
| **Phase** | 12 — Evolução v2: produção de conteúdo |
| **Repositório** | ead-portal-educacional |

**Description:**
Produz as peças visuais conforme a variante escolhida na Task 44.

**Details:**
- Brief por peça: objetivo, público, **design system v2 (Task 59)**,
  formato de saída, restrições de acessibilidade. Nenhuma peça é
  produzida antes do design system v2.
- Produção em duas camadas (resultado da Task 44): **ilustrações**
  (personagem e cenas da HQ, arte dos nós do mapa, capa e ilustrações de
  capítulo do ebook) pela IA de imagem escolhida na Task 64, sempre sem
  texto na imagem; **composição, texto, balões, diagramas e
  diagramação** no Claude Design, em HTML vivo.
- **Ebook (R1):** uma página por prancheta, exportada em PDF e lida
  página a página na plataforma (virada de página), nunca todas as
  páginas de uma vez; capa, sumário e capítulos com design profissional
  e envolvente, nos formatos exigidos pela plataforma escolhida na Task 58.
- Exportar no formato definido pela variante (Task 44), com alt-text e
  roteiro textual por painel.

**Files:**
- `conteudo/{mapa,quadrinho,ebook}/arte/` (novos)

**Test strategy:**
Cada peça passa pelos testes CD-02, CD-03 e CD-09 do plano de testes.

**Acceptance criteria:**
- [ ] Peças finais exportadas no formato decidido.
- [ ] Ficha por peça (objetivo, questões cobertas, alt-text).

**Source:** `plano-evolucao-v2.md`, frente E; decisão D4

---

### Task 50
| Field | Value |
|---|---|
| **ID** | 50 |
| **Title** | Revisão pedagógica e de acessibilidade das peças |
| **Status** | `blocked` |
| **Priority** | `medium` |
| **Complexity** | 3 |
| **Dependencies** | `[49]` |
| **Phase** | 12 — Evolução v2: produção de conteúdo |
| **Repositório** | ead-portal-educacional |

**Description:**
Garante que as peças reforçam o vídeo sem comprometer a avaliação e que
são acessíveis antes de entrarem no portal.

**Details:**
- Pedagógica: nenhuma peça revela a resposta de uma questão; terminologia
  idêntica à do vídeo.
- Acessibilidade: texto alternativo em toda imagem, roteiro textual de
  cada painel, contraste AA, ordem de leitura.
- **Ebook (R1):** revisão de linguagem clara por 2–3 educadores do
  perfil-alvo; conferência da checklist (capa, sumário navegável,
  capítulos coerentes, elemento interativo por capítulo, design
  profissional).

**Files:**
- `conteudo/*/revisao.md` (novos)

**Test strategy:**
Revisão por pessoa que não produziu a peça.

**Acceptance criteria:**
- [ ] Checklist pedagógica e de acessibilidade preenchida por peça.

**Source:** `plano-evolucao-v2.md`, frente E

---

### Task 51
| Field | Value |
|---|---|
| **ID** | 51 |
| **Title** | `UserProgress` v2 com esquema versionado e migração do `localStorage` |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 7 |
| **Dependencies** | `[45, 46]` |
| **Phase** | 13 — Evolução v2: implementação |
| **Repositório** | ead-portal-educacional |

**Description:**
Redesenha o modelo de progresso para suportar materiais complementares e
já nascer preparado para uma lista de vídeos (a decisão D5 fica em aberto,
mas assim qualquer desfecho exige uma única migração).

**Details:**
- Esquema com número de versão; listas de vídeos (hoje, um item) e de
  materiais vistos; `currentStep` preservado.
- Migração do formato antigo com valores padrão; nenhuma perda de
  progresso de quem já está no meio da jornada.
- **Achados da Task 40:** guardar também as **respostas confirmadas da
  avaliação** (UX-04, hoje só em memória) e a **posição do vídeo**
  (UX-12, o player já aceita `initialTime`).
- Ler o guia relevante em `node_modules/next/dist/docs/` antes de codar.

**Files:**
- `types/progress.ts`, `services/user-progress/*`

**Test strategy:**
Fixtures de `localStorage` no formato antigo (TP-01), testes unitários e
E2E sobre a infraestrutura da Task 45.

**Acceptance criteria:**
- [ ] Aluno com progresso antigo retoma da mesma etapa.
- [ ] Testes de migração passam; build e lint limpos.

**Source:** `plano-evolucao-v2.md`, frente F; decisões D1 e D5

---

### Task 52
| Field | Value |
|---|---|
| **ID** | 52 |
| **Title** | Hub `/materiais` e componentes de leitura (HQ, mapa e ebook incorporado) |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 8 |
| **Dependencies** | `[44, 50, 51, 61, 62]` |
| **Phase** | 13 — Evolução v2: implementação |
| **Repositório** | ead-portal-educacional |

**Description:**
Decisão D1 (hub opcional). Cria a área de materiais e os componentes de
leitura, com acessibilidade no nível do restante do portal.

**Details:**
- Rotas `/materiais` e `/materiais/[id]`; conteúdo em arquivos de seed,
  no padrão de `content/`.
- Leitor de quadrinho (teclado, alt-text, roteiro textual); mapa
  interativo (nós focáveis, painel de detalhe, alternativa em lista para
  leitor de tela).
- **Ebook (R1):** incorpora a versão interativa publicada na plataforma
  escolhida (Task 61), com moldura, proporção e `title` acessível do
  design system v2, e ajusta cabeçalhos e política de conteúdo em
  `next.config.ts` se a incorporação exigir. Ao lado, a **versão
  acessível**: capítulos em HTML pesquisável e legível em leitor de tela,
  com download em PDF.
- **Analisar o UX-20** (`docs/revisao-fluxo-ux.md`): o leitor do ebook, já
  no ar em `/ebook`, deixa pouco espaço vertical para a página (dois
  cabeçalhos mais o rodapé de navegação; 329 px de 657 em um notebook) e
  obriga a rolar. A solução é a desta task, quando a rota virar
  `/materiais/[id]`.
- Item no cabeçalho da jornada; registro de material visto no
  `UserProgress` v2.
- Seguir a variante da Task 44 (incorporar HTML interativo só se passar
  nos testes CD-06 e CD-07).

**Files:**
- `app/materiais/**`, `components/materials/*`, `content/materials.ts`

**Test strategy:**
TP-03 (teclado e leitor de tela) e axe nas combinações de tema,
contraste e fonte.

**Acceptance criteria:**
- [ ] Hub funcional em mobile e desktop, por teclado e leitor de tela.
- [ ] Jornada antiga intacta para quem já tinha progresso.

**Source:** `plano-evolucao-v2.md`, frente F; decisões D1, D3 e D4

---

### Task 53
| Field | Value |
|---|---|
| **ID** | 53 |
| **Title** | Ajustes de fluxo: rever o vídeo, "Concluir" e cartão de transição |
| **Status** | `blocked` |
| **Priority** | `medium` |
| **Complexity** | 5 |
| **Dependencies** | `[46, 51, 63]` |
| **Phase** | 13 — Evolução v2: implementação |
| **Repositório** | ead-portal-educacional |

**Description:**
Corrige os atritos U1–U3 do plano, conforme o fluxo-alvo aprovado.

**Details:**
- Relaxar `useJourneyGuard` para permitir rever etapas já liberadas, sem
  perder o progresso.
- Tornar o "Concluir" honesto (ex. "Já assisti — ir para a avaliação") ou
  condicional.
- Trocar o avanço automático a 90% por cartão de transição, com a opção
  de ver os materiais complementares ou ir à avaliação. O limiar de 90%
  de um vídeo de 30 min cai aos 27:00, dentro da síntese final (UX-03).
- **Achado da Task 45 (UX-18), já resolvido em 2026-11-05:** o toast de
  confirmação cobria o botão de avançar; foi removido, e o retorno da
  resposta fica no alerta da tela, numa região `status`. Nada a fazer aqui.
- **Achados da Task 40 acrescentados ao escopo:** retomar a avaliação de
  onde parou, com as respostas salvas (UX-04); controles do player com
  avançar, voltar, velocidade, legendas e capítulos (UX-11); separar
  "Início" de "Apagar meus dados" e manter a home acessível a quem já tem
  progresso (UX-09 e UX-10); retomar o vídeo da posição salva (UX-12).

**Files:**
- `lib/journey/useJourneyGuard.ts`
- `components/journey/ModuleVideoStep.tsx`, `components/journey/ModuleAssessmentStep.tsx`
- `components/video/VideoPlayer.tsx`, `components/journey/HomeResetButton.tsx`
- `components/public/WelcomeHero.tsx`

**Test strategy:**
TP-02: quem está na avaliação abre `/video` e volta sem perda.

**Acceptance criteria:**
- [ ] Rever o vídeo a qualquer momento após liberado.
- [ ] Sem avanço automático sem confirmação.

**Source:** `plano-evolucao-v2.md`, frente B; decisão D1

---

### Task 54
| Field | Value |
|---|---|
| **ID** | 54 |
| **Title** | Remediação dirigida no relatório e no gabarito |
| **Status** | `blocked` |
| **Priority** | `medium` |
| **Complexity** | 4 |
| **Dependencies** | `[47, 52]` |
| **Phase** | 13 — Evolução v2: implementação |
| **Repositório** | ead-portal-educacional |

**Description:**
Cada competência marcada como "Vale revisar" aponta para o material que
a cobre.

**Details:**
- Mapeamento competência → materiais em `content/`.
- Link e recomendação em `FinalReport.tsx` e no gabarito comentado;
  opção "refazer as erradas", conforme decidido na Task 47.
- **Achados da Task 40:** o gabarito deve mostrar enunciado, resposta do
  aluno, resposta correta e feedback (UX-07, hoje só mostra o feedback);
  reinício parcial só da avaliação, sem apagar o vídeo (UX-05).

**Files:**
- `components/journey/FinalReport.tsx`, `components/quiz/AnswerFeedback.tsx`
- `content/materials.ts`

**Test strategy:**
TP-04: errar uma questão e seguir o link até o material correto.

**Acceptance criteria:**
- [ ] Todo "Vale revisar" leva ao material da competência.

**Source:** `plano-evolucao-v2.md`, frente F; decisão D1

---

### Task 55
| Field | Value |
|---|---|
| **ID** | 55 |
| **Title** | Validação final: E2E, axe e teste de usabilidade com 3–5 pessoas |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[52, 53, 54, 62, 63]` |
| **Phase** | 14 — Evolução v2: validação |
| **Repositório** | ead-portal-educacional |

**Description:**
Confirma que a evolução funciona de ponta a ponta e que o público-alvo
consegue usá-la.

**Details:**
- E2E e axe-core em todas as combinações de tema × contraste × fonte ×
  tela (TP-05); build e lint (TP-06).
- **Revisão visual (R2):** comparar o produto implementado com os
  protótipos aprovados (Task 60) em todas as telas e temas; verificar o
  ebook incorporado e sua versão acessível.
- Teste de usabilidade com 3–5 educadores: fazer o módulo e dizer o que
  fariam depois de errar uma pergunta.

**Files:**
- `tests/`, `docs/revisao-fluxo-ux.md` (resultados)

**Test strategy:**
Scripts da Task 45; observação e registro das sessões.

**Acceptance criteria:**
- [ ] Zero violações axe; build e lint limpos.
- [ ] Problemas graves da sessão de usabilidade tratados ou registrados.

**Source:** `plano-evolucao-v2.md`, seção 8

---

### Task 56
| Field | Value |
|---|---|
| **ID** | 56 |
| **Title** | Atualizar PRD, task-master e guia de estilo |
| **Status** | `blocked` |
| **Priority** | `low` |
| **Complexity** | 2 |
| **Dependencies** | `[55]` |
| **Phase** | 14 — Evolução v2: validação |
| **Repositório** | ead-portal-educacional |

**Description:**
Fecha o ciclo documentando o que foi entregue.

**Details:**
- PRD (seções 3, 4, 5, 9 e 9.3), `task-master.md`, status do
  `plano-evolucao-v2.md` e **`docs/guia-de-estilo.md` substituído pelo
  design system v2** (`docs/design-system-v2.md`), já que R2 reelabora
  cores, fontes e componentes.

**Files:**
- `PRD.md`, `task-master.md`, `docs/guia-de-estilo.md`, `plano-evolucao-v2.md`

**Test strategy:**
Revisão: nenhuma afirmação dos documentos contradiz o código.

**Acceptance criteria:**
- [ ] Documentação coerente com o que está em produção.

**Source:** `plano-evolucao-v2.md`, seção 12

---

### Task 57
| Field | Value |
|---|---|
| **ID** | 57 |
| **Title** | Referências visuais e de UX do mercado (pesquisa na web, requisito R2) |
| **Status** | `in-progress` |
| **Priority** | `high` |
| **Complexity** | 4 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
Frente H. O requisito R2 pede que todo o layout seja reelaborado a
partir das **melhores referências do mercado**. Esta task reúne e analisa
essas referências antes da direção de arte (Task 59).

**Details:**
- Declarar os critérios de seleção **antes** da coleta: plataformas de
  ensino e produtos digitais reconhecidos por design moderno e
  profissional, com ênfase em público adulto e em uso no celular.
- Analisar por categoria: tela inicial e apresentação do curso,
  navegação, vídeo e player, avaliação e feedback, relatório e
  progresso, materiais complementares, ebook, sobreposições (drawer,
  modal, toast) e estados de carregamento.
- Para cada referência: o padrão observado, por que funciona, o que a
  acessibilidade permite ou impede, link e data de acesso.
- Extrair **padrões, não identidade**: nenhuma marca, arte ou texto de
  terceiros é copiado, para o produto ser autêntico.
- Montar um moodboard organizado por categoria.

**Files:**
- `pesquisa/referencias-visuais.md` (novo)

**Test strategy:**
Revisão: toda referência tem fonte e data; cada padrão aponta para uma
tela ou componente do portal que ele inspira.

**Acceptance criteria:**
- [ ] Critérios declarados antes dos resultados.
- [ ] Referências por categoria, com fonte e observação de acessibilidade.
- [ ] Nenhum conteúdo de terceiros reproduzido.

**Andamento (2026-11-04):** entregue `pesquisa/referencias-visuais.md`, com
critérios declarados antes da coleta e 8 referências (Microsoft Learn,
GOV.UK, Able Player, Duolingo, Khan Academy, gov.br). **A pesquisa registra
estrutura e padrões, não a aparência:** a extração foi em texto e **nenhuma
tela renderizada foi vista**. Sem cobertura: sobreposições, estados de
carregamento e a linguagem visual (cor, tipografia, formas). Khan Academy
e gov.br não carregaram. **Pendente para concluir:** o usuário indicar 3 a
5 interfaces que admira e fornecer capturas de tela ou um navegador
conectado, para ver a aparência.

**Source:** `plano-evolucao-v2.md`, frente H (7.1); requisito R2

---

### Task 58
| Field | Value |
|---|---|
| **ID** | 58 |
| **Title** | Avaliação das plataformas de ebook: FlipHTML5 × Genially (requisito R1) |
| **Status** | `pending` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
O requisito R1 exige a publicação do ebook em plataforma interativa como
FlipHTML5 ou Genially. Esta task executa `docs/plano-testes-plataformas-ebook.md`
para escolher uma delas com evidência e descobrir como incorporá-la ao
portal sem comprometer acessibilidade, privacidade e aparência.

**Details:**
- 10 casos (PL-01 a PL-10): plano e custo, incorporação, acessibilidade,
  interatividade, fidelidade ao design, desempenho em celular, privacidade
  (LGPD), portabilidade e termos, convivência com os temas do portal e
  atualização.
- Ações suas: criar as contas, publicar o ebook de teste fictício e ler
  os termos e planos; o restante é executado por Claude.
- **Ponto de aprovação C:** você escolhe a plataforma e aprova o custo do
  plano.
- Princípio fixo, qualquer que seja o resultado: ebook com **duas
  faces** — versão interativa na plataforma (cumpre R1) e versão acessível
  (HTML ou PDF) no portal.

**Files:**
- `docs/plano-testes-plataformas-ebook.md` (resultados)
- `testes/plataformas-ebook/` (evidências)

**Test strategy:**
O próprio plano de testes; PL-02 usa `npm run build` e `npm run lint`
sobre a página de teste com o embed.

**Acceptance criteria:**
- [ ] Os 10 casos executados nas duas plataformas, com evidência.
- [ ] Plataforma escolhida, com justificativa e custo aprovados por você.
- [ ] Requisitos de incorporação registrados para a Task 52.

**Source:** `plano-evolucao-v2.md`, seção 7.1 e requisito R1

---

### Task 59
| Field | Value |
|---|---|
| **ID** | 59 |
| **Title** | Direção de arte e design system v2 no Claude Design (requisito R2) |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 8 |
| **Dependencies** | `[44, 46, 57]` |
| **Phase** | 11 — Evolução v2: decisão |
| **Repositório** | ead-portal-educacional |

**Description:**
Reelabora, no Claude Design, **todos os itens do layout**: cores, fontes,
formatos dos elementos, navegações, incorporação de elementos externos e
exibição e sobreposição de componentes, para um produto coerente,
atrativo, profissional, moderno e autêntico.

**Details:**
- Ferramenta: tipos "Design" e "Design System" do Claude (decisão D0).
- Produzir **três explorações** de direção de arte, claramente distintas,
  a partir das referências da Task 57 e do estado atual do portal.
  **Ponto de aprovação A:** você escolhe uma e decide se a paleta
  marinho e dourado (Task 27) é mantida, evoluída ou substituída.
- Fechar o design system v2 na direção escolhida: tokens (cores, tipografia,
  raios, sombras, espaçamento, movimento), componentes, navegação,
  sobreposições (drawer, modal, toast, tooltip, acordeão, abas) e regras
  de incorporação (player, ebook).
- Cobrir tema claro, escuro, alto contraste e os três tamanhos de fonte;
  **verificar contraste AA de todos os pares** antes da aprovação.
- Exportar os tokens em formato legível por código (conforme CD-12).

**Files:**
- `docs/design-system-v2.md` (novo), tokens exportados, explorações

**Test strategy:**
Verificação automática de contraste dos pares de cor; revisão da
consistência entre explorações e tokens.

**Acceptance criteria:**
- [ ] Ponto de aprovação A concedido por você.
- [ ] Design system v2 documentado, com contraste AA em todos os temas.
- [ ] Tokens exportados e coerentes entre temas.

**Source:** `plano-evolucao-v2.md`, frente H (7.1); requisito R2

---

### Task 60
| Field | Value |
|---|---|
| **ID** | 60 |
| **Title** | Protótipos das telas no Claude Design (requisito R2) |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 6 |
| **Dependencies** | `[59]` |
| **Phase** | 11 — Evolução v2: decisão |
| **Repositório** | ead-portal-educacional |

**Description:**
Protótipos navegáveis de todas as telas, no design system v2, para
aprovação antes de qualquer código.

**Details:**
- Telas: home com as seções do curso, vídeo, avaliação (menu lateral e
  feedback), relatório, hub de materiais, leitores de HQ e mapa, ebook
  incorporado, drawer de acessibilidade, modal de reinício, toasts e
  estados de carregamento.
- Nos temas claro, escuro e alto contraste, em celular e desktop.
- Incluir as ilustrações hoje reservadas por `ImagePlaceholder` (hero,
  objetivos e jornada).
- **Ponto de aprovação B:** você aprova telas, navegação e
  sobreposições para irem ao código.

**Files:**
- `docs/prototipos.md` e exportações (novos)

**Test strategy:**
Revisão de consistência entre telas e tokens; checagem de contraste
nas telas.

**Acceptance criteria:**
- [ ] Todas as telas listadas prototipadas nos três temas.
- [ ] Ponto de aprovação B concedido por você.

**Source:** `plano-evolucao-v2.md`, frente H (7.1); requisito R2

---

### Task 61
| Field | Value |
|---|---|
| **ID** | 61 |
| **Title** | Publicação do ebook na plataforma escolhida (requisito R1) |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 4 |
| **Dependencies** | `[50, 58]` |
| **Phase** | 12 — Evolução v2: produção de conteúdo |
| **Repositório** | ead-portal-educacional |

**Description:**
Publica o ebook final em FlipHTML5 ou Genially (a escolhida na Task 58),
cumprindo a obrigatoriedade do requisito R1.

**Details:**
- Publicar o ebook revisado (Task 50) e configurar o necessário para a
  incorporação (domínios permitidos, privacidade, proporção).
- Ações suas: conta e plano na plataforma. **Credenciais nunca entram no
  repositório.**
- Testar o ebook publicado em celular e por teclado; registrar o link
  público e o código de incorporação.
- Gerar a **versão acessível** (HTML e PDF) para o portal.

**Files:**
- `conteudo/ebook/publicacao.md` (link, configuração e checklist)

**Test strategy:**
Abrir o link público em desktop e celular; PL-02, PL-03 e PL-07
repetidos sobre o ebook final.

**Acceptance criteria:**
- [ ] Ebook publicado e acessível por link público.
- [ ] Código de incorporação validado em uma página de teste.
- [ ] Versão acessível (HTML e PDF) pronta.

**Source:** `plano-evolucao-v2.md`, requisito R1

---

### Task 62
| Field | Value |
|---|---|
| **ID** | 62 |
| **Title** | Design system v2 em código: tokens, tema, tipografia, navegação e sobreposições (requisito R2) |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 7 |
| **Dependencies** | `[45, 60]` |
| **Phase** | 13 — Evolução v2: implementação |
| **Repositório** | ead-portal-educacional |

**Description:**
Implementa as **fundações** do design system v2, aprovadas nos pontos A
e B, sem alterar o comportamento da jornada.

**Details:**
- Tokens e temas (claro, escuro, alto contraste) em `app/globals.css`,
  sobre o HeroUI; tipografia (`next/font`); componentes-base; estrutura
  de navegação; padrão de sobreposições e de incorporação.
- Preservar as preferências de acessibilidade existentes (tema, tamanho de
  fonte, alto contraste, drawer).
- Antes de qualquer código, ler o guia relevante em
  `node_modules/next/dist/docs/` (`AGENTS.md`).

**Files:**
- `app/globals.css`, `app/layout.tsx`, `components/ui/*`
- `components/journey/JourneyLayout.tsx`, `components/public/PortalHeader.tsx`

**Test strategy:**
axe-core em todas as combinações (TP-05) e comparação com os protótipos,
sobre a infraestrutura da Task 45.

**Acceptance criteria:**
- [ ] Tokens do design system v2 aplicados nos três temas.
- [ ] Zero violações axe; build e lint limpos.
- [ ] Preferências de acessibilidade intactas.

**Source:** `plano-evolucao-v2.md`, frente H (7.1); requisito R2

---

### Task 63
| Field | Value |
|---|---|
| **ID** | 63 |
| **Title** | Novo visual nas telas existentes e ilustrações (requisito R2) |
| **Status** | `blocked` |
| **Priority** | `high` |
| **Complexity** | 8 |
| **Dependencies** | `[62, 64]` |
| **Phase** | 13 — Evolução v2: implementação |
| **Repositório** | ead-portal-educacional |

**Description:**
Aplica o novo visual às telas que já existem e substitui os espaços
reservados por ilustrações finais.

**Details:**
- Telas: home (`CourseSections`, `FaqAccordion`, `WelcomeHero`), etapa de
  vídeo (incluindo a moldura do player), avaliação, relatório, modais,
  toasts e drawer de acessibilidade.
- Ilustrações (hero, objetivos e jornada), geradas pela IA de imagem
  escolhida na Task 64 e compostas conforme o design system v2,
  substituem `ImagePlaceholder`; decidir e documentar, para cada uma, se é
  decorativa (`alt=""`) ou informativa (`alt` descritivo).
- Apresentação dos enunciados das questões coerente com o novo visual.
- Somente aparência: mudanças de comportamento ficam na Task 53.
- **Achado da Task 45 (UX-19), já resolvido em 2026-11-05:** o botão de
  fechar do toast estava em inglês; deixou de existir com a remoção do toast.
- **Achado da auditoria (2026-11-04):** a produção exibe aos alunos o
  rótulo de desenvolvimento dos espaços de imagem (ex. "Ilustração dos
  objetivos · `public/img/objetivos.svg · 480×360`"). Esta task os
  elimina; se a produção das ilustrações demorar, avaliar esconder antes
  só a dica de caminho em produção. **Resolvido em 2026-11-05:** as
  ilustrações principal e de objetivos foram entregues e o espaço
  reservado da jornada foi removido, então a página inicial já não exibe
  nenhum rótulo de desenvolvimento.

**Files:**
- `components/public/*`, `components/journey/*`, `components/quiz/*`
- `components/ui/ImagePlaceholder.tsx`, `public/img/*`

**Test strategy:**
E2E de base (Task 45) sem regressão de comportamento; axe nas
combinações; comparação visual com os protótipos.

**Acceptance criteria:**
- [ ] Telas correspondem aos protótipos aprovados.
- [ ] Nenhuma regressão de comportamento nem de acessibilidade.

**Source:** `plano-evolucao-v2.md`, frente H (7.1); requisito R2

---

### Task 64
| Field | Value |
|---|---|
| **ID** | 64 |
| **Title** | Avaliação de IAs de geração de imagem para as ilustrações (personagem, quadrinho, mapa e ebook) |
| **Status** | `in-progress` |
| **Priority** | `high` |
| **Complexity** | 5 |
| **Dependencies** | `[]` |
| **Phase** | 10 — Evolução v2: diagnóstico e pesquisa |
| **Repositório** | ead-portal-educacional |

**Description:**
A avaliação visual das peças de teste da Task 44 (2026-11-04) mostrou que
o Claude Design, usado com HTML e SVG desenhado em código, produz uma
personagem consistente mas com acabamento "muito aquém do nível
profissional", e um mapa com layout limitado. Esta task avalia IAs de
geração de imagem para as ilustrações, mantendo o Claude Design para
layout, interação e composição.

**Details:**
- Executar a Parte 2 do plano de testes
  (`docs/plano-testes-claude-design.md`, seção 8): casos IM-01 a IM-10,
  com os mesmos prompts e a mesma rubrica para todas as ferramentas.
- **Decisão D7 (2026-11-04):** o **usuário gera as imagens manualmente**,
  na IA de imagem de sua preferência, e informa o diretório. Claude
  elabora os prompts (`docs/prompts-ilustracao.md`), recebe o diretório
  (`testes/imagens-ia/<ferramenta>/`) e avalia com a rubrica IM-01 a IM-10.
  Claude **não gera imagens** nem gasta créditos pagos.
- Protocolo em 3 etapas: ficha da personagem em 3 estilos (o usuário
  escolhe), 6 cenas da HQ e 7 elementos (4 do mapa, 3 do ebook): mínimo
  de 16 imagens.
- Regra de produção: arte **sem texto dentro da imagem**; texto, balões,
  legendas, ícones e diagramas sempre em HTML ou SVG vivo.
- O julgamento de "nível profissional" é do usuário.

**Files:**
- `docs/prompts-ilustracao.md` (prompts, novo)
- `testes/imagens-ia/registro-modelo.md` (modelo de registro, novo)
- `docs/plano-testes-claude-design.md` (resultados da seção 8)
- `testes/imagens-ia/<ferramenta>/` (imagens entregues pelo usuário, fora do portal)

**Test strategy:**
O próprio plano de testes (IM-01 a IM-10), com rubrica de 1 a 5 e
avaliadores humanos para IM-01 e IM-02.

**Acceptance criteria:**
- [ ] Pelo menos duas ferramentas comparadas com os mesmos prompts.
- [ ] Ferramenta escolhida, com justificativa, custo e direitos de uso
      registrados e aprovados pelo usuário.

**Andamento (2026-11-04):** os prompts estão prontos em
`docs/prompts-ilustracao.md` (16 imagens em 3 etapas) e o modelo de
registro em `testes/imagens-ia/registro-modelo.md`. Aguardando o usuário
gerar a **Etapa 1** (ficha da personagem em 3 estilos) e informar o
diretório.

**Source:** `plano-evolucao-v2.md`, seção 10.4; resultado dos casos
CD-04 e CD-05

---

## Resumo

### Tasks por fase
| Fase | IDs | Resumo de dependências |
|---|---|---|
| 0 — Setup | 1 | sem dependências |
| 1 — Domínio e conteúdo | 2, 3, 4 | 3 e 4 dependem de 2 |
| 2 — Fluxo do aluno | 5, 6, 7, 8 | 5 depende de 4; 6 depende de 1,4; 7 depende de 1; 8 depende de 3,5,6,7 |
| 3 — Avaliação | 9, 10, 11, 12, 13 | 10 depende de 2,9; 11 depende de 1,4; 12 depende de 3,5,9,10,11; 13 depende de 4,5,11,12 |
| 4 — Qualidade e deploy | 14, 15 | 14 depende de 13; 15 depende de 13,14 |
| 5 — Refinamento de UX | 16, 17 | 16 depende de 6; 17 depende de 8 |
| 6 — Acessibilidade estendida | 18, 19, 22, 23 | 18 depende de 6,9,11; 19 depende de 18; 22 depende de 18,19; 23 depende de 22 |
| 7 — Conteúdo pedagógico definitivo | 20, 21 | 20 depende de 9,10,12; 21 depende de 13,20 |
| 8 — Página inicial completa | 24, 25, 26, 27 | 24 depende de 16; 25 depende de 20,22; 26 depende de 20,21,25; 27 depende de 18,24,26 |
| 9 — Adequação a design instrucional (D2L) | 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38 | 28 depende de 27; 29 sem dependências; 30 depende de 29; 31 depende de 9,20; 32 depende de 9; 33 depende de 13,24; 34 depende de 28,29,30,31,32,33; 35 depende de 17 (bloqueio real: vídeo gravado); 36 depende de 29,30; 37 depende de 24; 38 depende de 13 |
| 10 — Evolução v2: diagnóstico e pesquisa | 39, 40, 41, 42, 43, 44, 45, 57, 58, 64 | 39, 40, 41, 43, 44, 45, 57, 58 e 64 sem dependências; 42 depende de 39,40 |
| 11 — Evolução v2: decisão | 46, 47, 59, 60 | 46 depende de 39–43; 47 depende de 46,31,32,33; 59 depende de 44,46,57; 60 depende de 59 |
| 12 — Evolução v2: produção de conteúdo | 48, 49, 50, 61 | 48 depende de 43,46,47; 49 depende de 44,48,58,59,64; 50 depende de 49; 61 depende de 50,58 |
| 13 — Evolução v2: implementação | 51, 52, 53, 54, 62, 63 | 51 depende de 45,46; 62 depende de 45,60; 63 depende de 62,64; 52 depende de 44,50,51,61,62; 53 depende de 46,51,63; 54 depende de 47,52 |
| 14 — Evolução v2: validação | 55, 56 | 55 depende de 52,53,54,62,63; 56 depende de 55 |

### Tasks por prioridade
| Prioridade | IDs |
|---|---|
| high | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 20, 29, 35, 39, 43, 44, 45, 46, 47, 48, 49, 51, 52, 55, 57, 58, 59, 60, 61, 62, 63, 64 |
| medium | 11, 14, 16, 17, 18, 19, 21, 22, 24, 25, 26, 30, 31, 33, 34, 36, 38, 40, 41, 42, 50, 53, 54 |
| low | 23, 27, 28, 32, 37, 56 |

### Pronto para iniciar (dependências concluídas), em 2026-11-04
- **Em andamento:** 41 (benchmark de concorrentes; matriz incompleta), 43 (engenharia reversa; falta evidência de quadrinho e ebook), 44 (testes do Claude Design), 57 (referências visuais; falta ver a aparência), 64 (avaliação de IAs de imagem).
- **Prontas, sem dependência pendente:** 31, 32, 33, 37, 38 (tasks da Fase 9); 58 (plataformas de ebook).
- **Dependência concluída, mas com decisão adiada (D5):** 30.
- **Bloqueada por dependência externa:** 35 (precisa do vídeo gravado).
- **Concluídas na Fase 9 e na evolução v2:** 28, 29, 39, 40, 42, 45.

### Estado consolidado (2026-11-05)

**64 tasks:** 33 `done` (1–29, 39, 40, 42, 45), 5 `in-progress` (41, 43, 44,
57, 64), 7 `pending` (30, 31, 32, 33, 37, 38, 58) e 19 `blocked`
(34, 35, 36, 46–56, 59–63).

**Decisões:** D0 (Design interno ao Claude), D1 (hub opcional), D2 (banco
híbrido), D3 (três mídias), D4 (plano de testes do Claude Design), D6
(ilustração não é layout) e D7 (o usuário gera as imagens) tomadas;
requisitos obrigatórios R1 (ebook) e R2 (redesign) registrados.
**Em aberto:** D5 (Tasks 30, 34 e 36, dependem do vídeo final), a
correção do roteiro (D-08 e D-09, Task 39) e os pontos de aprovação A
(direção de arte), B (protótipos) e C (plataforma do ebook).

**Implantação (atualizada em 2026-11-05):** a evolução v2 está na `main`,
por três Pull Requests mesclados com merge commit:

| PR | Conteúdo | Observação |
|---|---|---|
| #5 | Documentação da evolução v2 (plano, pesquisas, templates, decisões) | Mesclado na `main` |
| #6 | Correções de acessibilidade e infraestrutura de testes (Task 45) | Mesclado por engano na branch do PR #5 (`docs/evolucao-v2`), e não na `main`, porque o GitHub não troca a base do PR sozinho quando a branch de origem não é apagada |
| #7 | Leva à `main` o conteúdo do PR #6 | Mesclado; é o PR que corrige o desvio do #6 |

`main` local e remota no mesmo commit após o PR #7. Na `main`, `npm run lint`,
`npm test` (46 testes) e `node testes/consistencia/verificar-docs.js`
passam. Os testes de ponta a ponta e de acessibilidade (`npm run test:e2e`,
`npm run test:a11y`) passaram na branch antes do merge, sem mudança de código
depois. O deploy de produção na Vercel disparado pelo PR #7 ainda não foi
conferido.

**Ebook (2026-11-05):** o ebook de 18 páginas está **no portal**, na rota
pública `/ebook` (leitor incorporado, PDF para download e tela cheia), com
roteiro em `conteudo/ebook/`, leitor e PDF em `public/ebook/`. Verificado
por `npm run ebook:verificar` (sem estouro de conteúdo, sem violação de
axe-core em desktop, alto contraste e fonte ampliada, quatro interações,
celular e janela baixa). **Ainda não** está publicado em FlipHTML5 ou
Genially; as Tasks 48 a 50 (revisão por educadores), 52 (hub), 58 (escolha
da plataforma), 59 e 49 (redesenho via Claude Design) e 61 (publicação)
seguem como estavam.

**Mapa interativo (2026-11-05), segundo artefato:** está **no portal**, na
rota pública `/mapa`, como componente nativo (`components/materials/`), e
**e-book e mapa são os destaques da tela principal** (dois cartões) e
itens do menu superior das páginas públicas; a jornada também traz os dois
links. Verificado por testes de ponta a ponta (`tests/e2e/mapa.spec.ts`) e
pela matriz de axe-core em tema, contraste e fonte, inclusive com
elemento selecionado, percurso guiado e lista. **Faltam** as ilustrações
dos quatro nós (cada nó mostra um ícone), a revisão por educadores (Task
50), o redesenho (R2) e a reorganização no hub (Task 52).

**Quadrinho (2026-11-05), terceiro artefato:** está **no portal**, na rota
pública `/quadrinho`, como componente nativo (`components/materials/`), com
seis painéis, duas decisões (só se avança com a resposta certa) e uma visão
"Roteiro em texto" para leitor de tela. É item do menu superior das páginas
públicas, mas **não** tem cartão na tela principal, onde só e-book e mapa são
destaque. Verificado por testes de ponta a ponta
(`tests/e2e/quadrinho.spec.ts`) e pela matriz de axe-core em tema, contraste
e fonte, inclusive com a decisão errada, a certa e o roteiro em texto. As
cenas são as seis imagens de avaliação da Task 64, as mesmas do ebook.
**Faltam** a revisão por educadores (Task 50), cenas próprias e um episódio
2, e o redesenho (R2). Com os três artefatos, a reavaliação do fluxo
(UX-21) deixou de ser hipótese.

**Outras entregas de 2026-11-05:** ícone da aba do navegador próprio
(`app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`; `npm run icones`),
ilustração principal da página inicial (`public/img/hero.jpg`) e remoção
das marcas de "edição preliminar" do portal. **Achado:** o portal renderiza
Arial, e não a Geist declarada em `app/layout.tsx` (ver
`docs/guia-de-estilo.md`, seção 2).

**Pendência a analisar (2026-11-05): UX-20, espaço vertical do ebook no
portal.** A visualização em `/ebook` é ruim: o cabeçalho do portal, a linha
de título da página e, dentro do leitor, a barra superior e o rodapé de
navegação consomem altura, e a página precisa rolar. Medido na produção:
sobram 329 px de uma janela de 657 px (50%) em um notebook, 402 px de 730
(55%) e 641 px de 969 (66%) em desktop, e o leitor cai no modo fluido em
todos esses tamanhos. **Não há decisão tomada**: as direções (cabeçalhos
unificados, barra única, modo leitura, páginas em paisagem ou espelhadas)
estão em `docs/revisao-fluxo-ux.md` (UX-20) e se resolvem nas Tasks 52 e
63, conferindo também o FlipHTML5 (Task 58).

**Pendência a analisar (2026-11-05): UX-21, reavaliar o fluxo do usuário
com os novos artefatos.** A jornada foi desenhada como um percurso linear
(vídeo, avaliação, relatório) com materiais em um hub opcional (D1). Entraram
o e-book, o mapa e o quadrinho como rotas públicas separadas, fora da jornada (os
três materiais já estão no ar), e o percurso não diz quando cada uma serve. Fatos
do estado atual: a tela principal destaca os materiais porque o vídeo ainda
não existe; quem já tem progresso é redirecionado e nunca vê os cartões;
nada registra que um material foi visto nem o liga ao relatório; o menu
cresce a cada artefato. **Não há decisão tomada**: as perguntas (papel de
cada artefato no percurso, jornada linear ou trilha, descoberta por quem tem
progresso, hierarquia da tela principal, hub ou rotas separadas, registro de
material visto) estão em `docs/revisao-fluxo-ux.md` (UX-21) e devem ser
respondidas **antes do ADR da Task 46**, com protótipos e teste de
usabilidade (Task 55).

### Status atual (2026-10-18)
**Tasks 1–27 estão `done`.** MVP implementado, testado (build,
lint, testes end-to-end com Playwright, auditoria de acessibilidade com
axe-core: 0 violações em todas as combinações de tema/contraste/tamanho de
fonte × tela, incluindo os 3 níveis de feedback do quiz e o drawer de
acessibilidade aberto/fechado) e implantado em produção na Vercel:
https://ead-portal-educacional.vercel.app/ — os 10 critérios de aceite da
seção 8 do PRD foram verificados na URL pública. Tasks 16–23 (redesign da
tela inicial, skeleton de vídeo, tema light/dark, tamanho de fonte/alto
contraste, banco de questões definitivo com feedback pedagógico,
comentários por pergunta no relatório final, drawer de acessibilidade e
seu gatilho reposicionado como aba lateral fixa) foram adicionadas depois
do primeiro deploy, a partir de feedback do usuário nesta sessão.

**Tasks 24–27 (2026-10-18):** implementadas **diretamente no GitHub**,
fora desta sessão de trabalho — 4 PRs (#1 a #4, branch
`claude/course-portal-sections-lsqlok`) mesclados em `main` entre
2026-09-27 e a data desta revisão: seções completas de apresentação do
curso na página inicial (objetivos, público, pré-requisitos, resultados,
como funciona, formato, FAQ — Task 24); menu lateral de navegação livre
entre perguntas da avaliação, com ajuste de layout à altura do viewport
(Task 25); destaque da alternativa correta, toasts, tooltips, abas no
relatório final com desempenho por competência e estados de carregamento
(Task 26); paleta marinho/dourado/verde/branco, ícones `lucide-react` e
espaços reservados para ilustrações futuras (Task 27). Este
`task-master.md` e o `PRD.md` foram **atualizados nesta revisão
(2026-10-18)** para documentar esse trabalho — o código já estava
mesclado e implantado antes da revisão; o `git pull` trouxe 11 commits
que não existiam na sessão anterior.

**Tasks 28–38 (2026-10-18):** promovidas a partir de
`plano-adequacao-design-instrucional.md` — revisão do portal contra a
seção "7 Best Practices" do artigo da D2L sobre design instrucional. Das
7 práticas do artigo, o usuário aprovou 11 ações específicas (uma por
bullet de cada prática relevante). **Tasks 28 e 29 já estão `done`**
(28: guia de estilo, ver `docs/guia-de-estilo.md`; 29: capítulos do
roteiro v2 marcados em `roteiro_audiovisual_completo_v2.md`, seção
"Capítulos para o YouTube"); as demais (30–38) continuam
`pending`/`blocked`. Ordem de execução recomendada para o restante,
respeitando dependências:
1. **Sem bloqueio, podem começar já:** Task 31 (Questão 3 antes/depois),
   Task 32 (exercício prático opcional), Task 33 (canal de contato),
   Task 37 (avaliar flip card), Task 38 (link de feedback pós-curso).
2. **Dependência de Task formalmente satisfeita (Task 29 concluída),
   mas com decisão de arquitetura própria pendente de confirmação do
   usuário antes de iniciar:** Task 30 (dividir vídeo em partes) — muda
   o modelo de dados (`ModuleContent`/`UserProgress`) sem ainda existir
   vídeo real para validar a divisão; ver nota na própria Task 30.
3. **Depende das Tasks 29 (concluída) e 30:** Task 36 (transcrição por
   vídeo) — ainda bloqueada pela Task 30.
4. **Depende de 28 (concluída), 29 (concluída), 30, 31, 32 e 33 (nesta
   ordem):** Task 34 (revisão final de todas as perguntas) —
   deliberadamente a última do grupo, por pedido do usuário.
5. **Bloqueada por algo fora do task-master (gravação do vídeo real, não
   por outra task):** Task 35 (legendas em português) — fica registrada
   e só é retomada quando houver `youtubeVideoId` real.

**Não aprovado nesta rodada** (fica só registrado em
`plano-adequacao-design-instrucional.md`, sem task correspondente): um
guia de estilo cobrindo múltiplos módulos futuros, telemetria agregada
de erros por pergunta (exigiria introduzir server-side por decisão
arquitetural própria) e um ciclo formal de revisão periódica deste
documento.

**Evolução v2, promoção inicial (2026-11-04):** promovidas a partir de
`plano-evolucao-v2.md` (evolução do portal: coerência do banco de
questões, revisão do fluxo, benchmark e engenharia reversa de mídias,
materiais complementares e novas seções). Decisões tomadas: **D1** hub
opcional de materiais; **D2** banco híbrido (núcleo + variantes com
cenário novo); **D3** três mídias no primeiro ciclo (mapa, quadrinho,
ebook); **D4** plano de testes do Claude Design antes de fixar o formato
das peças (`docs/plano-testes-claude-design.md`, Task 44). **D5 em
aberto:** as Tasks 30, 34 e 36 permanecem inalteradas até existir o vídeo
final. A ordem e o caminho crítico foram revistos pelos requisitos R1 e
R2 (parágrafo seguinte). Achado: o projeto não tem
Playwright nem axe-core como dependências (a Task 45 cria a
infraestrutura).

**Requisitos obrigatórios R1 e R2 (2026-11-04):**
- **R1 — ebook:** visualmente atrativo, bem organizado e interativo, em
  linguagem clara para o público-alvo, com capa, sumário e capítulos
  estruturados, design profissional e **publicação obrigatória em
  FlipHTML5 ou Genially**. Tasks 43, 48, 49, 50, 52, 58 e 61.
- **R2 — redesign completo via Claude Design:** cores, fontes, formatos,
  navegações, incorporação de elementos externos, exibição e sobreposição
  de componentes, a partir das melhores referências do mercado. Tasks 57,
  59, 60, 62 e 63; Task 44 ampliada para 15 casos. Dois pontos de
  aprovação seus (A: direção de arte; B: protótipos) antes de qualquer
  código; um terceiro (C) escolhe a plataforma do ebook.
- **Efeito na ordem:** nenhuma peça nova é produzida antes do design
  system v2 (Task 59), e as Tasks 52 e 53 esperam o novo visual (Tasks 62
  e 63). Podem começar já: 39, 40, 41, 43, 44, 45, 57 e 58.

**Tasks 39 e 40 concluídas (2026-11-04):** `docs/matriz-rastreabilidade.md`
(10 divergências entre banco e roteiro; **a numeração das "lentes" se
contradiz entre os Blocos 4B e 5 e precisa ser corrigida antes de
gravar**) e `docs/revisao-fluxo-ux.md` (17 atritos; os mais graves são a
falta de volta ao vídeo e as respostas da avaliação que se perdem ao
recarregar). Task 42 desbloqueada. Os achados foram acrescentados ao
escopo das Tasks 47, 51, 53 e 54. O clone não tem `node_modules`: rodar
`npm install` é pré-requisito da Task 45.

**Resultado parcial da Task 44 e Task 64 (2026-11-04):** as peças de
teste foram avaliadas pelo usuário: a personagem da HQ é consistente, mas
o acabamento está "muito aquém do nível profissional"; o mapa navega por
teclado, mas o layout é limitado; o ebook não deve exibir todas as páginas
de uma vez. Conclusão: o Claude Design cuida de layout, interação e
composição (texto sempre em HTML), e as ilustrações passam a vir de uma IA
de imagem a avaliar na **Task 64** (nova; Tasks 49 e 63 dependem dela).
D6 confirmada (ilustração não é "layout" no sentido do R2). D7: o usuário
gera as imagens manualmente; Claude elabora os prompts
(`docs/prompts-ilustracao.md`) e avalia o diretório entregue.

Repositório no GitHub: https://github.com/caiocoisa/ead-portal-educacional
(privado).

Próximos passos ficam no backlog de extensão futura — PRD.md, seção 9
(CMS/área administrativa, múltiplos módulos, i18n, exportação do
relatório, acompanhamento de múltiplos alunos — item de tema light/dark
já implementado na Task 18, removido do backlog) — e nas Tasks 28–38
descritas acima. Além disso:
- Antes de ir ao ar, substituir `content/module.ts` → `youtubeVideoId`
  (hoje `null`, mostrando o skeleton da Task 17) pelo ID real do vídeo do
  módulo — usar **`roteiro_audiovisual_completo_v2.md`** para a gravação,
  já com os capítulos da Task 29 incorporados (revisão de 2026-09-27:
  adiciona o Bloco 4B, cobrindo a auditoria de viabilidade
  técnica/logística da Questão 3 de `banco-questoes.md`, que a v1 do
  roteiro não demonstrava; ver changelog no próprio arquivo). A v1
  (`roteiro_audiovisual_completo.md`) fica só como histórico. Ao publicar,
  não esquecer a Task 35 (legendas).
- Produzir as ilustrações reservadas pela Task 27
  (`components/ui/ImagePlaceholder.tsx`): resta a da **jornada**; o espaço
  reservado dela foi **removido** da página em 2026-11-05 (a seção "Como
  funciona" mostra só os três cartões) e será reincluído quando a imagem
  for gerada (prompt `P1-jornada.png`, `docs/prompts-ilustracao.md`).
  **Já entregues em 2026-11-05:** a ilustração principal
  (`public/img/hero.jpg`, 1456×720) e a dos objetivos
  (`public/img/objetivos.jpg`, 1456×720, proporção 2:1).
