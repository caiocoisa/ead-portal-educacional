# Roteiro do e-book: Planejar com IA sem perder a didática

> **Edição preliminar (2026-11-05).** Roteiro v0 do e-book, escrito a partir
> de `templates/roteiro-ebook.md` para atender ao requisito **R1** (capa,
> sumário e capítulos em ordem lógica, design profissional, interatividade e
> linguagem clara). Foi produzido antes de a Task 48 ser liberada, para
> permitir uma apresentação; **não substitui** a revisão prevista nas Tasks
> 48 a 50. A peça publicada é `conteudo/ebook/preliminar/index.html`.

## Pendências que afetam este roteiro

| Item | Situação neste roteiro | Quem decide |
|---|---|---|
| **D-08** (numeração das lentes) | Adotada a correção recomendada: lente 1 alinhamento, lente 2 instruções estruturadas, lente 3 curadoria (inclui a viabilidade técnica e de acesso), lente 4 papel do educador. **Provisório**, até o vídeo ser corrigido | Você |
| **D-09** ("conteúdos" entre os elementos) | O e-book ensina os **quatro** elementos que o vídeo ensina hoje (público, objetivos, atividades, avaliação). Se a decisão for incluir "conteúdos", o capítulo 1 e o cartão de referência mudam | Você |
| Autoria e identidade visual | A capa diz "autoria e identidade visual em elaboração" | Você; Tasks 59 e 49 |
| Ilustrações da Marina | Três encaixes prontos (`E3-ebook-capa`, `E3-ebook-cap1`, `E3-ebook-cap3`); até existirem, vale a arte geométrica provisória | Você (geração); Claude (prompts) |
| Plataforma de publicação | Preparado o PDF para importação; a escolha entre FlipHTML5 e Genially é da Task 58 | Você (ponto C) |

## 1. Ficha

| Campo | Preenchimento |
|---|---|
| Título e subtítulo | **Planejar com IA sem perder a didática.** Guia de bolso para educadores na educação a distância |
| Promessa | Ao fim, o leitor consegue pedir um plano à IA com os quatro pilares do comando, auditá-lo com as quatro lentes e decidir o que fica, o que muda e o que só o educador decide |
| Público | Educadores, licenciandos e designers instrucionais, sem experiência com IA |
| Capítulos | 4 (um por competência do banco de questões) |
| Extensão | 18 páginas: capa, como usar, sumário, 12 páginas de capítulos, glossário, cartão de referência e contracapa |
| Plataforma | FlipHTML5 ou Genially (Task 58), a partir do PDF; versão acessível em HTML |

## 2. Capa

Título, subtítulo, promessa em uma linha, faixa "Edição preliminar" e faixa
de autoria. A arte da capa não leva texto: o texto é HTML. Encaixe da
ilustração: `arte/E3-ebook-capa.png` (3:4), com o terço superior livre para o
título e uma faixa inferior livre para a autoria.

## 3. Sumário

Lista clicável com número de página, na página 3.

## 4. Capítulos

Todo capítulo tem **três páginas**: (A) abrir e entender, (B) exemplo e
prática, (C) interagir e conferir. Cada um traz um elemento interativo.

### Capítulo 1: Alinhamento (lente 1). Competência: Alinhamento Construtivo e Coerência Didática

| Parte | Conteúdo |
|---|---|
| Abertura | "Se o plano de aula pudesse falar, ele saberia dizer por que cada atividade existe?" |
| Conceito | Alinhamento pedagógico: coerência entre público, objetivo, atividades e avaliação. Termo definido no primeiro uso: objetivo de aprendizagem |
| Exemplo | Curso de **Educação Financeira** (jovens adultos, celular). A IA propôs ler um texto sobre juros e uma prova de definições; o objetivo era comparar duas propostas de empréstimo. Tabela de auditoria elemento a elemento |
| Prática | Três passos: verbo observável no objetivo; a atividade treina esse verbo?; a avaliação mede esse verbo? |
| Interativo | Quatro cartões que revelam a pergunta-chave de cada elemento (`aria-expanded`) |
| Checklist e síntese | Quatro itens; "alinhar é fazer objetivo, atividade e avaliação contarem a mesma história" |

### Capítulo 2: Como pedir bem à IA (lente 2). Competência: Formulação de Instruções Estruturadas

