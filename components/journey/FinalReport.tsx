import { Card } from "@heroui/react";
import type { AssessmentResult } from "@/types/quiz";
import { moduleContent } from "@/content/module";
import { resolveFeedback } from "@/lib/quiz/resolveFeedback";
import { AnswerFeedback } from "@/components/quiz/AnswerFeedback";
import { RestartJourneyModal } from "./RestartJourneyModal";

interface FinalReportProps {
  assessmentResult: AssessmentResult;
}

export function FinalReport({ assessmentResult }: FinalReportProps) {
  const { correctCount, totalCount } = assessmentResult;

  return (
    <Card className="w-full max-w-lg">
      <Card.Header>
        <Card.Title>Relatório final</Card.Title>
        <Card.Description>Jornada concluída!</Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <p className="text-lg">
          Você acertou <strong>{correctCount}</strong> de{" "}
          <strong>{totalCount}</strong> perguntas.
        </p>
        <div className="flex flex-col gap-4">
          {assessmentResult.answers.map((answer, index) => {
            const question = moduleContent.questions.find(
              (q) => q.id === answer.questionId
            );
            if (!question) return null;
            const feedback = resolveFeedback(question, answer.selectedOptionIndex);
            return (
              <div key={answer.questionId} className="flex flex-col gap-2">
                <span className="text-sm font-medium">Pergunta {index + 1}</span>
                <AnswerFeedback level={feedback.level} message={feedback.message} />
              </div>
            );
          })}
        </div>
        <RestartJourneyModal />
      </Card.Content>
    </Card>
  );
}
