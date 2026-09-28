import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  /** Descrição curta do que a imagem deve mostrar. */
  label: string;
  /** Caminho e tamanho sugeridos para o arquivo definitivo. */
  hint: string;
  className?: string;
  /**
   * Caminho da imagem em `public/` (ex.: "/img/hero.svg"). Enquanto não for
   * informado, exibe um espaço reservado no lugar da imagem.
   */
  src?: string;
  /** Texto alternativo; use "" para imagens meramente decorativas. */
  alt?: string;
}

export function ImagePlaceholder({
  label,
  hint,
  className = "",
  src,
  alt = "",
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Espaço reservado para imagem: ${label}`}
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-(--gold) bg-(--brand)/5 p-3 text-center text-(--muted) ${className}`}
    >
      <ImageIcon aria-hidden="true" className="size-8 text-(--muted)" />
      <span className="text-sm font-medium text-(--foreground)">{label}</span>
      <span className="text-xs">{hint}</span>
    </div>
  );
}
