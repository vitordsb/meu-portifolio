/**
 * Endereço oficial do site. O domínio sem www (vitordsb.com.br) redireciona
 * pra cá, então sitemap, canonical, robots e dados estruturados usam sempre
 * este: link que redireciona no sitemap o Google trata como erro.
 */
export const SITE_URL = "https://www.vitordsb.com.br";

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
  { path: "/autonomo", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/skills", priority: 0.5 },
  { path: "/certificates", priority: 0.4 },
  { path: "/contact", priority: 0.5 },
  { path: "/cv", priority: 0.3 },
];
