"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Star, Code2, Github } from "lucide-react";
import type { GithubRepo } from "@/lib/db";

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
};

export default function GithubReposGrid({ repos }: { repos: GithubRepo[] }) {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const languages = useMemo(
    () => Array.from(new Set(repos.map((r) => r.language).filter(Boolean))).sort(),
    [repos]
  );

  const filtered = useMemo(
    () =>
      repos.filter((r) => {
        const langOk = !selectedLang || r.language === selectedLang;
        const searchOk =
          !search ||
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return langOk && searchOk;
      }),
    [repos, selectedLang, search]
  );

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Github size={28} className="text-accent" />
            <h1 className="section-header">REPOSITÓRIOS</h1>
          </div>
          <div className="w-12 h-1 rounded-full bg-accent mb-4" />
          <p className="text-sm text-muted-foreground">
            {repos.length} repositórios públicos
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar projeto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-border bg-background w-full md:max-w-sm px-4 py-2 text-sm font-medium focus:border-accent outline-none mb-6"
        />

        {/* Language filter */}
        {languages.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLang(null)}
              className={`font-bold px-4 py-2 text-xs rounded-full border transition ${!selectedLang ? "bg-accent text-accent-foreground border-accent" : "border-border hover:border-accent"}`}
            >
              TODOS
            </button>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(selectedLang === lang ? null : lang)}
                className={`font-bold px-4 py-2 text-xs rounded-full border transition flex items-center gap-2 ${selectedLang === lang ? "bg-accent text-accent-foreground border-accent" : "border-border hover:border-accent"}`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: langColors[lang!] ?? "#888" }}
                />
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((repo) => (
              <div
                key={repo.id}
                className="card-brutalist hover:border-accent transition flex flex-col gap-4 group"
              >
                {/* Title + stars */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Code2 size={16} className="text-accent shrink-0" />
                    <h2 className="font-extrabold text-sm leading-tight truncate group-hover:text-accent transition">
                      {repo.name}
                    </h2>
                  </div>
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Star size={12} />
                      {repo.stars}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                  {repo.description || "Sem descrição"}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5">
                  {repo.language && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border-2"
                      style={{
                        borderColor: langColors[repo.language] ?? "#888",
                        color: langColors[repo.language] ?? "#888",
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: langColors[repo.language] ?? "#888" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.topics.map((topic) => (
                    <span key={topic} className="tag-badge">
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Repo link — explicit CTA */}
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brutalist-accent px-4 py-2 text-xs flex items-center justify-center gap-2 mt-auto"
                >
                  <ExternalLink size={14} />
                  VER REPOSITÓRIO
                </a>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground text-sm py-16">
              Nenhum repositório encontrado.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
