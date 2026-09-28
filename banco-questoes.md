# Banco de Questões para a Avaliação Interativa Nativa

## Diretrizes de Implementação para o Desenvolvedor

Este documento contém o banco de dados das questões formatado para a implementação nativa na aplicação web. Cada questão contempla o cenário, a pergunta, quatro alternativas de resposta, a chave de resposta correta e os textos de retorno pedagógico imediato categorizados por nível de proximidade com a resposta certa.

### Especificações Técnicas de Interface:

* **Mecânica:** Seleção de alternativa única com validação imediata ao clicar no botão de confirmação.

* **Componente de Feedback:** Exibição de painel visual após a resposta, destacado em cor verde para acertos, cor amarela para erros próximos e cor laranja/vermelha para erros distantes (exigindo revisão).

* **Pontuação e Navegação:** Liberação do avanço para a próxima questão após a leitura do retorno pedagógico. Exibição de um resumo final de desempenho na última etapa.

## Estrutura do Banco de Questões

### Questão 1: Diagnóstico de Alinhamento Pedagógico

* **Dimensão Avaliada:** Alinhamento Construtivo e Coerência Didática.
* **Contexto no Minicurso:** Conceito apresentado no Bloco 1 e demonstrado no Bloco 4 do vídeo.

**Enunciado:**
Durante o planejamento de uma aula a distância sobre Introdução à Lógica de Programação, o professor definiu como objetivo principal que o estudante seja capaz de construir rotinas de código para resolver problemas simples. Ao solicitar uma proposta de avaliação ao assistente de inteligência artificial, o sistema sugeriu a aplicação de uma prova objetiva de múltipla escolha focada na memorização de datas históricas da evolução dos computadores.

Considerando os princípios do alinhamento pedagógico, qual é a falha estrutural presente nessa proposta da máquina?

* **Alternativa A:** A prova de múltipla escolha exige um tempo de processamento excessivo para ambientes virtuais de aprendizagem.
* **Alternativa B:** Ocorre uma quebra na coerência didática, pois o método de avaliação escolhido não mensura a capacidade prática descrita no objetivo de aprendizagem. *(Resposta Correta)*
* **Alternativa C:** A inteligência artificial utilizou uma linguagem excessivamente técnica para o perfil de alunos adultos iniciantes.
* **Alternativa D:** O modelo de avaliação teórica impede a inserção de gráficos visuais na plataforma de hospedagem do curso.

**Retornos Pedagógicos:**

* **Acerto (Alternativa B):** Excelente análise! O alinhamento pedagógico exige que a avaliação meça exatamente a competência proposta no objetivo. Se o objetivo foca na construção prática de algoritmos, a verificação do aprendizado deve exigir a resolução de um problema de programação em vez de focar na memorização de dados históricos.

* **Erro Próximo (Alternativa C):** Atenção a um detalhe sutil. A adequação da linguagem dialoga com o perfil do público, o que é realmente importante. A falha central relatada no enunciado, contudo, reside na incompatibilidade entre a habilidade exigida no objetivo (prática de código) e o instrumento de medida selecionado (prova teórica).

* **Erro Distante (Alternativas A e D):** Incorreto. As limitações tecnológicas de tempo de tela ou de inserção de gráficos não são a raiz do problema neste cenário. Recomenda-se a revisão atenta do Bloco 1 do minicurso para consolidar o conceito fundamental de Alinhamento Construtivo.

### Questão 2: Arquitetura de Comandos (Engenharia de Prompts)

* **Dimensão Avaliada:** Formulação de Instruções Estruturadas para Inteligência Artificial.
* **Contexto no Minicurso:** Estrutura explicada no Bloco 2 do vídeo.

**Enunciado:**
Para obter uma proposta de plano de aula rica em detalhes pedagógicos e adequada ao ensino a distância, o educador deve estruturar o seu comando utilizando quatro pilares fundamentais.

Assinale a alternativa que apresenta a aplicação correta da fórmula de comando estruturado.

* **Alternativa A:** "Crie uma aula completa sobre linguagem de programação para alunos de cursos virtuais."
* **Alternativa B:** "Aja como um designer instrucional especialista em Computação. Crie um plano de aula assíncrono sobre estruturas condicionais para adultos iniciantes. Defina os objetivos, o roteiro de estudo, uma atividade prática e a avaliação formativa." *(Resposta Correta)*
* **Alternativa C:** "Explique o conceito de algoritmo e gere dez exercícios teóricos com gabarito para envio por correio eletrônico."
* **Alternativa D:** "Pesquise na internet os melhores cursos de programação e faça um resumo dos tópicos mais buscados pelos estudantes."

**Retornos Pedagógicos:**

* **Acerto (Alternativa B):** Perfeito! Esta alternativa contempla de forma precisa os quatro pilares do comando pedagógico: o Papel assumido pelo assistente, o Contexto do público e da modalidade, a Tarefa detalhada a ser executada e o Formato esperado para a resposta final.

