"use client";

import Link from "next/link";
import Image from "next/image";
import { Code, LayoutGrid, Sparkles, Users, type LucideIcon } from "lucide-react";
import photo from "@/app/(public)/images/vitor-perfil.jpg";
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
                className={`relative flex w-full flex-col p-7 sm:p-8 ${
                  dark ? "bg-on-surface text-surface" : "border border-outline-variant bg-surface-low"
                }`}
              >
                {dark && (
                  <span className="absolute right-6 top-6 rounded-full bg-surface px-3 py-1 text-sm font-semibold text-on-surface">
                    {pt ? "Mais flexível" : "Most flexible"}
                  </span>
                )}
                <span
                  className={`flex h-14 w-14 items-center justify-center ${
                    dark ? "bg-surface/15" : "bg-surface-high"
                  }`}
                >
                  <Icon size={26} />
                </span>
                <h3 className="mt-6 text-2xl font-bold tracking-[-0.025em] sm:text-[1.75rem]">{e.title[language]}</h3>
                <p className={`mt-1 text-base ${dark ? "opacity-70" : "text-on-surface-variant"}`}>{e.subtitle[language]}</p>

                {e.person && (
                  <div className="mt-6 flex items-center gap-4">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-outline-variant">
                      <Image src={photo} alt={e.person.name} fill sizes="4rem" className="object-cover object-top" />
                    </span>
                    <span>
                      <span className="block text-lg font-semibold">{e.person.name}</span>
                      <span className="block text-sm text-on-surface-variant">{e.person.role[language]}</span>
                    </span>
                  </div>
                )}

                <p className={`mt-5 text-base leading-relaxed ${dark ? "opacity-80" : "text-on-surface-variant"}`}>
                  {e.text[language]}
                </p>

                {e.tags && (
                  <ul className={`mt-6 flex flex-wrap gap-2 border-t pt-6 ${dark ? "border-surface/20" : "border-outline-variant"}`}>
                    {e.tags.map((t) => (
                      <li
                        key={t.pt}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                          dark ? "bg-surface/15" : "border border-outline-variant"
                        }`}
                      >
                        {t[language]}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-base leading-relaxed">
          {pt
            ? "O orçamento grátis calcula quantas pessoas o seu projeto precisa e o preço fechado pela equipe."
            : "The free quote works out how many people your project needs and the fixed price for that team."}
        </p>
        <Link
          href="/orcamento"
          className="btn btn-filled h-auto min-h-12 shrink-0 rounded-none px-6 py-3 text-base"
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
