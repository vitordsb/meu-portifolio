"use client";

import type { Certificate } from "@/drizzle/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { SERVICES, l } from "@/lib/deck-content";
import { Line, Rise } from "./Reveal";

/**
 * Cursos: mora dentro de Trajetória, rolando pra baixo. O id `cursos` é a
 * âncora de `/#cursos` e da busca. Fecha o deck com o convite pra conversar.
 */
export default function CoursesBlock({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const { language } = useLanguage();
  const { open: openContact } = useContactModal();
  const pt = language === "pt";
  const preview = certificates.slice(0, 9);
  const build = SERVICES.find((s) => s.primary)!;

  return (
    <>
      <section
        id="cursos"
        aria-labelledby="cursos-title"
        className="mt-24 scroll-mt-28 md:mt-32"
      >
        <Rise step={3.4}>
          <h3
            id="cursos-title"
            className="mb-3 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-none tracking-[-0.04em]"
          >
            {pt ? "Cursos" : "Courses"}
          </h3>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
            {pt
              ? `${certificates.length} cursos concluídos. Formação contínua é parte do trabalho, não um extra.`
              : `${certificates.length} courses completed. Continuous learning is part of the job, not an extra.`}
          </p>
        </Rise>

        <ul className="grid grid-cols-1 border-t border-outline-variant sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((c, i) => (
            <Rise
              as="li"
              key={c.id}
              step={3.8 + Math.min(i, 8) * 0.15}
              className="flex items-start gap-4 border-b border-outline-variant py-5 pr-4"
            >
              <span className="pt-0.5 font-mono text-[11px] tabular-nums text-on-surface-variant">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-snug">
                  {c.name}
                </span>
                <span className="mt-0.5 block text-xs text-on-surface-variant">
                  {c.category}
                </span>
              </span>
            </Rise>
          ))}
        </ul>
      </section>

      {/* Fechamento do deck */}
      <div className="mt-20 flex flex-col items-start gap-8">
        <p className="deck-closing max-w-xl">
          <Line step={5}>{pt ? "Bora construir" : "Let's build"}</Line>
          <Line step={5.4}>{pt ? "algo junto?" : "something?"}</Line>
        </p>
        <Rise step={6}>
          <button
            type="button"
            onClick={() => openContact(l(build.label, language))}
            className="btn btn-filled h-12 rounded-lg px-7 text-base"
          >
            <span>{l(build.label, language)}</span>
          </button>
        </Rise>
      </div>
    </>
  );
}
