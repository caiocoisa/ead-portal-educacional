"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { progressRepository } from "@/services/user-progress";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowRight, BookOpen, List, Network } from "lucide-react";
import {
  mapClosing,
  mapEdges,
  mapIntro,
  mapNodes,
  mapTitle,
  type MapNode,
  type MapNodeId,
} from "@/content/mapa";

type View = "mapa" | "lista";

const NODE_BY_ID = Object.fromEntries(mapNodes.map((n) => [n.id, n])) as Record<MapNodeId, MapNode>;

/** Ilustração do nó; enquanto não houver imagem, mostra o ícone do elemento. */
function NodeArt({ node }: { node: MapNode }) {
  if (node.image) {
    return (
      <span className="relative block size-14 shrink-0 overflow-hidden rounded-xl">
        <Image src={node.image} alt="" fill sizes="56px" className="object-contain" />
      </span>
    );
  }
  const Icon = node.icon;
  return (
    <span
      aria-hidden="true"
      className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--brand) text-(--gold)"
    >
      <Icon className="size-6" />
    </span>
  );
}

function DetailItem({
  term,
  tone = "default",
  children,
}: {
  term: string;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border-l-4 bg-(--surface) px-3 py-1.5 ${
        tone === "danger" ? "border-(--danger)" : "border-(--gold)"
      }`}
    >
      <dt
        className={`text-xs font-bold uppercase tracking-wide ${
          tone === "danger" ? "text-(--danger-text)" : "text-(--muted)"
        }`}
      >
        {term}
      </dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}

function NodeDetail({ node, headingId }: { node: MapNode; headingId: string }) {
  const connections = mapEdges.filter((e) => e.from === node.id || e.to === node.id);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <NodeArt node={node} />
        <div>
          <h2 id={headingId} className="text-xl font-bold">
            {node.title}
          </h2>
          <p className="text-sm text-(--muted)">{node.question}</p>
        </div>
      </div>
      <dl className="flex flex-col gap-1.5">
        <DetailItem term="Conceito">{node.concept}</DetailItem>
        <DetailItem term="Exemplo">{node.example}</DetailItem>
        <DetailItem term="Falha típica da IA" tone="danger">
          {node.aiFailure}
        </DetailItem>
        <DetailItem term="Pergunta de auditoria">{node.auditQuestion}</DetailItem>
        <DetailItem term="Comando de ajuste">“{node.adjustPrompt}”</DetailItem>
      </dl>
      <div>
        <h3 className="text-sm font-semibold">Conexões</h3>
        <ul className="mt-1 flex flex-col gap-0.5 text-xs text-(--muted)">
          {connections.map((e) => (
            <li key={`${e.from}-${e.to}`}>
              <span className="font-medium text-(--foreground)">
                {NODE_BY_ID[e.from].title} → {NODE_BY_ID[e.to].title}:
              </span>{" "}
              {e.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Closing() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border-l-4 border-(--gold) bg-(--surface) p-4">
      <p className="font-medium">{mapClosing}</p>
      <Link
        href="/ebook"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium underline"
      >
        <BookOpen aria-hidden="true" className="size-4" />
        Aprofunde no capítulo 1 do e-book
      </Link>
    </div>
  );
}

export function ConceptMap() {
  const [selected, setSelected] = useState<MapNodeId | null>(null);
  const [tour, setTour] = useState(false);
  const [view, setView] = useState<View>("mapa");
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedNode = selected ? NODE_BY_ID[selected] : null;
  const step = selected ? mapNodes.findIndex((n) => n.id === selected) : -1;
  const showMap = view === "mapa";

  /** Abre o elemento e o registra como visto no progresso. */
  function select(id: MapNodeId) {
    progressRepository.markMapElement(id);
    setSelected(id);
  }

  function choose(id: MapNodeId) {
    select(id);
    setTour(false);
  }

  function startTour() {
    select(mapNodes[0].id);
    setTour(true);
  }

  function goTo(index: number) {
    if (index >= mapNodes.length) {
      setSelected(null);
      setTour(false);
      return;
    }
    select(mapNodes[Math.max(0, index)].id);
  }

  // Na lista (única forma em telas pequenas) não há o que clicar: o elemento vale como visto
  // quando o seu título aparece na tela. Com a lista escondida, nada intersecta e nada é gravado.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          progressRepository.markMapElement(entry.target.id.replace("lista-", "") as MapNodeId);
        }
      }
    });
    for (const node of mapNodes) {
      const heading = document.getElementById(`lista-${node.id}`);
      if (heading) observer.observe(heading);
    }
    return () => observer.disconnect();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      event.key as "ArrowRight" | "ArrowDown" | "ArrowLeft" | "ArrowUp"
    ];
    if (!delta) return;
    event.preventDefault();
    nodeRefs.current[(index + delta + mapNodes.length) % mapNodes.length]?.focus();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold">{mapTitle}</h1>
          <p className="mt-1 text-sm text-(--muted)">{mapIntro}</p>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <div role="group" aria-label="Forma de exibição" className="flex gap-1">
            <Button
              size="sm"
              variant={showMap ? "primary" : "outline"}
              aria-pressed={showMap}
              onPress={() => setView("mapa")}
            >
              <Network aria-hidden="true" className="size-4" />
              Mapa
            </Button>
            <Button
              size="sm"
              variant={showMap ? "outline" : "primary"}
              aria-pressed={!showMap}
              onPress={() => setView("lista")}
            >
              <List aria-hidden="true" className="size-4" />
              Lista
            </Button>
          </div>
          {showMap ? (
            <Button size="sm" variant="secondary" onPress={startTour}>
              Percurso guiado
            </Button>
          ) : null}
        </div>
      </header>

      <p role="status" className="sr-only">
        {selectedNode ? `${selectedNode.title} selecionado. Os detalhes estão no painel ao lado do mapa.` : ""}
      </p>

      <div
        className={`grid gap-4 ${
          showMap ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start" : ""
        }`}
      >
        {/* Mapa e painel de detalhe: só em telas largas e na forma "Mapa". */}
        <div className={showMap ? "hidden lg:contents" : "hidden"}>
          {/* Fixo ao rolar: o painel de detalhe pode ser mais alto que a janela. */}
          <div className="relative aspect-[3/2] w-full rounded-2xl border border-(--border) bg-(--surface-secondary) lg:sticky lg:top-0">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
              className="absolute inset-0 size-full"
            >
              {mapEdges.map((edge) => {
                const a = NODE_BY_ID[edge.from].position;
                const b = NODE_BY_ID[edge.to].position;
                const active = selected === edge.from || selected === edge.to;
                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={active ? 5 : 3}
                    style={{ stroke: active ? "var(--gold)" : "var(--muted)" }}
                    opacity={active ? 1 : 0.45}
                  />
                );
              })}
            </svg>
            {mapNodes.map((node, index) => {
              const isSelected = selected === node.id;
              return (
                <button
                  key={node.id}
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  type="button"
                  aria-pressed={isSelected}
                  aria-controls="painel-detalhe"
                  onClick={() => choose(node.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
                  className={`absolute flex w-[23%] min-w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border-2 p-2 text-center shadow-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus) ${
                    isSelected
                      ? "border-(--gold) bg-(--brand) text-white"
                      : "border-(--brand) bg-(--surface) hover:bg-(--surface-secondary)"
                  }`}
                >
                  <NodeArt node={node} />
                  <span className="text-sm font-bold">{node.title}</span>
                  <span
                    className={`text-xs leading-tight ${isSelected ? "text-white/85" : "text-(--muted)"}`}
                  >
                    {node.question}
                  </span>
                </button>
              );
            })}
          </div>

          <section
            id="painel-detalhe"
            aria-label="Detalhe do elemento"
            className="rounded-2xl border border-(--border) bg-(--surface-secondary) p-4"
          >
            {selectedNode ? (
              <div className="flex flex-col gap-4">
                <NodeDetail node={selectedNode} headingId={`detalhe-${selectedNode.id}`} />
                {tour ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--border) pt-3">
                    <span className="text-sm font-medium">
                      Passo {step + 1} de {mapNodes.length}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        isDisabled={step === 0}
                        onPress={() => goTo(step - 1)}
                      >
                        Anterior
                      </Button>
                      <Button size="sm" onPress={() => goTo(step + 1)}>
                        {step === mapNodes.length - 1 ? "Concluir" : "Próximo"}
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold">Escolha um elemento</h2>
                  <p className="mt-1 text-sm text-(--muted)">
                    Selecione um elemento no mapa para ver o conceito, um exemplo e a falha típica
                    da IA. Use as setas do teclado para mover o foco entre eles, ou comece pelo
                    percurso guiado.
                  </p>
                </div>
                <Closing />
              </div>
            )}
          </section>
        </div>

        {/* Lista: única forma em telas pequenas e alternativa ao mapa em telas largas. */}
        <div className={showMap ? "lg:hidden" : ""}>
          <ol className="flex flex-col gap-4">
            {mapNodes.map((node) => (
              <li key={node.id}>
                <article
                  aria-labelledby={`lista-${node.id}`}
                  className="rounded-2xl border border-(--border) bg-(--surface-secondary) p-4"
                >
                  <NodeDetail node={node} headingId={`lista-${node.id}`} />
                </article>
              </li>
            ))}
          </ol>
          <div className="mt-4">
            <Closing />
          </div>
        </div>
      </div>
    </div>
  );
}
