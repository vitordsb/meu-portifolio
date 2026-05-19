"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Competency = { tag: string; count: number; percentage: number };

export default function CompetenciesSection({ competencies }: { competencies: Competency[] }) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || competencies.length === 0) return;
    const bars = el.querySelectorAll<HTMLElement>(".progress-bar-fill");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bars.forEach((bar) => { bar.style.width = bar.dataset.target ?? "0%"; });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [competencies]);

  return (
    <section id="competencies" ref={sectionRef} className="py-16 bg-background">
      <div className="container">
        <div className="mb-10">
          <h2 className="section-header">{t("competencies.title")}</h2>
          <div className="w-12 h-1 bg-accent mb-3" />
          <p className="text-muted-foreground text-sm">{t("competencies.subtitle")}</p>
        </div>
        {competencies.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma competência mapeada ainda.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5">
          {competencies.map(({ tag, count, percentage }) => (
            <div key={tag}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-sm">{tag}</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {count} {t("competencies.projects")} · {percentage}%
                </span>
              </div>
              <div className="h-2 bg-muted w-full overflow-hidden">
                <div
                  className="progress-bar-fill h-full bg-accent transition-all duration-1000 ease-out"
                  style={{ width: "0%" }}
                  data-target={`${percentage}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
