"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Project } from "@/drizzle/schema";
import { heroStack } from "@/lib/portfolio-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FeaturedProjectsSection({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* Stack ribbon */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container">
          <p className="text-xs font-mono text-muted-foreground tracking-widest mb-4">
            {t("hero.stack")}
          </p>
          <div className="flex flex-wrap gap-3">
            {heroStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 border border-border text-xs font-bold tracking-wide hover:border-accent transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {featured.length > 0 && (
        <section id="featured" className="py-20 bg-background">
          <div className="container">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="text-xs font-mono text-accent tracking-widest mb-2">
                  {t("home.featuredTag")}
                </p>
                <h2 className="section-header">{t("home.featuredTitle")}</h2>
                <div className="w-12 h-1 bg-accent mt-3" />
              </div>
              <Link
                href="/autonomo"
                className="text-sm font-bold flex items-center gap-2 hover:text-accent transition"
              >
                {t("home.seeAll")} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((p) => {
                const tags = Array.isArray(p.tags) ? p.tags : [];
                return (
                  <article
                    key={p.id}
                    className="card-brutalist hover:border-accent transition flex flex-col overflow-hidden p-0"
                  >
                    <div className="aspect-video overflow-hidden border-b border-border bg-muted">
                      {p.coverImageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={p.coverImageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
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
                            {p.title}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[10px] font-mono text-accent tracking-widest mb-2">
                        {p.category.toUpperCase()}
                      </p>
                      <h3 className="font-extrabold text-lg leading-tight mb-1">{p.title}</h3>
                      <p className="text-xs text-muted-foreground mb-4">{p.company}</p>
                      <p className="text-sm text-foreground/75 leading-relaxed mb-5 line-clamp-4 flex-1">
                        {p.description}
                      </p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="tag-badge">#{tag}</span>
                          ))}
                        </div>
                      )}
                      {p.liveLink && (
                        <a
                          href={p.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent/80 transition border-t border-border pt-3"
                        >
                          <ExternalLink size={14} />
                          {p.liveLink.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-foreground text-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {t("home.ctaTitle")}
          </h2>
          <p className="text-sm opacity-80 max-w-xl mx-auto mb-8">
            {t("home.ctaDescription")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-6 py-3 bg-accent text-background font-bold text-sm hover:opacity-90 transition"
            >
              {t("home.ctaContact")}
            </Link>
            <Link
              href="/autonomo"
              className="px-6 py-3 border border-background font-bold text-sm hover:bg-background hover:text-foreground transition"
            >
              {t("home.ctaWorks")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
