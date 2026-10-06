import { allWork } from "./portfolio-data";

/**
 * Catálogo de projetos entregues da home, por tipo de serviço. Sai de
 * `allWork` (mesma fonte do /autonomo) e é montado no servidor em
 * app/page.tsx: o navegador recebe só esta lista enxuta.
 *
 * O tipo é o mesmo id dos cards de serviço (lib/home-content SERVICE_TYPES e
 * lib/guide/examples): landing, site, loja, sistema, app.
 */

export type ProjectType = "landing" | "site" | "loja" | "sistema" | "app";

export type CatalogProject = {
  slug: string;
  title: string;
  /** Cliente, sem o prefixo "Cliente, " do seed. */
  client: string;
  type: ProjectType;
  link: string | null;
  cover: string | null;
};

/** Tipo de cada trabalho. Projeto novo em allWork sem entrada aqui não aparece. */
const TYPE_BY_SLUG: Record<string, ProjectType> = {
  arqdoor: "sistema",
  zuptos: "sistema",
  "mtcprop-members": "sistema",
  girob2b: "sistema",
  oncoliving: "sistema",
  "arqdoor-mobile": "app",
  "egp-iot": "app",
  bioathos: "app",
  "mtcprop-site": "site",
  florenza: "site",
  jma: "site",
  dbl: "site",
  "norte-premium": "site",
  "negritude-junior": "site",
  "egp-industria": "site",
  zynta: "landing",
  "gap-ads": "landing",
};

function clientOf(company: string): string {
  const c = company.replace(/^Cliente,\s*/, "").trim();
  if (c === "Cliente" || !c) return "";
  if (c === "Startup própria") return "Produto próprio";
  return c;
}

export function buildCatalog(): CatalogProject[] {
  return allWork
    .filter((w) => TYPE_BY_SLUG[w.slug])
    .map((w) => ({
      slug: w.slug,
      title: w.title,
      client: clientOf(w.company),
      type: TYPE_BY_SLUG[w.slug],
      link: w.liveLink,
      cover: w.coverImageUrl,
    }))
    // Com imagem primeiro: a vitrine abre pelo que dá pra ver
    .sort((a, b) => Number(!!b.cover) - Number(!!a.cover));
}
