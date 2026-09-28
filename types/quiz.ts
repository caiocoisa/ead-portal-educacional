export type QuestionType = "text" | "chat_simulation";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Retorno pedagógico exibido imediatamente após a confirmação da resposta,
 * categorizado por proximidade da alternativa escolhida em relação à
 * correta (ver banco-questoes.md).
 */
export interface QuestionFeedback {
  /** Exibido quando a alternativa correta é escolhida. */
  correct: string;
  /** Exibido para uma única alternativa considerada "erro próximo". */
  near: { optionIndex: number; message: string };
  /** Exibido para as demais alternativas incorretas ("erro distante"). */
  far: string;
}

export interface Question {
  id: string;
  /** Competência avaliada, usada no relatório final. */
  topic: string;
  type: QuestionType;
  /** Enunciado (type "text") ou turnos de conversa (type "chat_simulation"). */
  prompt: string | ChatMessage[];
  options: string[];
  correctOptionIndex: number;
  feedback: QuestionFeedback;
}

export type FeedbackLevel = "correct" | "near" | "far";

export interface AnsweredQuestion {
  questionId: string;
  selectedOptionIndex: number;
  correct: boolean;
}

export interface AssessmentResult {
  answers: AnsweredQuestion[];
  correctCount: number;
  totalCount: number;
}
