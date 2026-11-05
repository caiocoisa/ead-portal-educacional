# Plano de Evolução do Portal — v2

> Gerado em: 2026-11-04
> Status: **decisões D1–D4 e requisitos obrigatórios R1 e R2 registrados
> em 2026-11-04; D5 em aberto até existir o vídeo final** (seção 10).
> Tasks 39–64 promovidas ao `task-master.md`; Tasks 39 e 40 concluídas.
> Nenhum código do portal foi alterado ainda.
> Sucede o `plano-adequacao-design-instrucional.md` (Tasks 28–38) e o
> complementa; onde houver sobreposição, ela está explicitada na seção 9.

Este documento organiza a próxima etapa de evolução do portal em **oito
frentes** (A a H), uma por requisito levantado. Cada frente indica o que será
feito, quais são as entradas e saídas, quem executa (**interno** = código
ou documento do repositório; **web** = pesquisa externa; **Claude Design**
= produção de peças visuais) e como saber que terminou.

---

## Requisitos obrigatórios adicionais (2026-11-04)

> **Os dois requisitos abaixo são obrigatórios** e prevalecem sobre
> qualquer proposta anterior deste plano quando houver conflito.

### R1 — Ebook profissional, interativo e publicado em plataforma interativa

O ebook deve ser:

- **visualmente atrativo, bem organizado e interativo**;
- escrito em **linguagem clara e adequada ao público-alvo** (educadores,
  licenciandos e designers instrucionais, sem experiência prévia com IA);
- composto pelos **elementos essenciais**: **capa**, **sumário** e
  **capítulos estruturados de forma coerente e lógica**;
- de **design profissional e envolvente**;
- **publicado obrigatoriamente** em uma plataforma interativa, como o
  **FlipHTML5** ou o **Genially**, para uma apresentação mais dinâmica.

**Como será verificado** (checklist proposta, ajustável na Task 48):
1. Capa, sumário navegável (cada item leva ao capítulo) e capítulos em
   ordem lógica, cada um com abertura (objetivo), desenvolvimento e
   fecho (síntese ou checklist).
2. Pelo menos um elemento interativo por capítulo (por exemplo, sumário
   clicável, janela de detalhe, autoverificação).
3. Linguagem simples: frases curtas, termo técnico definido no primeiro
   uso, glossário; revisada por 2–3 educadores do perfil-alvo.
4. Design produzido no Claude Design sobre o design system v2 (R2).
5. **Publicado** na plataforma escolhida (Task 61) e **incorporado** ao
   portal (Task 52).

> **Ponto de atenção, que não substitui a publicação:** plataformas de
> terceiros podem ter limitações de acessibilidade e de privacidade. A
> Task 58 mede isso antes da escolha. Independentemente do resultado, o
> portal mantém **também uma versão acessível** (HTML ou PDF) ao lado da
> versão interativa, para preservar o compromisso WCAG 2.1 AA do PRD.

### R2 — Todo o layout da plataforma reelaborado via Claude Design

**Todos** os itens que compõem o layout devem ser reelaborados no Claude
Design, a partir das **melhores referências do mercado**, para compor um
produto final **coerente, atrativo, profissional, moderno e autêntico**:

- **cores** e **fontes**;
- **formatos dos elementos**;
- **navegações**;
- **incorporação de elementos externos**;
- **exibição e sobreposição de componentes**.

Isso é tratado como uma frente própria (**H**, seção 7.1), com duas
aprovações suas (direção de arte e protótipos) antes de qualquer código.
**Consequência de ordem:** nenhuma peça nova (quadrinho, mapa, ebook) é
produzida antes do design system v2, e a Task 44 passa a testar também
tokens, protótipos multi-tela e sobreposições.

---

## 1. Ponto de partida (achados já verificados)

Antes de planejar, foram lidos o PRD, o `task-master.md`, o banco de
questões, o roteiro v2, `content/module.ts` e os componentes da jornada.
Os achados abaixo **são fatos do repositório**, não hipóteses — eles
justificam a ordem das frentes.

### 1.1 Coerência entre banco de questões e vídeo (roteiro v2)

> **Atualização (Task 39, 2026-11-04):** a análise completa está em
> `docs/matriz-rastreabilidade.md`. Precisou o **C1** (só o feedback
> "distante" diverge) e o **C5** (a palavra "responsabilidade" aparece, no
> plural). Acrescentou quatro achados: **D-07** (alternativa correta mais
> longa em 3 das 4 questões), **D-08** (numeração contraditória das
> "lentes" entre os Blocos 4B e 5, bloqueante para a gravação), **D-09**
> (a home promete cinco elementos, o vídeo ensina quatro) e **D-10**
> (quatro vocabulários para as mesmas competências). A revisão do fluxo
> está em `docs/revisao-fluxo-ux.md` (Task 40).

