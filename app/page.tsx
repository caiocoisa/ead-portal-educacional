import { PortalHeader } from "@/components/public/PortalHeader";
import { CourseSections } from "@/components/public/CourseSections";
import { WelcomeHero } from "@/components/public/WelcomeHero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <main className="flex flex-1 flex-col">
        <div id="inicio" className="flex justify-center p-6 py-12">
          <WelcomeHero />
        </div>
        <CourseSections />
      </main>
    </div>
  );
}
