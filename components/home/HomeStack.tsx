"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Skill, Project } from "@/drizzle/schema";
import { heroStack } from "@/lib/portfolio-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import SkillsCarousel from "./SkillsCarousel";

export default function HomeStack({
  skills,
  projects,
}: {
  skills: Skill[];
  projects: Project[];
}) {
  const { t, language } = useLanguage();
  const seeAll = language === "pt" ? "Ver todas as skills" : "See all skills";

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <ScrollReveal>
          <Eyebrow className="mb-4">{t("hero.stack")}</Eyebrow>
          {/* Stack principal — chips destacados */}
          <div className="flex flex-wrap gap-3 mb-12">
            {heroStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full border border-border text-sm font-semibold hover:border-accent hover:text-accent transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </ScrollReveal>

        {/* Skills — carrossel de categorias (frontend primeiro) */}
        <ScrollReveal delay={0.05}>
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {t("skills.title")}
            </h2>
            <Link
              href="/skills"
              className="text-sm font-bold flex items-center gap-2 hover:text-accent transition"
            >
              {seeAll} <ArrowRight size={14} />
            </Link>
          </div>

          <SkillsCarousel skills={skills} projects={projects} />
        </ScrollReveal>
      </div>
    </section>
  );
}
