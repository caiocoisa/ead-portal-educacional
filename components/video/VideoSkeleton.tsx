import { Skeleton } from "@heroui/react";

/** Placeholder exibido enquanto o vídeo real do módulo ainda não foi definido. */
export function VideoSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <Skeleton className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <span className="text-3xl" aria-hidden="true">
          🎬
        </span>
        <p className="text-sm font-medium text-(--muted)">
          O vídeo deste módulo será adicionado em breve.
        </p>
      </div>
    </div>
  );
}
