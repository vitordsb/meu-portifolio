import type { DeckSectionId } from "./deck-content";
import { SOCIALS } from "./deck-content";

/**
 * O "vocabulário" da busca: o que a pessoa pode querer e as palavras que ela
 * provavelmente vai usar pra pedir. Quanto mais sinônimo aqui, mais esperta a
 * busca parece. Os dados do banco (projetos, skills, cursos) entram por cima,
 * direto na paleta.
 */

type L10n = { pt: string; en: string };

export type SearchAction =
  /** `anchor` rola até uma parte da sessão (ex.: Tecnologias em Especializações) */
  | { kind: "section"; id: DeckSectionId; anchor?: string }
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
    label: { pt: "Experiência", en: "Experience" },
    answer: {
      pt: "Empresas onde atuei e o que construí em cada time.",
      en: "Companies I worked at and what I built with each team.",
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
    action: { kind: "section", id: "experiencia" },
  },
  {
    id: "especializacoes",
    group: "navegar",
    icon: "sparkles",
    label: { pt: "Especializações", en: "Expertise" },
    answer: {
      pt: "UI/UX, front-end, apps mobile e produto ponta a ponta.",
      en: "UI/UX, front-end, mobile apps and end-to-end product.",
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
    action: { kind: "section", id: "especializacoes" },
  },
  {
    id: "tecnologias",
    group: "navegar",
    icon: "layers",
    label: { pt: "Tecnologias", en: "Stack" },
    answer: {
      pt: "React, Next.js, TypeScript, Node e o resto da caixa de ferramentas.",
      en: "React, Next.js, TypeScript, Node and the rest of the toolbox.",
    },
    keywords: [
      "tecnologias",
      "tecnologia",
      "stack",
      "linguagens",
      "linguagem",
      "ferramentas",
      "ferramenta",
      "habilidades",
      "skills",
      "frameworks",
      "framework",
      "sabe",
      "conhece",
      "domina",
      "tech",
      "tools",
      "languages",
      "react",
      "next",
      "nextjs",
      "typescript",
      "javascript",
      "node",
      "tailwind",
      "supabase",
      "postgres",
      "aws",
    ],
    action: { kind: "section", id: "especializacoes", anchor: "tecnologias" },
  },
  {
    id: "trajetoria",
    group: "navegar",
    icon: "route",
    label: { pt: "Trajetória", en: "Journey" },
    answer: {
      pt: "Por onde passei e o que construí em cada lugar.",
      en: "Where I've been and what I built at each place.",
    },
    keywords: [
      "trajetoria",
      "carreira",
      "historia",
      "quem",
      "vitor",
      "timeline",
      "anos",
      "senioridade",
      "career",
      "journey",
      "story",
    ],
    action: { kind: "section", id: "trajetoria" },
  },
  {
    id: "cursos",
    group: "navegar",
    icon: "award",
    label: { pt: "Cursos e certificados", en: "Courses and certificates" },
    answer: {
      pt: "Formação contínua: cursos, certificados e faculdade.",
      en: "Continuous learning: courses, certificates and college.",
    },
    keywords: [
      "cursos",
      "curso",
      "certificados",
      "certificado",
      "certificacoes",
      "formacao",
      "faculdade",
      "graduacao",
      "estudos",
      "estudou",
      "diploma",
      "courses",
      "certificates",
      "education",
      "degree",
    ],
    action: { kind: "section", id: "trajetoria", anchor: "cursos" },
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
    icon: "code",
    label: { pt: "Crie um software", en: "Build a software" },
    answer: {
      pt: "Me conta a ideia: orçamento sai rápido, por WhatsApp ou e-mail.",
      en: "Tell me the idea: quotes come fast, via WhatsApp or email.",
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
    ],
    action: {
      kind: "contact",
      subject: { pt: "Crie um software", en: "Build a software" },
    },
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
    id: "aprenda",
    group: "falar",
    icon: "graduation",
    label: { pt: "Aprenda comigo", en: "Learn with me" },
    answer: {
      pt: "Mentoria e aulas de front-end, do zero ao primeiro emprego.",
      en: "Front-end mentoring and classes, from zero to the first job.",
    },
    keywords: [
      "aprenda",
      "aprender",
      "aprendizado",
      "aula",
      "aulas",
      "mentoria",
      "mentor",
      "ensinar",
      "ensina",
      "professor",
      "estudar",
      "junior",
      "iniciante",
      "carreira dev",
      "learn",
      "teach",
      "mentoring",
      "classes",
    ],
    action: {
      kind: "contact",
      subject: { pt: "Aprenda comigo", en: "Learn with me" },
    },
  },
  {
    id: "whatsapp",
    group: "falar",
    icon: "message",
    label: { pt: "Chamar no WhatsApp", en: "Message on WhatsApp" },
    answer: {
      pt: "O jeito mais rápido de falar comigo.",
      en: "The fastest way to reach me.",
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
      pt: "Respondo em até 24h úteis.",
      en: "I reply within 24 business hours.",
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
    id: "linkedin",
    group: "falar",
    icon: "linkedin",
    label: { pt: "LinkedIn", en: "LinkedIn" },
    answer: {
      pt: "Perfil profissional completo.",
      en: "Full professional profile.",
    },
    keywords: ["linkedin", "linked", "perfil", "rede", "networking", "profile"],
    action: { kind: "link", href: SOCIALS.linkedin },
  },
  {
    id: "github",
    group: "falar",
    icon: "github",
    label: { pt: "GitHub", en: "GitHub" },
    answer: {
      pt: "Código aberto e repositórios.",
      en: "Open source and repositories.",
    },
    keywords: [
      "github",
      "git",
      "codigo",
      "repositorio",
      "repos",
      "open source",
      "code",
    ],
    action: { kind: "link", href: SOCIALS.github },
  },
  {
    id: "cv",
    group: "navegar",
    icon: "file",
    label: { pt: "Currículo", en: "Résumé" },
    answer: {
      pt: "Versão pra imprimir ou salvar em PDF.",
      en: "Printable, or save as PDF.",
    },
    keywords: [
      "cv",
      "curriculo",
      "resume",
      "pdf",
      "baixar",
      "download",
      "imprimir",
    ],
    action: { kind: "route", href: "/cv" },
  },
  {
    id: "sobre",
    group: "navegar",
    icon: "user",
    label: { pt: "Sobre mim", en: "About me" },
    answer: {
      pt: "Quem eu sou, formação e a linha do tempo inteira.",
      en: "Who I am, education and the full timeline.",
    },
    keywords: ["sobre", "quem", "bio", "biografia", "perfil", "about", "who"],
    action: { kind: "route", href: "/about" },
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
