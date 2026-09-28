import type { Metadata } from "next";
import { Toast } from "@heroui/react";
import { Geist, Geist_Mono } from "next/font/google";
import { AccessibilityInitializer } from "@/components/accessibility/AccessibilityInitializer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planejamento Pedagógico para EaD com Apoio de IA",
  description:
    "Aprenda a planejar aulas a distância com apoio de IA: assista ao vídeo, faça a avaliação e receba seu relatório final.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--color-background) text-(--color-foreground)">
        <AccessibilityInitializer />
        <Toast.Provider placement="top end" />
        {children}
      </body>
    </html>
  );
}
