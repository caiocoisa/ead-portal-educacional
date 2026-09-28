"use client";

import { useEffect, useState } from "react";
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
import { ArrowDown, Bot, ChartColumn, ClipboardList, Clapperboard } from "lucide-react";
import { userProgressRepository } from "@/services/user-progress";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { JourneyLoading } from "@/components/journey/JourneyLoading";
import { moduleContent } from "@/content/module";

const STEP_ROUTES = {
  video: "/video",
  avaliacao: "/avaliacao",
  relatorio: "/relatorio",
} as const;

const FEATURES = [
  { icon: Clapperboard, label: "Assista a um vídeo sobre planejamento pedagógico para EaD" },
  { icon: Bot, label: "Veja um exemplo de aula de Computação com apoio de IA" },
  { icon: ClipboardList, label: "Pratique como pedir, analisar e melhorar sugestões da IA" },
  { icon: ChartColumn, label: "Veja seu resultado em um relatório final" },
];

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
        <ul className="grid gap-2 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <li
              key={feature.label}
              className="flex items-start gap-3 rounded-xl border border-(--border) bg-(--surface) p-3 text-sm"
            >
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--brand) text-(--gold)"
              >
                <feature.icon className="size-5" />
              </span>
              {feature.label}
            </li>
          ))}
        </ul>
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
        hint="public/img/hero.svg · 560×280"
        className="aspect-[2/1] max-h-[24dvh] w-full"
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
              <Input placeholder="Seu nome" autoFocus />
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
