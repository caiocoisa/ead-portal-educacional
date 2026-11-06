# Roteiro do quadrinho: Duas sugestões da IA

> **Terceiro artefato do primeiro ciclo (2026-11-05).** Escrito a partir de
> `templates/roteiro-quadrinho.md`, antes de a Task 48 ser liberada (como foi
> feito com o e-book e o mapa). A peça publicada é a rota `/quadrinho`, um
> componente **nativo** do portal (`components/materials/ComicReader.tsx`,
> conteúdo em `content/quadrinho.ts`). As revisões das Tasks 48 a 50 ainda se
> aplicam.

## 1. Ficha

| Campo | Preenchimento |
|---|---|
| **Mensagem única** | "A IA propõe; a educadora audita e decide." (Bloco 5 do vídeo) |
| Público | Educadores, licenciandos e designers instrucionais, sem experiência com IA |
| Competências cobertas | **Curadoria da IA** (principal, lente 3), **Alinhamento pedagógico** e **Papel do educador**, pelos nomes do `topic` do banco |
| Personagem principal | **Marina**: professora de uns 40 anos, pele morena, cabelo cacheado, óculos redondos dourados, blazer azul-marinho e um pequeno broche verde (ficha em `testes/imagens-ia`, estilo A) |
| Fonte do conteúdo | Blocos 4A (alinhamento) e 4B (viabilidade e acesso) do roteiro v2 do vídeo, **em outro cenário** |
| Cenário | Semana 3 de um curso a distância de **fotografia com o celular**, para adultos iniciantes que estudam à noite, no próprio horário. Objetivo: tirar um retrato bem iluminado. Não repete nenhuma questão nem os casos do e-book e do mapa |
| Total de painéis | **6**, com **2 decisões** |

## 2. Sequência de painéis

Tipos: narrativo (faz a história andar), decisão (o leitor escolhe) e
descritivo (fecha a ideia). Todo texto é HTML; **a imagem não leva texto**
(decisão D6). As falas têm no máximo duas frases.

| # | Tipo | Cena (sem texto na imagem) | Fala ou legenda (HTML) | Texto alternativo |
|---|---|---|---|---|
| 1 | Narrativo | Marina sorri, sentada ao notebook (`E2-cena-01`) | "Semana 3 do meu curso de fotografia. Hoje a IA me ajuda a planejar." Narração: curso, público e objetivo da semana | Marina, sorrindo, trabalha ao notebook em sua mesa, em um escritório claro |
| 2 | Narrativo | Marina digita e explica com a mão aberta (`E2-cena-02`) | "Vou pedir com os quatro pilares: papel, contexto, tarefa e formato." Quadro: o comando completo | Marina, sorrindo com confiança, digita no notebook e levanta a mão aberta, explicando |
| 3 | Narrativo | Marina de perfil, preocupada, diante da tela (`E2-cena-03`) | "Hum… isso não parece certo." Quadro: **sugestão A da IA** (oficina ao vivo de 2 horas, câmera profissional, edição no computador) | Marina, de perfil, olha preocupada para a tela do notebook, cheia de rabiscos sem sentido |
| 4 | **Decisão** | Marina pensativa, queixo na mão (`E2-cena-04`) | "Antes de aceitar, vou olhar com as lentes." | Marina, pensativa, apoia o queixo na mão e olha para o notebook |
| 5 | **Decisão** | Marina com o celular, pedindo um ajuste (`E2-cena-05`) | "Mantenho o objetivo e troco o que não cabe." Quadros: o pedido de ajuste e a **sugestão B da IA** | Marina segura um celular com uma mão e levanta a outra, pedindo um ajuste |
| 6 | Descritivo | Marina de pé diante da janela, serena (`E2-cena-06`) | "A IA propõe. Eu confiro e decido." Aprofundamento opcional sobre as duas lentes usadas | Marina, de pé diante de uma janela, com expressão serena e confiante |

O **aprofundamento** do painel 6 é opcional (um bloco recolhido): sem ele a
história está completa, como pede a regra do Comixplain
(`pesquisa/engenharia-reversa/quadrinho.md`, Q3).

## 3. Bifurcações

Só se avança com a resposta certa, mas é possível errar e tentar de novo,
com a explicação de cada erro.