| # | Achado | Evidência |
|---|---|---|
| C1 | **Duas fontes de verdade já divergem.** `banco-questoes.md` ainda cita "Bloco 4" para as Questões 1 e 3, mas o roteiro v2 dividiu o bloco em 4A (alinhamento) e 4B (viabilidade). `content/module.ts` removeu as referências a blocos; o `.md` não. | `banco-questoes.md` (Contexto no Minicurso) × `roteiro_audiovisual_completo_v2.md` |
| C2 | **Terminologia da Questão 1 só é ensinada no fim.** A alternativa correta usa "coerência didática" e a dimensão se chama "Alinhamento Construtivo", mas os Blocos 1 e 4A só ensinam "alinhamento pedagógico". Os termos aparecem uma única vez, na síntese do Bloco 5 (26:30). | roteiro v2, Blocos 1, 4A e 5 |
| C3 | **A Questão 2 é reconhecimento literal.** A alternativa correta é, palavra por palavra, o comando exibido no Bloco 3 do vídeo. Mede memória do exemplo, não a capacidade de aplicar os quatro pilares a um caso novo. | roteiro v2 (Bloco 3) × Questão 2 |
| C4 | **Questões 1 e 3 reutilizam exatamente os cenários do vídeo** (prova de datas históricas; debate de 2 h). A v2 do roteiro foi ajustada de propósito para isso — ganhou coerência, mas perdeu poder de medir **transferência**. | roteiro v2 (Blocos 4A/4B) |
| C5 | **Termos soltos na Questão 4.** "Co-piloto" e "responsabilidade final" não são ditos no vídeo (que fala em "assistente de redação e organização" e "rigor metodológico"). Severidade baixa. | roteiro v2 (Bloco 5) × Questão 4 |
| C6 | **Uma pergunta por competência.** O relatório mostra a competência como "Dominada" ou "Vale revisar" com base em **uma única** questão (barra 0% ou 100%). É um sinal fraco para um diagnóstico. | `components/journey/FinalReport.tsx` |

> **A tensão central:** a v2 do roteiro buscou coerência máxima (mesmo
> texto no vídeo e na prova). Para um módulo de **auditoria crítica**, isso
> treina o aluno a reconhecer o exemplo, não a auditar um caso novo. A
> proposta é manter coerência de **conceito** e variar o **cenário**.

### 1.2 Fluxo de experiência (lido no código)

| # | Achado | Evidência |
|---|---|---|
| U1 | **Não existe caminho de volta ao vídeo.** O guard exige `currentStep === etapa esperada`; quem avançou para a avaliação é redirecionado se tentar abrir `/video`. Os feedbacks dizem "revise o conceito", mas o único meio de rever é **reiniciar a jornada inteira** (que apaga o resultado). | `lib/journey/useJourneyGuard.ts:38` |
| U2 | **O botão "Concluir" anula o bloqueio.** O texto diz "assista até o final para liberar a avaliação", mas "Concluir" está sempre visível e avança com um clique. | `components/journey/ModuleVideoStep.tsx:57` |
| U3 | **Avanço automático a 90%.** Ao atingir o limiar, o aluno é levado à avaliação sem confirmação, sem pausa para síntese e sem aviso. | `ModuleVideoStep.tsx:30-34` |
| U4 | **O relatório diagnostica, mas não prescreve.** "Vale revisar" não aponta **onde** revisar; não há refazer só as erradas. | `FinalReport.tsx` |
| U5 | **O modelo de dados é linear e de um módulo só.** `UserProgress` tem apenas `currentStep` e `videoCompleted`; não há onde registrar consumo de materiais complementares. | `types/progress.ts` |
| U6 | **O vídeo ainda não existe** (`youtubeVideoId: null`). Hoje o primeiro passo da jornada é um skeleton atravessado pelo "Concluir". | `content/module.ts:20` |

> **Mapeamento para a revisão completa (Task 40, 2026-11-04):** U1 →
> UX-01, U2 → UX-02, U3 → UX-03, U4 → UX-06, U5 → UX-04 e UX-12 (o modelo
> de dados), U6 → UX-13. A revisão ampliou a lista para 17 atritos; ver
> `docs/revisao-fluxo-ux.md`.

---

## 2. Frente A — Coerência do banco de questões com a videoaula

**Objetivo:** cada questão mede exatamente o que o vídeo ensina, no nível
cognitivo pretendido, sem depender de decorar o exemplo.

**Atividades (interno):**
1. Montar a **matriz de rastreabilidade**: objetivo de aprendizagem →
   trecho do roteiro (bloco + timestamp) → questão → alternativa correta →
   feedback. Uma linha por questão, com o nível de Bloom de cada uma.
2. Classificar cada divergência (C1–C6 e as que surgirem) como
   **bloqueante / ajustar / aceitável**.
3. Definir a **fonte única de verdade** do banco (proposta: `content/module.ts`
   passa a ser a fonte; `banco-questoes.md` vira gerado ou é aposentado).
4. Propor a **versão 2 do banco**: manter as 4 questões originais como
   núcleo e acrescentar variantes com **cenário novo** (outra disciplina,
   outro público) para medir transferência — de 4 para 8–12 itens, com 2–3
   por competência.
5. Regra de projeto: o material de remediação (frente F) **nunca reutiliza
   o cenário** de uma questão, para não "entregar a resposta" na segunda
   tentativa.

