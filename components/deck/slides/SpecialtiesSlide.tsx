"use client";

import type { Skill } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { SPECIALTIES, l } from "@/lib/deck-content";
import { Rise } from "../Reveal";
import { SlideFrame, SlideHeader } from "../SlideFrame";
import StackBlock from "../StackBlock";

/**
 * Bordas e respiro de cada célula: 2x2 a partir de md, uma linha de 4 a
 * partir de 3xl (1920px). Por índice, e não odd/even, porque a regra muda
 * entre as duas grades; o 3xl vem depois no CSS e sobrescreve o md.
 */
function cellBorders(i: number, total: number) {
  const md = i % 2 === 0 ? "md:pr-8 md:border-r" : "md:pl-8 md:border-r-0";
  const first = i === 0;
  const last = i === total - 1;
  const wide = [
    first ? "3xl:pl-0" : "3xl:pl-8",
    last ? "3xl:pr-0 3xl:border-r-0" : "3xl:pr-8 3xl:border-r",
  ].join(" ");
  return `${md} ${wide}`;
}

export default function SpecialtiesSlide({
  title,
  skills,
}: {
  title: string;
  skills: Skill[];
}) {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <SlideFrame>
      <SlideHeader
        title={title}
        lead={
          pt
            ? "Design e engenharia na mesma pessoa: a tela que sai do Figma é a mesma que chega em produção."
            : "Design and engineering in one person: the screen that leaves Figma is the one that ships."
        }
      />

      <ol className="grid grid-cols-1 border-t border-outline-variant md:grid-cols-2 3xl:grid-cols-4">
        {SPECIALTIES.map((s, i) => (
          <Rise
            key={s.tags.join()}
            as="li"
            step={2 + i * 0.4}
            className={`group flex flex-col gap-4 border-b border-outline-variant py-8 ${cellBorders(i, SPECIALTIES.length)}`}
          >
            <span className="font-mono text-xs text-on-surface-variant">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-balance text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
              {l(s.title, language)}
            </h3>
            <p className="max-w-md text-base leading-relaxed text-on-surface-variant">
              {l(s.body, language)}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {s.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-outline-variant px-2.5 py-1 font-mono text-[0.75rem] text-on-surface-variant transition-colors group-hover:border-on-surface/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Rise>
        ))}
      </ol>

      <StackBlock skills={skills} />
    </SlideFrame>
  );
}
