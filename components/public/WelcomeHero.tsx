"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { userProgressRepository } from "@/services/user-progress";
import { moduleContent } from "@/content/module";

const STEP_ROUTES = {
  video: "/video",
  avaliacao: "/avaliacao",
  relatorio: "/relatorio",
} as const;

export function WelcomeHero() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
    return null;
  }

  return (
    <Card className="max-w-lg w-full">
      <Card.Header>
        <Card.Title>{moduleContent.title}</Card.Title>
        <Card.Description>
          Bem-vindo(a) ao portal! {moduleContent.description}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {!showForm ? (
          <Button onPress={() => setShowForm(true)} fullWidth>
            Iniciar minha jornada
          </Button>
        ) : (
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
              Entrar
            </Button>
          </Form>
        )}
      </Card.Content>
    </Card>
  );
}
