"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { COMPANIES } from "@/lib/companies";
import { Rise } from "../Reveal";
import { SlideFrame, SlideHeader } from "../SlideFrame";
import CompanyCard from "../CompanyCard";

/**
 * Experiência: um card por empresa, falando da empresa e não da stack. Dados
 * fixos em `lib/companies.ts` (a home é landing, não lê o banco).
 */
export default function ExperienceSlide({ title }: { title: string }) {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <SlideFrame>
      <SlideHeader
        title={title}
        lead={
          pt
            ? "Empresas onde atuei e o que construí em cada time. Tudo no ar: alterne entre as versões e abra o produto pra ver de perto."
            : "Companies I worked at and what I built with each team. All live: switch between versions and open the product to see it up close."
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 3xl:grid-cols-4">
        {COMPANIES.map((company, i) => (
          <Rise key={company.id} step={2 + i * 0.35} className="flex">
            <CompanyCard company={company} language={language} />
          </Rise>
        ))}
      </div>
    </SlideFrame>
  );
}
