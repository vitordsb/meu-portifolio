import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "@/components/Providers";

// Plus Jakarta Sans (headings) — moderna, amigável, levemente arredondada.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
// Inter (body) — legível, neutra.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-base",
  display: "swap",
});

// Base URL pra OG/Twitter images. Setar NEXT_PUBLIC_SITE_URL no deploy.
// Normaliza adicionando https:// se faltar (evita quebrar new URL()).
function normalizeUrl(raw: string): string {
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}
const siteUrl =
  normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vitor de Souza Barreto | UX Engineer",
  description:
    "UX Engineer unindo design de experiência e engenharia de software — interfaces de alta performance, acessíveis e com impacto mensurável.",
  openGraph: {
    title: "Vitor de Souza Barreto | UX Engineer",
    description: "Portfolio profissional — projetos, competências e trabalho freelancer.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} ${GeistMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
