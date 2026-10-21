"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { PublicTestimonial } from "@/lib/testimonials/types";
import TestimonialCard from "./TestimonialCard";

const AUTOPLAY_MS = 8000;

/**
 * Depoimentos do cliente dentro do case, por cima da parte de baixo da
 * imagem do projeto e acima do nome (pedido do Vitor, 21/out/2026). Com mais
 * de um, vira carrossel: setas, pontos e troca sozinha a cada 8 s (para com o
 * mouse ou o foco em cima, e com movimento reduzido).
 *
 * Os cards ficam empilhados na mesma célula do grid: a altura é a do maior,
 * então a página não pula quando troca.
 */
export default function CaseTestimonials({
  testimonials,
  pt,
}: {
  testimonials: PublicTestimonial[];
  pt: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const many = testimonials.length > 1;

  useEffect(() => {
    if (!many || paused || reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [many, paused, reduce, testimonials.length]);

  if (testimonials.length === 0) return null;
  const go = (step: number) => setIndex((i) => (i + step + testimonials.length) % testimonials.length);

  return (
    <div
      role={many ? "region" : undefined}
      aria-roledescription={many ? (pt ? "carrossel" : "carousel") : undefined}
      aria-label={pt ? "Depoimentos do cliente" : "Client testimonials"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="max-w-sm shadow-[var(--elev-3)]"
    >
      <div className="grid">
        {testimonials.map((t, i) => (
          <div
            key={t.id}
            aria-hidden={i !== index}
            className={`[grid-area:1/1] transition-opacity duration-500 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <TestimonialCard t={t} pt={pt} compact />
          </div>
        ))}
      </div>

      {many && (
        <div className="flex items-center justify-between border-x border-b border-outline-variant bg-surface px-2 py-1">
          <div className="flex gap-1.5" role="tablist" aria-label={pt ? "Escolher depoimento" : "Choose testimonial"}>
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${pt ? "Depoimento" : "Testimonial"} ${i + 1}`}
                onClick={() => setIndex(i)}
                className="flex h-8 w-5 items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-on-surface" : "w-1.5 bg-outline-variant"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={pt ? "Depoimento anterior" : "Previous testimonial"}
              className="flex h-8 w-8 items-center justify-center rounded-none border border-outline-variant transition-colors hover:border-on-surface"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={pt ? "Próximo depoimento" : "Next testimonial"}
              className="flex h-8 w-8 items-center justify-center rounded-none border border-outline-variant transition-colors hover:border-on-surface"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
