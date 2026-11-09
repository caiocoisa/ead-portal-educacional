"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleCheck,
  CircleX,
  Network,
  RotateCcw,
} from "lucide-react";
import {
  comicIntro,
  comicPanels,
  comicTitle,
  type BalloonPosition,
  type ComicBox,
  type ComicPanel,
} from "@/content/quadrinho";

type View = "painel" | "roteiro";
type Answer = { chosen: number | null; solved: boolean };

const TOTAL = comicPanels.length;

const BALLOON_POSITION: Record<BalloonPosition, string> = {
  "top-right": "sm:top-[6%] sm:right-[4%]",
  "top-left": "sm:top-[6%] sm:left-[4%]",
  right: "sm:top-[10%] sm:right-[4%]",
};

/**
 * Cada tipo de fala tem a sua tinta e o seu rótulo em pílula cheia, no lugar da faixa colorida na
 * lateral. A pílula é o que diz de quem é a fala no alto contraste, onde a tinta some.
 */
const BOX_TONE: Record<ComicBox["tone"], { box: string; pill: string }> = {
  narrator: { box: "surface-highlight", pill: "bg-(--gold) text-(--brand)" },
  command: {
    box: "surface-tint border-2 border-dashed border-(--brand)",
    pill: "bg-(--brand) text-white",
  },
  ai: { box: "surface-tint", pill: "bg-(--accent) text-(--accent-foreground)" },
};

