# Prompts de ilustração — avaliação de IAs de imagem (Task 64)

> Gerado em: 2026-11-04 · Decisões D6 e D7 (`plano-evolucao-v2.md`, 10.4)
> **Quem faz o quê:** eu escrevo os prompts e avalio o que você entregar;
> **você gera as imagens**, manualmente, na IA de sua preferência, e me
> informa o diretório.

Os prompts estão em **inglês**, porque os geradores de imagem costumam
seguir melhor instruções nesse idioma. Cada um tem uma nota em português
dizendo para que serve. Se preferir, posso traduzi-los.

> **Aviso:** estes prompts servem para a **avaliação** (Task 64) e usam
> a paleta atual do portal. Quando o design system v2 (Task 59) existir,
> a produção final reaproveita os mesmos prompts com a paleta e o estilo
> aprovados.

---

## 1. Como usar: três etapas

| Etapa | O que gerar | Quantas imagens | Decisão no fim |
|---|---|---|---|
| **1 — Estilo** | A ficha da personagem Marina, uma vez em cada um dos 3 estilos | 3 | Você escolhe **um** estilo (e o resultado já serve ao caso IM-02) |
| **2 — Cenas** | As 6 cenas da HQ, no estilo escolhido, usando a ficha como referência | 6 | Avalio consistência e acabamento (IM-01, 03, 05) |
| **3 — Elementos** | 4 elementos do mapa e 3 do ebook (capa e 2 ilustrações de capítulo) | 7 | Avalio coerência de estilo e uso em tamanho reduzido (IM-06) |
| **Página inicial** (seção 5.3, fora da avaliação) | Ilustrações de objetivos e de jornada, no estilo da imagem principal | 2 | Avalio a coerência com `hero.jpg` e ligo no portal |

Total mínimo: **16 imagens**, mais as tentativas extras que você achar
necessárias. Anote quantas tentativas cada imagem exigiu: isso entra na
avaliação de custo (IM-08) e de iteração (IM-10).

**Para manter a personagem igual nas cenas (Etapa 2):**
- Se a ferramenta aceita **imagem de referência**, anexe a ficha da Etapa 1
  escolhida em cada cena.
- Se não aceita, gere todas as cenas **na mesma conversa**, colando
  sempre o bloco da personagem (seção 4) sem alterações.

---

## 2. Blocos reutilizáveis

Os blocos entre colchetes são colados dentro de cada prompt.

### [REGRAS]: colar no final de todo prompt

```text
No text, no letters, no numbers, no captions, no speech balloons, no logos, no watermarks, no signature. Natural hands, simple, never in extreme close-up. Clean, uncluttered composition. Original characters only: do not imitate any existing character, brand or artist.
```

> **Por quê:** o texto (balões, legendas) será feito em HTML, nunca
> dentro da imagem. Isso preserva acentuação, leitura por leitor de tela
> e edição. O caso IM-03 mede se a ferramenta obedece.

### [PALETA]

```text
Color palette: deep navy blue (#0b2545), warm gold (#c9a227), emerald green (#157347), with soft pale backgrounds (#e8eef7, #fdf3d0, #e6f4ec, #f5f7fa). Keep the colors consistent across the whole image.
```

### [ESTILO], escolha uma variante (usada só na Etapa 1)

| Variante | Texto para colar |
|---|---|
| **A — Vetor editorial** | `Clean editorial vector illustration: flat colors with subtle shading, smooth confident outlines of uniform weight, friendly modern educational look, high-quality professional finish.` |
| **B — Linha clara (quadrinho europeu)** | `Ligne claire comic style, European educational comic: uniform ink outlines, flat color fills, simple clean backgrounds, warm expressive faces, professional graphic-novel finish.` |
| **C — Semiflat com volume suave** | `Modern semi-flat illustration with soft gradients and gentle lighting, rounded shapes, slightly stylized proportions, polished educational look.` |

Depois da Etapa 1, o estilo escolhido passa a ser o `[ESTILO]` de todas
as outras etapas.

### [MARINA]: a personagem, sempre idêntica

```text
Marina, a fictional Brazilian woman about 40 years old, a university teacher. Warm medium-brown skin, short curly dark-brown hair, round glasses with thin gold frames, a kind and attentive expression. She wears a navy blue blazer over a white shirt, and a small green pin on the lapel. Friendly, confident, approachable. Always the same face, hairstyle, glasses and outfit.
```

> **Por quê:** a personagem é inventada, sem semelhança com pessoa real.
> O óculos dourado, o blazer marinho e o pin verde repetem a paleta do
> portal e funcionam como "âncoras" visuais para a consistência.

---

## 3. Etapa 1: ficha da personagem (3 prompts)

Proporção **3:2** (paisagem), fundo liso claro. Gere **um por estilo**:
substitua `[ESTILO]` pelo texto das variantes A, B e C.

