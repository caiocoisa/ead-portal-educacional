import { ClipboardCheck, Hammer, Target, Users, type LucideIcon } from "lucide-react";

/** Conteúdo do mapa interativo "Mapa do alinhamento" (roteiro em `conteudo/mapa/roteiro.md`). */

export type MapNodeId = "publico" | "objetivos" | "atividades" | "avaliacao";

export interface MapNode {
  id: MapNodeId;
  title: string;
  /** Pergunta curta que o elemento responde; aparece no nó. */
  question: string;
  icon: LucideIcon;
  /**
   * Ilustração do nó (arquivo em `public/img/mapa/`). Enquanto não existir, o nó
   * mostra o ícone; ao gerar a imagem, basta informar `image`. A imagem é
   * decorativa (o botão já tem o texto do elemento), então o `alt` fica vazio.
   */
  image?: string;
  concept: string;
  example: string;
  aiFailure: string;
  auditQuestion: string;
  adjustPrompt: string;
  /** Centro do nó no diagrama, em % da largura e da altura. */
  position: { x: number; y: number };
}

export interface MapEdge {
  from: MapNodeId;
  to: MapNodeId;
  label: string;
}

export const mapTitle = "Mapa do alinhamento";

export const mapIntro =
  "Explore os quatro elementos de um planejamento e veja, em cada um, a falha típica que a IA comete. O exemplo é um curso a distância de horta em casa, para adultos que moram em apartamento e estudam pelo celular à noite.";

export const mapNodes: MapNode[] = [
  {
    id: "publico",
    title: "Público",
    question: "Para quem é o curso?",
    icon: Users,
    concept:
      "O público é quem vai estudar: o tempo que tem, o aparelho que usa, o que já sabe e o espaço em que vive. Todo o resto do plano precisa caber nessa realidade.",
    example:
      "Adultos que moram em apartamento, sem experiência com plantas, que estudam pelo celular à noite e têm só uma varanda pequena.",
    aiFailure:
      "A IA assume um público genérico (“os alunos”) e sugere um canteiro no quintal ou ferramentas de jardinagem que essas pessoas não têm.",
    auditQuestion:
      "O plano funciona para quem tem esse tempo, esse aparelho e esse espaço?",
    adjustPrompt:
      "O público mora em apartamento e tem apenas uma varanda de 1 m². Refaça o plano com vasos e materiais baratos.",
    position: { x: 14, y: 50 },
  },
  {
    id: "objetivos",
    title: "Objetivos",
    question: "O que a pessoa fará ao final?",
    icon: Target,
    concept:
      "O objetivo diz o que a pessoa será capaz de fazer ao final, com um verbo que dá para observar (montar, comparar, explicar). É ele que orienta o que treinar e o que medir.",
    example:
      "Ao final, a pessoa monta uma horta de ervas em vasos na varanda e a mantém por quatro semanas.",
    aiFailure:
      "A IA escreve objetivos vagos (“compreender a importância das plantas”) ou longos demais, sem nada que se possa ver a pessoa fazendo.",
    auditQuestion: "Dá para ver a pessoa fazendo isso? Qual é o verbo?",
    adjustPrompt:
      "Reescreva o objetivo com um verbo observável: o aluno monta uma horta de ervas em vasos e a mantém por quatro semanas.",
    position: { x: 44, y: 50 },
  },
  {
    id: "atividades",
    title: "Atividades",
    question: "O que a pessoa faz para aprender?",
    icon: Hammer,
    concept:
      "As atividades são o que a pessoa faz para aprender. Para chegar ao objetivo, elas precisam treinar o mesmo verbo, e não só informar sobre o assunto.",
    example:
      "Montar um vaso com terra e mudas, passo a passo, e fotografar cada etapa com o celular, no horário que preferir.",
    aiFailure:
      "A IA propõe assistir a aulas e ler textos sobre jardinagem: a pessoa aprende sobre o assunto, mas nunca pratica montar.",
    auditQuestion: "A atividade faz a pessoa praticar o verbo do objetivo?",
    adjustPrompt:
      "Troque a leitura por uma atividade em que o aluno monta um vaso e fotografa cada etapa com o celular.",
    position: { x: 80, y: 22 },
  },
  {
    id: "avaliacao",
    title: "Avaliação",
    question: "Como conferir que aprendeu?",
    icon: ClipboardCheck,
    concept:
      "A avaliação confere se o objetivo foi alcançado. Ela precisa medir o mesmo verbo do objetivo, e não outra coisa que seja só mais fácil de corrigir.",
    example:
      "Enviar a foto da horta montada e conferir uma lista de cinco itens: vaso com furo, terra, luz, rega e espaçamento.",
    aiFailure:
      "A IA sugere uma prova de múltipla escolha sobre o nome das ervas: mede memória, e não a capacidade de montar.",
    auditQuestion:
      "A avaliação mede o verbo do objetivo? Alguém que só decorou conseguiria passar?",
    adjustPrompt:
      "Substitua a prova por uma avaliação em que o aluno envia a foto da horta e confere uma lista de cinco itens.",
    position: { x: 80, y: 78 },
  },
];

export const mapEdges: MapEdge[] = [
  { from: "publico", to: "objetivos", label: "define o que é realista aprender" },
  { from: "objetivos", to: "atividades", label: "define o que treinar" },
  { from: "objetivos", to: "avaliacao", label: "define o que medir" },
  { from: "atividades", to: "avaliacao", label: "treinar o que será medido" },
];

export const mapClosing =
  "Alinhar é fazer os quatro elementos contarem a mesma história. A IA escreve cada um deles muito bem, mas não percebe quando um aponta para outro lugar: essa auditoria é sua.";
