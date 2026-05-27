"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Skill } from "@/drizzle/schema";
import { heroStack } from "@/lib/portfolio-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

// Categorias priorizadas pro resumo da home
const PREVIEW_CATEGORIES = ["Frontend", "Backend", "Banco de Dados", "Cloud & BaaS"];

export default function HomeStack({ skills }: { skills: Skill[] }) {
  const { t, language } = useLanguage();

  // Agrupa skills por categoria e pega só as categorias-preview com algumas skills
  const grouped = PREVIEW_CATEGORIES.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat).slice(0, 6),
  })).filter((g) => g.items.length > 0);

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

        {/* Skills resumida — por categoria */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {grouped.map((g) => (
              <div key={g.cat} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-[10px] font-mono text-accent tracking-widest uppercase mb-3">
                  {g.cat}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium"
                    >
                      {s.iconUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={s.iconUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                      )}
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
