# Revisão do fluxo de experiência do usuário

> Gerado em: 2026-11-04 · Task 40 (`task-master.md`)
> **Método:** leitura do código dos componentes da jornada e revisão
> heurística (Nielsen). **Não executei a aplicação:** este clone não tem
> `node_modules` e a revisão não incluiu navegador. Toda afirmação sobre
> comportamento vem do código, com arquivo e linha. O que depende de ver
> o produto rodando está marcado como *a verificar* e vai para a Task 55
> (teste de usabilidade com pessoas).
> **Escala de severidade (Nielsen):** 1 cosmético · 2 menor · 3 grave ·
> 4 catastrófico.

---

## 1. Resumo

**O fluxo funciona de ponta a ponta, mas trata o aluno como um
percurso de via única: erra e não consegue voltar, perde respostas se
recarregar, e só rever o conteúdo exige apagar o progresso.** São 21
atritos, dos quais 3 são de severidade 4. (UX-18 e UX-19 foram acrescentados
em 2026-11-05, descobertos pelos testes E2E da Task 45. **UX-15, UX-18 e
UX-19 foram resolvidos no mesmo dia**, removendo o toast de confirmação.
UX-20, sobre o espaço vertical do e-book no portal, foi apontado pelo
usuário no mesmo dia e está **aberto, para análise**. UX-21, a necessidade
de **reavaliar o fluxo do usuário** com a chegada do e-book, do mapa e do quadrinho,
também foi apontada pelo usuário e está aberta.)

| Severidade | Atritos |
|---|---|
| **4** | UX-01 (sem volta ao vídeo), UX-04 (respostas só em memória), UX-13 (o vídeo ainda não existe) |
| **3** | UX-02, UX-03, UX-05, UX-06, UX-07, UX-09, UX-11, UX-18, UX-20, UX-21 |
| **2** | UX-08, UX-10, UX-12, UX-16, UX-17, UX-19 |
| **1** | UX-14, UX-15 |

---

## 2. O percurso, passo a passo

| # | Etapa | O que o aluno vê e o que o código faz | Atritos |
|---|---|---|---|
| 1 | **Home** (`/`) | Hero com nome, chips, ilustração reservada e formulário; abaixo, objetivos, público, FAQ. Quem **já tem progresso** é redirecionado (`WelcomeHero.tsx:40-48`) | UX-09, UX-17 |
| 2 | **Nome** | Campo único; cria `UserProgress` e vai a `/video` | |
| 3 | **Vídeo** (`/video`) | Skeleton (sem `youtubeVideoId`) ou player com **Play/Pause**; botão "Concluir"; ao chegar a 90% avança sozinho | UX-02, UX-03, UX-11, UX-12, UX-13 |
| 4 | **Avaliação** (`/avaliacao`) | Menu lateral, uma pergunta por vez, "Confirmar resposta", feedback no alerta (região `status`), navegação livre | UX-01, UX-04, UX-14, UX-15, UX-16, UX-18, UX-19 |
| 5 | **Relatório** (`/relatorio`) | Abas Resumo e Gabarito; botão "Reiniciar jornada" | UX-05, UX-06, UX-07, UX-08 |
| 6 | **Reinício / Início** | "Reiniciar jornada" volta ao vídeo e apaga o resultado; "Início" apaga **tudo** (nome e progresso) | UX-05, UX-09, UX-10 |

> **Desatualizado em relação aos materiais (2026-11-05, UX-21).** O percurso
> acima não inclui as rotas públicas `/ebook` e `/mapa`, que ficam **fora da
> jornada** e hoje são os destaques da tela principal e itens do menu
> superior (o quadrinho é a terceira). A reavaliação do fluxo com esses
> artefatos está aberta e descrita em UX-21.

---

## 3. Catálogo de atritos

