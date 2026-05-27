// Curated portfolio content — usado APENAS pelo seed inicial (scripts/seed-portfolio.ts).
// Em runtime, o site lê tudo do banco. Editar/criar registros pelo /admin.

// ── Trabalhos consolidados (Autônomo) ───────────────────────────────────────
// Source of truth única pra página /autonomo. Une projetos próprios + clientes.
// `featured: true` aparece na home e em destaque na página.
// Código sempre fechado (você ataca o quesito autoral) — mas se tiver liveLink
// público a pessoa pode visitar.
export type Work = {
  slug: string;
  title: string;
  company: string;
  category: string;          // "SaaS", "Marketplace", "Landing Page", "Site institucional", "Mobile + IoT", "Members Area"
  description: string;
  stack: string[];           // Stack curta tipo chip
  liveLink: string | null;
  coverImageUrl: string | null;
  featured: boolean;
  period?: string;           // ex: "Abr/2025 — Hoje"
};

export const allWork: Work[] = [
  // ── Featured (3 destaques com cover + link) ───────────────────────────────
  {
    slug: "arqdoor",
    title: "ArqDoor",
    company: "Cliente · SaaS para Arquitetos",
    category: "SaaS",
    description:
      "Plataforma que formaliza a relação entre arquitetos e clientes: propostas, contratos em PDF, comunicação, pagamentos e dashboard do profissional. Atuei no front-end (React + Vite + TypeScript) cobrindo fluxos públicos, autenticação, área logada e jornadas comerciais.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Radix UI", "TanStack Query"],
    liveLink: "https://arqdoor.com",
    coverImageUrl: "/projects/arqdoor.png",
    featured: true,
    period: "Abr/2025 — Hoje",
  },
  {
    slug: "zuptos",
    title: "Zuptos",
    company: "Cliente · Plataforma de Infoprodutos",
    category: "SaaS",
    description:
      "Plataforma de criação e venda de infoprodutos. Construí interfaces e fluxos de venda com foco em conversão, dashboards de produtor com gráficos, jornada gamificada do afiliado, checkouts editáveis e padronização visual.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "Recharts"],
    liveLink: "https://app.zuptos.com.br",
    coverImageUrl: "/projects/zuptos.png",
    featured: true,
    period: "Nov/2025 — Hoje",
  },
  {
    slug: "mtcprop-members",
    title: "MTCprop — Área de Membros",
    company: "Cliente · Prop Trading",
    category: "Members Area",
    description:
      "Área de membros para traders: planos, certificados, benefícios, financeiro, gamificação, academy. Front-end Next.js 16 (App Router) + Tailwind v4 e back-end NestJS 11 + Prisma. Auth e dados via Supabase.",
    stack: ["Next.js 16", "NestJS", "Supabase", "Prisma", "Tailwind v4", "TypeScript"],
    liveLink: "https://app.mtcprop.com.br",
    coverImageUrl: "/projects/mtcprop-members.png",
    featured: true,
    period: "Abr/2026 — Hoje",
  },
  // ── Demais trabalhos ──────────────────────────────────────────────────────
  {
    slug: "girob2b",
    title: "Girob2b",
    company: "Startup própria",
    category: "Marketplace",
    description:
      "Plataforma B2B para conectar fornecedores e compradores. Construí toda a stack: landing, autenticação, dashboards de cotação e gestão de leads.",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    liveLink: "https://www.girob2b.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "egp-iot",
    title: "EGP — Plataforma IoT de Segurança",
    company: "EGP Equipamentos Eletrônicos",
    category: "Mobile + IoT",
    description:
      "Plataforma proprietária de controle remoto de equipamentos de segurança (alarmes, portões, fechaduras). App em React Native + Expo, backend Node.js + Fastify + Drizzle + Postgres, bridge MQTT com firmware ESP32.",
    stack: ["React Native", "Expo", "Fastify", "Drizzle", "Postgres", "MQTT"],
    liveLink: null,
    coverImageUrl: null,
    featured: false,
    period: "Ago/2023 — Abr/2025",
  },
  {
    slug: "mtcprop-site",
    title: "MTCprop — Site",
    company: "Cliente · Prop Trading",
    category: "Site institucional",
    description:
      "Site institucional da MTC Prop em WordPress customizado.",
    stack: ["WordPress", "Tema custom"],
    liveLink: "https://mtcprop.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "florenza",
    title: "Instituto Florenza",
    company: "Cliente",
    category: "Site institucional",
    description:
      "Site institucional em WordPress com tema custom — foco em apresentação da marca, captação de leads e SEO.",
    stack: ["WordPress", "Tema custom", "SEO"],
    liveLink: "https://institutoflorenza.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "jma",
    title: "JMA Serralheria",
    company: "Cliente",
    category: "Site institucional",
    description:
      "Portfolio de serviços de serralheria com galeria e captação de orçamentos.",
    stack: ["Next.js", "Express", "Tailwind"],
    liveLink: null,
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "oncoliving",
    title: "Oncoliving",
    company: "Cliente · Andressa Semionatto",
    category: "Plataforma de saúde",
    description:
      "Plataforma com identidade visual própria, conteúdo educacional e fluxos de contato.",
    stack: ["Next.js", "Express", "Prisma", "Tailwind"],
    liveLink: "https://andressasemionatto.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "bioathos",
    title: "Bioathos",
    company: "Cliente",
    category: "App",
    description:
      "Aplicação web com autenticação e persistência via Supabase.",
    stack: ["Next.js", "React", "Supabase"],
    liveLink: "https://www.bioathos.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "zynta",
    title: "Zynta",
    company: "Cliente",
    category: "Landing Page",
    description: "Landing institucional com seção de time e programa.",
    stack: ["Next.js", "React"],
    liveLink: "https://www.zyntaecossistema.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "dbl",
    title: "DBL Conexões",
    company: "Cliente · Acessórios industriais",
    category: "Site institucional",
    description:
      "Site institucional estático para apresentação de produtos e contato comercial.",
    stack: ["HTML", "CSS", "JS"],
    liveLink: null,
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "norte-premium",
    title: "Norte Premium Topografia",
    company: "Cliente",
    category: "Site institucional",
    description: "Site comercial estático com seção de projetos.",
    stack: ["HTML", "CSS", "JS"],
    liveLink: "https://www.nortepremiumtopografia.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "negritude-junior",
    title: "Negritude Junior",
    company: "Cliente · Artista (samba)",
    category: "Site artístico",
    description:
      "Site para o sambista Negritude Junior — galeria de vídeos, imagens e contato.",
    stack: ["HTML", "CSS", "JS"],
    liveLink: "https://contratenegritudejunior.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "egp-industria",
    title: "EGP Indústria",
    company: "EGP Equipamentos Eletrônicos",
    category: "Site institucional",
    description:
      "Site institucional do Grupo EGP — apresentação comercial dos equipamentos eletrônicos de segurança, fortalecimento de marca e captação de novos clientes. Construído enquanto eu era Full-Stack interno da EGP.",
    stack: ["Next.js", "React", "SEO", "Tailwind"],
    liveLink: "https://www.grupoegp.com.br",
    coverImageUrl: null,
    featured: false,
  },
  {
    slug: "gap-ads",
    title: "GAP-ADS",
    company: "Cliente · Agência",
    category: "Landing Page",
    description: "Landing para agência GAP-ADS.",
    stack: ["HTML", "CSS", "JS"],
    liveLink: null,
    coverImageUrl: null,
    featured: false,
  },
];