**Entregáveis:** `docs/matriz-rastreabilidade.md`; banco v2 em
`content/module.ts`; atualização do roteiro v2 apenas onde a matriz
apontar lacuna de **ensino** (ex.: introduzir o termo "coerência
didática" já no Bloco 1/4A).

**Pronto quando:** toda questão tem trecho do vídeo que a sustenta; nenhum
termo da alternativa correta é inédito para o aluno; relatório passa a
ter ≥ 2 itens por competência.

---

## 3. Frente B — Fluxo de experiência do usuário

**Objetivo:** transformar a jornada de "esteira" em um caminho que
**diagnostica e conduz o aluno de volta ao que ele errou**.

**Atividades (interno):**
1. **Percurso completo anotado** (home → vídeo → avaliação → relatório →
   reinício) com cada ponto de atrito, usando os achados U1–U6 como base e
   acrescentando o que a execução real mostrar.
2. **Revisão heurística** (Nielsen: visibilidade de estado, controle e
   liberdade do usuário, prevenção de erros, reconhecimento > memória).
   U1 e U2 já violam "controle e liberdade" e "prevenção de erros".
3. **Teste de usabilidade enxuto**: 3–5 educadores do perfil-alvo, tarefa
   única ("faça o módulo e diga o que faria depois de errar uma
   pergunta"), com observação e registro.
4. Propor correções priorizadas. Candidatas já visíveis:
   - permitir **rever o vídeo** a qualquer momento (relaxar o guard para
     etapas já liberadas);
   - tornar "Concluir" condicional ou renomeá-lo com honestidade
     ("Já assisti — ir para a avaliação");
   - substituir o avanço automático por um **cartão de transição**
     ("Você concluiu o vídeo. Quer ver os materiais complementares ou ir
     direto à avaliação?");
   - relatório com **recomendações por competência** e "refazer só as
     erradas".

**Entregáveis:** `docs/revisao-fluxo-ux.md` (mapa do percurso + backlog
priorizado); protótipo de baixa fidelidade do fluxo novo.

**Pronto quando:** cada atrito tem severidade e proposta; o fluxo-alvo
está aprovado antes de qualquer alteração de código (frente G).

---

## 4. Frente C — Estrutura do portal × design instrucional × concorrentes

**Objetivo:** posicionar o portal contra (i) princípios de design
instrucional e (ii) o que o mercado de EaD faz de melhor, e transformar
isso em lacunas priorizadas.

**Atividades:**
1. **(web)** **Benchmark de concorrentes.** Candidatos a validar na
   pesquisa (a lista é de partida, não conclusão): plataformas de cursos
   curtos e gratuitos (Coursera, Khan Academy, Google Skillshop), escolas
   virtuais brasileiras de formação (Fundação Bradesco/EVG, Sebrae,
   Escola Virtual.Gov/ENAP) e plataformas de assinatura (Alura, Udemy,
   Descomplica). Para cada uma, registrar **o que se vê**, não o que se
   supõe, com link e data de acesso.
   Dimensões da matriz: onboarding; estrutura do módulo; duração e
   fragmentação do vídeo; materiais complementares; tipos de avaliação e
   feedback; remediação; gamificação e certificado; acessibilidade;
   comunidade; retomada de progresso.
2. **(interno)** **Auditoria contra referenciais instrucionais:** eventos
   de instrução de Gagné (9 eventos), princípios de Merrill, taxonomia de
   Bloom e avaliação de Kirkpatrick (níveis 1–2 já cobertos pelo quiz;
   1 depende da Task 38). Os 7 critérios D2L já foram aplicados — esta
   etapa **não repete**, e sim adiciona o que eles não cobrem (ex.:
   ativação de conhecimento prévio, prática guiada, transferência).
3. **(interno)** **Matriz de lacunas:** portal × concorrentes × referencial,
   com impacto, esforço e dependência. Alimenta a decisão de escopo.

**Entregáveis:** `pesquisa/benchmark-concorrentes.md`;
`pesquisa/auditoria-instrucional.md`; matriz de lacunas priorizada.

**Pronto quando:** cada afirmação sobre um concorrente tem fonte
verificável; cada lacuna tem proposta de ação ou justificativa de
descarte.

> **Atenção (direitos autorais):** o benchmark registra **estrutura e
> prática observável**. Nenhum conteúdo, texto ou arte de terceiros é
> copiado para o portal.

---

## 5. Frente D — Engenharia reversa de roteiros de outras mídias

**Objetivo:** obter, para cada mídia, um **esqueleto reutilizável** de
roteiro extraído de bons exemplos, para não inventar o formato do zero.

**Mídias do primeiro ciclo** (ver decisão D3): mapa interativo,
quadrinho educativo, ebook.

**Método (web + interno), igual para cada mídia:**
1. **Selecionar 4–6 exemplos de referência** com critério explícito
   (reconhecimento do mercado, público próximo, domínio educacional,
   disponibilidade para análise). Pontos de partida a validar:
   - *Mapa interativo:* tipos de conteúdo interativo do H5P (hotspots,
     timeline, branching scenario), explicadores jornalísticos
     ("scrollytelling"), StoryMaps.
   - *Quadrinho:* quadrinhos de não ficção educativa (ex.: *Desvendando
     os Quadrinhos*, de McCloud; a série "Cartoon Guide to…"), HQs
     institucionais de formação.
   - *Ebook:* guias de bolso e ebooks de capacitação de alto engajamento;
     livros de método com estrutura de gancho → framework → caso →
     exercício; **ebooks interativos publicados em FlipHTML5 e Genially**
     (capa, sumário clicável, abertura de capítulo, elementos
     interativos), observando também o **design visual** (R1).
2. **Desmontar cada exemplo** numa ficha padrão: promessa e público;
   estrutura (atos/capítulos/seções, com contagem); ritmo e densidade;
   recurso de storytelling (personagem, conflito, antes/depois);
   mecanismo de engajamento (interação, pergunta, desafio); fecho e
   chamada para ação; **o que o torna bom** e **o que não serve ao nosso
   caso**.
3. **Destilar o esqueleto:** estrutura-padrão em seções, limites de
   tamanho, regras de tom, checklist de qualidade e modelo de roteiro
   preenchível (template).
4. **Validar o esqueleto** reaplicando-o a um conteúdo já conhecido (o
   roteiro do vídeo) e verificando se ele cabe sem forçar.

**Entregáveis:** `pesquisa/engenharia-reversa/{mapa,quadrinho,ebook}.md`
(fichas + esqueleto) e `templates/roteiro-{mapa,quadrinho,ebook}.md`.

**Pronto quando:** existe um template por mídia e uma checklist de
qualidade; cada decisão de estrutura aponta para ao menos um exemplo
observado.

---

## 6. Frente E — Conteúdo complementar (mesmo tema da videoaula)

**Objetivo:** produzir um conjunto de materiais que **reforcem a aula e
preparem para a avaliação**, cada um com função pedagógica distinta, sem
repetir os cenários das questões.

**Proposta de conjunto inicial** (cada peça mapeada às quatro lentes e às
questões):

| Mídia | Função pedagógica | Ideia-guia (cenário novo) | Cobre |
|---|---|---|---|
| **Mapa interativo** | Visão estrutural e exploração livre | "Mapa do alinhamento": os 4 vértices (público, objetivos, atividades, avaliação); cada nó abre o conceito, um exemplo e a **falha típica que a IA comete** | Q1 (principal), lente 1 |
| **Quadrinho** | Aprendizagem narrativa por caso | Uma professora recebe duas sugestões da IA para uma aula de outra disciplina e audita cada uma; o leitor decide nas "bifurcações" | Q1, Q3 (principal), Q4 |
| **Ebook (guia de bolso), publicado em FlipHTML5 ou Genially (R1)** | Referência para consulta e uso posterior, com apresentação dinâmica | "Auditando sugestões de IA no planejamento EaD": **capa, sumário e capítulos** com fórmula Papel-Contexto-Tarefa-Formato, as 4 lentes, checklist e modelos de comando; elementos interativos em cada capítulo | Q2 (principal), Q4, todas as lentes |

**Passos (interno + web + Claude Design + IA de imagem), por mídia:**
1. **Roteiro** escrito com o template da frente D e revisado contra a
   matriz de rastreabilidade (frente A).
2. **Brief para o Claude Design:** objetivo da peça, público, **design
   system v2** (Task 59, não o guia de estilo atual), formato de saída
   esperado, restrições de acessibilidade e, no ebook, as exigências da
   plataforma escolhida (Task 58).
3. **Produção das peças em duas camadas (D6 e D7).** As **ilustrações**
   (personagem e cenas da HQ, arte dos nós do mapa, capa e ilustrações do
   ebook) vêm de uma **IA de imagem**, gerada manualmente por você a
   partir dos prompts de `docs/prompts-ilustracao.md`, sempre **sem texto
   na imagem**. A **composição** (balões, legendas, diagramas, mapa
   interativo, capa, sumário, capítulos e diagramação completa do ebook,
   pensados para uma apresentação interativa) é feita no **Claude
   Design**, em HTML vivo.
4. **Revisão pedagógica:** nenhuma peça revela a resposta de uma questão;
   terminologia idêntica à do vídeo; escopo respeitado.
5. **Revisão de acessibilidade:** texto alternativo de todas as imagens,
   roteiro textual de cada painel, contraste AA, ordem de leitura.

**Entregáveis:** roteiros em `conteudo/{mapa,quadrinho,ebook}/`; arquivos
finais exportados em formato web; ficha de cada peça (objetivo, questões
cobertas, alt-text).

**Pronto quando:** cada peça tem objetivo e questões mapeadas; passa nas
revisões pedagógica e de acessibilidade; está em formato consumível
pelo portal.

---

## 7. Frente F — Novas seções no portal

**Objetivo:** hospedar os novos materiais sem romper a jornada que já
funciona e sem perder a acessibilidade.

**Decisão de desenho proposta (D1):** um **hub opcional "Materiais
complementares"**, não uma etapa obrigatória nova. Motivos: preserva o
fluxo vídeo → avaliação → relatório; evita novo bloqueio sobre um aluno
que já tem atrito (U1/U2); permite entrada **a partir do ponto de dor**.

**Pontos de entrada propostos:**
- cartão de transição ao fim do vídeo (substitui o avanço automático);
- item no cabeçalho da jornada (acessível a qualquer momento);
- no relatório e no gabarito: cada "Vale revisar" aponta para o material
  que cobre aquela competência (**remediação dirigida**).

**Trabalho técnico (interno):**
1. **Modelo de dados:** estender `UserProgress` com registro de materiais
   consumidos, com **versão do esquema e migração segura** do
   `localStorage` (usuários existentes não têm o campo).
2. **Rotas e conteúdo:** `/materiais` e `/materiais/[id]`, conteúdo
   declarado em arquivos de seed (mesmo padrão de `content/`).
3. **Componentes:**
   - *Leitor de quadrinho:* sequência de painéis, navegação por teclado,
     alt-text e roteiro textual por painel.
   - *Mapa interativo:* nós focáveis e operáveis por teclado, painel de
     detalhe, **alternativa em lista** para leitor de tela.
   - *Ebook:* a **versão interativa publicada na plataforma escolhida
     (R1)** é incorporada à página, com moldura, proporção e título
     acessível definidos no design system v2; ao lado, a **versão
     acessível** (capítulos em HTML pesquisável e legível em leitor de
     tela, mais download em PDF).
4. **Integração com o relatório:** mapeamento `competência → materiais`
   e recomendação personalizada.
5. **Qualidade:** testes ponta a ponta (Playwright), auditoria axe-core
   nas combinações já adotadas (tema × contraste × fonte), build e lint
   limpos — **sobre a infraestrutura reproduzível criada na Task 45**
   (hoje o projeto não tem Playwright nem axe como dependências). Antes de escrever código, ler o guia relevante em
   `node_modules/next/dist/docs/` (regra do `AGENTS.md`: esta versão do
   Next.js tem mudanças incompatíveis).

**Pronto quando:** o hub funciona em mobile e desktop, por teclado e
leitor de tela; jornada antiga continua intacta para quem já tinha
progresso salvo.

---

## 7.1 Frente H — Redesign completo da plataforma via Claude Design (R2)

**Objetivo:** reelaborar **todos** os itens visuais e de interação da
plataforma, partindo das melhores referências do mercado, para entregar
um produto coerente, atrativo, profissional, moderno e autêntico.

**Escopo (o que é reelaborado):**

| Item | O que inclui |
|---|---|
| Cores | paleta de marca, semânticas (sucesso, alerta, erro), tema claro, escuro e alto contraste |
| Fontes | famílias, escala tipográfica, pesos e os três tamanhos de leitura |
| Formatos dos elementos | raios, bordas, sombras, espaçamento, grade, densidade |
| Navegações | cabeçalho, indicador de progresso, menu lateral da avaliação, hub de materiais, rodapé |
| Elementos externos incorporados | player do YouTube, ebook publicado em plataforma interativa, moldura e proporções |
| Exibição e sobreposição | drawer de acessibilidade, modal de reinício, toasts, tooltips, acordeões, abas, estados de carregamento |
| Ilustrações | hero, objetivos e jornada (hoje reservados por `ImagePlaceholder`), ícones e estados vazios |

**Método (em ordem, com dois pontos de aprovação sua):**
1. **Referências (web, Task 57):** pesquisar as melhores interfaces de
   plataformas de ensino e de produtos digitais de referência, com
   critério declarado. Extrair **padrões**, não identidade: nada de
   copiar marca, arte ou texto de terceiros, porque o resultado precisa
   ser autêntico.
2. **Direção de arte (Claude Design, Task 59):** produzir **três
   explorações** distintas e levá-las a você. **Ponto de aprovação A.**
   Dentro da escolhida, fechar o design system v2: tokens, componentes,
   navegação, sobreposições e regras de incorporação.
3. **Protótipos das telas (Claude Design, Task 60):** home, vídeo,
   avaliação, relatório, hub de materiais, leitor do ebook, drawer de
   acessibilidade, modais e toasts, nos temas claro, escuro e alto
   contraste. **Ponto de aprovação B.**
4. **Implementação (código, Tasks 62 e 63):** primeiro as fundações
   (tokens, tema, tipografia, componentes-base, navegação), depois a
   aplicação às telas existentes.
5. **Validação (Task 55):** axe-core em todas as combinações e revisão
   visual comparando protótipo e produto.

**Restrições que não são negociáveis no redesign:**
- **Não regredir a acessibilidade**, que hoje é o ponto mais maduro do
  portal: contraste AA em todas as combinações, tema claro, escuro e do
  sistema, alto contraste, três tamanhos de fonte, navegação por teclado.
  Toda cor e escala proposta passa por verificação de contraste antes
  da aprovação.
- **A paleta atual (marinho e dourado, Task 27) é ponto de partida, não
  restrição.** A direção escolhida no ponto A pode mantê-la, evoluí-la
  ou substituí-la.
- Nenhuma peça nova (quadrinho, mapa, ebook) é produzida antes do
  design system v2, para não ser refeita.

**Entregáveis:** `pesquisa/referencias-visuais.md`; três explorações de
direção de arte; design system v2 (`docs/design-system-v2.md`) com
tokens exportáveis; protótipos aprovados; código aplicado.

**Pronto quando:** você aprovou os pontos A e B; o produto implementado
corresponde aos protótipos; zero violações no axe-core nas combinações
de tema, contraste, fonte e tela.

---

## 8. Frente G — Plano de implementação (com as decisões D1–D4 e os requisitos R1 e R2)

Cada linha é uma task promovida ao `task-master.md`. **Tipo:** *interno*
= documento ou análise no repositório; *web* = pesquisa externa;
*Claude Design* = produção visual; *código* = alteração no portal;
*plataforma* = publicação em serviço externo.

| Fase | Task | Título | Frente | Tipo | Depende de |
|---|---|---|---|---|---|
| **10 — Diagnóstico e pesquisa** | 39 | Matriz de rastreabilidade banco × roteiro | A | interno | — |
| | 40 | Percurso e revisão heurística do fluxo | B | interno | — |
| | 41 | Benchmark de concorrentes de EaD (estrutura e pedagogia) | C | **web** | — |
| | 42 | Auditoria instrucional (Gagné, Merrill, Bloom, Kirkpatrick) | C | interno | 39, 40 |
| | 43 | Engenharia reversa: ebook, quadrinho e mapa | D | **web** | — |
| | 44 | Testes de capacidade do Claude Design (D4, R2) | E, H | **Claude Design** + interno | — |
| | 45 | Infraestrutura de testes reproduzível | todas | código | — |
| | **57** | **Referências visuais e de UX do mercado (R2)** | H | **web** | — |
| | **58** | **Avaliação das plataformas de ebook: FlipHTML5 × Genially (R1)** | E | **web** + testes | — |
| | **64** | **Avaliação de IAs de geração de imagem para as ilustrações** | E, H | **web** + testes | — |
| **11 — Decisão** | 46 | Síntese, matriz de lacunas e ADR do modelo de jornada | A–D | interno | 39–43 |
| | 47 | Banco de questões v2 | A | interno | 46, 31, 32, 33 |
| | **59** | **Direção de arte e design system v2 no Claude Design (R2)** | H | **Claude Design** | 44, 46, 57 |
| | **60** | **Protótipos das telas no Claude Design (R2)** | H | **Claude Design** | 59 |
| **12 — Produção** | 48 | Roteiros das 3 mídias (ebook com capa, sumário e capítulos) | E | interno | 43, 46, 47 |
| | 49 | Brief e produção das peças no Claude Design | E | **Claude Design** + IA de imagem | 44, 48, 58, 59, 64 |
| | 50 | Revisão pedagógica, de linguagem e de acessibilidade | E | interno | 49 |
| | **61** | **Publicação do ebook na plataforma escolhida (R1)** | E | **plataforma** | 50, 58 |
| **13 — Implementação** | 51 | `UserProgress` v2 + migração | F | código | 45, 46 |
| | **62** | **Design system v2 em código: tokens, tema, tipografia, navegação e sobreposições (R2)** | H | código | 45, 60 |
| | **63** | **Novo visual nas telas existentes e ilustrações (R2)** | H | código | 62, 64 |
| | 52 | Hub `/materiais` e componentes, com ebook incorporado | F | código | 44, 50, 51, 61, 62 |
| | 53 | Ajustes de fluxo | B | código | 46, 51, 63 |
| | 54 | Remediação dirigida | F | código | 47, 52 |
| **14 — Validação** | 55 | E2E, axe, revisão visual e usabilidade | todas | interno + código | 52, 53, 54, 62, 63 |
| | 56 | Atualizar PRD, task-master e guia de estilo | todas | interno | 55 |

**Podem começar já (sem dependências):** 39, 40, 41, 43, 44, 45, 57, 58 e 64.

**Dois caminhos críticos, que se encontram na Task 52:**
- **Visual:** 57 → 59 → 60 → 62 → 63 → 53 → 55 → 56.
- **Conteúdo:** 43 → 46 → 48 → 49 (que também espera a 58 e a 59) → 50
  → 61 → 52 → 54 → 55.

> **O que mudou na ordem por causa de R1 e R2.** A produção das peças
> (Task 49) agora espera o design system v2 (Task 59) e a plataforma do
> ebook (Task 58): sem isso, a arte e o ebook seriam refeitos. As Tasks
> 52 e 53 esperam o novo visual (Tasks 62 e 63), porque mexem nos mesmos
> arquivos. Isso alonga o plano; foi aceito conforme a orientação de que
> tempo e refatoração não são problema quando levam ao objetivo.

> **Refatoração liberada.** A Task 51 redesenha o `UserProgress` com
> versão de esquema e com **listas** de vídeos e de materiais (a de
> vídeos, hoje, com um único item). Qualquer desfecho da decisão D5
> exige então uma única migração.

### Etapas externas

| Etapa | Ferramenta | O que entra | O que sai | Cuidado |
|---|---|---|---|---|
| Referências de mercado e de formatos | Web | critérios das frentes C, D e H | fichas e moodboard com fonte e data | citar fonte; copiar padrões, nunca marca, arte ou texto |
| Testes de capacidade | Claude Design | `docs/plano-testes-claude-design.md` | resultados e variante do plano | peças de teste com conteúdo fictício |
| Avaliação das plataformas de ebook | FlipHTML5 e Genially | `docs/plano-testes-plataformas-ebook.md` | plataforma escolhida e requisitos de incorporação | verificar plano gratuito, privacidade e acessibilidade antes de decidir |
| Design system e protótipos | Claude Design | referências e restrições de acessibilidade | tokens, componentes e telas aprovados por você | duas aprovações suas (A e B) |
| Avaliação de IAs de imagem | IA de imagem à sua escolha (você gera) | `docs/prompts-ilustracao.md` | imagens em `testes/imagens-ia/` e `registro.md` | conferir termos de uso comercial e custo |
| Produção de peças | IA de imagem (você gera) + Claude Design (composição) | roteiro + design system v2 + prompts | ilustrações, HQ, mapa e ebook compostos | arte sem texto na imagem; exportar com alt-text e roteiro textual |
| Publicação do ebook | FlipHTML5 ou Genially | ebook final | link público e código de incorporação | conta e plano são ação sua; manter a versão acessível no portal |
| Vídeo definitivo | Gravação (fora do repositório) | roteiro v2 revisado | `youtubeVideoId` real | **gate:** refazer a matriz da Task 39 contra a transcrição real |

---

## 9. Relação com as Tasks 30–38 já aprovadas

Com a D5 em aberto, **as Tasks 30, 34 e 36 permanecem exatamente como
estão no `task-master.md`**. As demais seguem sem mudança de escopo.

| Task existente | Situação | Observação |
|---|---|---|
| 30 — dividir vídeo em partes | **Inalterada; decisão adiada (D5)** | Depende do vídeo final. A Task 51 já prepara o modelo de dados para uma lista de vídeos |
| 31 — reformular Questão 3 | **Manter**; antes da Task 47 | Mesma superfície do banco v2 |
| 32 — exercício prático opcional | **Manter**; antes da Task 47 | Pode revelar lacunas de conteúdo |
| 33 — canal de contato | **Manter**; antes da Task 47 | Preserva a ordem pedida na aprovação da Task 34 |
| 34 — revisar todas as perguntas | **Inalterada; decisão adiada (D5)** | A Task 47 reescreve o banco; a divisão entre as duas será definida com a D5. A apresentação visual do enunciado também será coberta pelo redesign (Task 63) |
| 35 — legendas | **Manter bloqueada** | Depende do vídeo gravado |
| 36 — transcrição | **Inalterada; decisão adiada (D5)** | Hoje depende da Task 30 |
| 37 — flip card | **Manter**, mas decidir após a Task 60 | O redesign pode definir o padrão de cartões e interação |
| 38 — feedback pós-curso | **Manter**, sem dependência | Alimenta a Task 55 |

---

## 10. Decisões

### 10.1 Tomadas em 2026-11-04

| # | Decisão | Consequência no plano |
|---|---|---|
| **D1** | Materiais como **hub opcional**, com remediação dirigida | Tasks 52, 53 e 54 |
| **D2** | **Híbrido:** 4 questões-núcleo + variantes com cenário novo (8–12 itens) | Task 47 |
| **D3** | **Três mídias** no primeiro ciclo: mapa, quadrinho e ebook | Tasks 48–50, 52 e 61 |
| **D4** | **Montar o plano de testes** do Claude Design antes de fixar o formato das peças | Task 44 e `docs/plano-testes-claude-design.md` |
| **D0** | O Claude Design é o **Design interno ao Claude** (tipos "Design" e "Design System"); o avulso, que fecha em 14/12/2026, não é usado | Tasks 44, 49, 59 e 60 usam esses tipos de artefato; o formato real de saída é descoberto no CD-01 |
| **D6** | Ilustração **não é layout** no sentido do R2: Claude Design para layout, interação e composição; IA de imagem para a arte; imagem nunca leva texto dentro | Tasks 49, 63 e 64 |
| **D7** | O **usuário gera as imagens manualmente** na IA de sua preferência; Claude elabora os prompts e avalia o diretório entregue | Task 64; `docs/prompts-ilustracao.md` |
| **R1** | Ebook profissional e interativo, **publicado obrigatoriamente** em FlipHTML5 ou Genially | Tasks 43, 48, 49, 50, 52, 58 e 61 |
| **R2** | **Redesign completo** do layout via Claude Design, com as melhores referências do mercado | Tasks 57, 59, 60, 62, 63 e revisão das 44, 49, 52, 53 e 55 |

### 10.2 Em aberto: D5 — Tasks 30, 34 e 36 (dependem do vídeo final)

**Por que não dá para decidir agora.** O vídeo definitivo ainda não foi
produzido. A Task 30 só pode ser avaliada com a duração e a estrutura
reais da gravação. A Task 34 deve ser feita sobre um banco já conferido
contra o que o vídeo de fato diz. A Task 36 depende da 30.

**O que isso não bloqueia.** Nada dos dois caminhos críticos.

**O que fica como pendência explícita.**
1. **Gate pós-gravação:** com o vídeo final, refazer a matriz da Task 39
   contra a transcrição real e ajustar o banco v2 onde divergir.
2. **Retomar a D5** nesse momento: dividir ou não o vídeo (Task 30);
   como separar conteúdo e apresentação do enunciado entre as Tasks 34 e
   47; transcrição única ou por vídeo (Task 36).
3. **Risco de reescrever o banco duas vezes** se o vídeo divergir muito
   do roteiro v2. Mitigação: a Task 47 mantém rastreabilidade por trecho
   do roteiro.

### 10.3 Pontos de aprovação que dependem de você

| Ponto | Quando | O que você decide |
|---|---|---|
| **A — direção de arte** | fim da Task 59 | Qual das três explorações visuais seguir e se a paleta atual é mantida, evoluída ou substituída |
| **B — protótipos** | fim da Task 60 | Se as telas, a navegação e as sobreposições estão aprovadas para ir ao código |
| **C — plataforma do ebook** | fim da Task 58 | FlipHTML5 ou Genially, com base nos resultados dos testes e no custo do plano |

### 10.4 D6 e D7 — IA de geração de imagem para as ilustrações (resolvidas)

> **Resolvido em 2026-11-04.** **D6 confirmada:** ilustração não é
> "layout" no sentido do R2; o Claude Design cuida de layout, interação
> e composição, e uma IA de imagem cuida da arte. **D7 decidida de outra
> forma que a recomendada:** o **usuário gera as imagens manualmente**,
> na IA de sua preferência, e informa o diretório; Claude elabora os
> prompts (`docs/prompts-ilustracao.md`) e avalia o que for entregue,
> sem gastar créditos pagos. O texto a seguir é o registro da análise
> original.

**O que a avaliação visual mostrou (2026-11-04).** Na HQ, a personagem
parece a mesma nos 6 quadros, mas o design está muito aquém do nível
profissional esperado. No mapa, a navegação por teclado funciona, mas o
layout é limitado. No ebook, exibir todas as páginas de uma vez não é a
melhor abordagem. O Claude Design, como foi usado (HTML e SVG desenhado
em código), serve para estrutura e interação, mas não ilustra.

#### D6 — Divisão de papéis entre o Claude Design e uma IA de imagem

**A situação.** O requisito R2 manda reelaborar o **layout** via Claude
Design. As ilustrações (personagem, cenas, capas) são **conteúdo**, não
layout, e é nelas que a ferramenta ficou aquém. Há três caminhos: manter
tudo no Claude Design (A), usar o Claude Design para layout e uma IA de
imagem para a arte (B), ou deixar a IA de imagem também compor texto e
páginas (C).

**Minha recomendação é a B, com uma regra firme: a imagem nunca leva
texto dentro.** Balões, legendas, ícones e diagramas ficam em HTML ou
SVG vivo, o que preserva acentuação, edição, leitor de tela e tradução.
O caso IM-03 verifica se a IA consegue entregar arte limpa, sem texto
distorcido. O ebook passa a ser **uma página por prancheta**, exportada
em PDF e lida página a página na plataforma, como você apontou.

**O que isso custa.** Uma segunda ferramenta, custo por imagem,
consistência de estilo entre duas ferramentas (a paleta do design system
v2 vai nos prompts) e a conferência dos direitos de uso. **Preciso que
você confirme a interpretação** de que ilustração não é "layout" no
sentido do R2; se discordar, o R2 limita as opções à opção A.

#### D7 — Quais ferramentas avaliar e quem arca com o custo

**A situação.** Daqui eu consigo acionar a geração de imagens do Figma,
com quatro modelos, mas ela é **paga**: cada chamada consome créditos do
plano do arquivo Figma, e o custo varia por modelo. Higgsfield e Canva
estão conectados, mas pedem autenticação sua. Você também pode já usar
uma ferramenta externa.

**Minha recomendação:** começar pela do Figma, com **dois modelos** e um
conjunto mínimo (uma ficha de personagem, 6 cenas e 7 elementos de mapa e
ebook), e, em paralelo, você gerar as mesmas peças na ferramenta que
preferir, com **os mesmos prompts**, para a comparação ser justa. **Não
gero nada sem a sua permissão**, e preciso saber qual arquivo e plano
Figma usar e se há limite de créditos.

---

## 11. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Vídeo gravado difere do roteiro v2 | Retrabalho no banco v2 | Gate pós-gravação (10.2); rastreabilidade por trecho |
| Claude Design não atende (formato, fidelidade, licença ou tokens) | Atrasa 49, 59 e 60; **R2 exige a ferramenta** | Testes da Task 44 antes de tudo; **se falharem, parar e consultar você** antes de trocar de ferramenta |
| Ebook em plataforma de terceiros com limitações de acessibilidade ou de privacidade | Regressão frente ao compromisso WCAG 2.1 AA do portal e à LGPD | Task 58 mede antes de escolher; o portal oferece **também** uma versão acessível (HTML ou PDF) ao lado da versão interativa |
| Plano gratuito da plataforma com marca d'água, anúncios ou limite de publicações | Aparência não profissional | Verificado na Task 58; custo do plano é decisão sua no ponto C |
| Redesign regride a acessibilidade | Perda do ponto mais maduro do portal | Contraste verificado antes da aprovação (A e B); axe em todas as combinações na Task 55 |
| Redesign copia concorrentes | Perda de autenticidade e risco autoral | Referências para padrões, não para identidade |
| Redesign alonga o caminho crítico | Entrega mais tardia | Aceito (tempo não é restrição); fases 10 e 11 em paralelo |
| Peças "revelam" respostas do quiz | Invalida a avaliação | Cenário novo (frente A, passo 5) + Task 50 |
| Mudança do `UserProgress` corrompe progresso salvo | Perda de dados do aluno | Esquema versionado + migração + teste com `localStorage` antigo (Task 51) |
| Testes atuais não são reproduzíveis | Regressões não detectadas | Task 45 |
| Next.js desta versão difere do conhecido | Retrabalho de código | Ler `node_modules/next/dist/docs/` antes de cada task de código |
| Dependências não instaladas neste clone (`node_modules` ausente) | Nenhum build, lint ou teste roda | `npm install` antes da Task 45 |
| IA de imagem não atinge o nível profissional ou perde a consistência entre cenas | Atrasa as Tasks 49 e 63 | Avaliação em 3 etapas na Task 64, com 3 estilos na Etapa 1; julgamento final do usuário |
| Espaços de imagem exibem rótulos de desenvolvimento aos alunos em produção | Aparência de produto inacabado | Task 63; se demorar, esconder antes só a dica de caminho |
| Documentos divergem entre si ou do código | Decisões baseadas em informação velha | `node testes/consistencia/verificar-docs.js` a cada atualização (script `docs:check` na Task 45) |

---

## 12. Próximo passo

1. As Tasks 39–64 estão no `task-master.md` e o PRD tem a seção 9.3.
   **Concluídas:** 39, 40, 42 e 45.
2. **Em andamento:** a Task 41 (benchmark de concorrentes: matriz
   incompleta), a Task 43 (engenharia reversa: fichas e templates
   entregues, falta evidência de quadrinho e ebook), a Task 44 (testes do
   Claude Design; CD-01, 03, 04, 05 e 15 registrados, variante V6
   indicada), a Task 57 (referências visuais: entregues sem ver a
   aparência) e a Task 64 (prompts prontos, aguardando as imagens da
   Etapa 1, geradas por você).
3. **Sem dependência pendente:** 58, e, entre
   as tasks da Fase 9, 31, 32, 33, 37 e 38.
4. **Decisões suas pendentes:** D5 (Tasks 30, 34 e 36); a correção do
   roteiro (D-08 e D-09, da Task 39); e, quando chegar a hora, os pontos
   de aprovação A (direção de arte), B (protótipos) e C (plataforma do
   ebook).
5. **Ebook (versão definitiva, 2026-11-05):** produzido antes de a Task 48
   ser liberada: roteiro `conteudo/ebook/roteiro.md`, leitor em
   `public/ebook/leitor.html` (18 páginas, um elemento interativo por
   capítulo, cenas da Marina com a pergunta-foco como balão de fala) e PDF
   `public/ebook/ebook-planejar-com-ia.pdf` para importar no FlipHTML5 ou
   no Genially. **Está no portal:** a rota pública `/ebook` incorpora o
   leitor, fora da jornada (não altera o progresso), com entradas na página
   inicial (cartão em destaque e menu superior) e no cabeçalho da jornada.
   Usa a mesma fonte do portal (Arial).
   Pendências: revisão por educadores (Task 50), redesenho via Claude Design
   (R2, Tasks 59 e 49), publicação em plataforma (Tasks 58 e 61) e a
   correção do D-08 no vídeo, que ainda chama a viabilidade de "segunda
   lente". O hub `/materiais` da Task 52 vai absorver a rota.
6. **Mapa interativo (2026-11-05), segundo artefato:** roteiro
   `conteudo/mapa/roteiro.md` e rota `/mapa`, nativa no portal (não é
   `iframe`), com percurso guiado, lista alternativa e caso de exemplo de
   horta em casa. E-book e mapa são os destaques da tela principal e do
   menu superior. Faltam as ilustrações dos nós (seção 5.4 de
   `docs/prompts-ilustracao.md`), a revisão (Task 50) e o redesenho (R2).
   O quadrinho é o terceiro artefato.
7. **Pendência a analisar (UX-20):** o ebook em `/ebook` usa mal o espaço
   vertical (cabeçalho do portal, linha de título, barra e rodapé do
   leitor; sobram ~50% da janela em um notebook) e obriga a rolar. Medições
   e direções possíveis em `docs/revisao-fluxo-ux.md`; sem decisão.