| ID | Atrito | Onde | Heurística | Sev. | Proposta | Task |
|---|---|---|---|---|---|---|
| **UX-01** | **Não há caminho de volta ao vídeo.** O guard redireciona se `currentStep` ≠ etapa da página; os feedbacks mandam "revisar", mas o único meio é reiniciar a jornada, que apaga o resultado | `useJourneyGuard.ts:38`; `resetJourney` em `LocalStorageUserProgressRepository.ts:74-85` | Controle e liberdade do usuário | **4** | Permitir rever qualquer etapa já liberada; botão "Rever vídeo" na avaliação e no relatório | 53, 51 |
| **UX-02** | **"Concluir" anula o bloqueio.** O cartão diz "assista ao vídeo até o final para liberar a avaliação", mas o botão avança com um clique | `ModuleVideoStep.tsx:41,57` | Prevenção de erros; correspondência com o mundo real | 3 | Rótulo honesto ("Já assisti, ir para a avaliação") e/ou condicionar a um mínimo assistido; documentar que o bloqueio é reforço de UX (PRD 3.2.1) | 53 |
| **UX-03** | **O avanço automático a 90% corta a síntese.** 90% de 30:00 é **27:00**, dentro do Bloco 5 (26:30–30:00): o aluno é levado à avaliação antes do resumo das lentes e do aviso "acesse a avaliação" (29:15). *Vale se a duração final for ~30 min* | `ModuleVideoStep.tsx:17,30-34`; roteiro B5 | Controle e liberdade | 3 | Marcar como assistido a 90% **sem navegar**; ao terminar o vídeo, mostrar cartão de transição com escolha | 53 |
| **UX-04** | **As respostas ficam só na memória.** `answers` e `drafts` são `useState`; o resultado só é salvo ao final (`saveAssessmentResult`). Recarregar, fechar a aba ou um erro perde tudo. A FAQ promete "pausar e retomar de onde parou" | `ModuleAssessmentStep.tsx:19-22,60-65`; `landing.ts:112-119` | Visibilidade do estado; prevenção de erros | **4** | Persistir cada resposta confirmada no `UserProgress` v2 e retomar de onde parou | 51, 53 |
| **UX-05** | **Sem segunda tentativa.** A resposta confirmada é bloqueada; para refazer a avaliação é preciso "Reiniciar jornada", que zera o vídeo (`videoCompleted: false`) e exige passar de novo pela etapa 3 | `ModuleAssessmentStep.tsx` (bloqueio); `RestartJourneyModal.tsx:12-15`; `LocalStorageUserProgressRepository.ts:74-85` | Controle e liberdade | 3 | "Refazer as erradas" e reinício parcial só da avaliação, sem tocar no vídeo (D2) | 54, 47 |
| **UX-06** | **O relatório diagnostica, mas não prescreve.** "Vale revisar" não diz onde revisar | `FinalReport.tsx:66-83` | Ajudar a reconhecer, diagnosticar e recuperar-se de erros | 3 | Remediação dirigida: cada "Vale revisar" leva ao capítulo do vídeo e ao material (D1) | 54 |
| **UX-07** | **O gabarito não mostra a pergunta.** Cada item do acordeão tem "Pergunta N", um chip e o feedback; falta o enunciado, a alternativa escolhida e a correta | `FinalReport.tsx:86-118` | Reconhecimento em vez de memorização | 3 | Mostrar enunciado, resposta do aluno, resposta correta e feedback; usar o `topic` no título | 54, 63 |
| **UX-08** | **A competência é uma barra 0% ou 100%** porque cada uma tem uma só pergunta | `FinalReport.tsx:69` | Correspondência com o mundo real | 2 | 2–3 itens por competência e escala graduada | 47, 54 |
| **UX-09** | **"Início" apaga todo o progresso, e a home some para quem tem progresso.** O botão tem nome de navegação, mas executa `clearAll()` (apenas confirmação e tooltip avisam). Como `WelcomeHero` redireciona quem já tem progresso, **objetivos e FAQ só são alcançáveis apagando o progresso** | `HomeResetButton.tsx:12-15,30`; `WelcomeHero.tsx:40-48` | Consistência e padrões; prevenção de erros | 3 | "Início" só navega (a home mostra "Continuar de onde parou"); apagar dados vira ação separada ("Apagar meus dados") | 53, 63 |
| **UX-10** | **Dois botões destrutivos de escopos parecidos:** "Início" apaga nome e progresso; "Reiniciar jornada" apaga o resultado e mantém o nome | `HomeResetButton.tsx`; `RestartJourneyModal.tsx` | Consistência e padrões | 2 | Resolver junto com UX-09 e UX-05 | 53 |
| **UX-11** | **O player só tem Play e Pause.** O YouTube é criado com `controls: 0`; não há barra de progresso, avanço, velocidade, tela cheia nem botão de legendas. Os **capítulos** (Task 29) e as **legendas** (Task 35) dependem de controles. *A confirmar com o vídeo real* | `VideoPlayer.tsx:49,104-111` | Flexibilidade e eficiência; controle | 3 | Reativar os controles nativos ou criar controles próprios e acessíveis (voltar 10 s, velocidade, legendas, capítulos clicáveis) | 53, 29, 35 |
| **UX-12** | **A retomada do vídeo não está ligada.** O player aceita `initialTime`, mas `ModuleVideoStep` não o informa e o `UserProgress` não guarda a posição (previsto no PRD 3.2.1) | `VideoPlayer.tsx:15,56-58`; `ModuleVideoStep.tsx:48-52`; `types/progress.ts` | Visibilidade do estado | 2 | Salvar `currentTime` no `UserProgress` v2 e retomar | 51, 53 |
| **UX-13** | **A primeira etapa ainda é um skeleton.** `youtubeVideoId: null`; hoje o aluno só avança pelo "Concluir". Não é falha de código, é dependência do vídeo gravado | `content/module.ts:20`; `VideoSkeleton` | | **4** | Fora do código; registrar como bloqueio de lançamento | |
| **UX-14** | **A "simulação de chat" existe e não é usada.** O componente e o tipo estão prontos, mas as 4 questões são `type: "text"` | `module.ts:27,51,75,99`; `components/quiz/ChatSimulationBubbles.tsx` | | 1 | Usar nas variantes do banco v2 e na reformulação da Questão 3 | 47, 31 |
| **UX-15** | **Feedback em duplicidade:** toast e alerta inline dizem a mesma coisa; leitores de tela podem ler duas vezes. *A verificar* | `ModuleAssessmentStep.tsx:55-57`; `AnswerFeedback.tsx` | Design minimalista | 1 | **Resolvido em 2026-11-05:** o toast foi removido; o alerta, em região `status`, é o único retorno | 55, 63 |
| **UX-16** | **Layout de altura fixa com rolagem interna** (`h-dvh overflow-hidden`): com fonte extra grande e telas baixas, a rolagem aninhada pode confundir. *A verificar em navegador* | `JourneyLayout.tsx:20-33` | Flexibilidade e eficiência | 2 | Testar nos três tamanhos de fonte e em celular | 55, 63 |
| **UX-17** | **A FAQ não diz quanto tempo leva.** "Você segue no seu ritmo" não informa a duração prevista (o roteiro tem 30 min de vídeo) | `landing.ts:112-115` | Visibilidade do estado | 2 | Informar a duração estimada de cada etapa na home e no cabeçalho | 63 |
| **UX-18** | **O toast de confirmação cobre o botão de avançar.** Depois da animação de entrada, o toast (posição "bottom end") fica sobre o **centro** de "Próxima pergunta" e de "Ver relatório final", em todas as perguntas. Como o React Aria **pausa o fechamento automático enquanto o ponteiro está sobre o toast**, quem mantém o mouse perto do botão fica com ele coberto até fechar o toast à mão. Medido com `elementFromPoint` e reproduzido no E2E (a ação travou por 90 s) | `app/layout.tsx:31` (`placement="bottom end"`); `ModuleAssessmentStep.tsx:55-57` | Prevenção de erros; controle e liberdade | 3 | **Resolvido em 2026-11-05:** o toast foi removido (o alerta na tela, em região `status`, mostra o resultado); testes em `tests/e2e/jornada.spec.ts` | 53, 63 |
| **UX-19** | **O botão de fechar do toast está em inglês** ("Close") numa interface em português | nome acessível do botão, visto no E2E | Correspondência com o mundo real | 2 | **Resolvido em 2026-11-05:** deixou de existir com a remoção do toast | 63 |
| **UX-20** | **O e-book tem pouco espaço vertical no portal e obriga a rolar.** Três faixas somam altura antes da página: o **cabeçalho do portal** (76 px), a **linha de título e ações** da página `/ebook` (48 px, mais ~44 px de margens) e, dentro do leitor, a **barra superior** (64 px) e o **rodapé de navegação** (94 px). Medido na produção em 2026-11-05, na abertura do capítulo 1: janela 1366×657 → **329 px** (50%) para a página; 1536×730 → 402 px (55%); 1920×969 → 641 px (66%). Como a página (retrato 3:4, 720×960) não cabe, o leitor cai no **modo fluido** em **todos** esses tamanhos (inclusive 1920×969) e a página de ~917 px rola dentro do `iframe`, que já está dentro de uma página com rolagem própria. *Apontado pelo usuário* | `app/ebook/page.tsx` (linha de título e `iframe`); `components/public/PortalHeader.tsx`; `public/ebook/leitor.html` (`.topbar`, `.nav` e o limiar de 72% de escala em `fit()`) | Design estético e minimalista; flexibilidade e eficiência | 3 | **A analisar, sem decisão.** Direções: (a) unificar os dois cabeçalhos na rota `/ebook` (título e ações no cabeçalho do portal, ou cabeçalho compacto); (b) fundir a barra superior e o rodapé do leitor em uma barra fina, ou levar "Anterior" e "Próxima" para as bordas da página; (c) rever o limiar do modo fluido; (d) um **modo leitura** dentro do portal (cabeçalhos ocultos, em um clique), já que "Abrir em tela cheia" hoje abre outra aba; (e) formato **paisagem ou páginas espelhadas** para telas largas, porque o retrato 3:4 é desfavorável em monitores horizontais (a raiz do problema, e o que os leitores de flipbook fazem); (f) conferir o mesmo ponto no FlipHTML5 antes de decidir (Task 58) | 52, 63, 58, 55 |
| **UX-21** | **O fluxo do usuário precisa ser reavaliado com os novos artefatos.** O fluxo foi desenhado para uma jornada linear (vídeo, avaliação, relatório) com materiais em um hub opcional (D1). Na prática, entraram rotas públicas separadas (`/ebook`, `/mapa` e `/quadrinho`), **fora da jornada**, e o percurso não diz quando cada uma serve. Fatos do estado atual: (1) a tela principal destaca os dois materiais e deixa o formulário da jornada em segundo plano, o que hoje se explica porque **o vídeo ainda não existe** (UX-13); (2) quem **já tem progresso** é redirecionado de `/` para a sua etapa e **nunca vê** os cartões, então só descobre os materiais pelos links "E-book" e "Mapa" do cabeçalho da jornada; (3) os materiais **não deixam registro** (nada marca "visto") e **não se ligam ao resultado**: o relatório não indica qual material revisar (UX-06); (4) o menu superior cresce a cada artefato e o "Voltar ao curso" leva a `/`, que redireciona para a etapa atual, o que é ambíguo para quem ainda não começou; (5) o hub `/materiais` da Task 52 e o fluxo-alvo da seção 4 foram pensados antes de existirem as rotas separadas. *Apontado pelo usuário* | `components/public/WelcomeHero.tsx` (cartões e redirecionamento); `components/public/PortalHeader.tsx` (menu); `components/journey/JourneyLayout.tsx` (links da jornada); seção 4 deste documento | Consistência e padrões; visibilidade do estado; correspondência com o mundo real | 3 | **A analisar, sem decisão.** Perguntas: (a) qual o **papel de cada artefato no percurso**: antes do vídeo, depois, só remediação ou livre, e existe ordem sugerida? (b) a jornada continua **linear** ou vira uma **trilha** com materiais opcionais ou recomendados? (c) como quem **já tem progresso** encontra os materiais? (d) a **hierarquia da tela principal**: materiais ou jornada em primeiro plano, e como muda quando o vídeo existir? (e) **hub `/materiais`** ou rotas separadas, e como o menu escala com três ou mais artefatos? (f) o que o portal **registra** de cada material e como o relatório aponta para ele (Tasks 51 e 54)? Sugestão de método: protótipos de 2 ou 3 modelos de jornada, comparados em teste de usabilidade com 3 a 5 pessoas (Task 55), **antes** do ADR da Task 46 | 46, 52, 53, 51, 54, 63, 55 |

