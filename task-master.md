# Task Master — Portal de Planejamento Pedagógico para EaD com Apoio de IA (MVP)

> Gerado em: 2026-09-27 · Revisado em: 2026-10-18
> Baseado em: `PRD.md` (raiz do repositório, versão MVP de escopo reduzido)
> Total de tasks: 27 (15 do MVP + 12 de refinamento pós-deploy)

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

### Tasks por prioridade
| Prioridade | IDs |
|---|---|
| high | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 20 |
| medium | 11, 14, 16, 17, 18, 19, 21, 22, 24, 25, 26 |
| low | 23, 27 |

### Pronto para iniciar (dependências vazias)
- Task 1: Inicializar projeto Next.js (App Router) + TypeScript + Tailwind + NextUI + config Vercel — `done`

### Status atual (2026-10-18)
**Todas as 27 tasks estão `done`.** MVP implementado, testado (build,
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

Repositório no GitHub: https://github.com/caiocoisa/ead-portal-educacional
(privado).

Próximos passos ficam no backlog de extensão futura — PRD.md, seção 9
(CMS/área administrativa, múltiplos módulos, i18n, exportação do
relatório, acompanhamento de múltiplos alunos — item de tema light/dark
já implementado na Task 18, removido do backlog). Além disso:
- Antes de ir ao ar, substituir `content/module.ts` → `youtubeVideoId`
  (hoje `null`, mostrando o skeleton da Task 17) pelo ID real do vídeo do
  módulo — usar **`roteiro_audiovisual_completo_v2.md`** para a gravação
  (revisão de 2026-09-27: adiciona o Bloco 4B, cobrindo a auditoria de
  viabilidade técnica/logística da Questão 3 de `banco-questoes.md`, que a
  v1 do roteiro não demonstrava; ver changelog no próprio arquivo). A v1
  (`roteiro_audiovisual_completo.md`) fica só como histórico.
- Produzir as ilustrações reservadas pela Task 27
  (`components/ui/ImagePlaceholder.tsx`): `public/img/hero.svg` (560×280),
  `public/img/objetivos.svg` (480×360) e `public/img/jornada.svg`
  (480×360) — até lá, a página inicial mostra o espaço reservado com
  rótulo/dica em vez da imagem final.
