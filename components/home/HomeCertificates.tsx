"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

  const title = language === "pt" ? "Certificações" : "Certifications";
  const seeAll = language === "pt" ? "Ver todas" : "See all";
  const eyebrow = language === "pt" ? "FORMAÇÃO CONTÍNUA" : "CONTINUOUS LEARNING";

  return (
    <section className="py-20 md:py-28 bg-muted/20 border-y border-border">
      <div className="container">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <Eyebrow className="mb-2">{eyebrow}</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {title}{" "}
                <span className="text-muted-foreground/50">({certificates.length})</span>
              </h2>
            </div>
            <Link
              href="/certificates"
              className="text-sm font-bold flex items-center gap-2 hover:text-accent transition"
            >
              {seeAll} <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {preview.map((c) => (
            <StaggerItem
              key={c.id}
              className="rounded-2xl border border-border bg-card p-5 hover:border-accent/60 hover:shadow-md transition-all flex items-start gap-3"
            >
              <div className="text-lg shrink-0">📜</div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm leading-tight">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{c.category}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
