# Guia de Estilo — Portal de Planejamento Pedagógico para EaD

> Gerado em: 2026-10-18 (Task 28, `task-master.md`)
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
| `--success` | `#157347` | `#4ade9b` | 5,9:1 (claro) / 8,9:1 (escuro, com `--success-foreground` escuro) |
| `--success-foreground` | `#ffffff` | `#062b1b` | — |
| `--warning` | `#c9a227` (= `--gold`) | (herdado) | 6,4:1 com `--warning-foreground` marinho |
| `--warning-foreground` | `#0b2545` (= `--brand`) | (herdado) | — |
| `--danger` | `#b91c1c` | (herdado) | ajustado na Task 18 para atingir AA (o padrão do HeroUI não atingia) |
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
| `toast` / `Toast` | Feedback de confirmação de resposta (sucesso/atenção/erro) |
| `Tooltip` | Dica de ação ("Início", tópico de cada pergunta no navegador) |
| `useTheme()` | Hook nativo de tema claro/escuro/sistema |

### Padrões conhecidos a repetir

- **Interativo aninhado:** nunca envolver um `<Button>` dentro de
  `AlertDialog.Trigger`/`Popover.Trigger` — eles já são o próprio
  elemento pressionável. Usar `isOpen`/`onOpenChange` manual + `<Button>`
  solto para abrir, `<Button slot="close">` para fechar. `Drawer.Trigger`
  é a exceção que **pode** envolver classes de botão diretamente (já é
  um `<button>` real).
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
  caminho/tamanho sugerido (ex. `public/img/hero.svg · 560×280`). `alt`
  vazio (`""`) por padrão — decorativo até a imagem real existir; ao
  adicionar a imagem definitiva, decidir e documentar se o `alt` deve
  virar descritivo (depende do conteúdo real da imagem).
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
