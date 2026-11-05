# Engenharia reversa: ebook interativo

> Task 43 · fontes acessadas em 2026-11-04 · esqueleto em
> `templates/roteiro-ebook.md`

## 1. Critérios e limites

**Critérios:** (1) fonte consultável; (2) guia de construção ou exemplo de
ebook **interativo**; (3) estrutura observável; (4) evidência de elementos
essenciais: capa, sumário e capítulos (requisito R1).

**Limites, e esta é a mídia com a evidência mais fraca:**
- As três fontes que consegui ler são de **fornecedores de ferramenta**
  (FlippingBook, Foleon, Kotobee): descrevem o que a ferramenta faz, e
  suas afirmações de eficácia são **promocionais**.
- **Falharam:** o blog do FlipHTML5 (acesso negado), o modelo de capítulo
  do Turing Way (erro de certificado) e o do Open at Scale (acesso
  negado). Os modelos de capítulo que cito abaixo vêm de **resumos de
  busca, não das páginas**, e estão marcados.
- Não vi nenhum ebook interativo completo e publicado.

---

## 2. Fichas

### E1. FlippingBook: guia "How to Create an Engaging Ebook"

| Item | Observado |
|---|---|
| Fonte | [examples.flippingbook.com/ebook](https://examples.flippingbook.com/ebook) (fornecedor; o guia é, ele próprio, um flipbook com sumário) |
| **Sequência de criação** | **Tópico** (sobre o que escrever) → **Esboço** (estruturar as ideias) → **Conteúdo** → **Design** → **Interatividade** (vídeo, pop-ups, GIFs, formulários e quizzes) → **Lançamento e divulgação** |

### E2. Foleon: "What Are Interactive Ebooks?" (atualizado em maio de 2026)

| Item | Observado |
|---|---|
| Fonte | [foleon.com/blog/interactive-ebooks](https://www.foleon.com/blog/interactive-ebooks) (fornecedor) |
| Definição | Documento digital com **vídeos, animações, navegação clicável, quizzes e formulários** embutidos; vive no navegador, adapta-se a qualquer dispositivo e dá dados de engajamento |
| Perguntas que o guia organiza | O que torna um ebook interativo; por que superaria um PDF estático (**afirmação promocional**); que recursos exigir de uma plataforma; como criar passo a passo |

### E3. Kotobee: ebook de amostra "Design Styles"

| Item | Observado |
|---|---|
| Fonte | [kotobee.com/samples/design-styles](https://www.kotobee.com/samples/design-styles) (demonstração do fornecedor) |
| Elementos interativos demonstrados | **Sumário interativo com links de navegação**; galeria de imagens com detalhes por imagem; cartões que revelam outros ao passar o cursor; imagem arrastável que revela detalhes; cubos 3D que giram ao clique; imagem que ganha cor com o cursor |
| Observação | Parte dos efeitos exige **código personalizado** (a própria página avisa) |

### E4. Modelos de capítulo (**não conferidos nas páginas**)

Resumos de busca indicam, **sem eu ter lido as fontes**:
- Modelo do Turing Way: capítulo com seção de **checklist** (ações para o
  leitor) e **recursos**.
- Modelo do Open at Scale: capítulo que começa por **resultados de
  aprendizagem**.
- Guias de Pressbooks e de pedagogia: abertura com **pergunta-foco, metas
  de aprendizagem e caso ou problema**; uma proporção de exercícios por
  capítulo (reconhecimento, aplicação, análise).

Tratar como **hipótese a confirmar**, não como evidência.

---

## 3. Padrões

| Padrão | Fonte | Confiança |
|---|---|---|
| Sequência **tópico → esboço → conteúdo → design → interatividade → lançamento** | E1 | média (fornecedor) |
| **Sumário clicável** | E3 | média |
| Interação por **revelação** (cartões, galeria com detalhe, imagem arrastável) | E3 | média |
| **Quizzes e vídeo** embutidos | E1, E2 | média |
| Capítulo com **objetivo no início e checklist no fim** | E4 | **baixa (resumos de busca)** |

## 4. Esqueleto destilado

1. **Capa** (promessa e público), **sumário clicável**, capítulos em ordem
   lógica (requisito R1).
2. Cada capítulo: **abertura** (objetivo ou pergunta-foco) → **conceito** →
   **exemplo ou caso** → **prática** → **checklist e síntese**. A ordem vem
   de E4 (baixa confiança) e do nosso roteiro v2.
3. **Um elemento interativo por capítulo** (requisito R1), escolhido entre
   os padrões de revelação de E3 e a autoverificação.
4. **Linguagem clara**: frases curtas, termo técnico definido no primeiro
   uso, glossário (requisito R1).
5. **Duas faces:** versão interativa na plataforma e versão acessível no
   portal (decisão do plano).

Template em `templates/roteiro-ebook.md`.

## 5. O que não serve

- Os guias de fornecedores são pensados para **geração de leads** e
  marketing; o nosso ebook é material de aprendizagem.
- Efeitos 3D e animações que pedem código personalizado não combinam com
  acessibilidade e manutenção simples.

## 6. Lacunas

- **A evidência desta mídia é a mais fraca.** Falta ler dois ou três
  **ebooks reais** (de preferência educacionais e em português) e os
  modelos de capítulo que falharam. **Se você tiver ebooks de referência
  que admira (PDF ou link), indique:** é o jeito mais rápido de fechar
  esta lacuna.
