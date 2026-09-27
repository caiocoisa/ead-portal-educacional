import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";

export function PortalHeader() {
  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-(--border) px-6 py-4">
      <div className="flex flex-col">
        <span className="text-lg font-semibold">Portal de Conteúdo Educativo</span>
        <span className="hidden text-sm text-(--muted) sm:inline">
          Aprenda no seu ritmo
        </span>
      </div>
      <AccessibilityControls />
    </header>
  );
}
