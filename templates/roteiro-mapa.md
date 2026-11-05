# Template de roteiro: mapa interativo

> Esqueleto de `pesquisa/engenharia-reversa/mapa.md`. Copie este arquivo
> para `conteudo/mapa/` e preencha. **Cenário novo:** nunca reutilize o
> cenário de uma questão do banco.

## 1. Ficha

| Campo | Preenchimento |
|---|---|
| Pergunta-foco | _Uma pergunta que o mapa responde (ex.: "Por que uma boa sugestão da IA pode falhar?")_ |
| Objetivo de aprendizagem | |
| Público | |
| Competências cobertas | _(códigos do glossário)_ |
| Questões relacionadas (sem repetir cenário) | |
| Modo | Livre (padrão) · Percurso sugerido (opcional) |

## 2. Elementos (4 a 6, do mais geral ao mais específico)

Repita o bloco para cada elemento.

| Campo | Limite | Preenchimento |
|---|---|---|
| Título | até 3 palavras | |
| **Conceito** | 1 a 2 frases | |
| **Exemplo** (cenário novo) | 1 a 2 frases | |
| **Falha típica da IA** | 1 frase | |
| Competência para remediação | _código_ | |
| Texto alternativo da ilustração | descritivo | |

## 3. Relações entre elementos

| De | Frase de ligação (verbo ou preposição) | Para |
|---|---|---|
| | _ex.: "orienta", "é medido por"_ | |

## 4. Percurso sugerido (opcional)

Ordem de leitura recomendada: 1 → 2 → 3 → 4. O leitor pode ignorá-la.

## 5. Fecho

Chamada para a próxima etapa (ex.: "Teste seu olhar na avaliação").

## 6. Acessibilidade (obrigatório)

- [ ] Todo elemento é um botão real, operável por teclado.
- [ ] Existe **lista alternativa** com o mesmo conteúdo, para leitor de tela.
- [ ] A relação entre elementos também está descrita em texto.
- [ ] Nenhuma informação existe só na imagem.

## 7. Checklist de qualidade

- [ ] Começa por uma pergunta-foco.
- [ ] No máximo 6 elementos.
- [ ] Todo elemento tem conceito, exemplo e falha típica, no mesmo formato.
- [ ] As relações têm **frase de ligação**, não só linhas.
- [ ] Vocabulário igual ao do vídeo e do glossário.
- [ ] Não revela a resposta de nenhuma questão.

---

## Validação contra o roteiro v2 (Task 43)

Aplicação do esqueleto ao conteúdo do vídeo, para ver se ele cabe sem
forçar:

| Campo | Aplicação |
|---|---|
| Pergunta-foco | "Como garantir que o plano de aula sugerido pela IA realmente funcione?" |
| Elementos | **Público, Objetivos, Atividades, Avaliação**: são os quatro elementos que o Bloco 1 (01:30) ensina |
| Falha típica da IA | Avaliação que não mede o objetivo (Bloco 4A) e atividade inviável para o público (Bloco 4B) |
| Relações | Objetivos *orientam* Atividades; Avaliação *mede* Objetivos |
| **Não cabe** | **"Conteúdos"**: a home promete cinco elementos, mas o vídeo ensina quatro (achado D-09 da Task 39) |

**Resultado:** o esqueleto cabe no roteiro. O único ponto aberto é o
elemento "conteúdos", que depende da decisão sobre o roteiro.