**O que está bem resolvido** (para não mexer sem necessidade): indicador
de progresso acessível (`ProgressIndicator.tsx`), menu de perguntas com
estado e navegação livre (botões reais, `aria-current` e rótulos de
estado em `QuestionNavigator.tsx`), confirmação antes de ações destrutivas,
carregamento sem tela em branco e preferências de acessibilidade
independentes do progresso.

---

## 4. Fluxo-alvo (consistente com D1: hub opcional)

Protótipo de baixa fidelidade. As mudanças em relação ao fluxo atual
estão marcadas com ➕.

> **A rever (UX-21, 2026-11-05).** Este fluxo-alvo assume um **hub
> opcional** (D1) e foi desenhado antes de existirem o e-book, o mapa e o
> quadrinho como rotas públicas separadas. Ele deve ser refeito junto com a
> reavaliação do fluxo, antes do ADR da Task 46.

```text
[Home] ── (já tem progresso?) ── ➕ mostra "Continuar de onde parou"
   │                                  e mantém objetivos e FAQ acessíveis
   ▼ nome
[Vídeo] ➕ controles + capítulos + legendas ; ➕ retoma a posição
   │  (fim do vídeo)
   ▼
➕ [Cartão de transição]  "Você concluiu o vídeo."
        ├── [Ver materiais complementares] → [Hub /materiais] (opcional)
        └── [Ir para a avaliação]
   ▼
[Avaliação] ➕ respostas salvas a cada confirmação
        ➕ "Rever vídeo" sempre disponível
        ➕ feedback "distante" cita capítulo e minutagem
   ▼
[Relatório]
        ├── Resumo: ➕ 2–3 itens por competência
        ├── Gabarito: ➕ enunciado, sua resposta, correta, feedback
        ├── ➕ "Recomendado para você" (materiais por competência)
        ├── ➕ [Refazer as erradas]
        └── [Reiniciar jornada]  (mantém o nome)

Cabeçalho (todas as etapas após o nome):
  [Início] navega sem apagar · ➕ [Materiais] · [Acessibilidade]
  ➕ [Apagar meus dados]  (ação separada e destrutiva)
```

