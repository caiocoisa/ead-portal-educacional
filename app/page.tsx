import { CourseSections } from "@/components/public/CourseSections";
import { PortalHeader } from "@/components/public/PortalHeader";
import { WelcomeHero } from "@/components/public/WelcomeHero";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Primeira dobra: ocupa exatamente a altura da tela. */}
      <div id="inicio" className="flex h-dvh flex-col">
        <PortalHeader />
        <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-linear-to-b from-(--surface-secondary) to-transparent p-4 sm:p-6">
          <WelcomeHero />
        </main>
      </div>
      <CourseSections />
    </div>
  );
}
