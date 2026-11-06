# Plano de implementação do fluxo v3

> Criado em 2026-11-06. **Plano, nada implementado.** Parte das decisões
> registradas na seção 7 de `docs/revisao-fluxo-ux.md` e dos protótipos
> aprovados (cópia estática em `testes/claude-design/prototipos-fluxo/index.html`).
> Os prompts e critérios dos protótipos estão em
> `docs/prompts-claude-design-fluxo.md`.

## 1. Resumo

O portal deixa de ser uma jornada guardada (vídeo, avaliação, relatório, uma
etapa de cada vez, com nome obrigatório) e vira uma **trilha sugerida e livre**
com cinco itens: vídeo, e-book, mapa, avaliação e relatório. Cada item tem a
sua rota, o progresso é visível em todas as páginas, e uma página "Quem somos"
fica fora da trilha.

**Recomendação de entrega: três Pull Requests**, para não gerar deploys à toa
(ver a memória sobre economia de deploys), cada um com o `main` verde:

| PR | Conteúdo | Tasks | Complexidade |
|---|---|---|---|
| **A** | Progresso v2, fluxo livre, cabeçalho A, primeira tela com a trilha, régua de acessibilidade, barra inferior no celular e fim do botão de PDF | 66, 67, 65 | 7 + 8 + 2 |
| **B** | Linguagem visual (gradientes, sombras, pílulas de estado) e relatório com "Seu percurso" e links para os materiais | 68, 70 | 6 + 5 |
| **C** | Página "Quem somos" e seus pontos de acesso | 69 | 4 |

O PR C **depende de dados do autor** (seção 9). Os PRs A e B não dependem.

## 2. O que muda e o que fica

| Ponto | Hoje | Depois |
|---|---|---|
| Acesso às etapas | Um guarda redireciona para a única etapa corrente | **Todas as rotas livres**; a ordem é só sugestão |
| Identificação | Nome obrigatório para iniciar | **Sem nome**; só se houver certificado, no futuro |
| Modelo de progresso | Uma etapa corrente, vídeo concluído e resultado | **Estado por item**, com a unidade vista de cada material |
| Cabeçalho | Dois: um da jornada (com "Olá, nome") e um público | **Um só**, variante A, com a trilha e o percentual |
| Acessibilidade | Gaveta aberta por uma aba lateral | **Régua sempre visível** (e painel expandido em telas largas) |
| Vídeo | Etapa 1, com botão "Concluir" que libera a avaliação | **Item 1 desativado** até existir o link do YouTube |
| Relatório | Só existe com resultado | **Conta como visto ao abrir**; sem resultado, mostra estado vazio |
| Retomada | Redireciona da página inicial para a etapa | **Primeira tela sempre exibida**, com "Continuar" |
| Quadrinho | Rota pública e item do menu | **Rota existe, fora da trilha** e sem link na navegação |

## 3. Estado atual do código (o que foi lido)

- **Progresso:** `types/progress.ts` guarda `userId`, `userName`, `currentStep`
  (`video`, `avaliacao`, `relatorio`), `videoCompleted` e `assessmentResult`.
  A persistência é `services/user-progress/LocalStorageUserProgressRepository.ts`,
  na chave `ead-portal:user-progress`, sem número de versão.
- **Guarda:** `lib/journey/useJourneyGuard.ts` redireciona cada rota interna para
  a etapa corrente; `components/public/WelcomeHero.tsx` redireciona quem já tem
  progresso e contém o formulário de nome.
- **Cabeçalhos:** `components/journey/JourneyLayout.tsx` (nome, indicador de três
  etapas, links de e-book e mapa, botão "Início" que apaga tudo) e
  `components/public/PortalHeader.tsx` (menu de materiais com `aria-current`).
  Cada página monta o seu cabeçalho.
- **Acessibilidade:** `components/accessibility/AccessibilityControls.tsx` é uma
  gaveta (`Drawer`) aberta por uma aba vertical; os três controles
  (`FontSizeControl`, `HighContrastToggle`, `ThemeToggle`) já existem e servem de base.
