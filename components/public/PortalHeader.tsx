"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrailNav, TrailPercent } from "@/components/journey/TrailNav";

/**
 * Cabeçalho único do portal (variante A): marca, trilha com o percentual de cada item e o
 * progresso geral. Fica no layout compartilhado, então não é remontado ao navegar.
 *
 * Em telas largas tudo cabe em uma linha; abaixo de 1280 px (e com fonte ampliada) a trilha
 * desce para uma segunda linha, em vez de esconder itens.
 */
export function PortalHeader() {
  const pathname = usePathname();

  return (
    <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b-4 border-(--gold) bg-(--brand) px-4 py-2 text-white sm:px-5">
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
        Planejamento Pedagógico para EaD
      </Link>
      <div className="order-3 flex min-w-0 basis-full justify-center xl:order-2 xl:flex-1 xl:basis-auto">
        <TrailNav />
      </div>
      <div className="order-2 ml-auto xl:order-3">
        <TrailPercent />
      </div>
    </header>
  );
}
