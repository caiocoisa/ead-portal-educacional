"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChartColumn,
  ClipboardList,
  Clapperboard,
  Network,
  type LucideIcon,
} from "lucide-react";
import type { TrailItemId, TrailStatus } from "@/lib/journey/trail";
import { useTrail } from "@/lib/journey/useTrail";

const ICONS: Record<TrailItemId, LucideIcon> = {
  video: Clapperboard,
  ebook: BookOpen,
  mapa: Network,
  avaliacao: ClipboardList,
  relatorio: ChartColumn,
};

/** O estado também é dito em texto: a cor sozinha não basta (WCAG 1.4.1). */
const STATUS_TEXT: Record<TrailStatus, string> = {
  soon: "em breve, ainda não disponível",
  todo: "não iniciado",
  doing: "em andamento",
  done: "concluído",
};

const CELL =
  "flex h-full flex-col items-center justify-center gap-0.5 border-t-[3px] text-xs font-bold focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-(--focus)";

/**
 * Barra fixa na parte de baixo, só no celular (abaixo de 768 px): os cinco itens da trilha sempre à
 * mão, com alvos de toque de 64 px de altura. Não há menu para abrir.
 */
export function TrailBottomBar() {
  const trail = useTrail();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Trilha do curso"
      className="panel-bottom grid h-16 shrink-0 grid-cols-5 md:hidden"
    >
      {trail.items.map((item) => {
        const Icon = ICONS[item.id];
        const isCurrent = pathname === item.href;
        if (!item.available) {
          return (
            <button
              key={item.id}
              type="button"
              disabled
              className={`${CELL} cursor-not-allowed border-transparent text-(--muted)`}
            >
              <Icon aria-hidden="true" className="size-[22px]" />
              {item.shortLabel}
              <span className="sr-only">{STATUS_TEXT[item.status]}</span>
            </button>
          );
        }
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isCurrent ? "page" : undefined}
            className={`${CELL} ${
              isCurrent
                ? "border-(--gold) bg-(--surface-secondary) bg-(image:--grad-highlight) text-(--foreground)"
                : item.status === "done"
                  ? "border-transparent text-(--success)"
                  : "border-transparent text-(--foreground)"
            }`}
          >
            <Icon aria-hidden="true" className="size-[22px]" />
            {item.shortLabel}
            <span className="sr-only">{`${item.percent}%, ${STATUS_TEXT[item.status]}`}</span>
          </Link>
        );
      })}
    </nav>
  );
}
