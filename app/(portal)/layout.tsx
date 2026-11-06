import {
  AccessibilityPanel,
  AccessibilityRail,
  AccessibilityRow,
} from "@/components/accessibility/AccessibilityRail";
import { TrailBottomBar } from "@/components/journey/TrailBottomBar";
import { TrailRail } from "@/components/journey/TrailRail";
import { PortalHeader } from "@/components/public/PortalHeader";

/**
 * Layout compartilhado por todas as páginas do portal. O cabeçalho, as réguas laterais e a barra
 * inferior ficam aqui, uma vez só, e não são remontados ao navegar. Ocupa exatamente a altura da
 * tela (`dvh`); cada página entrega o seu `main`, que rola por dentro quando precisa. O grupo
 * `(portal)` não aparece na URL.
 *
 * - Celular (abaixo de 768 px): topo enxuto, linha de acessibilidade e barra fixa da trilha embaixo.
 * - De 768 px a 1500 px: cabeçalho com a trilha e uma régua de acessibilidade à direita.
 * - A partir de 1500 px: régua da trilha à esquerda e painel de acessibilidade à direita.
 */
export default function PortalLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <PortalHeader />
      <div className="flex min-h-0 flex-1">
        <TrailRail />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
        <AccessibilityRail />
        <AccessibilityPanel />
      </div>
      <AccessibilityRow />
      <TrailBottomBar />
    </div>
  );
}
