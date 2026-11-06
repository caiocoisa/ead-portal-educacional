import type { Metadata } from "next";
import { ComicReader } from "@/components/materials/ComicReader";
import { PortalHeader } from "@/components/public/PortalHeader";

export const metadata: Metadata = {
  title: "Quadrinho: duas sugestões da IA | Planejamento Pedagógico para EaD com Apoio de IA",
  description:
    "Acompanhe a professora Marina auditando duas sugestões da IA para um curso de fotografia com o celular, e decida junto com ela.",
};

/**
 * Página pública: não faz parte da jornada (vídeo, avaliação, relatório) e por isso
 * não usa o guarda de etapas; abrir o quadrinho nunca altera nem apaga o progresso.
 */
export default function QuadrinhoPage() {
  return (
    <div className="flex h-dvh flex-col">
      <PortalHeader current="quadrinho" />
      <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 sm:pl-10">
        <ComicReader />
      </main>
    </div>
  );
}
