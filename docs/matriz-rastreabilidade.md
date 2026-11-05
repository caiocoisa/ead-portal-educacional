# Matriz de rastreabilidade: banco de questões × roteiro do vídeo

> Gerado em: 2026-11-04 · Task 39 (`task-master.md`)
> Análise apenas: nenhum arquivo de conteúdo (`content/module.ts`,
> roteiro, banco) foi alterado.
> **Método:** leitura integral do roteiro v2, do `banco-questoes.md`, de
> `content/module.ts` e de `content/landing.ts`, mais um script de
> rastreamento (`testes/rastreabilidade/trace.js`) que localiza cada
> termo no roteiro por bloco e timestamp e compara `module.ts` com o
> banco. **O vídeo ainda não foi gravado:** o roteiro v2 é o substituto
> da fala real. Quando houver vídeo, rodar o script de novo sobre a
> transcrição (gate pós-gravação, decisão D5).

---

## 1. Resumo

**O banco está bem alinhado ao roteiro em conceito, mas o alinhamento é
literal demais e há inconsistências que vale corrigir antes de gravar.**
O que muda o plano em relação à primeira leitura:

| # | Achado | Classificação |
|---|---|---|
| D-01 | Só o feedback "distante" diverge entre `banco-questoes.md` e `module.ts` (as 4 questões); o resto é idêntico | Ajustar |
| D-02 | "Coerência didática" e "alinhamento construtivo" só aparecem no Bloco 5 (26:30) | Ajustar |
| D-03 | Questão 2: a alternativa correta é o comando do Bloco 3, palavra por palavra | Ajustar (D2) |
| D-04 | Questões 1 e 3 repetem os cenários e as frases do vídeo | Ajustar (D2) |
| D-05 | "Co-piloto" não existe no vídeo; "responsabilidade final" só aparece no plural | Aceitável |
| D-06 | Uma questão por competência: o relatório mede cada uma com uma pergunta | Ajustar (D2) |
| **D-07** | **A alternativa correta é a mais longa em 3 das 4 questões; distratores extremos nas Questões 3 e 4** | Ajustar |
| **D-08** | **A numeração das "lentes" se contradiz: o Bloco 4B diz "segunda lente" para viabilidade; o Bloco 5 lista como segunda "formulação de instruções"** | **Bloqueante para a gravação** |
| **D-09** | **A home promete cinco elementos (inclui "conteúdos"), mas o vídeo ensina quatro e nenhuma questão cobre "conteúdos"** | Ajustar |
| D-10 | Quatro vocabulários diferentes para as mesmas quatro competências | Ajustar |

---

## 2. Objetivos de aprendizagem declarados

Fonte: `content/landing.ts` (o que o portal promete ao aluno).

| Código | Objetivo do curso (`courseObjectives`) | Questões que o avaliam | Cobertura |
|---|---|---|---|
| O1 | Compreender como articular público, objetivos, conteúdos, atividades e avaliação | Q1 (só objetivo ↔ avaliação); Q3 (só atividade ↔ público) | **Parcial.** Nada sobre "conteúdos" |
| O2 | Reconhecer a importância do alinhamento pedagógico | Q1 | Boa, mas por reconhecimento (ver D-04) |
| O3 | Estruturar comandos eficientes para a IA | Q2 | Boa, mas por reconhecimento literal (D-03) |
| O4 | Desenvolver olhar crítico para analisar e melhorar sugestões da IA | Q3, Q4 | Boa em Q3; Q4 é conceitual |

---

## 3. Matriz por questão

**Legenda dos blocos do roteiro:** B1 (00:00–05:00), B2 (05:00–10:00),
B3 (10:00–17:00), B4A (17:00–22:00), B4B (22:00–26:30), B5 (26:30–30:00).
Os timestamps são o **início da linha da tabela** do roteiro onde o termo
aparece.

### Questão 1: Alinhamento pedagógico (`q1`)

