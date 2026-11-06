import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "E-book: Planejar com IA sem perder a didática | Planejamento Pedagógico para EaD com Apoio de IA",
  description:
    "Planejar com IA sem perder a didática: guia de bolso em e-book para educadores na educação a distância.",
};

const LEITOR = "/ebook/leitor.html";

const ACTION_CLASS =
  "inline-flex items-center gap-2 rounded-full border border-(--brand) px-4 py-1.5 text-sm font-medium hover:bg-(--surface-secondary)";

/**
 * Página livre, item da trilha: o leitor registra as páginas exibidas no progresso. O cabeçalho
 * vem do layout compartilhado do portal.
 *
 * Não há botão de baixar o PDF (Task 65): ler o conteúdo em PDF empobrece a experiência em relação
 * a interagir com ele aqui; não é uma proteção contra cópia. A versão acessível é o próprio HTML
 * do leitor, que cumpre teclado, leitor de tela, alto contraste e fonte ampliada.
 */
export default function EbookPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Planejar com IA sem perder a didática</h1>
          <p className="text-sm text-(--muted)">
            Guia de bolso em e-book · 18 páginas
          </p>
        </div>
        <a href={LEITOR} target="_blank" rel="noopener" className={ACTION_CLASS}>
          <ExternalLink aria-hidden="true" className="size-4" />
          Abrir em tela cheia
          <span className="sr-only"> (abre em uma nova aba)</span>
        </a>
      </div>
      <iframe
        src={LEITOR}
        title="E-book Planejar com IA sem perder a didática: leitor interativo de 18 páginas"
        className="min-h-0 w-full flex-1 rounded-xl border border-(--border) bg-(--brand)"
      />
    </main>
  );
}
