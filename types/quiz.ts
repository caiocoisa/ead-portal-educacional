export type QuestionType = "text" | "chat_simulation";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  /** Enunciado (type "text") ou turnos de conversa (type "chat_simulation"). */
  prompt: string | ChatMessage[];
  options: string[];
  correctOptionIndex: number;
}

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
