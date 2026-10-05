/**
 * Conteúdo da home paginada (o "deck").
 *
 * A home deixou de ser uma página longa: cada sessão ocupa a tela inteira e a
 * paginação do rodapé troca entre elas. A ordem das sessões, os rótulos e o
 * texto que não vem do banco moram aqui.
 */

type L10n = { pt: string; en: string };

export type DeckSectionId =
  | "inicio"
  | "experiencia"
  | "especializacoes"
  | "trajetoria";

/** Ordem das sessões = ordem da paginação. O id vira o hash da URL (#experiencia). */
export const DECK_SECTIONS: { id: DeckSectionId; label: L10n }[] = [
  { id: "inicio", label: { pt: "Início", en: "Home" } },
  { id: "experiencia", label: { pt: "Experiência", en: "Experience" } },
  { id: "especializacoes", label: { pt: "Especializações", en: "Expertise" } },
  { id: "trajetoria", label: { pt: "Trajetória", en: "Journey" } },
];

/**
 * Portas de venda do menu ("Trabalhe comigo"). `quote` marca o orçamento com
 * IA: o menu lateral do desktop não repete ele, que já é o botão do banner.
 */
export const WORK_LINKS: { href: string; label: L10n; quote?: boolean }[] = [
  { href: "/servicos", label: { pt: "Serviços e preços", en: "Services" } },
  { href: "/orcamento", label: { pt: "Orçamento com IA", en: "AI quote" }, quote: true },
  { href: "/raio-x", label: { pt: "Raio-X grátis do site", en: "Free site check" } },
  { href: "/pagar", label: { pt: "Pagar pedido", en: "Pay order" } },
];

/**
 * Partes de uma sessão que têm link próprio: `/#tecnologias` abre
 * Especializações rolada até Tecnologias; `/#cursos`, Trajetória até Cursos.
 */
export const SECTION_ANCHORS: Record<string, DeckSectionId> = {
  tecnologias: "especializacoes",
  cursos: "trajetoria",
};

export const HERO = {
  /** Cargo acima do título: dá a confiança ("constrói software"); o título
   *  grande segue sendo a especialidade, que é o gancho. Em teste desde
   *  01/out/2026: pra voltar, apague `role` e restaure a tagline anterior. */
  role: { pt: "Engenheiro de software", en: "Software engineer" },
  lines: ["UI/UX", "Front-end"],
  name: "Vitor de Souza",
  /** Uma linha: o resultado que eu entrego, não a função.
   *  Anterior: "Interfaces que convertem, do Figma ao deploy." /
   *  "Interfaces that convert, from Figma to deploy." */
  tagline: {
    pt: "Do Figma ao deploy: software completo, com obsessão pela experiência do usuário.",
    en: "From Figma to deploy: complete software, obsessed with user experience.",
  },
  /** Anos de carreira, igual à bio ("+5 anos"). Projetos e cursos vêm do banco. */
  years: 5,
};

/**
 * Os três serviços do banner: as portas do ecossistema. Cada um vai levar pra
 * um produto próprio (ainda por nascer). Enquanto `href` estiver vazio, o
 * botão abre o contato com o serviço no assunto; preenchido, vira link.
 */
export const SERVICES: {
  key: string;
  label: L10n;
  primary?: boolean;
  /** Destino do produto do ecossistema. Vazio = abre o contato. */
  href?: string;
}[] = [
  // "Aprenda comigo" e "Consultoria" saíram em 02/out/2026: consultoria
  // virou pacote em /servicos; "Aprenda comigo" volta quando o produto de
  // cursos existir.
  {
    key: "services",
    label: { pt: "Serviços e preços", en: "Services & pricing" },
    href: "/servicos",
  },
  {
    key: "build",
    // Era "Crie um software" (abria o contato). Desde 01/out/2026 leva pro
    // orçamento com IA: vende mais que um formulário.
    label: { pt: "Orçamento com IA em 2 min", en: "AI quote in 2 min" },
    primary: true,
    href: "/orcamento",
  },
];

export const SOCIALS = {
  linkedin: "https://www.linkedin.com/in/vitordsb",
  github: "https://github.com/vitordsb",
  whatsapp: "https://wa.me/5511939572807",
};

export const SPECIALTIES: { title: L10n; body: L10n; tags: string[] }[] = [
  {
    title: { pt: "UI/UX Design", en: "UI/UX Design" },
    body: {
      pt: "Fluxo, protótipo e teste antes da primeira linha de código. Design system que o time consegue manter depois que eu saio.",
      en: "Flows, prototypes and testing before the first line of code. A design system the team can keep alive after I leave.",
    },
    tags: ["Figma", "Design System", "Acessibilidade", "Prototipação"],
  },
  {
    title: { pt: "Engenharia Front-end", en: "Front-end Engineering" },
    body: {
      pt: "Interfaces em React e Next.js rápidas, tipadas e acessíveis, com arquitetura de componentes que aguenta o produto crescer.",
      en: "Fast, typed and accessible React and Next.js interfaces, with a component architecture that holds as the product grows.",
    },
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    title: { pt: "Apps mobile", en: "Mobile apps" },
    body: {
      pt: "Apps em React Native e Expo, do wireframe à loja, dividindo código e design system com a versão web.",
      en: "React Native and Expo apps, from wireframe to store, sharing code and design system with the web version.",
    },
    tags: ["React Native", "Expo", "iOS", "Android"],
  },
  {
    title: { pt: "Produto ponta a ponta", en: "End-to-end product" },
    body: {
      pt: "Da interface ao banco: integração com back-end, autenticação, deploy e observabilidade pra feature chegar inteira em produção.",
      en: "From interface to database: back-end integration, auth, deploy and observability so features ship whole.",
    },
    tags: ["Node.js", "Supabase", "PostgreSQL", "AWS"],
  },
];

export function l(text: L10n, language: "pt" | "en"): string {
  return text[language];
}
