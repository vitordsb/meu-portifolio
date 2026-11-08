"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COMPANIES } from "@/lib/companies";
import { nichePageOfCase } from "@/lib/service-pages";
import type { PublicTestimonial } from "@/lib/testimonials/types";
import PageHeader from "@/components/payments/PageHeader";
import { ProjectRow } from "@/components/home/HomeProjects";

/**
 * Página própria de um case (/cases/<id>): o mesmo conteúdo da linha da home,
 * num endereço que dá pra mandar pra um cliente do mesmo ramo e que o Google
 * acha. Embaixo, os outros cases.
 */
export default function CasePage({ id, testimonials }: { id: string; testimonials: PublicTestimonial[] }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const company = COMPANIES.find((c) => c.id === id)!;
  const others = COMPANIES.filter((c) => c.id !== id);
  // Página de nicho que usa este case como prova (só em português, como as de serviço)
  const niche = pt ? nichePageOfCase(id) : null;

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-12">
        <Link
          href="/#projetos"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-base text-on-surface-variant hover:text-on-surface"
        >
          <ArrowLeft size={18} />
          {pt ? "Todos os projetos" : "All projects"}
        </Link>

        <ProjectRow company={company} pt={pt} testimonials={testimonials} standalone />

        {niche && (
          <Link
            href={`/servicos/${niche.slug}`}
            className="mt-10 flex items-center justify-between gap-4 border border-outline-variant bg-surface-low p-5 transition-colors hover:border-on-surface/40 sm:p-6"
          >
            <span>
              <span className="block text-sm text-on-surface-variant">{niche.niche?.ask}</span>
              <span className="mt-1 block text-lg font-semibold">{niche.name}</span>
            </span>
            <ArrowRight size={20} className="shrink-0" />
          </Link>
        )}

        <section className="mt-20 border-t border-outline-variant pt-10">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">{pt ? "Outros projetos" : "Other projects"}</h2>
          <ul className="mt-4 border-t border-outline-variant">
            {others.map((c) => (
              <li key={c.id} className="border-b border-outline-variant">
                <Link href={`/cases/${c.id}`} className="group flex min-h-16 items-center gap-4 py-3">
                  <span className="flex-1">
                    <span className="block text-lg font-semibold">{c.name}</span>
                    <span className="block text-sm text-on-surface-variant">{c.sector[language]}</span>
                  </span>
                  <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
