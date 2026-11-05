# Referências visuais e de UX do mercado

> Task 57 (requisito R2) · fontes acessadas em 2026-11-04
> **Registra padrões observáveis, não identidade:** nenhuma marca, arte
> ou texto de terceiros é copiado.

## 1. Critérios e limites

**Critérios (declarados antes da coleta):**
1. documentação pública ou página do produto, **consultável sem login**;
2. relevância para um **portal de aprendizagem para adultos, usado
   também no celular**;
3. padrão **observável em texto** (estrutura, estados, regras);
4. cobertura das categorias do portal: apresentação do curso,
   navegação, vídeo, avaliação e feedback, progresso, materiais e
   sobreposições.

**Limites, e eles são grandes:**
- A extração foi em **texto**. **Não vi nenhuma tela renderizada**, então
  esta pesquisa **não diz como as interfaces parecem**, só como são
  organizadas. O "moderno e atrativo" do requisito R2 depende de olhar
  imagens, e isso exige um navegador ou capturas de tela fornecidas por você.
- Khan Academy, gov.br e Duolingo foram só **parcialmente** observados
  (ver ficha de cada um).
- **Não observei acessibilidade em uso real**, só o que cada fonte afirma.

---

## 2. Referências por categoria

### Apresentação do curso e estrutura do módulo

| Referência | Padrão observado | Fonte |
|---|---|---|
| **Microsoft Learn** (módulo para educadores) | Página do módulo mostra **nível**, **públicos**, **número de unidades** (14), **pré-requisitos** (nenhum), lista de unidades com **duração por unidade**, e fecha com **Knowledge check** (unidade 13) e **Summary** (14) | [Módulo](https://learn.microsoft.com/en-us/training/modules/microsoft-education-k-12-educators/) |
| Microsoft Learn (tipos de conteúdo) | Cada **unidade** é uma página com experiência variada (só texto, texto e vídeo, verificação de conhecimento, interativa) e pertence a um único módulo; o crédito é dado **por unidade concluída** | [Tipos de conteúdo](https://learn.microsoft.com/en-us/training/support/learn-content-types) |
| **Lição para nós** | Módulo curto em **unidades pequenas**, com duração visível, verificação ao fim e resumo. Conversa com a Task 30 (dividir o vídeo) e com o relatório | |

### Progresso e relatório

| Referência | Padrão observado | Fonte |
|---|---|---|
| **GOV.UK, lista de tarefas** | Mostra todas as tarefas e **o status de cada uma** (ex.: "Completed"); quando um serviço é longo e de ordem fixa, **não usar**; se exige várias sessões, **permitir salvar e retomar de onde parou** | [Task list](https://design-system.service.gov.uk/components/task-list/) |
| **Lição para nós** | Reforça a necessidade de salvar o progresso da avaliação (atrito UX-04) e de mostrar status por etapa | |

### Navegação

| Referência | Padrão observado | Fonte |
|---|---|---|
| **GOV.UK, navegar um serviço** | Separa a navegação **da plataforma** da navegação **do serviço**: desde agosto de 2024, o cabeçalho GOV.UK **não pode mais** mostrar o nome do serviço nem links; isso é papel do componente "Service navigation" | [Navigate a service](https://design-system.service.gov.uk/patterns/navigate-a-service/) |
| **Lição para nós** | Separar o que é "ir a outra etapa" do que é "apagar meus dados" (atrito UX-09) | |

### Vídeo e mídia

| Referência | Padrão observado | Fonte |
|---|---|---|
| **Able Player** (player HTML5 acessível, código aberto) | Controles **operáveis por teclado** e rotulados para leitor de tela; **atalhos de teclado**; controles **escaláveis e de alto contraste**, com foco visível; **legendas** em WebVTT; **capítulos** em WebVTT; **audiodescrição** em texto ou em vídeo separado; **transcrição** navegável | [Able Player](https://ableplayer.github.io/ableplayer/) |
| **Lição para nós** | É o modelo do que o nosso player precisa ter (hoje só Play e Pause, atrito UX-11); responde diretamente às Tasks 29 e 35 | |

### Linguagem visual e tom

| Referência | Padrão observado | Fonte |
|---|---|---|
| **Duolingo, "shape language"** | Texto de 2020 (via arquivo da web): o estilo de ilustração migrou para o app, e a interface seguiu com um **redesenho em 2018** marcado por cores vibrantes; "uma pitada de humor para o app parecer amigável". **A extração cortou o restante da frase** | [Blog (arquivo)](https://web.archive.org/web/2024/https://blog.duolingo.com/shape-language-duolingos-art-style/) |
| **Lição para nós** | A ilustração e a interface devem ter **a mesma linguagem de formas**; tom amigável. Não copiar o estilo | |

### Sistemas de design públicos (parcialmente observados)

| Referência | O que consegui | Não observado | Fonte |
|---|---|---|---|
| **Khan Academy, Wonder Blocks** | Repositório aberto de design system em desenvolvimento ("work-in-progress"); resumo de busca cita tokens e componentes em pacotes npm sob licença MIT | A documentação (Storybook) **não carregou** na extração | [README](https://raw.githubusercontent.com/Khan/wonder-blocks/main/README.md) |
| **Padrão Digital de Governo (gov.br)** | Resumo de busca: componentes acessíveis, entre eles Modal, Wizard, Loading, Tab, Tooltip, Skip Link; referências ao e-MAG e à WCAG | A página **é renderizada por JavaScript** e veio vazia; nada foi confirmado na fonte | [gov.br/ds](https://www.gov.br/ds/introducao/principios) |

---

## 3. Cobertura por categoria do portal

| Categoria | Situação |
|---|---|
| Apresentação do curso | Coberta (Microsoft Learn) |
| Progresso e relatório | Coberta em parte (GOV.UK) |
| Navegação | Coberta em parte (GOV.UK) |
| Vídeo | Coberta (Able Player) |
| Avaliação e feedback | **Parcial:** só a posição da verificação de conhecimento (Microsoft Learn); falta ver o feedback de uma interface de verificação |
| Materiais complementares | Parcial (tipos de unidade do Microsoft Learn) |
| **Sobreposições** (drawer, modal, toast) | **Não coberta** |
| **Estados de carregamento** | **Não coberta** |
| **Aparência (cor, tipografia, formas)** | **Não coberta de forma verificável** (ver limites) |

## 4. Para fechar as lacunas

1. **Você indicar 3 a 5 interfaces que admira** (plataformas de ensino ou
   outros produtos), com o link. O requisito R2 pede "o melhor do
   mercado" e "moderno"; o seu olhar vale mais do que qualquer lista
   minha, e eu extraio a estrutura de cada uma.
2. **Capturas de tela** dessas interfaces, ou um navegador conectado à
   sessão, para eu ver a aparência e não só o texto.
3. Reaplicar a coleta aos sistemas que não carregaram (Wonder Blocks e
   gov.br), com outro método.
