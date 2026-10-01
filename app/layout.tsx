import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "@/components/Providers";

// Inter: a mesma do wireframe. Variável, então segura do texto corrido ao
// display de 9rem sem baixar um arquivo por peso.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  title: "Vitor de Souza Barreto | Engenheiro de Software",
  description:
    "Engenheiro de software especialista em front-end. Do Figma ao deploy: software completo, com obsessão pela experiência do usuário.",
  openGraph: {
    title: "Vitor de Souza Barreto | Engenheiro de Software",
    description: "Portfolio profissional: projetos, competências e trabalho freelancer.",
    type: "website",
  },
};

// A cor da barra do navegador acompanha a superfície de cada esquema.
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1f" },
  ],
};

// Aplica o tema antes da primeira pintura. Sem isso, quem usa "automático" com o
// sistema no escuro vê um flash claro até o ThemeProvider hidratar.
const themeScript = `(function(){try{var c=localStorage.getItem('theme');var r=(c==='light'||c==='dark')?c:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var e=document.documentElement;e.setAttribute('data-theme',r);e.style.colorScheme=r;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
