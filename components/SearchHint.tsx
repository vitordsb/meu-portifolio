"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCommandPalette } from "@/contexts/CommandPaletteContext";

/** Exemplos que a barra "digita": chamam atenção e ensinam o que dá pra pedir. */
const EXAMPLES = {
  pt: [
    "quanto custa um app?",
    "projetos com React",
    "quero uma consultoria",
    "ver o currículo",
    "falar no WhatsApp",
    "mentoria de front-end",
  ],
  en: [
    "how much is an app?",
    "projects with React",
    "I need consulting",
    "see the résumé",
    "message on WhatsApp",
    "front-end mentoring",
  ],
};

const TYPE_MS = 55;
const ERASE_MS = 28;
const HOLD_MS = 1700;

/** Digita uma frase, segura, apaga e passa pra próxima, em loop. */
function useTypewriter(phrases: string[], enabled: boolean) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    setIndex(0);
    setText("");
    setErasing(false);
  }, [phrases]);

  useEffect(() => {
    if (!enabled) return;
    const target = phrases[index % phrases.length];
    let t: ReturnType<typeof setTimeout>;
    if (!erasing && text.length < target.length) {
      t = setTimeout(() => setText(target.slice(0, text.length + 1)), TYPE_MS);
    } else if (!erasing) {
      t = setTimeout(() => setErasing(true), HOLD_MS);
    } else if (text.length > 0) {
      t = setTimeout(() => setText(text.slice(0, -1)), ERASE_MS);
    } else {
      setErasing(false);
      setIndex((i) => i + 1);
    }
    return () => clearTimeout(t);
  }, [enabled, phrases, index, text, erasing]);

  return text;
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-outline-variant bg-surface-container px-1.5 font-mono text-[0.75rem] font-medium text-on-surface">
      {children}
    </kbd>
  );
}

/**
 * Convite pra busca.
 *
 * - `hero` (home): barra de busca falsa no topo, centralizada, com exemplos
 *   sendo digitados. Quem chama o olho é o movimento do texto, em tons
 *   neutros (brilho violeta ficou chamativo demais pro resto do site).
 *   Em tela de toque vira a lupa com um anel cinza discreto: a barra
 *   cobriria o conteúdo ao rolar.
 * - `hero` com `expanded={false}` (outras sessões do deck) e `compact`
 *   (páginas internas): lupa + "Pesquisar" + atalho, discreta.
 */
export default function SearchHint({
  delay = 0,
  variant = "compact",
  expanded = true,
}: {
  delay?: number;
  variant?: "hero" | "compact";
  /** Só no `hero`: barra completa (Início) ou só o atalho (outras sessões). */
  expanded?: boolean;
}) {
  const { language } = useLanguage();
  const { open, isMac } = useCommandPalette();
  const reduce = useReducedMotion();
  const [touch, setTouch] = useState(false);
  const pt = language === "pt";

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // No Mac, ctrl + espaço é do sistema; lá a dica ensina ⌘K
  const keys = isMac ? ["⌘", "K"] : ["ctrl", pt ? "espaço" : "space"];
  const label = pt ? "Pesquisar no portfólio" : "Search the portfolio";
  const typing = variant === "hero" && expanded && !touch && !reduce;
  const typed = useTypewriter(EXAMPLES[language], typing);

  const enter = {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  if (variant === "hero" && touch) {
    return (
      <motion.button
        type="button"
        onClick={open}
        aria-label={label}
        {...enter}
        className="search-pulse relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-surface/90 text-on-surface backdrop-blur"
      >
        <Search size={18} />
      </motion.button>
    );
  }

  if (variant === "hero") {
    // A mesma barra encolhe e cresce (layout): nada some e reaparece.
    const morph = {
      layout: { type: "spring", stiffness: 380, damping: 36 },
    } as const;
    return (
      <motion.button
        layout
        type="button"
        onClick={open}
        aria-label={label}
        {...enter}
        transition={{ ...enter.transition, ...morph }}
        style={{ borderRadius: 9999 }}
        className={`group flex items-center border border-outline-variant bg-surface/90 text-left backdrop-blur elev-1 transition-[border-color,box-shadow] hover:border-on-surface/40 hover:elev-2 ${
          expanded
            ? "h-12 w-[min(30rem,calc(100vw-4rem))] gap-3 pl-4 pr-2"
            : "h-10 gap-2 pl-3.5 pr-1.5"
        }`}
      >
        <motion.span
          layout="position"
          transition={morph}
          className="flex shrink-0"
        >
          <Search
            size={expanded ? 18 : 15}
            className="text-on-surface-variant transition-colors group-hover:text-on-surface"
          />
        </motion.span>
        {expanded ? (
          <motion.span
            key="typed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="min-w-0 flex-1 truncate text-sm text-on-surface-variant"
          >
            {reduce ? (
              pt ? (
                "Pesquise: projetos, orçamento, react..."
              ) : (
                "Search: projects, pricing, react..."
              )
            ) : (
              <>
                <span className="text-on-surface/50">
                  {pt ? "Pergunte: " : "Ask: "}
                </span>
                <span className="text-on-surface">{typed}</span>
                <span
                  aria-hidden
                  className="search-caret ml-px inline-block h-4 w-px translate-y-0.5 bg-on-surface"
                />
              </>
            )}
          </motion.span>
        ) : (
          <motion.span
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="whitespace-nowrap text-sm text-on-surface-variant group-hover:text-on-surface"
          >
            {pt ? "Pesquisar" : "Search"}
          </motion.span>
        )}
        <motion.span
          layout="position"
          transition={morph}
          className="flex shrink-0 items-center gap-1"
        >
          <Key>{keys[0]}</Key>
          <Key>{keys[1]}</Key>
        </motion.span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={open}
      aria-label={label}
      {...enter}
      className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface/80 px-2.5 text-xs text-on-surface-variant backdrop-blur transition-colors hover:border-on-surface/30 hover:text-on-surface sm:px-3.5"
    >
      <Search size={16} className="shrink-0" />
      {!touch && (
        <>
          <span className="hidden text-sm sm:inline">{pt ? "Pesquisar" : "Search"}</span>
          <span className="hidden items-center gap-1 sm:flex">
            <Key>{keys[0]}</Key>
            <Key>{keys[1]}</Key>
          </span>
        </>
      )}
    </motion.button>
  );
}
