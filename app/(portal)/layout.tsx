import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";
import { PortalHeader } from "@/components/public/PortalHeader";

/**
 * Layout compartilhado por todas as páginas do portal: o cabeçalho e a gaveta de acessibilidade
 * ficam aqui, uma vez só, e não são remontados ao navegar entre as páginas. Ocupa exatamente a
 * altura da tela (`dvh`); cada página entrega o seu `main`, que rola por dentro quando precisa.
 * O grupo `(portal)` não aparece na URL.
 */
export default function PortalLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <PortalHeader />
      <AccessibilityControls />
      {children}
    </div>
  );
}