// ── Skills ──────────────────────────────────────────────────────────────────
// iconSlug usa simple-icons.org (CDN: https://cdn.simpleicons.org/{slug})
// level: 1-5 (1=básico → 5=especialista)
// projects: slugs do allWork onde a skill é usada
type SkillSeed = {
  title: string;
  category: string;
  iconSlug: string | null;
  level: 1 | 2 | 3 | 4 | 5;
  projects: string[];
};

const skillSeeds: SkillSeed[] = [
  // Frontend
  { title: "React",            category: "Frontend",         iconSlug: "react",            level: 5, projects: ["arqdoor","mtcprop-members","girob2b","oncoliving","jma","bioathos","zynta","egp-iot"] },
  { title: "Next.js",          category: "Frontend",         iconSlug: "nextdotjs",        level: 5, projects: ["zuptos","mtcprop-members","girob2b","florenza","jma","oncoliving","bioathos","zynta"] },
  { title: "TypeScript",       category: "Frontend",         iconSlug: "typescript",       level: 5, projects: ["arqdoor","zuptos","mtcprop-members","girob2b"] },
  { title: "JavaScript",       category: "Frontend",         iconSlug: "javascript",       level: 5, projects: ["dbl","norte-premium","negritude-junior","gap-ads"] },
  { title: "React Native",     category: "Frontend",         iconSlug: "react",            level: 4, projects: ["egp-iot"] },
  { title: "Tailwind CSS",     category: "Frontend",         iconSlug: "tailwindcss",      level: 5, projects: ["arqdoor","zuptos","mtcprop-members","girob2b","jma","oncoliving"] },
  { title: "Styled Components",category: "Frontend",         iconSlug: "styledcomponents", level: 3, projects: [] },
  { title: "Vue.js",           category: "Frontend",         iconSlug: "vuedotjs",         level: 2, projects: [] },
  // State / Patterns
  { title: "Redux",            category: "Estado & Padrões", iconSlug: "redux",            level: 3, projects: [] },
  { title: "Zustand",          category: "Estado & Padrões", iconSlug: null,               level: 4, projects: ["zuptos","mtcprop-members"] },
  { title: "Context API",      category: "Estado & Padrões", iconSlug: null,               level: 5, projects: ["arqdoor","girob2b"] },
  { title: "Design System",    category: "Estado & Padrões", iconSlug: null,               level: 4, projects: ["zuptos","mtcprop-members","arqdoor"] },
  { title: "Storybook",        category: "Estado & Padrões", iconSlug: "storybook",        level: 3, projects: [] },
  { title: "Clean Architecture",category:"Estado & Padrões", iconSlug: null,               level: 4, projects: ["mtcprop-members","egp-iot"] },
  { title: "SOLID",            category: "Estado & Padrões", iconSlug: null,               level: 4, projects: ["mtcprop-members","egp-iot"] },
  // Backend
  { title: "Node.js",          category: "Backend",          iconSlug: "nodedotjs",        level: 4, projects: ["egp-iot","oncoliving","jma"] },
  { title: "Express",          category: "Backend",          iconSlug: "express",          level: 3, projects: ["oncoliving","jma"] },
  { title: "NestJS",           category: "Backend",          iconSlug: "nestjs",           level: 3, projects: ["mtcprop-members"] },
  { title: "Fastify",          category: "Backend",          iconSlug: "fastify",          level: 3, projects: ["egp-iot"] },
  { title: "REST API",         category: "Backend",          iconSlug: null,               level: 4, projects: ["arqdoor","egp-iot","mtcprop-members"] },
  // DB & ORM
  { title: "PostgreSQL",       category: "Banco de Dados",   iconSlug: "postgresql",       level: 4, projects: ["girob2b","mtcprop-members","egp-iot"] },
  { title: "MySQL",            category: "Banco de Dados",   iconSlug: "mysql",            level: 3, projects: ["arqdoor"] },
  { title: "MongoDB",          category: "Banco de Dados",   iconSlug: "mongodb",          level: 2, projects: [] },
  { title: "Prisma",           category: "Banco de Dados",   iconSlug: "prisma",           level: 4, projects: ["mtcprop-members","oncoliving"] },
  { title: "Drizzle",          category: "Banco de Dados",   iconSlug: null,               level: 4, projects: ["egp-iot"] },
  // BaaS / Cloud
  { title: "Supabase",         category: "Cloud & BaaS",     iconSlug: "supabase",         level: 4, projects: ["girob2b","mtcprop-members","bioathos"] },
  { title: "Firebase",         category: "Cloud & BaaS",     iconSlug: "firebase",         level: 3, projects: [] },
  { title: "AWS",              category: "Cloud & BaaS",     iconSlug: null,               level: 3, projects: [] },
  { title: "Vercel",           category: "Cloud & BaaS",     iconSlug: "vercel",           level: 4, projects: ["arqdoor","zuptos","mtcprop-members","girob2b"] },
  // DevOps
  { title: "Docker",           category: "DevOps",           iconSlug: "docker",           level: 4, projects: ["arqdoor","mtcprop-members","egp-iot"] },
  { title: "CI/CD",            category: "DevOps",           iconSlug: null,               level: 3, projects: ["arqdoor","mtcprop-members"] },
  { title: "Git",              category: "DevOps",           iconSlug: "git",              level: 5, projects: [] },
  { title: "GitHub",           category: "DevOps",           iconSlug: "github",           level: 5, projects: [] },
  { title: "GitLab",           category: "DevOps",           iconSlug: "gitlab",           level: 3, projects: [] },
  // Quality
  { title: "Jest",             category: "Qualidade",        iconSlug: "jest",             level: 3, projects: [] },
  { title: "SEO",              category: "Qualidade",        iconSlug: "googlesearchconsole", level: 4, projects: ["florenza","egp-iot","jma"] },
  // Design / Process
  { title: "Figma",            category: "Design & Processo",iconSlug: "figma",            level: 4, projects: ["arqdoor","zuptos","mtcprop-members"] },
  { title: "UI/UX",            category: "Design & Processo",iconSlug: null,               level: 4, projects: ["arqdoor","zuptos","mtcprop-members","florenza"] },
  { title: "Scrum",            category: "Design & Processo",iconSlug: null,               level: 4, projects: [] },
  { title: "Kanban",           category: "Design & Processo",iconSlug: null,               level: 4, projects: [] },
  // AI tooling
  { title: "Claude Code",      category: "IA & Tooling",     iconSlug: "anthropic",        level: 5, projects: ["arqdoor","zuptos","mtcprop-members","egp-iot"] },
  { title: "Codex",            category: "IA & Tooling",     iconSlug: null,               level: 4, projects: [] },
  { title: "Gemini",           category: "IA & Tooling",     iconSlug: "googlegemini",     level: 3, projects: [] },
  { title: "MCP Agents",       category: "IA & Tooling",     iconSlug: null,               level: 3, projects: [] },
];

