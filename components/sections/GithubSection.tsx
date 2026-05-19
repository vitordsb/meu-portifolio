"use client";

import { useMemo, useState } from "react";
import { Star, ExternalLink, Code2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { GithubRepo } from "@/lib/db";

const langColors: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5",
  Java: "#b07219", "C#": "#178600", Go: "#00ADD8", Rust: "#dea584",
  Ruby: "#701516", PHP: "#4F5D95", CSS: "#563d7c", HTML: "#e34c26",
  Kotlin: "#A97BFF", Swift: "#F05138", Dart: "#00B4AB",
};

export default function GithubSection({ repos }: { repos: GithubRepo[] }) {
  const { t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const languages = useMemo(() =>
    Array.from(new Set(repos.map((r) => r.language).filter(Boolean))).sort(),
    [repos]
  );
  const filtered = useMemo(
    () => (selectedLang ? repos.filter((r) => r.language === selectedLang) : repos),
    [repos, selectedLang]
  );

  return (
    <section id="github" className="py-16 bg-background">
      <div className="container">
        <h2 className="section-header">{t("github.title")}</h2>
        <div className="w-12 h-1 bg-accent mb-8" />
        {repos.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum repositório carregado — configure <code>GITHUB_USERNAME</code> nas variáveis de ambiente.
          </p>
        )}

        {languages.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLang(null)}
              className={`font-bold px-4 py-2 text-xs border transition ${!selectedLang ? "bg-accent text-background border-accent" : "border-border hover:border-accent"}`}
            >
              TODOS
            </button>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(selectedLang === lang ? null : lang)}
                className={`font-bold px-4 py-2 text-xs border transition flex items-center gap-2 ${selectedLang === lang ? "bg-accent text-background border-accent" : "border-border hover:border-accent"}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColors[lang!] ?? "#888" }} />
                {lang}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((repo) => (
            <a key={repo.id} href={repo.htmlUrl} target="_blank" rel="noopener noreferrer"
              className="github-card flex flex-col group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code2 size={14} className="text-accent shrink-0" />
                  <span className="font-bold text-sm group-hover:text-accent transition">{repo.name}</span>
                </div>
                <ExternalLink size={12} className="text-muted-foreground shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2">
                {repo.description || t("github.noDesc")}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColors[repo.language] ?? "#888" }} />
                    {repo.language}
                  </span>
                )}
                {repo.stars > 0 && (
                  <span className="flex items-center gap-1"><Star size={10} />{repo.stars}</span>
                )}
                {repo.topics.slice(0, 2).map((topic) => (
                  <span key={topic} className="tag-badge">{topic}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
