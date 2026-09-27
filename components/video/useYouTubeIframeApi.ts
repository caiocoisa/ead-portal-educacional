"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (window.YT?.Player) {
    return Promise.resolve();
  }
  if (apiLoadPromise) {
    return apiLoadPromise;
  }

  apiLoadPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

/** Carrega a IFrame Player API do YouTube sob demanda e sinaliza quando está pronta. */
export function useYouTubeIframeApi(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeIframeApi().then(() => {
      if (!cancelled) setIsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return isReady;
}