- **Materiais:** o e-book é o leitor estático `public/ebook/leitor.html` (18
  páginas, hash `#pN` já lido na abertura), dentro de um `iframe` da mesma origem;
  o mapa é `components/materials/ConceptMap.tsx` (quatro elementos); o quadrinho é
  `components/materials/ComicReader.tsx`. **Nenhum deles registra o que foi visto.**
- **Vídeo:** `content/module.ts` tem `youtubeVideoId: null`; hoje o botão
  "Concluir" é o que libera a avaliação.
- **Testes:** 46 unitários (Vitest), E2E e axe (Playwright) em `tests/`. Os
  arquivos que seguram o modelo antigo são `tests/helpers/progress.ts`,
  `tests/unit/userProgressRepository.test.ts`, `tests/e2e/jornada.spec.ts` e
  `tests/a11y/axe.spec.ts`.
- **Next.js:** versão 16.3.6, com guias em `node_modules/next/dist/docs/`. O
  `AGENTS.md` manda **ler o guia relevante antes de codar**; a leitura de
  layouts, grupos de rotas, componentes de servidor e de cliente e metadados faz
  parte do passo A5 e do PR C.

## 4. Decisões técnicas

### 4.1 Modelo de progresso v2

Esquema versionado, na mesma chave, sem `userId` nem `userName`:

```ts
interface ProgressV2 {
  version: 2;
  updatedAt: string | null;                       // nulo enquanto não houver progresso
  video: { percent: number; positionSeconds: number };
  mapa: { elementsSeen: MapNodeId[] };            // 4 elementos
  avaliacao: { answers: Record<string, number>;   // pergunta -> alternativa confirmada
               result: AssessmentResult | null };
  relatorio: { openedAt: string | null };
}
// O e-book não entra aqui: ver 4.2. A interface lê `ProgressSnapshot`, que soma
// `ebook: { pagesSeen: number[] }` a este modelo. Não há `createdAt`: nada o usa.
```

**Regras de cálculo** (módulo puro, sem React, fácil de testar):

- Percentual por item: vídeo, o assistido; e-book, páginas vistas de 18; mapa,
  elementos vistos de 4; avaliação, perguntas confirmadas de 4; relatório, 100
  ao abrir.
- Estado: não iniciado (0), em andamento (1 a 79), **concluído a partir de 80**
  (e-book: 15 páginas; avaliação: 4 de 4, pois 3 de 4 é 75).
- **Progresso geral** é a média dos itens **disponíveis**; o vídeo fica de fora
  enquanto `youtubeVideoId` for nulo.
- **Próximo sugerido** é o primeiro item disponível, na ordem da trilha, que
  ainda não está concluído.
- O chip mostra o **percentual real**, e o ícone de confirmação aparece a partir
  de 80. Nos protótipos só aparecem casos de 100%; esta é a regra para os demais.

**Migração v1 para v2** (uma vez, na primeira leitura, regravando em v2):

| Campo v1 | Vira em v2 |
|---|---|
| `videoCompleted` | `video.percent` 100 se verdadeiro, senão 0 |
| `assessmentResult` | `avaliacao.result`, e `avaliacao.answers` derivado de `result.answers` |
| `currentStep` igual a `relatorio` | `relatorio.openedAt` recebe `updatedAt` |
| `userId`, `userName` | descartados |
| (e-book e mapa) | vazios: o modelo antigo nunca os registrou |

Conteúdo ilegível ou de versão desconhecida devolve "sem progresso", sem lançar erro
(comportamento atual, mantido e testado).

### 4.2 Como cada material informa o que foi visto

| Material | Unidade | Quem registra | Como |
|---|---|---|---|
| E-book | Páginas | O próprio `leitor.html` | Grava a lista de páginas numa chave própria (`ead-portal:ebook-pages`) a cada página exibida |
| Mapa | Elementos | `ConceptMap` | Ao escolher um elemento (mapa, lista ou percurso guiado) |
| Avaliação | Perguntas | `ModuleAssessmentStep` | Ao confirmar cada resposta; retoma ao recarregar (resolve o UX-04) |
| Relatório | Abertura | A página `/relatorio` | Ao montar |
| Vídeo | Percentual | `VideoPlayer` | Só quando houver link |

