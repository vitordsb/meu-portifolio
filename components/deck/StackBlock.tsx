"use client";

import { useMemo } from "react";
import type { Skill } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { heroStack } from "@/lib/portfolio-data";
import { Rise } from "./Reveal";

/** Ordem das colunas: o que mais define o trabalho vem primeiro. */
const CATEGORY_ORDER = [
  "Frontend",
  "Estado & Padrões",
  "Design",
  "Design & Processo",
  "Backend",
  "Banco de Dados",
  "Cloud & BaaS",
  "DevOps",
  "Qualidade",
  "IA & Tooling",
];

function rank(category: string) {
  const i = CATEGORY_ORDER.indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
}

/**
 * Tecnologias: mora dentro de Especializações, rolando pra baixo. O id
 * `tecnologias` é a âncora de `/#tecnologias` e da busca; o scroll-mt deixa
 * o título livre da barra de busca fixa no topo.
 */
export default function StackBlock({ skills }: { skills: Skill[] }) {
  const { language } = useLanguage();
  const pt = language === "pt";

  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of skills) {
      const cat = s.category?.trim() || (pt ? "Outros" : "Other");
      map.set(cat, [...(map.get(cat) ?? []), s.title]);
    }
    return [...map.entries()].sort(([a], [b]) => rank(a) - rank(b));
  }, [skills, pt]);

  return (
    <section
      id="tecnologias"
      aria-labelledby="tecnologias-title"
      className="mt-24 scroll-mt-28 md:mt-32"
    >
      <Rise step={3.4}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h3
            id="tecnologias-title"
            className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-none tracking-[-0.04em]"
          >
            {pt ? "Tecnologias" : "Stack"}
          </h3>
        </div>

        {/* Stack principal em texto grande: é o que eu uso todo dia */}
        <p className="mb-14 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[clamp(1.75rem,4.4vw,3.25rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
          {heroStack.map((tech, i) => (
            <span key={tech} className="inline-flex items-baseline gap-4">
              <span className="transition-colors hover:text-brand">{tech}</span>
              {i < heroStack.length - 1 && (
                <span aria-hidden className="text-on-surface-variant/40">
                  /
                </span>
              )}
            </span>
          ))}
        </p>
      </Rise>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-outline-variant pt-10 md:grid-cols-3 lg:grid-cols-4">
        {groups.map(([category, items], i) => (
          <Rise key={category} step={3.8 + Math.min(i, 8) * 0.2}>
            <h4 className="mb-3 flex items-baseline justify-between gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-on-surface-variant">
              {category}
              <span className="tabular-nums">{items.length}</span>
            </h4>
            <ul className="space-y-1.5 text-sm">
              {items.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </Rise>
        ))}
      </div>
    </section>
  );
}
