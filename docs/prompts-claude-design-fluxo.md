# Prompts para o Claude Design: protótipos do fluxo (UX-21)

> Gerado em: 2026-11-05 · Decisões de `docs/revisao-fluxo-ux.md`, seção 7
> Origem: as respostas do usuário às seis perguntas do UX-21 e às seis
> dúvidas que delas surgiram. Uso: tipo de artefato "Design" do Claude
> (decisão D0, design interno). Os protótipos são **de baixa fidelidade
> de estrutura**, mas já usam as cores e a fonte atuais do portal; o
> design system v2 (Task 59) ainda vai redefinir o visual.

## 1. O que está decidido (entra em todos os prompts)

| Ponto | Decisão |
|---|---|
| Trilha | **E-book, mapa interativo, avaliação, relatório**, nessa ordem **sugerida**, nunca obrigatória |
| Vídeo | **Fora** por enquanto, sem espaço reservado; o desenho comporta um quinto passo depois |
| Quadrinho | **Fora** da trilha e do progresso; a rota existe, mas sem link na navegação |
| Primeira tela | Todos os itens da trilha acessíveis; **sem campo de nome**; progresso visível já ali |
| Navegação | Cada item tem a sua rota; **sem menus colapsados**; cabeçalho com pouca altura |
| Celular | Barra **fixa inferior** com os itens; fonte extra grande pode quebrar linha |
| Progresso | Unidades distintas vistas; **concluído a partir de 80%** |
| Relatório | Bloco "Seu percurso" e comentários que **referenciam materiais** |
| Nome | Nenhum; só se houver certificado |

## 2. Bloco de contexto (colar no início de cada prompt)

```text
Contexto: portal educacional brasileiro, em português, de um minicurso a distância sobre planejamento pedagógico com apoio de IA. O público são educadores, licenciandos e designers instrucionais. Não há conta nem cadastro: o progresso fica no navegador.

Identidade atual a manter (não é o design final, só a base): azul-marinho #0b2545 para cabeçalhos e botões primários; dourado #c9a227 só como detalhe decorativo ou sobre azul-marinho (nunca como texto sobre branco); verde #157347 para "concluído"; fundo #f5f7fa; superfície branca; texto #11181c; texto secundário #52525b; borda #d4d4d8. Fonte Arial. Ícones em traço (SVG inline), nunca emoji.

Regras de acessibilidade (obrigatórias, o portal mira WCAG 2.2 AA): contraste mínimo de 4,5:1 em todo texto; nunca usar só cor para dizer o estado (sempre ícone ou texto também); elementos clicáveis são links ou botões de verdade; alvo mínimo de toque de 44 px no celular; sem menus colapsados (hambúrguer, gaveta ou lista suspensa) para a navegação principal.

A trilha, nesta ordem sugerida: 1) E-book (18 páginas), 2) Mapa interativo (4 elementos), 3) Avaliação (4 perguntas), 4) Relatório (resultado e comentários). A ordem é uma SUGESTÃO: todos os itens ficam clicáveis o tempo todo, nenhum aparece bloqueado. Sem vídeo e sem quadrinho nesta versão.

Estados de cada item: não iniciado (0%), em andamento (1% a 79%), concluído (80% ou mais, com ícone de confirmação). O percentual é sempre mostrado em texto. O item sugerido a seguir (o primeiro não concluído) é destacado com o rótulo "Próximo", mas os demais continuam acessíveis.

Sem texto de preenchimento inventado: use apenas o conteúdo abaixo. Entregue como protótipo estático (sem interações obrigatórias).
```

## 3. Prompts por artboard

Cada artboard é um arquivo do canvas. Tamanhos: desktop 1366×768 (janela de
notebook), celular 390×844.

### 3.1 `Main`: primeira tela, visitante novo (variante A)

```text
[CONTEXTO]
Crie a PRIMEIRA TELA do portal para um visitante novo (nenhum item iniciado, progresso 0%), em uma janela de 1366×768.

Cabeçalho, variante A (altura máxima de 56 px, em uma única linha): à esquerda a marca (um quadrado azul-marinho com um livro aberto em dourado) e o nome "Planejamento Pedagógico para EaD"; ao centro a TRILHA como lista ordenada de quatro itens ligados por uma linha fina, cada item com ícone, rótulo e o percentual em texto ("0%"); à direita o texto "Trilha 0%". O primeiro item aparece com contorno de destaque por ser o sugerido. Sem subtítulo, sem segunda linha.

Corpo, em duas colunas. Coluna esquerda: título "Planejamento Pedagógico para EaD com Apoio de IA", uma frase de apoio, o botão primário "Começar pelo e-book" e o link "Conhecer os objetivos do curso". Coluna direita: o painel "Sua trilha" com a barra de progresso geral ("Progresso da trilha: 0%") e os quatro itens como cartões numerados e ligados por uma linha vertical; cada cartão tem título, uma linha de descrição, o status em texto, o percentual, e um link "Abrir". O cartão do e-book leva o rótulo "Próximo". Ao pé do painel, o link discreto "Apagar meu progresso". Na borda esquerda da janela, a aba vertical "Acessibilidade" (já existe no portal; é a única coisa colapsada permitida).

Mostre ao final da janela uma dica de que há mais conteúdo abaixo (objetivos, público e perguntas frequentes).
```

### 3.2 `Home-retorno`: primeira tela, quem já avançou

