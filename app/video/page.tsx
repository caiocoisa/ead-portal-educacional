import { JourneyLayout } from "@/components/journey/JourneyLayout";
import { ModuleVideoStep } from "@/components/journey/ModuleVideoStep";

/** Página livre: não há guarda de etapas; o aluno abre o vídeo quando quiser. */
export default function VideoPage() {
  return (
    <JourneyLayout>
      <ModuleVideoStep />
    </JourneyLayout>
  );
}
