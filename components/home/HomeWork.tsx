"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Lock } from "lucide-react";
import type { Project } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";

// Marcas exibidas em "trabalham comigo". `match` casa com o título do projeto.
const BRANDS: { label: string; match: string }[] = [
  { label: "ARQDOOR", match: "ArqDoor" },
  { label: "ZUPTOS", match: "Zuptos" },
  { label: "MTCPROP", match: "MTCprop" },
  { label: "EGP", match: "EGP" },
  { label: "FLORENZA", match: "Florenza" },
  { label: "ZYNTA", match: "Zynta" },
];

export default function HomeWork({ projects }: { projects: Project[] }) {
  const { t, language } = useLanguage();
  const [active, setActive] = useState<string | null>(null);

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);

  const shown = useMemo(() => {
    if (!active) return featured.slice(0, 3);
    return projects.filter((p) => p.title.toLowerCase().includes(active.toLowerCase()));
  }, [active, featured, projects]);

  // Só mostra marcas que têm projeto correspondente
  const brands = useMemo(
    () =>
      BRANDS.filter((b) =>
        projects.some((p) => p.title.toLowerCase().includes(b.match.toLowerCase())),
      ),
    [projects],
  );

  const worked = language === "pt" ? "TRABALHARAM COMIGO" : "WORKED WITH";
  const clearLabel = language === "pt" ? "Todos os destaques" : "All highlights";

  return (
    <section id="work" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Trabalham comigo — chips clicáveis que filtram */}
        <ScrollReveal>
          <Eyebrow className="mb-4">{worked}</Eyebrow>
          <div className="flex flex-wrap items-center gap-2.5 mb-12">
            <button
              onClick={() => setActive(null)}
              className={`rounded-full px-4 py-2 text-xs font-bold tracking-[0.12em] border transition ${
                active === null
                  ? "bg-accent text-background border-accent"
                  : "border-border text-muted-foreground/70 hover:border-accent hover:text-accent"
              }`}
            >
              {clearLabel.toUpperCase()}
            </button>
            {brands.map((b) => (
              <button
                key={b.match}
                onClick={() => setActive(active === b.match ? null : b.match)}
                className={`rounded-full px-4 py-2 text-xs font-extrabold tracking-[0.12em] border transition ${
                  active === b.match
                    ? "bg-accent text-background border-accent"
                    : "border-border text-muted-foreground/70 hover:border-accent hover:text-accent"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Header dos projetos */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <Eyebrow className="mb-2">{t("home.featuredTag")}</Eyebrow>
            <h2 className="section-header">{t("home.featuredTitle")}</h2>
            <div className="w-12 h-1 rounded-full bg-accent mt-3" />
          </div>
          <Link
            href="/autonomo"
            className="text-sm font-bold flex items-center gap-2 hover:text-accent transition"
          >
            {t("home.seeAll")} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid de projetos (filtrado por marca, ou featured) */}
        <StaggerGroup
          key={active ?? "featured"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {shown.map((p) => {
            const tags = Array.isArray(p.tags) ? p.tags : [];
            return (
              <StaggerItem
                key={p.id}
                className="group card-brutalist hover:border-accent transition flex flex-col overflow-hidden p-0"
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
                    <div className="w-full h-full bg-foreground flex items-center justify-center p-6">
                      <span className="font-extrabold text-background text-2xl tracking-tight text-center">
                        {p.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-[10px] font-mono text-accent tracking-widest">
                      {p.category.toUpperCase()}
                    </p>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/50">
                      <Lock size={10} />
                      {language === "pt" ? "PRIVADO" : "PRIVATE"}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg leading-tight mb-1">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{p.company}</p>
                  <p className="text-sm text-foreground/75 leading-relaxed mb-5 line-clamp-3 flex-1">
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
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
