import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";

export function PortalHeader() {
  return (
    <header className="flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-b-4 border-(--gold) bg-(--brand) px-6 py-3 text-white">
      <div className="flex flex-col">
        <span className="text-lg font-semibold">
          Planejamento Pedagógico para EaD com Apoio de IA
        </span>
        <span className="hidden text-sm text-white/80 sm:inline">
          Planeje aulas a distância com a ajuda de um assistente de IA
        </span>
      </div>
      <AccessibilityControls />
    </header>
  );
}
