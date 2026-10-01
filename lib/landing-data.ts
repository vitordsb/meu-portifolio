/**
 * Conteúdo da home, fixo no código (mock), sem banco nem /admin.
 *
 * A home é landing de marketing e porta de entrada do ecossistema: o que ela
 * mostra é decidido aqui e em `deck-content.ts` / `companies.ts`, não no
 * painel. Por enquanto reaproveita os seeds de `portfolio-data.ts` (os mesmos
 * do fallback sem banco). As páginas internas (/about, /cv...) seguem no banco.
 */

import {
  fallbackCertificates,
  fallbackProjects,
  fallbackSkills,
} from "./fallback-data";

export const LANDING = {
  skills: fallbackSkills,
  certificates: fallbackCertificates,
  /** "projetos entregues" no banner. (A linha do tempo mora em lib/journey.ts) */
  projectCount: fallbackProjects.length,
};
