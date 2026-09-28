# PRD — Portal de Planejamento Pedagógico para EaD com Apoio de IA (MVP)

**Status:** Aprovado para execução (escopo reduzido ao core)
**Autor:** Engenharia de Requisitos (Claude Code)
**Data:** 2026-09-27 (tema/objetivo pedagógico definidos em 2026-09-27)

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

> **Observação de UX (2026-09-27, feedback do usuário — pendente de
> implementação, ver Task 16 do task-master.md):** a implementação atual
> está visualmente pobre para uma tela inicial de portal e usa **duas
> etapas** (clicar no CTA → só então aparece o campo de nome). Requisitos
> para a próxima iteração:
> - **Aparência de portal**, não só um card centralizado: header/topo com
>   identidade do portal, e uma seção explicando do que se trata o
>   conteúdo (não só o CTA).
> - **Entrada em etapa única**: o campo de nome deve ficar visível já na
>   primeira tela (junto com a explicação do portal), sem exigir um clique
>   intermediário só para revelar o formulário.

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
- **Validação imediata, uma pergunta por vez** (Task 20): o aluno responde
  e confirma cada pergunta antes de ver a próxima — não é um formulário
  único enviado ao final. Ao confirmar, alternativas ficam bloqueadas e um
  painel de **retorno pedagógico imediato** é exibido, categorizado por
  proximidade da resposta escolhida: acerto, erro próximo (uma alternativa
  específica, plausível mas incorreta) ou erro distante (demais
  alternativas) — conteúdo definido em `banco-questoes.md`.
- O resultado (`assessmentResult`, seção 3.6) registra, por pergunta, a
  alternativa escolhida e se estava correta, além da pontuação total —
  usado no relatório final (item 3 da seção 3.2).

#### 3.2.3 Relatório final

Exibido após o envio do quiz. Mostra:

- Pontuação total (ex. acertos/total).
- Por pergunta: alternativa escolhida e se estava correta (opcional, se
  couber na v1 sem esforço extra).
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

- **Design system:** componentes visuais do **NextUI**, usados de forma
  consistente — botões, cards, inputs, navegação, diálogos, feedback
  (toasts) e tipografia, com tema **light/dark** (implementado na Task 18,
  ver seção 5.1).
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

---

## 5. Diretrizes de UI (NextUI)

- Usar os componentes nativos do **NextUI** (ex. `Button`, `Card`, `Input`,
  `Modal`, `Progress`, `Navbar`, `RadioGroup`) como base de toda a
  interface, evitando componentes customizados quando já houver equivalente
  na biblioteca.
- Componentes esperados no fluxo: `Navbar` (topo), `Card` (blocos de
  conteúdo), `Button` (ações), `Modal` de confirmação (para o reset da
  jornada), `Progress`/`Steps` (progresso da jornada), `Toast` (feedback).
- Tema definido de forma centralizada em tokens do HeroUI (`app/globals.css`)
  — nunca cor hardcoded em componente (ex. `text-zinc-500`); sempre uma
  referência a um token (`text-(--muted)`, `border-(--border)`, etc.), para
  o dark mode e o alto contraste funcionarem em toda a interface sem
  exceções.

### 5.1 Tema, tamanho de fonte e alto contraste (Tasks 18–19)

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