**Por que o e-book usa chave própria:** o leitor é um HTML estático e não importa
código do projeto. Uma chave simples funciona tanto dentro do portal quanto na
**tela cheia**, que abre sem o portal em volta. O repositório junta as duas fontes
na leitura e apaga as duas em "Apagar meu progresso". A alternativa, `postMessage`
para a página hospedeira, deixaria a tela cheia sem registro.

**Leitura na interface:** um hook baseado em `useSyncExternalStore`, que escuta o
evento `storage` (mudanças vindas do leitor no `iframe` e de outras abas) e um
evento próprio disparado a cada escrita. Evita o padrão de `setState` dentro de
`useEffect`, que o lint do projeto já proíbe, e a diferença de renderização entre
servidor e cliente.

### 4.3 Rotas e estrutura

- Um **grupo de rotas** com layout compartilhado hospeda o cabeçalho, a régua e a
  barra inferior uma vez só. As páginas passam a entregar apenas o conteúdo, e o
  item atual vem do caminho da URL. Ganho: um único cabeçalho, sem remontar a cada
  navegação, e fim da duplicação entre `JourneyLayout` e `PortalHeader`.
- Rotas: início, vídeo, e-book, mapa, avaliação, relatório, quadrinho (fora da
  trilha) e, no PR C, "Quem somos". **Nenhuma redireciona.**
- O link "Quem somos" só aparece no cabeçalho quando a página existir (PR C), para
  não publicar um link quebrado. O componente já nasce com o espaço reservado.

### 4.4 Vídeo desativado

- Cabeçalho: `<button disabled>`, cinza, sem pílula "Em breve".
- Cartão da trilha: seção cinza, botão desativado e o selo "Em breve".
- Barra inferior e régua larga: item sem link, com `aria-disabled`.
- Rota de vídeo: continua existindo e mostra um aviso "Em breve", sem o botão
  "Concluir". Ao colocar o link do YouTube em `content/module.ts`, o item fica
  ativo e entra na média sem outra mudança de código.

### 4.5 Relatório com links para os materiais

O mapeamento segue a **matriz de cobertura** de `conteudo/ebook/roteiro.md`
(seção 8) e de `conteudo/mapa/roteiro.md`:

| Pergunta | Competência | E-book (páginas) | Mapa |
|---|---|---|---|
| 1 | Alinhamento pedagógico | Capítulo 1 (4 a 6) | Objetivos, Atividades, Avaliação |
| 2 | Comandos para a IA | Capítulo 2 (7 a 9) | (nenhum) |
| 3 | Curadoria da IA | Capítulo 3 (10 a 12) | Falha típica de cada elemento |
| 4 | Papel do educador | Capítulo 4 (13 a 15) | (nenhum) |

- Um arquivo de conteúdo novo guarda `{ pergunta: [{material, destino, rótulo}] }`,
  e um teste garante que toda pergunta tem ao menos uma referência e que páginas e
  elementos existem.
- **Links profundos:** `/ebook#p4` precisa repassar o hash ao `iframe` (hoje o
  `src` é fixo), e `/mapa#objetivos` precisa pré-selecionar o elemento.
- **Atenção:** no protótipo do relatório usei competências ("Público", "Objetivos",
  "Atividades") e frases de exemplo que **não são as das perguntas reais**. O
  protótipo vale para o layout; o conteúdo real vem da tabela acima e dos
  comentários já existentes em `content/module.ts`.

### 4.6 Acessibilidade e responsividade

- **Régua** (abaixo de 1500 px): controles de fonte menor e maior, contraste e
  tema, sempre visíveis, no lado direito. Substitui a gaveta e a aba lateral.
- **A partir de 1500 px:** régua da trilha à esquerda e painel expandido à direita
  (controles completos e "Nesta página", só na página inicial).
