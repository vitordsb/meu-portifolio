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

  const dragHint = language === "pt" ? "Arraste para ver mais" : "Drag to see more";
  const clickHint = language === "pt" ? "Clique para abrir" : "Click to open";

  return (
    <div>
      {/* Header do carrossel */}
      <div className="flex items-center justify-between mb-6">
        <p className="body-small hidden text-on-surface-variant sm:block">{dragHint}</p>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={prev}
            disabled={!canPrev}
            className="icon-btn bg-surface-container"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className="icon-btn bg-surface-container"
            aria-label="Próximo"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carrossel: py dá folga pro lift/sombra do hover não serem cortados pelo overflow */}
      <div className="overflow-hidden -mx-1 py-4" ref={emblaRef}>
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
                  className="card-filled group relative h-[420px] w-full cursor-pointer overflow-hidden p-0 text-left transition-shadow duration-300 hover:elev-2"
                >
                  {/* Fundo parallax: ícone gigante deslocado */}
                  <div
                    className="absolute -right-10 -bottom-10 text-primary/[0.07] pointer-events-none group-hover:text-primary/[0.12] transition-colors"
                    style={{ transform: `translateX(${px}px)` }}
                  >
                    <Icon size={280} strokeWidth={1} />
                  </div>

                  <div className="relative h-full p-7 flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-[var(--shape-lg)] bg-primary-container text-on-primary-container transition group-hover:bg-primary group-hover:text-on-primary">
                        <Icon size={24} />
                      </span>
                      <span className="display-small font-display text-on-surface/10">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <p className="label-medium mb-1 text-primary">
                        {g.items.length} {language === "pt" ? "tecnologias" : "technologies"}
                      </p>
                      <h3 className="headline-small mb-3">
                        {catL10n[g.cat] ?? g.cat}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {g.items.slice(0, 6).map((s) =>
                          s.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img key={s.id} src={s.iconUrl} alt="" className="w-6 h-6 object-contain opacity-80" />
                          ) : (
                            <Boxes key={s.id} size={22} className="text-on-surface-variant/50" />
                          ),
                        )}
                        {g.items.length > 6 && (
                          <span className="text-xs text-on-surface-variant self-center">
                            +{g.items.length - 6}
                          </span>
                        )}
                      </div>
                      <span className="label-large inline-flex items-center gap-1.5 text-primary transition-all group-hover:gap-2.5">
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

      {/* MODAL: tecnologias da categoria selecionada (nível + projetos visíveis) */}
      <Dialog.Root open={!!openCat} onOpenChange={(o) => !o && setOpenCat(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-scrim/32 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[95] w-[calc(100vw-2rem)] max-w-2xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--shape-md)] bg-surface-highest p-6 md:p-8 elev-3 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 focus:outline-none">
            <Dialog.Close className="icon-btn absolute right-4 top-4">
              <X size={18} />
            </Dialog.Close>

            {openGroup && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-14 w-14 items-center justify-center rounded-[var(--shape-lg)] bg-primary-container text-on-primary-container">
                    {(() => {
                      const Icon = CATEGORY_ICON[openGroup.cat] ?? Boxes;
                      return <Icon size={24} />;
                    })()}
                  </span>
                  <div>
                    <Dialog.Title className="headline-small">
                      {catL10n[openGroup.cat] ?? openGroup.cat}
                    </Dialog.Title>
                    <Dialog.Description className="body-medium text-on-surface-variant">
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
                        className="rounded-[var(--shape-md)] bg-surface-lowest p-4"
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          {s.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={s.iconUrl} alt="" className="w-6 h-6 object-contain shrink-0" />
                          ) : (
                            <Boxes size={20} className="shrink-0 text-primary" />
                          )}
                          <span className="title-small">{s.title}</span>
                          <span className="label-medium ml-auto text-primary">
                            {lvl[language]}
                          </span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              className={`h-1 flex-1 rounded-full ${n <= level ? "bg-primary" : "bg-surface-variant"}`}
                            />
                          ))}
                        </div>
                        {titles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {titles.map((t) => (
                              <span key={t} className="chip-static text-[10px]">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-on-surface-variant italic">
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
