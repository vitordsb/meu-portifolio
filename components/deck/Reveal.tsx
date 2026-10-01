"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Atraso de cada degrau da sequência. `step` aceita fração (3.5 = entre 3 e 4). */
export const STEP = 0.14;
const BASE = 0.12;

const lineVariants: Variants = {
  hidden: { y: "105%" },
  show: (step: number) => ({
    y: "0%",
    transition: { duration: 0.8, ease: EASE, delay: BASE + step * STEP },
  }),
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (step: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: BASE + step * STEP },
  }),
};

/**
 * Uma linha de texto que sobe de baixo pra cima, cortada por máscara.
 * O `step` define a vez dela na fila: 0 entra primeiro, 1 depois, e assim vai.
 */
export function Line({
  children,
  step,
  className,
  as = "span",
}: {
  children: ReactNode;
  step: number;
  className?: string;
  as?: "span" | "div";
}) {
  const Tag = as;
  // O padding de baixo segura descendentes (g, p, ç) que a máscara cortaria.
  return (
    <Tag className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className ?? ""}`}
        variants={lineVariants}
        custom={step}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.span>
    </Tag>
  );
}

/** Bloco que aparece subindo e ganhando opacidade, na vez do `step`. */
export function Rise({
  children,
  step,
  className,
  as = "div",
}: {
  children: ReactNode;
  step: number;
  className?: string;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      variants={riseVariants}
      custom={step}
      initial="hidden"
      animate="show"
    >
      {children}
    </Tag>
  );
}
