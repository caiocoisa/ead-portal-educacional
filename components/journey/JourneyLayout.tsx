import type { ReactNode } from "react";
import Link from "next/link";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";
import { HomeResetButton } from "./HomeResetButton";
import { TrailNav } from "./TrailNav";

interface JourneyLayoutProps {
  children: ReactNode;
}

/**
 * Ocupa exatamente a altura da tela (`dvh`): o cabeçalho é compacto e só a
 * área de conteúdo rola, quando necessário, dentro de `main`.
 */
export function JourneyLayout({ children }: JourneyLayoutProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-4 border-(--gold) bg-(--brand) px-4 py-2 text-white sm:px-6">
        <Link
          href="/"
          className="font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Planejamento Pedagógico para EaD
        </Link>
        <TrailNav />
        <HomeResetButton tone="onDark" />
      </header>
      <AccessibilityControls />
      <main className="flex min-h-0 flex-1 justify-center p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
