"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Card } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { moduleContent } from "@/content/module";
import { useProgress } from "@/lib/journey/useProgress";
import { progressRepository } from "@/services/user-progress";
import type { VideoProgress } from "@/components/video/VideoPlayer";

const VideoPlayer = dynamic(
  () => import("@/components/video/VideoPlayer").then((mod) => mod.VideoPlayer),
  { ssr: false }
);

/** O player avisa a cada segundo; grava só quando a posição andou o bastante. */
const SAVE_EVERY_SECONDS = 5;

/** Enquanto o vídeo não tem link, a página avisa em vez de mostrar um player vazio. */
function VideoComingSoon() {
  return (
    <Card className="h-fit max-h-full w-full max-w-3xl">
      <Card.Header>
        <Card.Title>Vídeo em breve</Card.Title>
        <Card.Description>
          O vídeo de apresentação do curso ainda não foi publicado. Ele entra na trilha, como
          primeiro passo, assim que estiver disponível.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-wrap gap-3">
        <Link href="/ebook" className={buttonVariants({ variant: "primary" })}>
          Ler o e-book
        </Link>
        <Link href="/mapa" className={buttonVariants({ variant: "outline" })}>
          Explorar o mapa interativo
        </Link>
      </Card.Content>
    </Card>
  );
}

function VideoWithPlayer({ youtubeVideoId }: { youtubeVideoId: string }) {
  const { video } = useProgress();
  const lastSavedSecondsRef = useRef(video.positionSeconds);

  function handleProgress(progress: VideoProgress) {
    if (Math.abs(progress.currentTime - lastSavedSecondsRef.current) < SAVE_EVERY_SECONDS) return;
    lastSavedSecondsRef.current = progress.currentTime;
    progressRepository.setVideoProgress(progress.percent, progress.currentTime);
  }

  function handleEnded() {
    lastSavedSecondsRef.current = 0;
    progressRepository.setVideoProgress(100, 0);
  }

  return (
    <Card className="h-fit max-h-full w-full max-w-3xl">
      <Card.Header>
        <Card.Title>{moduleContent.title}</Card.Title>
      </Card.Header>
      <Card.Content className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {/* Limita a largura para que o vídeo 16:9 caiba na altura da tela. */}
        <div className="mx-auto w-full max-w-[min(100%,calc(50dvh*16/9))]">
          <VideoPlayer
            youtubeVideoId={youtubeVideoId}
            initialTime={video.positionSeconds}
            onProgress={handleProgress}
            onEnded={handleEnded}
          />
        </div>
      </Card.Content>
    </Card>
  );
}

export function ModuleVideoStep() {
  return moduleContent.youtubeVideoId ? (
    <VideoWithPlayer youtubeVideoId={moduleContent.youtubeVideoId} />
  ) : (
    <VideoComingSoon />
  );
}
