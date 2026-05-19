"use client";

import { useMemo, useState, useEffect } from "react";
import { FileText, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Certificate } from "@/drizzle/schema";

const PAGE_SIZE = 9;

export default function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(certificates.map((c) => c.category))),
    [certificates]
  );
  const filtered = useMemo(
    () =>
      selectedCategory === "all"
        ? certificates
        : certificates.filter((c) => c.category === selectedCategory),
    [certificates, selectedCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // Reset pagination when filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  const pageLabel = language === "pt" ? "Página" : "Page";
  const ofLabel = language === "pt" ? "de" : "of";
  const prev = language === "pt" ? "Anterior" : "Previous";
  const next = language === "pt" ? "Próximo" : "Next";

  return (
    <section id="certificates" className="py-16 bg-background">
      <div className="container">
        <h2 className="section-header">{t("certificates.title")}</h2>
        <div className="w-12 h-1 bg-accent mb-8" />
        {certificates.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("certificates.empty")}</p>
        )}

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`font-bold px-4 py-2 text-xs border transition ${
                selectedCategory === "all"
                  ? "bg-accent text-background border-accent"
                  : "border-border hover:border-accent"
              }`}
            >
              {t("certificates.all")}
              <span className="ml-2 opacity-60">({certificates.length})</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-bold px-4 py-2 text-xs border transition ${
                  selectedCategory === cat
                    ? "bg-accent text-background border-accent"
                    : "border-border hover:border-accent"
                }`}
              >
                {cat.toUpperCase()}
                <span className="ml-2 opacity-60">
                  ({certificates.filter((c) => c.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((cert) => (
            <div key={cert.id} className="card-brutalist hover:border-accent transition flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-xl shrink-0">📜</div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm leading-tight">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {cert.category}
                  </p>
                </div>
              </div>
              {cert.description && (
                <p className="text-sm mb-4 leading-relaxed text-foreground/70 flex-1">
                  {cert.description}
                </p>
              )}
              {Array.isArray(cert.tags) && cert.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {cert.tags.map((tag) => (
                    <span key={tag} className="tag-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3 mt-auto">
                {cert.fileUrl && (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition"
                  >
                    <FileText size={14} />
                    {t("certificates.view")}
                  </a>
                )}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition"
                  >
                    <ExternalLink size={14} />
                    {t("certificates.link")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs font-mono text-muted-foreground">
              {pageLabel} <span className="text-accent font-bold">{safePage}</span> {ofLabel}{" "}
              <span className="font-bold">{totalPages}</span>
              <span className="ml-3 opacity-60">
                · {filtered.length} {filtered.length === 1 ? "item" : "itens"}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="btn-brutalist-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
                {prev.toUpperCase()}
              </button>

              <div className="hidden sm:flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 border-2 font-bold text-xs transition ${
                      safePage === n
                        ? "bg-accent border-accent text-background"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="btn-brutalist-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {next.toUpperCase()}
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
