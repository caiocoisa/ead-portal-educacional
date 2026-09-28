"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { userProgressRepository } from "@/services/user-progress";
import { moduleContent } from "@/content/module";
import { VideoSkeleton } from "@/components/video/VideoSkeleton";
import type { VideoProgress } from "@/components/video/VideoPlayer";

const VideoPlayer = dynamic(
  () => import("@/components/video/VideoPlayer").then((mod) => mod.VideoPlayer),
  { ssr: false }
);

const COMPLETION_THRESHOLD_PERCENT = 90;

export function ModuleVideoStep() {
  const router = useRouter();
  const hasCompletedRef = useRef(false);

  function completeAndAdvance() {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    userProgressRepository.markVideoCompleted();
    router.push("/avaliacao");
  }

  function handleProgress(progress: VideoProgress) {
    if (progress.percent >= COMPLETION_THRESHOLD_PERCENT) {
      completeAndAdvance();
    }
  }

  return (
    <Card className="h-fit max-h-full w-full max-w-3xl">
      <Card.Header>
        <Card.Title>{moduleContent.title}</Card.Title>
        <Card.Description>
          Assista ao vídeo até o final para liberar a avaliação.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {/* Limita a largura para que o vídeo 16:9 caiba na altura da tela. */}
        <div className="mx-auto w-full max-w-[min(100%,calc(50dvh*16/9))]">
          {moduleContent.youtubeVideoId ? (
            <VideoPlayer
              youtubeVideoId={moduleContent.youtubeVideoId}
              onProgress={handleProgress}
              onEnded={completeAndAdvance}
            />
          ) : (
            <VideoSkeleton />
          )}
        </div>
        <Button variant="outline" onPress={completeAndAdvance} fullWidth>
          Concluir
        </Button>
      </Card.Content>
    </Card>
  );
}
