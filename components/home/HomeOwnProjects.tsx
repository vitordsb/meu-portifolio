"use client";

import { useMemo } from "react";
import type { Project } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";
import ProjectCard from "@/components/home/ProjectCard";
import { ownProjectsOf } from "@/lib/work-curation";

/**
 * Projetos próprios: o que nasce de ideia do Vitor, não de contrato de cliente.
 * Vem logo depois de Jobs pra separar o trabalho pago do trabalho autoral.
 */
export default function HomeOwnProjects({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const own = useMemo(() => ownProjectsOf(projects), [projects]);

  if (own.length === 0) return null;

  return (
    <section
      id="own-projects"
      className="border-y border-outline-variant bg-surface-high/20 py-20 md:py-28"
    >
      <div className="container">
        <ScrollReveal>
          <div className="mb-10">
            <Eyebrow className="mb-2">{t("home.ownTag")}</Eyebrow>
            <h2 className="headline-large">{t("home.ownTitle")}</h2>
            <div className="mt-3 h-1 w-12 rounded-full bg-primary" />
            <p className="mt-4 max-w-2xl text-sm text-on-surface-variant">
              {t("home.ownDescription")}
            </p>
          </div>
        </ScrollReveal>

        <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {own.map((p) => (
            <StaggerItem key={p.id} className="flex">
              <ProjectCard project={p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
