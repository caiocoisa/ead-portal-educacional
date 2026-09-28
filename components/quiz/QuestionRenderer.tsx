import { Chip } from "@heroui/react";
import type { ChatMessage, Question } from "@/types/quiz";
import { ChatSimulationBubbles } from "./ChatSimulationBubbles";
import { OptionsRadioGroup } from "./OptionsRadioGroup";

interface QuestionRendererProps {
  question: Question;
  index: number;
  total: number;
  selectedOptionIndex: number | null;
  onSelect: (optionIndex: number) => void;
  isDisabled?: boolean;
}

export function QuestionRenderer({
  question,
  index,
  total,
  selectedOptionIndex,
  onSelect,
  isDisabled,
}: QuestionRendererProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Chip color="accent" variant="soft" size="sm">
          <Chip.Label>
            Pergunta {index + 1} de {total}
          </Chip.Label>
        </Chip>
      </div>
      {question.type === "text" ? (
        <p className="whitespace-pre-line">{question.prompt as string}</p>
      ) : (
        <ChatSimulationBubbles messages={question.prompt as ChatMessage[]} />
      )}
      <OptionsRadioGroup
        options={question.options}
        value={selectedOptionIndex}
        onChange={onSelect}
        ariaLabel={`Alternativas da pergunta ${index + 1}`}
        isDisabled={isDisabled}
      />
    </div>
  );
}
