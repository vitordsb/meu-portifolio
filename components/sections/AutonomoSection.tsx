"use client";

import { useMemo, useState } from "react";
import {
  ExternalLink,
  Lock,
  Globe,
  LayoutDashboard,
  Smartphone,
  Layers,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";

const ALL = "__all__";

// Agrupa as categorias granulares do banco em poucos buckets fortes.
// match usa o nome normalizado (lowercase/trim) pra não depender de casing.
const CATEGORY_GROUPS: { label: string; icon: LucideIcon; match: string[] }[] = [
  {
    label: "Sites & Landing",
    icon: Globe,
    match: ["site institucional", "landing page", "site artístico", "site artistico"],
  },
  {
    label: "Plataformas & SaaS",
    icon: LayoutDashboard,
    match: ["saas", "members area", "plataforma de saúde", "plataforma de saude", "marketplace"],
  },
  {
    label: "Apps & Mobile",
    icon: Smartphone,
    match: ["app", "mobile + iot"],
  },
];

function bucketOf(category: string): string {
  const n = category.trim().toLowerCase();
  const g = CATEGORY_GROUPS.find((grp) => grp.match.includes(n));
  return g ? g.label : category;
}

function iconForBucket(bucket: string): LucideIcon {
  return CATEGORY_GROUPS.find((g) => g.label === bucket)?.icon ?? Layers;
}

export default function AutonomoSection({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const allLabel = t("autonomo.all");

  // Destaques = curadoria (sempre no topo). Catálogo = resto, navegável por filtro.
  // Isso evita que os featured apareçam duplicados (topo + grid).
  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const catalog = useMemo(() => projects.filter((p) => !p.featured), [projects]);

  const categories = useMemo(() => {
    const set = new Set<string>(catalog.map((p) => bucketOf(p.category)));
    return [ALL, ...Array.from(set)];
  }, [catalog]);

  const [active, setActive] = useState<string>(ALL);

  const filtered = useMemo<Project[]>(() => {
    const base =
      active === ALL ? catalog : catalog.filter((p) => bucketOf(p.category) === active);
    // Projetos com link visitável primeiro — evita "becos sem saída" no fim da lista.
    return [...base].sort((a, b) => (b.liveLink ? 1 : 0) - (a.liveLink ? 1 : 0));
  }, [catalog, active]);

  const subtitle = t("autonomo.subtitle").replace("{count}", String(projects.length));

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container">
        {/* Header */}
        <div className="mb-10">
          <Eyebrow className="mb-2">{t("autonomo.tag")}</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none">
            {t("autonomo.title")}
          </h1>
          <div className="w-12 h-1 rounded-full bg-accent mt-4 mb-4" />
          <p className="text-sm text-muted-foreground max-w-2xl">{subtitle}</p>
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
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isAll = cat === ALL;
            const label = isAll ? allLabel : cat;
            const count = isAll
              ? catalog.length
              : catalog.filter((p) => bucketOf(p.category) === cat).length;
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

        {/* All works — galeria visual (imagem domina, texto no hover).
            4 colunas no desktop grande: catálogo mais denso que os destaques (3/linha). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((w) => (
            <GalleryCard key={w.id} project={w} t={t} />
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
  const hasLink = !!project.liveLink;
  const bucket = bucketOf(project.category);
  const PlaceholderIcon = iconForBucket(bucket);

  // Card inteiro vira link quando há produto visitável; senão é estático.
  const Root = hasLink ? "a" : "div";
  const rootProps = hasLink
    ? { href: project.liveLink!, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Root
      {...rootProps}
      className={`card-brutalist overflow-hidden p-0 flex flex-col group transition ${
        hasLink ? "hover:border-accent hover:-translate-y-0.5 cursor-pointer" : ""
      }`}
    >
      {/* Media — cover real ou placeholder por categoria (on-brand) */}
      <div className="aspect-video overflow-hidden border-b border-border relative">
        {project.coverImageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/15 via-accent/[0.06] to-transparent flex items-center justify-center relative">
            <PlaceholderIcon
              size={large ? 60 : 48}
              strokeWidth={1.25}
              className="text-accent/40 group-hover:text-accent/60 transition-colors"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-accent/40 uppercase tracking-widest">
              {bucket}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[10px] font-mono text-accent tracking-widest">
            {project.category.toUpperCase()}
          </p>
          {/* Lock só quando NÃO há link público — evita ruído nos 15 que têm link */}
          {!hasLink && (
            <span
              title={t("autonomo.privateTitle")}
              className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 shrink-0"
            >
              <Lock size={10} />
              {t("autonomo.private")}
            </span>
          )}
        </div>

        <h3
          className={`font-extrabold ${
            large ? "text-lg" : "text-base"
          } leading-tight mb-1 ${hasLink ? "group-hover:text-accent transition-colors" : ""}`}
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

        {hasLink ? (
          <span className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-accent border-t border-border pt-3 group-hover:gap-2.5 transition-all">
            <ExternalLink size={14} />
            {project.liveLink!.replace(/^https?:\/\//, "")}
          </span>
        ) : (
          <p className="mt-auto text-[10px] font-mono text-muted-foreground/50 border-t border-border pt-3">
            {t("autonomo.noLink")}
          </p>
        )}
      </div>
    </Root>
  );
}

/**
 * Card de galeria — usado no catálogo (abaixo dos destaques).
 * Imagem domina; título + categoria ficam fixos na faixa inferior;
 * descrição + tags surgem no hover. Card inteiro clicável quando há link.
 */
function GalleryCard({
  project,
  t,
}: {
  project: Project;
  t: (k: string) => string;
}) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const hasLink = !!project.liveLink;
  const bucket = bucketOf(project.category);
  const PlaceholderIcon = iconForBucket(bucket);

  const Root = hasLink ? "a" : "div";
  const rootProps = hasLink
    ? { href: project.liveLink!, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Root
      {...rootProps}
      className={`group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ${
        hasLink ? "hover:border-accent hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px] hover:shadow-accent/25 cursor-pointer" : ""
      }`}
    >
      {/* Media — preenche o card */}
      {project.coverImageUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/15 via-accent/[0.06] to-transparent">
          <PlaceholderIcon
            size={56}
            strokeWidth={1.25}
            className="text-accent/40 transition-colors group-hover:text-accent/60"
          />
        </div>
      )}

      {/* Gradiente inferior — garante legibilidade do texto sobre a imagem */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      {/* Badge superior direito — link ou cadeado */}
      <div className="absolute right-3 top-3">
        {hasLink ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition group-hover:bg-accent group-hover:text-background">
            <ExternalLink size={14} />
          </span>
        ) : (
          <span
            title={t("autonomo.privateTitle")}
            className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white/80 backdrop-blur-sm"
          >
            <Lock size={10} />
            {t("autonomo.private")}
          </span>
        )}
      </div>

      {/* Conteúdo — título/categoria sempre visíveis; descrição+tags no hover */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="mb-1 text-[10px] font-mono uppercase tracking-widest text-accent">
          {project.category}
        </p>
        <h3 className="text-lg font-extrabold leading-tight text-white">
          {project.title}
        </h3>

        {/* Reveal no hover via grid-rows 0fr → 1fr (transição suave de altura) */}
        <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:mt-2 group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="text-sm leading-relaxed text-white/85 line-clamp-3">
              {project.description}
            </p>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {tags.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/25 px-2 py-0.5 text-[10px] font-semibold text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {hasLink && (
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent">
                {project.liveLink!.replace(/^https?:\/\//, "")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Root>
  );
}
