# Roteiro do mapa interativo: Mapa do alinhamento

> **Segundo artefato do primeiro ciclo (2026-11-05).** Escrito a partir de
> `templates/roteiro-mapa.md`, antes de a Task 48 ser liberada (como foi
> feito com o e-book). A peça publicada é a rota `/mapa`, um componente
> **nativo** do portal (`components/materials/ConceptMap.tsx`, conteúdo em
> `content/mapa.ts`), e não um `iframe`: assim herda tema, contraste e
> tamanho de fonte do portal e usa a altura inteira da janela. As revisões
> das Tasks 48 a 50 ainda se aplicam.

## 1. Ficha

| Campo | Preenchimento |
|---|---|
| Pergunta-foco | "Como garantir que o plano de aula sugerido pela IA realmente funcione?" |
| Objetivo de aprendizagem | Reconhecer os quatro elementos de um planejamento, como eles se orientam entre si e a falha típica que a IA comete em cada um |
| Público | Educadores, licenciandos e designers instrucionais, sem experiência com IA |
| Competências cobertas | **Alinhamento pedagógico** (lente 1), com apoio da **Curadoria da IA** (lente 3), pelos nomes do `topic` do banco (não há códigos formais; ver D-10 da matriz) |
| Questões relacionadas (sem repetir cenário) | Questão 1 (principal). O mapa usa o cenário de **horta em casa**, que não aparece em nenhuma questão nem nos casos do e-book |
| Modo | Livre (padrão) e **percurso guiado** (opcional), nos moldes do "explorer tour" e do "guided tour" do StoryMaps (`pesquisa/engenharia-reversa/mapa.md`, M3) |

**Caso de exemplo (um só, nos quatro elementos):** curso a distância de
horta em casa, assíncrono, para adultos que moram em apartamento, não têm
experiência com plantas e estudam pelo celular à noite.

## 2. Elementos

Cada elemento tem o mesmo formato: conceito, exemplo, falha típica da IA,
mais uma **pergunta de auditoria** e um **comando de ajuste** (acréscimos
ao template, para o leitor sair do mapa sabendo o que perguntar e o que
pedir à IA).

| Elemento | Conceito | Exemplo | Falha típica da IA |
|---|---|---|---|
| **Público** | Quem vai estudar: o tempo, o aparelho, o que já sabe e o espaço em que vive. Todo o plano precisa caber nessa realidade | Adultos em apartamento, sem experiência, pelo celular à noite, com uma varanda pequena | Assume um público genérico ("os alunos") e sugere canteiro no quintal ou ferramentas que essas pessoas não têm |
| **Objetivos** | O que a pessoa será capaz de fazer ao final, com um verbo observável. Orienta o que treinar e o que medir | Monta uma horta de ervas em vasos na varanda e a mantém por quatro semanas | Escreve objetivos vagos ("compreender a importância das plantas") ou longos demais |
| **Atividades** | O que a pessoa faz para aprender; precisa treinar o mesmo verbo do objetivo | Montar um vaso passo a passo e fotografar cada etapa com o celular | Propõe assistir a aulas e ler textos: informa, mas a pessoa nunca pratica montar |
| **Avaliação** | Confere se o objetivo foi alcançado; mede o mesmo verbo do objetivo | Enviar a foto da horta e conferir uma lista de cinco itens | Sugere prova de múltipla escolha sobre o nome das ervas: mede memória, não montagem |

Perguntas de auditoria e comandos de ajuste estão em `content/mapa.ts`.

## 3. Relações entre elementos

| De | Frase de ligação | Para |
|---|---|---|
| Público | define o que é realista aprender | Objetivos |
| Objetivos | define o que treinar | Atividades |
| Objetivos | define o que medir | Avaliação |
| Atividades | treinar o que será medido | Avaliação |

As relações aparecem **em texto** no painel de cada elemento ("Conexões");
as linhas do diagrama são só reforço visual.

## 4. Percurso guiado

Público → Objetivos → Atividades → Avaliação, com "Passo N de 4",
"Anterior", "Próximo" e "Concluir". O leitor pode ignorá-lo e explorar na
ordem que preferir.

## 5. Fecho

"Alinhar é fazer os quatro elementos contarem a mesma história. A IA
escreve cada um deles muito bem, mas não percebe quando um aponta para outro
lugar: essa auditoria é sua." Com link para o capítulo 1 do e-book.

## 6. Acessibilidade

- [x] Todo elemento é um **botão real** (`aria-pressed`), operável por teclado; as **setas** movem o foco entre eles, com volta ao começo.
- [x] Existe **lista alternativa** com o mesmo conteúdo ("Lista"); em telas pequenas ela é a única forma.
- [x] A relação entre elementos também está descrita em texto ("Conexões").
- [x] Nenhuma informação existe só na imagem: as ilustrações dos nós são decorativas (`alt` vazio), porque o botão já tem o texto do elemento.
- [x] Auditado com axe-core (WCAG 2.2 AA) em tema claro e escuro, contraste normal e alto, e três tamanhos de fonte; também com um elemento selecionado, com o percurso guiado e na lista.

## 7. Checklist de qualidade

- [x] Começa por uma pergunta-foco (cabeçalho da página).
- [x] Quatro elementos (no máximo 6).
- [x] Todo elemento tem conceito, exemplo e falha típica, no mesmo formato.
- [x] As relações têm frase de ligação, não só linhas.
- [x] Vocabulário igual ao do vídeo (quatro elementos: D-09 segue em aberto).
- [x] Não revela a resposta de nenhuma questão e não repete o cenário de nenhuma.
- [ ] Revisão pedagógica por educadores do perfil-alvo (Task 50).
- [ ] Ilustrações dos quatro nós (prompts em `docs/prompts-ilustracao.md`, seção 5.4): enquanto não existirem, cada nó mostra um ícone.
- [ ] Redesenho via Claude Design (R2, Tasks 59 e 49) e hub `/materiais` (Task 52).

## Matriz de cobertura

| Elemento | Competência | Questão do banco | Como se relaciona |
|---|---|---|---|
| Objetivos, Atividades e Avaliação | Alinhamento pedagógico | 1 | Ensina o conceito com **outro cenário**; não cita a questão |
| Público | Alinhamento pedagógico | 1 | Mostra que o plano parte de quem estuda |
| Falha típica de cada elemento | Curadoria da IA | 3 | Mostra o que auditar na sugestão da IA, sem repetir o cenário da questão |