| Item | Conteúdo |
|---|---|
| Objetivo | O2 (e parte do O1) |
| Competência (`topic`) / lente no Bloco 5 | "Alinhamento pedagógico" / lente 1 |
| Sustentação no vídeo | **B1 01:30** (quatro elementos do alinhamento) · **B1 03:15** (competência prática exige avaliação que a mede) · **B3 12:30** ("rotinas de código executáveis para resolver problemas simples") · **B4A 17:00** (demonstra a prova de múltipla escolha sobre a história da computação: "quebra evidente do alinhamento pedagógico") · **B4A 19:30** · **B5 26:30** |
| Alternativa correta | B: quebra de coerência didática, o método não mede a capacidade prática |
| Distratores | A (tempo de processamento): implausível · **C (linguagem técnica): plausível, é o "erro próximo"** · D (gráficos): implausível |
| Feedback próximo | C: a linguagem importa, mas a falha central é o instrumento de medida |
| Feedback distante | `module.ts`: genérico (sem apontar trecho) · `banco`: "Bloco 1" |
| Bloom nominal → efetivo | Analisar → **Lembrar** (o cenário e a frase do objetivo são os do vídeo) |
| Divergências | D-02, D-04, D-07, D-01 |

### Questão 2: Comandos para a IA (`q2`)

| Item | Conteúdo |
|---|---|
| Objetivo | O3 |
| Competência / lente | "Comandos para a IA" / lente 2 (no Bloco 5) |
| Sustentação no vídeo | **B2 05:00** (perguntas genéricas rendem planos rasos) · **B2 07:00** (os quatro pilares: papel, contexto, tarefa, formato; uma única linha da tabela) · **B2 08:45** · **B3 10:00** (o comando completo, aplicado) |
| Alternativa correta | B: "Aja como um designer instrucional especialista em Computação. Crie um plano de aula assíncrono… avaliação formativa." |
| Distratores | A (vago): óbvio · **C (tarefa e formato, sem papel e contexto): plausível, é o "erro próximo"** · D (pesquisar cursos): fora da tarefa |
| Feedback próximo | C: faltam os pilares Papel e Contexto |
| Bloom nominal → efetivo | Aplicar → **Lembrar** (a correta é o texto exato de B3 10:00) |
| Divergências | D-03, D-07, D-01. Além disso, "avaliação formativa" só aparece dentro do comando citado e nunca é definida |

### Questão 3: Curadoria da IA (`q3`)

| Item | Conteúdo |
|---|---|
| Objetivo | O4 |
| Competência / lente | "Curadoria da IA" / lente 3 |
| Sustentação no vídeo | **B3 15:00** (a auditoria "tem mais de uma camada") · **B4B 22:00** · **B4B 22:30** (debate de duas horas, software pesado) · **B4B 24:00** (público flexível, celular) · **B4B 25:00** ("Substitua essa dinâmica por um exercício assíncrono e leve, compatível com acesso via smartphone"; curadoria humana indispensável) · **B5 26:30** |
| Alternativa correta | C: novo comando pedindo exercício assíncrono e leve, compatível com smartphones |
| Distratores | **A (aceitar sem alterações): plausível, é o "erro próximo"** · B (cancelar o curso): extremo · D (exigir que o aluno compre computadores): extremo |
| Feedback próximo | A: a IA desconhece a realidade tecnológica dos alunos |
| Bloom nominal → efetivo | Avaliar → **Lembrar** (cenário e solução são os do vídeo) |
| Divergências | D-04, D-07, D-08, D-01 |

### Questão 4: Papel do educador (`q4`)

| Item | Conteúdo |
|---|---|
| Objetivo | O4 |
| Competência / lente | "Papel do educador" / lente 4 |
| Sustentação no vídeo | **B1 03:15** (a IA como ferramenta valiosa para acelerar a estruturação) · **B5 26:30** ("papel insubstituível do educador") · **B5 28:30** ("assistente de redação e organização pedagógica"; "validação técnica, empatia pedagógica, adequação da linguagem e rigor metodológico continuam sendo responsabilidades do professor") |
| Alternativa correta | A: "co-piloto de redação e estruturação… validação metodológica, empatia… responsabilidade final" |
| Distratores | B ("substitui integralmente… dispensando"), C ("restringe-se… incapaz"), D ("eliminando a interferência"): **os três usam formulações absolutas**; C é o "erro próximo" |
| Feedback próximo | C: subestima a capacidade da ferramenta |
| Bloom nominal → efetivo | Compreender → **Compreender** (o único em que o nível se mantém) |
| Divergências | D-05, D-07, D-10, D-01 |

