# testes/: evidências e verificadores

> Esta pasta **não contém testes automatizados do código**. Os testes do
> portal (Playwright, axe-core e unitários) serão criados na Task 45, em
> `tests/`.

| Pasta | Conteúdo | Task |
|---|---|---|
| `consistencia/verificar-docs.js` | Confere o grafo de tasks, as tabelas-resumo, o plano × `task-master.md`, as referências numéricas, os caminhos citados e as citações arquivo:linha. Somente leitura | Auditoria de 2026-11-04; script `docs:check` na Task 45 |
| `rastreabilidade/trace.js` | Cruza o banco de questões com o roteiro por termo e timestamp. Reutilizar sobre a transcrição do vídeo final | 39 |
| `claude-design/pecas-teste/` | Fontes (`.dc.html`) do artefato "Design" de teste | 44 |
| `claude-design/pecas-teste-local/` | Versão em HTML puro das mesmas peças | 44 |
| `imagens-ia/registro-modelo.md` | Modelo de registro da ferramenta de imagem; as imagens entregues vão em `imagens-ia/<ferramenta>/` | 64 |

## Como rodar

```bash
node testes/consistencia/verificar-docs.js
node testes/rastreabilidade/trace.js
```

Nada nesta pasta é publicado no portal.
