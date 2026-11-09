"use client";

import Link from "next/link";
import { Chip } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowDown, ArrowRight, BookOpen, Network } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { moduleContent } from "@/content/module";
import { useHydrated } from "@/lib/journey/useHydrated";
import { useTrail } from "@/lib/journey/useTrail";
import { TrailCard } from "./TrailCard";

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

/**
 * Primeira tela.
 * - Celular (abaixo de 768 px): texto e trilha empilhados; os cartões de materiais não aparecem, porque
 *   a barra inferior já dá acesso direto ao e-book e ao mapa e eles empurrariam a trilha para baixo.
 * - De 768 px a 1024 px: texto e cartão da trilha empilhados (com a régua lateral, duas colunas ficam
 *   apertadas demais).
 * - De 1024 px a 1500 px: o texto à esquerda e o cartão da trilha à direita.
 * - A partir de 1500 px: a trilha vive na régua lateral esquerda (em todas as páginas), então o
 *   cartão some daqui e entra a ilustração principal ao lado do texto.
 */
export function WelcomeHero() {
  const isHydrated = useHydrated();
  const trail = useTrail();

  const started = trail.items.some((item) => item.available && item.percent > 0);
  const next = trail.items.find((item) => item.id === trail.next);
  const cta = !started
    ? { href: "/ebook", label: "Começar pelo e-book" }
    : next
      ? { href: next.href, label: `Continuar: ${next.label}` }
      : { href: "/relatorio", label: "Rever o relatório" };

  return (
    <div className="m-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center wide:max-w-[1200px] wide:grid-cols-[minmax(0,1fr)_minmax(0,440px)] wide:gap-12">
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
        <p className="text-(--muted)">
          {started
            ? `Você já avançou ${trail.overallPercent}% da trilha. Continue de onde parou ou abra qualquer item: a ordem é só uma sugestão.`
            : moduleContent.description}
        </p>
        {/* Sempre no fluxo, também antes da hidratação, só que invisível: o botão que aparecia depois
            empurrava o conteúdo abaixo dele (o link "Conheça os objetivos" pulava de lugar e um toque
            nesse intervalo se perdia). `invisible` guarda o espaço e tira o botão do foco e dos leitores
            de tela até o rótulo certo ser conhecido. */}
        <Link
          href={cta.href}
          className={`${buttonVariants({ variant: "primary", size: "lg" })} surface-primary w-fit shadow-(--shadow-card) ${
            isHydrated ? "" : "invisible"
          }`}
        >
          {cta.label}
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
        <section aria-labelledby="materiais-title" className="hidden flex-col gap-2 md:flex">
          <h2
            id="materiais-title"
            className="text-sm font-semibold tracking-wide text-(--muted) uppercase"
          >
            Materiais de estudo
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 wide:grid-cols-1">
            {MATERIALS.map((material) => (
              <li key={material.href}>
                <Link
                  href={material.href}
                  className="surface-card group flex h-full items-start gap-3 rounded-xl p-4 transition-colors hover:bg-(--surface-secondary) hover:bg-(image:--grad-tint) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus)"
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

      {/* O cartão real é renderizado sempre, invisível até a hidratação, para o espaço ser o mesmo
          antes e depois (sem salto de layout). Quem já tem progresso não vê um 0% passageiro: o que
          aparece enquanto isso é o bloco de carregamento, com o tamanho exato do cartão. */}
      <div className="relative wide:hidden">
        <div className={isHydrated ? undefined : "invisible"}>
          <TrailCard />
        </div>
        {isHydrated ? null : (
          <div
            role="status"
            aria-label="Carregando"
            className="absolute inset-0 rounded-2xl bg-(--surface-secondary) motion-safe:animate-pulse"
          />
        )}
      </div>

      {/* Só em telas largas, ao lado do texto. Sem `priority`: escondida, a imagem nem é baixada. */}
      <div className="hidden wide:block">
        <ImagePlaceholder
          label="Ilustração principal"
          hint="public/img/hero.jpg · 1456×720"
          src="/img/hero.jpg"
          alt="Ilustração em azul-marinho e dourado: um livro aberto, um cérebro de circuitos que representa a inteligência artificial e um notebook com a figura de uma pessoa, ligados por linhas e nós."
          className="surface-frame aspect-[2/1] w-full"
        />
      </div>
    </div>
  );
}
