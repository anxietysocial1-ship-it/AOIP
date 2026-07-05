import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "AOIP — Artificial Opportunity Intelligence Platform",
  description:
    "Tell AOIP what you want to achieve. Our intelligence engine analyses your profile and objective to map the best opportunities across India — in 12 languages.",
  keywords: [
    "AOIP",
    "opportunity intelligence",
    "India",
    "MSME",
    "startup",
    "funding",
    "export",
    "women entrepreneurship",
  ],
  openGraph: {
    title: "AOIP — Artificial Opportunity Intelligence Platform",
    description:
      "What would you like to achieve? AOIP maps your objective to the best opportunities across India.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050d1a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
