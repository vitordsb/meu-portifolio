"use client";

import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import type { Certificate } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";

export default function HomeCertificates({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const { language } = useLanguage();
  const preview = certificates.slice(0, 6);
  if (preview.length === 0) return null;

  const title = language === "pt" ? "Cursos" : "Courses";
  const seeAll = language === "pt" ? "Ver todos" : "See all";
  const eyebrow = language === "pt" ? "FORMAÇÃO CONTÍNUA" : "CONTINUOUS LEARNING";

  return (
    <section className="py-20 md:py-28 bg-surface-high/20 border-y border-outline-variant">
      <div className="container">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <Eyebrow className="mb-2">{eyebrow}</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {title}{" "}
                <span className="text-on-surface-variant/50">({certificates.length})</span>
              </h2>
            </div>
            <Link
              href="/certificates"
              className="text-sm font-bold flex items-center gap-2 hover:text-primary transition"
            >
              {seeAll} <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {preview.map((c) => (
            <StaggerItem
              key={c.id}
              className="rounded-[var(--shape-md)] bg-surface-highest p-5 hover:border-primary hover:elev-2 transition-all flex items-start gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
                <Award size={20} />
              </span>
              <div className="min-w-0">
                <h3 className="font-bold text-sm leading-tight">{c.name}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{c.category}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
