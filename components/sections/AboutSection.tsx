"use client";

import { GraduationCap } from "lucide-react";
import { aboutContent } from "@/lib/portfolio-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();
  // Paragraphs and title come from translations; aboutContent.education stays
  // hardcoded (proper nouns: school names).
  const paragraphs = [t("about.p1"), t("about.p2"), t("about.p3")];

  return (
    <section id="about" className="py-16 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="animate-slide-in-left">
            <h2 className="section-header">{t("about.title")}</h2>
            <div className="w-12 h-1 bg-accent mb-6" />
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="mb-4 text-sm leading-relaxed text-muted-foreground"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="card-brutalist">
            <h3 className="font-black text-base mb-6 flex items-center gap-2">
              <GraduationCap size={16} className="text-accent" />
              {t("about.education")}
            </h3>
            <div className="space-y-4">
              {aboutContent.education.map((ed) => (
                <div key={ed.degree} className="pl-4 border-l-2 border-border">
                  <h4 className="font-bold text-sm mb-0.5">{ed.degree}</h4>
                  <p className="text-xs text-accent mb-1">{ed.school}</p>
                  <p className="text-xs text-muted-foreground">{ed.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
