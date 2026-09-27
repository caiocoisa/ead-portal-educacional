"use client";

import { Label, Switch } from "@heroui/react";
import { useHighContrast } from "@/lib/preferences/useHighContrast";

export function HighContrastToggle() {
  const { contrast, setContrast } = useHighContrast();

  return (
    <Switch
      isSelected={contrast === "high"}
      onChange={(isSelected) => setContrast(isSelected ? "high" : "normal")}
      size="sm"
    >
      <Switch.Content className="flex items-center gap-2">
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Label>Alto contraste</Label>
      </Switch.Content>
    </Switch>
  );
}
