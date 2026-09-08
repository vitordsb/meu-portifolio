"use client";

import { ExternalLink, Mail, Briefcase, Calendar, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FreelanceWork } from "@/drizzle/schema";
import { RichText } from "@/components/RichText";

export default function FreelancerSection({ items }: { items: FreelanceWork[] }) {
  const { t } = useLanguage();

  return (
    <section id="freelance" className="py-16 bg-surface-high/10 border-y border-outline-variant">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="headline-large mb-6">{t("freelance.title")}</h2>
            <div className="w-12 h-1 rounded-full bg-primary mb-3" />
            <p className="text-sm text-on-surface-variant max-w-xl">{t("freelance.subtitle")}</p>
          </div>
          <a
            href="#contact"
            className="btn btn-filled px-6 py-3 text-sm inline-flex items-center gap-2 self-start md:self-auto"
          >
            <Mail size={16} />
            {t("freelance.contact")}
          </a>
        </div>

        {/* Cards grid */}
        {items.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Nenhum trabalho cadastrado ainda.
          </p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="card-filled hover:border-primary transition group flex flex-col gap-4"
            >
              {/* Company header */}
              <div className="flex items-center gap-4">
                {item.companyLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.companyLogoUrl}
                    alt={item.company}
                    className="w-12 h-12 object-contain rounded border border-outline-variant bg-surface-low p-1 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center border border-outline-variant bg-surface-high shrink-0">
                    <Briefcase size={20} className="text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base leading-tight truncate">{item.company}</h3>
                  {item.role && (
                    <p className="text-xs text-primary font-bold mt-0.5 truncate">{item.role}</p>
                  )}
                </div>
              </div>

              {/* Period */}
              {item.period && (
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Calendar size={12} />
                  <span>{t("freelance.period")}: {item.period}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-on-surface/80 leading-relaxed flex-1">
                <RichText text={item.description} />
              </p>

              {/* Confidentiality notice */}
              <div className="border-t border-outline-variant pt-3 flex items-center justify-between">
                <span className="chip-static">
                  <Lock size={12} />
                  Código-fonte privado
                </span>
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition"
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