```text
Character design model sheet of [MARINA]. Full body in front view, three-quarter view and side view, plus four head studies showing neutral, smiling, worried and thoughtful expressions. Plain pale background (#f5f7fa), evenly lit, no shadows on the background. [ESTILO]. [PALETA]. [REGRAS]
```

Nomes dos arquivos: `E1-estilo-A.png`, `E1-estilo-B.png`, `E1-estilo-C.png`.

---

## 4. Etapa 2: as 6 cenas da HQ

Proporção **4:3** (paisagem), por exemplo 1600×1200. Em todas, **deixe
uma área livre** para o balão de fala, que será feito em HTML. Estrutura
de cada prompt:

```text
[MARINA]. [CENA]. [ESTILO ESCOLHIDO]. [PALETA]. [REGRAS]
```

| # | Arquivo | `[CENA]` | Expressão da Marina |
|---|---|---|---|
| 1 | `E2-cena-01.png` | `Medium shot. She sits at a wooden desk with an open laptop in a bright, modern home office. Pale blue-gray background (#e8eef7). Leave the upper right third empty, with a plain wall, for a speech balloon.` | sorriso tranquilo |
| 2 | `E2-cena-02.png` | `Medium shot. She types on the laptop and raises one hand in an explaining gesture toward the viewer. Warm cream background (#fdf3d0). Leave the upper right area empty for a speech balloon.` | sorriso confiante |
| 3 | `E2-cena-03.png` | `Over-the-shoulder medium shot. She looks at the laptop screen, which shows a generic abstract document made only of gray lines, with no readable text. Soft mint-green background (#e6f4ec). Leave the upper left area empty for a speech balloon.` | sobrancelhas franzidas, preocupada |
| 4 | `E2-cena-04.png` | `Medium close-up. She rests her chin on one hand and looks at the laptop. Pale blue-gray background (#e8eef7). Leave the right side empty for a speech balloon.` | pensativa, uma sobrancelha levantada |
| 5 | `E2-cena-05.png` | `Medium shot. She holds a smartphone in one hand and raises the other hand, asking for an adjustment. A laptop is open on the desk. Warm cream background (#fdf3d0). Leave the top empty for a speech balloon.` | sorriso, decidida |
| 6 | `E2-cena-06.png` | `Medium shot, slightly low angle. She stands in front of a large window with her arms relaxed. Soft mint-green background tone (#e6f4ec). Leave the upper right area empty for a speech balloon.` | confiante, serena |

Acrescente a expressão da última coluna ao prompt (por exemplo,
`Expression: worried, frowning eyebrows`).

---

## 5. Etapa 3: elementos do mapa e do ebook

### 5.1 Mapa interativo: 4 elementos, proporção 1:1

Fundo liso `#f5f7fa`, elemento centralizado, para ser recortado depois.

```text
[ELEMENTO]. Single centered subject on a plain pale background (#f5f7fa), generous empty margin around it. [ESTILO ESCOLHIDO]. [PALETA]. [REGRAS]
```

| Arquivo | `[ELEMENTO]` |
|---|---|
| `E3-no-publico.png` | `Three diverse adult learners of different ages and skin tones, relaxed in the evening, each looking at a smartphone` |
| `E3-no-objetivos.png` | `A stylized mountain peak with a small flag at the summit and a winding path leading up to it, in soft dawn light` |
| `E3-no-atividades.png` | `Hands-on learning: an open notebook, a pencil and a smartphone showing an abstract interface made of simple colored blocks, with no text, on a table` |
| `E3-no-avaliacao.png` | `A clipboard with a checklist made of simple tick marks and empty lines, with no readable text, and a magnifying glass over it` |

### 5.2 Ebook: capa e duas ilustrações de capítulo

| Arquivo | Proporção | Prompt |
|---|---|---|
| `E3-ebook-capa.png` | **3:4** (retrato) | `Book cover illustration with no title text. [MARINA] stands at the center holding a tablet, and a translucent magnifying lens in front of the tablet reveals clean geometric shapes. Deep navy background with gold accents. Leave the top third empty for the title and a small band at the bottom empty for the author. [ESTILO ESCOLHIDO]. [PALETA]. [REGRAS]` |
| `E3-ebook-cap1.png` | **4:3** | `Four interlocking puzzle pieces in navy, gold, green and light blue, forming a square, centered on a plain pale background (#f5f7fa), a minimal metaphor for alignment between audience, objectives, activities and assessment. [ESTILO ESCOLHIDO]. [PALETA]. [REGRAS]` |
| `E3-ebook-cap3.png` | **4:3** | `[MARINA] reviews a printed lesson plan at a desk and checks the items with a green pencil, a laptop beside her, calm and focused mood. Soft mint-green background (#e6f4ec). Leave the right side empty. [ESTILO ESCOLHIDO]. [PALETA]. [REGRAS]` |

### 5.3 Página inicial: objetivos e jornada (2 imagens, proporção 4:3)

