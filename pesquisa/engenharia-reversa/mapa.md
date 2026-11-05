# Engenharia reversa: mapa interativo

> Task 43 · fontes acessadas em 2026-11-04 · esqueleto em
> `templates/roteiro-mapa.md`

## 1. Critérios e limites

**Critérios de seleção** (declarados antes da coleta):
1. fonte primária consultável (documentação oficial, página do produto ou
   relatório técnico);
2. relevância para o nosso caso: conteúdo conceitual, com uma explicação
   curta por elemento, em contexto educacional;
3. estrutura observável sem pagamento;
4. diversidade: duas ferramentas de autoria, um formato narrativo e uma
   base teórica.

**Limites desta pesquisa:** a extração foi feita em **texto**; não vi as
telas renderizadas. Nenhuma fonte foi medida quanto a acessibilidade por
teclado ou leitor de tela. As páginas de fornecedores registram o que o
fornecedor afirma, não o que foi verificado.

---

## 2. Fichas

### M1. H5P Image Hotspots

| Item | Observado |
|---|---|
| Fonte | [h5p.org/image-hotspots](https://h5p.org/image-hotspots) (página oficial do tipo de conteúdo) |
| O que é | Tipo de conteúdo HTML5 gratuito para adicionar pontos clicáveis a uma imagem |
| Estrutura | Imagem de fundo + N pontos; ao clicar, abre um **popup com cabeçalho e texto ou vídeo** |
| Configurável | Número de pontos, posição e conteúdo de cada um, cor do ponto |
| Publicação | H5P.com ou plugin em Canvas, Brightspace, Blackboard, Moodle e WordPress; conteúdo sob licença CC BY 4.0 |
| Sinais de uso | Comentários de usuários no fórum perguntam como acionar por **hover**, trocar o ícone do ponto e combinar imagem com legenda e links. Não vi as respostas |
| Não observado | Acessibilidade por teclado e leitor de tela; limite de pontos |

### M2. Genially, imagem interativa

| Item | Observado |
|---|---|
| Fonte | [genially.com/create/interactive-images](https://genially.com/create/interactive-images/) (página do produto, **alegações do fornecedor**) |
| Estrutura | Pontos sobre qualquer imagem (foto, mapa, diagrama, GIF); cada ponto abre popup, rótulo de texto, descrição em áudio ou imagem ampliada |
| Conteúdo do popup | Vídeo, áudio, links e conteúdo de terceiros (a página cita Google Maps, YouTube e Wikipedia) |
| Sinalização | Marcadores animados que pulsam para mostrar onde clicar |
| Publicação | Incorporar no site, compartilhar por link, baixar em HTML (funciona offline) ou como pacote compatível com SCORM |
| Não observado | Preço e limites do plano gratuito; acessibilidade |

### M3. ArcGIS StoryMaps (percurso em mapa)

| Item | Observado |
|---|---|
| Fonte | [Esri Índia: guia do StoryMaps](https://www.esri.in/en-in/newsroom/blog/telling-powerful-stories-using-arcgis-storymaps-the-how-to-guide) (blog do fornecedor) |
| Dois modos de navegação | **Explorer tour:** o leitor percorre os lugares **na ordem que preferir**. **Guided tour:** o leitor é conduzido de um lugar a outro **em ordem intencional** |
| Outros blocos | Sidecar (texto ao lado de mídia grande), slideshow (aprofundamento opcional em carrossel) |
| Publicação | Link ou incorporação; níveis de privacidade na hora de publicar; visualização prévia em vários dispositivos |
| Não serve a nós | Depende de mapa geográfico; aproveitamos só o **padrão de navegação** (livre × guiado) |

### M4. Mapa conceitual (Novak e Cañas, IHMC)

| Item | Observado |
|---|---|
| Fonte | [Relatório técnico IHMC CmapTools 2006-01, rev. 2008](https://cmap.ihmc.us/docs/theory-of-concept-maps.php) (fonte primária; há versão em português em PDF) |
| Estrutura | **Conceitos** em caixas, ligados por linhas com **frases de ligação** que dizem a relação; conceito + ligação + conceito formam uma **proposição** |
| Hierarquia | Conceitos mais gerais no topo, mais específicos abaixo; leitura de cima para baixo; **ligações cruzadas** entre ramos |
| Ponto de partida | Uma **pergunta-foco** (exemplo do relatório: "Como medimos o tempo?"). O tipo da pergunta muda o mapa: "O que são plantas?" gera um mapa classificatório; "Por que precisamos de plantas?" gera um mapa explicativo |
| Uso em aula | Pode ser construído em grupo; o ponto de partida varia com o conhecimento prévio da turma |

---

## 3. Padrões comparados

| Dimensão | H5P | Genially | StoryMaps | Mapa conceitual |
|---|---|---|---|---|
| Ponto de partida | imagem | imagem | mapa ou percurso | **pergunta-foco** |
| Gatilho | clique | clique (a página fala em "clicks") | navegação por seção | leitura |
| Conteúdo por elemento | cabeçalho + texto ou vídeo | popup, texto, áudio, imagem, vídeo, link | texto + mídia por parada | conceito + frase de ligação |
| Ordem | livre | livre | **livre ou guiada** | hierárquica |
| Publicação | plugin de LMS | embed, link, HTML, SCORM | link, embed | PDF e software |

---

## 4. Esqueleto destilado

| # | Decisão de estrutura | Origem |
|---|---|---|
| 1 | Começar por uma **pergunta-foco**, não por um título | M4 |
| 2 | **4 a 6 elementos**, dos mais gerais aos mais específicos | M4 (hierarquia); a quantidade é decisão nossa |
| 3 | Cada elemento abre um bloco de **formato fixo**: cabeçalho e texto curto | M1, M2 |
| 4 | Dentro do bloco: **conceito, exemplo e falha típica da IA** | inferência nossa, a partir do roteiro v2 (Blocos 1, 4A e 4B) |
| 5 | **Relações nomeadas** entre elementos (frase de ligação) | M4 |
| 6 | **Modo livre** como padrão e **percurso sugerido** opcional | M3 |
| 7 | Fecho com chamada para a avaliação | inferência nossa |

O template preenchível está em `templates/roteiro-mapa.md`.

---

## 5. O que não serve ao nosso caso

- Mapas conceituais completos (dezenas de conceitos) são densos demais
  para o nosso objetivo de 4 a 6 elementos.
- H5P e Genially prendem o conteúdo à plataforma; o nosso mapa será um
  componente do portal (Task 52), com acessibilidade verificada por nós.
- O StoryMaps depende de geografia.

## 6. Lacunas

- **Nenhuma fonte foi avaliada quanto a teclado e leitor de tela.** Isso
  precisa ser testado (casos CD-06 e PL-03 dos planos de teste).
- Não encontrei um exemplo educacional publicado e completo de "mapa
  interativo conceitual" para desmontar por inteiro. **Se você conhecer um
  ou dois que admira, indique** e eu os incluo.
