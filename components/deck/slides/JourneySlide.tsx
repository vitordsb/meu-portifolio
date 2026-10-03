"use client";

import type { Certificate } from "@/drizzle/schema";
import { aboutContent } from "@/lib/portfolio-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Rise } from "../Reveal";
import { SlideFrame, SlideHeader } from "../SlideFrame";
import AboutMeDrawer from "../AboutMeDrawer";
import CoursesBlock from "../CoursesBlock";

/**
 * Trajetória: a bio e, no lugar do antigo "Ver currículo", o cartão "Conheça
 * sobre mim", que abre a linha do tempo num painel lateral. Cursos embaixo.
 */
export default function JourneySlide({
  certificates,
  title,
}: {
  certificates: Certificate[];
  title: string;
}) {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <SlideFrame>
      <SlideHeader title={title} />

      {/* Em tela larga a bio não estica (linha longa cansa): coluna de leitura
          com teto e o card ao lado, empurrado pra borda da moldura */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20 3xl:grid-cols-[minmax(0,46rem)_minmax(0,34rem)] 3xl:justify-between">
        <div className="space-y-5">
          <Rise step={1.8}>
            <p className="text-2xl font-bold leading-snug tracking-[-0.02em] md:text-3xl">
              {pt
                ? "Código que entende gente."
                : "Code that understands people."}
            </p>
          </Rise>
          {aboutContent.paragraphs.slice(0, 2).map((p, i) => (
            <Rise key={i} step={2.3 + i * 0.4}>
              <p className="text-base leading-relaxed text-on-surface-variant">
                {p}
              </p>
            </Rise>
          ))}
        </div>

        <Rise step={2.6}>
          <AboutMeDrawer language={language} />
        </Rise>
      </div>

      <CoursesBlock certificates={certificates} />
    </SlideFrame>
  );
}
