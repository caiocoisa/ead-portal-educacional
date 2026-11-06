"use client";

import { usePathname } from "next/navigation";
import { Accessibility } from "lucide-react";
import { FontSizeControl } from "./FontSizeControl";
import { HighContrastToggle } from "./HighContrastToggle";
import { QuickControls } from "./QuickControls";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Atalhos da primeira tela. Os ids são o da primeira dobra e os dos **títulos** das seções de
 * `CourseSections` (`<id>-title`): a seção em si não tem `id`, e um atalho para ela não faria nada.
 */
const PAGE_INDEX = [
  { href: "#inicio", label: "Início" },
  { href: "#objetivos-title", label: "Objetivos do curso" },
  { href: "#publico-title", label: "A quem se destina" },
  { href: "#faq-title", label: "Perguntas frequentes" },
] as const;

function PageIndex() {
  return (
    <nav aria-labelledby="nesta-pagina" className="flex flex-col gap-2 border-t border-(--border) pt-4">
      <h2 id="nesta-pagina" className="text-lg font-bold">
        Nesta página
      </h2>
      <ul className="flex flex-col gap-0.5 text-sm">
        {PAGE_INDEX.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="block rounded-lg px-3 py-2 hover:bg-(--surface-secondary) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus)"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Régua de acessibilidade, sempre visível, à direita (de 768 px até 1500 px). Substitui a aba
 * lateral que abria uma gaveta: nada fica escondido atrás de um menu.
 */
export function AccessibilityRail() {
  return (
    <aside
      aria-label="Acessibilidade"
      className="hidden w-[88px] shrink-0 flex-col items-center gap-2.5 overflow-y-auto border-l border-(--border) bg-(--surface) py-3.5 md:flex wide:hidden"
    >
      <span aria-hidden="true" className="text-(--foreground)">
        <Accessibility className="size-6" />
      </span>
      <QuickControls layout="rail" />
    </aside>
  );
}

/**
 * A partir de 1500 px a régua vira um painel com os controles completos e, só na primeira tela, o
 * índice "Nesta página".
 */
export function AccessibilityPanel() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Acessibilidade e navegação da página"
      className="hidden w-[300px] shrink-0 flex-col gap-5 overflow-y-auto border-l border-(--border) bg-(--surface) p-5 wide:flex"
    >
      <section aria-labelledby="acessibilidade-painel" className="flex flex-col gap-4">
        <h2 id="acessibilidade-painel" className="flex items-center gap-2 text-lg font-bold">
          <Accessibility aria-hidden="true" className="size-5" />
          Acessibilidade
        </h2>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tamanho da fonte</span>
          <FontSizeControl />
        </div>
        <HighContrastToggle />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tema</span>
          <ThemeToggle />
        </div>
      </section>
      {pathname === "/" ? <PageIndex /> : null}
    </aside>
  );
}

/**
 * No celular (abaixo de 768 px) os mesmos quatro ajustes numa linha, no fim da área de conteúdo,
 * logo acima da barra inferior da trilha.
 */
export function AccessibilityRow() {
  return (
    <section
      aria-label="Acessibilidade"
      className="shrink-0 border-t border-(--border) bg-(--surface) px-3 py-2 md:hidden"
    >
      <QuickControls layout="row" />
    </section>
  );
}
