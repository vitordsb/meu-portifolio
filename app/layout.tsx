import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Providers from "@/components/Providers";

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
  title: "Vitor de Souza Barreto | Engenheiro de Software",
  description:
    "Engenheiro de Software transformando desafios de negócio em soluções web de alta performance, escalabilidade e impacto mensurável.",
  openGraph: {
    title: "Vitor de Souza Barreto | Engenheiro de Software",
    description: "Portfolio profissional — projetos, competências e trabalho freelancer.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
