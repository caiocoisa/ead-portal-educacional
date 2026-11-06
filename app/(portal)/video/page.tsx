import { JourneyMain } from "@/components/journey/JourneyMain";
import { ModuleVideoStep } from "@/components/journey/ModuleVideoStep";

/** Página livre: o aluno abre o vídeo quando quiser. O cabeçalho vem do layout do portal. */
export default function VideoPage() {
  return (
    <JourneyMain>
      <ModuleVideoStep />
    </JourneyMain>
  );
}
