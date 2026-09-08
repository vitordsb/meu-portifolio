/**
 * Fallback de conteúdo pra quando não há banco.
 *
 * O site é alimentado pelo MySQL e editado em /admin, mas sem DATABASE_URL
 * (clone novo, preview sem env, banco fora do ar) as páginas ficariam vazias.
 * Aqui os mesmos seeds de portfolio-data.ts são adaptados aos tipos do schema,
 * com ids e timestamps sintéticos, e servidos no lugar de listas vazias.
 *
 * Regras:
 *   - É só leitura. Escrita sem banco continua falhando, como deve.
 *   - Os ids são negativos pra deixar claro que não vêm do banco e nunca
 *     colidirem com registros reais.
 */

import type {
  Project,
  Certificate,
  Skill,
  TimelineEvent,
  FreelanceWork,
} from "../drizzle/schema";
import {
  allWork,
  hardcodedSkills,
  hardcodedCertificates,
  hardcodedTimeline,
} from "./portfolio-data";

const NOW = new Date("2026-09-03T00:00:00Z");

/** Id sintético: negativo e estável dentro de cada coleção. */
const fakeId = (index: number) => -(index + 1);

export const fallbackProjects: Project[] = allWork.map((w, i) => ({
  id: fakeId(i),
  slug: w.slug,
  title: w.title,
  company: w.company,
  description: w.description,
  category: w.category,
  period: w.period ?? null,
  featured: w.featured,
  coverImageUrl: w.coverImageUrl,
  coverImageKey: null,
  liveLink: w.liveLink,
  repositoryLink: null,
  tags: w.stack,
  createdAt: NOW,
  updatedAt: NOW,
}));

export const fallbackSkills: Skill[] = hardcodedSkills.map((s, i) => ({
  id: fakeId(i),
  title: s.title,
  iconUrl: s.iconUrl,
  iconKey: null,
  category: s.category,
  level: s.level,
  projectSlugs: s.projectSlugs,
  createdAt: NOW,
  updatedAt: NOW,
}));

export const fallbackCertificates: Certificate[] = hardcodedCertificates.map((c, i) => ({
  id: fakeId(i),
  name: c.name,
  description: c.description,
  category: c.category,
  link: null,
  fileUrl: null,
  fileKey: null,
  tags: c.tags,
  createdAt: NOW,
  updatedAt: NOW,
}));

export const fallbackTimeline: TimelineEvent[] = hardcodedTimeline.map((t, i) => ({
  id: fakeId(i),
  dateLabel: t.dateLabel,
  sortDate: t.sortDate,
  title: t.title,
  description: t.description,
  category: t.category,
  icon: t.icon,
  createdAt: NOW,
  updatedAt: NOW,
}));

/**
 * Freelance sai dos próprios projetos: cada empresa com trabalho entregue vira
 * um item, com a stack agregada. Evita manter uma segunda lista à mão.
 */
export const fallbackFreelanceWork: FreelanceWork[] = allWork
  .filter((w) => w.company.toLowerCase().startsWith("cliente"))
  .map((w, i) => ({
    id: fakeId(i),
    company: w.title,
    companyLogoUrl: null,
    role: w.category,
    description: w.description,
    period: w.period ?? null,
    website: w.liveLink,
    tags: w.stack,
    displayOrder: i,
    createdAt: NOW,
    updatedAt: NOW,
  }));

/** Competências derivadas das tags, na mesma forma que getCompetencies() devolve. */
export function fallbackCompetencies(): { tag: string; count: number; percentage: number }[] {
  const freq: Record<string, number> = {};
  for (const item of [...fallbackProjects, ...fallbackCertificates]) {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    for (const tag of tags) freq[tag] = (freq[tag] ?? 0) + 1;
  }
  const max = Math.max(1, ...Object.values(freq));
  return Object.entries(freq)
    .map(([tag, count]) => ({ tag, count, percentage: Math.round((count / max) * 100) }))
    .sort((a, b) => b.count - a.count);
}