- **Celular** (abaixo de 768 px): topo de 48 px, **barra fixa inferior** com os
  cinco itens (alvo mínimo de 44 px) e os quatro controles em uma linha acima dela.
- Entre 768 e 1200 px o cabeçalho **quebra em duas linhas** em vez de esconder
  itens, como no protótipo com fonte a 125%.
- Semântica: `nav` com `aria-label`, `aria-current` no item atual, `aria-disabled`
  no vídeo, "Quem somos" com `aria-current` na própria página.

### 4.7 Linguagem visual (PR B)

Tokens novos em `app/globals.css`: sombra de cartão, gradientes (cabeçalho, botão
primário, barras de progresso, fundo da página, faixas de destaque) e as três
tintas de estado (verde, vermelho e dourado). Regras já aprovadas: sem faixa
colorida na lateral, sem caixa chapada de 1 px, gradiente só onde o contraste
aguenta, e subtítulo só quando diz algo que o título não diz.

**Degradação obrigatória:** no **alto contraste** os gradientes e as sombras viram
cor sólida com borda forte, e no **tema escuro** cada token ganha a sua versão.
A matriz do axe cobre 12 combinações de tema, contraste e fonte; texto sobre
gradiente o axe marca como "incompleto" e não como violação, então o contraste
dessas áreas precisa de **conferência manual** (cartão de resultado e banners).

### 4.8 Página "Quem somos" (PR C)

Página de servidor, com metadados, e um único componente de cliente (o botão
"Copiar referência"). Conteúdo em um arquivo próprio, com os campos do autor
ainda vazios. Seções: banner, cartão do autor, "Sobre o autor", "Por que este
portal existe", "Sobre o portal", "Seus dados", "Acessibilidade", "Créditos",
"Como citar" e a faixa de volta à trilha. Acesso: cabeçalho (extremo direito),
rodapé da primeira tela e, no celular, ao lado de "Apagar meu progresso".

## 5. Entregas

### PR A: fluxo livre com a trilha (Tasks 66, 67 e 65)

Passos, cada um em um commit com testes verdes:

1. **Modelo v2 e repositório.** Tipos, operações novas (registrar página, elemento,
   resposta, abertura do relatório, vídeo; refazer avaliação; apagar tudo),
   migração e testes unitários com fixtures do formato antigo.
2. **Regras da trilha e hook de leitura.** Percentual, estado, geral e próximo
   sugerido, com testes (inclui a exclusão do vídeo e o limiar de 80).
3. **Registro do que foi visto.** Leitor do e-book, mapa, avaliação (com retomada) e
   relatório; página de vídeo com o aviso "Em breve".
4. **Fim do guarda e do nome.** Rotas livres, formulário e redirecionamentos fora,
   saudação fora. Interface provisória e neutra enquanto os passos 5 e 6 não entram.
5. **Cabeçalho A e layout compartilhado.** Grupo de rotas, trilha com pílulas, vídeo
   desativado, progresso geral, quebra de linha e ajustes de fonte grande.
6. **Primeira tela.** Texto principal, botão contextual ("Começar pelo e-book" ou
   "Continuar: ..."), cartão da trilha com o item sugerido destacado, "Apagar meu
   progresso" com confirmação e a ilustração principal.
7. **Régua, barra inferior e telas largas.** Substitui a gaveta, entrega o painel
   do celular e as duas réguas de 1500 px ou mais.
8. **Fim do PDF (Task 65), testes e documentos.** Botão e arquivo fora, E2E e axe
   adaptados, PRD, plano e task-master atualizados.

**Andamento do PR A (atualizado em 2026-11-06):**