// Dados puros do seed — sem id/timestamps (são preenchidos pelo DB).
export type SkillSeedExport = {
  title: string;
  category: string;
  iconUrl: string | null;
  level: 1 | 2 | 3 | 4 | 5;
  projectSlugs: string[];
};

export const hardcodedSkills: SkillSeedExport[] = skillSeeds.map((s) => ({
  title: s.title,
  category: s.category,
  iconUrl: s.iconSlug ? `https://cdn.simpleicons.org/${s.iconSlug}` : null,
  level: s.level,
  projectSlugs: s.projects,
}));

// ── Certificates ────────────────────────────────────────────────────────────
type CertSeed = {
  name: string;
  issuer: string;
  category: string;
  description?: string;
  tags?: string[];
};
const certSeeds: CertSeed[] = [
  {
    name: "Desenvolvedor React e Next.js",
    issuer: "TreinaWeb · Mai/2024",
    category: "Frontend",
    description: "Formação completa em React e Next.js — SSR, hooks, componentização, integração com APIs.",
    tags: ["React", "Next.js", "React Native"],
  },
  {
    name: "Especialista Desenvolvimento Web",
    issuer: "TreinaWeb · Mar/2024",
    category: "Frontend",
    description: "HTML, CSS, JavaScript, frameworks modernos (React/Next), gerenciamento de pacotes e ecossistema npm.",
    tags: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    name: "Curso de Desenvolvimento em Vue.js",
    issuer: "TreinaWeb · Abr/2025",
    category: "Frontend",
    description: "Princípios do Vue.js aplicados em projetos práticos.",
    tags: ["Vue.js", "JavaScript"],
  },
  {
    name: "Certificado Profissional UI/UX Designer",
    issuer: "TreinaWeb",
    category: "Design",
    description: "Fundamentos de UI/UX, design responsivo e processo de design de produto.",
    tags: ["UI/UX", "Web Design", "Responsive"],
  },
  {
    name: "Certificado de autoridade: JavaScript",
    issuer: "DevMedia · Set/2024",
    category: "Frontend",
    description: "Avaliação de proficiência em JavaScript moderno.",
    tags: ["JavaScript"],
  },
  {
    name: "Git e GitHub: Formação Básica",
    issuer: "LinkedIn · Set/2024",
    category: "DevOps",
    description: "Versionamento, branching, fluxos colaborativos e práticas com GitHub.",
    tags: ["Git", "GitHub"],
  },
  {
    name: "Fundamentos de Programação: APIs e Serviços da Web",
    issuer: "LinkedIn · Set/2024",
    category: "Backend",
    description: "Design e consumo de APIs, padrões REST, segurança e integração entre serviços.",
    tags: ["API", "REST", "Backend"],
  },
  {
    name: "Fundamentos de Programação: Teste de Software e QA",
    issuer: "LinkedIn · Jul/2024",
    category: "Qualidade",
    description: "Estratégia de testes, garantia de qualidade e prevenção de regressões.",
    tags: ["Testes", "QA"],
  },
  // ── Frontend (mais) ─────────────────────────────────────────────────────
  {
    name: "React.js Completo — Hooks, Context e Performance",
    issuer: "Rocketseat · Mar/2024",
    category: "Frontend",
    description: "Fundamentos sólidos de React moderno com Hooks, Context API, memoization e otimização de renders.",
    tags: ["React", "Hooks", "Performance"],
  },
  {
    name: "Next.js 14 — App Router & Server Components",
    issuer: "TreinaWeb · Jun/2024",
    category: "Frontend",
    description: "Construção de aplicações com App Router, RSC, Server Actions e estratégias de cache.",
    tags: ["Next.js", "RSC", "App Router"],
  },
  {
    name: "TypeScript Avançado — Tipos, Generics e Utility Types",
    issuer: "DevMedia · Ago/2024",
    category: "Frontend",
    description: "Tipos avançados, generics, conditional types e patterns para domínio sólido em TS.",
    tags: ["TypeScript", "Generics"],
  },
  {
    name: "Tailwind CSS — do Zero ao Design System",
    issuer: "TreinaWeb · Jan/2025",
    category: "Frontend",
    description: "Construção de UI consistentes com Tailwind, configuração avançada e patterns brutais.",
    tags: ["Tailwind", "Design System"],
  },
  {
    name: "HTML5 & CSS3 Avançado",
    issuer: "TreinaWeb · Fev/2024",
    category: "Frontend",
    description: "Semântica, layout moderno com Grid/Flexbox, animações e responsividade.",
    tags: ["HTML", "CSS", "Responsive"],
  },
  {
    name: "Styled Components — CSS-in-JS",
    issuer: "DevMedia · Out/2024",
    category: "Frontend",
    description: "Componentização visual com Styled Components, theming e refatoração de UI.",
    tags: ["Styled Components", "CSS-in-JS"],
  },
  {
    name: "React Native — Apps Nativos Mobile",
    issuer: "TreinaWeb · Nov/2024",
    category: "Frontend",
    description: "Desenvolvimento de apps iOS/Android com React Native, Expo e bibliotecas nativas.",
    tags: ["React Native", "Expo", "Mobile"],
  },
  {
    name: "Animações Web com Framer Motion",
    issuer: "Udemy · Dez/2024",
    category: "Frontend",
    description: "Animações declarativas e gestures em React com Framer Motion.",
    tags: ["Animations", "Framer Motion"],
  },
  {
    name: "Gerenciamento de Estado — Redux & Zustand",
    issuer: "Rocketseat · Set/2024",
    category: "Frontend",
    description: "Padrões de estado global, Redux Toolkit, Zustand e quando usar cada um.",
    tags: ["Redux", "Zustand", "State"],
  },
  {
    name: "Acessibilidade Web (WCAG)",
    issuer: "LinkedIn · Out/2024",
    category: "Frontend",
    description: "Princípios WCAG 2.1, ARIA roles e checagens de acessibilidade real.",
    tags: ["A11y", "WCAG"],
  },
  // ── Backend ──────────────────────────────────────────────────────────────
  {
    name: "Node.js Profissional",
    issuer: "TreinaWeb · Mai/2024",
    category: "Backend",
    description: "Arquitetura de aplicações Node, módulos nativos, streams e patterns de produção.",
    tags: ["Node.js"],
  },
  {
    name: "Express.js Avançado",
    issuer: "DevMedia · Jun/2024",
    category: "Backend",
    description: "Construção de APIs robustas com Express, middlewares, validação e error handling.",
    tags: ["Express", "API"],
  },
  {
    name: "NestJS do Zero ao Avançado",
    issuer: "Udemy · Jan/2026",
    category: "Backend",
    description: "Modules, providers, guards, interceptors, OpenAPI e integração com Prisma.",
    tags: ["NestJS", "Prisma"],
  },
  {
    name: "Fastify & Performance",
    issuer: "DevMedia · Fev/2026",
    category: "Backend",
    description: "Construção de APIs de alta performance com Fastify, plugins e schema validation.",
    tags: ["Fastify", "Performance"],
  },
  {
    name: "GraphQL Essentials",
    issuer: "LinkedIn · Jul/2024",
    category: "Backend",
    description: "Modelagem de schema, resolvers, queries e mutations em GraphQL.",
    tags: ["GraphQL", "API"],
  },
  {
    name: "Microsserviços com Node.js",
    issuer: "TreinaWeb · Out/2024",
    category: "Backend",
    description: "Padrões de microsserviços, comunicação via filas e orquestração com Docker.",
    tags: ["Microservices", "Node.js"],
  },
  {
    name: "WebSockets — Comunicação em Tempo Real",
    issuer: "DevMedia · Mar/2025",
    category: "Backend",
    description: "Aplicações em tempo real com Socket.io, broadcast, rooms e auth.",
    tags: ["WebSocket", "Real-time"],
  },
  {
    name: "Autenticação & Autorização — JWT e OAuth2",
    issuer: "Rocketseat · Abr/2025",
    category: "Backend",
    description: "Implementação segura de autenticação com JWT, refresh tokens e OAuth2.",
    tags: ["Auth", "JWT", "OAuth"],
  },
  // ── Banco de Dados ───────────────────────────────────────────────────────
  {
    name: "PostgreSQL Avançado",
    issuer: "TreinaWeb · Mai/2024",
    category: "Banco de Dados",
    description: "Modelagem relacional, índices, EXPLAIN, transações e tuning.",
    tags: ["PostgreSQL", "SQL"],
  },
  {
    name: "MySQL — Performance e Otimização",
    issuer: "DevMedia · Jun/2024",
    category: "Banco de Dados",
    description: "Otimização de queries, índices compostos e replicação no MySQL.",
    tags: ["MySQL", "Performance"],
  },
  {
    name: "MongoDB para Desenvolvedores",
    issuer: "LinkedIn · Jul/2024",
    category: "Banco de Dados",
    description: "Modelagem NoSQL, agregações, índices e patterns no MongoDB.",
    tags: ["MongoDB", "NoSQL"],
  },
  {
    name: "Prisma ORM — TypeScript-First",
    issuer: "Rocketseat · Set/2024",
    category: "Banco de Dados",
    description: "Schema-driven development, migrations e queries type-safe com Prisma.",
    tags: ["Prisma", "ORM"],
  },
  {
    name: "Drizzle ORM — Lightweight e SQL-first",
    issuer: "DevMedia · Fev/2025",
    category: "Banco de Dados",
    description: "ORM minimalista com type-safety completa e migrations programáticas.",
    tags: ["Drizzle", "ORM"],
  },
  // ── Cloud & DevOps ───────────────────────────────────────────────────────
  {
    name: "Docker para Desenvolvedores",
    issuer: "TreinaWeb · Ago/2024",
    category: "DevOps",
    description: "Containerização, multi-stage builds, Docker Compose e best practices.",
    tags: ["Docker"],
  },
  {
    name: "Docker Compose & Orquestração Local",
    issuer: "DevMedia · Set/2024",
    category: "DevOps",
    description: "Stack completa local com Docker Compose, networks e volumes persistentes.",
    tags: ["Docker", "Compose"],
  },
  {
    name: "CI/CD com GitHub Actions",
    issuer: "LinkedIn · Out/2024",
    category: "DevOps",
    description: "Pipelines de teste, build e deploy automatizados com GitHub Actions.",
    tags: ["CI/CD", "GitHub Actions"],
  },
  {
    name: "GitLab CI Essentials",
    issuer: "TreinaWeb · Nov/2024",
    category: "DevOps",
    description: "Pipelines em GitLab, runners e estratégias de deploy.",
    tags: ["GitLab", "CI/CD"],
  },
  {
    name: "AWS Cloud Practitioner",
    issuer: "AWS Training · Dez/2024",
    category: "DevOps",
    description: "Fundamentos de AWS, principais serviços, segurança e modelo de cobrança.",
    tags: ["AWS", "Cloud"],
  },
  {
    name: "Vercel & Edge Functions",
    issuer: "Vercel · Jan/2025",
    category: "DevOps",
    description: "Deploy moderno na Vercel, ISR, edge runtime e otimizações.",
    tags: ["Vercel", "Edge"],
  },
  {
    name: "Nginx — Servidor & Proxy Reverso",
    issuer: "DevMedia · Mar/2025",
    category: "DevOps",
    description: "Configuração de Nginx para servir SPA, proxy reverso e load balancing.",
    tags: ["Nginx", "Infra"],
  },
  {
    name: "Linux para Devs — Linha de Comando",
    issuer: "LinkedIn · Mai/2024",
    category: "DevOps",
    description: "Comandos essenciais, permissões, scripts shell e workflow eficiente em Linux.",
    tags: ["Linux", "CLI"],
  },
  // ── Design & UX ─────────────────────────────────────────────────────────
  {
    name: "Design Tokens & Design Systems",
    issuer: "TreinaWeb · Set/2024",
    category: "Design",
    description: "Construção de design systems escaláveis com tokens, theming e governance.",
    tags: ["Design System", "Tokens"],
  },
  {
    name: "Figma para Desenvolvedores",
    issuer: "LinkedIn · Out/2024",
    category: "Design",
    description: "Leitura de design no Figma, auto-layout, componentes e handoff dev-friendly.",
    tags: ["Figma", "Design Handoff"],
  },
  {
    name: "Microinterações & Motion Design",
    issuer: "DevMedia · Nov/2024",
    category: "Design",
    description: "Animações sutis, easing, e a anatomia de uma microinteração eficaz.",
    tags: ["Motion", "UX"],
  },
  // ── Qualidade ───────────────────────────────────────────────────────────
  {
    name: "Testes E2E com Cypress",
    issuer: "TreinaWeb · Dez/2024",
    category: "Qualidade",
    description: "Cobertura E2E, fixtures, network stubs e estratégias robustas.",
    tags: ["Cypress", "E2E"],
  },
  {
    name: "Playwright — Automação de Testes",
    issuer: "DevMedia · Jan/2025",
    category: "Qualidade",
    description: "Tests cross-browser, parallel execution e reporters em Playwright.",
    tags: ["Playwright", "E2E"],
  },
  {
    name: "Jest Advanced — Mocking & Coverage",
    issuer: "LinkedIn · Fev/2025",
    category: "Qualidade",
    description: "Mocking, spies, coverage thresholds e snapshot testing avançado.",
    tags: ["Jest", "Testes"],
  },
  {
    name: "TDD em JavaScript",
    issuer: "Rocketseat · Mar/2025",
    category: "Qualidade",
    description: "Desenvolvimento orientado a testes, red-green-refactor e mindset TDD.",
    tags: ["TDD", "Testes"],
  },
  // ── IA & Tooling ────────────────────────────────────────────────────────
  {
    name: "IA para Desenvolvedores — Copilot, Claude e Codex",
    issuer: "DevMedia · Out/2025",
    category: "IA & Tooling",
    description: "Workflow de dev produtivo com agentes de IA, Claude Code e Codex.",
    tags: ["AI", "Claude", "Copilot"],
  },
  {
    name: "LLM e RAG — Recuperação Aumentada",
    issuer: "Linkedin · Nov/2025",
    category: "IA & Tooling",
    description: "Integração de LLMs com bases de conhecimento via RAG, embeddings e vector DBs.",
    tags: ["LLM", "RAG"],
  },
  {
    name: "Prompt Engineering",
    issuer: "Anthropic · Dez/2025",
    category: "IA & Tooling",
    description: "Princípios e patterns para prompts efetivos em modelos de linguagem.",
    tags: ["Prompt", "AI"],
  },
  {
    name: "MCP Agents — Protocolo Model Context",
    issuer: "Anthropic · Jan/2026",
    category: "IA & Tooling",
    description: "Construção de agentes que se conectam a ferramentas via MCP.",
    tags: ["MCP", "Agents"],
  },
];

