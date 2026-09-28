"use client";

import { Accordion, Card, Chip, Meter, ProgressCircle, Tabs } from "@heroui/react";
import type { AssessmentResult } from "@/types/quiz";
import { moduleContent } from "@/content/module";
import { resolveFeedback } from "@/lib/quiz/resolveFeedback";
import { AnswerFeedback } from "@/components/quiz/AnswerFeedback";
import { RestartJourneyModal } from "./RestartJourneyModal";

interface FinalReportProps {
  assessmentResult: AssessmentResult;
}

function scoreColor(percent: number) {
  return percent >= 70 ? "success" : percent >= 40 ? "warning" : "danger";
}

export function FinalReport({ assessmentResult }: FinalReportProps) {
  const { correctCount, totalCount } = assessmentResult;
  const percent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const topics = assessmentResult.answers.map((answer) => {
    const question = moduleContent.questions.find((q) => q.id === answer.questionId);
    return { id: answer.questionId, topic: question?.topic ?? "", correct: answer.correct };
  });

  return (
    <Card className="h-fit max-h-full w-full max-w-2xl">
      <Card.Header className="flex flex-row items-center gap-4">
        <ProgressCircle
          value={percent}
          size="lg"
          color={scoreColor(percent)}
          aria-label={`Aproveitamento: ${percent}%`}
        >
          <ProgressCircle.Track>
            <ProgressCircle.TrackCircle />
            <ProgressCircle.FillCircle />
          </ProgressCircle.Track>
        </ProgressCircle>
        <div className="flex flex-col gap-1">
          <Card.Title>Relatório final</Card.Title>
          <Card.Description>
            Você acertou <strong>{correctCount}</strong> de{" "}
            <strong>{totalCount}</strong> perguntas ({percent}%).
          </Card.Description>
        </div>
      </Card.Header>
      <Card.Content className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Tabs>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Seções do relatório">
              <Tabs.Tab id="resumo">
                Resumo
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="gabarito">
                Gabarito comentado
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          <Tabs.Panel id="resumo" className="flex flex-col gap-4 pt-4">
            <h3 className="font-semibold">Desempenho por competência</h3>
            {topics.map((item) => (
              <Meter
                key={item.id}
                value={item.correct ? 100 : 0}
                color={item.correct ? "success" : "danger"}
                aria-label={item.topic}
              >
                <div className="flex items-center justify-between text-sm">
                  <span>{item.topic}</span>
                  <span className="text-(--muted)">
                    {item.correct ? "Dominada" : "Vale revisar"}
                  </span>
                </div>
                <Meter.Track>
                  <Meter.Fill />
                </Meter.Track>
              </Meter>
            ))}
          </Tabs.Panel>

          <Tabs.Panel id="gabarito" className="pt-4">
            <Accordion>
              {assessmentResult.answers.map((answer, index) => {
                const question = moduleContent.questions.find(
                  (q) => q.id === answer.questionId
                );
                if (!question) return null;
                const feedback = resolveFeedback(question, answer.selectedOptionIndex);
                return (
                  <Accordion.Item key={answer.questionId} id={answer.questionId}>
                    <Accordion.Heading>
                      <Accordion.Trigger>
                        <span className="flex flex-1 items-center gap-2">
                          Pergunta {index + 1}
                          <Chip
                            size="sm"
                            variant="soft"
                            color={answer.correct ? "success" : "danger"}
                          >
                            <Chip.Label>{answer.correct ? "Correta" : "Revisar"}</Chip.Label>
                          </Chip>
                        </span>
                        <Accordion.Indicator />
                      </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                      <Accordion.Body>
                        <AnswerFeedback level={feedback.level} message={feedback.message} />
                      </Accordion.Body>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Tabs.Panel>
        </Tabs>
      </Card.Content>
      <Card.Footer className="shrink-0">
        <RestartJourneyModal />
      </Card.Footer>
    </Card>
  );
}