| Passo | Situação | Observação |
|---|---|---|
| 1 | **Feito** | Modelo v2, migração e repositório, com testes. Entrou **só aditivo**: o repositório novo (`progressRepository`) vive ao lado do antigo e ainda não é usado pela interface, porque o guarda, o formulário de nome e os cabeçalhos atuais ainda leem o formato v1 na mesma chave. O repositório antigo sai no passo 4. |
| 2 | **Feito** | Regras da trilha (percentual por item, concluído a partir de 80, geral sem o vídeo, próximo sugerido) e o hook que lê o progresso. O repositório ganhou uma leitura estável (`getSnapshot`, que devolve o mesmo objeto enquanto nada muda) e uma assinatura (`subscribe`), que o React exige: sem o cache a tela entraria em laço de renderização. Ainda sem uso nas telas. |
| 3 e 4 (juntos) | **Feito** | Registro do que foi visto e fim do guarda. **E-book:** o leitor grava a página exibida na chave própria. **Mapa:** o elemento conta ao ser escolhido (diagrama e percurso guiado) e, **na lista, quando o título aparece na tela** (decisão minha: em telas pequenas a lista é a única forma e não há o que clicar). **Avaliação:** cada resposta é salva ao confirmar, e a página retoma da primeira pergunta sem resposta. **Relatório:** conta como visto ao abrir; sem resultado, mostra o estado vazio com o caminho para a avaliação. **Vídeo:** página "Vídeo em breve", sem o botão "Concluir". **Saíram:** o guarda, o formulário de nome, os redirecionamentos, o indicador de três etapas, o repositório antigo e o esqueleto de vídeo. **Entraram, em versão provisória até os passos 5 e 6:** a navegação da trilha no cabeçalho da avaliação, do relatório e do vídeo, e uma lista simples da trilha na primeira tela. O botão "Reiniciar jornada" virou "Refazer a avaliação" (só a avaliação) e o "Início" virou "Apagar meu progresso". |
| 5 a 8 | A fazer | |

**Ajuste de ordem nos passos 3 e 4:** registrar o que foi visto (3) grava no formato v2, e
o guarda atual (4) ainda lê o v1 na mesma chave. Os dois só ficam verdes **juntos**, então
viram um passo só: "registro do que foi visto e fim do guarda". O passo 2 (regras da trilha
e hook) não depende disso e segue antes.

**Remove:** `useJourneyGuard`, `ProgressIndicator`, `HomeResetButton` (vira o
"Apagar meu progresso" da primeira tela), `RestartJourneyModal` (a refação passa a
ser só da avaliação), a gaveta de acessibilidade e o formulário de nome.
**Cria:** módulo das regras da trilha, hook de progresso, cabeçalho e trilha,
cartão da trilha, régua e barra inferior.

### PR B: visual e relatório (Tasks 68 e 70)

1. Tokens e degradação (escuro e alto contraste).
2. Cartões, pílulas de estado, fim das faixas laterais e limpeza de subtítulos nas
   telas existentes.
3. Mapeamento pergunta para material, hash repassado ao `iframe` do e-book e ao
   mapa, relatório com "Seu percurso", estado vazio e chips com link.
4. Testes e conferência manual de contraste.

### PR C: Quem somos (Task 69)

1. Conteúdo, página, banner e seções, botão de copiar.
2. Link no cabeçalho, no rodapé e no celular.
3. Testes, axe e metadados.

**Não entra aqui:** novo banco de questões (Task 47), produção de ilustrações
(Tasks 49, 63 e 64), publicação do e-book numa plataforma externa (Tasks 58 e 61)
e o vídeo em si.

## 6. Impacto nos testes

| Arquivo | O que acontece |
|---|---|
| `tests/unit/userProgressRepository.test.ts` | Reescrito para o modelo v2, com migração e conteúdo corrompido |
| Testes unitários novos | Regras da trilha; mapeamento pergunta para material |
| `tests/helpers/progress.ts` | `seedState` ganha estado v2 (páginas, elementos, respostas, relatório) e modo "legado" |
| `tests/e2e/jornada.spec.ts` | Saem os testes do guarda, da identificação e da retomada por redirecionamento; entram rotas livres, progresso por item, retomada das respostas (hoje `fixme`), relatório contado ao abrir e estado vazio, vídeo desativado, migração, "Apagar meu progresso", barra inferior no celular e réguas largas |
| `tests/e2e/ebook.spec.ts`, `mapa.spec.ts`, `quadrinho.spec.ts` | Ajustes de menu e de cartões da primeira tela; fim do download de PDF (Task 65); registro de páginas e elementos |
| `tests/a11y/axe.spec.ts` | Telas semeadas no modelo novo, régua no lugar da gaveta e a página "Quem somos" na matriz de 12 combinações |