* **Erro Próximo (Alternativa C):** Quase lá! O comando escolhido por você apresenta a Tarefa e o Formato. Faltam, no entanto, os pilares de Papel e Contexto, requisitos essenciais para que a inteligência artificial não gere um material raso ou desconectado da realidade do seu aluno.

* **Erro Distante (Alternativas A e D):** Incorreto. Estes comandos são totalmente vagos ou delegam funções inadequadas à máquina. Sugere-se uma revisão completa do Bloco 2 do vídeo para dominar a arquitetura necessária na hora de solicitar materiais educacionais.

### Questão 3: Auditoria Crítica e Refinamento de Conteúdo

* **Dimensão Avaliada:** Curadoria Humana e Intervenção Corretiva.
* **Contexto no Minicurso:** Processo prático demonstrado nos Blocos 3 e 4 do vídeo.

**Enunciado:**
Ao analisar a proposta de atividade prática gerada pela inteligência artificial para um curso assíncrono, o professor notou que o sistema sugeriu um debate em grupo ao vivo com duração de duas horas, exigindo a instalação de um software pesado compatível apenas com computadores de alto desempenho. O público do curso é composto por adultos que estudam em horários flexíveis, utilizando predominantemente dispositivos móveis.

Qual deve ser a conduta do educador nesta etapa de auditoria do material?

* **Alternativa A:** Aceitar a proposta da máquina sem alterações, pois a inteligência artificial possui dados atualizados sobre as tendências de educação.
* **Alternativa B:** Cancelar a oferta do curso no ambiente virtual por incompatibilidade técnica dos estudantes com as ferramentas exigidas.
* **Alternativa C:** Enviar um novo comando para o assistente solicitando a substituição da dinâmica por um exercício assíncrono e leve, compatível com acesso via smartphones. *(Resposta Correta)*
* **Alternativa D:** Modificar o perfil do público-alvo no projeto pedagógico para exigir que os alunos comprem computadores avançados antes de iniciarem o estudo.

**Retornos Pedagógicos:**

* **Acerto (Alternativa C):** Exatamente! A curadoria humana é indispensável. O educador deve identificar as barreiras tecnológicas e de rotina do público-alvo, orientando o assistente virtual a ajustar as atividades para o contexto real de acesso dos estudantes.

* **Erro Próximo (Alternativa A):** Cuidado com a delegação total de responsabilidade. Embora a ferramenta possua um vasto banco de dados sobre educação, ela desconhece a realidade socioeconômica e tecnológica específica dos seus alunos. A validação humana continua sendo um critério obrigatório.

* **Erro Distante (Alternativas B e D):** Incorreto. Punir o aluno, cancelar o projeto ou exigir investimentos financeiros inviáveis foge completamente da empatia didática. Retome a visualização dos Blocos 3 e 4 para compreender o papel do professor na adequação do conteúdo à realidade do cursista.

### Questão 4: Validação do Papel Docente na Era da Inteligência Artificial

* **Dimensão Avaliada:** Papel do Educador no Processo de Design Instrucional.
* **Contexto no Minicurso:** Síntese e fechamento apresentados no Bloco 5 do vídeo.

**Enunciado:**
A utilização de assistentes virtuais de inteligência artificial no planejamento de experiências de aprendizagem a distância oferece agilidade na organização de conteúdos e na geração de ideias primárias.

Diante dessa premissa, como deve ser definida a relação entre a ferramenta tecnológica e o trabalho do educador?

* **Alternativa A:** O assistente virtual atua como um co-piloto de redação e estruturação, cabendo ao educador a validação metodológica, a empatia com o aluno e a responsabilidade final pelo projeto. *(Resposta Correta)*
* **Alternativa B:** A ferramenta de inteligência artificial substitui integralmente a figura do designer instrucional, dispensando a necessidade de revisão humana antes da publicação do curso.
* **Alternativa C:** O uso da inteligência artificial restringe-se à correção ortográfica e gramatical de textos pré-existentes, sendo incapaz de auxiliar na estruturação de planos de aula originais.
* **Alternativa D:** A tecnologia deve ser utilizada para gerar e corrigir avaliações somativas automatizadas, eliminando a interferência do professor na escolha dos critérios de nota.

**Retornos Pedagógicos:**

* **Acerto (Alternativa A):** Excelente visão! A tecnologia atua como uma aliada para otimizar etapas operacionais do planejamento. A sensibilidade social, a validação técnica dos conteúdos, a empatia com as dificuldades dos alunos e o rigor didático permanecem como atribuições exclusivas do profissional da educação.

* **Erro Próximo (Alternativa C):** Você subestimou o potencial da ferramenta. A inteligência artificial possui excelente capacidade de organização estrutural e ideação primária, operando de forma muito mais ampla do que um simples corretor gramatical. O limite da máquina reside na etapa de validação, a qual pertence ao educador.

* **Erro Distante (Alternativas B e D):** Incorreto. Delegar integralmente o projeto instrucional ou a avaliação final para a máquina anula a figura do educador e coloca o aprendizado em risco. É fundamental rever o Bloco 5 da nossa aula para consolidar o conceito do profissional como curador metodológico indispensável.