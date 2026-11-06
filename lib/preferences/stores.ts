import { createPreferenceStore } from "./preferenceStore";

export type FontSize = "normal" | "large" | "extra-large";
export type ContrastMode = "normal" | "high";
/** `system` segue o tema do aparelho. */
export type ThemePreference = "light" | "dark" | "system";

/** Ordem dos tamanhos, do menor para o maior. */
export const FONT_SIZES: readonly FontSize[] = ["normal", "large", "extra-large"];

export const fontSizeStore = createPreferenceStore<FontSize>({
  storageKey: "ead-portal:font-size",
  defaultValue: "normal",
  allowed: FONT_SIZES,
  attribute: "data-font-size",
});

export const contrastStore = createPreferenceStore<ContrastMode>({
  storageKey: "ead-portal:contrast",
  defaultValue: "normal",
  allowed: ["normal", "high"],
  attribute: "data-contrast",
});

/**
 * Só **lê** o tema salvo: quem o aplica no `<html>` é o `useTheme` do HeroUI, que guarda a escolha na
 * mesma chave. Este armazenamento existe para a interface mostrar o tema sem erro de hidratação.
 */
export const themeStore = createPreferenceStore<ThemePreference>({
  storageKey: "heroui-theme",
  defaultValue: "system",
  allowed: ["light", "dark", "system"],
});
