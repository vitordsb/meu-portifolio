"use client";

import Link from "next/link";
import { LayoutGroup, motion } from "framer-motion";
import {
  Briefcase,
  CreditCard,
  Gauge,
  Globe,
  House,
  Layers,
  Monitor,
  Moon,
  Route,
  Sun,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FONT_LABELS, useFontScale } from "@/lib/font-scale";
import { WORK_LINKS, l } from "@/lib/deck-content";

const SECTION_ICONS: LucideIcon[] = [House, Briefcase, Layers, Route];
const WORK_ICONS: Record<string, LucideIcon> = {
  "/servicos": Tag,
  "/raio-x": Gauge,
  "/pagar": CreditCard,
};

const row =
  "relative flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors";

/**
 * O menu do canto inferior, sempre aberto no lado esquerdo da home no
 * desktop (variante `deck-wide`). Escondido atrás do botão ele passava
 * despercebido; aberto, as sessões e as portas de venda ficam à vista. O
 * orçamento com IA fica de fora: já é o botão principal do banner. No
 * celular segue o botão do rodapé, que é onde o polegar alcança.
 */
export default function DeckSideNav({
  current,
  labels,
  onChange,
}: {
  current: number;
  labels: string[];
  onChange: (index: number) => void;
}) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, cycleTheme } = useTheme();
  const font = useFontScale();
  const pt = language === "pt";
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const groupLabel =
    "px-3 pb-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-on-surface-variant";

  return (
    <aside
      aria-label={pt ? "Menu do portfólio" : "Portfolio menu"}
      className="fixed inset-y-0 left-0 z-50 hidden w-[var(--deck-side)] flex-col border-r border-outline-variant bg-surface text-on-surface deck-wide:flex"
    >
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-4 pt-8">
        <nav aria-label={pt ? "Sessões do portfólio" : "Portfolio sections"}>
          <p className={groupLabel}>{pt ? "Portfólio" : "Portfolio"}</p>
          <LayoutGroup id="deck-sidenav">
            <ul className="flex flex-col gap-0.5">
              {labels.map((label, i) => {
                const Icon = SECTION_ICONS[i] ?? House;
                const active = i === current;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => onChange(i)}
                      aria-current={active ? "page" : undefined}
                      className={`${row} ${
                        active
                          ? "font-semibold text-on-surface"
                          : "text-on-surface-variant hover:bg-surface-high hover:text-on-surface"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidenav-active"
                          aria-hidden
                          className="absolute inset-0 rounded-lg bg-surface-high"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 38,
                          }}
                        />
                      )}
                      <Icon size={18} className="relative shrink-0" />
                      <span className="relative truncate">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        <nav
          aria-label={pt ? "Trabalhe comigo" : "Work with me"}
          className="mt-8"
        >
          <p className={groupLabel}>{pt ? "Trabalhe comigo" : "Work with me"}</p>
          <ul className="flex flex-col gap-0.5">
            {WORK_LINKS.filter((w) => !w.quote).map((w) => {
              const Icon = WORK_ICONS[w.href] ?? Tag;
              return (
                <li key={w.href}>
                  <Link
                    href={w.href}
                    className={`${row} text-on-surface-variant hover:bg-surface-high hover:text-on-surface`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{l(w.label, language)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Ajustes: sempre no pé do menu */}
      <div className="flex flex-col gap-0.5 border-t border-outline-variant px-3 py-3">
        <button
          type="button"
          onClick={font.cycle}
          className={`${row} justify-between text-on-surface hover:bg-surface-high`}
        >
          <span className="flex items-center gap-3">
            <span
              aria-hidden
              className="w-[18px] text-center text-[0.8125rem] font-semibold leading-none"
            >
              A<span className="text-[1.25em]">A</span>
            </span>
            {pt ? "Letra" : "Text"}
          </span>
          <span className="text-xs text-on-surface-variant">
            {FONT_LABELS[language][font.index]}
          </span>
        </button>
        <button
          type="button"
          onClick={cycleTheme}
          className={`${row} justify-between text-on-surface hover:bg-surface-high`}
        >
          <span className="flex items-center gap-3">
            <ThemeIcon size={18} />
            {t("common.theme.label")}
          </span>
          <span className="text-xs text-on-surface-variant">
            {t(`common.theme.${theme}`)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage(pt ? "en" : "pt")}
          className={`${row} justify-between text-on-surface hover:bg-surface-high`}
        >
          <span className="flex items-center gap-3">
            <Globe size={18} />
            {t("common.language")}
          </span>
          <span className="font-mono text-xs text-on-surface-variant">
            {language.toUpperCase()}
          </span>
        </button>
      </div>
    </aside>
  );
}