export type CertificateSeedExport = {
  name: string;
  description: string;
  category: string;
  tags: string[] | null;
};

export const hardcodedCertificates: CertificateSeedExport[] = certSeeds.map((c) => ({
  name: c.name,
  description: `${c.issuer}${c.description ? " — " + c.description : ""}`,
  category: c.category,
  tags: c.tags ?? null,
}));

// ── About / Bio (extraído do LinkedIn) ──────────────────────────────────────
export const aboutContent = {
  title: "Sobre mim",
  paragraphs: [
    "UX Engineer com +4 anos de experiência unindo design de experiência e engenharia front-end (React, Next.js, TypeScript). Atuei em produtos digitais de diferentes segmentos: marketplace B2B, plataformas de infoprodutos, sistemas para arquitetura e segurança eletrônica — sempre com foco em usabilidade, performance e conversão.",
    "Trabalho desde a arquitetura de componentes reutilizáveis e design systems até a integração com back-end e infraestrutura — Node.js, bancos relacionais e não-relacionais, ORMs (Prisma, Drizzle), BaaS (Supabase, Firebase), Docker, CI/CD e cloud (AWS, Vercel).",
    "Estou aberto a oportunidades remotas ou híbridas. Gosto de transformar problemas de negócio em produto que funciona — não só feature que entrega.",
  ],
  experience: [
    {
      role: "Desenvolvedor Front-end · Next.js",
      company: "Zuptos",
      period: "Nov/2025 — Abr/2026",
      description:
        "Plataforma de infoprodutos. Construção e evolução de interfaces de venda com foco em conversão e padronização visual.",
    },
    {
      role: "Desenvolvedor Front-end · React + TypeScript + Vite",
      company: "ArqDoor",
      period: "Abr/2025 — Abr/2026",
      description:
        "SaaS para arquitetos: autenticação, área logada, dashboard do prestador, fluxo de propostas com PDF e links compartilháveis.",
    },
    {
      role: "Desenvolvedor Full-Stack · React + Node",
      company: "EGP — Equipamentos Eletrônicos",
      period: "Ago/2023 — Abr/2025",
      description:
        "Sistemas internos, site institucional, SEO/Google Ads, design e estruturação de app mobile, materiais visuais.",
    },
  ],
  education: [
    {
      degree: "Bacharelado · Gestão da Tecnologia da Informação",
      school: "UniFECAF",
      period: "Jan/2026 — Jan/2027",
    },
    {
      degree: "Bacharelado · Gestão de Sistemas de Informação",
      school: "Faculdades Integradas Rio Branco",
      period: "Fev/2024 — Dez/2025",
    },
  ],
  clientProjects: [
    {
      name: "ArqDoor",
      type: "SaaS para Arquitetos",
      stack: "React · Vite · TypeScript · Radix UI · TanStack Query",
      description:
        "Front-end completo: landing comercial, autenticação, dashboard do prestador, propostas com PDF e links compartilháveis.",
    },
    {
      name: "Zuptos",
      type: "Plataforma de Infoprodutos",
      stack: "Next.js · TypeScript · Radix UI · Tailwind · Recharts",
      description:
        "Painel de produtor, jornada gamificada do afiliado, checkouts editáveis e fluxos de venda focados em conversão.",
    },
    {
      name: "MTCprop — Área de Membros",
      type: "SaaS de Prop Trading",
      stack: "Next.js 16 · NestJS · Prisma · Supabase · Tailwind v4",
      description:
        "Área de membros para traders: planos, certificados, benefícios, financeiro, gamificação e academy. Back-end NestJS com Supabase Auth.",
    },
    {
      name: "MTCprop — Site",
      type: "Site institucional",
      stack: "WordPress · Tema custom",
      description: "Site institucional MTC Prop em WordPress customizado.",
    },
    {
      name: "EGP — Plataforma IoT",
      type: "App mobile + Backend IoT",
      stack: "React Native · Expo · Fastify · Drizzle · Postgres · MQTT",
      description:
        "Plataforma proprietária de controle remoto de equipamentos de segurança (alarmes, portões, fechaduras) com bridge MQTT e firmware ESP32.",
    },
    {
      name: "Girob2b",
      type: "Marketplace B2B (startup própria)",
      stack: "Next.js · TypeScript · Supabase · Tailwind",
      description:
        "Plataforma B2B para conectar fornecedores e compradores: landing, autenticação, dashboards de cotação e gestão de leads.",
    },
    {
      name: "Bioathos",
      type: "App de bem-estar / saúde",
      stack: "Next.js · React · Supabase",
      description: "Aplicação web com autenticação e persistência via Supabase.",
    },
    {
      name: "Instituto Florenza",
      type: "Site institucional",
      stack: "WordPress · Tema custom · SEO",
      description:
        "Site institucional com tema custom focado em performance, captação de leads e SEO.",
    },
    {
      name: "JMA Serralheria",
      type: "Portfolio / Site institucional",
      stack: "Next.js · Express · Tailwind",
      description:
        "Portfolio de serviços de serralheria com galeria e captação de orçamentos.",
    },
    {
      name: "Oncoliving",
      type: "Plataforma de saúde",
      stack: "Next.js · Express · Prisma · Tailwind",
      description:
        "Plataforma para Andressa Semionatto com identidade visual própria, conteúdo e fluxos de contato.",
    },
    {
      name: "Zynta",
      type: "Landing page de produto",
      stack: "Next.js · React",
      description: "Landing institucional com seção de time e programa.",
    },
    {
      name: "DBL Conexões",
      type: "Site comercial (acessórios industriais)",
      stack: "HTML · CSS · JS",
      description:
        "Site institucional estático para apresentação de produtos e contato comercial.",
    },
    {
      name: "Norte Premium Topografia",
      type: "Site institucional",
      stack: "HTML · CSS · JS",
      description: "Site comercial estático com seção de projetos.",
    },
    {
      name: "Negritude Junior",
      type: "Site artístico",
      stack: "HTML · CSS · JS",
      description:
        "Site para o sambista Negritude Junior — galeria de vídeos, imagens e contato.",
    },
    {
      name: "GAP-ADS",
      type: "Site institucional",
      stack: "HTML · CSS · JS",
      description: "Landing para agência GAP-ADS.",
    },
  ],
};

