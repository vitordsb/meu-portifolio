/**
 * Endereço oficial do site. O domínio sem www (vitordsb.com.br) redireciona
 * pra cá, então sitemap, canonical, robots e dados estruturados usam sempre
 * este: link que redireciona no sitemap o Google trata como erro.
 */
export const SITE_URL = "https://www.vitordsb.com.br";

/**
 * Base da prévia de link (Open Graph). Página que define `openGraph` troca o
 * da raiz inteiro no Next, então cada uma espalha isto e põe título e texto
 * próprios. A imagem vem do opengraph-image.tsx da pasta da rota.
 */
export const OG_BASE = {
  siteName: "Vitor de Souza",
  locale: "pt_BR",
  type: "website",
} as const;

/** Site no Umami Cloud (eventos em lib/analytics.ts). Não é segredo: aparece
 *  no próprio script da página. */
export const UMAMI_WEBSITE_ID = "63db9b7a-7930-428e-9640-5bc2f9b867c7";

/** Páginas que o Google deve achar, com o peso de cada uma no sitemap. As de
 *  venda vêm logo depois da home: é por elas que chega cliente. */
export const INDEXED_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/servicos", priority: 0.9 },
  { path: "/orcamento", priority: 0.9 },
  { path: "/raio-x", priority: 0.9 },
  { path: "/quanto-custa", priority: 0.8 },
  { path: "/autonomo", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/skills", priority: 0.5 },
  { path: "/certificates", priority: 0.4 },
  { path: "/contact", priority: 0.5 },
  { path: "/cv", priority: 0.3 },
];
