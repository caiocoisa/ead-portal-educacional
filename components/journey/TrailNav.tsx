"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Check,
  ChartColumn,
  ClipboardList,
  Clapperboard,
  Network,
  type LucideIcon,
} from "lucide-react";
import type { TrailItemId, TrailItemState, TrailStatus } from "@/lib/journey/trail";
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

const PILL =
  "inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-sm font-bold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function Percent({ item }: { item: TrailItemState }) {
  if (item.status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-(--success) px-2 py-0.5 text-xs text-(--success-foreground)">
        <Check aria-hidden="true" className="size-3" />
        {item.percent}%
      </span>
    );
  }
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${
        item.status === "doing" ? "bg-(--gold) text-(--brand)" : "bg-white/15"
      }`}
    >
      {item.percent}%
    </span>
  );
}

/**
 * Trilha do curso: um item por material, na ordem sugerida, com o percentual de cada um e o
 * progresso geral. Todos os itens disponíveis ficam abertos; o vídeo, sem link, fica desativado.
 */
export function TrailNav() {
  const trail = useTrail();
  const pathname = usePathname();

  return (
    <nav aria-label="Trilha do curso">
      <ol className="flex flex-wrap items-center justify-center gap-1">
        {trail.items.map((item) => {
          const Icon = ICONS[item.id];
          const isCurrent = pathname === item.href;
          return (
            <li key={item.id}>
              {item.available ? (
                <Link
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`${PILL} ${
                    isCurrent
                      ? "border-white bg-white text-(--brand)"
                      : item.id === trail.next
                        ? "border-(--gold) text-white hover:bg-white/10"
                        : "border-transparent text-white hover:bg-white/10"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {item.shortLabel}
                  <Percent item={item} />
                  <span className="sr-only">{STATUS_TEXT[item.status]}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`${PILL} cursor-not-allowed border-transparent text-white/55`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {item.shortLabel}
                  <span className="sr-only">{STATUS_TEXT[item.status]}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Progresso geral da trilha: média dos itens disponíveis (o vídeo sem link fica de fora). */
export function TrailPercent() {
  const trail = useTrail();
  return <p className="text-sm font-bold whitespace-nowrap">Trilha {trail.overallPercent}%</p>;
}
