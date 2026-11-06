import Link from "next/link";
import { ArrowLeft, BookImage, BookOpen, Network } from "lucide-react";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";

export type PortalPage = "home" | "ebook" | "mapa" | "quadrinho";

interface PortalHeaderProps {
  /** Página em que o cabeçalho está; destaca o item do menu e decide se oferece "Voltar ao curso". */
  current?: PortalPage;
}

const LINK_BASE =
  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const LINK_IDLE = `${LINK_BASE} border-white/60 text-white hover:bg-white/10`;
const LINK_ACTIVE = `${LINK_BASE} border-white bg-white font-semibold text-(--brand)`;

const MATERIALS = [
  { page: "ebook", href: "/ebook", label: "E-book", icon: BookOpen },
  { page: "mapa", href: "/mapa", label: "Mapa interativo", icon: Network },
  { page: "quadrinho", href: "/quadrinho", label: "Quadrinho", icon: BookImage },
] as const;

export function PortalHeader({ current = "home" }: PortalHeaderProps) {
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
      <nav aria-label="Materiais e navegação do portal" className="flex flex-wrap items-center gap-2">
        {current !== "home" ? (
          <Link href="/" className={LINK_IDLE}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Voltar ao curso
          </Link>
        ) : null}
        {MATERIALS.map(({ page, href, label, icon: Icon }) => (
          <Link
            key={page}
            href={href}
            aria-current={current === page ? "page" : undefined}
            className={current === page ? LINK_ACTIVE : LINK_IDLE}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
      <AccessibilityControls />
    </header>
  );
}