A ilustração principal da página inicial (`public/img/hero.jpg`) já está
no ar. Faltam as duas dos espaços reservados "Objetivos do curso" e "Como
funciona". Para as três parecerem **da mesma família**, estas usam o estilo
da imagem principal (vetor plano geométrico, azul-marinho e dourado, fundo
claro, sem personagem), e não o estilo A da Marina. Se a ferramenta aceita
**imagem de referência**, anexe `public/img/hero.jpg` em cada geração.

Gere em 1600×1200 (o portal exibe em ~480×360, então sobra resolução).
Cole o bloco abaixo no lugar de `[ESTILO-PAGINA]`, junto com o `[REGRAS]`
da seção 2:

```text
Flat geometric vector illustration in the style of a minimal educational infographic: bold simple shapes, thick connector lines with rounded corners, solid flat colors, no gradients, no shading, no outlines on the shapes, high-quality professional finish. Color palette: deep navy blue (#0b2545) and warm gold (#c9a227) as the main colors, with very small touches of emerald green (#157347). Plain off-white background (#f5f7fa). Centered, balanced composition with a generous empty margin on all sides.
```

| Arquivo | Onde entra | Prompt |
|---|---|---|
| `P1-objetivos.png` | Seção "Objetivos do curso" | `A large bullseye target in the center, made of concentric navy and gold rings, with one gold arrow stuck in its exact center. Four small circular badges around it, one in each corner, each joined to the target by a thick rounded connector line: top-left, interlocking puzzle pieces; top-right, three horizontal bars of equal length perfectly aligned one above the other; bottom-left, a speech bubble containing a small four-point sparkle and three short abstract lines; bottom-right, a magnifying glass over a document with simple tick marks. Symmetric composition. [ESTILO-PAGINA]. [REGRAS]` |
| `P1-jornada.png` | Seção "Como funciona" | `One thick rounded path line rising from the bottom-left corner to the top-right corner, passing through three round stations of increasing size, each containing one simple icon: a laptop screen with a large play triangle; a clipboard with three tick marks and empty lines; a bar chart with three rising bars and a small ribbon medal. Small arrows along the path show the direction of travel, small dots between the stations mark progress, and a small gold flag stands at the end of the path. [ESTILO-PAGINA]. [REGRAS]` |

**Por que cada imagem tem esses elementos.** Os quatro emblemas da imagem
de objetivos correspondem, na ordem, aos quatro objetivos do curso
(`content/landing.ts`, `courseObjectives`): articular os elementos do
planejamento (quebra-cabeça), reconhecer o alinhamento (barras alinhadas),
estruturar comandos para a IA (balão com brilho) e analisar criticamente as
sugestões (lupa sobre o documento). As três estações da imagem de jornada
são as três etapas reais: vídeo, avaliação e relatório.

**Como entregar:** salve `P1-objetivos.png` e `P1-jornada.png` na pasta
`testes/imagens-ia/` (confira que a extensão não ficou duplicada). Eu otimizo, coloco em `public/img/`, escrevo o texto alternativo
a partir do que a imagem mostrar e ligo no lugar do espaço reservado. Anote
as tentativas no `registro.md`.

---

## 6. Como entregar

1. Crie a pasta `testes/imagens-ia/<nome-da-ferramenta>/` e, dentro, as
   subpastas `etapa-1`, `etapa-2` e `etapa-3`.
2. Salve cada imagem com **o nome da tabela** (por exemplo
   `E2-cena-03.png`). Se houver tentativas descartadas, guarde-as em
   `descartadas/` com o mesmo nome e um sufixo `-t2`, `-t3`.
3. Preencha `testes/imagens-ia/registro-modelo.md` (copie para a pasta
   da ferramenta como `registro.md`): ferramenta, modelo, plano,
   tentativas por imagem e condições de uso.
4. Me informe o **diretório**. Eu abro as imagens, avalio com a rubrica
   dos casos IM-01 a IM-10 (`docs/plano-testes-claude-design.md`,
   seção 8) e registro os resultados. **O julgamento final de "nível
   profissional" é seu.**

Pode entregar **por etapa**: depois da Etapa 1, já avalio o estilo e você
decide antes de gerar as demais.

---

## 7. O que vou verificar em cada etapa

| Etapa | Casos | O que olho |
|---|---|---|
| 1 | IM-02, IM-04 | Acabamento, estilo, aderência à paleta, distinção entre as 3 variantes |
| 2 | IM-01, IM-03, IM-05 | A personagem é a mesma nas 6 cenas? Há texto indevido? A área para o balão foi respeitada? |
| 3 | IM-06, IM-07 | Os 7 elementos parecem da mesma família? Resolução e peso após otimização |
| Todas | IM-08, IM-09, IM-10 | Direitos de uso, texto alternativo de cada imagem, custo de refazer uma cena |

> **Direitos:** confira nos termos da ferramenta que o **uso comercial** e
> a publicação em portal educacional são permitidos, e se há exigência
> de indicar que a imagem foi gerada por IA. Anote o link e a data no
> `registro.md`.
