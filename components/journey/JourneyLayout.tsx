import type { ReactNode } from "react";
import Link from "next/link";
import type { JourneyStep } from "@/types/progress";
import { Avatar } from "@heroui/react";
import { BookOpen, Network } from "lucide-react";
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
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-4 border-(--gold) bg-(--brand) px-4 py-2 text-white sm:px-6">
        <div className="flex items-center gap-2">
          <Avatar size="sm" className="bg-(--gold) text-(--brand)">
            <Avatar.Fallback>{userName.trim().charAt(0).toUpperCase()}</Avatar.Fallback>
          </Avatar>
          <span className="font-semibold">Olá, {userName}!</span>
        </div>
        <ProgressIndicator step={step} />
        <div className="flex items-center gap-1">
          {/* Fora da jornada: abrir o e-book ou o mapa não altera o progresso salvo. */}
          <Link
            href="/ebook"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <BookOpen aria-hidden="true" className="size-4" />
            E-book
          </Link>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Network aria-hidden="true" className="size-4" />
            Mapa
          </Link>
          <HomeResetButton />
        </div>
      </header>
      <AccessibilityControls />
      <main className="flex min-h-0 flex-1 justify-center p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
