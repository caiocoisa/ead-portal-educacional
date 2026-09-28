import {
  Accessibility,
  Clapperboard,
  ChartColumn,
  ClipboardList,
  GraduationCap,
  Map,
  MessageSquare,
  Presentation,
  Puzzle,
  Search,
  Smartphone,
  Timer,
  Unlock,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface LandingItem {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export const courseObjectives: string[] = [
  "Compreender como articular público, objetivos, conteúdos, atividades e avaliação em um planejamento de EaD.",
  "Reconhecer a importância do alinhamento pedagógico entre o que se ensina e o que se avalia.",
  "Aprender a estruturar comandos (prompts) eficientes para um assistente de IA.",
  "Desenvolver um olhar crítico para analisar e melhorar as sugestões geradas pela IA.",
];

export const targetAudience: LandingItem[] = [
  {
    icon: Presentation,
    title: "Professores e educadores",
    description: "Que atuam ou desejam atuar em cursos a distância.",
  },
  {
    icon: GraduationCap,
    title: "Licenciandos e estudantes de Pedagogia",
    description: "Em formação e interessados em planejamento didático.",
  },
  {
    icon: Puzzle,
    title: "Designers instrucionais e tutores",
    description: "Que buscam ganhar agilidade no desenho de aulas com IA.",
  },
];

export const prerequisites: string[] = [
  "Não é necessária experiência prévia com ferramentas de IA.",
  "Noções básicas de navegação na internet.",
  "Computador, tablet ou celular com acesso à internet e a vídeos do YouTube.",
  "Interesse em planejar aulas ou cursos a distância.",
];

export const learningOutcomes: LandingItem[] = [
  {
    icon: Map,
    title: "Planejar uma aula a distância",
    description: "Definindo público, objetivos, conteúdos, atividades e avaliação de forma coerente.",
  },
  {
    icon: MessageSquare,
    title: "Pedir bem à IA",
    description: "Usando os quatro pilares do comando: papel, contexto, tarefa e formato.",
  },
  {
    icon: Search,
    title: "Analisar respostas da IA",
    description: "Identificando falhas de alinhamento e barreiras de acesso do seu público.",
  },
  {
    icon: Wrench,
    title: "Melhorar o material gerado",
    description: "Refinando os comandos e assumindo a curadoria pedagógica final.",
  },
];

export const journeySteps: LandingItem[] = [
  {
    icon: Clapperboard,
    title: "1. Vídeo",
    description: "Assista à aula sobre planejamento pedagógico com apoio de IA.",
  },
  {
    icon: ClipboardList,
    title: "2. Avaliação",
    description: "Responda a questões que simulam situações reais de planejamento.",
  },
  {
    icon: ChartColumn,
    title: "3. Relatório final",
    description: "Veja seu resultado, acertos e pontos de atenção.",
  },
];

export const courseFormat: LandingItem[] = [
  { icon: Timer, title: "Ritmo livre", description: "Estude quando quiser; seu progresso fica salvo neste navegador." },
  { icon: Smartphone, title: "Acesso em qualquer dispositivo", description: "Interface adaptável a celular, tablet e computador." },
  { icon: Accessibility, title: "Acessível", description: "Ajuste tema, tamanho da fonte e alto contraste." },
  { icon: Unlock, title: "Sem cadastro", description: "Basta informar seu nome para começar, sem senha." },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Preciso saber usar inteligência artificial antes de começar?",
    answer:
      "Não. O módulo parte do zero e mostra, com exemplos, como pedir, analisar e melhorar sugestões de um assistente de IA.",
  },
  {
    question: "Quanto tempo leva o módulo?",
    answer:
      "Você segue no seu ritmo: assiste ao vídeo, responde à avaliação e recebe o relatório. Pode pausar e retomar de onde parou.",
  },
  {
    question: "Meu progresso é salvo?",
    answer:
      "Sim. Ele é guardado neste navegador; ao voltar ao portal, você continua da etapa em que parou.",
  },
  {
    question: "Posso pular etapas?",
    answer:
      "Não. A jornada é linear: cada etapa libera a seguinte, para que o aprendizado seja construído passo a passo.",
  },
  {
    question: "O exemplo é só para quem ensina Computação?",
    answer:
      "Não. A aula de Computação é apenas um exemplo prático; os princípios de planejamento e o uso da IA valem para qualquer área.",
  },
];