---

## 4. Cobertura invertida: o que o vídeo ensina e quantas questões o cobrem

| Bloco | Conteúdo ensinado | Questões |
|---|---|---|
| B1 | Quatro elementos do alinhamento pedagógico; IA como acelerador | Q1 (parcial), Q4 (parcial) |
| B2 | Quatro pilares do comando | Q2 |
| B3 | Aplicação do comando; dependência entre atividade e avaliação | Q2 (eco literal) |
| B4A | Auditoria 1: alinhamento entre objetivo e avaliação | Q1 |
| B4B | Auditoria 2: viabilidade técnica e de acesso | Q3 |
| B5 | Síntese das quatro lentes; papel do educador | Q4 |

**Lacunas de cobertura:** o elemento **Público** (que B1 ensina como
vértice do alinhamento) só aparece como pano de fundo de Q3; a relação
**atividade ↔ objetivo** não é avaliada; **conteúdos** não são ensinados
nem avaliados (D-09).

---

## 5. Divergências: classificação e proposta

**Classes:** *bloqueante* (corrigir antes de gravar ou de lançar o banco
v2), *ajustar* (corrigir na Task 47), *aceitável* (registrar e seguir).

| ID | Divergência | Evidência | Classe | Proposta | Task |
|---|---|---|---|---|---|
| **D-01** | O banco e o `module.ts` divergem **apenas** no feedback "distante" (as 4 questões); alternativas, enunciados, acerto e próximo são idênticos. O banco ainda diz "Bloco 4" nas Questões 1 e 3 (linhas 20 e 66), que a v2 dividiu em 4A e 4B | Script: `distanteIgual: false` em q1 a q4; `banco-questoes.md` linhas 20, 38, 61, 66, 84, 107 | Ajustar | `content/module.ts` vira a **fonte única**; o banco é gerado a partir dele ou arquivado. O feedback "distante" deve **apontar o trecho** a rever (capítulo e minutagem), o que só funciona depois que o aluno puder rever o vídeo (UX-01) | 47, 53, 54 |
| **D-02** | "Alinhamento construtivo" e "coerência didática" (usados na alternativa correta da Q1 e na "Dimensão avaliada") aparecem **uma única vez cada**, em B5 26:30. B1, B4A e B4B usam "alinhamento pedagógico" (3 vezes) | Script: `alinhamento construtivo 1x B5`, `coerência didática 1x B5` | Ajustar | Escolher **um termo** (recomendo "alinhamento pedagógico", já usado na home, no PRD e em 3 pontos do vídeo) e, se "coerência didática" ficar, introduzi-la em B4A 19:30 | 47 |
| **D-03** | A alternativa correta da Q2 é o comando exibido em B3 10:00, palavra por palavra. "Avaliação formativa" só existe dentro desse comando | Leitura de B3 10:00 × Q2; script: `avaliação formativa 1x B3` | Ajustar | Decisão D2: manter a questão como núcleo e criar variantes com outro tema, em que o aluno **monta** o comando | 47 |
| **D-04** | Q1 e Q3 usam os cenários do vídeo (prova sobre a história da computação; debate de duas horas) e a correta da Q3 repete o ajuste de B4B 25:00 ("exercício assíncrono e leve, compatível com acesso via smartphone") | Leitura de B4A 17:00 e B4B 22:30/25:00 × Q1 e Q3 | Ajustar | Decisão D2: variantes com cenário novo | 47, 31 |
| **D-05** | "Co-piloto" não aparece; "responsabilidade" aparece só no plural ("responsabilidades do professor", B5 28:30) | Script: `co-piloto 0x`, `responsabilidade 1x` | Aceitável | Trocar "co-piloto" por "assistente de redação e organização", como no vídeo | 47 |
| **D-06** | Cada competência é medida por uma única questão: o relatório mostra barra 0% ou 100% | `FinalReport.tsx:69`, `module.ts` (4 tópicos distintos) | Ajustar | 2–3 itens por competência (D2) | 47, 54 |
| **D-07** | **A alternativa correta é a mais longa na Q1 (148 × ≤115), Q2 (238 × ≤115) e Q3 (154 × ≤142); na Q4 empata (179 × 178).** Nas Q3 e Q4, os distratores são extremos ("cancelar o curso", "substitui integralmente", "incapaz", "eliminando") e só o "erro próximo" é plausível | Script: tamanhos `110/148/115/105`, `85/238/111/115`, `134/120/154/142`, `179/172/178/163` | Ajustar | Igualar tamanho e estrutura das alternativas; criar distratores a partir de **equívocos reais**; variar a posição da correta (hoje B, B, C, A) | 47 |
| **D-08** | **Numeração contraditória das lentes.** B4A 17:00 chama o alinhamento de "primeira lente". B4B 24:00 chama viabilidade técnica de "**segunda** lente". Mas B5 26:30 enumera quatro lentes em que a **segunda** é "formulação de instruções estruturadas", e a viabilidade vira parte da terceira (curadoria). O Artefato 8 repete a lista do B5 | Script: `primeira lente 1x B4A`, `segunda lente 1x B4B`; leitura de B5 26:30 | **Bloqueante para a gravação** | Antes de gravar, uniformizar: lente 1 alinhamento (B4A), lente 2 instruções (B2, nomeá-la ali), lente 3 curadoria, incluindo viabilidade (B4B diz "terceira lente"), lente 4 papel (B5). Corrigir o texto de B4B 24:00 e de B2 08:45 | 47 (roteiro) |
| **D-09** | A home e o portal prometem cinco elementos: "público, objetivos, **conteúdos**, atividades e avaliação" (`courseObjectives[0]`, `learningOutcomes[0]`, Ficha técnica do roteiro). A fala de B1 01:30 ensina **quatro** elementos e a palavra "conteúdos" não aparece na narração | `landing.ts:26,61`; roteiro linha 17 (único uso); B1 01:30 | Ajustar | Decisão pedagógica: incluir "conteúdos" no vídeo e numa questão, **ou** ajustar o texto da home para quatro elementos | 47 |
| **D-10** | Quatro vocabulários para as mesmas quatro competências: "Dimensão avaliada" do banco; `topic` do `module.ts` (Alinhamento pedagógico, Comandos para a IA, Curadoria da IA, Papel do educador); lentes do B5; "resultados" da home (Planejar, Pedir bem, Analisar, Melhorar) | `banco-questoes.md`; `module.ts`; B5 26:30; `landing.ts:57-78` | Ajustar | Um **glossário único** em `content/`, usado pelo relatório, pela home e pelo vídeo | 47, 63 |

