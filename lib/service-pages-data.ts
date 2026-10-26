import "server-only";
import { COMPANIES } from "@/lib/companies";
import { GUIDE_EXAMPLES, type GuideExample } from "@/lib/guide/examples";
import { findPackage, type ServicePackage } from "@/lib/payments/packages";
import { buildCatalog, type CatalogProject } from "@/lib/projects-catalog";
import type { ServicePage } from "@/lib/service-pages";

/** Página de serviço com preço, pacote e projetos (ver lib/service-pages). */
export type ServicePageData = ServicePage & {
  guide: GuideExample;
  pkg: ServicePackage | null;
  projects: (CatalogProject & { caseId: string | null })[];
};

/** Case da home (lib/companies) que tem esse projeto, pra linkar a página do case. */
function caseOf(slug: string): string | null {
  return COMPANIES.find((c) => c.products.some((p) => p.slug === slug))?.id ?? null;
}

export function servicePageData(page: ServicePage): ServicePageData {
  return {
    ...page,
    guide: GUIDE_EXAMPLES.find((e) => e.id === page.type)!,
    pkg: findPackage(page.type) ?? null,
    projects: buildCatalog()
      .filter((p) => p.type === page.type)
      .map((p) => ({ ...p, caseId: caseOf(p.slug) })),
  };
}
