import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "@/components/Providers";
import { fontScript } from "@/lib/font-script";
import { OG_BASE, SITE_URL, UMAMI_WEBSITE_ID } from "@/lib/site";

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
// Produção usa sempre o endereço oficial (www): o domínio sem www redireciona
// e imagem de prévia atrás de redirecionamento falha em alguns apps.
const siteUrl =
  (process.env.VERCEL_ENV === "production" ? SITE_URL : "") ||
  normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vitor de Souza Barreto | Engenheiro de Software",
  description:
    "Engenheiro de software especialista em front-end. Do Figma ao deploy: software completo, com obsessão pela experiência do usuário.",
  openGraph: {
    ...OG_BASE,
    title: "Vitor de Souza | Engenheiro de software, UI/UX e Front-end",
    description:
      "Sites, sistemas e aplicativos do Figma ao deploy. Orçamento grátis em 2 minutos, com faixa de preço na hora.",
    url: SITE_URL,
  },
  // Sem twitter-image próprio: o X usa a og:image de cada página
  twitter: { card: "summary_large_image" },
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

// Idioma antes da primeira pintura. O HTML estático sai em português; se o
// aparelho (ou a escolha salva) pede outro idioma, a página fica invisível até
// o LanguageProvider trocar o texto, em vez de piscar português. Mesma regra
// de detectBrowserLanguage (contexts/LanguageContext.tsx): manter as duas iguais.
const langScript = `(function(){try{var s=localStorage.getItem('language');var l=(s==='pt'||s==='en')?s:null;if(!l){var p=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];for(var i=0;i<p.length&&!l;i++){var x=(p[i]||'').toLowerCase();if(x.indexOf('pt')===0)l='pt';else if(x.indexOf('en')===0)l='en';}}l=l||'en';var e=document.documentElement;e.setAttribute('lang',l==='pt'?'pt-BR':'en');if(l!=='pt')e.setAttribute('data-lang-pending','');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
        <script dangerouslySetInnerHTML={{ __html: fontScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        {/* Umami: visitas e eventos do funil. data-domains: só conta o site
            oficial; local e preview da Vercel ficam fora dos números. */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains="www.vitordsb.com.br"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