Os dois testes `fixme` do UX-01 e do UX-04 passam a valer.

## 7. O que acontece com as tasks existentes

| Task | Proposta |
|---|---|
| 46 (ADR do modelo de jornada) | Superada: a seção 7 de `docs/revisao-fluxo-ux.md` e este plano fazem o papel do ADR |
| 51 (`UserProgress` v2) | Absorvida pela **Task 66** |
| 52 (hub de materiais) | Cancelada, pois não há hub; a **Task 67** entrega a trilha na primeira tela |
| 53 (ajustes de fluxo) | Absorvida pela **Task 66** (guarda, rever o vídeo) |
| 54 (remediação no relatório) | A parte dos links sai na **Task 70**; o resto segue |
| 59 e 60 (design system e protótipos) | Parcialmente atendidas pelos protótipos aprovados; falta decidir se fecham |
| 62 e 63 (design system em código e novo visual) | A **Task 68** entrega a base; sobram detalhes e ilustrações |
| 55 (validação final) | Continua, e passa a depender das Tasks 66 a 70 |
| 65 (remover o PDF) | Entra no PR A |

Nada disso foi alterado nos status das tasks existentes: aguarda confirmação.

## 8. Riscos

| Risco | Mitigação |
|---|---|
| Registro de páginas pelo leitor estático dentro do `iframe` | Teste E2E que lê a chave após virar páginas, nos dois contextos (no portal e em tela cheia) |
| Diferença de renderização entre servidor e cliente no cabeçalho com progresso | Leitura por `useSyncExternalStore` com valor inicial vazio no servidor |
| Gradiente reduz o contraste e o axe não acusa | Conferência manual das áreas com texto sobre gradiente; alto contraste sem gradiente |
| Cabeçalho largo demais entre 768 e 1200 px e com fonte grande | Quebra em duas linhas; teste visual com fonte a 125% |
| PR A grande | Oito passos em commits independentes, com testes verdes em cada um |
| Quem perdeu o estado antigo ao migrar | Fixtures do formato v1 nos testes; o que o modelo antigo nunca registrou (e-book, mapa) começa vazio |
| Link "Quem somos" quebrado antes do PR C | O link só é renderizado quando a rota existir |

## 9. Decisões que dependem do usuário

1. **Ilustração principal na primeira tela.** Nos protótipos de 1366 px ela não
   aparece (a trilha ocupa a coluna da direita); só a tela larga a mostra, como
   espaço reservado. **Recomendação:** acima de 1500 px ela fica ao lado do texto,
   como no protótipo largo, e abaixo disso ela some da primeira tela, para a trilha
   não ser empurrada. A alternativa é um banner estreito sob o título.
2. **Controles de acessibilidade no celular fora da primeira tela.** Os protótipos
   só mostram a linha de controles na primeira tela. **Recomendação:** repetir a
   linha no fim do conteúdo de cada página, acima da barra inferior.
3. **Reescopo das tasks da seção 7.** Confirmar antes de eu alterar status.
4. **Agrupamento em três PRs** (A, B e C), contra cinco PRs menores. Cada PR a mais
   é um deploy a mais; a recomendação é três.
5. **Dados do autor, só para o PR C:** quem é (pessoa ou equipe), e-mail e perfil
   para contato, e quem assina conteúdo, ilustrações e revisão pedagógica.

## 10. Como validar cada entrega

Todos pelos scripts do projeto, com o `main` verde antes de abrir o PR:

- `npm run lint`, `npm test`, `npm run build`
- `npm run test:e2e` e `npm run test:a11y`
- `npm run docs:check`

Merge manual pelo usuário e verificação da produção depois de cada PR, como combinado.
