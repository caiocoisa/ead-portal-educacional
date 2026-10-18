# Plano de Adequação ao Design Instrucional

> Gerado em: 2026-10-18
> Baseado em: "The Ultimate Guide to Instructional Design" (D2L) —
> seção "7 Best Practices for Developing an Instructional Design
> Strategy": <https://www.d2l.com/blog/the-ultimate-guide-to-instructional-design/#h-7-best-practices-for-developing-an-instructional-design-strategy-nbsp>
> Revisa o estado atual do portal (PRD.md + task-master.md, Tasks 1–27) à
> luz de cada uma das 7 práticas do artigo.

Este documento **não implementa nada por si só** — é um plano de revisão.
Cada seção abaixo mapeia uma prática do artigo ao estado atual do portal,
lista as lacunas encontradas e propõe ações, priorizadas em P0 (bloqueante
para o próximo deploy de conteúdo pedagógico), P1 (relevante, mas não
bloqueante) e P2 (nice-to-have/backlog).

> **Atualização (2026-10-18) — decisão do usuário:** das ações propostas
> abaixo, **11 foram aprovadas** e promovidas para `task-master.md` como
> Tasks 28–38 (ver tabela de mapeamento logo abaixo e a seção "Próximos
> passos" ao final, que substitui a versão original desta seção). As
> ações não listadas na tabela (ex. telemetria agregada, ciclo de revisão
> periódica deste documento) **não foram aprovadas nesta rodada** e
> continuam só como registro histórico neste arquivo — não têm task
> correspondente.

### Mapeamento: seção do plano → Task aprovada

| Prática | Ação aprovada | Task |
|---|---|---|
| 1 — Consistency Is Key | Guia de estilo curto documentado | **Task 28** |
| 2 — Immersive Multimedia | Segmentar o roteiro v2 em capítulos | **Task 29** |
| 2 — Immersive Multimedia | Dividir o vídeo em vários vídeos curtos | **Task 30** |
| 2 — Immersive Multimedia | Reformular a Questão 3 | **Task 31** |
| 2 — Immersive Multimedia | Exercício prático opcional | **Task 32** |
| 3 — Opportunities for Connection | Canal de contato assíncrono | **Task 33** |
| 4 — Make Content Digestible | Revisar todas as perguntas (após 1, 2 e 3) | **Task 34** |
| 5 — Make It Accessible | Legendas em português (bloqueada até vídeo real) | **Task 35** |
| 5 — Make It Accessible | Transcrição completa em seção expansível | **Task 36** |
| 6 — Engage the Learner's Senses | Avaliar um flip card | **Task 37** |
| 7 — Iteration and Reiteration | Feedback pós-curso | **Task 38** |

---

## As 7 práticas (resumo do artigo)

1. **Consistency Is Key** — guia de estilo (paleta, ícones, fontes),
   hierarquia de informação, consistência entre cursos relacionados.
2. **Create an Immersive Multimedia Experience** — ir além de texto:
   vídeo, fóruns, jogos, microlearning, cenários ramificados
   (*branching scenarios*).
3. **Provide Opportunities for Connection** — interação
   aluno-aluno/aluno-instrutor (grupos, breakout rooms, fóruns de
   discussão) e informação de contato clara em ambientes assíncronos.
4. **Make Course Content Digestible** — "chunking" visual, subtítulos,
   bullet points, abordagem de *scaffolding* (do básico ao complexo),
   nada de parede de texto nem vídeo único e longo sem pausas.
5. **Make It Accessible** — linguagem clara, alt-text de imagens, cores
   acessíveis, design para público amplo.
6. **Engage the Learner's Senses** — atividades "mão na massa", múltiplos
   formatos de entrega, recursos como *accordions*, *tabs*, *flip cards*.
7. **Iteration and Reiteration** — nenhum curso acerta de primeira;
   coletar feedback de alunos/instituição e reavaliar continuamente (o
   artigo cita o modelo de Kirkpatrick como referência formal de
   avaliação).

---

## 1. Consistency Is Key

**Estado atual:** forte. A Task 27 já formalizou uma paleta própria
(marinho `--brand`, dourado `--gold`, verde/branco) sobre os tokens do
HeroUI, com contraste AA documentado em `app/globals.css`. Ícones
padronizados em `lucide-react` (Task 27). Hierarquia de informação
consistente (headers de seção com barra dourada, `Card`/`Chip` com o
mesmo padrão visual em toda a aplicação — Tasks 16, 24, 27).

**Lacunas:**
- Não existe um **guia de estilo documentado** separado do código (hoje
  a "fonte da verdade" é só `app/globals.css` + o olho de quem já leu os
  componentes). Para um projeto de um módulo isso é aceitável, mas vira
  risco quando houver um segundo módulo (PRD seção 9, item 2).
- A consistência foi pensada para **um único módulo**; não há ainda
  nenhuma convenção definida para "como será o próximo módulo" (nome de
  rota, estrutura de conteúdo, etc.) — não é um bug, mas é uma lacuna de
  planejamento a registrar antes que um segundo módulo seja decidido.

**Ações propostas:**
- **P2 — Tarefa 28 (proposta):** extrair um `docs/guia-de-estilo.md`
  curto (paleta, tipografia, componentes-padrão, ícones) a partir do que
  já existe em `app/globals.css`/Tasks 18–19/27 — documentação, não
  código novo.
- **P2:** ao decidir o segundo módulo (fora do escopo desta revisão),
  revisitar esta seção para formalizar a convenção de conteúdo
  reutilizável entre módulos.

---

## 2. Create an Immersive Multimedia Experience

**Estado atual:** o portal depende de **um único canal de mídia**: um
vídeo (ainda não gravado — `youtubeVideoId: null`, Task 17) seguido de um
quiz com dois formatos (texto simples e simulação de chat, Task 9/20). A
simulação de chat já é um recurso além do texto puro (mostra uma conversa
simulada com um assistente de IA) e cumpre parcialmente esta prática.

**Lacunas:**
- **Nenhum curso real foi gravado ainda.** O roteiro v2
  (`roteiro_audiovisual_completo_v2.md`) prevê um único bloco de ~30
  minutos narrado por um instrutor com imagens estáticas sobrepostas —
  é uma aula gravada tradicional, não um "cenário ramificado" nem
  *microlearning*. O artigo recomenda especificamente evitar isso
  ("Video, in particular, is often overlooked or misused" / "Microlearning
  modules, interactive branching scenarios and short-form video can all
  be effective alternatives").
- Não há fóruns, jogos, nem nenhuma atividade prática fora do quiz.

**Ações propostas:**
- **P0 — Tarefa 29 (proposta):** antes da gravação final, revisar o
  roteiro v2 para **segmentar em capítulos nomeados** (ex. marcadores de
  tempo do YouTube/`chapters`) alinhados aos blocos já existentes (1 a
  5B) — permite ao aluno pular para a parte que precisa revisar, em vez
  de um único bloco monolítico de 30 min. Isso é uma mudança de
  **metadado do vídeo** (capítulos do YouTube), não do player, então não
  exige código novo além de preencher a descrição do vídeo no YouTube
  Studio.
- **P1 — Tarefa 30 (proposta):** avaliar dividir o vídeo único em **2–3
  vídeos curtos** (um por "momento pedagógico": conceito → demonstração →
  auditoria/correção), cada um marcando conclusão independentemente —
  isso exigiria estender `ModuleContent`/`UserProgress` para múltiplos
  vídeos sequenciais dentro do mesmo módulo (mudança de modelo de dados,
  não trivial; avaliar custo/benefício antes de decidir).
- **P1 — Tarefa 31 (proposta):** transformar a Questão 3 do banco de
  questões (auditoria de viabilidade técnica) em uma mini-atividade
  interativa de "antes/depois" (ex. comparar duas versões de um plano de
  aula lado a lado) em vez de só um texto de cenário — aproxima-se de um
  *branching scenario* leve, sem exigir motor de simulação completo.
- **P2:** considerar um exercício prático opcional ("escreva seu próprio
  comando para a IA e cole aqui") — mesmo sem avaliação automática,
  reforça o "mão na massa" citado também na prática 6.

---

## 3. Provide Opportunities for Connection

**Estado atual:** **inexistente, por decisão deliberada de escopo.** O
PRD (seção 6) define identidade local sem conta/backend; não há fóruns,
grupos, nem contato com instrutor. O FAQ (Task 24) cobre parcialmente a
exigência de "informação clara quando o contato com instrutor é mínimo"
(responde dúvidas comuns sem precisar de um humano), mas não substitui
conexão real.

**Lacunas:**
- Nenhum canal de interação aluno-aluno ou aluno-instrutor.
- Nenhuma informação de contato visível (e-mail/canal de suporte) caso o
  aluno tenha uma dúvida que a FAQ não cobre.

**Ações propostas:**
- **P1 — Tarefa 32 (proposta):** adicionar um **canal de contato
  mínimo e assíncrono** na página inicial e/ou relatório final (ex. link
  "mailto:" ou formulário externo simples) — não exige backend, é só um
  link, e atende diretamente a recomendação do artigo para ambientes
  assíncronos ("ensure students have the correct contact information").
- **P2 (fora do escopo de MVP, registrar como backlog real):** fórum de
  discussão ou grupo de estudo — exigiria conta/backend (PRD seção 9) e é
  incompatível com a decisão atual de "sem cadastro". Só revisitar se o
  produto evoluir para multi-aluno com acompanhamento (PRD seção 9, item
  6).
- **P2:** uma seção "Perguntas da turma" (FAQ viva, curada manualmente a
  partir de dúvidas recebidas pelo canal de contato da Tarefa 32) é um
  meio-termo barato de simular parte da conexão social sem exigir conta.

---

## 4. Make Course Content Digestible

**Estado atual:** bom na maior parte da aplicação, mas desigual.
- **Página inicial (Task 24):** já segue bem esta prática — seções
  curtas, cartões, checklists, âncoras navegáveis, FAQ em acordeão.
- **Avaliação (Tasks 20, 25, 26):** uma pergunta por vez, confirmação
  individual, feedback imediato, navegação livre via menu lateral — boa
  aplicação de *chunking*.
- **Relatório final (Task 26):** abas (Resumo/Gabarito comentado)
  evitam uma tela única sobrecarregada.
- **Vídeo:** ver prática 2 — um único bloco de ~30 minutos é o maior
  desvio desta prática em todo o portal.

**Lacunas:**
- Os **enunciados das questões** (`content/module.ts`) são parágrafos
  de cenário relativamente longos (2–4 frases densas, estilo "banca de
  concurso") — não há destaque visual (negrito em termos-chave,
  separação do contexto vs. da pergunta em si) dentro do próprio
  enunciado.
- Vídeo único e longo (ver prática 2 — P0/Tarefa 29, P1/Tarefa 30) é
  também um problema de *digestibilidade*, não só de "imersão".

**Ações propostas:**
- **P1 — Tarefa 33 (proposta):** revisar os 4 enunciados de
  `content/module.ts` para separar visualmente **contexto do cenário**
  (parágrafo) da **pergunta objetiva** (ex. sempre a última frase em
  destaque, ou um componente `QuestionRenderer` que renderiza a última
  frase como um `<strong>`/bloco separado) — mudança de apresentação, sem
  alterar o conteúdo pedagógico definido em `banco-questoes.md`.
- Reaproveita as ações da prática 2 (Tarefas 29/30) para o vídeo.

---

## 5. Make It Accessible

**Estado atual:** o ponto **mais maduro** do portal — Tasks 14, 18, 19
cobrem contraste AA, navegação por teclado, labels ARIA, tema
light/dark/sistema, tamanho de fonte (3 níveis) e alto contraste, tudo
auditado com axe-core (0 violações registradas em todas as combinações
testadas).

**Lacunas (fora do que já foi auditado):**
- **Legendas/closed captions do vídeo.** Nenhuma task até agora trata de
  legendas ou transcrição do vídeo — e o vídeo real ainda nem foi
  gravado. É a lacuna de acessibilidade mais crítica do portal, porque
  afeta diretamente alunos surdos/com deficiência auditiva e também
  quem assiste sem áudio. O artigo cita explicitamente "accessible
  colors" e "clear language", mas a prática geral de design
  instrucional acessível (e WCAG 2.1, já referenciado no PRD seção 4)
  exige legendas sincronizadas para conteúdo em vídeo com áudio.
- **Texto alternativo de imagens reais.** A Task 27 criou
  `ImagePlaceholder` com `alt=""` (decorativo) por padrão — correto
  enquanto não há imagem real, mas quando as ilustrações finais forem
  adicionadas (hero, objetivos, jornada — pendência já registrada no
  task-master.md), será preciso decidir, para cada uma, se é puramente
  decorativa (`alt=""`) ou informativa (`alt` descritivo) — isso não foi
  decidido ainda porque as imagens não existem.
- **Transcrição textual do vídeo** — útil tanto para acessibilidade
  quanto para "digestibilidade" (prática 4): permite ler em vez de
  assistir, e permite usar Ctrl+F para encontrar um trecho.

**Ações propostas:**
- **P0 — Tarefa 34 (proposta):** ao gravar o vídeo definitivo (pendência
  já existente no task-master.md), produzir e anexar **legendas em
  português (.vtt/.srt)** via YouTube Studio (legenda enviada manualmente
  ou revisada a partir de legenda automática — nunca publicar só a
  automática sem revisão humana, por precisão terminológica). Isso é um
  processo de produção de conteúdo, não uma mudança de código no portal
  (o embed do YouTube já exibe legendas nativamente quando existem).
- **P1 — Tarefa 35 (proposta):** publicar a **transcrição textual
  completa do vídeo** como conteúdo acessível na própria página
  (`/video`, ex. um `Accordion`/`Disclosure` colapsado por padrão
  "Ler transcrição do vídeo") — o roteiro já existe
  (`roteiro_audiovisual_completo_v2.md`, coluna "Locução Integral do
  Instrutor"), então é essencialmente uma tarefa de reaproveitamento de
  conteúdo já escrito, não de produção nova.
- **P2:** ao adicionar as imagens reais (pendência já registrada),
  decidir e documentar o `alt` de cada uma (decorativa vs. informativa)
  como parte da própria task que for aberta para isso.

---

## 6. Engage the Learner's Senses

**Estado atual:** parcialmente atendido. `Accordion` (FAQ, Task 24;
Gabarito comentado, Task 26) e `Tabs` (relatório final, Task 26) já são
usados — exatamente os componentes citados pelo artigo
("accordions, tabs and flip cards"). A simulação de chat (Task 9) também
é uma forma de variar o formato de entrega de conteúdo além de
texto/vídeo.

**Lacunas:**
- Nenhum *flip card* usado (ainda que seja só um exemplo do artigo, não
  uma exigência).
- Nenhuma atividade verdadeiramente "mão na massa" — o quiz é sempre de
  alternativas, nunca pede uma produção do próprio aluno (mesmo que não
  avaliada automaticamente).
- A seção "Como funciona" (`CourseSections`, Task 24) já usa cartões com
  ícone, mas poderia ganhar mais variação de formato (ex. um pequeno
  carrossel/`flip card` para "Antes vs. Depois" de uma correção de plano
  de aula pela IA — ligado à Tarefa 31 da prática 2).

**Ações propostas:**
- Reaproveita a **Tarefa 31** (prática 2) como a principal ação aqui —
  um "antes/depois" interativo cobre tanto "imersão" quanto "engajar os
  sentidos" (visual + interação, não só leitura).
- **P2 — Tarefa 36 (proposta):** avaliar um `flip card` (frente:
  pergunta-gancho; verso: conceito-chave) na seção "Objetivos do curso"
  ou "O que você será capaz de fazer ao final" da página inicial —
  puramente estético/engajamento, baixa prioridade.

---

## 7. Iteration and Reiteration

**Estado atual:** **a lacuna mais sistêmica do portal.** Até agora, toda
iteração veio de **feedback direto do próprio usuário/dono do produto**
em conversas com o assistente (ex. Tasks 16–27), não de dados de alunos
reais. Não existe nenhum mecanismo de **coletar feedback de quem usa o
curso**, nem de **medir onde os alunos mais erram** para revisar o
conteúdo com base em dados (o artigo cita o modelo de Kirkpatrick como
referência formal para isso).

**Lacunas:**
- Nenhuma pesquisa de satisfação pós-curso.
- Nenhuma telemetria sobre quais das 4 perguntas são mais erradas, nem
  sobre em qual ponto os alunos abandonam a jornada (ex. terminam o
  vídeo mas não voltam para a avaliação).
- Como a persistência é só `localStorage` (PRD seção 10), hoje **não há
  nenhum dado agregado entre alunos diferentes** — cada navegador é uma
  ilha. Isso é coerente com a decisão de escopo (PRD seção 9, item 6),
  mas significa que iterar com dados reais exige, no mínimo, um
  mecanismo de **envio** de algum sinal para fora do navegador (mesmo
  sem um backend completo de admin).

**Ações propostas:**
- **P1 — Tarefa 37 (proposta):** adicionar, na tela de relatório final,
  um **link de feedback pós-curso** (ex. formulário externo simples —
  Google Forms ou similar, sem exigir backend próprio) perguntando: (1)
  nota de satisfação, (2) se alguma pergunta pareceu confusa, (3)
  comentário livre. É a aplicação mais direta e barata desta prática,
  compatível com a arquitetura atual (sem backend).
- **P2 — Tarefa 38 (proposta, maior escopo):** avaliar um mecanismo leve
  de telemetria agregada (ex. endpoint serverless simples na própria
  Vercel, ou um serviço de analytics de terceiros respeitando privacidade
  — LGPD, já que o nome do aluno é informado) para saber, de forma
  agregada, quais perguntas têm maior taxa de erro — isso **exigiria
  introduzir um componente server-side** pela primeira vez no portal
  (hoje 100% estático/client-side), então deve ser tratado como uma
  decisão arquitetural própria, não uma tarefa pequena. Não implementar
  sem essa discussão explícita.
- **P2:** formalizar um ciclo de revisão periódica deste próprio
  documento (ex. revisitar esta checklist a cada novo módulo ou a cada N
  meses em produção) — trata a prática 7 como processo contínuo, não
  tarefa única.

---

## Resumo priorizado

| Prioridade | Tarefas propostas | Resumo |
|---|---|---|
| **P0** | 29, 34 | Capítulos no vídeo (metadado do YouTube); legendas do vídeo definitivo |
| **P1** | 30, 31, 32, 33, 35, 37 | Fracionar vídeo em partes menores; atividade "antes/depois" interativa; canal de contato mínimo; destaque visual nos enunciados; transcrição textual do vídeo; link de feedback pós-curso |
| **P2** | 28, 36, 38 | Guia de estilo documentado; flip cards na home; telemetria agregada (exige decisão arquitetural) |

**Observação importante:** as Tarefas 29 e 34 (P0) dependem da gravação
do vídeo definitivo, que ainda não aconteceu — ou seja, são **pré-
condições para a gravação**, não para o código já em produção. Nenhuma
ação deste plano bloqueia o estado atual do portal, que já está no ar.

---

## Próximos passos (atualizado em 2026-10-18)

O usuário revisou este plano e aprovou 11 das ações propostas — já
promovidas para `task-master.md` como **Tasks 28–38** (ver tabela de
mapeamento no início deste documento). Status na promoção:

- **Prontas para começar (sem bloqueio):** Tasks 28, 29, 31, 32, 33, 37,
  38.
- **Dependem de outra task aprovada:** Task 30 depende da 29; Task 36
  depende das 29 e 30; Task 34 depende, nesta ordem, de 28, 29, 30, 31,
  32 e 33 (pedido explícito do usuário — revisar as perguntas só depois
  de todo o resto da seção 1, 2 e 3 estar concluído).
- **Bloqueada por algo fora do controle do task-master:** Task 35
  (legendas em português) só pode ser executada e validada depois que
  houver um vídeo real publicado (`youtubeVideoId` deixar de ser `null`,
  Task 17) — fica registrada agora, mas não é retomável antes disso.

**Não aprovado nesta rodada** (sem task — continua só como registro
histórico acima): guia de estilo para múltiplos módulos futuros,
telemetria agregada de erros por pergunta (exigiria introduzir
server-side por decisão arquitetural própria) e um ciclo formal de
revisão periódica deste documento.

A ordem de execução recomendada e o detalhamento de cada task (arquivos,
critérios de aceite, estratégia de teste) estão em `task-master.md`,
Fase 9 — "Adequação a design instrucional (D2L)".
