# Plano de Testes — Claude Design (decisão D4)

> Gerado em: 2026-11-04 · Task 44 (`task-master.md`)
> Origem: `plano-evolucao-v2.md`, decisão D4.

## 1. Para que servem estes testes

O plano de evolução supõe que o Claude Design produz as peças visuais
das três mídias (quadrinho, mapa interativo e ebook). **Não se sabe
ainda** quais formatos ele exporta, se mantém a identidade visual do
portal, se preserva o texto como texto, se gera interatividade e se o
resultado é acessível. Estes testes respondem a essas perguntas **antes**
de escrever o brief da Task 49, para que o formato das peças (SVG, PNG,
HTML) seja escolhido com evidência.

Resultado esperado: uma tabela preenchida (seção 6) e a escolha de uma
das variantes do plano (seção 5).

### 1.1 Ferramenta testada (decisão D0, 2026-11-04)

O "Claude Design" testado é o **Design interno ao Claude**: o tipo de
artefato **"Design"** (pranchetas "vivas" numa tela, para sites, telas,
protótipos, pôsteres e peças visuais) e o tipo **"Design System"**. O
Claude Design avulso (`claude.ai/design`) **fecha em 14/12/2026** e não é
usado; a ferramenta de sincronização com ele também não.

Duas consequências para este plano:
- Os casos CD-01 a CD-03 supunham SVG ou PNG. As pranchetas podem ser
  HTML; o **CD-01 descobre o formato real** e, se for HTML, as variantes
  V2 e V3 passam a ser as mais prováveis.
