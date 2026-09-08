"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  pt: {
    nav: {
      home: "Início",
      about: "Sobre",
      autonomo: "Portfólio",
      skills: "Skills",
      certificates: "Cursos",
      contact: "Contato",
      competencies: "Competências",
      github: "GitHub",
      admin: "Admin",
    },
    hero: {
      tag: "Frontend Engineer",
      name: "Vitor de\nSouza Barreto",
      description:
        "Frontend Engineer que une design de experiência e engenharia: interfaces de alta performance, acessíveis e pensadas pra converter. Onde código encontra usabilidade.",
      cta1: "Ver projetos",
      cta2: "Entrar em contato",
      stack: "Stack principal",
      clients: "Trabalharam comigo",
      stats: {
        years: "anos de experiência",
        projects: "projetos entregues",
      },
    },
    home: {
      featuredTag: "Destaque",
      featuredTitle: "Projetos em destaque",
      jobsTag: "Trabalhos atuais",
      jobsTitle: "Jobs",
      jobsAll: "Todos",
      ownTag: "Autoral",
      ownTitle: "Projetos próprios",
      ownDescription:
        "Produtos que eu toco do zero: ideia, produto, código e deploy.",
      seeAll: "Ver todos",
      ctaTitle: "Vamos construir algo juntos?",
      ctaDescription:
        "Aberto a oportunidades remotas ou híbridas: front-end, full-stack ou consultoria pontual.",
      ctaContact: "Entrar em contato",
      ctaWorks: "Ver trabalhos",
    },
    about: {
      title: "Sobre mim",
      p1: "Frontend Engineer com +5 anos de experiência, unindo design de experiência e engenharia de interface (React, Next.js, TypeScript). Atuei em produtos digitais de diferentes segmentos: marketplace B2B, plataformas de infoprodutos, sistemas para arquitetura e segurança eletrônica, sempre com foco em usabilidade, performance e conversão.",
      p2: "Trabalho desde a arquitetura de componentes reutilizáveis e design systems até a integração com back-end e infraestrutura: Node.js, bancos relacionais e não-relacionais, ORMs (Prisma, Drizzle), BaaS (Supabase, Firebase), Docker, CI/CD e cloud (AWS, Vercel).",
      p3: "Estou aberto a oportunidades remotas ou híbridas. Gosto de transformar problemas de negócio em produto que funciona, não só feature que entrega.",
      education: "Formação",
    },
    timeline: {
      tag: "Linha do tempo",
      title: "Minha história",
      scrollHint: "Arraste ou role para navegar",
      empty: "Nenhum marco cadastrado ainda.",
      categories: {
        Carreira: "Carreira",
        "Educação": "Educação",
        Cliente: "Cliente",
        Marco: "Marco",
      },
      // Eventos hardcoded indexados por sortDate. DB events usam texto cru.
      events: {
        "2023-08-01": { title: "Primeiro emprego como dev", description: "Entrei como Desenvolvedor Full-Stack na EGP, atuando com React e Node em sistemas internos e no site institucional." },
        "2024-02-01": { title: "Comecei a faculdade", description: "Ingressei em Gestão de Sistemas de Informação nas Faculdades Integradas Rio Branco." },
        "2024-03-01": { title: "Trilha de certificações", description: "Conquistei certificados de Especialista em Desenvolvimento Web, React/Next.js, JavaScript, Git/GitHub, APIs e Testes de Software." },
        "2025-04-01": { title: "Entrei na ArqDoor", description: "Comecei como Desenvolvedor Front-end na ArqDoor (React + TypeScript + Vite): autenticação, dashboards e fluxo de propostas com PDF." },
        "2025-05-01": { title: "Primeiros sites e landings de clientes", description: "Instituto Florenza, JMA Serralheria, Norte Premium, DBL Conexões, Negritude Junior, GAP-ADS. Atendimento direto a clientes finais." },
        "2025-11-01": { title: "Entrei na Zuptos", description: "Desenvolvedor Front-end Next.js na Zuptos, plataforma de infoprodutos com foco em conversão." },
        "2026-01-01": { title: "Migrei para UniFECAF", description: "Continuei a formação em Gestão da Tecnologia da Informação na UniFECAF." },
        "2026-04-01": { title: "MTCprop: Área de Membros", description: "Construção da área de membros da MTCprop em Next.js 16 + NestJS + Supabase. Stack moderna e auth gerenciado." },
        "2026-12-31": { title: "Full-Stack remoto", description: "Atuando como freelancer full-stack, +15 projetos entregues, +50 certificações concluídas. Aberto a oportunidades remotas ou híbridas." },
      } as Record<string, { title: string; description: string }>,
    },
    autonomo: {
      tag: "Portfólio",
      title: "Experiências digitais que entreguei",
      subtitle:
        "{count} projetos entregues, da interface ao backend, para startups e empresas reais. Código-fonte sob NDA, mas você pode visitar o produto final quando disponível.",
      contact: "Entrar em contato",
      featured: "Destaque",
      all: "Todos",
      allTag: "Todos ({count})",
      private: "Privado",
      privateTitle: "Código-fonte privado",
      noLink: "Sem link público disponível",
    },
    competencies: {
      title: "Competências",
      subtitle: "Baseado na frequência de uso nos projetos e certificados",
      empty: "Nenhuma competência mapeada ainda.",
      projects: "projetos",
    },
    skills: {
      title: "Skills e tecnologias",
      empty: "Nenhuma skill cadastrada ainda.",
      categories: {
        Frontend: "Frontend",
        "Estado & Padrões": "Estado & Padrões",
        Backend: "Backend",
        "Banco de Dados": "Banco de Dados",
        "Cloud & BaaS": "Cloud & BaaS",
        DevOps: "DevOps",
        Qualidade: "Qualidade",
        "Design & Processo": "Design & Processo",
        "IA & Tooling": "IA & Tooling",
      } as Record<string, string>,
    },
    certificates: {
      title: "Cursos",
      all: "Todos",
      empty: "Nenhum curso cadastrado ainda.",
      view: "Ver",
      link: "Link",
    },
    contact: {
      title: "Vamos conversar?",
      description:
        "Tenho interesse em trabalhar em projetos desafiadores e fazer parte de times inovadores.",
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
    common: {
      theme: {
        label: "Tema",
        light: "Claro",
        dark: "Escuro",
        system: "Automático",
      },
      language: "Idioma",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      autonomo: "Portfolio",
      skills: "Skills",
      certificates: "Courses",
      contact: "Contact",
      competencies: "Competencies",
      github: "GitHub",
      admin: "Admin",
    },
    hero: {
      tag: "Frontend Engineer",
      name: "Vitor de\nSouza Barreto",
      description:
        "Frontend Engineer bridging experience design and engineering: high-performance, accessible interfaces built to convert. Where code meets usability.",
      cta1: "View projects",
      cta2: "Get in touch",
      stack: "Main stack",
      clients: "Worked with",
      stats: {
        years: "years of experience",
        projects: "projects shipped",
      },
    },
    home: {
      featuredTag: "Highlights",
      featuredTitle: "Featured projects",
      jobsTag: "Current work",
      jobsTitle: "Jobs",
      jobsAll: "All",
      ownTag: "Personal",
      ownTitle: "Own projects",
      ownDescription:
        "Products I run from scratch: idea, product, code and deploy.",
      seeAll: "See all",
      ctaTitle: "Let's build something together?",
      ctaDescription:
        "Open to remote or hybrid opportunities: front-end, full-stack or consulting.",
      ctaContact: "Get in touch",
      ctaWorks: "View work",
    },
    about: {
      title: "About me",
      p1: "Frontend Engineer with 5+ years of experience, bridging experience design and interface engineering (React, Next.js, TypeScript). I've shipped digital products across many domains (B2B marketplaces, infoproduct platforms, architecture and electronic security systems), always focused on usability, performance and conversion.",
      p2: "I work from reusable components and design systems all the way to back-end and infrastructure: Node.js, relational and non-relational databases, ORMs (Prisma, Drizzle), BaaS (Supabase, Firebase), Docker, CI/CD and cloud (AWS, Vercel).",
      p3: "I'm open to remote or hybrid opportunities. I like turning business problems into products that work, not just features that ship.",
      education: "Education",
    },
    timeline: {
      tag: "Timeline",
      title: "My story",
      scrollHint: "Drag or scroll to navigate",
      empty: "No milestones yet.",
      categories: {
        Carreira: "Career",
        "Educação": "Education",
        Cliente: "Client",
        Marco: "Milestone",
      },
      events: {
        "2023-08-01": { title: "First dev job", description: "Joined EGP as Full-Stack Developer, working with React and Node on internal systems and the company website." },
        "2024-02-01": { title: "Started college", description: "Enrolled in Information Systems Management at Faculdades Integradas Rio Branco." },
        "2024-03-01": { title: "Certification track", description: "Earned certificates in Web Development Specialist, React/Next.js, JavaScript, Git/GitHub, APIs and Software Testing." },
        "2025-04-01": { title: "Joined ArqDoor", description: "Started as Front-end Developer at ArqDoor (React + TypeScript + Vite): auth, dashboards and a proposal flow with PDF." },
        "2025-05-01": { title: "First client sites & landings", description: "Instituto Florenza, JMA Serralheria, Norte Premium, DBL Conexões, Negritude Junior, GAP-ADS. Direct work with end clients." },
        "2025-11-01": { title: "Joined Zuptos", description: "Next.js Front-end Developer at Zuptos, an infoproduct platform focused on conversion." },
        "2026-01-01": { title: "Moved to UniFECAF", description: "Continued my education in IT Management at UniFECAF." },
        "2026-04-01": { title: "MTCprop: Members Area", description: "Built MTCprop's members area in Next.js 16 + NestJS + Supabase. Modern stack with managed auth." },
        "2026-12-31": { title: "Remote Full-Stack", description: "Working as full-stack freelancer, 15+ projects shipped, 50+ certifications. Open to remote or hybrid opportunities." },
      } as Record<string, { title: string; description: string }>,
    },
    autonomo: {
      tag: "Portfolio",
      title: "Digital experiences I've shipped",
      subtitle:
        "{count} projects shipped, from interface to backend, for real startups and companies. Source code under NDA, but you can visit the live product when available.",
      contact: "Get in touch",
      featured: "Highlights",
      all: "All",
      allTag: "All ({count})",
      private: "Private",
      privateTitle: "Source code under NDA",
      noLink: "No public link available",
    },
    competencies: {
      title: "COMPETENCIES",
      subtitle: "Based on usage frequency across projects and certificates",
      empty: "No competencies mapped yet.",
      projects: "projects",
    },
    skills: {
      title: "Skills and technologies",
      empty: "No skills added yet.",
      categories: {
        Frontend: "Frontend",
        "Estado & Padrões": "State & Patterns",
        Backend: "Backend",
        "Banco de Dados": "Databases",
        "Cloud & BaaS": "Cloud & BaaS",
        DevOps: "DevOps",
        Qualidade: "Quality",
        "Design & Processo": "Design & Process",
        "IA & Tooling": "AI & Tooling",
      } as Record<string, string>,
    },
    certificates: {
      title: "COURSES",
      all: "ALL",
      empty: "No courses added yet.",
      view: "View",
      link: "Link",
    },
    contact: {
      title: "Let's talk?",
      description:
        "I'm interested in challenging projects and being part of innovative teams.",
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
    common: {
      theme: {
        label: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      language: "Language",
    },
  },
};

function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "pt";
  const lang = navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("pt")) return "pt";
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default = pt no SSR pra evitar hydration mismatch. useEffect troca pra browser-detected.
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved === "pt" || saved === "en") {
      setLanguage(saved);
    } else {
      setLanguage(detectBrowserLanguage());
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];
    for (const k of keys) value = value?.[k];
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
