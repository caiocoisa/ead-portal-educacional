import type { ChatMessage } from "@/types/quiz";

interface ChatSimulationBubblesProps {
  messages: ChatMessage[];
}

export function ChatSimulationBubbles({ messages }: ChatSimulationBubblesProps) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        return (
          <div
            key={index}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                isUser
                  ? "bg-zinc-900 text-zinc-50"
                  : "bg-zinc-100 text-zinc-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
