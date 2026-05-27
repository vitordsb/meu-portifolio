"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as HoverCard from "@radix-ui/react-hover-card";
import {
  Layout,
  Server,
  Database,
  Cloud,
  Container,
  Boxes,
  ShieldCheck,
  Palette,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import type { Skill, Project } from "@/drizzle/schema";
import { useLanguage, translations } from "@/contexts/LanguageContext";

const CATEGORY_ORDER = [
  "Frontend",
  "Backend",
  "Banco de Dados",
  "Cloud & BaaS",
  "DevOps",
  "Estado & Padrões",
  "Qualidade",
  "Design & Processo",
  "IA & Tooling",
];

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Frontend: Layout,
  Backend: Server,
  "Banco de Dados": Database,
  "Cloud & BaaS": Cloud,
  DevOps: Container,
  "Estado & Padrões": Boxes,
  Qualidade: ShieldCheck,
  "Design & Processo": Palette,
  "IA & Tooling": Sparkles,
};

const levelLabel: Record<number, { pt: string; en: string }> = {
  1: { pt: "Iniciante", en: "Beginner" },
  2: { pt: "Básico", en: "Basic" },
  3: { pt: "Intermediário", en: "Intermediate" },
  4: { pt: "Avançado", en: "Advanced" },
  5: { pt: "Especialista", en: "Expert" },
};

export default function SkillsCarousel({
  skills,
  projects,
}: {
  skills: Skill[];
  projects: Project[];
}) {
  const { language } = useLanguage();
  const catL10n = translations[language].skills.categories as Record<string, string>;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [parallax, setParallax] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(0); // card com overlay aberto
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const titleBySlug = (() => {
    const m: Record<string, string> = {};
    for (const p of projects) if (p.slug) m[p.slug] = p.title;
    return m;
  })();

  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  // Parallax lateral: o "fundo" de cada slide translada conforme o scroll
  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      const progress = emblaApi.scrollProgress();
      const snaps = emblaApi.scrollSnapList();
      setParallax(snaps.map((snap) => (snap - progress) * -60));
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("scroll", update);
    emblaApi.on("reInit", update);
    update();
    return () => {
      emblaApi.off("scroll", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const dragHint = language === "pt" ? "arraste para ver mais →" : "drag to see more →";

  return (
    <div>
      {/* Header do carrossel */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-mono text-muted-foreground hidden sm:block">
          {dragHint}
        </p>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={prev}
            disabled={!canPrev}
            className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Próximo"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carrossel */}
      <div className="overflow-hidden -mx-1" ref={emblaRef}>
        <div className="flex">
          {groups.map((g, i) => {
            const Icon = CATEGORY_ICON[g.cat] ?? Boxes;
            const isOpen = active === i;
            const px = parallax[i] ?? 0;
            return (
              <div
                key={g.cat}
                className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[55%] lg:basis-[40%] px-1"
              >
                <div
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(isOpen ? null : i)}
                  className="group relative h-[420px] rounded-3xl border border-border bg-card overflow-hidden cursor-pointer transition-shadow hover:shadow-xl"
                >
                  {/* Fundo parallax — ícone gigante deslocado */}
                  <div
                    className="absolute -right-10 -bottom-10 text-accent/[0.07] pointer-events-none"
                    style={{ transform: `translateX(${px}px)` }}
                  >
                    <Icon size={280} strokeWidth={1} />
                  </div>

                  {/* Conteúdo base do card */}
                  <div
                    className={`relative h-full p-7 flex flex-col transition-opacity duration-300 ${
                      isOpen ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                        <Icon size={24} />
                      </span>
                      <span className="text-5xl font-extrabold text-foreground/10">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <p className="text-[10px] font-mono text-accent tracking-widest uppercase mb-1">
                        {g.items.length} {language === "pt" ? "tecnologias" : "technologies"}
                      </p>
                      <h3 className="text-2xl font-extrabold tracking-tight mb-3">
                        {catL10n[g.cat] ?? g.cat}
                      </h3>
                      {/* preview de ícones */}
                      <div className="flex flex-wrap gap-2">
                        {g.items.slice(0, 6).map((s) =>
                          s.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              key={s.id}
                              src={s.iconUrl}
                              alt=""
                              className="w-6 h-6 object-contain opacity-80"
                            />
                          ) : (
                            <span key={s.id} className="text-muted-foreground/40 text-sm">
                              ◆
                            </span>
                          ),
                        )}
                        {g.items.length > 6 && (
                          <span className="text-xs text-muted-foreground self-center">
                            +{g.items.length - 6}
                          </span>
                        )}
                      </div>
                      <p className="mt-4 text-xs font-bold text-accent flex items-center gap-1">
                        {language === "pt" ? "Ver tecnologias" : "View technologies"} →
                      </p>
                    </div>
                  </div>

                  {/* Overlay — tecnologias com hovercard */}
                  <div
                    className={`absolute inset-0 p-6 bg-card/95 backdrop-blur-sm flex flex-col transition-all duration-300 ${
                      isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-background">
                        <Icon size={18} />
                      </span>
                      <h3 className="text-lg font-extrabold tracking-tight">
                        {catL10n[g.cat] ?? g.cat}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto -mx-1 px-1">
                      <div className="flex flex-wrap gap-2">
                        {g.items.map((s) => {
                          const level = s.level ?? 3;
                          const slugs = Array.isArray(s.projectSlugs) ? s.projectSlugs : [];
                          const titles = slugs.map((sl) => titleBySlug[sl]).filter(Boolean);
                          const lvl = levelLabel[level] ?? levelLabel[3];
                          return (
                            <HoverCard.Root key={s.id} openDelay={80} closeDelay={60}>
                              <HoverCard.Trigger asChild>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:border-accent hover:text-accent transition cursor-default">
                                  {s.iconUrl && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={s.iconUrl} alt="" className="w-4 h-4 object-contain" />
                                  )}
                                  {s.title}
                                </span>
                              </HoverCard.Trigger>
                              <HoverCard.Portal>
                                <HoverCard.Content
                                  side="top"
                                  align="center"
                                  sideOffset={8}
                                  className="z-[60] w-64 rounded-2xl border border-accent bg-card p-4 shadow-xl"
                                >
                                  <div className="flex items-center gap-2 mb-3">
                                    {s.iconUrl && (
                                      /* eslint-disable-next-line @next/next/no-img-element */
                                      <img src={s.iconUrl} alt="" className="w-6 h-6 object-contain" />
                                    )}
                                    <h4 className="font-extrabold text-sm">{s.title}</h4>
                                  </div>
                                  <div className="mb-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        {language === "pt" ? "Nível" : "Level"}
                                      </span>
                                      <span className="text-[10px] font-bold text-accent">
                                        {lvl[language]} · {level}/5
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((n) => (
                                        <div
                                          key={n}
                                          className={`flex-1 h-1.5 rounded-full ${
                                            n <= level ? "bg-accent" : "bg-muted"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    {language === "pt"
                                      ? `Em ${titles.length} projeto${titles.length === 1 ? "" : "s"}`
                                      : `In ${titles.length} project${titles.length === 1 ? "" : "s"}`}
                                  </p>
                                  {titles.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {titles.map((t) => (
                                        <span key={t} className="tag-badge text-[10px]">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                      {language === "pt" ? "Estudo / curso" : "Self-study"}
                                    </p>
                                  )}
                                  <HoverCard.Arrow className="fill-accent" />
                                </HoverCard.Content>
                              </HoverCard.Portal>
                            </HoverCard.Root>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
