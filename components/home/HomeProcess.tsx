"use client";

import { FileText, Hammer, MessageCircle, Rocket, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GUARANTEES, PROCESS } from "@/lib/home-content";
import { Reveal, Section, SectionHeader } from "./ui";

const ICONS = [MessageCircle, FileText, Hammer, Rocket];

/** Como funciona: 4 passos com ícone e as garantias logo embaixo. */
export default function HomeProcess() {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <Section id="como-funciona">
      <SectionHeader
        eyebrow={pt ? "Como funciona" : "How it works"}
        title={pt ? "Do primeiro contato ao site no ar" : "From first contact to launch"}
      />

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <Reveal key={step.title.pt} delay={0.08 * i} className="flex">
              <li className="relative flex w-full flex-col rounded-2xl border border-outline-variant p-6">
                <span className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-on-surface text-surface">
                    <Icon size={22} />
                  </span>
                  <span className="font-mono text-sm text-on-surface-variant">0{i + 1}</span>
                </span>
                <span className="mt-5 text-xl font-bold tracking-[-0.02em]">{step.title[language]}</span>
                <span className="mt-2 text-base leading-relaxed text-on-surface-variant">{step.text[language]}</span>
              </li>
            </Reveal>
          );
        })}
      </ol>

      <Reveal className="mt-8">
        <ul className="grid gap-x-6 gap-y-4 rounded-2xl bg-surface-low p-6 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((g) => (
            <li key={g.pt} className="flex items-center gap-3 text-base">
              <ShieldCheck size={20} className="shrink-0" />
              <span>{g[language]}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
