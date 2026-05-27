"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project } from "@/drizzle/schema";

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(projects.map((p) => p.category))), [projects]);
  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => Array.isArray(p.tags) && p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const catOk = selectedCategory === "all" || p.category === selectedCategory;
        const tagOk = !selectedTag || (Array.isArray(p.tags) && p.tags.includes(selectedTag));
        return catOk && tagOk;
      }),
    [projects, selectedCategory, selectedTag]
  );

  return (
    <section id="projects" className="py-16 bg-background">
      <div className="container">
        <h2 className="section-header">{t("projects.title")}</h2>
        <div className="w-12 h-1 bg-accent mb-8" />

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`font-bold px-4 py-2 text-xs rounded-full border transition ${selectedCategory === "all" ? "bg-accent text-background border-accent" : "border-border hover:border-accent"}`}
            >
              {t("projects.all")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-bold px-4 py-2 text-xs rounded-full border transition ${selectedCategory === cat ? "bg-accent text-background border-accent" : "border-border hover:border-accent"}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 text-xs font-bold border transition ${selectedTag === tag ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <div key={project.id} className="card-brutalist group hover:border-accent transition flex flex-col">
                {project.coverImageUrl && (
                  <div className="h-40 mb-4 overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <h3 className="font-bold text-base mb-1">{project.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{project.company}</p>
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2 flex-1">{project.description}</p>

                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className={`px-2 py-0.5 text-xs font-bold border transition ${selectedTag === tag ? "bg-accent text-background border-accent" : "tag-badge hover:bg-accent hover:text-background"}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-auto">
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition">
                      <ExternalLink size={14} />{t("projects.view")}
                    </a>
                  )}
                  {project.repositoryLink && (
                    <a href={project.repositoryLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition">
                      <Github size={14} />{t("projects.repo")}
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground text-sm">{t("projects.empty")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
