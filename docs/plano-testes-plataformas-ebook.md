# Plano de Testes — Plataformas de Ebook (FlipHTML5 × Genially)

> Gerado em: 2026-11-04 · Task 58 (`task-master.md`)
> Origem: requisito **R1** de `plano-evolucao-v2.md` — o ebook deve ser
> **obrigatoriamente publicado** em uma plataforma interativa como
> FlipHTML5 ou Genially.

## 1. Para que servem estes testes

A publicação é obrigatória; o que falta saber é **qual das duas
plataformas** serve melhor ao portal e **como incorporá-la** sem
comprometer os compromissos do projeto: acessibilidade (WCAG 2.1 AA,
PRD seção 4), privacidade (LGPD; o vídeo já usa
`youtube-nocookie.com`) e uma aparência profissional.

Nada neste documento afirma como as plataformas se comportam. Cada
linha abaixo é uma **verificação a fazer**, com evidência registrada.

## 2. Quem executa

| Marca | Quem |
|---|---|
| **[U]** | Você: criar contas, publicar o ebook de teste, ler termos e planos |
| **[C]** | Claude: inspecionar o resultado incorporado, rodar axe-core e scripts do projeto |

Usar um **ebook de teste fictício** (capa, sumário, 3 capítulos com
texto, imagem, link interno e um elemento interativo), não o conteúdo
final. Guardar evidências em `testes/plataformas-ebook/<id>/`.

## 3. Casos de teste

| ID | Verifica | Quem | Procedimento | Passa quando |
|---|---|---|---|---|
| **PL-01** | Plano e custo | [U] | Registrar o que o plano gratuito impõe (marca d'água, anúncios, limite de publicações, visibilidade, prazo) e o preço do plano que remove as restrições | Sem marca ou anúncio que prejudique o aspecto profissional, ou plano pago aprovado por você (ponto C) |
| **PL-02** | Incorporação no portal | [C] | Incorporar o ebook publicado em uma página de teste via `iframe`; ajustar `next.config.ts` (cabeçalhos e política de conteúdo) se necessário | Carrega no portal, é responsivo, tem `title` no iframe e não quebra o layout |
| **PL-03** | Acessibilidade | [C] | axe-core na página com o embed e na página da plataforma; navegação só por teclado; leitura com NVDA; texto real × texto em imagem | Operável por teclado e compreensível por leitor de tela. Se falhar, a **versão acessível ao lado (HTML ou PDF)** passa a ser o caminho principal de leitura para quem precisar |
| **PL-04** | Interatividade | [U] | Listar o que cada plataforma suporta: sumário clicável, links internos, pop-ups, áreas clicáveis, quiz, vídeo incorporado, áudio, animação | Cobre os elementos interativos previstos no roteiro do ebook (Task 48) |
| **PL-05** | Fidelidade ao design | [U] + [C] | Importar a arte exportada do Claude Design (ou o PDF) e conferir tipografia, cores, acentuação em português e layout | Sem substituição de fonte nem perda de cor ou de acentuação |
| **PL-06** | Desempenho e mobile | [C] | Medir peso e tempo de carregamento em conexão móvel simulada; testar em tela pequena e em rotação | Carrega em tempo razoável e é legível em celular (o público estuda predominantemente no celular, como no cenário da Questão 3) |
| **PL-07** | Privacidade (LGPD) | [C] | Inspecionar as requisições da página incorporada: domínios de terceiros, cookies, rastreadores, aviso de consentimento | Sem rastreamento sem consentimento, ou mitigação aceita e registrada |
| **PL-08** | Portabilidade e termos | [U] | Ler os termos; verificar exportação (PDF, HTML ou arquivo), propriedade do conteúdo e o que acontece se a conta ou o plano expirar | Conteúdo exportável e uso permitido em portal educacional; risco de perda registrado |
| **PL-09** | Convivência com os temas do portal | [C] | Ver o embed com `data-theme="dark"`, `data-contrast="high"` e os três tamanhos de fonte | A moldura do portal mantém legibilidade e contraste mesmo que o embed não se adapte |
| **PL-10** | Atualização | [U] | Alterar uma página do ebook publicado e verificar se o link e o código de incorporação continuam válidos | Atualização sem trocar o embed no portal |
| **PL-11** | Download pelo leitor | [U] | Verificar se a plataforma oferece **ao leitor** a opção de baixar ou exportar o livro (PDF, imagens ou arquivo), se ela pode ser **desativada** e em quais planos (decisão da Task 65: o portal não quer essa ação, pois ler em PDF empobrece a experiência) | O leitor não tem a opção de baixar, ou ela é desativável em um plano aceito. **Não confundir** com a exportação para o autor (PL-08) |

## 4. Como o resultado decide

| Desfecho | Ação |
|---|---|
| Uma plataforma passa nos critérios obrigatórios (PL-02, 03, 07) e tem melhor custo e interatividade | Escolhê-la (ponto de aprovação C) |
| As duas passam | Desempatar por PL-04, PL-05, PL-01, PL-10 e PL-11 |
| Nenhuma passa em acessibilidade ou privacidade | Publicar mesmo assim, como **experiência interativa complementar**, e manter a versão acessível no portal como principal. Registrar a decisão e os riscos |
| Nenhuma passa em incorporação (PL-02) | Publicar na plataforma e **linkar** para ela a partir do portal, em vez de incorporar |

> **Princípio do plano, independente do resultado:** o ebook tem duas
> faces. A **versão interativa** na plataforma escolhida cumpre o
> requisito R1; a **versão acessível** no portal preserva o compromisso de
> acessibilidade com todos os alunos. Pela decisão da Task 65, essa versão
> acessível é o **HTML do leitor**, sem PDF para download.

## 5. Registro de resultados

| ID | Data | FlipHTML5 | Genially | Evidência |
|---|---|---|---|---|
| PL-01 | | | | |
| PL-02 | | | | |
| PL-03 | | | | |
| PL-04 | | | | |
| PL-05 | | | | |
| PL-06 | | | | |
| PL-07 | | | | |
| PL-08 | | | | |
| PL-09 | | | | |
| PL-10 | | | | |
| PL-11 | | | | |

**Plataforma escolhida e justificativa:** _a preencher ao fim da Task 58._
