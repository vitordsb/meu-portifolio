"use client";

import { useEffect, useState } from "react";
import {
  LayoutGroup,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";

/**
 * Paginação do deck. Cada peça tem um `layoutId` fixo, então ao trocar de
 * arranjo o Framer Motion leva a MESMA peça da posição/forma antiga pra nova,
 * em vez de sumir e reaparecer.
 *
 * Na home não há "Anterior/Próxima": o gesto de arrastar já avança. No lugar
 * do "Próxima" fica um convite ("Arraste", com setas se mexendo) no ponto
 * exato onde a seta lateral aparece depois; ao sair da home ele VIRA a seta.
 *
 *   home, tela larga      -> números embaixo + convite na lateral direita
 *   home, tela média      -> números embaixo + convite ao lado deles
 *   home, celular         -> pontos + convite numa pílula no rodapé
 *   sessões, tela larga   -> setas redondas nas laterais + pontos embaixo
 *   sessões, tela estreita -> "‹ • • • ›" no rodapé
 */

const MORPH: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 36,
  mass: 0.9,
};
const T = { layout: MORPH, opacity: { duration: 0.2 } };

/** Números do wireframe a partir daqui. */
const FULL_QUERY = "(min-width: 640px) and (min-height: 501px)";
/** Setas nas laterais a partir daqui: abaixo disso cobririam o conteúdo. */
const SIDE_QUERY = "(min-width: 1024px) and (min-height: 501px)";

function useMedia(query: string, fallback: boolean) {
  const [match, setMatch] = useState(fallback);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return match;
}