**Regras do fluxo-alvo**
1. Nenhuma ação destrutiva com nome de navegação.
2. Toda etapa liberada pode ser revisitada; só o **avanço** exige o
   cumprimento da anterior.
3. Nada digitado ou escolhido pelo aluno vive só na memória.
4. Todo diagnóstico ("Vale revisar") vem com um caminho de recuperação.
5. Materiais complementares nunca bloqueiam o avanço (D1).

---

## 5. Onde cada atrito será tratado

| Task | Atritos |
|---|---|
| **51** `UserProgress` v2 | UX-01 (base), UX-04, UX-12 |
| **53** Ajustes de fluxo | UX-01, UX-02, UX-03, UX-04, UX-09, UX-10, UX-11, UX-12 |
| **54** Remediação dirigida | UX-05, UX-06, UX-07, UX-08 |
| **47** Banco v2 | UX-05, UX-08, UX-14 |
| **63** Novo visual | UX-07, UX-09, UX-16, UX-17, UX-20 |
| **52** Hub e leitores | UX-20 (o leitor do e-book muda de lugar no hub) |
| **58** Plataformas de e-book | UX-20 (conferir o espaço vertical no FlipHTML5) |
| **55** Usabilidade | UX-16, UX-20, UX-21 e a confirmação de UX-03 e UX-11 |
| **46** ADR do modelo de jornada | UX-21 (reavaliar D1 e o fluxo-alvo antes de registrar o ADR) |
| **29 / 35** | UX-11 (capítulos e legendas dependem de controles) |

