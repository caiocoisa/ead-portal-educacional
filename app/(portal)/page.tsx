import { CourseSections } from "@/components/public/CourseSections";
import { WelcomeHero } from "@/components/public/WelcomeHero";

export default function Home() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      {/* Primeira dobra: ocupa a altura da área de conteúdo, abaixo do cabeçalho. */}
      <div
        id="inicio"
        className="flex min-h-full flex-col justify-center bg-linear-to-b from-(--surface-secondary) to-transparent p-4 sm:p-6"
      >
        <WelcomeHero />
      </div>
      <CourseSections />
    </main>
  );
}