---

## 6. Proposta de fonte única (D-01)

1. **`content/module.ts` é a fonte da verdade** e cada questão ganha um
   campo de rastreabilidade, por exemplo:
   `source: { block: "B4A", at: "17:00", lens: 1 }`.
2. `banco-questoes.md` deixa de ser editado à mão: é **arquivado** (com
   aviso no topo) ou **gerado** por script a partir do `module.ts`.
3. O feedback "distante" passa a citar `source` e, quando o aluno puder
   rever o vídeo (Tasks 53 e 54), vira um link ao capítulo.
4. O script `testes/rastreabilidade/trace.js` roda a cada alteração do
   banco ou do roteiro, e no gate pós-gravação.

---

## 7. Nível cognitivo (Bloom)

| Questão | Nível pretendido | Nível efetivo | Motivo |
|---|---|---|---|
| Q1 | Analisar | Lembrar | O cenário e a frase do objetivo repetem o vídeo |
| Q2 | Aplicar | Lembrar | A correta é o texto de B3 10:00 |
| Q3 | Avaliar | Lembrar | Cenário e solução repetem B4B |
| Q4 | Compreender | Compreender | Termos próximos, sem cópia literal |

---

## 8. Limites desta análise

- O roteiro v2 **não é** o vídeo: se a gravação divergir, a matriz precisa
  ser refeita (decisão D5).
- A avaliação de plausibilidade dos distratores é julgamento meu, não
  dado de alunos. Só o uso real (Task 38 e Task 55) mostra quais
  alternativas os alunos de fato escolhem.
- Nenhum arquivo de conteúdo foi alterado nesta task.
