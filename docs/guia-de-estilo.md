# Guia de Estilo — Portal de Planejamento Pedagógico para EaD

> Gerado em: 2026-10-18 (Task 28, `task-master.md`)
> **Aviso (2026-11-04):** este guia descreve o design **atual**. O
> requisito R2 (`plano-evolucao-v2.md`) reelabora cores, fontes, formatos
> e componentes via Claude Design; as Tasks 59 (design system v2), 62 e
> 63 o substituem, e a Task 56 o aposenta em favor de
> `docs/design-system-v2.md`. Até lá, vale o que está aqui e no código.
> Extraído de `app/globals.css`, `package.json` e dos componentes em
> produção — documentação pura, nenhuma decisão nova. Se este guia um dia
> divergir do código, **o código é a fonte da verdade**; atualize este
> arquivo para refletir a mudança.

Este documento existe para que a identidade visual do portal não precise
ser redescoberta lendo CSS/componentes a cada novo módulo ou
colaborador — especialmente relevante se um segundo módulo for criado
(PRD seção 9, item 2).

---

## 1. Paleta de cores

O portal usa os tokens nativos do **HeroUI** (`@import "@heroui/styles"`)
como base, com dois tokens de marca próprios e alguns remapeamentos
definidos em `app/globals.css`.

### 1.1 Tokens de marca (não existem no HeroUI)

| Token | Valor | Uso |
|---|---|---|
| `--brand` | `#0b2545` (marinho) | Fundo de cabeçalhos (`JourneyLayout`), ícones em destaque sobre fundo claro, rodapé de CTA |
| `--gold` | `#c9a227` (dourado) | Borda inferior dos cabeçalhos, detalhe decorativo, texto/ícone **somente sobre `--brand`** |

**Regra de uso do dourado:** nunca como cor de texto sobre fundo branco —
contraste de só 2,4:1, abaixo do mínimo AA (4,5:1). Só é seguro sobre
`--brand` (6,4:1) ou como elemento puramente decorativo (ícone, borda).

### 1.2 Tokens remapeados do HeroUI

Redefinidos em `:root` para usar a paleta marinho/dourado/verde no lugar
das cores padrão da biblioteca — com uma variante dedicada para o tema
escuro, onde o marinho perde contraste contra o fundo:

| Token | Tema claro | Tema escuro | Razão de contraste (texto sobre o token) |
|---|---|---|---|
| `--accent` | `#0b2545` | `#3f74b8` | 15,4:1 (claro, com `--accent-foreground` branco) / 4,8:1 (escuro) |
| `--accent-foreground` | `#ffffff` | (herdado) | — |
| `--accent-hover` | (padrão do HeroUI) | `#305fa3` | Fundo do botão primário no hover. O padrão do HeroUI clareia (no escuro, `#5282c0` com branco = 3,95:1, reprovado); aqui escurece levemente (6,4:1) |
| `--success` | `#157347` | `#4ade9b` | 5,9:1 (claro) / 8,9:1 (escuro, com `--success-foreground` escuro) |
| `--success-foreground` | `#ffffff` | `#062b1b` | — |
| `--warning` | `#c9a227` (= `--gold`) | (herdado) | 6,4:1 com `--warning-foreground` marinho |
| `--warning-foreground` | `#0b2545` (= `--brand`) | (herdado) | — |
| `--danger` | `#b91c1c` | `#b91c1c` (o valor do tema claro vaza para o escuro) | Para **fundos e bordas** (botão de perigo: branco sobre ele, 6,5:1). Ajustado na Task 18 para atingir AA |
| `--danger-text` | `#b91c1c` | `#f87171` | Para **texto** vermelho. No tema escuro, `#b91c1c` sobre `#28181b` mede só 2,6:1 (reprovado); `#f87171` mede 6,1:1. Não use `--danger` como cor de texto |
| `--background` | `#f5f7fa` | (padrão do HeroUI) | só o tema claro foi ajustado |
| `--muted` | `#52525b` | (padrão do HeroUI) | o padrão do HeroUI no tema claro só atinge 4,43:1 — abaixo de AA |

