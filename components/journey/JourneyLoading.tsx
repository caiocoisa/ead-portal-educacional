import { Skeleton, Spinner } from "@heroui/react";

/** Estado de carregamento exibido enquanto o progresso salvo é verificado. */
export function JourneyLoading({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`flex flex-col items-center justify-center gap-6 p-6 ${fullScreen ? "h-dvh" : "m-auto"}`}
    >
      <Spinner size="lg" />
      <div className="flex w-full max-w-md flex-col gap-3">
        <Skeleton className="h-6 w-2/3 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
      </div>
    </div>
  );
}
