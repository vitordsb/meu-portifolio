"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Lock, Mail } from "lucide-react";
import { allWork, type Work } from "@/lib/portfolio-data";
import { useLanguage } from "@/contexts/LanguageContext";

const ALL = "__all__";

export default function AutonomoSection() {
  const { t } = useLanguage();
  const allLabel = t("autonomo.all");

  const categories = useMemo(() => {
    const set = new Set<string>(allWork.map((w) => w.category));
    return [ALL, ...Array.from(set)];
  }, []);

  const [active, setActive] = useState<string>(ALL);

  const featured = useMemo(() => allWork.filter((w) => w.featured), []);
  const filtered = useMemo<Work[]>(() => {
    if (active === ALL) return allWork;
    return allWork.filter((w) => w.category === active);
  }, [active]);

  const subtitle = t("autonomo.subtitle").replace("{count}", String(allWork.length));
  const allTag = t("autonomo.allTag").replace("{count}", String(filtered.length));

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <p className="text-xs font-mono text-accent tracking-widest mb-2">
              {t("autonomo.tag")}
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
              {t("autonomo.title")}
            </h1>
            <div className="w-12 h-1 bg-accent mt-4 mb-4" />
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
        <div className="mb-14">
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest mb-4">
            {t("autonomo.featured")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((w) => (
              <WorkCard key={w.slug} work={w} large t={t} />
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isAll = cat === ALL;
            const label = isAll ? allLabel : cat;
            const count = isAll ? allWork.length : allWork.filter((w) => w.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-bold px-4 py-2 text-xs border transition ${
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
            <WorkCard key={w.slug} work={w} large={false} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work, large, t }: { work: Work; large: boolean; t: (k: string) => string }) {
  return (
    <article
      className={`card-brutalist hover:border-accent transition flex flex-col ${
        large ? "overflow-hidden p-0" : ""
      }`}
    >
      {large && (
        <div className="aspect-video overflow-hidden border-b border-border bg-muted">
          {work.coverImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={work.coverImageUrl}
              alt={work.title}
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
              <span className="relative font-black text-background text-2xl md:text-3xl tracking-tighter leading-none text-center">
                {work.title}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={`${large ? "p-5" : ""} flex flex-col flex-1`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[10px] font-mono text-accent tracking-widest">
            {work.category.toUpperCase()}
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
          className={`font-black ${
            large ? "text-lg" : "text-base"
          } leading-tight mb-1`}
        >
          {work.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-1">{work.company}</p>
        {work.period && (
          <p className="text-[10px] font-mono text-muted-foreground/70 mb-3">
            {work.period}
          </p>
        )}

        <p
          className={`text-sm text-foreground/75 leading-relaxed mb-4 ${
            large ? "line-clamp-4" : "line-clamp-3"
          } flex-1`}
        >
          {work.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {work.stack.slice(0, large ? 5 : 3).map((tech) => (
            <span key={tech} className="tag-badge">
              {tech}
            </span>
          ))}
        </div>

        {work.liveLink ? (
          <a
            href={work.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent/80 transition border-t border-border pt-3"
          >
            <ExternalLink size={14} />
            {work.liveLink.replace(/^https?:\/\//, "")}
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
