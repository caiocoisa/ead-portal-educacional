import type { Metadata } from "next";
import { ConceptMap } from "@/components/materials/ConceptMap";
import { PortalHeader } from "@/components/public/PortalHeader";

export const metadata: Metadata = {
  title: "Mapa interativo do alinhamento | Planejamento Pedagógico para EaD com Apoio de IA",
  description:
    "Explore os quatro elementos de um planejamento (público, objetivos, atividades e avaliação) e veja a falha típica que a IA comete em cada um.",
};

/**
 * Página pública: não faz parte da jornada (vídeo, avaliação, relatório) e por isso
 * não usa o guarda de etapas; abrir o mapa nunca altera nem apaga o progresso.
 */
export default function MapaPage() {
  return (
    <div className="flex h-dvh flex-col">
      <PortalHeader current="mapa" />
      <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 sm:pl-10">
        <ConceptMap />
      </main>
    </div>
  );
}
