"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { LanguageProvider } from "@/components/providers/language-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
