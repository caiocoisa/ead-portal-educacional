# Benchmark de concorrentes de EaD

> Task 41 · fontes acessadas em 2026-11-04 · **estrutura e prática
> observável, nada de conteúdo de terceiros copiado**

## 1. Critérios e limites

**Critérios de seleção** (declarados antes da coleta):
1. oferta de **cursos curtos e gratuitos ou de baixo custo**, parecidos com
   o nosso módulo;
2. **público brasileiro** ou plataforma de referência mundial;
3. **regras publicadas** pela própria plataforma (central de ajuda,
   página do curso);
4. diversidade: iniciativa pública, fundação, plataforma de assinatura e
   plataforma internacional.

**Selecionadas:** Fundação Bradesco (EV), Escola Virtual.Gov (ENAP),
Sebrae, Alura, Coursera, Khan Academy, Google Skillshop, Udemy e
Microsoft Learn (esta já detalhada em `pesquisa/referencias-visuais.md`).
**Não cobertas:** Descomplica (não coletada).

**Como ler a coluna de evidência:**

| Marca | Significado | Confiança |
|---|---|---|
| **O** | Li a página oficial da plataforma | alta |
| **R** | Resumo de busca sobre página oficial; **não extraí o texto** | média |
| **N** | Notícia ou blog sobre a plataforma | **baixa** |

**Limites:** não vi nenhuma tela renderizada; **regra de aprovação muda
por curso** (as plataformas dizem isso); a matriz **não está completa**
(ver seção 5), e por isso a Task 41 segue em andamento.

---

## 2. Matriz por dimensão

### 2.1 Aprovação e certificado

