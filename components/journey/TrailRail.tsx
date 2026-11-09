"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { HomeResetButton } from "@/components/journey/HomeResetButton";
import type { TrailItemState } from "@/lib/journey/trail";
import { useTrail } from "@/lib/journey/useTrail";

const ROW =
  "grid min-h-11 grid-cols-[28px_1fr_auto] items-center gap-2.5 rounded-lg border-2 px-2.5 py-1.5 text-left";

function Marker({ item, index }: { item: TrailItemState; index: number }) {
  const base = "flex size-7 items-center justify-center rounded-full text-xs font-bold";
  if (item.status === "done") {
    return (
      <span aria-hidden="true" className={`${base} bg-(--success) text-(--success-foreground)`}>
        <Check className="size-4" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${base} border-2 ${
        item.available
          ? "border-(--foreground) text-(--foreground)"
          : "border-dashed border-(--muted) text-(--muted)"
      }`}
    >
      {index + 1}
    </span>
  );
}

/**
 * Régua da trilha à esquerda, só a partir de 1500 px: o progresso geral, um item por material e o
 * "Apagar meu progresso", em todas as páginas. Em telas menores a trilha está no cabeçalho (ou na
 * barra inferior, no celular) e, na primeira tela, no cartão "Sua trilha".
 */
export function TrailRail() {
  const trail = useTrail();
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sua trilha"
      className="panel-left hidden w-[280px] shrink-0 flex-col gap-4 overflow-y-auto p-[18px] wide:flex"
    >
      <h2 className="text-lg font-bold">Sua trilha</h2>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-bold">Progresso da trilha: {trail.overallPercent}%</p>
        <div
          role="progressbar"
          aria-label="Progresso da trilha"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={trail.overallPercent}
          className="h-2.5 w-full rounded-full bg-(--border)"
        >
          <div
            className="fill-progress h-full rounded-full"
            style={{ width: `${trail.overallPercent}%` }}
          />
        </div>
      </div>
      <nav aria-label="Trilha lateral">
        <ol className="flex flex-col gap-1">
          {trail.items.map((item, index) => (
            <li key={item.id}>
              {item.available ? (
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`${ROW} focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus) ${
                    pathname === item.href
                      ? "border-(--gold) bg-(--surface-secondary) bg-(image:--grad-highlight)"
                      : item.id === trail.next
                        ? "border-(--gold)/60"
                        : "border-transparent hover:bg-(--surface-secondary)"
                  }`}
                >
                  <Marker item={item} index={index} />
                  <span className="text-sm font-bold">{item.label}</span>
                  <span
                    className={`text-sm font-bold ${item.status === "done" ? "text-(--success)" : "text-(--muted)"}`}
                  >
                    {item.percent}%
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`${ROW} w-full cursor-not-allowed border-transparent text-(--muted)`}
                >
                  <Marker item={item} index={index} />
                  <span className="text-sm font-bold">{item.label}</span>
                  <span className="text-sm font-bold">Em breve</span>
                </button>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-auto">
        <HomeResetButton />
      </div>
    </aside>
  );
}
