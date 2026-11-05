# Engenharia reversa: quadrinho educativo

> Task 43 · fontes acessadas em 2026-11-04 · esqueleto em
> `templates/roteiro-quadrinho.md`

## 1. Critérios e limites

**Critérios:** (1) fonte primária consultável; (2) quadrinho de
**explicação** (não ficção), voltado a adultos; (3) processo ou estrutura
observável; (4) diversidade: um caso corporativo, um projeto de pesquisa,
um livro conhecido e um artigo de diretrizes.

**Limites:** **não vi as páginas dos quadrinhos**, só texto sobre eles.
Por isso a ficha registra **processo, regras e princípios**, não
diagramação de página. As dez regras do artigo da PLOS **não foram
extraídas** (a página volta sem os títulos); só há dois pontos
confirmados por resumo de busca, marcados como tal.

---

## 2. Fichas

### Q1. Quadrinho do Google Chrome (Scott McCloud, 2008)

| Item | Observado |
|---|---|
| Fontes | [Página do autor](https://scottmccloud.com/googlechrome) (primária) e [entrevista no TechRadar](https://www.techradar.com/news/internet/google-chrome-interview-with-artist-scott-mccloud-462793) |
| Propósito | Explicar o funcionamento interno de um produto novo; **feito como impresso para jornalistas e blogueiros**, não como webcomic |
| **Processo de roteiro** | McCloud ajudou a **entrevistar cerca de 20 engenheiros** e adaptou o que disseram para a linguagem de quadrinhos; "algum parafraseio, muita condensação" |
| Autoria das falas | Segundo a entrevista, **as palavras são dos engenheiros**, condensadas e editadas para gramática e leitura; a dificuldade foi filtrar dezenas de milhares de palavras |
| Tamanho | Um resumo de busca fala em 38 páginas. **Não conferi na página** |
| Não observado | Distribuição de painéis, ritmo, uso de personagem |

### Q2. "Ten simple rules for drawing scientific comics" (PLOS Computational Biology, 2018)

| Item | Observado |
|---|---|
| Fonte | [Artigo em acesso aberto (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5754043/) |
| Confirmado (resumo de busca, **não lido no texto**) | Cada quadrinho deve ter **uma só mensagem**, como uma figura de artigo; "não precisa ser bom em desenho"; há uma regra sobre **conferir a ciência** ("faça certo, não perfeito") |
| Não observado | As dez regras completas |

### Q3. Comixplain (USTP, Áustria)

| Item | Observado |
|---|---|
| Fonte | [Página do projeto](https://research.fhstp.ac.at/en/projects/comixplain) |
| **Estrutura modular** | Tiras de painéis são **descritivas** (explicação básica), **narrativas** (fazem a história avançar e ligam as descritivas) ou **de aprofundamento** (detalhe opcional para turmas avançadas) |
| Regra de ouro | **Sem os painéis de aprofundamento, a história continua completa** |
| Reuso | Feitos para editar, compartilhar e **incorporar a slides e e-learning**; licença Creative Commons |
| Rigor | **Revisão por pares** do conteúdo; **fontes originais** incluídas no material |

### Q4. The Cartoon Guide to Statistics (Gonick e Smith)

| Item | Observado |
|---|---|
| Fonte | [Descrição no Internet Archive](https://archive.org/details/TheCartoonGuideToStatistics) |
| Escopo declarado | Resumo e exibição de dados, probabilidade em jogos de azar e medicina, variáveis aleatórias, ensaios de Bernoulli, Teorema Central do Limite, testes de hipótese, intervalos de confiança; "ilustrações simples, claras e divertidas" |
| Não observado | **Índice de capítulos e estrutura de página.** O arquivo está sob licença que não permite reprodução; não copiei nada |

---

## 3. Padrões extraídos

| Padrão | Fonte |
|---|---|
| **Uma mensagem por quadrinho** | Q2 (não lido no texto) |
| Processo: **entrevista com especialistas → condensação → roteiro** | Q1 |
| Falas **fiéis ao conteúdo técnico**, só condensadas | Q1 |
| **Painéis descritivos + narrativos, com aprofundamento opcional** | Q3 |
| **Revisão por pares e fontes citadas** | Q3 |
| **Modular e reutilizável** em slides e e-learning | Q3 |
| Público definido antes do roteiro (jornalistas e blogueiros) | Q1 |

## 4. Esqueleto destilado

1. **Mensagem única** e público definidos antes de tudo.
2. **Conteúdo-base** vindo do roteiro do vídeo (nosso "especialista").
3. Sequência de painéis em três tipos: **descritivo, narrativo, aprofundamento**.
4. **Bifurcações** de decisão onde o leitor escolhe (decisão D1; inferência
   nossa, fora das fontes).
5. **Texto em HTML**, nunca dentro da imagem (decisão D6).
6. **Revisão de conteúdo** e referências ao final.

Template em `templates/roteiro-quadrinho.md`.

## 5. O que não serve

- O quadrinho do Chrome foi feito para **impressão** e para um público de
  jornalistas; o nosso é digital, para educadores.
- O Cartoon Guide é um livro inteiro; o nosso é uma narrativa curta.

## 6. Lacunas

- Falta a leitura das **dez regras** da PLOS e a análise de **páginas
  reais** de um quadrinho (ritmo, texto por painel, número de painéis por
  página). Para isso preciso ler a obra, não só descrições. **Se você
  tiver um quadrinho educativo de referência (PDF ou link), me envie.**