- A conta ainda não tem nenhum Design System. O CD-14 ("partir do que já
  existe") parte do guia de estilo e das telas atuais do portal.

## 2. Quem executa e como

| Marca | Quem | Observação |
|---|---|---|
| **[U]** | Você, na ferramenta | Gerar e exportar as peças de teste |
| **[C]** | Claude, no repositório | Inspecionar arquivos exportados e rodar scripts do projeto |

**Atualização (D0):** as peças de teste são criadas por Claude como
artefatos "Design" **privados** na conta claude.ai. Os casos marcados
[U] passam a significar o que só você pode fazer: **julgamento visual**
(CD-04, CD-14), **avaliadores humanos** (CD-04) e **leitura de termos**
(CD-10).

Regras:
- Usar **conteúdo fictício** nas peças de teste (personagem e cenário
  inventados, sem dados reais de pessoas ou da empresa).
- Guardar as peças de teste em `testes/claude-design/`: `pecas-teste/`
  (fontes do artefato "Design") e `pecas-teste-local/` (versão em HTML
  puro). É pasta de trabalho, **não** publicada no portal.
- Registrar a evidência (arquivo, captura de tela ou texto) ao lado do
  resultado.

## 3. Insumos de teste (preparar uma vez)

1. **Paleta e tipografia** de `docs/guia-de-estilo.md`: marinho
   `#0b2545`, dourado `#c9a227`, verde `#157347`, fundo `#f5f7fa`.
2. **Peça-teste A (HQ):** 6 painéis curtos com um personagem fictício
   (professora), cenas diferentes, balões com texto em português com
   acentos e cedilha ("avaliação", "concepção", "didática").
3. **Peça-teste B (mapa):** diagrama com **4 nós** (Público, Objetivos,
   Atividades, Avaliação), cada um com título e um parágrafo curto.
4. **Peça-teste C (ebook):** uma capa e uma página de miolo com título,
   texto corrido, uma lista e um diagrama.

## 4. Casos de teste

| ID | Verifica | Quem | Procedimento | Passa quando |
|---|---|---|---|---|
| **CD-01** | Formatos de exportação | [U] | Exportar as peças A, B e C em **todos** os formatos oferecidos e listá-los | Existe ao menos um formato **vetorial (SVG)** ou **HTML**; senão, só imagem (raster) |
| **CD-02** | Fidelidade à paleta | [U] + [C] | Pedir as cores do guia de estilo; [C] inspeciona o SVG (valores hexadecimais) ou amostra pixels do PNG | As cores exportadas coincidem com os tokens do guia, sem tons próximos substituídos |
| **CD-03** | Texto como texto | [C] | Abrir o arquivo exportado e verificar se o texto em português é selecionável e pesquisável ou está "assado" na imagem | Texto vivo (aceita zoom, leitor de tela e tradução); se estiver em imagem, a peça exige alt-text integral e entra em contingência |
| **CD-04** | Consistência de personagem (HQ) | [U] | Gerar os 6 painéis; 3 pessoas avaliam, de 1 a 5, rosto, vestimenta, proporção e estilo | Média ≥ 4 e nenhum painel abaixo de 3 |
| **CD-05** | Interatividade | [U] | Pedir o mapa (peça B) com nós clicáveis; verificar se o resultado é interativo ou apenas visual | Registrar. Se interativo, executar CD-06 e CD-07 |
| **CD-06** | Acessibilidade do artefato | [C] | Rodar axe-core no HTML exportado; operar só por teclado; ordem de foco; leitura com NVDA | Zero violações críticas ou sérias; tudo operável por teclado; nome acessível em cada nó |
| **CD-07** | Compatibilidade com tema, contraste e fonte | [C] | Aplicar `data-theme="dark"`, `data-contrast="high"` e os três `data-font-size` sobre a peça incorporada | A peça muda de cor e de tamanho de texto, ou a adaptação é trivial (variáveis CSS no SVG) |
| **CD-08** | Iteração e reexportação | [U] | Alterar a fala de um balão e reexportar | A mudança é local, sem regenerar nem alterar o restante da peça |
| **CD-09** | Peso dos arquivos | [C] | Medir o tamanho de cada arquivo exportado | Dentro do orçamento proposto: até 300 KB por figura e 3 MB por material (a calibrar após o primeiro ensaio) |
| **CD-10** | Direitos de uso | [U] | Ler os termos da ferramenta; registrar link e data | Uso das peças geradas permitido em portal educacional publicado, com ou sem atribuição, registrada |
| **CD-11** | Importação no portal | [C] | Copiar a exportação para `public/materiais/_teste/` em branch de teste, renderizar e rodar `npm run build` e `npm run lint` | Build e lint passam; a peça renderiza em tema claro e escuro |

### 4.1 Casos acrescentados pelo requisito R2 (redesign completo)

O requisito R2 torna o Claude Design a ferramenta de **todo o layout**,
não só das peças. Os casos abaixo verificam se ele sustenta um design
system e protótipos de ponta a ponta.

| ID | Verifica | Quem | Procedimento | Passa quando |
|---|---|---|---|---|
| **CD-12** | Tokens exportáveis | [U] + [C] | Pedir um conjunto de tokens (cores, tipografia, raios, sombras, espaçamento) para os temas claro, escuro e alto contraste e exportá-lo | Saída legível por código (CSS, JSON ou equivalente) e coerente entre os temas; [C] verifica o contraste AA dos pares texto/fundo |
| **CD-13** | Protótipo multi-tela com navegação e sobreposições | [U] | Montar 3 telas ligadas (home, vídeo, avaliação) com navegação, um drawer, um modal e um toast | As telas compartilham os mesmos tokens e componentes, e as sobreposições têm estados (aberto, fechado, foco) |
| **CD-14** | Partir do que já existe | [U] | Informar o guia de estilo atual e as telas atuais como ponto de partida e pedir 3 explorações distintas | As explorações são realmente diferentes entre si e respeitam as restrições de acessibilidade informadas |
| **CD-15** | Representação de elementos externos | [U] | Prototipar o player de vídeo e o ebook incorporado (moldura, proporção, legenda de carregamento) | A incorporação é representada de forma que se possa traduzir em código sem ambiguidade |

> **Se os testes CD-12 a CD-15 falharem,** o requisito R2 não pode ser
> cumprido como foi escrito. Nesse caso **paro e consulto você** antes
> de trocar de ferramenta, em vez de adotar a variante V5 por conta
> própria.

> O limite de peso (CD-09) e a nota mínima (CD-04) são **propostas
> iniciais** para o primeiro ensaio, não valores consagrados. Ajustar
> depois de ver os primeiros resultados.

## 5. O que cada resultado muda no plano

| Variante | Condição | Efeito nas Tasks 49 e 52 |
|---|---|---|
| **V1 — vetorial com texto vivo, sem interatividade** | CD-01, 02, 03 passam; CD-05 sem interatividade | Plano padrão: a ferramenta entrega a arte (SVG); toda a interatividade é feita em React no portal |
| **V2 — HTML interativo acessível** | CD-05, 06 e 07 passam | O mapa pode ser incorporado; a Task 52 reduz o esforço do componente do mapa |
| **V3 — HTML interativo não acessível** | CD-05 passa e CD-06 ou CD-07 falha | Usar só a arte exportada e reconstruir a interatividade em React |
| **V4 — somente imagem (raster) ou texto em imagem** | CD-03 falha ou só há PNG | A HQ segue viável com alt-text completo por painel; mapa e ebook usam a ferramenta só como arte de fundo, e a diagramação do ebook é feita em HTML do portal |
| **V6 — Claude Design para layout, outra IA para ilustração** | CD-04 e CD-05 mostram que a ferramenta estrutura bem, mas não ilustra em nível profissional | O Claude Design cuida de design system, telas, navegação, interação e composição (texto sempre em HTML). A arte (personagem, cenas, capas, ilustrações) vem de uma IA de imagem, avaliada na Task 64 e na seção 8 |
| **V5 — contingência (último recurso)** | CD-02 ou CD-10 falham de forma grave, mesmo após a V6 | Produzir a arte por outro meio (vetor próprio, outro editor) e manter o restante do plano |

## 6. Registro de resultados

| ID | Data | Resultado | Evidência | Variante indicada |
|---|---|---|---|---|
| CD-01 | 2026-11-04 | **Parcial.** Formato nativo é `.dc.html` (HTML com runtime próprio), não SVG nem PNG. Menu Compartilhar › Exportar e download: **a verificar na interface** | `testes/claude-design/pecas-teste/project/*.dc.html` | V2 ou V3 prováveis |
| CD-02 | | | | |
| CD-03 | 2026-11-04 | **Passa por construção.** Todo o texto, com acentos e cedilha, é HTML vivo; só as ilustrações são SVG em linha | Fontes das 3 peças | V1/V2 |
| CD-04 | 2026-11-04 | **Consistência: passa** (avaliação do usuário: a personagem parece a mesma nos 6 quadros, com expressões diferentes). **Qualidade: reprova** (design da HQ e da personagem "muito aquém do nível profissional" esperado) | `pecas-teste-local/index.html` | V6 |
| CD-05 | 2026-11-04 | **Interação passa, layout reprova.** A navegação por teclado do mapa funciona (avaliação do usuário), mas o layout é "muito limitado". A ferramenta suporta estado, eventos e `<details>` | `Mapa.dc.html`, `Ebook.dc.html` | V6 (estrutura e interação no Claude Design; arte por outra IA) |
| CD-06 | | | | |
| CD-07 | | | | |
| CD-08 | | | | |
| CD-09 | | | | |
| CD-10 | | | | |
| CD-11 | | | | |
| CD-12 | | | | |
| CD-13 | | | | |
| CD-14 | | | | |
| CD-15 | 2026-11-04 | **Limitação confirmada pelas regras da ferramenta.** `<iframe>`, `<object>` e `<embed>` são proibidos nas pranchetas: player e ebook externos só podem ser **representados** (moldura, proporção, legenda), nunca incorporados de verdade | Regras do tipo "Design" | Manter a incorporação real no código (Tasks 52 e 63) |

> **Artefato de teste (2026-11-04):** as peças foram publicadas como
> artefato "Design" **privado**, mas o usuário informou que o link não
> abriu (provável sessão em outra conta); a avaliação usou a **versão
> local** (`testes/claude-design/pecas-teste-local/index.html`). Pendentes:
> CD-02 e CD-06 a CD-14; CD-06, CD-07, CD-09 e CD-11 dependem de `npm
> install` e da Task 45. Variante indicada até aqui: **V6**.

**Decisão final (variante adotada e justificativa):** _a preencher ao
fim da Task 44._

## 7. Testes do portal (para as Tasks de código)

O portal **não tem hoje** Playwright, axe-core nem script `test` no
`package.json` (apenas `dev`, `build`, `start` e `lint`); as auditorias
citadas no `task-master.md` foram avulsas. A Task 45 cria a
infraestrutura; os casos abaixo passam a ser executados por scripts do
projeto.

| ID | Cobre | Task | Critério |
|---|---|---|---|
| **TP-01** | Migração do `UserProgress` | 51 | Com um `localStorage` no formato antigo, o aluno retoma da etapa em que estava, sem perda de dados |
| **TP-02** | Revisitar o vídeo | 53 | Quem já está na avaliação consegue abrir `/video` sem ser redirecionado e volta sem perder o progresso |
| **TP-03** | Hub de materiais | 52 | Operável por teclado e por leitor de tela; funciona em mobile e desktop |
| **TP-04** | Remediação dirigida | 54 | Cada "Vale revisar" leva ao material da competência correspondente |
| **TP-05** | Acessibilidade geral | 55 | Zero violações axe-core nas combinações de tema × contraste × tamanho de fonte × tela |
| **TP-06** | Build e lint | todas | `npm run build` e `npm run lint` sem erros |

## 8. Parte 2 — IAs de geração de imagem (Task 64)

### 8.1 O que motivou esta parte

A avaliação visual das peças de teste (2026-11-04) concluiu:
- **HQ:** a personagem é consistente entre os 6 quadros, com expressões
  diferentes, mas o desenho está "muito aquém do nível profissional".
- **Mapa:** a navegação por teclado funciona, mas o layout é limitado.
- **Ebook:** exibir todas as páginas de uma vez não é a melhor
  abordagem. Cada página deve ser uma prancheta própria, exportada em
  PDF e lida página a página na plataforma (virada de página). A tela
  com as três páginas lado a lado era só um mostruário.

Conclusão: o Claude Design, usado como foi (HTML e SVG desenhado em
código), serve para estrutura, interação, UI e design system, mas **não
substitui uma IA de imagem** na ilustração.

### 8.2 Divisão de papéis proposta

| Camada | Quem produz | Regra |
|---|---|---|
| Design system, telas, navegação, componentes, composição | Claude Design | Texto, balões, legendas, ícones e diagramas sempre em HTML ou SVG vivo |
| Ilustração: personagem, cenas, capas, ilustrações de capítulo, arte dos nós do mapa, hero e jornada | IA de imagem (a escolher) | **Arte sem texto dentro da imagem**; paleta e estilo vindos do design system v2 |
| Texto alternativo e roteiro textual de cada imagem | Claude, na revisão (Task 50) | Nenhuma informação existe só na imagem |

### 8.3 Casos de teste

Mesmos prompts e mesma rubrica para **todas** as ferramentas
candidatas, para a comparação ser justa. A rubrica vai de 1 a 5; o
julgamento de "nível profissional" é seu.

| ID | Verifica | Passa quando |
|---|---|---|
| **IM-01** | Consistência da personagem: ficha de personagem e 6 cenas a partir da mesma referência | Média ≥ 4 e nenhuma cena abaixo de 3 (rosto, roupa, proporção, estilo) |
| **IM-02** | Nível profissional percebido, comparado a referências de mercado (Tasks 43 e 57) | Sua aprovação explícita e média ≥ 4 em acabamento, expressividade e coerência |
| **IM-03** | Arte **sem texto** na imagem | Sem texto, ou texto distorcido, em pelo menos 5 das 6 cenas |
| **IM-04** | Aderência à paleta e ao estilo do design system v2 | Cores dominantes na família da paleta; ajustes pós-geração aceitáveis |
| **IM-05** | Controle de composição: espaço reservado para balões, enquadramento e proporção do painel | A composição respeita a reserva em pelo menos 5 das 6 cenas |
| **IM-06** | Elementos do mapa e do ebook: 4 ilustrações de nós, 1 capa, 2 ilustrações de capítulo, em estilo coerente | Coerência de estilo entre peças e legibilidade em tamanho reduzido |
| **IM-07** | Formato e peso: resolução, transparência, tamanho após otimização | Pelo menos 2× a largura de exibição e até 300 KB por imagem otimizada (proposta a calibrar) |
| **IM-08** | Direitos, divulgação e custo: uso comercial permitido, marcação de conteúdo gerado por IA, semelhança com obras ou marcas existentes, custo por imagem × volume | Uso comercial permitido, custo dentro do orçamento aprovado por você, nenhuma semelhança problemática |
| **IM-09** | Acessibilidade: alt-text e roteiro textual de cada imagem | Toda imagem tem texto alternativo; nada se perde sem a imagem |
| **IM-10** | Iteração: regenerar uma cena mantendo a personagem e o restante | A cena muda sem alterar as demais; custo de iteração registrado |

### 8.4 Ferramentas candidatas

| Candidata | Situação nesta sessão | Observação |
|---|---|---|
| **Figma `generate_image`** | **Acionável**, com 4 modelos (`gemini-3.1-flash-lite-image`, `gemini-3.1-flash-image`, `gpt-image-2.5-flare`, `gpt-image-2.5-sunburst`) | **Paga:** cada chamada consome créditos do plano do arquivo Figma; custo varia por modelo. Exige um arquivo Figma seu e sua permissão |
| Modelos do Figma Weave | Acionável pelo Figma, depende do seu espaço Weave | A verificar |
| Higgsfield, Canva | Conectores existem, mas **pedem autenticação sua** | Não avaliados sem login |
| Ferramenta externa que você já usa | Fora desta sessão | Você gera com os mesmos prompts; eu avalio os resultados |

> **Decisão D7 (2026-11-04):** o **usuário gera as imagens manualmente**,
> na IA de sua preferência, e informa o diretório; Claude elabora os
> prompts (`docs/prompts-ilustracao.md`) e avalia. A tabela acima
> registra o que cada ferramenta permite, mas **nenhuma geração é feita
> por Claude**. O custo dos casos IM-08 e IM-10 vem do registro que o
> usuário preenche (`testes/imagens-ia/registro-modelo.md`).

### 8.5 Registro de resultados

| ID | Data | Ferramenta A | Ferramenta B | Evidência |
|---|---|---|---|---|
| IM-01 | | | | |
| IM-02 | | | | |
| IM-03 | | | | |
| IM-04 | | | | |
| IM-05 | | | | |
| IM-06 | | | | |
| IM-07 | | | | |
| IM-08 | | | | |
| IM-09 | | | | |
| IM-10 | | | | |

**Ferramenta escolhida e justificativa:** _a preencher ao fim da Task 64._
