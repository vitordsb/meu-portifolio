import type { Project } from "@/drizzle/schema";

/**
 * Curadoria dos trabalhos: como a home os separa em seções e o que o portfólio
 * mostra ou esconde.
 *
 * "Jobs" são os trabalhos que o Vitor toca hoje, agrupados por marca. "Projetos
 * próprios" são os produtos autorais. O schema não tem uma coluna pra isso, e
 * criar uma exigiria migração só pra classificar meia dúzia de registros - então
 * a divisão mora aqui, olhando título e empresa. Trocar a régua é editar as duas
 * listas abaixo, sem tocar no banco.
 */

/** Marcas dos trabalhos atuais, na ordem em que aparecem na home. */
export const JOB_BRANDS: { label: string; match: string }[] = [
  { label: "ARQDOOR", match: "arqdoor" },
  { label: "ZUPTOS", match: "zuptos" },
  { label: "MTC", match: "mtc" },
  { label: "EGP", match: "egp" },
];

/** Projetos autorais, por slug (o resto entra por "empresa própria"). */
const OWN_SLUGS = ["girob2b"];

function haystack(p: Project): string {
  return `${p.title ?? ""} ${p.company ?? ""}`.toLowerCase();
}

export function brandOf(project: Project): string | null {
  const h = haystack(project);
  return JOB_BRANDS.find((b) => h.includes(b.match))?.match ?? null;
}

export function isJob(project: Project): boolean {
  return brandOf(project) !== null;
}

export function isOwnProject(project: Project): boolean {
  if (isJob(project)) return false;
  if (OWN_SLUGS.includes(project.slug ?? "")) return true;
  return /própria|propria|autoral/i.test(project.company ?? "");
}

/** Trabalhos das marcas atuais, agrupados por marca na ordem de JOB_BRANDS. */
export function jobsOf(projects: Project[]): Project[] {
  return JOB_BRANDS.flatMap((b) =>
    projects
      .filter((p) => brandOf(p) === b.match)
      // Dentro da marca, o que tem capa e destaque vem primeiro.
      .sort((a, z) => Number(z.featured) - Number(a.featured)),
  );
}

export function ownProjectsOf(projects: Project[]): Project[] {
  return projects.filter(isOwnProject);
}

/**
 * Trabalho pequeno demais para a vitrine.
 *
 * Landing page e site estático de uma página não dizem nada sobre engenharia -
 * na lista, competem por atenção com plataforma inteira. Some da listagem, mas
 * continua no dado: mudar a régua aqui traz tudo de volta.
 */
const MINOR_CATEGORIES = ["landing page"];
const STATIC_ONLY_STACK = new Set(["html", "css", "js", "javascript", "jquery"]);

export function isMinorWork(project: Project): boolean {
  const category = (project.category ?? "").trim().toLowerCase();
  if (MINOR_CATEGORIES.includes(category)) return true;

  const tags = Array.isArray(project.tags) ? project.tags : [];
  // Stack 100% estática: site de uma página, sem build nem backend.
  return tags.length > 0 && tags.every((t) => STATIC_ONLY_STACK.has(t.trim().toLowerCase()));
}

/** O que entra na vitrine do portfólio. */
export function notableWorksOf(projects: Project[]): Project[] {
  return projects.filter((p) => !isMinorWork(p));
}
