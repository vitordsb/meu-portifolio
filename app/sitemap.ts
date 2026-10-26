import type { MetadataRoute } from "next";
import { COMPANIES } from "@/lib/companies";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { INDEXED_PAGES, SITE_URL } from "@/lib/site";

/** Páginas fixas (lib/site), mais uma por serviço e uma por case. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    ...INDEXED_PAGES,
    ...SERVICE_PAGES.map((p) => ({ path: `/servicos/${p.slug}`, priority: 0.8 })),
    ...COMPANIES.map((c) => ({ path: `/cases/${c.id}`, priority: 0.6 })),
  ];
  return pages.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
