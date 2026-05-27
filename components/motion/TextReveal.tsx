"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Revela um texto linha por linha (cada linha sobe de baixo com máscara).
 * Passe `lines` (array) ou um texto com \n. Ideal pro nome do hero.
 */
export function TextReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={className}>
        {lines.map((l, i) => (
          <span key={i} className={`block ${lineClassName ?? ""}`}>
            {l}
          </span>
        ))}
      </span>
    );
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: delay } },
  };
  const line: Variants = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {lines.map((l, i) => (
        <span
          key={i}
          className="block overflow-hidden"
          style={{ paddingBottom: "0.05em" }}
        >
          <motion.span
            variants={line}
            className={`block ${lineClassName ?? ""}`}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