export default function DeckPagination({
  current,
  labels,
  onChange,
  language,
}: {
  current: number;
  labels: string[];
  onChange: (index: number) => void;
  language: "pt" | "en";
}) {
  const full = useMedia(FULL_QUERY, true);
  const side = useMedia(SIDE_QUERY, true);
  const touch = useMedia("(pointer: coarse)", false);
  const reduce = useReducedMotion();
  const total = labels.length;
  const pt = language === "pt";
  const onHome = current === 0;
  const isLast = current === total - 1;

  const prevText = pt ? "Anterior" : "Previous";
  const nextText = pt ? "Próxima" : "Next";

  // ── Peças ────────────────────────────────────────────────────────────────
  const prev = (
    <motion.button
      key="prev"
      layoutId="pager-prev"
      transition={T}
      type="button"
      onClick={() => onChange(current - 1)}
      // Só existe fora da home: entra com fade no lugar dela
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-label={`${prevText}: ${labels[current - 1]}`}
      className={
        side
          ? "inline-flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface/90 text-on-surface backdrop-blur elev-1 hover:border-on-surface/40"
          : "inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface hover:bg-surface-high"
      }
    >
      <motion.span layout="position" transition={T} className="flex">
        <ChevronLeft size={side ? 20 : 16} />
      </motion.span>
    </motion.button>
  );

  /** Na home é o convite "Arraste"; nas sessões, a seta de avançar. */
  const next = onHome ? (
    <motion.button
      key="hint"
      layoutId="pager-next"
      transition={T}
      type="button"
      onClick={() => onChange(1)}
      aria-label={`${nextText}: ${labels[1]}`}
      className={`inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface/90 text-on-surface-variant backdrop-blur hover:border-on-surface/40 hover:text-on-surface ${
        full ? "h-11 px-4 text-sm elev-1" : "h-8 px-3 text-xs"
      }`}
    >
      <motion.span
        layout="position"
        transition={T}
        className="flex items-center gap-2"
      >
        {/* Setas puxando pra esquerda: o sentido do arraste que avança */}
        <motion.span
          className="flex"
          animate={reduce ? undefined : { x: [0, -5, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronsLeft size={full ? 16 : 14} />
        </motion.span>
        <span className="whitespace-nowrap">
          {touch ? (pt ? "Deslize" : "Swipe") : pt ? "Arraste" : "Drag"}
        </span>
      </motion.span>
    </motion.button>
  ) : (
    <motion.button
      key="next"
      layoutId="pager-next"
      transition={T}
      type="button"
      onClick={() => onChange(current + 1)}
      disabled={isLast}
      // Última sessão: some com fade, o espaço fica (nada pula de lado)
      animate={{ opacity: isLast ? 0 : 1 }}
      aria-hidden={isLast || undefined}
      tabIndex={isLast ? -1 : undefined}
      aria-label={isLast ? nextText : `${nextText}: ${labels[current + 1]}`}
      className={`disabled:pointer-events-none ${
        side
          ? "inline-flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface/90 text-on-surface backdrop-blur elev-1 hover:border-on-surface/40"
          : "inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface hover:bg-surface-high"
      }`}
    >
      <motion.span layout="position" transition={T} className="flex">
        <ChevronRight size={side ? 20 : 16} />
      </motion.span>
    </motion.button>
  );

  /** Uma página: número quadrado na home (tela larga), ponto no resto. */
  const page = (i: number) => {
    const active = i === current;
    const asNumber = onHome && full;
    return (
      <li key={i}>
        <button
          type="button"
          onClick={() => onChange(i)}
          title={labels[i]}
          aria-label={`${i + 1}: ${labels[i]}`}
          aria-current={active ? "step" : undefined}
          className={`group flex items-center justify-center ${asNumber ? "" : "h-6 px-1"}`}
        >
          <motion.span
            layoutId={`pager-page-${i}`}
            transition={T}
            className={
              asNumber
                ? `inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium tabular-nums ${
                    active
                      ? "bg-primary text-on-primary"
                      : "text-on-surface group-hover:bg-surface-high"
                  }`
                : `block h-1.5 rounded-full ${
                    active
                      ? "w-6 bg-on-surface"
                      : "w-1.5 bg-on-surface/25 group-hover:bg-on-surface/50"
                  }`
            }
          >
            {asNumber && (
              // O número entra depois que o quadrado terminou de crescer
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.2 }}
              >
                {i + 1}
              </motion.span>
            )}
          </motion.span>
        </button>
      </li>
    );
  };

  const pages = Array.from({ length: total }, (_, i) => page(i));
  const shell =
    "flex h-10 items-center gap-1 rounded-full border border-outline-variant bg-surface/90 p-1 backdrop-blur";

  /** Setas e convite nas laterais. A posição fica num wrapper: o transform
   *  do botão é do Framer Motion. Ficam junto da moldura do conteúdo
   *  (`--deck-frame`), não colados na borda: no ultrawide a borda fica a
   *  mais de 1.000px do texto. Em tela menor, a conta dá menos que 1rem e
   *  elas voltam pra borda. */
  const SIDE = "max(1rem, calc(50vw - var(--deck-frame) / 2 - 3.5rem))";
  const atLeft = (node: React.ReactNode) => (
    <div
      className="pointer-events-none fixed inset-y-0 z-50 flex items-center"
      style={{ left: SIDE }}
    >
      <div className="pointer-events-auto">{node}</div>
    </div>
  );
  const atRight = (node: React.ReactNode) => (
    <div
      className="pointer-events-none fixed inset-y-0 z-50 flex items-center"
      style={{ right: SIDE }}
    >
      <div className="pointer-events-auto">{node}</div>
    </div>
  );

  return (
    <LayoutGroup id="deck-pager">
      <nav aria-label={pt ? "Sessões do portfólio" : "Portfolio sections"}>
        {/* Home em tela larga: números embaixo, convite na lateral (ou ao lado
            dos números quando a tela ainda não comporta as laterais) */}
        {onHome && full && (
          <>
            <div className="flex items-center gap-3">
              <ol className="flex items-center gap-1.5">{pages}</ol>
              {!side && next}
            </div>
            {side && atRight(next)}
          </>
        )}

        {onHome && !full && (
          <motion.div layoutId="pager-shell" transition={T} className={shell}>
            <ol className="flex items-center pl-1">{pages}</ol>
            {next}
          </motion.div>
        )}

        {!onHome && side && (
          <>
            <ol className="flex h-9 items-center">{pages}</ol>
            {atLeft(prev)}
            {atRight(next)}
          </>
        )}

        {!onHome && !side && (
          <motion.div layoutId="pager-shell" transition={T} className={shell}>
            {prev}
            <ol className="flex items-center">{pages}</ol>
            {next}
          </motion.div>
        )}
      </nav>
    </LayoutGroup>
  );
}
