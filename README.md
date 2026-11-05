# Portal de Planejamento Pedagógico para EaD com Apoio de IA (MVP)

Portal web em Next.js sobre planejamento de experiências de aprendizagem a
distância com apoio de IA: o aluno assiste a um vídeo, responde a uma
avaliação e recebe um relatório final de desempenho. Veja `PRD.md` para o
escopo do produto e `task-master.md` para o plano de implementação.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Conteúdo do módulo

O vídeo e as perguntas do quiz são definidos em `content/module.ts`.
Substitua `youtubeVideoId` pelo ID de um vídeo do YouTube **não listado**,
sem monetização, antes de publicar em produção (ver `PRD.md`, seção 3.2.1).

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — serve o build de produção
- `npm run lint` — checagem de lint
- `npm test` — testes unitários (Vitest): correção do quiz, retorno pedagógico, integridade do banco de questões e repositório de progresso
- `npm run test:e2e` — testes de ponta a ponta (Playwright) do percurso do aluno, contra o build de produção
- `npm run test:a11y` — auditoria de acessibilidade (axe-core, WCAG 2.2 AA) em todas as telas e nas 12 combinações de tema × contraste × tamanho de fonte
- `npm run docs:check` — verifica a consistência da documentação (grafo de tasks, tabelas-resumo, citações)

Na primeira vez, instale o navegador dos testes: `npx playwright install chromium`.
Os testes E2E e de acessibilidade rodam com **um processo por vez** (ver
`playwright.config.ts`) e fazem o build antes de subir o servidor.

## Deploy

Hospedado na [Vercel](https://vercel.com). Não é necessária nenhuma
variável de ambiente para o MVP atual (persistência é local, via
`localStorage`, e o conteúdo é hardcoded em `content/module.ts`).

## Documentação do projeto

| Arquivo | Para quê |
|---|---|
| `PRD.md` | Escopo e requisitos do produto (seção 9.3: evolução v2) |
| `task-master.md` | Plano de implementação, status e dependências das tasks |
| `plano-evolucao-v2.md` | Plano da evolução: frentes, decisões, riscos e sequência |
| `plano-adequacao-design-instrucional.md` | Revisão contra as 7 práticas de design instrucional (Tasks 28–38) |
| `docs/` | Guia de estilo, matriz de rastreabilidade, revisão do fluxo, planos de teste e prompts de ilustração |
| `testes/` | Evidências e verificadores de documentação e pesquisa (não são testes do código) |

Depois de atualizar qualquer documento, rode:

```bash
node testes/consistencia/verificar-docs.js
```
