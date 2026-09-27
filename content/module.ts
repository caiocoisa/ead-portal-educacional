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
  title: "Fundamentos de Prompts para LLMs",
  description:
    "Assista ao vídeo e responda à avaliação para concluir este módulo.",
  // Vídeo do módulo ainda não definido — ver VideoSkeleton.
  youtubeVideoId: null,
  questions: [
    {
      id: "q1",
      type: "text",
      prompt:
        "O que é um 'prompt' no contexto de um chat com um modelo de linguagem (LLM)?",
      options: [
        "A resposta gerada pelo modelo",
        "A instrução ou pergunta enviada pelo usuário ao modelo",
        "Um erro de processamento do modelo",
        "O nome do modelo de linguagem utilizado",
      ],
      correctOptionIndex: 1,
    },
    {
      id: "q2",
      type: "chat_simulation",
      prompt: [
        {
          role: "user",
          content:
            "Resuma o texto abaixo em uma frase: 'O céu estava azul e o sol brilhava intensamente sobre o vale.'",
        },
        {
          role: "assistant",
          content: "O dia estava ensolarado e o céu, azul, sobre o vale.",
        },
      ],
      options: [
        "O assistente ignorou a instrução do usuário",
        "O assistente seguiu a instrução, produzindo um resumo em uma frase",
        "O assistente pediu mais informações antes de responder",
        "O assistente respondeu em um idioma diferente do solicitado",
      ],
      correctOptionIndex: 1,
    },
    {
      id: "q3",
      type: "text",
      prompt:
        "Qual das alternativas é uma boa prática ao escrever um prompt para obter uma resposta mais precisa?",
      options: [
        "Ser o mais vago possível para dar liberdade ao modelo",
        "Fornecer contexto claro e especificar o formato de resposta desejado",
        "Nunca incluir exemplos no prompt",
        "Evitar mencionar o objetivo da tarefa",
      ],
      correctOptionIndex: 1,
    },
  ],
};
