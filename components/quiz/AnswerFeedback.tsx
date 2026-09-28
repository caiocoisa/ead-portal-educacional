import { Alert } from "@heroui/react";
import type { FeedbackLevel } from "@/types/quiz";

const LEVEL_CONFIG: Record<
  FeedbackLevel,
  { status: "success" | "warning" | "danger"; title: string }
> = {
  correct: { status: "success", title: "Resposta correta" },
  near: { status: "warning", title: "Quase lá" },
  far: { status: "danger", title: "Vamos revisar" },
};

interface AnswerFeedbackProps {
  level: FeedbackLevel;
  message: string;
}

export function AnswerFeedback({ level, message }: AnswerFeedbackProps) {
  const config = LEVEL_CONFIG[level];
  return (
    <Alert status={config.status}>
      <Alert.Content>
        <Alert.Title>{config.title}</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