> **Sugestão de ajuste de escopo:** a Task 53 hoje cobre "rever o vídeo,
> Concluir e cartão de transição". Esta revisão acrescenta **persistir
> as respostas** (UX-04), os **controles do player** (UX-11) e a
> separação de **Início × apagar dados** (UX-09). Todos têm severidade
> 3 ou 4.

---

## 6. Limites desta revisão

- **Não houve execução da aplicação nem teste com pessoas.** Os itens
  marcados *a verificar* e a severidade atribuída pelo uso real ficam
  para a Task 55.
- A severidade é estimativa minha pela escala de Nielsen, não medida.
- UX-13 é uma dependência do vídeo gravado, não uma falha do portal.

---

## 7. Decisões do usuário sobre o modelo de jornada (2026-11-05)

Respostas às seis perguntas do UX-21. Estão **decididas e registradas, mas
não implementadas**. O fluxo-alvo da seção 4 fica superado por elas.

| # | Pergunta | Decisão |
|---|---|---|
| 1 | Papel dos artefatos e ordem | Ordem **sugerida**: vídeo, e-book, mapa, avaliação, relatório, com elementos visuais que a sugiram |
| 2 | Linear ou trilha | A ordem é **sugestão, não regra**: o aluno pode estar no mapa e voltar ao vídeo, o que deve ser permitido |
| 3 | Quem já tem progresso | O progresso é **visível e identificável desde a primeira tela**, com elementos de navegação para seguir a trilha ou navegar de forma não linear |
| 4 | Tela principal | **Todos os artefatos acessíveis na primeira tela**; o campo de nome para iniciar é **removido** |
| 5 | Hub ou rotas | **Cada item tem a sua rota**; cabeçalho e menu superior serão repensados (menos altura vertical e **sem menus colapsados**) |
| 6 | Registro | Nova forma de registrar **passos realizados** e **materiais vistos com porcentagem**; nos comentários do relatório, os materiais podem ser **referenciados diretamente** |

