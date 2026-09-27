/** Declarações mínimas da YouTube IFrame Player API usadas pelo VideoPlayer. */
declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface OnStateChangeEvent {
    data: PlayerState;
    target: Player;
  }

  interface PlayerEvents {
    onReady?: (event: { target: Player }) => void;
    onStateChange?: (event: OnStateChangeEvent) => void;
  }

  interface PlayerVars {
    enablejsapi?: 0 | 1;
    controls?: 0 | 1;
    rel?: 0 | 1;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
  }

  interface PlayerOptions {
    videoId?: string;
    host?: string;
    playerVars?: PlayerVars;
    events?: PlayerEvents;
  }

  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    mute(): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): PlayerState;
    destroy(): void;
  }
}
