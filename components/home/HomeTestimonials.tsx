"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TestimonialCard from "@/components/depoimentos/TestimonialCard";
import type { PublicTestimonial } from "@/lib/testimonials/types";
import { Reveal, Section, SectionHeader } from "./ui";

const MAX = 6;

/**
 * "O que os clientes dizem": depoimentos reais, entre Projetos e Como
 * funciona. Só existe com pelo menos 1 publicado (seção vazia pesa contra).
 * Cliente verificado vem primeiro. Sem marcação de estrelas pro Google:
 * depoimento escolhido pela própria empresa não vale estrela lá e pode dar
 * penalidade.
 */
export default function HomeTestimonials({ testimonials }: { testimonials: PublicTestimonial[] }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  if (testimonials.length === 0) return null;

  return (
    <Section id="depoimentos">
      <SectionHeader
        title={pt ? "O que os clientes dizem" : "What clients say"}
        lead={pt ? "Escrito por quem contratou, do jeito que mandou." : "Written by the people who hired us, as they sent it."}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, MAX).map((t, i) => (
          <Reveal key={t.id} delay={Math.min(i, 2) * 0.06} className="h-full">
            <TestimonialCard t={t} pt={pt} />
          </Reveal>
        ))}
      </div>
      <Link
        href="/depoimento"
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-none border border-outline-variant px-5 text-base transition-colors hover:border-on-surface"
      >
        {pt ? "Já foi nosso cliente? Avalie o seu projeto" : "Worked with us? Rate your project"}
        <ArrowRight size={18} />
      </Link>
    </Section>
  );
}
