"use client";

import type { ReactNode } from "react";
import { Line, Rise } from "./Reveal";

/**
 * Moldura comum das sessões depois do banner: mesma largura e respiro. A
 * largura é a `--deck-frame` (72rem; 110rem a partir de 1920px), a mesma que
 * alinha as setas e o menu do deck. Tela larga e baixa (ultrawide 2560x1080):
 * menos respiro no topo, senão a grade de 4 colunas passa da altura.
 */
export function SlideFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[var(--deck-frame)] px-4 pb-40 pt-16 sm:px-8 sm:pt-28 lg:px-12 [@media(min-width:120rem)_and_(max-height:75rem)]:pt-24">
      {children}
    </div>
  );
}

/**
 * Cabeçalho de sessão: título gigante subindo e um lead opcional.
 */
export function SlideHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mb-10 md:mb-14 [@media(min-width:120rem)_and_(max-height:75rem)]:mb-8">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 className="deck-title">
          <Line step={0.5}>{title}</Line>
        </h2>
      </div>

      {lead && (
        <Rise step={1.5}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
            {lead}
          </p>
        </Rise>
      )}
    </header>
  );
}
