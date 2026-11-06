"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HomeResetButton } from "@/components/journey/HomeResetButton";
import { describeTrailItem, type TrailItemState } from "@/lib/journey/trail";
import { useTrail } from "@/lib/journey/useTrail";

const ACTION =
  "inline-flex shrink-0 items-center gap-1.5 rounded-lg border-2 px-3.5 py-1.5 text-sm font-bold";

function Circle({ item, index, isNext }: { item: TrailItemState; index: number; isNext: boolean }) {
  const base = "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full font-bold";
  if (item.status === "done") {
    return (
      <span aria-hidden="true" className={`${base} bg-(--success) text-(--success-foreground)`}>
        <Check className="size-[18px]" strokeWidth={3} />
      </span>
    );
  }
  if (!item.available) {
    return (
      <span
        aria-hidden="true"
        className={`${base} border-2 border-dashed border-(--muted) text-(--muted)`}
      >
        {index + 1}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${base} text-(--foreground) ${
        isNext ? "border-[3px] border-(--gold)" : "border-2 border-(--foreground)"
      }`}
    >
      {index + 1}
    </span>
  );
}

function Tag({ children, tone }: { children: string; tone: "next" | "soon" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${
        tone === "next"
          ? "bg-(--gold) text-(--brand)"
          : "bg-(--surface-secondary) text-(--foreground)"
      }`}
    >
      {children}
    </span>
  );
}

function Row({
  item,
  index,
  isNext,
  isLast,
}: {
  item: TrailItemState;
  index: number;
  isNext: boolean;
  isLast: boolean;
}) {
  const doing = item.status === "doing";
  const body = (
    <>
      <Circle item={item} index={index} isNext={isNext} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`text-base font-bold ${item.available ? "" : "text-(--muted)"}`}>
            {item.label}
          </span>
          {isNext ? <Tag tone="next">Próximo</Tag> : null}
          {!item.available ? <Tag tone="soon">Em breve</Tag> : null}
        </span>
        <span className="text-sm font-medium text-(--muted)">{describeTrailItem(item)}</span>
        {doing ? (
          <span aria-hidden="true" className="mt-1 block h-1.5 w-full max-w-56 rounded-full bg-(--border)">
            <span
              className="block h-full rounded-full bg-(--accent)"
              style={{ width: `${item.percent}%` }}
            />
          </span>
        ) : null}
      </span>
    </>
  );

  return (
    <li className="relative pb-3 last:pb-0">
      {isLast ? null : (
        <span
          aria-hidden="true"
          className={`absolute top-10 bottom-0 left-[17px] w-0.5 ${
            item.status === "done" ? "bg-(--success)" : "bg-(--border)"
          }`}
        />
      )}
      {item.available ? (
        <Link
          href={item.href}
          className="flex items-start gap-4 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus)"
        >
          {body}
          <span
            className={`${ACTION} self-center ${
              doing
                ? "border-(--brand) bg-(--brand) text-white"
                : "border-(--foreground) text-(--foreground)"
            }`}
          >
            {doing ? "Continuar" : "Abrir"}
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        </Link>
      ) : (
        <div className="flex items-start gap-4">
          {body}
          <button
            type="button"
            disabled
            className={`${ACTION} self-center cursor-not-allowed border-(--border) text-(--muted)`}
          >
            Em breve
          </button>
        </div>
      )}
    </li>
  );
}

/**
 * Cartão "Sua trilha" da primeira tela: progresso geral, um item por material (com o sugerido
 * em destaque) e o "Apagar meu progresso". Todos os itens disponíveis ficam abertos.
 */
export function TrailCard() {
  const trail = useTrail();

  return (
    <section
      aria-labelledby="trilha-title"
      className="flex flex-col gap-4 rounded-2xl border border-(--border) bg-(--surface) p-5"
    >
      <h2 id="trilha-title" className="text-xl font-bold">
        Sua trilha
      </h2>
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
            className="h-full rounded-full bg-(--accent)"
            style={{ width: `${trail.overallPercent}%` }}
          />
        </div>
      </div>
      <ol className="flex flex-col">
        {trail.items.map((item, index) => (
          <Row
            key={item.id}
            item={item}
            index={index}
            isNext={item.id === trail.next}
            isLast={index === trail.items.length - 1}
          />
        ))}
      </ol>
      <div className="flex justify-end border-t border-(--border) pt-3">
        <HomeResetButton />
      </div>
    </section>
  );
}
