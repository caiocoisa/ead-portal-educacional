import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";

export function PortalHeader() {
  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-(--border) px-6 py-4">
      <div className="flex flex-col">
        <span className="text-lg font-semibold">
          Planejamento Pedagógico para EaD com Apoio de IA
        </span>
        <span className="hidden text-sm text-(--muted) sm:inline">
          Planeje aulas a distância com a ajuda de um assistente de IA
        </span>
      </div>
      <AccessibilityControls />
    </header>
  );
}