| Parte | Conteúdo |
|---|---|
| Abertura | "Por que a IA, às vezes, devolve um plano genérico?" |
| Conceito | IA generativa e comando (prompt) definidos; os quatro pilares: Papel, Contexto, Tarefa, Formato |
| Exemplo | Antes e depois, em **Inglês instrumental para técnicos de enfermagem** (curso assíncrono, nível básico, celular, à noite) |
| Prática | Modelo para copiar e dica sobre o formato |
| Interativo | **Montador de comando**: quatro campos e o comando montado em tempo real, com contagem de pilares, cópia e preenchimento de exemplo |
| Checklist e síntese | Quatro itens; "quem escreve melhor o pedido audita menos depois, mas audita sempre" |

### Capítulo 3: Auditar a sugestão da IA (lente 3). Competência: Curadoria Humana e Intervenção Corretiva

| Parte | Conteúdo |
|---|---|
| Abertura | "A resposta chegou. E agora?" |
| Conceito | Curadoria humana; duas perguntas: está alinhada? é viável para este público (tempo, aparelho, internet, custo)? Síncrono e assíncrono definidos |
| Exemplo | Curso de **Educação Ambiental** para moradores de região rural, assíncrono, celular, internet instável e pacote de dados limitado. Tabela: pergunta de auditoria e o que fazer quando a resposta é não |
| Prática | Modelo de comando de ajuste: "Mantenha…; troque… por… compatível com…" |
| Interativo | **Caça às falhas**: quatro trechos da sugestão, "manter" ou "ajustar", com diagnóstico e contagem. Três trechos pedem ajuste (um de viabilidade de tempo, um de peso do material, um de alinhamento da avaliação) e um se mantém |
| Checklist e síntese | Quatro itens; "a IA propõe; você confere a pedagogia e a realidade" |

### Capítulo 4: O papel do educador (lente 4). Competência: Papel do Educador no Design Instrucional

| Parte | Conteúdo |
|---|---|
| Abertura | "O que a IA pode rascunhar, e o que só você pode decidir?" |
| Conceito | Design instrucional definido; a IA acelera a redação e a organização, e o julgamento pedagógico, o conhecimento do aluno e a responsabilidade ficam com o educador |
| Exemplo | Uma semana de planejamento em cinco passos que alternam educador e IA |
| Prática | Pedir, auditar, decidir |
| Interativo | **Quem faz o quê**: seis tarefas classificadas como "a IA pode rascunhar" ou "decisão do educador", com retorno imediato |
| Checklist e síntese | Quatro itens e o convite para a Avaliação Interativa |

## 5. Glossário e referências

Doze termos em linguagem simples, na página 16 (alinhamento pedagógico,
assíncrono, avaliação formativa, comando, contexto, curadoria, design
instrucional, EaD, IA generativa, objetivo de aprendizagem, síncrono,
viabilidade). Referências: este roteiro não cita fontes externas; o conteúdo
deriva do roteiro audiovisual v2 e do banco de questões.

## 6. Linguagem clara

- [x] Frases curtas.
- [x] Termo técnico definido no primeiro uso, com glossário no fim.
- [ ] Revisão por 2 ou 3 educadores do perfil-alvo (Task 50; **ainda não feita**).

## 7. Duas faces

- **Interativa:** `preliminar/index.html` (página a página, com os quatro elementos interativos), e o PDF para importar na plataforma. Elementos interativos viram versões impressas estáticas no PDF (modelo em branco, respostas à vista).
- **Acessível:** o próprio HTML é navegável por teclado e leitor de tela. O PDF é a versão para impressão.

## 8. Matriz de cobertura: capítulo × competência × questão

| Capítulo | Competência | Questão do banco | Como o capítulo se relaciona |
|---|---|---|---|
| 1 | Alinhamento | 1 | Ensina o conceito com **outro cenário**; não cita a questão |
| 2 | Instruções estruturadas | 2 | Ensina os quatro pilares com **outra disciplina**; não repete as alternativas |
| 3 | Curadoria | 3 | Ensina a auditoria com **outro público e outras restrições** |
| 4 | Papel do educador | 4 | Trabalha a divisão de tarefas sem repetir as alternativas da questão |

## 9. Checklist de qualidade

- [x] Capa, sumário navegável e capítulos em ordem lógica.
- [x] Todo capítulo segue a mesma estrutura de três páginas.
- [x] Pelo menos um elemento interativo por capítulo.
- [x] Nenhum capítulo reproduz o cenário ou as alternativas de uma questão.
- [x] Vocabulário igual ao do vídeo (com a ressalva do D-08).
- [ ] Revisão de linguagem clara por educadores (Task 50).
- [ ] Design profissional final (Tasks 59 e 49, via Claude Design).
- [ ] Publicação na plataforma (Task 61, depois da escolha na Task 58) e incorporação ao portal (Task 52).
