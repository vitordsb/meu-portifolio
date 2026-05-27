"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { TimelineEvent } from "@/drizzle/schema";
import { aboutContent } from "@/lib/portfolio-data";
import { useLanguage, translations } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export default function HomeAbout({ events }: { events: TimelineEvent[] }) {
  const { t, language } = useLanguage();
  const eventL10n = translations[language].timeline.events;

  // Roadmap resumido = últimos 4 marcos (mais recentes primeiro)
  const recent = [...events]
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .slice(0, 4);

  const localized = (e: TimelineEvent) => eventL10n[e.sortDate]?.title ?? e.title;
  const seeFull = language === "pt" ? "Ver história completa" : "See full story";

  return (
    <section id="about" className="py-20 md:py-28 bg-muted/20 border-y border-border">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Esquerda — Sobre */}
          <ScrollReveal>
            <Eyebrow className="mb-4">{t("about.title")}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-6">
              {language === "pt"
                ? "Código que entende gente."
                : "Code that understands people."}
            </h2>
            {aboutContent.paragraphs.slice(0, 2).map((p, i) => (
              <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                {p}
              </p>
            ))}
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all mt-2"
            >
              {language === "pt" ? "Mais sobre mim" : "More about me"}
              <ArrowRight size={15} />
            </Link>
          </ScrollReveal>

          {/* Direita — Roadmap resumido */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <Eyebrow>{t("timeline.tag")}</Eyebrow>
                <Link
                  href="/about"
                  className="text-xs font-bold text-muted-foreground hover:text-accent inline-flex items-center gap-1 transition"
                >
                  {seeFull} <ArrowRight size={12} />
                </Link>
              </div>

              <ol className="relative border-l border-border ml-2">
                {recent.map((e, i) => (
                  <li key={e.id} className="relative pl-6 pb-6 last:pb-0">
                    <span
                      className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${
                        i === 0 ? "bg-accent ring-4 ring-accent/15" : "bg-border"
                      }`}
                    />
                    <p className="text-[10px] font-mono text-accent tracking-widest mb-0.5">
                      {e.dateLabel}
                    </p>
                    <p className="text-sm font-bold leading-snug">{localized(e)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
