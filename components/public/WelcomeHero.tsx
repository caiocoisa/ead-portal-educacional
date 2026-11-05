"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Chip,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  ChartColumn,
  ClipboardList,
  Clapperboard,
  Network,
} from "lucide-react";
import { userProgressRepository } from "@/services/user-progress";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { moduleContent } from "@/content/module";

const STEP_ROUTES = {
  video: "/video",
  avaliacao: "/avaliacao",
  relatorio: "/relatorio",
} as const;

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

export function WelcomeHero() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = userProgressRepository.getCurrent();
    if (existing) {
      router.replace(STEP_ROUTES[existing.currentStep]);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only localStorage check, not derived from render state
    setIsReady(true);
  }, [router]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = userName.trim();
    if (!trimmedName) {
      setError("Informe seu nome para continuar.");
      return;
    }
    userProgressRepository.create(trimmedName);
    router.push("/video");
  }

  if (!isReady) {
    return <JourneyLoading fullScreen={false} />;
  }

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
      <ol
        aria-label="Etapas da jornada"
        className="flex items-center justify-between gap-2 rounded-xl border border-(--border) bg-(--surface) p-3"
      >
        {[
          { icon: Clapperboard, label: "Vídeo" },
          { icon: ClipboardList, label: "Avaliação" },
          { icon: ChartColumn, label: "Relatório" },
        ].map((item, index, all) => (
          <li key={item.label} className="flex flex-1 items-start gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-full bg-(--brand) text-(--gold)"
              >
                <item.icon className="size-5" />
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            {index < all.length - 1 ? (
              <span aria-hidden="true" className="mt-5 h-0.5 flex-1 bg-(--border)" />
            ) : null}
          </li>
        ))}
      </ol>
      <Card className="w-full">
        <Card.Header>
          <Card.Title>Vamos começar?</Card.Title>
          <Card.Description>
            Informe seu nome para iniciar a jornada.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              value={userName}
              onChange={(value) => {
                setUserName(value);
                setError(null);
              }}
              isRequired
              fullWidth
            >
              <Label>Como podemos te chamar?</Label>
              <Input placeholder="Seu nome" />
              {error ? <FieldError>{error}</FieldError> : null}
            </TextField>
            <Button type="submit" fullWidth>
              Iniciar minha jornada
            </Button>
          </Form>
        </Card.Content>
      </Card>
      </div>
    </div>
  );
}
