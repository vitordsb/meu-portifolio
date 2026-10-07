"use client";

import Link from "next/link";
import { ArrowRight, CalendarX2, SearchX, ShieldAlert, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROBLEMS } from "@/lib/home-content";
import { Reveal, Section, SectionHeader } from "./ui";

const ICONS: Record<string, LucideIcon> = {
  site: SearchX,
  operacao: CalendarX2,
  medo: ShieldAlert,
};

/**
 * "Isso acontece com você?": logo depois do banner, mostra que a gente
 * entende o problema antes de oferecer qualquer coisa (StoryBrand: "eles
 * entendem a minha situação?"). Cada cartão leva pra saída certa.
 */
export default function HomeProblems() {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <Section id="problemas">
      <SectionHeader
        title={pt ? "Isso acontece com você?" : "Does this sound familiar?"}
        lead={
          pt
            ? "É o que a gente mais ouve de quem chega até aqui."
            : "It's what we hear most from people who reach out."
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {PROBLEMS.map((p, i) => {
          const Icon = ICONS[p.id] ?? ShieldAlert;
          return (
            <Reveal key={p.id} delay={0.08 * i} className="flex">
              <Link
                href={p.href}
                className="group flex w-full flex-col rounded-3xl border border-outline-variant bg-surface-low p-7 transition-colors hover:border-on-surface/40"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-high">
                  <Icon size={26} />
                </span>
                <span className="mt-6 text-xl font-bold leading-snug tracking-[-0.02em]">{p.title[language]}</span>
                <span className="mt-3 text-base leading-relaxed text-on-surface-variant">{p.text[language]}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-base font-semibold">
                  {p.cta[language]}
                  <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
