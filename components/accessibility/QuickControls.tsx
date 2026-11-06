"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Contrast, Monitor, Moon, Sun } from "lucide-react";
import { FONT_SIZES } from "@/lib/preferences/stores";
import { useFontSize } from "@/lib/preferences/useFontSize";
import { useHighContrast } from "@/lib/preferences/useHighContrast";
import { useThemePreference, type ThemePreference } from "@/lib/preferences/useThemePreference";

const THEME_CYCLE: readonly ThemePreference[] = ["light", "dark", "system"];
const THEME_NAME: Record<ThemePreference, string> = {
  light: "claro",
  dark: "escuro",
  system: "do sistema",
};
const THEME_ICON = { light: Sun, dark: Moon, system: Monitor } as const;

interface QuickButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  layout: "rail" | "row";
  label: string;
  children: ReactNode;
}

function QuickButton({ layout, label, children, ...rest }: QuickButtonProps) {
  const size =
    layout === "rail"
      ? "h-[60px] w-[68px] flex-col gap-0.5 text-xs"
      : "min-h-11 flex-1 gap-1.5 text-[13px]";
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center rounded-xl border border-(--border) bg-(--surface) font-bold text-(--foreground) hover:bg-(--surface-secondary) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus) disabled:cursor-not-allowed disabled:opacity-45 aria-pressed:border-(--accent) aria-pressed:bg-(--accent) aria-pressed:text-(--accent-foreground) ${size}`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

/**
 * Quatro ajustes sempre à mão, sem menu: fonte menor, fonte maior, contraste e tema. Na régua
 * lateral os botões ficam em coluna, com o rótulo sob o ícone; no celular, numa linha só.
 * O `aria-label` começa pelo texto visível (WCAG 2.5.3, acionamento por voz).
 */
export function QuickControls({ layout }: { layout: "rail" | "row" }) {
  const { fontSize, setFontSize } = useFontSize();
  const { contrast, setContrast } = useHighContrast();
  const { theme, setTheme } = useThemePreference();

  const fontIndex = FONT_SIZES.indexOf(fontSize);
  const ThemeIcon = THEME_ICON[theme];
  const nextTheme = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];

  return (
    <div
      role="group"
      aria-label="Controles de acessibilidade"
      className={layout === "rail" ? "flex flex-col items-center gap-2.5" : "flex gap-2"}
    >
      <QuickButton
        layout={layout}
        label="Fonte"
        aria-label="A− Fonte, diminuir o tamanho"
        disabled={fontIndex <= 0}
        onClick={() => setFontSize(FONT_SIZES[fontIndex - 1])}
      >
        <span aria-hidden="true" className="text-lg leading-none">
          A−
        </span>
      </QuickButton>
      <QuickButton
        layout={layout}
        label="Fonte"
        aria-label="A+ Fonte, aumentar o tamanho"
        disabled={fontIndex >= FONT_SIZES.length - 1}
        onClick={() => setFontSize(FONT_SIZES[fontIndex + 1])}
      >
        <span aria-hidden="true" className="text-lg leading-none">
          A+
        </span>
      </QuickButton>
      <QuickButton
        layout={layout}
        label="Contraste"
        aria-pressed={contrast === "high"}
        onClick={() => setContrast(contrast === "high" ? "normal" : "high")}
      >
        <Contrast aria-hidden="true" className="size-5" />
      </QuickButton>
      <QuickButton
        layout={layout}
        label="Tema"
        aria-label={`Tema, atual: ${THEME_NAME[theme]}. Alternar para ${THEME_NAME[nextTheme]}`}
        onClick={() => setTheme(nextTheme)}
      >
        <ThemeIcon aria-hidden="true" className="size-5" />
      </QuickButton>
    </div>
  );
}
