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
    <section id="about" className="py-16 bg-surface">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="animate-slide-in-left">
            <h2 className="headline-large mb-6">{t("about.title")}</h2>
            <div className="w-12 h-1 rounded-full bg-primary mb-6" />
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="mb-4 text-sm leading-relaxed text-on-surface-variant"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="card-filled">
            <h3 className="font-extrabold text-base mb-6 flex items-center gap-2">
              <GraduationCap size={16} className="text-primary" />
              {t("about.education")}
            </h3>
            <div className="space-y-4">
              {aboutContent.education.map((ed) => (
                <div key={ed.degree} className="pl-4 border-l-2 border-outline-variant">
                  <h4 className="font-bold text-sm mb-0.5">{ed.degree}</h4>
                  <p className="text-xs text-primary mb-1">{ed.school}</p>
                  <p className="text-xs text-on-surface-variant">{ed.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