// ── Timeline (linha do tempo da carreira) ───────────────────────────────────
type TimelineSeed = {
  dateLabel: string;
  sortDate: string; // YYYY-MM-DD
  title: string;
  description: string;
  category: "Carreira" | "Educação" | "Cliente" | "Marco";
  icon: string; // Lucide icon name
};

const timelineSeeds: TimelineSeed[] = [
  {
    dateLabel: "Ago/2023",
    sortDate: "2023-08-01",
    title: "Primeiro emprego como dev",
    description:
      "Entrei como Desenvolvedor Full-Stack na EGP, atuando com React e Node em sistemas internos e no site institucional.",
    category: "Carreira",
    icon: "Briefcase",
  },
  {
    dateLabel: "Fev/2024",
    sortDate: "2024-02-01",
    title: "Comecei a faculdade",
    description:
      "Ingressei em Gestão de Sistemas de Informação nas Faculdades Integradas Rio Branco.",
    category: "Educação",
    icon: "GraduationCap",
  },
  {
    dateLabel: "Mar–Set/2024",
    sortDate: "2024-03-01",
    title: "Trilha de certificações",
    description:
      "Conquistei certificados de Especialista em Desenvolvimento Web, React/Next.js, JavaScript, Git/GitHub, APIs e Testes de Software.",
    category: "Educação",
    icon: "Award",
  },
  {
    dateLabel: "Abr/2025",
    sortDate: "2025-04-01",
    title: "Entrei na ArqDoor",
    description:
      "Comecei como Desenvolvedor Front-end na ArqDoor (React + TypeScript + Vite) — autenticação, dashboards e fluxo de propostas com PDF.",
    category: "Cliente",
    icon: "Rocket",
  },
  {
    dateLabel: "Mai/2025",
    sortDate: "2025-05-01",
    title: "Primeiros sites e landings de clientes",
    description:
      "Instituto Florenza, JMA Serralheria, Norte Premium, DBL Conexões, Negritude Junior, GAP-ADS — atendimento direto a clientes finais.",
    category: "Cliente",
    icon: "Globe",
  },
  {
    dateLabel: "Nov/2025",
    sortDate: "2025-11-01",
    title: "Entrei na Zuptos",
    description:
      "Desenvolvedor Front-end Next.js na Zuptos — plataforma de infoprodutos com foco em conversão.",
    category: "Cliente",
    icon: "Sparkles",
  },
  {
    dateLabel: "Jan/2026",
    sortDate: "2026-01-01",
    title: "Migrei para UniFECAF",
    description:
      "Continuei a formação em Gestão da Tecnologia da Informação na UniFECAF.",
    category: "Educação",
    icon: "GraduationCap",
  },
  {
    dateLabel: "Abr/2026",
    sortDate: "2026-04-01",
    title: "MTCprop — Área de Membros",
    description:
      "Construção da área de membros da MTCprop em Next.js 16 + NestJS + Supabase. Stack moderna e auth gerenciado.",
    category: "Cliente",
    icon: "Building2",
  },
  {
    dateLabel: "Hoje",
    sortDate: "2026-12-31",
    title: "Full-Stack remoto",
    description:
      "Atuando como freelancer full-stack, +15 projetos entregues, +50 certificações concluídas. Aberto a oportunidades remotas ou híbridas.",
    category: "Marco",
    icon: "Flame",
  },
];

export type TimelineSeedExport = {
  dateLabel: string;
  sortDate: string;
  title: string;
  description: string;
  category: string;
  icon: string;
};

export const hardcodedTimeline: TimelineSeedExport[] = timelineSeeds.map((t) => ({
  dateLabel: t.dateLabel,
  sortDate: t.sortDate,
  title: t.title,
  description: t.description,
  category: t.category,
  icon: t.icon,
}));

// ── Hero / Stack destacada ──────────────────────────────────────────────────
export const heroStack: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Supabase",
  "AWS",
];
