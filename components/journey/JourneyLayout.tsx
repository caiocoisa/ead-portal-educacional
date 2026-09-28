import type { ReactNode } from "react";
import type { JourneyStep } from "@/types/progress";
import { Avatar } from "@heroui/react";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";
import { HomeResetButton } from "./HomeResetButton";
import { ProgressIndicator } from "./ProgressIndicator";

interface JourneyLayoutProps {
  userName: string;
  step: JourneyStep;
  children: ReactNode;
}

/**
 * Ocupa exatamente a altura da tela (`dvh`): o cabeçalho é compacto e só a
 * área de conteúdo rola, quando necessário, dentro de `main`.
 */
export function JourneyLayout({ userName, step, children }: JourneyLayoutProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-(--border) bg-(--surface) px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2">
          <Avatar size="sm" color="accent" variant="soft">
            <Avatar.Fallback>{userName.trim().charAt(0).toUpperCase()}</Avatar.Fallback>
          </Avatar>
          <span className="font-semibold">Olá, {userName}!</span>
        </div>
        <ProgressIndicator step={step} />
        <HomeResetButton />
      </header>
      <AccessibilityControls />
      <main className="flex min-h-0 flex-1 justify-center p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
