import Link from "next/link";
import { Card } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";

/** O relatório abre mesmo sem resultado (e conta como visto), mas pede a avaliação. */
export function ReportEmptyState() {
  return (
    <Card className="h-fit max-h-full w-full max-w-2xl">
      <Card.Header>
        <Card.Title>Relatório final</Card.Title>
        <Card.Description>
          Você ainda não fez a avaliação. Responda às perguntas para ver o seu resultado e os
          comentários de cada resposta.
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <Link href="/avaliacao" className={buttonVariants({ variant: "primary" })}>
          Ir para a avaliação
        </Link>
      </Card.Footer>
    </Card>
  );
}
