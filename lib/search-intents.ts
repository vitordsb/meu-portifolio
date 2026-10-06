import { SOCIALS } from "./deck-content";

/**
 * O "vocabulário" da busca: o que a pessoa pode querer e as palavras que ela
 * provavelmente vai usar pra pedir. Quanto mais sinônimo aqui, mais esperta a
 * busca parece. Os dados do banco (projetos, skills, cursos) entram por cima,
 * direto na paleta.
 */

type L10n = { pt: string; en: string };

export type SearchAction =
  /** Sessão da home (lib/home-content HOME_SECTIONS); `anchor` rola até uma parte dela */
  | { kind: "section"; id: string; anchor?: string }
  | { kind: "contact"; subject?: L10n }
  | { kind: "link"; href: string }
  | { kind: "route"; href: string }
  | { kind: "theme" }
  | { kind: "language" };

export type SearchIntent = {
  id: string;
  group: "navegar" | "falar" | "preferencias";
  icon:
    | "folder"
    | "sparkles"
    | "layers"
    | "route"
    | "award"
    | "home"
    | "code"
    | "briefcase"
    | "graduation"
    | "message"
    | "mail"
    | "linkedin"
    | "github"
    | "file"
    | "theme"
    | "language"
    | "scan"
    | "user";
  label: L10n;
  /** A "resposta": aparece embaixo do rótulo, como se a busca entendesse. */
  answer: L10n;
  keywords: string[];
  action: SearchAction;
};

