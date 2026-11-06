/** Conteúdo do quadrinho "Duas sugestões da IA" (roteiro em `conteudo/quadrinho/roteiro.md`). */

export type BalloonPosition = "top-right" | "top-left" | "right";

export interface ComicBalloon {
  text: string;
  position: BalloonPosition;
}

/** Quadro de texto fora da imagem: narração, comando da Marina ou sugestão da IA. */
export interface ComicBox {
  label: string;
  text: string;
  tone: "narrator" | "command" | "ai";
}

export interface ComicOption {
  text: string;
  correct: boolean;
  feedback: string;
}

/** Bifurcação em que o leitor escolhe; só se avança com a opção certa (pode tentar de novo). */
export interface ComicDecision {
  question: string;
  options: ComicOption[];
}

export interface ComicPanel {
  id: string;
  type: "narrativo" | "decisao" | "descritivo";
  /** Arquivo em `public/img/quadrinho/`. As imagens não levam texto (decisão D6). */
  image: string;
  imageAlt: string;
  balloon: ComicBalloon;
  boxes: ComicBox[];
  decision?: ComicDecision;
  /** Aprofundamento opcional: sem ele, a história continua completa. */
  deepDive?: { title: string; text: string };
}

export const comicTitle = "Quadrinho: duas sugestões da IA";

export const comicIntro =
  "Acompanhe a professora Marina auditando duas sugestões da IA para uma semana de um curso de fotografia com o celular. Em dois momentos, é você quem decide.";

export const comicPanels: ComicPanel[] = [
  {
    id: "p1",
    type: "narrativo",
    image: "/img/quadrinho/cena-01.webp",
    imageAlt: "Marina, sorrindo, trabalha ao notebook em sua mesa, em um escritório claro.",
    balloon: {
      text: "Semana 3 do meu curso de fotografia. Hoje a IA me ajuda a planejar.",
      position: "top-right",
    },
    boxes: [
      {
        label: "Narração",
        tone: "narrator",
        text: "Curso a distância de fotografia com o celular, para adultos iniciantes que estudam à noite, no próprio horário. Objetivo da semana: tirar um retrato bem iluminado.",
      },
    ],
  },
  {
    id: "p2",
    type: "narrativo",
    image: "/img/quadrinho/cena-02.webp",
    imageAlt: "Marina, sorrindo com confiança, digita no notebook e levanta a mão aberta, explicando.",
    balloon: {
      text: "Vou pedir com os quatro pilares: papel, contexto, tarefa e formato.",
      position: "top-right",
    },
    boxes: [
      {
        label: "O comando da Marina",
        tone: "command",
        text: "Aja como designer instrucional especialista em fotografia. O curso é a distância, para adultos iniciantes que estudam à noite pelo celular. Planeje a atividade e a avaliação da semana do retrato com luz natural. Entregue em uma tabela.",
      },
    ],
  },
  {
    id: "p3",
    type: "narrativo",
    image: "/img/quadrinho/cena-03.webp",
    imageAlt:
      "Marina, de perfil, olha preocupada para a tela do notebook, cheia de rabiscos sem sentido.",
    balloon: { text: "Hum… isso não parece certo.", position: "top-left" },
    boxes: [
      {
        label: "Sugestão A da IA",
        tone: "ai",
        text: "Atividade: oficina ao vivo toda quarta, com 2 horas de duração, usando câmera profissional e luz de estúdio. Avaliação: enviar o retrato editado em um programa de computador.",
      },
    ],
  },
  {
    id: "p4",
    type: "decisao",
    image: "/img/quadrinho/cena-04.webp",
    imageAlt: "Marina, pensativa, apoia o queixo na mão e olha para o notebook.",
    balloon: { text: "Antes de aceitar, vou olhar com as lentes.", position: "right" },
    boxes: [
      {
        label: "Narração",
        tone: "narrator",
        text: "Marina relê a sugestão A pensando nos alunos de verdade: quem são, quanto tempo têm e que aparelho usam.",
      },
    ],
    decision: {
      question: "O que Marina deve notar na sugestão A?",
      options: [
        {
          text: "O plano não combina com o objetivo da semana.",
          correct: false,
          feedback:
            "O objetivo é fotografar um retrato, e a atividade e a avaliação tratam disso. A ligação entre eles está razoável: o problema é outro.",
        },
        {
          text: "A oficina não cabe na rotina nem no aparelho dos alunos.",
          correct: true,
          feedback:
            "Isso mesmo. Eles estudam à noite, no próprio horário, pelo celular: uma oficina ao vivo de 2 horas com câmera profissional e edição no computador ignora essa realidade. É a lente da viabilidade.",
        },
        {
          text: "A tabela usa uma linguagem difícil demais.",
          correct: false,
          feedback:
            "A sugestão não tem problema de linguagem. A falha não está no texto, e sim na realidade do público.",
        },
      ],
    },
  },
  {
    id: "p5",
    type: "decisao",
    image: "/img/quadrinho/cena-05.webp",
    imageAlt: "Marina segura um celular com uma mão e levanta a outra, pedindo um ajuste.",
    balloon: { text: "Mantenho o objetivo e troco o que não cabe.", position: "top-right" },
    boxes: [
      {
        label: "O pedido de ajuste",
        tone: "command",
        text: "Mantenha o objetivo. Troque a oficina ao vivo por uma atividade que cada pessoa faça no seu horário, só com o celular e a luz da janela.",
      },
      {
        label: "Sugestão B da IA",
        tone: "ai",
        text: "Atividade: tirar três retratos perto da janela, em horários diferentes do dia, e enviar o melhor. Avaliação: lista de verificação com quatro itens (luz no rosto, foco, fundo limpo e enquadramento).",
      },
    ],
    decision: {
      question: "A sugestão B parece boa. O que Marina faz agora?",
      options: [
        {
          text: "Publica na hora: a IA já corrigiu o que ela pediu.",
          correct: false,
          feedback:
            "A IA corrigiu o que foi pedido, mas pode ter criado outro problema. A auditoria vale também para a versão ajustada.",
        },
        {
          text: "Confere de novo com as lentes e só então decide.",
          correct: true,
          feedback:
            "Isso. A sugestão B está alinhada ao objetivo (um retrato), cabe no celular e no horário dos alunos. Só depois de conferir, Marina decide publicar.",
        },
        {
          text: "Descarta a IA e escreve o plano do zero.",
          correct: false,
          feedback:
            "Não é preciso: a IA acelerou o rascunho e o ajuste funcionou. O ponto é auditar, e não abandonar a ferramenta.",
        },
      ],
    },
  },
  {
    id: "p6",
    type: "descritivo",
    image: "/img/quadrinho/cena-06.webp",
    imageAlt: "Marina, de pé diante de uma janela, com expressão serena e confiante.",
    balloon: { text: "A IA propõe. Eu confiro e decido.", position: "top-right" },
    boxes: [
      {
        label: "Narração",
        tone: "narrator",
        text: "Pedir, auditar, decidir: o ciclo se repete a cada sugestão.",
      },
    ],
    deepDive: {
      title: "Para ir além (opcional)",
      text: "Marina olhou cada sugestão com duas lentes: o alinhamento entre objetivo, atividade e avaliação, e a viabilidade para o público real. A numeração das lentes ainda será revista junto com o roteiro do vídeo.",
    },
  },
];
