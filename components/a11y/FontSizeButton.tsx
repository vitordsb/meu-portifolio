"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FONT_LABELS, useFontScale } from "@/lib/font-scale";

/**
 * Botão visível "Aa Letra: Normal/Grande/Maior". Pensado pra quem enxerga
 * menos: fica no topo das páginas, com texto (não só ícone) e área de toque
 * de 44px. Cada toque aumenta um degrau; depois do maior, volta ao normal.
 */
export default function FontSizeButton({
  className = "",
  prefixClass = "hidden sm:inline",
  valueClass = "",
}: {
  className?: string;
  /** Quando "Letra:" aparece (o menu de topo da home controla pelo espaço). */
  prefixClass?: string;
  /** Quando o valor ("Normal") aparece. */
  valueClass?: string;
}) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const { index, cycle } = useFontScale();
  const label = FONT_LABELS[language][index];
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={pt ? `Tamanho da letra: ${label}. Toque pra mudar` : `Text size: ${label}. Tap to change`}
      className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-outline-variant bg-surface/90 px-3.5 text-sm font-medium text-on-surface backdrop-blur transition-colors hover:border-on-surface/40 ${className}`}
    >
      <span aria-hidden className="font-semibold leading-none">
        A<span className="text-[1.3em]">A</span>
      </span>
      <span className={prefixClass}>{pt ? "Letra" : "Text"}:</span>
      <span className={valueClass}>{label}</span>
    </button>
  );
}
