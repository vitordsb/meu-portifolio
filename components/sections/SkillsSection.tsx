"use client";

import { useMemo, useState } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useLanguage, translations } from "@/contexts/LanguageContext";
import type { Skill, Project } from "@/drizzle/schema";

const ALL = "__all__";

// Ordem canônica das categorias quando filtro = TODOS.
// Categorias fora desta lista vão pro fim (alfabético).
const CATEGORY_ORDER = [
  "Frontend",
  "Backend",
  "Banco de Dados",
  "Estado & Padrões",
  "Cloud & BaaS",
  "DevOps",
  "Qualidade",
  "Design & Processo",
  "IA & Tooling",
];

const levelLabel: Record<number, { pt: string; en: string }> = {
  1: { pt: "Iniciante", en: "Beginner" },
  2: { pt: "Básico", en: "Basic" },
  3: { pt: "Intermediário", en: "Intermediate" },
  4: { pt: "Avançado", en: "Advanced" },
  5: { pt: "Especialista", en: "Expert" },
};

export default function SkillsSection({
  skills,
  projects,
}: {
  skills: Skill[];
  projects: Project[];
}) {
  const { t, language } = useLanguage();
  const catL10n = translations[language].skills.categories as Record<string, string>;
  const allLabel = language === "pt" ? "Todos" : "All";
  const [active, setActive] = useState<string>(ALL);

  const byCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};
    skills.forEach((s) => {
      const cat = s.category || "Outros";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(s);
    });
    return grouped;
  }, [skills]);

  const categories = useMemo(() => {
    const keys = Object.keys(byCategory);
    return keys.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);
      // Não listadas vão pro fim
      const ra = ia === -1 ? CATEGORY_ORDER.length : ia;
      const rb = ib === -1 ? CATEGORY_ORDER.length : ib;
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    });
  }, [byCategory]);

  const filteredEntries = useMemo(() => {
    // Usa a ordem definida em `categories` (canônica) pra renderizar
    const ordered = categories.map((cat) => [cat, byCategory[cat]] as const);
    if (active === ALL) return ordered;
    return ordered.filter(([cat]) => cat === active);
  }, [byCategory, categories, active]);

  // Lookup slug → título do projeto
  const titleBySlug = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of projects) {
      if (p.slug) m[p.slug] = p.title;
    }
    return m;
  }, [projects]);

  return (
    <section id="skills" className="py-16 bg-background">
      <div className="container">
        <h2 className="section-header">{t("skills.title")}</h2>
        <div className="w-12 h-1 bg-accent mb-8" />
        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("skills.empty")}</p>
        )}

        {/* Filtro */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActive(ALL)}
              className={`font-bold px-4 py-2 text-xs border transition ${
                active === ALL
                  ? "bg-accent text-background border-accent"
                  : "border-border hover:border-accent"
              }`}
            >
              {allLabel.toUpperCase()}
              <span className="ml-2 opacity-60">({skills.length})</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-bold px-4 py-2 text-xs border transition ${
                  active === cat
                    ? "bg-accent text-background border-accent"
                    : "border-border hover:border-accent"
                }`}
              >
                {(catL10n[cat] ?? cat).toUpperCase()}
                <span className="ml-2 opacity-60">({byCategory[cat].length})</span>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-8">
          {filteredEntries.map(([category, catSkills]) => (
            <div key={category}>
              {category !== "Outros" && (
                <h3 className="font-bold text-sm mb-4 text-accent uppercase tracking-widest">
                  {catL10n[category] ?? category}
                </h3>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {catSkills.map((skill) => {
                  const level = skill.level ?? 3;
                  const projectSlugs = Array.isArray(skill.projectSlugs)
                    ? skill.projectSlugs
                    : [];
                  const projectTitles = projectSlugs
                    .map((slug) => titleBySlug[slug])
                    .filter(Boolean);
                  const lvl = levelLabel[level] ?? levelLabel[3];

                  const card = (
                    <div className="card-brutalist text-center hover:bg-accent hover:text-background transition group p-3 cursor-default">
                      {skill.iconUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={skill.iconUrl}
                          alt={skill.title}
                          loading="lazy"
                          className="w-8 h-8 mx-auto mb-2 object-contain group-hover:scale-110 transition"
                        />
                      ) : (
                        <div className="text-lg font-black mb-2 h-8 flex items-center justify-center">
                          ◆
                        </div>
                      )}
                      <p className="font-bold text-xs leading-tight">{skill.title}</p>
                    </div>
                  );

                  return (
                    <HoverCard.Root key={skill.id} openDelay={120} closeDelay={80}>
                      <HoverCard.Trigger asChild>{card}</HoverCard.Trigger>
                      <HoverCard.Portal>
                        <HoverCard.Content
                          side="top"
                          align="center"
                          sideOffset={8}
                          className="z-50 w-72 card-brutalist border-accent shadow-lg animate-in fade-in zoom-in-95"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            {skill.iconUrl && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={skill.iconUrl}
                                alt=""
                                className="w-8 h-8 object-contain shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <h4 className="font-black text-sm leading-tight">
                                {skill.title}
                              </h4>
                              {skill.category && (
                                <p className="text-[10px] font-mono text-accent tracking-widest uppercase">
                                  {catL10n[skill.category] ?? skill.category}
                                </p>
                              )}
                            </div>
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
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`flex-1 h-1.5 ${
                                    i <= level ? "bg-accent" : "bg-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                              {language === "pt"
                                ? `Aparece em ${projectTitles.length} projeto${projectTitles.length === 1 ? "" : "s"}`
                                : `Used in ${projectTitles.length} project${projectTitles.length === 1 ? "" : "s"}`}
                            </p>
                            {projectTitles.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {projectTitles.map((title) => (
                                  <span key={title} className="tag-badge text-[10px]">
                                    {title}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">
                                {language === "pt"
                                  ? "Estudo / curso, sem projeto público."
                                  : "Self-study, no public project yet."}
                              </p>
                            )}
                          </div>

                          <HoverCard.Arrow className="fill-accent" />
                        </HoverCard.Content>
                      </HoverCard.Portal>
                    </HoverCard.Root>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
