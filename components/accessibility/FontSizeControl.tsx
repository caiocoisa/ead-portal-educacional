"use client";

import { Button } from "@heroui/react";
import { useFontSize } from "@/lib/preferences/useFontSize";

const OPTIONS = [
  { value: "normal", label: "A", ariaLabel: "Fonte normal" },
  { value: "large", label: "A+", ariaLabel: "Fonte grande" },
  { value: "extra-large", label: "A++", ariaLabel: "Fonte extra grande" },
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