export const SEARCH_INTENTS: SearchIntent[] = [
  {
    id: "experiencia",
    group: "navegar",
    icon: "folder",
    label: { pt: "Projetos entregues", en: "Delivered projects" },
    answer: {
      pt: "Sites, sistemas e apps no ar, por tipo de projeto.",
      en: "Live websites, systems and apps, by project type.",
    },
    keywords: [
      "experiencia",
      "experiencias",
      "experience",
      "empresas",
      "empresa",
      "empregos",
      "emprego",
      "equipe",
      "time",
      "companies",
      "projetos",
      "projeto",
      "trabalhos",
      "trabalho",
      "jobs",
      "job",
      "portfolio",
      "cases",
      "case",
      "clientes",
      "cliente",
      "apps",
      "aplicativos",
      "sites",
      "sistemas",
      "produtos",
      "saas",
      "entregas",
      "feitos",
      "fez",
      "work",
      "projects",
      "clients",
      "products",
    ],
    action: { kind: "section", id: "projetos" },
  },
  {
    id: "especializacoes",
    group: "navegar",
    icon: "sparkles",
    label: { pt: "Serviços", en: "Services" },
    answer: {
      pt: "Sites, sistemas, apps, integrações, cloud e IA, com preço de partida.",
      en: "Websites, systems, apps, integrations, cloud and AI, with starting prices.",
    },
    keywords: [
      "especializacoes",
      "especialidade",
      "especialista",
      "servicos",
      "faz",
      "fazer",
      "area",
      "areas",
      "foco",
      "ux",
      "ui",
      "design",
      "designer",
      "frontend",
      "front",
      "mobile",
      "ios",
      "android",
      "expertise",
      "services",
    ],
    action: { kind: "section", id: "servicos" },
  },
  {
    id: "inicio",
    group: "navegar",
    icon: "home",
    label: { pt: "Voltar ao início", en: "Back to start" },
    answer: { pt: "O banner de abertura.", en: "The opening banner." },
    keywords: ["inicio", "home", "comeco", "topo", "banner", "start", "top"],
    action: { kind: "section", id: "inicio" },
  },
  {
    id: "criar",
    group: "falar",
    icon: "sparkles",
    label: { pt: "Orçamento com IA em 2 min", en: "AI quote in 2 min" },
    answer: {
      pt: "Conta a ideia pra assistente e veja a faixa de preço e prazo na hora.",
      en: "Tell the assistant your idea and see the price and timeline range right away.",
    },
    keywords: [
      "criar",
      "crie",
      "software",
      "contratar",
      "contrato",
      "orcamento",
      "preco",
      "valor",
      "custa",
      "quanto",
      "cobra",
      "freela",
      "freelance",
      "freelancer",
      "desenvolver",
      "desenvolvimento",
      "app",
      "site",
      "sistema",
      "build",
      "hire",
      "budget",
      "price",
      "quote",
      "cost",
      "ia",
      "ai",
      "estimativa",
      "estimate",
    ],
    action: { kind: "route", href: "/orcamento" },
  },
  {
    id: "raio-x",
    group: "falar",
    icon: "scan",
    label: { pt: "Raio-X grátis do seu site", en: "Free website check" },
    answer: {
      pt: "Cole o endereço e veja o que está afastando clientes no celular.",
      en: "Paste the address and see what's pushing customers away on mobile.",
    },
    keywords: [
      "raio",
      "raiox",
      "analise",
      "analisar",
      "auditoria",
      "diagnostico",
      "teste",
      "lento",
      "velocidade",
      "google",
      "seo",
      "meu site",
      "pagespeed",
      "lighthouse",
      "check",
      "audit",
      "slow",
      "speed",
    ],
    action: { kind: "route", href: "/raio-x" },
  },
  {
    id: "consultoria",
    group: "falar",
    icon: "briefcase",
    label: { pt: "Consultoria", en: "Consulting" },
    answer: {
      pt: "Revisão de UX, arquitetura de front-end e performance do seu produto.",
      en: "UX review, front-end architecture and performance for your product.",
    },
    keywords: [
      "consultoria",
      "consultor",
      "auditoria",
      "revisao",
      "review",
      "analise",
      "arquitetura",
      "performance",
      "otimizar",
      "melhorar",
      "conselho",
      "consulting",
      "advice",
      "audit",
    ],
    action: {
      kind: "contact",
      subject: { pt: "Consultoria", en: "Consulting" },
    },
  },
  {
    id: "whatsapp",
    group: "falar",
    icon: "message",
    label: { pt: "Chamar no WhatsApp", en: "Message on WhatsApp" },
    answer: {
      pt: "O jeito mais rápido de falar com a gente.",
      en: "The fastest way to reach us.",
    },
    keywords: [
      "whatsapp",
      "whats",
      "zap",
      "zapzap",
      "telefone",
      "celular",
      "numero",
      "conversar",
      "falar",
      "contato",
      "chat",
      "ligar",
      "phone",
      "call",
      "talk",
    ],
    action: { kind: "link", href: SOCIALS.whatsapp },
  },
  {
    id: "email",
    group: "falar",
    icon: "mail",
    label: { pt: "Mandar um e-mail", en: "Send an email" },
    answer: {
      pt: "Respondemos em até 24h úteis.",
      en: "We reply within 24 business hours.",
    },
    keywords: [
      "email",
      "e-mail",
      "mail",
      "contato",
      "mensagem",
      "escrever",
      "message",
      "contact",
    ],
    action: { kind: "contact" },
  },
  {
    id: "quanto-custa",
    group: "navegar",
    icon: "file",
    label: { pt: "Quanto custa um site ou app", en: "How much a website or app costs" },
    answer: {
      pt: "Guia com os valores de partida de cada tipo de projeto e o que muda o preço.",
      en: "Guide with starting prices for each type of project and what changes the price.",
    },
    keywords: ["quanto", "custa", "custo", "preco", "valor", "tabela", "guia", "cost", "price", "pricing"],
    action: { kind: "route", href: "/quanto-custa" },
  },
  {
    id: "servicos",
    group: "navegar",
    icon: "briefcase",
    label: { pt: "Serviços com preço fechado", en: "Fixed-price services" },
    answer: {
      pt: "Consultoria, revisão de UI/UX, landing page e site. Pague com Pix ou cartão.",
      en: "Consulting, UI/UX review, landing page and website. Pay with Pix or card.",
    },
    keywords: [
      "servicos",
      "servico",
      "pacote",
      "pacotes",
      "comprar",
      "contratar",
      "landing",
      "institucional",
      "revisao",
      "services",
      "package",
      "buy",
    ],
    action: { kind: "route", href: "/servicos" },
  },
  {
    id: "pagar",
    group: "navegar",
    icon: "file",
    label: { pt: "Pagar meu pedido", en: "Pay my order" },
    answer: {
      pt: "Já combinou um valor? Pague pelo número do pedido.",
      en: "Already agreed on a price? Pay by order number.",
    },
    keywords: [
      "pagar",
      "pagamento",
      "pedido",
      "fatura",
      "pix",
      "boleto",
      "pay",
      "payment",
      "order",
      "invoice",
    ],
    action: { kind: "route", href: "/pagar" },
  },
  {
    id: "tema",
    group: "preferencias",
    icon: "theme",
    label: { pt: "Trocar tema", en: "Change theme" },
    answer: {
      pt: "Claro, escuro ou automático.",
      en: "Light, dark or system.",
    },
    keywords: [
      "tema",
      "escuro",
      "claro",
      "dark",
      "light",
      "modo",
      "noturno",
      "cor",
      "theme",
      "mode",
    ],
    action: { kind: "theme" },
  },
  {
    id: "idioma",
    group: "preferencias",
    icon: "language",
    label: { pt: "Switch to English", en: "Mudar para português" },
    answer: { pt: "Change the language.", en: "Trocar o idioma." },
    keywords: [
      "idioma",
      "lingua",
      "ingles",
      "english",
      "portugues",
      "portuguese",
      "language",
      "traduzir",
      "translate",
    ],
    action: { kind: "language" },
  },
];
