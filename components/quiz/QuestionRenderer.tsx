import { Card } from "@heroui/react";
import type { ChatMessage, Question } from "@/types/quiz";
import { ChatSimulationBubbles } from "./ChatSimulationBubbles";
import { OptionsRadioGroup } from "./OptionsRadioGroup";

interface QuestionRendererProps {
  question: Question;
  index: number;
  selectedOptionIndex: number | null;
  onSelect: (optionIndex: number) => void;
}

export function QuestionRenderer({
  question,
  index,
  selectedOptionIndex,
  onSelect,
}: QuestionRendererProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Pergunta {index + 1}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        {question.type === "text" ? (
          <p>{question.prompt as string}</p>
        ) : (
          <ChatSimulationBubbles messages={question.prompt as ChatMessage[]} />
        )}
        <OptionsRadioGroup
          options={question.options}
          value={selectedOptionIndex}
          onChange={onSelect}
          ariaLabel={`Alternativas da pergunta ${index + 1}`}
        />
      </Card.Content>
    </Card>
  );
}