function Box({ box }: { box: ComicBox }) {
  const tone = BOX_TONE[box.tone];
  return (
    <div className={`rounded-lg px-3 py-2 ${tone.box}`}>
      <p
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${tone.pill}`}
      >
        {box.label}
      </p>
      <p className="mt-1 text-sm">{box.text}</p>
    </div>
  );
}

/** Imagem sem texto, com o balão de fala em HTML sobre a área livre da cena. */
function PanelFigure({ panel }: { panel: ComicPanel }) {
  const { balloon } = panel;
  return (
    <div className="relative mx-auto w-fit max-w-full overflow-visible lg:sticky lg:top-0">
      <Image
        src={panel.image}
        alt={panel.imageAlt}
        width={1024}
        height={765}
        priority
        className="h-auto max-h-[56dvh] w-auto max-w-full rounded-xl border-2 border-(--brand)"
      />
      <p
        className={`relative mt-2 rounded-2xl border-2 border-(--brand) bg-white px-3 py-2 text-sm font-bold text-(--brand) shadow-(--shadow-card) sm:absolute sm:mt-0 sm:max-w-[46%] ${BALLOON_POSITION[balloon.position]}`}
      >
        {balloon.text}
        <span
          aria-hidden="true"
          className={`absolute -bottom-2 hidden size-3.5 rotate-45 border-r-2 border-b-2 border-(--brand) bg-white sm:block ${
            balloon.position === "top-left" ? "right-6" : "left-6"
          }`}
        />
      </p>
    </div>
  );
}

function Decision({
  panel,
  answer,
  onChoose,
}: {
  panel: ComicPanel;
  answer: Answer;
  onChoose: (index: number) => void;
}) {
  const decision = panel.decision;
  if (!decision) return null;
  const chosen = answer.chosen !== null ? decision.options[answer.chosen] : null;

  return (
    <fieldset className="flex flex-col gap-2 rounded-xl border-2 border-(--brand) p-3">
      <legend className="px-1 text-sm font-bold">Sua decisão</legend>
      <p className="font-semibold">{decision.question}</p>
      <ul className="flex flex-col gap-2">
        {decision.options.map((option, index) => {
          const isChosen = answer.chosen === index;
          return (
            <li key={option.text}>
              <button
                type="button"
                aria-pressed={isChosen}
                disabled={answer.solved}
                onClick={() => onChoose(index)}
                className={`w-full rounded-lg border-2 bg-(--surface) px-3 py-2 text-left text-sm enabled:hover:bg-(--surface-secondary) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus) ${
                  isChosen
                    ? option.correct
                      ? "border-(--success)"
                      : "border-(--danger)"
                    : "border-(--border)"
                }`}
              >
                {option.text}
              </button>
            </li>
          );
        })}
      </ul>
      <div role="status" aria-live="polite">
        {chosen ? (
          <p
            className={`flex gap-2 rounded-lg px-3 py-2 text-sm ${
              chosen.correct ? "surface-success" : "surface-danger"
            }`}
          >
            {chosen.correct ? (
              <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-(--success)" />
            ) : (
              <CircleX aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-(--danger-text)" />
            )}
            <span>
              <strong>{chosen.correct ? "Correto. " : "Ainda não. "}</strong>
              {chosen.feedback}
              {chosen.correct ? "" : " Escolha outra opção."}
            </span>
          </p>
        ) : null}
      </div>
    </fieldset>
  );
}

function ClosingLinks() {
  return (
    <div className="surface-highlight flex flex-col gap-3 rounded-xl p-4">
      <p className="font-medium">
        Quer ver os quatro elementos de um plano e a falha típica da IA em cada um? O mapa mostra,
        e o e-book detalha a auditoria.
      </p>
      <div className="flex flex-wrap gap-4 text-sm font-medium">
        <Link href="/mapa" className="inline-flex items-center gap-2 underline">
          <Network aria-hidden="true" className="size-4" />
          Explorar o mapa interativo
        </Link>
        <Link href="/ebook" className="inline-flex items-center gap-2 underline">
          <BookOpen aria-hidden="true" className="size-4" />
          Ler o e-book
        </Link>
      </div>
    </div>
  );
}

function ScriptView() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-(--muted)">
        Todo o texto do quadrinho, painel a painel, para ler sem as imagens. Este roteiro{" "}
        <strong>inclui as respostas</strong> das decisões.
      </p>
      <ol className="flex flex-col gap-4">
        {comicPanels.map((panel, index) => (
          <li key={panel.id}>
            <article
              aria-labelledby={`roteiro-${panel.id}`}
              className="surface-tint flex flex-col gap-2 rounded-2xl p-4 text-sm"
            >
              <h2 id={`roteiro-${panel.id}`} className="text-lg font-bold">
                Painel {index + 1}
              </h2>
              <p>
                <strong>Imagem:</strong> {panel.imageAlt}
              </p>
              <p>
                <strong>Marina diz:</strong> “{panel.balloon.text}”
              </p>
              {panel.boxes.map((box) => (
                <p key={box.label}>
                  <strong>{box.label}:</strong> {box.text}
                </p>
              ))}
              {panel.decision ? (
                <div className="flex flex-col gap-1">
                  <p>
                    <strong>Decisão:</strong> {panel.decision.question}
                  </p>
                  <ul className="flex list-disc flex-col gap-1 pl-5">
                    {panel.decision.options.map((option) => (
                      <li key={option.text}>
                        {option.text}
                        {option.correct ? <strong> (resposta certa)</strong> : null}. {option.feedback}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {panel.deepDive ? (
                <p>
                  <strong>{panel.deepDive.title}:</strong> {panel.deepDive.text}
                </p>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
      <ClosingLinks />
    </div>
  );
}

export function ComicReader() {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<View>("painel");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const panel = comicPanels[index];
  const answer = answers[panel.id] ?? { chosen: null, solved: false };
  const blocked = Boolean(panel.decision) && !answer.solved;
  const isLast = index === TOTAL - 1;

  function choose(optionIndex: number) {
    if (!panel.decision) return;
    const solved = panel.decision.options[optionIndex].correct;
    setAnswers((prev) => ({ ...prev, [panel.id]: { chosen: optionIndex, solved } }));
  }

  function restart() {
    setIndex(0);
    setAnswers({});
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold">{comicTitle}</h1>
          <p className="mt-1 text-sm text-(--muted)">{comicIntro}</p>
        </div>
        <div role="group" aria-label="Forma de leitura" className="flex gap-1">
          <Button
            size="sm"
            variant={view === "painel" ? "primary" : "outline"}
            aria-pressed={view === "painel"}
            onPress={() => setView("painel")}
          >
            Painel a painel
          </Button>
          <Button
            size="sm"
            variant={view === "roteiro" ? "primary" : "outline"}
            aria-pressed={view === "roteiro"}
            onPress={() => setView("roteiro")}
          >
            Roteiro em texto
          </Button>
        </div>
      </header>

      {view === "roteiro" ? (
        <ScriptView />
      ) : (
        <section aria-label="Painel do quadrinho" className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">
              Painel {index + 1} de {TOTAL}
            </p>
            <ol aria-hidden="true" className="flex gap-1">
              {comicPanels.map((p, i) => (
                <li
                  key={p.id}
                  className={`h-2 w-6 rounded-full ${
                    i === index ? "bg-(--brand)" : i < index ? "bg-(--gold)" : "bg-(--border)"
                  }`}
                />
              ))}
            </ol>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
            <PanelFigure key={panel.id} panel={panel} />
            <div className="flex flex-col gap-3">
              {panel.boxes.map((box) => (
                <Box key={box.label} box={box} />
              ))}
              <Decision panel={panel} answer={answer} onChoose={choose} />
              {panel.deepDive ? (
                <details className="surface-card rounded-lg px-3 py-2 text-sm">
                  <summary className="cursor-pointer font-semibold">{panel.deepDive.title}</summary>
                  <p className="mt-2">{panel.deepDive.text}</p>
                </details>
              ) : null}
              {isLast ? <ClosingLinks /> : null}

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--border) pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  isDisabled={index === 0}
                  onPress={() => setIndex(index - 1)}
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Anterior
                </Button>
                {blocked ? (
                  <p id="aviso-decisao" className="text-sm text-(--muted)">
                    Escolha a resposta certa para continuar.
                  </p>
                ) : null}
                {isLast ? (
                  <Button size="sm" variant="secondary" onPress={restart}>
                    <RotateCcw aria-hidden="true" className="size-4" />
                    Ler de novo
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    isDisabled={blocked}
                    aria-describedby={blocked ? "aviso-decisao" : undefined}
                    onPress={() => setIndex(index + 1)}
                  >
                    Próximo
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