```text
[CONTEXTO]
Mesma primeira tela do artboard anterior, agora para quem voltou: e-book concluído (18 de 18 páginas, 100%), mapa em andamento (2 de 4 elementos, 50%), avaliação e relatório sem início. Progresso geral 38%.

O cabeçalho mostra cada item com seu estado (ícone de confirmação no e-book, percentual nos demais) e o mapa como sugerido. O botão primário passa a "Continuar: mapa interativo". No painel "Sua trilha", o e-book mostra "Concluído", o mapa mostra "Em andamento · 2 de 4 elementos" com barra e o rótulo "Próximo", a avaliação mostra "Não iniciada · 4 perguntas" e o relatório mostra "Sem resultado ainda". Todos continuam com o link "Abrir", inclusive o relatório. Mantenha "Apagar meu progresso" ao pé.
```

### 3.3 `Cabecalhos`: estudo das duas variantes de cabeçalho

```text
[CONTEXTO]
Faça um quadro de comparação de cabeçalhos, largura 1366 px, com duas variantes, cada uma em três estados, empilhadas e rotuladas.

Variante A (a descrita na primeira tela, máx. 56 px, trilha com ícone, rótulo e percentual por item). Variante B: barra de 44 px com a marca e o nome à esquerda e, à direita, os quatro itens como links de texto com um pequeno glifo de estado (círculo vazio, meio círculo, confirmação), com o item da página atual sublinhado; logo abaixo, uma faixa de 6 px dividida em quatro segmentos que se preenchem conforme o progresso de cada item; o percentual geral ao final da barra.

Estados para cada variante: (1) novo visitante, 0%; (2) quem já avançou: e-book 100%, mapa 50%; (3) fonte extra grande (125%): mostre como a barra quebra de linha sem esconder nada. Anote em cada faixa a altura total em pixels. Não use menu hambúrguer nem lista suspensa.
```

### 3.4 `Pagina-mapa`: uma página de conteúdo com o novo cabeçalho

```text
[CONTEXTO]
Mostre a página do mapa interativo (rota própria) em 1366×768 com o cabeçalho da variante A e a página atual destacada no cabeçalho. Abaixo do cabeçalho, um título curto em uma linha ("Mapa do alinhamento") sem repetir o nome do portal; à esquerda um diagrama com quatro elementos (Público, Objetivos, Atividades e Avaliação) ligados por linhas, com "Objetivos" selecionado; à direita o painel de detalhe com os blocos Conceito, Exemplo, Falha típica da IA e Conexões. Na base da janela, uma barra fina "Sugestão" com os links "Anterior sugerido: E-book" e "Próximo sugerido: Avaliação" e o texto "Mapa interativo: 50% visto". Mostre que o conteúdo ganha altura em relação ao cabeçalho antigo (que somava cerca de 124 px entre faixas): indique a altura do cabeçalho novo.
```

### 3.5 `Home-celular`: primeira tela no celular

```text
[CONTEXTO]
Primeira tela em 390×844 para quem já avançou (e-book 100%, mapa 50%). Topo mínimo (máx. 48 px) com a marca e o nome curto. Conteúdo rolável: progresso geral 38% com barra, o botão primário "Continuar: mapa interativo", e os quatro itens da trilha como cartões empilhados (toque de pelo menos 44 px de altura). Fixa na base, uma barra de navegação com os quatro itens (ícone, rótulo curto e percentual em texto), o item sugerido destacado, altura de 64 px. Sem menu hambúrguer. A aba "Acessibilidade" fica na borda, sem cobrir a barra inferior.
```

### 3.6 `Relatorio`: "Seu percurso" e comentários com materiais

```text
[CONTEXTO]
Mostre o relatório final em 1366×820 com o cabeçalho da variante A (relatório destacado). Na coluna esquerda, o novo bloco "Seu percurso" com os quatro itens, o estado e o percentual de cada um (e-book 100%, mapa 50%, avaliação concluída, relatório visto) e o progresso geral. Na coluna principal: o resumo por competência (quatro competências, cada uma "Dominada" ou "Vale revisar", com ícone e texto) e, abaixo, a aba "Gabarito comentado" com um comentário aberto de uma pergunta que "Vale revisar". Ao fim do comentário, chips clicáveis que referenciam materiais diretamente: "E-book · capítulo 3 · Auditar a sugestão da IA" e "Mapa interativo · elemento Público", com ícone e seta. Os chips são links, com contraste de 4,5:1.
```

## 4. Como avaliar os protótipos

- **Altura útil:** o cabeçalho novo ocupa no máximo 56 px (hoje o público soma 76 px mais a linha de título).
- **Sem menu colapsado:** nenhum hambúrguer, gaveta ou lista suspensa na navegação principal.
- **Trilha sugerida e livre:** ordem visível, mas nada parece bloqueado.
- **Progresso legível sem cor:** percentual e estado sempre em texto ou ícone.
- **Fonte extra grande:** a barra quebra de linha sem esconder item.
- **Celular:** itens inferiores com 44 px de toque e sem cobrir conteúdo.

## 5. Limites

- Protótipos **estáticos** e de **estrutura**; a escolha de cores, tipos e formas finais é do design system v2 (Tasks 59 e 60).
- O percentual por material depende de instrumentar cada leitor (Task 51 e seguintes); aqui é ilustrativo.
- A conferência de contraste e de acessibilidade dos protótipos é **visual**, não automática.
