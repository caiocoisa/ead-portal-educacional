"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrailNav, TrailPercent } from "@/components/journey/TrailNav";

/**
 * Cabeçalho único do portal (variante A): marca, trilha com o percentual de cada item e o
 * progresso geral. Fica no layout compartilhado, então não é remontado ao navegar.
 *
 * Em telas largas tudo cabe em uma linha; abaixo de 1280 px (e com fonte ampliada) a trilha
 * desce para uma segunda linha, em vez de esconder itens. No celular (abaixo de 768 px) o
 * cabeçalho fica só com a marca e o progresso, porque a trilha vai para a barra inferior.
 */
export function PortalHeader() {
  const pathname = usePathname();

  return (
    <header className="flex min-h-12 shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b-4 border-(--gold) bg-(--brand) px-4 py-1.5 text-white sm:px-5 md:min-h-14 md:py-2">
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className="flex items-center gap-2.5 rounded-sm text-[0.9375rem] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <rect width="64" height="64" rx="14" fill="#c9a227" />
          <path
            d="M32 22c-4.5-3.2-11-4.2-18-3v26c7-1.2 13.5-.2 18 3 4.5-3.2 11-4.2 18-3V19c-7-1.2-13.5-.2-18 3z"
            fill="#0b2545"
          />
          <path d="M32 22v26" stroke="#c9a227" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <span className="hidden md:inline">Planejamento Pedagógico para EaD</span>
        <span className="md:hidden">Planejamento para EaD</span>
      </Link>
      <div className="order-3 hidden min-w-0 basis-full justify-center md:flex xl:order-2 xl:flex-1 xl:basis-auto">
        <TrailNav />
      </div>
      <div className="order-2 ml-auto xl:order-3">
        <TrailPercent />
      </div>
    </header>
  );
}
