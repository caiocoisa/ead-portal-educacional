"use client";

import Link from "next/link";
import { Chip } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowDown, ArrowRight, BookOpen, Network } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { HomeResetButton } from "@/components/journey/HomeResetButton";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { moduleContent } from "@/content/module";
import { useHydrated } from "@/lib/journey/useHydrated";
import { useTrail } from "@/lib/journey/useTrail";

/** Materiais de estudo em destaque na tela principal (hoje, os dois principais pontos de acesso). */
const MATERIALS = [
  {
    href: "/ebook",
    icon: BookOpen,
    title: "Ler o e-book",
    description: "Guia de bolso em 18 páginas para planejar com IA sem perder a didática.",
  },
  {
    href: "/mapa",
    icon: Network,
    title: "Explorar o mapa interativo",
    description:
      "Veja como público, objetivos, atividades e avaliação se conectam e onde a IA costuma errar.",
  },
] as const;

const STATUS_LABEL = {
  soon: "Em breve",
  todo: "Não iniciado",
  doing: "Em andamento",
  done: "Concluído",
} as const;

export function WelcomeHero() {
  const isHydrated = useHydrated();
  const trail = useTrail();

  const started = trail.items.some((item) => item.available && item.percent > 0);
  const next = trail.items.find((item) => item.id === trail.next);
  const cta =
    !started || !next
      ? started
        ? { href: "/relatorio", label: "Rever o relatório" }
        : { href: "/ebook", label: "Começar pelo e-book" }
      : { href: next.href, label: `Continuar: ${next.label}` };

  return (
    <div className="m-auto grid w-full max-w-5xl gap-8 md:grid-cols-[3fr_2fr] md:items-center">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Chip size="sm" className="bg-(--gold) text-(--brand)">
            <Chip.Label>Curso online</Chip.Label>
          </Chip>
          <Chip color="success" variant="soft" size="sm">
            <Chip.Label>Ritmo livre</Chip.Label>
          </Chip>
          <Chip variant="soft" size="sm">
            <Chip.Label>Sem cadastro</Chip.Label>
          </Chip>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">{moduleContent.title}</h1>
        <p className="text-(--muted)">{moduleContent.description}</p>
        {isHydrated ? (
          <Link href={cta.href} className={`${buttonVariants({ variant: "primary", size: "lg" })} w-fit`}>
            {cta.label}
            <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
        ) : null}
        <section aria-labelledby="materiais-title" className="flex flex-col gap-2">
          <h2
            id="materiais-title"
            className="text-sm font-semibold tracking-wide text-(--muted) uppercase"
          >
            Materiais de estudo
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {MATERIALS.map((material) => (
              <li key={material.href}>
                <Link
                  href={material.href}
                  className="group flex h-full items-start gap-3 rounded-xl border-2 border-(--brand) bg-(--surface) p-4 transition-colors hover:bg-(--surface-secondary) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus)"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-(--brand) text-(--gold)"
                  >
                    <material.icon className="size-6" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold">{material.title}</span>
                    <span className="text-sm text-(--muted)">{material.description}</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1 ml-auto size-5 shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <a
          href="#objetivos-title"
          className="flex items-center gap-1 text-sm font-medium underline"
        >
          Conheça os objetivos, o público e os pré-requisitos
          <ArrowDown aria-hidden="true" className="size-4" />
        </a>
      </div>

      <div className="flex flex-col gap-4">
        <ImagePlaceholder
          label="Ilustração principal"
          hint="public/img/hero.jpg · 1456×720"
          src="/img/hero.jpg"
          alt="Ilustração em azul-marinho e dourado: um livro aberto, um cérebro de circuitos que representa a inteligência artificial e um notebook com a figura de uma pessoa, ligados por linhas e nós."
          priority
          className="aspect-[2/1] max-h-[24dvh] w-full border border-(--border)"
        />
        {isHydrated ? (
          <section
            aria-labelledby="trilha-title"
            className="flex flex-col gap-3 rounded-xl border border-(--border) bg-(--surface) p-4"
          >
            <h2 id="trilha-title" className="text-lg font-bold">
              Sua trilha
            </h2>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Progresso da trilha: {trail.overallPercent}%
              <progress
                value={trail.overallPercent}
                max={100}
                className="h-2 w-full accent-(--brand)"
              />
            </label>
            <ol className="flex flex-col gap-2">
              {trail.items.map((item, index) => (
                <li key={item.id}>
                  {item.available ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg border border-(--border) px-3 py-2 hover:bg-(--surface-secondary) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus)"
                    >
                      <span aria-hidden="true" className="font-bold">
                        {index + 1}
                      </span>
                      <span className="flex flex-1 flex-col">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-xs text-(--muted)">{STATUS_LABEL[item.status]}</span>
                      </span>
                      <span className="text-sm font-bold">{item.percent}%</span>
                    </Link>
                  ) : (
                    <div
                      aria-disabled="true"
                      className="flex items-center gap-3 rounded-lg border border-dashed border-(--border) px-3 py-2 text-(--muted)"
                    >
                      <span aria-hidden="true" className="font-bold">
                        {index + 1}
                      </span>
                      <span className="flex flex-1 flex-col">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-xs">Em breve</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <div className="flex justify-end">
              <HomeResetButton tone="onLight" />
            </div>
          </section>
        ) : (
          <JourneyLoading fullScreen={false} />
        )}
      </div>
    </div>
  );
}