**Consequências identificadas na análise:**

- O **guarda de etapas** (`useJourneyGuard`) deixa de existir: ele hoje redireciona para a única etapa corrente, o oposto da decisão 2. Mudam de natureza UX-01, UX-02, UX-03, UX-09, UX-10 e UX-12.
- O **`UserProgress` v2** (Task 51) deixa de ser "uma etapa corrente" e passa a registrar o estado de **cada item** e o percentual visto de cada material. O modelo atual (`currentStep`, `videoCompleted`, `userName` obrigatório) não comporta isso e precisa de migração.
- A **D1 (hub opcional) fica superada** pela tela principal com a trilha; a **Task 52** muda de escopo (sem hub `/materiais`).
- O campo de nome sai da entrada: `userName` hoje é obrigatório em `create(userName)` e aparece no cabeçalho ("Olá, ...").
- O **cabeçalho e a navegação** são escopo do R2 ("navegações" estão na lista do redesenho via Claude Design), o que cruza as Tasks 59, 60 e 62.
- O achado do **progresso salvo sem validade** (a tela principal redireciona quem tem progresso e some com os cartões) **deixa de existir** com a decisão 3: a tela principal passa a ser sempre exibida.

**Dúvidas que surgiram e como o usuário as decidiu** (2026-11-05, em resposta à análise iterada até convergir):

| # | Dúvida | Decisão |
|---|---|---|
| 1 | Onde entra o quadrinho na trilha | **Fica de fora por enquanto**: fora da trilha e do cálculo de progresso |
| 2 | O que conta como "visto" e quando um item vale como concluído | **Sugestão aceita**: unidades distintas visitadas (e-book: páginas de 18; mapa: elementos de 4; avaliação: perguntas respondidas; vídeo: percentual assistido) e concluído a partir de 80% |
| 3 | Cabeçalho e navegação sem menu colapsado, e onde mora o progresso | **Sugestão aceita**: barra fina no topo em telas grandes, com a trilha e o estado de cada item; no celular, barra fixa inferior |
| 4 | Nome do aluno | **Nenhum nome**; só será pedido se houver certificado |
| 5 | Vídeo ainda inexistente | **Sem vídeo no momento**: fica fora da trilha e do progresso |
| 6 | Prototipar antes de codar | **Sim**: gerar prompts otimizados e usar o Claude Design para os protótipos |

**Suposições minhas sobre essas respostas, a confirmar com o usuário:**

- O quadrinho segue existindo como rota pública, mas **sem link na navegação principal** enquanto estiver fora da trilha.
- O vídeo **não aparece nem como "em breve"** nos protótipos, para não prometer o que não existe. A trilha atual tem quatro itens: e-book, mapa, avaliação e relatório.
- O progresso geral é a média simples dos quatro itens (por exemplo, e-book 100%, mapa 50%, os demais 0% dão 38%).

**Protótipos feitos:** seis telas no Claude Design, com cópia estática em `testes/claude-design/prototipos-fluxo/index.html` (primeira tela de visitante novo e de quem já avançou, estudo de duas variantes de cabeçalho em três estados, página do mapa, relatório com "Seu percurso" e primeira tela no celular). Os prompts e os critérios de avaliação estão em `docs/prompts-claude-design-fluxo.md`. A escolha entre as variantes A (56 px) e B (44 px com faixa de progresso) está **pendente**.

**Assumidos, salvo objeção:** avaliação e relatório também são livres (o relatório sem resultado mostra um estado vazio com chamada para a avaliação); o indicador de progresso aparece em todas as páginas; "Continuar de onde parou" substitui "Iniciar minha jornada"; "Apagar meu progresso" fica na primeira tela, com confirmação; o relatório ganha um bloco "Seu percurso"; as perguntas do relatório apontam para materiais com links profundos (capítulo do e-book, elemento do mapa, painel do quadrinho); o leitor do e-book, por ser da mesma origem, registra o progresso no armazenamento local do navegador.
