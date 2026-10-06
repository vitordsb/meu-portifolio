"use client";

import Link from "next/link";
import { CircleCheck, Code, LayoutGrid, Sparkles, Users, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ENGAGEMENTS } from "@/lib/home-content";
import { Reveal, Section, SectionHeader } from "./ui";

const ICONS: Record<string, LucideIcon> = {
  especialista: Code,
  equipe: Users,
  completo: LayoutGrid,
};

/**
 * Formatos de contratação: 1 especialista, equipe de 2 a 5 ou o projeto
 * inteiro. O orçamento com IA calcula a equipe que o projeto pede (o código
 * decide, lib/estimate/pricing PRICING.team) e o preço fechado por ela.
 */
export default function HomeEngagements() {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <Section id="formatos">
      <SectionHeader
        eyebrow={pt ? "Equipe" : "Team"}
        title={pt ? "Do tamanho que o projeto pede" : "Sized to what the project needs"}
        lead={
          pt
            ? "De 1 a 5 profissionais, com preço fechado pela equipe necessária. A equipe muda conforme o projeto cresce."
            : "From 1 to 5 professionals, with a fixed price for the team it needs. The team changes as the project grows."
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {ENGAGEMENTS.map((e, i) => {
          const Icon = ICONS[e.id] ?? Users;
          const dark = e.featured;
          return (
            <Reveal key={e.id} delay={0.08 * i} className="flex">
              <article
                className={`relative flex w-full flex-col rounded-3xl p-7 sm:p-8 ${
                  dark ? "bg-on-surface text-surface" : "border border-outline-variant bg-surface-low"
                }`}
              >
                {dark && (
                  <span className="absolute right-6 top-6 rounded-full bg-surface px-3 py-1 text-sm font-semibold text-on-surface">
                    {pt ? "Mais flexível" : "Most flexible"}
                  </span>
                )}
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    dark ? "bg-surface/15" : "bg-surface-high"
                  }`}
                >
                  <Icon size={26} />
                </span>
                <p className={`mt-6 text-sm font-semibold ${dark ? "opacity-70" : "text-on-surface-variant"}`}>
                  {e.kicker[language]}
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-[-0.025em] sm:text-[1.75rem]">{e.title[language]}</h3>
                <p className={`mt-3 text-base leading-relaxed ${dark ? "opacity-80" : "text-on-surface-variant"}`}>
                  {e.text[language]}
                </p>
                <ul className={`mt-6 space-y-3 border-t pt-6 ${dark ? "border-surface/20" : "border-outline-variant"}`}>
                  {e.checks.map((c) => (
                    <li key={c.pt} className="flex items-center gap-3 text-base">
                      <CircleCheck size={20} className="shrink-0 text-emerald-500" />
                      {c[language]}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-surface-low p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-base leading-relaxed">
          {pt
            ? "O orçamento grátis calcula quantas pessoas o seu projeto precisa e o preço fechado pela equipe."
            : "The free quote works out how many people your project needs and the fixed price for that team."}
        </p>
        <Link
          href="/orcamento"
          className="btn btn-filled h-auto min-h-12 shrink-0 rounded-xl px-6 py-3 text-base"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles size={18} className="shrink-0" />
            {pt ? "Calcular minha equipe" : "Size my team"}
          </span>
        </Link>
      </Reveal>
    </Section>
  );
}
