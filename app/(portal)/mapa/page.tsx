import type { Metadata } from "next";
import { ConceptMap } from "@/components/materials/ConceptMap";

export const metadata: Metadata = {
  title: "Mapa interativo do alinhamento | Planejamento Pedagógico para EaD com Apoio de IA",
  description:
    "Explore os quatro elementos de um planejamento (público, objetivos, atividades e avaliação) e veja a falha típica que a IA comete em cada um.",
};

/**
 * Página livre, item da trilha: cada elemento aberto é registrado no progresso. O cabeçalho
 * vem do layout compartilhado do portal.
 */
export default function MapaPage() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 sm:pl-10">
      <ConceptMap />
    </main>
  );
}
