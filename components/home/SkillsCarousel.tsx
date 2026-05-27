"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
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
  X,
  ArrowRight,
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

type Group = { cat: string; items: Skill[] };

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
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);

  const titleBySlug = (() => {
    const m: Record<string, string> = {};
    for (const p of projects) if (p.slug) m[p.slug] = p.title;
    return m;
  })();

  const groups: Group[] = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  const openGroup = groups.find((g) => g.cat === openCat) ?? null;

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
  const clickHint = language === "pt" ? "Clique para abrir" : "Click to open";

  return (
    <div>
      {/* Header do carrossel */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-mono text-muted-foreground hidden sm:block">{dragHint}</p>
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
            const px = parallax[i] ?? 0;
            return (
              <div
                key={g.cat}
                className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[55%] lg:basis-[40%] px-1"
              >
                <button
                  onClick={() => setOpenCat(g.cat)}
                  className="group relative h-[420px] w-full text-left rounded-3xl border border-border bg-card overflow-hidden cursor-pointer transition-all hover:border-accent hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Fundo parallax — ícone gigante deslocado */}
                  <div
                    className="absolute -right-10 -bottom-10 text-accent/[0.07] pointer-events-none group-hover:text-accent/[0.12] transition-colors"
                    style={{ transform: `translateX(${px}px)` }}
                  >
                    <Icon size={280} strokeWidth={1} />
                  </div>

                  <div className="relative h-full p-7 flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-background transition">
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
                      <div className="flex flex-wrap gap-2 mb-5">
                        {g.items.slice(0, 6).map((s) =>
                          s.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img key={s.id} src={s.iconUrl} alt="" className="w-6 h-6 object-contain opacity-80" />
                          ) : (
                            <span key={s.id} className="text-muted-foreground/40 text-sm">◆</span>
                          ),
                        )}
                        {g.items.length > 6 && (
                          <span className="text-xs text-muted-foreground self-center">
                            +{g.items.length - 6}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent group-hover:gap-2.5 transition-all">
                        {clickHint} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL — tecnologias da categoria selecionada (nível + projetos visíveis) */}
      <Dialog.Root open={!!openCat} onOpenChange={(o) => !o && setOpenCat(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-foreground/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[95] w-[calc(100vw-2rem)] max-w-2xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 focus:outline-none">
            <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition">
              <X size={18} />
            </Dialog.Close>

            {openGroup && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-background">
                    {(() => {
                      const Icon = CATEGORY_ICON[openGroup.cat] ?? Boxes;
                      return <Icon size={24} />;
                    })()}
                  </span>
                  <div>
                    <Dialog.Title className="text-xl font-extrabold tracking-tight">
                      {catL10n[openGroup.cat] ?? openGroup.cat}
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-muted-foreground">
                      {openGroup.items.length}{" "}
                      {language === "pt" ? "tecnologias" : "technologies"}
                    </Dialog.Description>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {openGroup.items.map((s) => {
                    const level = s.level ?? 3;
                    const slugs = Array.isArray(s.projectSlugs) ? s.projectSlugs : [];
                    const titles = slugs.map((sl) => titleBySlug[sl]).filter(Boolean);
                    const lvl = levelLabel[level] ?? levelLabel[3];
                    return (
                      <div
                        key={s.id}
                        className="rounded-xl border border-border bg-background p-4 hover:border-accent/60 transition"
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          {s.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={s.iconUrl} alt="" className="w-6 h-6 object-contain shrink-0" />
                          ) : (
                            <span className="text-accent">◆</span>
                          )}
                          <span className="font-bold text-sm">{s.title}</span>
                          <span className="ml-auto text-[10px] font-bold text-accent">
                            {lvl[language]}
                          </span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              className={`flex-1 h-1.5 rounded-full ${
                                n <= level ? "bg-accent" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        {titles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {titles.map((t) => (
                              <span key={t} className="tag-badge text-[10px]">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-muted-foreground italic">
                            {language === "pt" ? "Estudo / curso" : "Self-study"}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
