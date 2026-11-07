import { expect, type Page } from "@playwright/test";
import type { Preferences } from "./progress";

/** Os três modos visuais do portal: tema claro, tema escuro e alto contraste (sobre o claro). */
export const MODOS_VISUAIS: Array<{ nome: string; preferencias: Partial<Preferences> }> = [
  { nome: "tema claro", preferencias: { theme: "light" } },
  { nome: "tema escuro", preferencias: { theme: "dark" } },
  { nome: "alto contraste", preferencias: { theme: "light", contrast: "high" } },
];

/**
 * As preferências salvas só chegam ao `<html>` depois da hidratação. Ler o estilo antes disso devolveria
 * as cores do tema claro e faria qualquer modo parecer correto; por isso espera o atributo aparecer.
 */
export async function aguardarPreferencias(page: Page, preferencias: Partial<Preferences>) {
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", preferencias.theme ?? "light");
  if (preferencias.contrast === "high") {
    await expect(html).toHaveAttribute("data-contrast", "high");
  }
}
