/**
 * Linha do tempo do painel "Conheça sobre mim" (etiqueta "Pessoal"), aberto
 * pela sessão Trajetória. Fixa no código, como o resto da home.
 *
 * Marcos e períodos informados pelo Vitor em 01/out/2026. A lista é exibida
 * do mais recente pro mais antigo (ordenada por `start`), igual à Experiência.
 */

type L10n = { pt: string; en: string };

export type JourneyKind = "trabalho" | "estudo" | "projetos";

export type JourneyItem = {
  id: string;
  kind: JourneyKind;
  /** AAAA-MM do início: só pra ordenar. */
  start: string;
  /** Ainda em andamento? Ganha destaque na linha. */
  current?: boolean;
  period: L10n;
  title: string;
  detail: L10n;
};

export const JOURNEY_KIND_LABEL: Record<JourneyKind, L10n> = {
  trabalho: { pt: "Trabalho", en: "Work" },
  estudo: { pt: "Estudo", en: "Education" },
  projetos: { pt: "Projetos", en: "Projects" },
};

const ITEMS: JourneyItem[] = [
  {
    id: "primeiros-projetos",
    kind: "projetos",
    start: "2021-01",
    period: { pt: "Jan/2021 - Dez/2022", en: "Jan/2021 - Dec/2022" },
    title: "Primeiros projetos",
    detail: { pt: "Onde tudo começou.", en: "Where it all started." },
  },
  {
    id: "egp",
    kind: "trabalho",
    start: "2022-01",
    period: { pt: "Jan/2022 - Dez/2023", en: "Jan/2022 - Dec/2023" },
    title: "Grupo EGP",
    detail: {
      pt: "Contrato como full-stack: sistemas internos, site e plataforma IoT.",
      en: "Full-stack contract: internal systems, website and IoT platform.",
    },
  },
  {
    id: "rio-branco",
    kind: "estudo",
    start: "2023-01",
    period: { pt: "Jan/2023 - Dez/2025", en: "Jan/2023 - Dec/2025" },
    title: "Faculdades Integradas Rio Branco, Cotia",
    detail: {
      pt: "Gestão de Sistemas de Informação.",
      en: "Information Systems Management.",
    },
  },
  {
    id: "arqdoor",
    kind: "trabalho",
    start: "2025-04",
    period: { pt: "Abr/2025 - Abr/2026", en: "Apr/2025 - Apr/2026" },
    title: "ArqDoor",
    detail: {
      pt: "Contrato no front-end do produto web e do app mobile.",
      en: "Front-end contract for the web product and the mobile app.",
    },
  },
  {
    id: "unifecaf",
    kind: "estudo",
    start: "2026-01",
    current: true,
    period: { pt: "Jan/2026 - Hoje", en: "Jan/2026 - Now" },
    title: "UniFECAF",
    detail: {
      pt: "Gestão da Tecnologia da Informação.",
      en: "Information Technology Management.",
    },
  },
  {
    id: "mtc",
    kind: "trabalho",
    start: "2026-04",
    current: true,
    period: { pt: "Abr/2026 - Hoje", en: "Apr/2026 - Now" },
    title: "MTC Prop",
    detail: {
      pt: "Contrato na área de membros, de ponta a ponta.",
      en: "Contract on the members area, end to end.",
    },
  },
  {
    id: "zuptos",
    kind: "trabalho",
    start: "2026-06",
    current: true,
    period: { pt: "Jun/2026 - Hoje", en: "Jun/2026 - Now" },
    title: "Zuptos",
    detail: {
      pt: "Contrato no front-end da plataforma de infoprodutos.",
      en: "Front-end contract on the digital products platform.",
    },
  },
];

/** Mais recente primeiro. */
export const JOURNEY: JourneyItem[] = [...ITEMS].sort((a, b) =>
  b.start.localeCompare(a.start),
);