**Nunca redefinir `--background`/`--foreground` em `:root` sem
`[data-theme="..."]`** — isso já quebrou o dark mode uma vez (Task 18):
uma regra incondicional em `:root` sobrescreve os blocos
`[data-theme="dark"]` nativos do HeroUI por especificidade/ordem, e o
tema para de mudar visualmente.

**Tokens usados sem remapeamento** (herdados diretamente do tema
claro/escuro nativo do HeroUI, sem override do portal): `--surface`,
`--surface-secondary`, `--surface-secondary-foreground`, `--border`,
`--focus`, `--foreground`. Se um desses um dia precisar de ajuste de
contraste específico do portal, seguir o mesmo padrão das linhas acima
(override escopado por `[data-theme="..."]`, nunca incondicional em
`:root`).

### 1.3 Alto contraste (`data-contrast="high"`)

Quando ativo (Task 19), força três tokens ao valor de `--foreground`
(máximo contraste possível) e reforça o anel de foco:

```css
:root[data-contrast="high"] {
  --muted: var(--foreground);
  --border: var(--foreground);
  --focus: var(--foreground);
}
```

### 1.4 Regra de ouro

**Nenhuma cor hardcoded em componente** (ex. `text-zinc-500`,
`bg-blue-600`). Sempre uma referência a um token via sintaxe arbitrária
do Tailwind v4: `text-(--muted)`, `border-(--border)`, `bg-(--brand)`,
etc. — é o que garante que tema claro/escuro e alto contraste funcionem
em toda a interface sem exceção pontual.

---

## 2. Tipografia

- **Fonte:** `Arial, Helvetica, sans-serif` (fallback definido em `body`,
  `app/globals.css`), com `--font-geist-sans`/`--font-geist-mono`
  carregadas via `next/font` em `app/layout.tsx` e expostas como
  `--font-sans`/`--font-mono` no bloco `@theme inline`.
  **Na prática, o portal renderiza Arial** (verificado em 2026-11-05 no
  estilo computado da produção: corpo, títulos, parágrafos e botões em
  `Arial, Helvetica, sans-serif`, sem nenhuma fonte web carregada): a regra
  `font-family: Arial` do `body` vence e a Geist é baixada sem ser usada.
  O e-book (`public/ebook/leitor.html`) usa a mesma pilha, para ficar
  consistente com o portal. Se a intenção for adotar a Geist de fato, é
  uma decisão de design a tomar (afeta todas as telas).
- **Escala de tamanho de fonte (Task 19):** controlada pelo atributo
  `data-font-size` no `<html>`, 3 níveis:

| Nível | Atributo | `font-size` do `<html>` |
|---|---|---|
| Normal | (ausente) | 100% (padrão do navegador) |
| Grande | `data-font-size="large"` | 112.5% |
| Extra grande | `data-font-size="extra-large"` | 125% |

  Como a escala é no `<html>` e a maioria dos tamanhos de texto do
  Tailwind usa `rem`, o efeito se propaga para toda a UI automaticamente
  — nenhum componente precisa tratar isso individualmente.
- **Hierarquia:** títulos de seção (`h2`) seguidos por uma barra dourada
  decorativa de 4px (`h-1 w-12 rounded-full bg-(--gold)`, ver
  `CourseSections.tsx`) — padrão repetido em toda seção da página
  inicial (Task 24).

---

## 3. Ícones

