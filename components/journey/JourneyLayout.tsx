import type { ReactNode } from "react";
import type { JourneyStep } from "@/types/progress";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";
import { HomeResetButton } from "./HomeResetButton";
import { ProgressIndicator } from "./ProgressIndicator";

interface JourneyLayoutProps {
  userName: string;
  step: JourneyStep;
  children: ReactNode;
}

export function JourneyLayout({ userName, step, children }: JourneyLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-6">
      <header className="flex w-full max-w-2xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold">Olá, {userName}!</span>
          <HomeResetButton />
        </div>
        <AccessibilityControls />
        <ProgressIndicator step={step} />
      </header>
      <main className="flex w-full flex-1 items-start justify-center">
        {children}
      </main>
    </div>
  );
}
