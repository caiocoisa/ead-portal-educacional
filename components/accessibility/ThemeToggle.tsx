"use client";

import { Button, useTheme } from "@heroui/react";

const OPTIONS = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Tema">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={theme === option.value ? "primary" : "ghost"}
          aria-pressed={theme === option.value}
          onPress={() => setTheme(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
