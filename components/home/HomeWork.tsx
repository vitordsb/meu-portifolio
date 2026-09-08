"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";
import ProjectCard from "@/components/home/ProjectCard";
import { JOB_BRANDS, brandOf, jobsOf } from "@/lib/work-curation";

/**
 * Jobs: os trabalhos que o Vitor toca hoje (ArqDoor, Zuptos, MTC, EGP).
 * Projetos autorais ficam na seção seguinte, HomeOwnProjects.
 */
export default function HomeWork({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const [active, setActive] = useState<string | null>(null);

  const jobs = useMemo(() => jobsOf(projects), [projects]);

  // Só mostra chip de marca que tem projeto correspondente.
  const brands = useMemo(
    () => JOB_BRANDS.filter((b) => jobs.some((p) => brandOf(p) === b.match)),
    [jobs],
  );

  const shown = useMemo(
    () => (active ? jobs.filter((p) => brandOf(p) === active) : jobs),
    [active, jobs],
  );

  if (jobs.length === 0) return null;

  return (
    <section id="work" className="bg-surface py-20 md:py-28">
      <div className="container">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow className="mb-2">{t("home.jobsTag")}</Eyebrow>
              <h2 className="headline-large">{t("home.jobsTitle")}</h2>
              <div className="mt-3 h-1 w-12 rounded-full bg-primary" />
            </div>
            <Link
              href="/autonomo"
              className="flex items-center gap-2 text-sm font-bold transition hover:text-primary"
            >
              {t("home.seeAll")} <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        {/* Filtro por marca */}
        <ScrollReveal>
          <div className="mb-10 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActive(null)}
              className={`rounded-full border px-4 py-2 text-xs font-bold tracking-[0.12em] transition ${
                active === null
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant text-on-surface-variant/70 hover:border-primary hover:text-primary"
              }`}
            >
              {t("home.jobsAll").toUpperCase()}
            </button>
            {brands.map((b) => (
              <button
                key={b.match}
                onClick={() => setActive(active === b.match ? null : b.match)}
                className={`rounded-full border px-4 py-2 text-xs font-extrabold tracking-[0.12em] transition ${
                  active === b.match
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant/70 hover:border-primary hover:text-primary"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <StaggerGroup
          key={active ?? "all"}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((p) => (
            <StaggerItem key={p.id} className="flex">
              <ProjectCard project={p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
