"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { COMPANIES } from "@/lib/companies";
import { HOME_SECTIONS } from "@/lib/home-content";
import type { CatalogProject, ProjectType } from "@/lib/projects-catalog";
import CompanyCard from "@/components/deck/CompanyCard";
import ProjectTile from "./ProjectTile";
import { Reveal, Section, SectionHeader } from "./ui";

type Tab = "destaques" | ProjectType;

const TABS: { id: Tab; pt: string; en: string }[] = [
  { id: "destaques", pt: "Destaques", en: "Highlights" },
  { id: "sistema", pt: "Sistemas web", en: "Web systems" },
  { id: "site", pt: "Sites", en: "Websites" },
  { id: "landing", pt: "Landing pages", en: "Landing pages" },
  { id: "app", pt: "Aplicativos", en: "Apps" },
  { id: "loja", pt: "Lojas virtuais", en: "Online stores" },
];

/**
 * Projetos entregues com abas por tipo. "Destaques" são os 4 contratos (card
 * completo, com o que foi entregue); as outras abas listam o catálogo
 * inteiro daquele tipo. Aba sem projeto não aparece.
 */
export default function HomeProjects({ projects }: { projects: CatalogProject[] }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const section = HOME_SECTIONS.find((s) => s.id === "projetos")!;
  const [tab, setTab] = useState<Tab>("destaques");

  const count = (id: Tab) => (id === "destaques" ? COMPANIES.length : projects.filter((p) => p.type === id).length);
  const tabs = TABS.filter((t) => count(t.id) > 0);
  const list = tab === "destaques" ? [] : projects.filter((p) => p.type === tab);

  return (
    <Section id="projetos" aliases={section.aliases} className="bg-surface-low/40">
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
        <SectionHeader
          className="lg:shrink-0"
          eyebrow={pt ? "Projetos" : "Projects"}
          title={pt ? "Projetos entregues" : "Delivered projects"}
          lead={
            pt
              ? "Tudo no ar e em uso pelos clientes. Escolha o tipo de projeto."
              : "All live and used by our clients. Pick a project type."
          }
        />

        {/* Abas: ao lado do título no desktop, embaixo dele no celular */}
        <Reveal className="mb-10 md:mb-14 lg:min-w-0">
          <LayoutGroup id="projetos-abas">
            <div
              role="tablist"
              aria-label={pt ? "Tipo de projeto" : "Project type"}
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:justify-end lg:px-0 [&::-webkit-scrollbar]:hidden"
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
                    className={`relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-base transition-colors ${
                      on ? "border-transparent text-surface" : "border-outline-variant text-on-surface hover:border-on-surface/40"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="projetos-aba"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-on-surface"
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
        </Reveal>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "destaques" ? (
            <div className="grid gap-5 md:grid-cols-2">
              {COMPANIES.map((company) => (
                <div key={company.id} className="flex">
                  <CompanyCard company={company} language={language} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <ProjectTile key={p.slug} project={p} pt={pt} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
