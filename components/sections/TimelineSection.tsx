"use client";

import { useRef, useEffect, useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Rocket,
  Globe,
  Sparkles,
  Building2,
  Flame,
  Circle,
  type LucideIcon,
} from "lucide-react";
import type { TimelineEvent } from "@/drizzle/schema";
import { useLanguage, translations } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";

const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase,
  GraduationCap,
  Award,
  Rocket,
  Globe,
  Sparkles,
  Building2,
  Flame,
};

function getIcon(name?: string | null): LucideIcon {
  if (!name) return Circle;
  return ICON_MAP[name] ?? Circle;
}

const categoryColors: Record<string, string> = {
  Carreira: "border-accent text-accent",
  Educação: "border-foreground text-foreground",
  Cliente: "border-accent text-accent",
  Marco: "border-accent text-accent bg-accent/10",
};

export default function TimelineSection({ events }: { events: TimelineEvent[] }) {
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // i18n lookup pros eventos hardcoded (chave = sortDate, único e estável)
  const eventL10n = translations[language].timeline.events;
  const catL10n = translations[language].timeline.categories as Record<string, string>;
  const localized = (evt: TimelineEvent) => {
    const override = eventL10n[evt.sortDate];
    return {
      title: override?.title ?? evt.title,
      description: override?.description ?? evt.description,
      category: evt.category ? (catL10n[evt.category] ?? evt.category) : null,
    };
  };

  // Roll horizontal scroll on wheel for desktop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!isHovering) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isHovering]);

  if (events.length === 0) {
    return (
      <section className="py-12 bg-background">
        <div className="container">
          <p className="text-sm text-muted-foreground">{t("timeline.empty")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <Eyebrow className="mb-2">{t("timeline.tag")}</Eyebrow>
            <h3 className="font-extrabold text-2xl md:text-3xl tracking-tight leading-none">
              {t("timeline.title")}
            </h3>
            <div className="w-12 h-1 rounded-full bg-accent mt-3" />
          </div>
          <p className="text-xs font-mono text-muted-foreground hidden md:block">
            {t("timeline.scrollHint")}
          </p>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative overflow-x-auto scrollbar-thin -mx-4 px-4"
          style={{ overflowY: "visible" }}
        >
          {/* Horizontal track */}
          <div className="relative min-w-max" style={{ height: 480 }}>
            {/* Linha contínua passando pelo meio */}
            <div
              className="absolute left-0 right-0 h-[2px] bg-border"
              style={{ top: 240 - 1 }}
            />

            <div className="flex items-stretch gap-0 relative h-full">
              {events.map((evt, idx) => {
                const Icon = getIcon(evt.icon);
                const isFirst = idx === 0;
                const isLast = idx === events.length - 1;
                const isAbove = idx % 2 === 0;
                const catCls =
                  categoryColors[evt.category ?? ""] ??
                  "border-border text-muted-foreground";

                return (
                  <div
                    key={evt.id}
                    className="relative shrink-0"
                    style={{ width: 280, height: 480 }}
                  >
                    {(() => {
                      const L = localized(evt);
                      return (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 w-64"
                          style={isAbove ? { bottom: 260 } : { top: 260 }}
                        >
                          <div className="card-brutalist hover:border-accent transition">
                            <p className="text-[10px] font-mono text-accent tracking-widest mb-2">
                              {evt.dateLabel}
                              {L.category && (
                                <span className="text-muted-foreground/60 ml-2">
                                  · {L.category}
                                </span>
                              )}
                            </p>
                            <h4 className="font-extrabold text-sm leading-tight mb-2">
                              {L.title}
                            </h4>
                            {L.description && (
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {L.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Bullet (centralizado em y=240) */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 z-10"
                      style={{ top: 220 }}
                    >
                      <div
                        className={`w-10 h-10 border-2 flex items-center justify-center bg-background ${
                          isLast
                            ? "bg-accent text-background border-accent"
                            : catCls
                        }`}
                      >
                        <Icon
                          size={16}
                          strokeWidth={isLast || isFirst ? 2.5 : 2}
                        />
                      </div>
                    </div>

                    {/* Conector da bolinha até o card */}
                    <div
                      className="absolute left-1/2 -translate-x-px w-px bg-border"
                      style={
                        isAbove
                          ? { bottom: 240, height: 20 }
                          : { top: 260, height: 20 }
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
