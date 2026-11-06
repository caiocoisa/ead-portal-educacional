import type { MapNodeId } from "@/content/mapa";
import type { ProgressSnapshot } from "@/types/progress";
import type { AssessmentResult } from "@/types/quiz";

/**
 * Progresso do aluno no fluxo livre (modelo v2). Todo método devolve a visão completa
 * já atualizada, e `get` nunca devolve nulo: sem nada salvo, é a visão vazia.
 */
export interface ProgressRepository {
  get(): ProgressSnapshot;
  /** Registra uma página do e-book (de 1 a 18); valores inválidos são ignorados. */
  markEbookPage(page: number): ProgressSnapshot;
  /** Registra um elemento do mapa como visto; repetições e ids desconhecidos são ignorados. */
  markMapElement(id: MapNodeId): ProgressSnapshot;
  /** Guarda a alternativa confirmada de uma pergunta, para retomar depois de recarregar. */
  saveAnswer(questionId: string, optionIndex: number): ProgressSnapshot;
  saveAssessmentResult(result: AssessmentResult): ProgressSnapshot;
  /** Refaz só a avaliação: apaga as respostas e o resultado e preserva o resto. */
  resetAssessment(): ProgressSnapshot;
  /** O relatório conta como visto ao abrir; guarda só a primeira abertura. */
  markReportOpened(): ProgressSnapshot;
  /** O percentual nunca diminui; a posição guarda o ponto mais recente para retomar. */
  setVideoProgress(percent: number, positionSeconds: number): ProgressSnapshot;
  /** Apaga todo o progresso, inclusive as páginas do e-book. */
  clearAll(): void;
}
