import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import { PortalHeader } from "@/components/public/PortalHeader";

export const metadata: Metadata = {
  title: "E-book: Planejar com IA sem perder a didática | Planejamento Pedagógico para EaD com Apoio de IA",
  description:
    "Planejar com IA sem perder a didática: guia de bolso em e-book para educadores na educação a distância.",
};

const LEITOR = "/ebook/leitor.html";
const PDF = "/ebook/ebook-planejar-com-ia.pdf";

const ACTION_CLASS =
  "inline-flex items-center gap-2 rounded-full border border-(--brand) px-4 py-1.5 text-sm font-medium hover:bg-(--surface-secondary)";

/**
 * Página pública: não faz parte da jornada (vídeo, avaliação, relatório) e por isso
 * não usa o guarda de etapas; abrir o e-book nunca altera nem apaga o progresso.
 */
export default function EbookPage() {
  return (
    <div className="flex h-dvh flex-col">
      <PortalHeader current="ebook" />
      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4 sm:pl-10">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Planejar com IA sem perder a didática</h1>
            <p className="text-sm text-(--muted)">
              Guia de bolso em e-book · 18 páginas
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            <li>
              <a href={PDF} download className={ACTION_CLASS}>
                <Download aria-hidden="true" className="size-4" />
                Baixar em PDF
              </a>
            </li>
            <li>
              <a href={LEITOR} target="_blank" rel="noopener" className={ACTION_CLASS}>
                <ExternalLink aria-hidden="true" className="size-4" />
                Abrir em tela cheia
                <span className="sr-only"> (abre em uma nova aba)</span>
              </a>
            </li>
          </ul>
        </div>
        <iframe
          src={LEITOR}
          title="E-book Planejar com IA sem perder a didática: leitor interativo de 18 páginas"
          className="min-h-0 w-full flex-1 rounded-xl border border-(--border) bg-(--brand)"
        />
      </main>
    </div>
  );
}
