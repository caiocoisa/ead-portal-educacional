"use client";

import { useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { useYouTubeIframeApi } from "./useYouTubeIframeApi";

export interface VideoProgress {
  currentTime: number;
  duration: number;
  percent: number;
}

interface VideoPlayerProps {
  youtubeVideoId: string;
  initialTime?: number;
  onProgress: (progress: VideoProgress) => void;
  onEnded: () => void;
}

const PROGRESS_POLL_INTERVAL_MS = 1000;

export function VideoPlayer({
  youtubeVideoId,
  initialTime = 0,
  onProgress,
  onEnded,
}: VideoPlayerProps) {
  const isApiReady = useYouTubeIframeApi();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const onProgressRef = useRef(onProgress);
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onEndedRef.current = onEnded;
  });

  useEffect(() => {
    if (!isApiReady || !containerRef.current) return;

    let pollInterval: ReturnType<typeof setInterval> | undefined;

    const player = new window.YT!.Player(containerRef.current, {
      videoId: youtubeVideoId,
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        enablejsapi: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event) => {
          if (initialTime > 0) {
            event.target.seekTo(initialTime, true);
          }
          // As funções do player (getDuration/getCurrentTime) só ficam
          // disponíveis após onReady; o polling não pode começar antes.
          pollInterval = setInterval(() => {
            const current = playerRef.current;
            if (!current) return;
            const duration = current.getDuration();
            const currentTime = current.getCurrentTime();
            if (!duration) return;
            onProgressRef.current({
              currentTime,
              duration,
              percent: (currentTime / duration) * 100,
            });
          }, PROGRESS_POLL_INTERVAL_MS);
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            onEndedRef.current();
          }
        },
      },
    });
    playerRef.current = player;

    return () => {
      clearInterval(pollInterval);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, youtubeVideoId]);

  function handlePlay() {
    playerRef.current?.playVideo();
  }

  function handlePause() {
    playerRef.current?.pauseVideo();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="secondary" onPress={handlePlay}>
          Play
        </Button>
        <Button variant="secondary" onPress={handlePause}>
          Pause
        </Button>
      </div>
    </div>
  );
}
