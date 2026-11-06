import type { Metadata } from "next";
import { ComicReader } from "@/components/materials/ComicReader";

export const metadata: Metadata = {
  title: "Quadrinho: duas sugestões da IA | Planejamento Pedagógico para EaD com Apoio de IA",
  description:
    "Acompanhe a professora Marina auditando duas sugestões da IA para um curso de fotografia com o celular, e decida junto com ela.",
};

/**
 * Página fora da trilha: não conta no progresso e não tem link na navegação (a rota segue
 * aberta por endereço). O cabeçalho vem do layout compartilhado do portal.
 */
export default function QuadrinhoPage() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
      <ComicReader />
    </main>
  );
}
