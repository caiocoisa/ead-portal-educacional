import type { ReactNode } from "react";

/** Área de conteúdo das páginas da jornada (vídeo, avaliação e relatório), abaixo do cabeçalho. */
export function JourneyMain({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-0 flex-1 justify-center p-4 sm:p-6">
      {children}
    </main>
  );
}