**Biblioteca:** [`lucide-react`](https://lucide.dev/) `^1.48.0` (Task 27)
— substituiu o uso de emoji em toda a interface.

- Ícone puramente decorativo (a maioria dos casos — ex. dentro de um
  `<Chip>`, ao lado de um título que já descreve o conteúdo): sempre
  `aria-hidden="true"`.
- Ícone que é a única forma de transmitir uma informação (ex. status de
  pergunta respondida/correta/incorreta em telas pequenas,
  `QuestionNavigator.tsx`): manter o `aria-label` no elemento pai, nunca
  só no ícone.
- Tamanho padrão: classes utilitárias `size-4`/`size-5`/`size-6`/`size-8`/
  `size-9`/`size-11` do Tailwind, conforme o contexto (inline em texto,
  dentro de um badge circular, destaque de seção).

### Ícones em uso (catálogo vivo — atualizar ao adicionar um novo)

| Ícone | Onde é usado |
|---|---|
| `Accessibility` | Formato e recursos (home) |
| `ArrowDown` | Link "Conheça os objetivos..." (hero) |
| `Bot` | Lista de features do hero |
| `ChartColumn` | Etapa "Relatório" (hero, jornada) |
| `Check` | Status "respondida/correta" (progresso, navegador de perguntas) |
| `Circle` | Status "pendente" (navegador de perguntas) |
| `CircleCheck` | Itens de checklist (objetivos, pré-requisitos) |
| `Clapperboard` | Etapa "Vídeo" (hero, jornada, skeleton) |
| `ClipboardList` | Etapa "Avaliação" (hero, jornada) |
| `GraduationCap` | Público-alvo: licenciandos/estudantes |
| `ImageIcon` | Placeholder de imagem ainda não produzida |
| `Map` | Resultado esperado: planejar uma aula |
| `MessageSquare` | Resultado esperado: pedir bem à IA |
| `Presentation` | Público-alvo: professores/educadores |
| `Puzzle` | Público-alvo: designers instrucionais/tutores |
| `Search` | Resultado esperado: analisar respostas da IA |
| `Smartphone` | Formato e recursos: acesso em qualquer dispositivo |
| `Timer` | Formato e recursos: ritmo livre |
| `Unlock` | Formato e recursos: sem cadastro |
| `Wrench` | Resultado esperado: melhorar o material gerado |
| `X` | Status "incorreta" (alternativas, navegador de perguntas) |

**Nunca usar emoji como ícone de UI** — se um emoji aparecer em um PR,
substituir pelo equivalente em `lucide-react` antes de mesclar.

---

## 4. Componentes-padrão (HeroUI)

**Biblioteca:** `@heroui/react` `^3.2.6` (compound components, sem
`<Provider>`; API de `useTheme()` nativa). Usar sempre o componente da
biblioteca antes de construir um customizado — só existem dois
componentes próprios no portal hoje (`ImagePlaceholder`,
`AccessibilityInitializer`), ambos para necessidades sem equivalente no
HeroUI.

### Componentes em uso (catálogo vivo)

| Componente | Onde/para quê |
|---|---|
| `Accordion` | FAQ (home), gabarito comentado (relatório final) |
| `Alert` | Painel de retorno pedagógico (`AnswerFeedback`) |
| `AlertDialog` | Confirmação de "Reiniciar jornada" / "Início" |
| `Avatar` | Inicial do nome do aluno no cabeçalho da jornada |
| `Button` | Toda ação clicável |
| `Card` | Blocos de conteúdo (hero, formulário, relatório, cartões de seção) |
| `Chip` | Badges de status (etapa atual, "Correta"/"Revisar", tags do hero) |
| `Drawer` | Menu de acessibilidade retrátil |
| `Form` / `TextField` / `Input` / `Label` / `FieldError` | Captura do nome do aluno |
| `Meter` | Desempenho por competência (aba "Resumo" do relatório) |
| `ProgressCircle` | Pontuação do relatório; progresso de perguntas respondidas |
| `RadioGroup` / `Radio` | Alternativas do quiz |
| `Skeleton` | Placeholder de vídeo; estado de carregamento |
| `Spinner` | Estado de carregamento (`JourneyLoading`) |
| `Switch` | Alto contraste (liga/desliga) |
| `Tabs` | "Resumo" / "Gabarito comentado" no relatório final |
| `Tooltip` | Dica de ação ("Início", tópico de cada pergunta no navegador) |
| `useTheme()` | Hook nativo de tema claro/escuro/sistema |
| `useIsomorphicLayoutEffect()` | Hook nativo usado por `usePersistentAttribute` (preferências de tema, fonte e contraste) |

### Padrões conhecidos a repetir

- **Interativo aninhado:** nunca envolver um `<Button>` dentro de
  `AlertDialog.Trigger`/`Popover.Trigger` — eles já são o próprio
  elemento pressionável. Usar `isOpen`/`onOpenChange` manual + `<Button>`
  solto para abrir, `<Button slot="close">` para fechar. `Drawer.Trigger`
  é a exceção que **pode** envolver classes de botão diretamente (já é
  um `<button>` real).
- **Tooltip sem botão aninhado:** `Tooltip.Trigger` é um `div role="button"`;
  não coloque um `Button` dentro dele (o axe-core acusa `nested-interactive`,
  WCAG 4.1.2). Para um `Button` do HeroUI, coloque-o **direto** dentro de
  `<Tooltip>`. Para um `<button>` nativo, use `<Tooltip.Trigger<"button">
  render={(props) => <button {...props} />} />`. Tooltip só deve ser a
  única forma de dar uma informação se ela também existir em texto
  (`aria-label`).
- **Retorno de ações sem toast:** o resultado da confirmação de resposta
  aparece no alerta da própria tela, dentro de uma região `role="status"`
  (`aria-live="polite"`) **sempre presente**, que o leitor de tela anuncia.
  O toast foi removido em 2026-11-05: cobria o botão de avançar, o React
  Aria pausa o fechamento dele enquanto o mouse está por cima, duplicava o
  alerta e o botão de fechar estava em inglês. Se algum dia um toast
  voltar, ele não pode ficar sobre a área de ação.
- **Rótulo no nome:** quando um controle tem texto visível **e** `aria-label`,
  o `aria-label` precisa **conter** o texto visível (WCAG 2.5.3; axe
  `label-content-name-mismatch`). Quem usa comando de voz ("clicar em
  Pendente") só aciona o que consegue ler. Derive os dois da mesma constante.
  Dois cuidados que o axe-core exige: ele compara **por palavras** e
  **descarta o que está entre parênteses** (não escreva "Fonte grande (A+)";
  use "A+, fonte grande"); e elementos de texto adjacentes precisam de um
  **espaço real** entre eles (`{" "}`), senão "Pergunta 1" + "Pendente" vira
  a palavra única `1pendente`.
- **Preferências de acessibilidade sempre aplicadas:** qualquer hook que
  aplique um atributo `data-*` no `<html>` (tema, fonte, contraste) deve
  rodar num componente sempre montado (`AccessibilityInitializer`), nunca
  só dentro de conteúdo lazy/condicional (ex. dentro de um `Drawer.Body`)
  — ver o bug corrigido na Task 22.

---

## 5. Convenções de layout

- **Espaço reservado para imagens ainda não produzidas:**
  `components/ui/ImagePlaceholder.tsx` — borda tracejada em `--gold`,
  ícone `ImageIcon`, rótulo do que a imagem deve mostrar e uma dica de
  caminho/tamanho sugerido (ex. `public/img/jornada.jpg · 1456×720`).
  `alt` vazio (`""`) por padrão — decorativo até a imagem real existir; ao
  adicionar a imagem definitiva, decidir e documentar se o `alt` deve
  virar descritivo (depende do conteúdo real da imagem). Com a propriedade
  `src` o componente exibe a imagem (`next/image`); `priority` marca a
  imagem principal do topo. **Já preenchidos:** a ilustração principal da
  página inicial (`public/img/hero.jpg`, 1456×720, `alt` descritivo,
  2026-11-05) e a dos objetivos (`public/img/objetivos.jpg`, 1456×720,
  proporção 2:1, `alt` descritivo, 2026-11-05). A ferramenta de imagem
  ignorou a proporção 4:3 pedida no prompt, então o encaixe dos objetivos
  passou a `aspect-[2/1]`. **A ilustração da jornada ainda não existe e o
  espaço reservado foi removido da página** (2026-11-05): a seção "Como
  funciona" mostra só os três cartões, em fileira. Quando a imagem for
  gerada (prompt `P1-jornada.png` em `docs/prompts-ilustracao.md`, seção
  5.3), voltar a incluí-la como `aside` da seção, em 2:1.
- **Ícone da aba do navegador:** `app/icon.svg`, `app/apple-icon.png` e
  `app/favicon.ico`, gerados por `npm run icones` (livro aberto dourado
  sobre azul-marinho, com um ponto verde que lembra a IA).
- **Menu de materiais (`PortalHeader`):** nas páginas públicas (início,
  `/ebook`, `/mapa`, `/quadrinho`), `E-book`, `Mapa interativo` e
  `Quadrinho` são pílulas com borda branca no cabeçalho; a da página atual
  fica preenchida de branco e leva `aria-current="page"`; fora do início há
  também "Voltar ao curso". Na jornada (`JourneyLayout`), `E-book` e `Mapa`
  são links discretos (o quadrinho ainda não está lá).
- **Cartões de materiais da tela principal:** dois cartões grandes
  clicáveis (borda `--brand` de 2px, ícone dourado sobre `--brand`, título,
  descrição e seta) abaixo da descrição do curso, sob o rótulo "Materiais
  de estudo". Hoje são os destaques da tela principal, e só e-book e mapa
  têm cartão (o quadrinho fica no menu superior).
- **Mapa interativo (`components/materials/ConceptMap.tsx`):** nós como
  botões com `aria-pressed`, selecionado em `--brand` com borda `--gold`;
  linhas de conexão em `--muted` (realçadas em `--gold` nas do nó
  selecionado); diagrama fixo (`sticky`) ao lado do painel; ilustração do
  nó (quando existir) é decorativa, com `alt` vazio.
- **Quadrinho (`components/materials/ComicReader.tsx`):** imagem sem texto
  com **balão de fala em HTML** (fundo branco, texto e borda `--brand`) sobre
  a área livre da cena, que em telas pequenas vai para baixo da imagem;
  quadros de texto por tom (narração com barra `--gold`, comando com borda
  tracejada `--brand`, sugestão da IA com barra `--accent`); decisão em
  `fieldset` com opções-botão (borda `--success` ou `--danger` na escolhida,
  retorno em região `status` com ícone e texto, nunca só cor); sem
  transições de cor, para a verificação de contraste não pegar o meio da
  animação.
- **Cabeçalho da jornada (`JourneyLayout`):** fundo `--brand`, texto
  branco, borda inferior de 4px em `--gold` — visualmente distinto do
  resto da interface, para ancorar a identidade do portal em toda tela
  pós-identificação.
- **Barra dourada decorativa:** `h-1 w-12 rounded-full bg-(--gold)`
  abaixo de todo título de seção (`h2`) na página inicial.

---

## 6. Como manter este guia atualizado

Este arquivo descreve o estado do código em 2026-10-18. Ao adicionar um
novo ícone, componente HeroUI ou token de cor:

1. Implemente a mudança normalmente.
2. Adicione uma linha na tabela correspondente aqui (ícones, componentes
   ou tokens).
3. Se a mudança introduzir uma nova regra de uso (ex. "nunca usar X sobre
   Y"), documente a regra, não só o fato.

Não é obrigatório abrir uma task só para atualizar este guia — é
aceitável incluir a atualização no mesmo PR da mudança de UI que a
motivou.
