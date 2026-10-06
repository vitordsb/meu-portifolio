"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** Largura e respiro de todas as sessões da home. */
export const FRAME = "mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12";

/**
 * Uma sessão da home. `aliases` viram âncoras invisíveis com os # da home
 * antiga (deck), pra link velho cair no lugar certo.
 */
export function Section({
  id,
  aliases,
  className = "",
  children,
}: {
  id: string;
  aliases?: string[];
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-home-section
      className={`scroll-mt-4 py-20 md:py-28 ${className}`}
    >
      {aliases?.map((a) => (
        <span key={a} id={a} aria-hidden className="block scroll-mt-4" />
      ))}
      <div className={FRAME}>{children}</div>
    </section>
  );
}

/** Sobe e aparece ao entrar na tela, uma vez só. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  className = "",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <Reveal className={`mb-10 max-w-2xl md:mb-14 ${className}`}>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">
        {eyebrow}
      </p>
      <h2 className="text-balance text-[2rem] font-extrabold leading-[1.05] tracking-[-0.035em] md:text-5xl">
        {title}
      </h2>
      {lead && (
        <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
          {lead}
        </p>
      )}
    </Reveal>
  );
}
