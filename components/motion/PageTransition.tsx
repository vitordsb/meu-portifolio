"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LEAVE_MS, useLeaveTransition } from "./useLeaveTransition";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Transição a cada navegação. A `key={pathname}` força o remount do bloco
 * quando a rota muda, re-disparando o fade + slide-up. Na saída (link pra
 * outra rota, inclusive o voltar pra home) a página desvanece antes de ir.
 * Respeita prefers-reduced-motion (renderiza estático).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const leaving = useLeaveTransition();

  if (reduce) return <>{children}</>;

  return (
    // Saída em CSS, não no motion: ao fim da animação dele a opacidade voltava
    // a 1 por um frame antes de fixar em 0, e a página piscava antes de sair
    <div
      style={{
        opacity: leaving ? 0 : 1,
        transition: `opacity ${LEAVE_MS}ms ease-out`,
      }}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
