import type { Question } from "@/types/quiz";

export interface ModuleContent {
  title: string;
  description: string;
  /**
   * ID de um vídeo do YouTube não listado, sem monetização (ver PRD 3.2.1).
   * `null` enquanto o vídeo real do módulo ainda não foi definido — a etapa
   * de vídeo exibe um skeleton no lugar do player.
   */
  youtubeVideoId: string | null;
  questions: Question[];
}

export const moduleContent: ModuleContent = {
  title: "Planejamento Pedagógico para EaD com Apoio de IA",
  description:
    "Aprenda a planejar uma experiência de aprendizagem a distância articulando público, objetivos, conteúdos, atividades e avaliação — usando uma aula de Computação como exemplo de como pedir, analisar e melhorar sugestões de um assistente de IA, como o Gemini.",
  // Vídeo do módulo ainda não definido — ver VideoSkeleton.
  youtubeVideoId: null,
  // Banco de questões definido em banco-questoes.md — ver lib/quiz/resolveFeedback.ts
  // para a lógica de retorno pedagógico por proximidade da resposta.
  questions: [
    {
      id: "q1",
      type: "text",
      prompt:
        "Durante o planejamento de uma aula a distância sobre Introdução à Lógica de Programação, o professor definiu como objetivo principal que o estudante seja capaz de construir rotinas de código para resolver problemas simples. Ao solicitar uma proposta de avaliação ao assistente de inteligência artificial, o sistema sugeriu a aplicação de uma prova objetiva de múltipla escolha focada na memorização de datas históricas da evolução dos computadores.\n\nConsiderando os princípios do alinhamento pedagógico, qual é a falha estrutural presente nessa proposta da máquina?",
      options: [
        "A prova de múltipla escolha exige um tempo de processamento excessivo para ambientes virtuais de aprendizagem.",
        "Ocorre uma quebra na coerência didática, pois o método de avaliação escolhido não mensura a capacidade prática descrita no objetivo de aprendizagem.",
        "A inteligência artificial utilizou uma linguagem excessivamente técnica para o perfil de alunos adultos iniciantes.",
        "O modelo de avaliação teórica impede a inserção de gráficos visuais na plataforma de hospedagem do curso.",
      ],
      correctOptionIndex: 1,
      feedback: {
        correct:
          "Excelente análise! O alinhamento pedagógico exige que a avaliação meça exatamente a competência proposta no objetivo. Se o objetivo foca na construção prática de algoritmos, a verificação do aprendizado deve exigir a resolução de um problema de programação em vez de focar na memorização de dados históricos.",
        near: {
          optionIndex: 2,
          message:
            "Atenção a um detalhe sutil. A adequação da linguagem dialoga com o perfil do público, o que é realmente importante. A falha central relatada no enunciado, contudo, reside na incompatibilidade entre a habilidade exigida no objetivo (prática de código) e o instrumento de medida selecionado (prova teórica).",
        },
        far: "Incorreto. As limitações tecnológicas de tempo de tela ou de inserção de gráficos não são a raiz do problema neste cenário. Recomenda-se a revisão atenta do conceito fundamental de Alinhamento Construtivo.",
      },
    },
    {
      id: "q2",
      type: "text",
      prompt:
        "Para obter uma proposta de plano de aula rica em detalhes pedagógicos e adequada ao ensino a distância, o educador deve estruturar o seu comando utilizando quatro pilares fundamentais.\n\nAssinale a alternativa que apresenta a aplicação correta da fórmula de comando estruturado.",
      options: [
        'Crie uma aula completa sobre linguagem de programação para alunos de cursos virtuais.',
        'Aja como um designer instrucional especialista em Computação. Crie um plano de aula assíncrono sobre estruturas condicionais para adultos iniciantes. Defina os objetivos, o roteiro de estudo, uma atividade prática e a avaliação formativa.',
        'Explique o conceito de algoritmo e gere dez exercícios teóricos com gabarito para envio por correio eletrônico.',
        'Pesquise na internet os melhores cursos de programação e faça um resumo dos tópicos mais buscados pelos estudantes.',
      ],
      correctOptionIndex: 1,
      feedback: {
        correct:
          "Perfeito! Esta alternativa contempla de forma precisa os quatro pilares do comando pedagógico: o Papel assumido pelo assistente, o Contexto do público e da modalidade, a Tarefa detalhada a ser executada e o Formato esperado para a resposta final.",
        near: {
          optionIndex: 2,
          message:
            "Quase lá! O comando escolhido por você apresenta a Tarefa e o Formato. Faltam, no entanto, os pilares de Papel e Contexto, requisitos essenciais para que a inteligência artificial não gere um material raso ou desconectado da realidade do seu aluno.",
        },
        far: "Incorreto. Estes comandos são totalmente vagos ou delegam funções inadequadas à máquina. Vale revisar a arquitetura necessária na hora de solicitar materiais educacionais a um assistente de IA.",
      },
    },
    {
      id: "q3",
      type: "text",
      prompt:
        "Ao analisar a proposta de atividade prática gerada pela inteligência artificial para um curso assíncrono, o professor notou que o sistema sugeriu um debate em grupo ao vivo com duração de duas horas, exigindo a instalação de um software pesado compatível apenas com computadores de alto desempenho. O público do curso é composto por adultos que estudam em horários flexíveis, utilizando predominantemente dispositivos móveis.\n\nQual deve ser a conduta do educador nesta etapa de auditoria do material?",
      options: [
        "Aceitar a proposta da máquina sem alterações, pois a inteligência artificial possui dados atualizados sobre as tendências de educação.",
        "Cancelar a oferta do curso no ambiente virtual por incompatibilidade técnica dos estudantes com as ferramentas exigidas.",
        "Enviar um novo comando para o assistente solicitando a substituição da dinâmica por um exercício assíncrono e leve, compatível com acesso via smartphones.",
        "Modificar o perfil do público-alvo no projeto pedagógico para exigir que os alunos comprem computadores avançados antes de iniciarem o estudo.",
      ],
      correctOptionIndex: 2,
      feedback: {
        correct:
          "Exatamente! A curadoria humana é indispensável. O educador deve identificar as barreiras tecnológicas e de rotina do público-alvo, orientando o assistente virtual a ajustar as atividades para o contexto real de acesso dos estudantes.",
        near: {
          optionIndex: 0,
          message:
            "Cuidado com a delegação total de responsabilidade. Embora a ferramenta possua um vasto banco de dados sobre educação, ela desconhece a realidade socioeconômica e tecnológica específica dos seus alunos. A validação humana continua sendo um critério obrigatório.",
        },
        far: "Incorreto. Punir o aluno, cancelar o projeto ou exigir investimentos financeiros inviáveis foge completamente da empatia didática. O papel do professor é adequar o conteúdo à realidade do cursista, não eliminá-lo.",
      },
    },
    {
      id: "q4",
      type: "text",
      prompt:
        "A utilização de assistentes virtuais de inteligência artificial no planejamento de experiências de aprendizagem a distância oferece agilidade na organização de conteúdos e na geração de ideias primárias.\n\nDiante dessa premissa, como deve ser definida a relação entre a ferramenta tecnológica e o trabalho do educador?",
      options: [
        "O assistente virtual atua como um co-piloto de redação e estruturação, cabendo ao educador a validação metodológica, a empatia com o aluno e a responsabilidade final pelo projeto.",
        "A ferramenta de inteligência artificial substitui integralmente a figura do designer instrucional, dispensando a necessidade de revisão humana antes da publicação do curso.",
        "O uso da inteligência artificial restringe-se à correção ortográfica e gramatical de textos pré-existentes, sendo incapaz de auxiliar na estruturação de planos de aula originais.",
        "A tecnologia deve ser utilizada para gerar e corrigir avaliações somativas automatizadas, eliminando a interferência do professor na escolha dos critérios de nota.",
      ],
      correctOptionIndex: 0,
      feedback: {
        correct:
          "Excelente visão! A tecnologia atua como uma aliada para otimizar etapas operacionais do planejamento. A sensibilidade social, a validação técnica dos conteúdos, a empatia com as dificuldades dos alunos e o rigor didático permanecem como atribuições exclusivas do profissional da educação.",
        near: {
          optionIndex: 2,
          message:
            "Você subestimou o potencial da ferramenta. A inteligência artificial possui excelente capacidade de organização estrutural e ideação primária, operando de forma muito mais ampla do que um simples corretor gramatical. O limite da máquina reside na etapa de validação, a qual pertence ao educador.",
        },
        far: "Incorreto. Delegar integralmente o projeto instrucional ou a avaliação final para a máquina anula a figura do educador e coloca o aprendizado em risco. O profissional da educação segue sendo o curador metodológico indispensável.",
      },
    },
  ],
};
