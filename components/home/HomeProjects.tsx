"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { COMPANIES } from "@/lib/companies";
import { HOME_SECTIONS } from "@/lib/home-content";
import CompanyCard from "@/components/deck/CompanyCard";
import { Reveal, Section, SectionHeader } from "./ui";

/** Projetos entregues: os 4 contratos PJ, com o produto no ar. */
export default function HomeProjects() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const section = HOME_SECTIONS.find((s) => s.id === "projetos")!;

  return (
    <Section id="projetos" aliases={section.aliases} className="bg-surface-low/40">
      <SectionHeader
        eyebrow={pt ? "Projetos" : "Projects"}
        title={pt ? "Projetos entregues" : "Delivered projects"}
        lead={
          pt
            ? "Tudo no ar e em uso pelos clientes. Abra cada produto pra ver de perto."
            : "All live and used by our clients. Open each product to see it up close."
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        {COMPANIES.map((company, i) => (
          <Reveal key={company.id} delay={0.06 * i} className="flex">
            <CompanyCard company={company} language={language} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
