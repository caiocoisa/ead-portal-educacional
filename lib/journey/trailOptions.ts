import { moduleContent } from "@/content/module";
import type { TrailOptions } from "./trail";

/**
 * Opções da trilha tiradas do conteúdo do módulo: o vídeo só conta quando tem link
 * (`youtubeVideoId`), e a avaliação mede as perguntas que existem hoje.
 */
export const trailOptions: TrailOptions = {
  videoAvailable: moduleContent.youtubeVideoId !== null,
  questionIds: moduleContent.questions.map((question) => question.id),
};
