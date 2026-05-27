"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Lock, Mail } from "lucide-react";
import type { Project } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";

const ALL = "__all__";

export default function AutonomoSection({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const allLabel = t("autonomo.all");

  const categories = useMemo(() => {
    const set = new Set<string>(projects.map((p) => p.category));
    return [ALL, ...Array.from(set)];
  }, [projects]);

  const [active, setActive] = useState<string>(ALL);

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const filtered = useMemo<Project[]>(() => {
    if (active === ALL) return projects;
    return projects.filter((p) => p.category === active);
  }, [projects, active]);

  const subtitle = t("autonomo.subtitle").replace("{count}", String(projects.length));
  const allTag = t("autonomo.allTag").replace("{count}", String(filtered.length));

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <Eyebrow className="mb-2">{t("autonomo.tag")}</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none">
              {t("autonomo.title")}
            </h1>
            <div className="w-12 h-1 rounded-full bg-accent mt-4 mb-4" />
            <p className="text-sm text-muted-foreground max-w-2xl">{subtitle}</p>
          </div>

          <Link
            href="/contact"
            className="btn-brutalist-accent px-6 py-3 text-sm inline-flex items-center gap-2 self-start"
          >
            <Mail size={16} />
            {t("autonomo.contact")}
          </Link>
        </div>

        {/* Featured (com cover image grande) */}
        {featured.length > 0 && (
          <div className="mb-14">
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest mb-4">
              {t("autonomo.featured")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((w) => (
                <WorkCard key={w.id} project={w} large t={t} />
              ))}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isAll = cat === ALL;
            const label = isAll ? allLabel : cat;
            const count = isAll
              ? projects.length
              : projects.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-bold px-4 py-2 text-xs rounded-full border transition ${
                  active === cat
                    ? "bg-accent text-background border-accent"
                    : "border-border hover:border-accent"
                }`}
              >
                {label.toUpperCase()}
                <span className="ml-2 opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* All works grid */}
        <p className="text-[10px] font-mono text-muted-foreground tracking-widest mb-4">
          {allTag}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <WorkCard key={w.id} project={w} large={false} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({
  project,
  large,
  t,
}: {
  project: Project;
  large: boolean;
  t: (k: string) => string;
}) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  return (
    <article
      className={`card-brutalist hover:border-accent transition flex flex-col ${
        large ? "overflow-hidden p-0" : ""
      }`}
    >
      {large && (
        <div className="aspect-video overflow-hidden border-b border-border bg-muted">
          {project.coverImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="w-full h-full bg-foreground flex items-center justify-center p-6 relative">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 8px, currentColor 8px, currentColor 9px)",
                }}
              />
              <span className="relative font-extrabold text-background text-2xl md:text-3xl tracking-tighter leading-none text-center">
                {project.title}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={`${large ? "p-5" : ""} flex flex-col flex-1`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[10px] font-mono text-accent tracking-widest">
            {project.category.toUpperCase()}
          </p>
          <span
            title={t("autonomo.privateTitle")}
            className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60"
          >
            <Lock size={10} />
            {t("autonomo.private")}
          </span>
        </div>

        <h3
          className={`font-extrabold ${
            large ? "text-lg" : "text-base"
          } leading-tight mb-1`}
        >
          {project.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-1">{project.company}</p>
        {project.period && (
          <p className="text-[10px] font-mono text-muted-foreground/70 mb-3">
            {project.period}
          </p>
        )}

        <p
          className={`text-sm text-foreground/75 leading-relaxed mb-4 ${
            large ? "line-clamp-4" : "line-clamp-3"
          } flex-1`}
        >
          {project.description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, large ? 5 : 3).map((tech) => (
              <span key={tech} className="tag-badge">
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.liveLink ? (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent/80 transition border-t border-border pt-3"
          >
            <ExternalLink size={14} />
            {project.liveLink.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          <p className="mt-auto text-[10px] font-mono text-muted-foreground/50 border-t border-border pt-3">
            {t("autonomo.noLink")}
          </p>
        )}
      </div>
    </article>
  );
}
