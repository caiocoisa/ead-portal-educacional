import { Card } from "@heroui/react";
import type { AssessmentResult } from "@/types/quiz";
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
        <ul className="flex flex-col gap-1 text-sm text-zinc-600">
          {assessmentResult.answers.map((answer, index) => (
            <li key={answer.questionId}>
              Pergunta {index + 1}: {answer.correct ? "✅ correta" : "❌ incorreta"}
            </li>
          ))}
        </ul>
        <RestartJourneyModal />
      </Card.Content>
    </Card>
  );
}
