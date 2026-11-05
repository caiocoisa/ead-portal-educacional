import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";

interface PortalHeaderProps {
  /** `home` oferece o e-book; `ebook` oferece a volta ao curso. */
  variant?: "home" | "ebook";
}

const LINK_CLASS =
  "inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function PortalHeader({ variant = "home" }: PortalHeaderProps) {
  return (
    <header className="flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-b-4 border-(--gold) bg-(--brand) px-6 py-3 text-white">
      <div className="flex flex-col">
        <span className="text-lg font-semibold">
          Planejamento Pedagógico para EaD com Apoio de IA
        </span>
        <span className="hidden text-sm text-white/80 sm:inline">
          Planeje aulas a distância com a ajuda de um assistente de IA
        </span>
      </div>
      <nav aria-label="Navegação do portal">
        {variant === "ebook" ? (
          <Link href="/" className={LINK_CLASS}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Voltar ao curso
          </Link>
        ) : (
          <Link href="/ebook" className={LINK_CLASS}>
            <BookOpen aria-hidden="true" className="size-4" />
            E-book (edição preliminar)
          </Link>
        )}
      </nav>
      <AccessibilityControls />
    </header>
  );
}
