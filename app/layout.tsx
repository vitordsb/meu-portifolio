import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Figtree, Roboto } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "@/components/Providers";

// Figtree: geométrica de terminais arredondados, usada em display e headline.
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

// Roboto: a fonte do Material Design. Segura title, body e label.
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
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
  title: "Vitor de Souza Barreto | Frontend Engineer",
  description:
    "Frontend Engineer unindo design de experiência e engenharia de software: interfaces de alta performance, acessíveis e com impacto mensurável.",
  openGraph: {
    title: "Vitor de Souza Barreto | Frontend Engineer",
    description: "Portfolio profissional: projetos, competências e trabalho freelancer.",
    type: "website",
  },
};

// A cor da barra do navegador acompanha a superfície M3 de cada esquema.
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9fd" },
    { media: "(prefers-color-scheme: dark)", color: "#131314" },
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
      className={`${figtree.variable} ${roboto.variable} ${GeistMono.variable}`}
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