| Painel | Decisão | Opções (✓ = certa) e consequência |
|---|---|---|
| 4 | O que Marina deve notar na sugestão A? | "O plano não combina com o objetivo" → o objetivo e a atividade batem; o problema é outro. ✓ **"A oficina não cabe na rotina nem no aparelho dos alunos"** → é a lente da viabilidade. "A tabela usa uma linguagem difícil" → não há problema de texto |
| 5 | A sugestão B parece boa. O que Marina faz agora? | "Publica na hora" → a IA pode ter criado outro problema; audita-se também a versão ajustada. ✓ **"Confere de novo com as lentes e só então decide"**. "Descarta a IA e escreve do zero" → a IA ajudou; o ponto é auditar, não abandonar |

**Por que as decisões não são "aceitar ou pedir ajuste".** O template sugere
essa bifurcação (liga à Questão 3), mas ela reproduziria quase as
alternativas da própria questão e entregaria a resposta dela. As decisões
aqui são de **diagnóstico** ("o que há de errado?") e de **verificação**
("e agora?"), com outro cenário e outras opções.

## 4. Revisão e fontes

- [x] Conteúdo conferido contra os Blocos 4A e 4B do roteiro v2 (alinhamento e viabilidade e acesso).
- [x] Uma só mensagem; nenhuma fala excede duas frases.
- [ ] Revisão por uma segunda pessoa e por educadores do perfil-alvo (Task 50).
- Referências de estrutura: Comixplain (painéis descritivos, narrativos e de aprofundamento), "uma só mensagem" das regras de quadrinhos científicos e a condensação de falas de McCloud, todas em `pesquisa/engenharia-reversa/quadrinho.md`.

## 5. Acessibilidade

- [x] Cada painel tem texto alternativo na imagem e **todo o texto em HTML** (balões e quadros).
- [x] Visão **"Roteiro em texto"** com os seis painéis em sequência, as decisões e as respostas, como alternativa para leitor de tela.
- [x] Ordem de leitura linear; botões reais "Anterior" e "Próximo", operáveis por teclado; "Próximo" explica por que está bloqueado (`aria-describedby`).
- [x] O retorno de cada decisão é anunciado (região `status`); o erro não usa só a cor (ícone e texto "Ainda não.").
- [x] Em tela pequena o balão fica **abaixo** da imagem, sem sobrepor.
- [x] Auditado com axe-core (WCAG 2.2 AA) em tema claro e escuro, contraste normal e alto e três tamanhos de fonte; também com a decisão errada, a certa e o roteiro em texto.

## 6. Checklist de qualidade

- [x] **Uma só mensagem.**
- [x] Os painéis de aprofundamento são dispensáveis.
- [x] Nenhuma fala excede 2 frases.
- [x] Personagem idêntica em todos os painéis (mesma ficha, estilo A).
- [x] Nenhum painel revela a resposta de uma questão: cenário e opções diferentes.
- [ ] Revisão por educadores (Task 50).

## Decisão de produção: as cenas são as de teste

As seis cenas são as **cenas de avaliação da Task 64** (`E2-cena-01` a
`06`), cujos prompts já reservavam área livre para o balão e cujas poses
(calma, pedido à IA, preocupação, reflexão, ajuste, confiança) formam
exatamente este arco. Isso pôs o quadrinho no ar com arte real, mas tem duas
consequências:

- **As mesmas imagens aparecem no e-book.** Aceitável por serem a mesma
  personagem, mas o quadrinho pode ganhar cenas próprias no futuro.
- **São imagens de avaliação**, geradas com a paleta atual. O plano prevê
  refazê-las quando o design system v2 existir (Task 59).

Um **episódio 2** (outro caso, com bifurcações que mudem a história) exigiria
cenas novas, a escrever com os mesmos blocos de `docs/prompts-ilustracao.md`.

## Matriz de cobertura

| Painel | Competência | Questão do banco | Como se relaciona |
|---|---|---|---|
| 3 e 4 | Curadoria da IA | 3 (principal) | Mostra a auditoria de viabilidade em **outro cenário**, com decisão de diagnóstico |
| 4 e 5 | Alinhamento pedagógico | 1 | Menciona que objetivo e atividade batem, sem repetir o cenário da questão |
| 5 e 6 | Papel do educador | 4 | Marina confere e decide; a IA acelera o rascunho |
| 2 | Comandos para a IA | 2 | O comando traz os quatro pilares, em outra disciplina |
