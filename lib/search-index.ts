/**
 * Dados da busca (⌘K / ctrl + espaço) além do vocabulário de search-intents.
 *
 * Fixo, montado dos mesmos dados da home (lib/landing-data.ts): a busca acha
 * o que a página mostra, sem consultar banco e sem espera ao abrir.
 */

import { fallbackProjects } from "./fallback-data";
import { LANDING } from "./landing-data";

export type SearchIndex = {
  projects: {
    id: number;
    title: string;
    company: string;
    category: string;
    tags: string[];
    link: string | null;
  }[];
  skills: { id: number; title: string; category: string }[];
  certificates: {
    id: number;
    name: string;
    category: string;
    tags: string[];
    link: string | null;
  }[];
};

export const SEARCH_INDEX: SearchIndex = {
  projects: fallbackProjects.map((p) => ({
    id: p.id,
    title: p.title,
    company: p.company,
    category: p.category,
    tags: Array.isArray(p.tags) ? p.tags : [],
    link: p.liveLink ?? null,
  })),
  skills: LANDING.skills.map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category ?? "",
  })),
  certificates: LANDING.certificates.map((c) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    tags: Array.isArray(c.tags) ? c.tags : [],
    link: c.link ?? null,
  })),
};
