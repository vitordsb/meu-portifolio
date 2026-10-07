"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COMPANIES, type Company } from "@/lib/companies";
import { HOME_SECTIONS } from "@/lib/home-content";
import { PROJECT_SHOTS } from "@/lib/project-shots";
import type { CatalogProject, ProjectType } from "@/lib/projects-catalog";
import { linkLabelFor, localizedStoreLink, storeCta, storeOf } from "@/lib/store-links";
import ClayMockup from "./ClayMockup";
import ProjectTile from "./ProjectTile";
import { Section, SectionHeader } from "./ui";

type Tab = "todos" | ProjectType;

// Do mais complexo ao mais simples (mesma ordem dos serviços)
const TABS: { id: Tab; pt: string; en: string }[] = [
  { id: "todos", pt: "Todos", en: "All" },
  { id: "app", pt: "Aplicativos", en: "Apps" },
  { id: "loja", pt: "Lojas virtuais", en: "Online stores" },
  { id: "sistema", pt: "Sistemas web", en: "Web systems" },
  { id: "site", pt: "Sites", en: "Websites" },
  { id: "landing", pt: "Landing pages", en: "Landing pages" },
];

/** Produtos que já aparecem nas linhas dos clientes (não repetem na grade). */
const IN_ROWS = new Set(COMPANIES.flatMap((c) => c.products.map((p) => p.slug).filter(Boolean)));

/**
 * Uma linha editorial por cliente (referência: apparicio.com): quem é, a
 * história numa frase, o problema, o que a gente fez e o projeto no mockup
 * de argila. Cliente com mais de um produto troca o mockup pelas abas.
 */
function ProjectRow({ company, pt }: { company: Company; pt: boolean }) {
  const language = pt ? "pt" : "en";
  const [active, setActive] = useState(0);
  const product = company.products[active];
  const link = product.link;
  const store = storeOf(link);

  return (
    <li id={`case-${company.id}`} className="grid scroll-mt-20 gap-8 border-t border-outline-variant py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 shrink-0 items-center rounded-lg border border-outline-variant bg-white px-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={company.logo} alt="" aria-hidden className="h-6 w-auto max-w-[6.5rem] object-contain" />
          </span>
          <h3 className="text-xl font-bold tracking-[-0.02em]">{company.name}</h3>
        </div>
        <p className="mt-3 text-sm text-on-surface-variant">
          {company.sector[language]} · {company.period}
        </p>
        {link ? (
          <a
            href={store ? localizedStoreLink(link, language) : link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-base font-medium underline-offset-4 hover:underline"
          >
            {store ? storeCta(store, language) : linkLabelFor(link)}
            <ArrowUpRight size={16} />
          </a>
        ) : (
          <p className="mt-4 inline-flex items-center gap-1.5 text-base text-on-surface-variant">
            <Lock size={14} />
            {pt ? "Projeto privado" : "Private project"}
          </p>
        )}
      </div>

      <div className="lg:col-span-4">
        {company.headline && (
          <p className="text-balance text-2xl font-medium leading-snug tracking-[-0.025em] md:text-[1.75rem]">
            {company.headline[language]}
          </p>
        )}
        <dl className="mt-6 space-y-4 text-base leading-relaxed">
          <div>
            <dt className="font-semibold">{pt ? "O problema" : "The problem"}</dt>
            <dd className="mt-1 text-on-surface-variant">{(company.problem ?? company.about)[language]}</dd>
          </div>
          <div>
            <dt className="font-semibold">{pt ? "O que a gente fez" : "What we did"}</dt>
            <dd className="mt-1 text-on-surface-variant">{company.role[language]}</dd>
          </div>
          {company.result && (
            <div>
              <dt className="font-semibold">{pt ? "Resultado" : "Result"}</dt>
              <dd className="mt-1 font-semibold">{company.result[language]}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="lg:col-span-5">
        {company.products.length > 1 && (
          <div className="mb-3 inline-flex rounded-none border border-outline-variant p-0.5">
            {company.products.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`h-9 rounded-none px-4 text-sm font-medium transition-colors ${
                  i === active ? "bg-on-surface text-surface" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {p.kind === "app" ? "App" : p.kind === "site" ? "Site" : pt ? "Plataforma" : "Platform"}
              </button>
            ))}
          </div>
        )}
        <div className="group">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={product.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ClayMockup
                shots={product.slug ? PROJECT_SHOTS[product.slug] : undefined}
                label={`${company.name}: ${product.title}`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </li>
  );
}

/**
 * Projetos entregues: as linhas dos 4 clientes com contrato e, embaixo, os
 * outros projetos numa grade com abas por tipo.
 */
export default function HomeProjects({ projects }: { projects: CatalogProject[] }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const section = HOME_SECTIONS.find((s) => s.id === "projetos")!;
  const [tab, setTab] = useState<Tab>("todos");

  const more = projects.filter((p) => !IN_ROWS.has(p.slug));
  const count = (id: Tab) => (id === "todos" ? more.length : more.filter((p) => p.type === id).length);
  const tabs = TABS.filter((t) => count(t.id) > 0);
  const list = tab === "todos" ? more : more.filter((p) => p.type === tab);

  return (
    <Section id="projetos" aliases={section.aliases}>
      <SectionHeader
        title={pt ? "Projetos entregues" : "Delivered projects"}
        lead={
          pt
            ? "O problema de cada cliente e o que a gente fez. Tudo no ar e em uso."
            : "Each client's problem and what we did. All live and in use."
        }
      />

      <ol className="border-b border-outline-variant">
        {COMPANIES.map((company) => (
          <ProjectRow key={company.id} company={company} pt={pt} />
        ))}
      </ol>

      <div className="mt-20 md:mt-24">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
          <h3 className="text-balance text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
            {pt ? "Mais projetos entregues" : "More delivered projects"}
          </h3>
          <LayoutGroup id="projetos-abas">
            <div
              role="tablist"
              aria-label={pt ? "Tipo de projeto" : "Project type"}
              className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:flex-wrap lg:justify-end lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((t) => {
                const on = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setTab(t.id)}
                    className={`relative inline-flex h-11 shrink-0 items-center gap-2 rounded-none border px-4 text-base transition-colors ${
                      on ? "border-transparent text-surface" : "border-outline-variant text-on-surface hover:border-on-surface/40"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="projetos-aba"
                        aria-hidden
                        className="absolute inset-0 rounded-none bg-on-surface"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    )}
                    <span className="relative">{t[language]}</span>
                    <span className={`relative text-sm ${on ? "opacity-70" : "text-on-surface-variant"}`}>{count(t.id)}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {list.map((p) => (
              <ProjectTile key={p.slug} project={p} pt={pt} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
