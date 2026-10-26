import { COMPANIES } from "@/lib/companies";
import { buildCatalog } from "@/lib/projects-catalog";

/**
 * Projetos que podem receber depoimento: os 4 clientes das linhas da home
 * (pelo id de lib/companies) e os outros projetos entregues do catálogo
 * (pelo slug). Projeto que sai do portfólio sai daqui junto.
 */
export type TestimonialProject = { id: string; name: string };

export const OTHER_PROJECT = "outro";

export function testimonialProjects(): TestimonialProject[] {
  const inRows = new Set(COMPANIES.flatMap((c) => c.products.map((p) => p.slug).filter(Boolean)));
  return [
    ...COMPANIES.map((c) => ({ id: c.id, name: c.name })),
    ...buildCatalog()
      .filter((p) => !inRows.has(p.slug))
      .map((p) => ({ id: p.slug, name: p.title })),
  ];
}

export function projectName(id: string): string | null {
  if (id === OTHER_PROJECT) return null;
  return testimonialProjects().find((p) => p.id === id)?.name ?? null;
}

/** Nome do projeto de um link único: o do portfólio ou, em `outro`, o do link. */
export function requestProjectName(req: { project: string; label?: string }): string | null {
  return projectName(req.project) ?? (req.project === OTHER_PROJECT ? req.label ?? null : null);
}