| Plataforma | Regra observada | Evid. |
|---|---|---|
| **Fundação Bradesco (EV)** | "Para emissão do certificado é necessária a **conclusão de todos os módulos** e **nota igual ou superior a 70%** na avaliação final". A conta mantém "certificados **de conclusão e de participação**" | **O** ([ev.org.br](https://www.ev.org.br/)) |
| Coursera | A maioria das atividades exige **80%**; é preciso passar em **todas** as atividades avaliadas para o certificado; a página do curso mostra o exigido | R ([central de ajuda](https://learner.coursera.help/hc/en-us/articles/209818703-Take-quizzes)) |
| Google Skillshop | Trilhas de certificação têm módulos e **uma ou mais avaliações**; é preciso passar em todas; a maioria pede **75 a 80%**; um "prêmio" é dado ao passar na avaliação final, e a certificação vale **um ano** | **O** (conceito de módulos e avaliações) e R (percentuais e validade) ([ajuda](https://support.google.com/skillshop/answer/14594415?hl=en)) |
| Alura | Certificado para quem participar de **pelo menos 60% das atividades** do curso; cada certificado tem endereço único de autenticidade; cursos "livres", sem reconhecimento do MEC | R (termos de uso) |
| Udemy | Só cursos pagos e aprovados emitem; é preciso **marcar todas as aulas** como concluídas; tarefas são opcionais | R |
| Escola Virtual.Gov | Páginas de cada curso listam nota mínima, carga horária e datas. Uma matéria cita **60%** | **N**; a regra **não foi confirmada** na página oficial lida |
| Sebrae | Matérias citam conclusão de módulos, atividades e nota mínima (uma cita 70%) | **N**; **não confirmada** em página oficial |
| **Nosso portal** | **Sem nota mínima nem certificado** (exportação e certificação estão fora de escopo, PRD 9, item 5) | |

### 2.2 Tentativas e remediação

| Plataforma | Observado | Evid. |
|---|---|---|
| Coursera | **Tentativas ilimitadas** na maioria das atividades; vale a maior nota ou a mais recente; cursos privados podem limitar | R |
| Google Skillshop | **Tentativas ilimitadas** nas avaliações (resumo); **algumas trilhas deixam pular módulos** se a pessoa for bem na **verificação prévia** | **O** (pular módulos pela verificação prévia) |
| Khan Academy | Quatro níveis de domínio por habilidade (**Attempted, Familiar, Proficient, Mastered**); o nível máximo exige acertar tudo num teste de unidade ou desafio do curso | R |
| **Nosso portal** | **Sem segunda tentativa**; refazer exige reiniciar a jornada e passar pelo vídeo de novo (atrito UX-05) | |

### 2.3 Estrutura do módulo

| Plataforma | Observado | Evid. |
|---|---|---|
| Microsoft Learn | Módulo com **unidades curtas**, duração por unidade, **verificação de conhecimento** e **resumo** ao fim | **O** (ver `pesquisa/referencias-visuais.md`) |
| Fundação Bradesco | "Os módulos deste curso são **flexíveis** e você pode estudar de acordo com seu interesse" | **O** |
| Alura | Curso em **aulas, vídeos e atividades**, com menu lateral que mostra o progresso | R |
| **Nosso portal** | **Um vídeo de ~30 minutos** + 4 perguntas + relatório; sem módulos internos (capítulos só no roteiro, Task 29) | |

### 2.4 Comunidade e apoio

| Plataforma | Observado | Evid. |
|---|---|---|
| Alura | Página afirma **"mais de 700 mil trocas em fórum ativo"** (alegação da plataforma); assistente de IA dentro do curso | **O** (alegação) e R |
| Sebrae | O Guia do Aluno (documento oficial, **lido só por resumo de busca**) indica atendimento por telefone e pelo menu "Precisa de ajuda?" | R |
| **Nosso portal** | **Nenhum canal** (Task 33 prevê contato por e-mail) | |

### 2.5 Progresso e retomada

| Plataforma | Observado | Evid. |
|---|---|---|
| Alura | O progresso **só é registrado após a matrícula** | R |
| Udemy | Percentual de conclusão **recalculado** se o instrutor altera o curso, podendo cair | R |
| Fundação Bradesco | O acesso reativado **mantém o histórico** de cursos, certificados de conclusão e de participação | **O** |
| **Nosso portal** | Progresso salvo no navegador; **respostas da avaliação não são salvas** (UX-04) | |

### 2.6 Vídeo e acessibilidade

| Plataforma | Observado | Evid. |
|---|---|---|
| Alura | Player com **transcrição** completa, **velocidade** ajustável e **picture-in-picture** | R |
| Able Player (referência, não concorrente) | Legendas, capítulos, audiodescrição, transcrição e teclado | **O** (ver `pesquisa/referencias-visuais.md`) |
| **Nosso portal** | Player **só com Play e Pause** (UX-11); sem transcrição (Task 36) nem legendas (Task 35) | |

### 2.7 Prazo

| Plataforma | Observado | Evid. |
|---|---|---|
| Fundação Bradesco | Prazo de até **60 dias** após a matrícula | N |
| Escola Virtual.Gov | Alguns cursos têm limite, uma matéria cita **100 dias**; outras, sem prazo fixo | N |
| **Nosso portal** | Sem prazo; ritmo livre (FAQ) | |

---

## 3. Padrões úteis para o portal

| # | Padrão | Onde aparece | Aplicação |
|---|---|---|---|
| P1 | **Regra de aprovação explícita** e visível (módulos concluídos + nota mínima) | EV, Coursera, Skillshop | Decidir se o portal terá "aprovado" e certificado (hoje fora de escopo) |
| P2 | **Tentativas ilimitadas** com a melhor nota valendo | Coursera, Skillshop | Resolve UX-05; combina com "refazer as erradas" (Task 54) |
| P3 | **Verificação prévia** que permite pular conteúdo | Skillshop | Responde à lacuna de ativação de conhecimento (ver auditoria instrucional) |
| P4 | **Dois tipos de certificado**, de **conclusão** e de **participação** | EV | Alternativa leve ao certificado formal |
| P5 | **Módulos flexíveis**, por interesse | EV, Microsoft Learn | Conversa com o hub opcional (D1) |
| P6 | **Níveis de domínio** por habilidade, não aprovado ou reprovado | Khan Academy | Alternativa à barra 0% ou 100% do relatório |
| P7 | **Transcrição, velocidade e legendas** no player | Alura, Able Player | Tasks 35, 36 e 53 |
| P8 | Fórum ou canal de dúvidas | Alura | Task 33 (canal mínimo) |

## 4. O que **não** copiar

- **Certificado com valor de mercado** e **carga horária oficial**: dependem
  de reconhecimento institucional; fora do escopo do MVP.
- **Fórum ativo**: exige moderação e conta de usuário; incompatível com
  "sem cadastro" (PRD seção 6).
- **Assistente de IA no curso** (Alura): outro produto.

## 5. Lacunas (por isso a Task 41 segue em andamento)

1. **Matriz incompleta:** a maior parte das células está em **R** ou **N**.
   Falta ler diretamente as páginas oficiais de Escola Virtual.Gov, Sebrae,
   Coursera, Khan Academy e Udemy; elas **bloquearam ou renderizam por
   JavaScript** nesta máquina.
2. **Sem Descomplica** e sem a observação de uma **página de curso real**
   (estrutura do programa, avaliações, requisitos).
3. **Aparência e usabilidade não foram vistas.**
4. Precisaria de um **navegador conectado** ou de **capturas de tela** das
   páginas de curso de 3 ou 4 dessas plataformas.
