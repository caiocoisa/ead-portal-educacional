# Task Master — Portal de Conteúdo Educativo (MVP)

> Gerado em: 2026-09-27
> Baseado em: `PRD.md` (raiz do repositório, versão MVP de escopo reduzido)
> Total de tasks: 15

## Visão geral

Portal web em Next.js (App Router) na Vercel, com biblioteca de componentes
NextUI/HeroUI e persistência local (`localStorage`) isolada em um
repositório de serviço. Escopo reduzido ao **core**: o aluno informa o
nome, assiste a **um único vídeo** (YouTube), responde a uma avaliação e
recebe um **relatório final**, podendo reiniciar a jornada. Conteúdo
(vídeo + quiz) é definido em um arquivo de seed no código — **sem** área
administrativa, sem múltiplos módulos, sem i18n e sem alternância de tema
nesta v1 (ver PRD seção 9 para o backlog futuro).

O repositório está vazio (nenhum código implementado) — todas as tasks
partem do zero.

**Fora de escopo (não gerar tasks):** área administrativa, múltiplos
módulos em sequência, i18n, alternância de tema, exportação/certificação
do relatório, acompanhamento de múltiplos alunos (PRD seção 9).

---

## Infraestrutura existente (já implementada) ✅

Nenhuma. O diretório do projeto contém apenas `PRD.md` e este
`task-master.md`; não há `package.json`, código-fonte ou configuração
prévia. Todas as 15 tasks abaixo partem de um repositório vazio.

---

## Regras de execução

- Uma task só pode começar quando TODAS as suas `dependencies` estiverem `done`.
- Tasks com `dependencies: []` podem começar imediatamente.
- Status possíveis: `pending` | `in-progress` | `done` | `blocked` | `deferred`.
- Atribuição inicial: `dependencies == []` → `pending`; caso contrário → `blocked`.
- Todas as tasks pertencem ao único repositório do projeto:
  `ead-portal-educacional` (`/home/caio-silva/repos/ead-portal-educacional`).

---

## Tasks

### Task 1
| Field | Value |
|---|---|
| **ID** | 1 |
| **Title** | Inicializar projeto Next.js (App Router) + TypeScript + Tailwind + NextUI + config Vercel |
| **Status** | `pending` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
| **Status** | `blocked` |
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
- [ ] Todos os 10 critérios de aceite da seção 8 verificados e satisfeitos
      em produção.
- [ ] URL de produção na Vercel funcional e compartilhável.

**Source:** PRD seção 8 (Critérios de aceite)

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

### Tasks por prioridade
| Prioridade | IDs |
|---|---|
| high | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15 |
| medium | 11, 14 |
| low | — |

### Pronto para iniciar (dependências vazias)
- Task 1: Inicializar projeto Next.js (App Router) + TypeScript + Tailwind + NextUI + config Vercel
