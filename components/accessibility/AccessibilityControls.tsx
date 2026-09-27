import { FontSizeControl } from "./FontSizeControl";
import { HighContrastToggle } from "./HighContrastToggle";
import { ThemeToggle } from "./ThemeToggle";

export function AccessibilityControls() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ThemeToggle />
      <FontSizeControl />
      <HighContrastToggle />
    </div>
  );
}
