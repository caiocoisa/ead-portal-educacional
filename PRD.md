# PRD — Portal de Planejamento Pedagógico para EaD com Apoio de IA (MVP)

**Status:** Em produção, com refinamentos pós-deploy contínuos
**Autor:** Engenharia de Requisitos (Claude Code)
**Data:** 2026-09-27 (tema/objetivo pedagógico definidos em 2026-09-27;
revisado em 2026-10-18 para refletir as Tasks 24–27, mescladas
diretamente no GitHub via PRs #1–#4)

---

## 1. Visão do produto

MVP de um portal web para entrega de **um módulo de conteúdo educativo**
sobre **planejamento pedagógico para Educação a Distância (EaD) com apoio
de Inteligência Artificial**: o aluno assiste a um vídeo, responde a uma
avaliação sobre o conteúdo e recebe um relatório final com o resultado.

**Tema do módulo:** ensinar a planejar experiências de aprendizagem a
distância articulando **público, objetivos, conteúdos, atividades e
avaliação** — usando uma aula de **Computação** como exemplo prático, e
demonstrando como **solicitar, analisar e melhorar** sugestões de um
assistente de IA (ex. Gemini) ao longo desse planejamento.

O objetivo desta v1 é ter o **core da jornada funcionando e implantado na
Vercel** o quanto antes — qualquer outra funcionalidade (múltiplos
módulos, área administrativa, i18n) fica para uma fase futura (ver
seção 9).

**Objetivo de negócio:** validar a jornada mínima (vídeo → avaliação →
relatório) em produção, com o menor custo de implementação possível.

---

## 2. Persona e perfil de uso

| Persona | Perfil | Necessidade de linguagem/interface |
|---|---|---|
| **Aluno/usuário final** | Educador, licenciando ou estudante interessado em planejar aulas a distância com apoio de IA — não precisa ter experiência prévia com ferramentas de IA | Linguagem simples, direta, sem jargão técnico de IA; foco em orientação passo a passo e em exemplos concretos (aula de Computação) |

> Nesta v1 **não existe** persona de Administrador nem área administrativa.
> O conteúdo (vídeo + quiz) é cadastrado **diretamente no código-fonte**
> (arquivo de seed), sem tela de CRUD. Ver seção 9.

---

## 3. Escopo funcional

### 3.1 Área pública (boas-vindas)

- Página inicial pública, sem necessidade de login, apresentando o propósito
  do portal e uma chamada para ação (**"Iniciar minha jornada"**).
- Captura do **nome do usuário** na entrada (sem senha, sem validação de
  identidade real) — usado para personalizar mensagens (ex. "Parabéns,
  {nome}!") e para gerar um `userId` local.
- Se o usuário já tiver progresso salvo (retorno ao portal), pula a captura
  de nome e retoma diretamente da etapa em que parou.

> **Implementado (Task 16, 2026-09-27):** header com identidade do portal e
> entrada em etapa única (campo de nome visível já na primeira tela, sem
> clique intermediário).
>
> **Página inicial completa (Task 24, mesclada ao `main` via PR no
> GitHub):** abaixo do bloco de identificação, a página pública passou a
> ter seções de apresentação do curso completo, cada uma como âncora
> navegável a partir do link "Conheça os objetivos, o público e os
> pré-requisitos" do hero:
> - **Objetivos do curso** — lista de verificação do que o módulo se
>   propõe a desenvolver.
> - **A quem se destina** — cartões para professores/educadores,
>   licenciandos/estudantes de Pedagogia, designers instrucionais/tutores.
> - **Pré-requisitos** — lista de verificação (sem experiência prévia com
>   IA necessária).
> - **O que você será capaz de fazer ao final** — cartões de competências
>   (planejar, pedir bem à IA, analisar respostas, melhorar o material).
> - **Como funciona** — as três etapas da jornada (vídeo, avaliação,
>   relatório) em formato de cartão.
> - **Formato e recursos** — ritmo livre, acesso em qualquer dispositivo,
>   acessível, sem cadastro.
> - **Perguntas frequentes** — acordeão com 5 perguntas (ex. "Preciso saber
>   usar IA antes de começar?", "Posso pular etapas?").
> - Rodapé de CTA ("Pronto para começar?") levando de volta ao formulário
>   de entrada.
>
> Conteúdo centralizado em `content/landing.ts`; seções em
> `components/public/CourseSections.tsx` e
> `components/public/FaqAccordion.tsx`. Ilustrações (hero, objetivos,
> jornada) ainda não produzidas — a página reserva o espaço com
> `components/ui/ImagePlaceholder.tsx`, indicando caminho/tamanho sugerido
> (ex. `public/img/hero.svg · 560×280`) até as imagens definitivas
> existirem.

### 3.2 Jornada do módulo (área restrita)

Fluxo linear e obrigatório, com progresso persistido:

1. **Vídeo** — hospedado no **YouTube**, embedado via `<iframe>`, com
   controle de conclusão (marca como concluído ao atingir X% de reprodução,
   ex. 90%, ou ao clicar em "Concluir"). Detalhamento técnico na seção 3.2.1.
2. **Artefato avaliativo** — quiz de múltipla escolha sobre **prompts e
   saídas de um chat de LLM**, exibido após o vídeo. Detalhamento do formato
   das perguntas na seção 3.2.2.
3. **Relatório final** — tela de encerramento exibindo o resultado da
   avaliação (pontuação, acertos/erros) e o status de conclusão da jornada.
   Detalhamento na seção 3.2.3.

O usuário **não pode pular etapas** (ex. acessar o quiz sem ter concluído o
vídeo, ou acessar o relatório sem ter enviado o quiz) — cada etapa libera a
seguinte. O usuário pode **retomar** de onde parou ao reabrir o portal.

#### 3.2.1 Embed do YouTube — comandos suportados (viabilidade)

**Viável.** O YouTube expõe a **IFrame Player API**, que permite ao portal
controlar e monitorar o vídeo embedado via JavaScript (`postMessage` entre a
página e o iframe), sem depender apenas dos controles nativos do player.

| Comando/evento | Suportado? | Uso no portal |
|---|---|---|
| `playVideo()` / `pauseVideo()` / `stopVideo()` | Sim | Botões próprios de play/pause, se o portal usar UI customizada |
| `seekTo(segundos)` | Sim | Retomar exatamente de onde o usuário parou ao reabrir o portal |
| `getCurrentTime()` / `getDuration()` | Sim | Calcular **% assistido**, usado no critério de conclusão (ex. 90%) |
| Evento `onStateChange` (`ENDED`, `PLAYING`, `PAUSED`) | Sim | Marcar `videoCompleted = true` automaticamente ao chegar em `ENDED`, sem depender de clique manual |
| `mute()` / `setVolume()` | Sim | Necessário se autoplay for usado (navegadores exigem vídeo mudo para autoplay) |
| Ocultar controles nativos (`controls=0`) | Sim, parcialmente | Permite construir player customizado; não impede 100% que o usuário acesse controles do YouTube por outros meios |

**Limitações a considerar:**

- **Bloqueio de avanço ("pular trecho") não é garantido.** É reforço de UX,
  não segurança.
- **Domínio de privacidade:** usar `youtube-nocookie.com` no `src` do
  iframe — recomendado dado o contexto educacional.
- **Anúncios:** recomenda-se vídeo **não listado ("unlisted")** e sem
  monetização, para uma experiência de conclusão sem interrupções.
- **Dependência de rede externa:** o embed exige acesso a `youtube.com`
  (ou `youtube-nocookie.com`) pelo navegador do usuário. **Confirmado:** não
  há bloqueio de firewall/proxy corporativo para o público-alvo do portal.
- **Requisito técnico do embed:** iframe com parâmetro `enablejsapi=1` e
  carregamento do script `https://www.youtube.com/iframe_api`.

#### 3.2.2 Formato do artefato avaliativo (quiz)

Quiz de **múltipla escolha**, com perguntas sobre **planejamento
pedagógico para EaD e sobre como solicitar, analisar e melhorar sugestões
de um assistente de IA** (ex. Gemini) nesse planejamento — usando uma aula
de Computação como exemplo. Dois tipos de pergunta suportados:

| Tipo | Pergunta | Alternativas |
|---|---|---|
| **Tipo 1 — Texto** | Texto simples (ex. pergunta sobre um conceito de planejamento pedagógico) | Texto simples |
| **Tipo 2 — Simulação de chat** | Renderizada como uma **conversa simulada** (bolhas de mensagem, papel usuário/assistente), reproduzindo um prompt pedido a um assistente de IA e a sugestão recebida, para o aluno analisar | Texto simples |

Estrutura de dados de cada pergunta (definida diretamente no arquivo de seed
de conteúdo, seção 3.5, e usada no modelo de persistência, seção 3.6):

```
Question {
  id: string
  topic: string            // competência avaliada, exibida no relatório final (Task 26)
  type: "text" | "chat_simulation"
  prompt:
    // se type = "text": string (enunciado)
    // se type = "chat_simulation": ChatMessage[] (turnos usuário/assistente
    //   a serem exibidos como conversa antes das alternativas)
  options: string[]       // alternativas, sempre em texto
  correctOptionIndex: number
}

ChatMessage {
  role: "user" | "assistant"
  content: string
}
```

Regras do quiz:

- Todas as perguntas são de **múltipla escolha com resposta única** (uma
  alternativa correta por pergunta).
- **Confirmação individual por pergunta** (Task 20): o aluno escolhe uma
  alternativa e clica em "Confirmar resposta" antes de ver o retorno
  pedagógico — não é um formulário único enviado ao final. Ao confirmar,
  a alternativa escolhida fica bloqueada, a alternativa correta é
  destacada visualmente (Task 25/26) e um painel de **retorno pedagógico
  imediato** é exibido, categorizado por proximidade da resposta
  escolhida: acerto, erro próximo (uma alternativa específica, plausível
  mas incorreta) ou erro distante (demais alternativas) — conteúdo
  definido em `banco-questoes.md`. Um toast reforça o resultado
  (sucesso/atenção/erro) no momento da confirmação.
- **Navegação livre entre perguntas (Task 25):** um menu de navegação
  lateral (`QuestionNavigator`, vira uma faixa horizontal em telas
  pequenas) lista todas as perguntas com seu status (pendente/correta/
  revisar) e permite saltar livremente entre elas, inclusive revisitar uma
  pergunta já respondida — a pergunta em si continua exigindo confirmação
  individual (bullet anterior), mas a ordem de resposta não é mais travada
  em sequência estrita. O botão "Ver relatório final" só habilita quando
  todas as perguntas tiverem sido confirmadas.
- O resultado (`assessmentResult`, seção 3.6) registra, por pergunta, a
  alternativa escolhida e se estava correta, além da pontuação total —
  usado no relatório final (item 3 da seção 3.2).

#### 3.2.3 Relatório final

Exibido após a confirmação da última pergunta pendente. Organizado em duas
abas (Task 26):

- **Resumo** — pontuação total (`ProgressCircle`, acertos/total/
  percentual) e **desempenho por competência**: uma barra (`Meter`) por
  pergunta, rotulada pelo `topic` (seção 3.2.2) e marcada como "Dominada"
  ou "Vale revisar".
- **Gabarito comentado** — acordeão com uma entrada por pergunta,
  mostrando o mesmo painel de retorno pedagógico categorizado (acerto/erro
  próximo/erro distante, `resolveFeedback`) exibido durante a avaliação
  (Task 20/21), agora como revisão.
- Status de conclusão da jornada.
- Opção explícita e visível de **"Reiniciar jornada"**, que zera o
  progresso e retorna ao vídeo, com confirmação antes de executar (ação
  destrutiva).

### 3.3 Persistência de dados do usuário

Estrutura mínima necessária para sustentar o fluxo:

| Dado | Descrição |
|---|---|
| `userId` | Identificador do usuário, gerado localmente |
| `userName` | Nome informado pelo usuário na entrada, usado para personalização |
| `currentStep` | `video` \| `avaliacao` \| `relatorio` |
| `videoCompleted` | boolean |
| `assessmentResult` | resultado da avaliação (estrutura definida na seção 3.2.2) |
| `createdAt` / `updatedAt` | timestamps |

- A opção **"Reiniciar jornada"** reseta `currentStep`, `videoCompleted` e
  `assessmentResult`, voltando `currentStep` para `video`. Mantém `userId`/
  `userName`.
- Persistência via `localStorage`, atrás de um repositório de serviço
  isolado (ver seção 10), para facilitar evolução futura sem reescrever
  consumidores.

---

## 4. Requisitos não funcionais

- **Design system:** componentes visuais do **NextUI/HeroUI**, usados de
  forma consistente — botões, cards, inputs, navegação, diálogos, feedback
  (toasts, tooltips) e tipografia, com tema **light/dark** (implementado
  na Task 18, ver seção 5.1) e paleta própria marinho/dourado/verde/branco
  (Task 27, ver seção 5).
- **Iconografia:** ícones do pacote **`lucide-react`** em todos os pontos
  que antes usavam emoji (Task 27) — consistência visual e leitura
  correta por leitores de tela (`aria-hidden` nos ícones puramente
  decorativos).
- **Responsividade:** layout adaptável mobile/desktop, seguindo os
  breakpoints padrão do NextUI/Tailwind CSS.
- **Acessibilidade:** contraste mínimo AA, foco visível, navegação por
  teclado, labels ARIA nos componentes interativos, tamanho de fonte
  ajustável e modo de alto contraste (Task 19, ver seção 5.1).
- **Idioma:** interface em **PT-BR apenas** nesta v1 (sem arquitetura de
  i18n — ver seção 9). Textos centralizados em um único arquivo de
  strings, para facilitar extração futura para i18n sem reescrever
  componentes.
- **Performance:** vídeo carregado sob demanda (lazy), sem bloquear o
  carregamento inicial da página.
- **Estados de carregamento (Task 26):** enquanto o progresso salvo é
  verificado no `localStorage` (antes de decidir se mostra a tela de
  boas-vindas ou redireciona para a etapa salva), exibir
  `components/journey/JourneyLoading.tsx` (spinner + skeleton), em vez de
  uma tela em branco.

---

## 5. Diretrizes de UI (NextUI/HeroUI)

- Usar os componentes nativos do **NextUI/HeroUI** (ex. `Button`, `Card`,
  `Input`, `AlertDialog`, `Drawer`, `Tabs`, `Accordion`, `Meter`,
  `ProgressCircle`, `Avatar`, `Tooltip`, `Chip`, `Skeleton`, `Spinner`,
  `RadioGroup`) como base de toda a interface, evitando componentes
  customizados quando já houver equivalente na biblioteca.
- Ícones: **`lucide-react`** (Task 27) — nunca emoji em texto de UI.
- Tema definido de forma centralizada em tokens do HeroUI
  (`app/globals.css`) — nunca cor hardcoded em componente (ex.
  `text-zinc-500`); sempre uma referência a um token (`text-(--muted)`,
  `border-(--border)`, etc.), para o dark mode e o alto contraste
  funcionarem em toda a interface sem exceções.
- **Paleta própria (Task 27):** além dos tokens nativos do HeroUI, o
  portal define dois tokens de marca — `--brand` (marinho, `#0b2545`) e
  `--gold` (dourado, `#c9a227`) — usados no cabeçalho, nos ícones em
  destaque e em detalhes decorativos. `--accent`/`--success`/`--warning`
  foram remapeados para a paleta marinho/verde/dourado, com variantes
  específicas no tema escuro (o marinho perde contraste contra o fundo
  escuro, então o acento vira um azul mais claro e o verde fica mais
  vivo) — todas as combinações auditadas para contraste AA (documentado
  em comentário no próprio `app/globals.css`). O dourado nunca é usado
  como cor de texto sobre fundo branco (2,4:1, abaixo de AA) — só sobre
  marinho ou como elemento decorativo/ícone.
- **Imagens ainda não produzidas:** `components/ui/ImagePlaceholder.tsx`
  reserva o espaço e indica o caminho/tamanho sugerido para cada
  ilustração da página inicial (hero, objetivos, jornada) até que os
  arquivos finais sejam adicionados em `public/img/`.

### 5.1 Tema, tamanho de fonte e alto contraste (Tasks 18–19, 22)

- **Tema light/dark/sistema:** via `useTheme()` nativo do HeroUI v3 —
  persiste em `localStorage`, resolve "sistema" pela preferência do SO
  (`prefers-color-scheme`), aplica `data-theme` no `<html>`. Controle
  (`ThemeToggle`) disponível em todas as telas (área pública e restrita).
- **Tamanho de fonte:** 3 níveis (normal/grande/extra grande), persistido
  e aplicado via atributo `data-font-size` no `<html>` (escala o `font-size`
  raiz).
- **Alto contraste:** liga/desliga, persistido via `data-contrast="high"` —
  força textos secundários e bordas ao mesmo tom do texto principal, e
  reforça o anel de foco.
- Todas as três preferências funcionam **antes da identificação** (já na
  tela de boas-vindas), pois são independentes do progresso do aluno —
  não ficam dentro de `UserProgress`.
- **Menu retrátil (Task 22):** os três controles ficam recolhidos por
  padrão em um drawer lateral (`Drawer` do HeroUI), aberto por um botão
  "Acessibilidade" — evita empurrar o conteúdo principal (crítico na tela
  de avaliação, onde o espaço acima da pergunta é escasso). Como o
  conteúdo do drawer só é montado quando aberto, um componente sempre
  montado (`AccessibilityInitializer`) garante que as preferências salvas
  sejam aplicadas desde o primeiro carregamento da página, mesmo com o
  menu fechado.

---

## 6. Identidade do usuário

**Decidido (MVP):** identidade local, sem conta e sem senha. O portal
solicita apenas o **nome do usuário** na entrada, usado para personalizar
mensagens ao longo do módulo. `userId` é gerado localmente
(`crypto.randomUUID()`); `userName` é armazenado junto ao restante do
progresso (ver seção 3.3).

Não há autenticação de administrador nesta v1 — não há área administrativa
(ver seção 9).

---

## 7. Fluxo de telas (alto nível)

```
[Pública: Boas-vindas + nome] --(entrar)--> [Vídeo]
                                                |
                                          (concluir vídeo)
                                                v
                                          [Avaliação]
                                                |
                                         (enviar avaliação)
                                                v
                                      [Relatório final]
                                                |
                                      (opção: Reiniciar jornada)
                                                v
                                            [Vídeo] (reinício)
```

Persistente em todas as telas: indicador de progresso, botão "Reiniciar
jornada" (visível a partir do relatório final).

---

## 8. Critérios de aceite

- [ ] Área pública acessível sem autenticação, com CTA para iniciar a jornada.
- [ ] Usuário informa o nome, tem um `userId` gerado localmente e é
      levado ao vídeo.
- [ ] Usuário consegue assistir ao vídeo e o sistema marca a etapa como
      concluída (automático a ~90% ou via botão "Concluir").
- [ ] Usuário só acessa a avaliação após concluir o vídeo (bloqueio de
      navegação).
- [ ] Quiz suporta perguntas do tipo texto e do tipo simulação de chat, com
      resposta única por pergunta.
- [ ] Ao enviar a avaliação, o sistema calcula o resultado e exibe o
      relatório final com a pontuação.
- [ ] Usuário não consegue acessar o relatório final sem ter enviado a
      avaliação, nem a avaliação sem ter concluído o vídeo.
- [ ] Progresso é mantido ao recarregar a página / reabrir o portal
      (retomada exata da etapa).
- [ ] Botão "Reiniciar jornada" exige confirmação e, ao confirmar, retorna
      o usuário ao vídeo, zerando `videoCompleted` e `assessmentResult`.
- [ ] Aplicação está implantada e acessível publicamente na Vercel.

---

## 9. Fora de escopo desta v1 (extensão futura)

Tudo abaixo foi deliberadamente removido do MVP para priorizar o core
(vídeo → avaliação → relatório) e o deploy. Fica registrado como backlog:

1. **Área administrativa completa** — cadastro/edição de conteúdo via UI,
   login de administrador, ativação/desativação de módulos, listagem de
   alunos com progresso. Nesta v1 o conteúdo é hardcoded em um arquivo de
   seed no código.
2. **Múltiplos módulos em sequência** — a v1 tem **um único módulo**
   (um vídeo + um quiz). Suporte a sequência de módulos ordenáveis fica
   para uma fase futura.
3. **Internacionalização (i18n)** — a v1 é **PT-BR apenas**. Arquitetura de
   tradução (`next-intl`/roteamento por locale) fica para depois.
4. ~~**Alternância de tema (light/dark)**~~ — **implementado** na Task 18
   (2026-09-27), a pedido do usuário. Ver seção 5.1.
5. **Certificação/exportação do relatório** — o relatório final é exibido
   apenas em tela; exportação em PDF ou certificado formal é extensão
   futura.
6. **Acompanhamento de múltiplos alunos** — como a persistência é local
   (no navegador do próprio aluno), não há, nesta v1, visão agregada de
   progresso de vários alunos. Isso exigiria backend/conta — fica para
   quando a Opção B/C de identidade (seção 6) for adotada.

### 9.1 Requisitos de segurança para o login do Administrador (item 1)

Avaliação feita em 2026-09-27, antes de qualquer implementação, para não
perder o contexto até essa feature entrar em desenvolvimento. O login do
Administrador é uma autenticação real (diferente da identificação do
aluno, que não tem senha) e **não pode ser resolvido só no cliente** — a
app atual é 100% estática/local (`localStorage`), sem backend, então essa
feature exige introduzir server-side (Route Handlers/Middleware do
Next.js) só para isso.

**Bloqueadores de design (resolver antes de codar):**
- **Nunca validar a senha no client-side.** Comparar senha digitada com um
  valor embutido no bundle JS (mesmo com hash) é trivialmente extraível
  pelo DevTools/código-fonte. A checagem tem que rodar em um Route Handler
  no servidor.
- **Sessão via cookie `httpOnly` + `Secure` + `SameSite=Lax` (ou
  `Strict`), assinado/criptografado no servidor** (ex. `iron-session`,
  Auth.js/NextAuth com Credentials Provider, ou JWT assinado com segredo
  guardado em env var). **Não usar `localStorage`/`sessionStorage`** para
  o estado de sessão do admin — são acessíveis via JS e viram alvo fácil
  de roubo de sessão em qualquer XSS.
- **Senha nunca em texto puro.** Hash com `bcrypt` ou `argon2` (custo
  adequado); a v1 do task-master mencionava "cookie assinado" como opção
  de persistência mas não detalhava hashing — reforçar isso na task
  quando for escrita.
- **Segredo de assinatura da sessão em variável de ambiente da Vercel**
  (nunca hardcoded, nunca commitado) — gerar um valor aleatório forte por
  ambiente (produção/preview), sem fallback hardcoded no código caso a env
  var esteja ausente.
- **Proteção de rotas `/admin/**` no servidor** (middleware.ts verificando
  o cookie de sessão), não apenas um redirect client-side — um redirect só
  no client não impede acesso a dados servidos por Route Handlers/API por
  trás da tela.

**Recomendado, mas negociável para uma v2 pequena (1 admin):**
- Rate limiting/backoff no endpoint de login (ex. Upstash Redis ou mesmo
  um contador em memória para MVP) para dificultar força bruta.
- Sem endpoint de "esqueci minha senha" na v2 inicial — reset manual via
  variável de ambiente é aceitável para um único administrador.
- Logs de acesso/ações administrativas (auditoria) — nice-to-have, não
  bloqueante para o primeiro corte.

**Fora de escopo mesmo na v2 do login:** 2FA, SSO corporativo (já decidido
como fora de escopo na seção 6), múltiplos perfis de permissão.

---

## 10. Stack (definida)

- **Framework:** **Next.js** (App Router), hospedado na **Vercel**.
- **Biblioteca de componentes:** **NextUI** (atualmente renomeada para
  **HeroUI**) — tema padrão único da biblioteca (ver seção 5).
- **Persistência local:** `localStorage` com camada de serviço
  (`UserProgressRepository`) isolada, para facilitar migração a backend se
  o projeto evoluir para múltiplos módulos/admin/multi-usuário (seção 9).
- **Conteúdo:** vídeo (URL do YouTube) e perguntas do quiz definidos em um
  arquivo de seed no código-fonte (`content/module.ts` ou equivalente) —
  sem CRUD nem backend de conteúdo nesta v1.
- **Vídeo:** embed do **YouTube** via **IFrame Player API**
  (`https://www.youtube.com/iframe_api`), com `enablejsapi=1` e domínio
  `youtube-nocookie.com` — ver viabilidade e limitações na seção 3.2.1.

---

**Próximo passo:** implementação conforme `task-master.md`, com deploy na
Vercel assim que o core (vídeo → avaliação → relatório) estiver funcional.
