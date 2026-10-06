/**
 * Endereço oficial do site. O domínio sem www (vitordsb.com.br) redireciona
 * pra cá, então sitemap, canonical, robots e dados estruturados usam sempre
 * este: link que redireciona no sitemap o Google trata como erro.
 */
export const SITE_URL = "https://www.vitordsb.com.br";

/**
 * Marca da empresa. Enquanto não houver nome fantasia (out/2026), a marca é o
 * nome do fundador: quando o nome sair, troca aqui e o site inteiro acompanha
 * (home, rodapé, dados estruturados).
 */
export const BRAND = {
  name: "Vitor de Souza",
  descriptor: { pt: "Estúdio de software", en: "Software studio" },
  email: "orcamento@vitordsb.com.br",
} as const;

/** CNPJ da empresa (Simples Nacional, aberta em 23/09/2026). */
export const CNPJ = "69.283.538/0001-57";

/**
 * Base da prévia de link (Open Graph). Página que define `openGraph` troca o
 * da raiz inteiro no Next, então cada uma espalha isto e põe título e texto
 * próprios. A imagem vem do opengraph-image.tsx da pasta da rota.
 */
export const OG_BASE = {
  siteName: BRAND.name,
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
  { path: "/privacidade", priority: 0.3 },
  { path: "/termos", priority: 0.3 },
];
