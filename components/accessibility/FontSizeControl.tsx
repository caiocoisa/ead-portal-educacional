"use client";

import { Button } from "@heroui/react";
import { useFontSize } from "@/lib/preferences/useFontSize";

// O `aria-label` começa pelo texto visível (A, A+, A++): WCAG 2.5.3, para quem
// aciona o controle por comando de voz. Não ponha o texto visível entre
// parênteses: o axe-core descarta trechos entre parênteses ao comparar.
const OPTIONS = [
  { value: "normal", label: "A", ariaLabel: "A, fonte normal" },
  { value: "large", label: "A+", ariaLabel: "A+, fonte grande" },
  { value: "extra-large", label: "A++", ariaLabel: "A++, fonte extra grande" },
] as const;

export function FontSizeControl() {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="Tamanho da fonte"
    >
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={fontSize === option.value ? "primary" : "ghost"}
          aria-pressed={fontSize === option.value}
          aria-label={option.ariaLabel}
          onPress={() => setFontSize(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
