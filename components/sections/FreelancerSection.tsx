"use client";

import { ExternalLink, Mail, Briefcase, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FreelanceWork } from "@/drizzle/schema";

export default function FreelancerSection({ items }: { items: FreelanceWork[] }) {
  const { t } = useLanguage();

  return (
    <section id="freelance" className="py-16 bg-muted/10 border-y border-border">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="section-header">{t("freelance.title")}</h2>
            <div className="w-12 h-1 rounded-full bg-accent mb-3" />
            <p className="text-sm text-muted-foreground max-w-xl">{t("freelance.subtitle")}</p>
          </div>
          <a
            href="#contact"
            className="btn-brutalist-accent px-6 py-3 text-sm inline-flex items-center gap-2 self-start md:self-auto"
          >
            <Mail size={16} />
            {t("freelance.contact")}
          </a>
        </div>

        {/* Cards grid */}
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum trabalho cadastrado ainda.
          </p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="card-brutalist hover:border-accent transition group flex flex-col gap-4"
            >
              {/* Company header */}
              <div className="flex items-center gap-4">
                {item.companyLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.companyLogoUrl}
                    alt={item.company}
                    className="w-12 h-12 object-contain rounded border border-border bg-card p-1 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center border border-border bg-muted shrink-0">
                    <Briefcase size={20} className="text-accent" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base leading-tight truncate">{item.company}</h3>
                  {item.role && (
                    <p className="text-xs text-accent font-bold mt-0.5 truncate">{item.role}</p>
                  )}
                </div>
              </div>

              {/* Period */}
              {item.period && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>{t("freelance.period")}: {item.period}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-foreground/80 leading-relaxed flex-1">{item.description}</p>

              {/* Confidentiality notice */}
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground italic">
                  🔒 Código-fonte privado
                </span>
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-accent hover:text-accent/80 transition"
                  >
                    <ExternalLink size={12} />
                    {t("freelance.visitSite")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
