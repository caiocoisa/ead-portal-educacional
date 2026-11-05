# Auditoria instrucional: Gagné, Merrill, Bloom e Kirkpatrick

> Task 42 · gerada em 2026-11-04
> Aplica referenciais que o `plano-adequacao-design-instrucional.md`
> **não** cobriu. **As classificações são julgamento meu**, feito sobre o
> código, os documentos e o roteiro v2; **o vídeo ainda não existe.**

## 1. Fontes dos referenciais

| Referencial | Fonte consultada | Observação |
|---|---|---|
| Gagné, 9 eventos de instrução | [Universidade da Flórida (CITT)](https://citt.ufl.edu/resources/the-learning-process/designing-the-learning-experience/gagnes-9-events-of-instruction) | Li os três primeiros eventos na página; os demais vêm de resumos de busca da mesma família de fontes |
| Merrill, Primeiros Princípios | Resumos de busca; artigo de 2002 (ETR&D 50(3), 43–59) e de 2007 **não lidos no texto** | Cinco princípios: centrado em tarefa, ativação, demonstração, aplicação, integração |
| Bloom revisado (Anderson e Krathwohl, 2001) | [Guia da Vanderbilt](https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/) (via resumo de busca) | Seis processos: lembrar, compreender, aplicar, analisar, avaliar, criar |
| Kirkpatrick | [Kirkpatrick Partners (página oficial)](https://www.kirkpatrickpartners.com/the-kirkpatrick-model/) | Li a página; **recomenda começar pelo Nível 4** |

**Não repete os 7 critérios D2L** (consistência, multimídia, conexão,
conteúdo digerível, acessibilidade, sentidos, iteração): o que segue é o
que eles não alcançam, ou seja, **a sequência pedagógica e o nível
cognitivo**.

---

## 2. Gagné: os nove eventos

| # | Evento | Situação | Evidência | Classificação |
|---|---|---|---|---|
| 1 | Chamar a atenção | Hero e chamada na home; o vídeo abre com boas-vindas e o "desafio do EaD", **não com um caso ou problema** | `WelcomeHero.tsx`; roteiro B1 00:00 | **Parcial** |
| 2 | Informar os objetivos | A home lista 4 objetivos; o vídeo declara o propósito em B1 03:15 | `landing.ts:25-30` | **Atende** |
| 3 | Estimular a recordação do que já sabe | **Nada**: não há pergunta prévia nem diagnóstico; só o aviso de que não é preciso experiência com IA | `landing.ts:50-55` | **Não atende** |
| 4 | Apresentar o conteúdo | Vídeo (a gravar) | roteiro v2 | **Atende no roteiro**; depende da gravação |
| 5 | Orientar a aprendizagem | Demonstrações em B3, B4A e B4B | roteiro v2 | **Parcial** (só vídeo, sem material de apoio) |
| 6 | Provocar o desempenho | Quiz de reconhecimento; **sem produção do aluno** (a Task 32 prevê um exercício opcional) | `module.ts` | **Parcial** |
| 7 | Dar retorno | Retorno imediato em três níveis, mas **não diz onde rever** | `resolveFeedback`, UX-06 | **Parcial** |
| 8 | Avaliar o desempenho | Relatório por competência, de **baixa confiabilidade** (uma pergunta por competência) | D-06 | **Parcial** |
| 9 | Reter e transferir | **Nada**: sem checklist, plano de ação ou tarefa de transferência para o trabalho real | | **Não atende** |

**Resumo:** 1 atende, 6 parciais, 2 não atendem (eventos **3 e 9**, o
começo e o fim da sequência).

---

## 3. Merrill: Primeiros Princípios

| Princípio | Situação | Classificação |
|---|---|---|
| **Centrado em tarefa** | O fio do módulo é uma tarefa real ("planejar uma aula com a IA e auditar o resultado"), mas o curso **abre pela teoria** (alinhamento, pilares) e só depois mostra a tarefa | **Parcial** |
| **Ativação** | Nenhuma ativação de experiência prévia | **Não atende** |
| **Demonstração** | Dois casos demonstrados no vídeo (B4A e B4B), com a lente de auditoria explícita | **Atende** (no roteiro) |
| **Aplicação** | O quiz **reconhece**, não **aplica** (o aluno não escreve nem corrige um comando) | **Parcial** |
| **Integração** | Nada leva o aluno a **usar o aprendido no próprio planejamento** nem a refletir ou compartilhar | **Não atende** |

**Resumo:** 1 atende, 2 parciais, 2 não atendem (**ativação e integração**,
de novo as pontas do ciclo).

---

## 4. Bloom revisado: nível pretendido × nível efetivo

### 4.1 Objetivos declarados

| Objetivo (`courseObjectives`) | Verbo | Nível |
|---|---|---|
| O1: Compreender como articular público, objetivos, conteúdos, atividades e avaliação | Compreender | Compreender |
| O2: Reconhecer a importância do alinhamento pedagógico | Reconhecer | Lembrar e compreender |
| O3: Aprender a estruturar comandos eficientes | Estruturar | **Aplicar e criar** |
| O4: Desenvolver olhar crítico para analisar e melhorar as sugestões da IA | Analisar, melhorar | **Analisar, avaliar e criar** |

### 4.2 O que a avaliação mede (Task 39)

| Questão | Nível efetivo |
|---|---|
| Q1 | Lembrar |
| Q2 | Lembrar |
| Q3 | Lembrar |
| Q4 | Compreender |

### 4.3 Desalinhamento

**O curso promete aplicar, criar, analisar e avaliar; a avaliação mede
lembrar e compreender.** Os objetivos O3 e O4 (os mais importantes)
**não têm nenhum item que os meça**. É o mesmo princípio do alinhamento
construtivo que o próprio vídeo ensina; o portal não o cumpre na própria
avaliação. Nenhum item de **criar** (produzir um comando) existe.

---

## 5. Kirkpatrick: os quatro níveis

| Nível | O que mede | Situação hoje | Classificação |
|---|---|---|---|
| **1. Reação** | Satisfação e relevância | **Nada** (a Task 38 prevê um link de feedback) | **Não atende** (planejado) |
| **2. Aprendizagem** | O que o aluno aprendeu | Quiz, de **baixa confiabilidade** e nível baixo | **Parcial** |
| **3. Comportamento** | O aluno **usa** o que aprendeu? | **Nada**; o portal não tem como saber | **Não atende** |
| **4. Resultados** | O efeito esperado do programa | **Não definido** em nenhum documento | **Não atende** |

**Ponto-chave:** a página oficial do Kirkpatrick recomenda **começar pelo
Nível 4** (entender o "porquê" e o efeito desejado) e só então desenhar os
níveis anteriores. O PRD define o objetivo de **negócio** ("validar a
jornada mínima em produção"), **não o resultado educacional** esperado
(por exemplo, educadores que produzem melhores planos de aula com IA).
Sem isso, as Tasks 38 (feedback) e 55 (usabilidade) não sabem o que medir.

---

## 6. Lacunas consolidadas e propostas

| ID | Lacuna | Referenciais | Proposta | Task para decidir |
|---|---|---|---|---|
| **I-01** | Sem **ativação** do que o aluno já sabe | Gagné 3, Merrill | **Verificação prévia curta e sem nota** (1 ou 2 perguntas), à maneira do Skillshop, antes do vídeo | 46 (ADR), 47 |
| **I-02** | O vídeo **abre pela teoria**, não por um caso | Gagné 1, Merrill (tarefa) | Abrir o roteiro com o **problema real** (uma sugestão da IA que parece boa e falha) | 47 (roteiro) |
| **I-03** | **Objetivos O3 e O4 sem item que os meça** | Bloom | Itens de **aplicar, avaliar e criar** nas variantes do banco v2; o exercício de produção da Task 32 | 47, 32 |
| **I-04** | Sem **tarefa de aplicação** (produzir) | Gagné 6, Merrill | Tornar a Task 32 (exercício prático opcional) parte do desenho, com modelo e critérios | 32, 46 |
| **I-05** | Sem **transferência** e **integração** | Gagné 9, Merrill | Fecho com **"seu próximo passo"** e **checklist** (no ebook e no relatório) | 48 (ebook), 54 |
| **I-06** | **Nível 4 do Kirkpatrick indefinido** | Kirkpatrick | **Definir o resultado educacional esperado** antes de medir; ele orienta o formulário de feedback | 46 (ADR), 38 |
| **I-07** | **Nível 3 sem meio de observação** | Kirkpatrick | Pergunta de **intenção de uso** no formulário de feedback; acompanhamento posterior exigiria backend (fora do escopo) | 38 |
| **I-08** | Retorno sem **caminho de recuperação** | Gagné 7 | Já previsto: remediação dirigida (D1) | 54 |

> **Observação:** I-01, I-03, I-04 e I-05 **ampliam o escopo** das Tasks 46,
> 47 e 48. A Task 46 (ADR do modelo de jornada) é o lugar de decidir quais
> entram.

---

## 7. Limites

- As classificações (atende, parcial, não atende) são **julgamento meu**,
  não medição; vale revisão sua, principalmente nos itens "parcial".
- **O vídeo não existe**: Gagné 4, 5 e Merrill (demonstração) foram
  avaliados **no roteiro**.
- Os artigos originais de Merrill e de Gagné **não foram lidos**; usei
  fontes de ensino superior e resumos.
