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

## Deploy

Hospedado na [Vercel](https://vercel.com). Não é necessária nenhuma
variável de ambiente para o MVP atual (persistência é local, via
`localStorage`, e o conteúdo é hardcoded em `content/module.ts`).
