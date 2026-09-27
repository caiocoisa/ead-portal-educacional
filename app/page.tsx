import { PortalHeader } from "@/components/public/PortalHeader";
import { WelcomeHero } from "@/components/public/WelcomeHero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <main className="flex flex-1 items-center justify-center p-6">
        <WelcomeHero />
      </main>
    </div>
  );
}
