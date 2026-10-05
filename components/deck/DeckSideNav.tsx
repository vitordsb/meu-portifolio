"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Briefcase,
  CreditCard,
  Gauge,
  Globe,
  House,
  Layers,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
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
  "group relative flex h-11 w-full shrink-0 items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors [@media(min-height:641px)_and_(max-height:760px)]:h-9 [@media(min-height:561px)_and_(max-height:640px)]:h-8 [@media(max-height:560px)]:h-7";
// Em tela baixa linhas e espaços encolhem juntos: a faixa recolhida não rola
// (rolar cortaria os balões de nome), então tudo tem que caber na altura.

/**
 * Menu da home no desktop (variante `deck-wide`). É um auxiliar: o foco é o
 * conteúdo, e o arraste/setas já trocam de sessão. Por isso começa recolhido,
 * numa faixa de ícones (`--deck-side`) que não rouba espaço do deck; passar o
 * mouse mostra o nome. O botão do topo abre o menu com os textos POR CIMA do
 * conteúdo (com fundo escurecido); clicar fora, Esc ou escolher uma sessão
 * fecha. O orçamento com IA fica de fora: já é o botão principal do banner.
 * No celular segue o botão de menu do rodapé.
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
  const [open, setOpen] = useState(false);
  const pt = language === "pt";
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** Texto do item: no menu aberto aparece ao lado; recolhido, vira balão no hover. */
  const itemText = (children: ReactNode, value?: ReactNode) =>
    open ? (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.15 }}
        className="relative flex min-w-0 flex-1 items-center justify-between gap-2"
      >
        <span className="truncate">{children}</span>
        {value && (
          <span className="shrink-0 text-xs font-normal text-on-surface-variant">
            {value}
          </span>
        )}
      </motion.span>
    ) : (
      <span className="pointer-events-none absolute left-full top-1/2 z-10 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-on-surface px-2.5 py-1.5 text-xs font-medium text-surface opacity-0 shadow-[var(--elev-3)] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {children}
        {value && <span className="opacity-70">: {value}</span>}
      </span>
    );

  const groupLabel = (text: string) =>
    open ? (
      <p className="truncate px-3 pb-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-on-surface-variant">
        {text}
      </p>
    ) : (
      <div aria-hidden className={`mx-3 mb-2 h-px bg-outline-variant [@media(max-height:640px)]:mb-1`} />
    );

  const idle = "text-on-surface-variant hover:bg-surface-high hover:text-on-surface";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label={pt ? "Fechar menu" : "Close menu"}
            tabIndex={-1}
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[54] hidden cursor-default bg-scrim/30 deck-wide:block"
          />
        )}
      </AnimatePresence>

      <aside
        aria-label={pt ? "Menu do portfólio" : "Portfolio menu"}
        className={`fixed inset-y-0 left-0 z-[55] hidden flex-col border-r border-outline-variant bg-surface text-on-surface transition-[width,box-shadow] duration-200 ease-out deck-wide:flex ${
          open ? "w-60 shadow-[var(--elev-3)]" : "w-[var(--deck-side)]"
        }`}
      >
        <div className={`px-3 pt-4 [@media(max-height:640px)]:pt-2`}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={`${row} ${idle}`}
          >
            {open ? (
              <PanelLeftClose size={18} className="relative shrink-0" />
            ) : (
              <PanelLeftOpen size={18} className="relative shrink-0" />
            )}
            {itemText(open ? (pt ? "Fechar menu" : "Close menu") : pt ? "Abrir menu" : "Open menu")}
          </button>
        </div>

        <div className={`flex-1 px-3 pb-4 pt-5 [@media(max-height:640px)]:pb-1 [@media(max-height:640px)]:pt-2 ${open ? "overflow-y-auto overscroll-contain" : ""}`}>
          <nav aria-label={pt ? "Sessões do portfólio" : "Portfolio sections"}>
            {groupLabel(pt ? "Portfólio" : "Portfolio")}
            <LayoutGroup id="deck-sidenav">
              <ul className="flex flex-col gap-0.5">
                {labels.map((label, i) => {
                  const Icon = SECTION_ICONS[i] ?? House;
                  const active = i === current;
                  return (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(i);
                          setOpen(false);
                        }}
                        aria-current={active ? "page" : undefined}
                        aria-label={open ? undefined : label}
                        className={`${row} ${active ? "font-semibold text-on-surface" : idle}`}
                      >
                        {active && (
                          <motion.span
                            layoutId="sidenav-active"
                            aria-hidden
                            className="absolute inset-0 rounded-lg bg-surface-high"
                            transition={{ type: "spring", stiffness: 420, damping: 38 }}
                          />
                        )}
                        <Icon size={18} className="relative shrink-0" />
                        {itemText(label)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>

          <nav aria-label={pt ? "Trabalhe comigo" : "Work with me"} className={`mt-6 [@media(max-height:640px)]:mt-2`}>
            {groupLabel(pt ? "Trabalhe comigo" : "Work with me")}
            <ul className="flex flex-col gap-0.5">
              {WORK_LINKS.filter((w) => !w.quote).map((w) => {
                const Icon = WORK_ICONS[w.href] ?? Tag;
                const text = l(w.label, language);
                return (
                  <li key={w.href}>
                    <Link
                      href={w.href}
                      aria-label={open ? undefined : text}
                      className={`${row} ${idle}`}
                    >
                      <Icon size={18} className="shrink-0" />
                      {itemText(text)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Ajustes: sempre no pé do menu */}
        <div className={`flex flex-col gap-0.5 border-t border-outline-variant px-3 py-3 [@media(max-height:640px)]:py-1.5`}>
          <button
            type="button"
            onClick={font.cycle}
            aria-label={open ? undefined : `${pt ? "Letra" : "Text"}: ${FONT_LABELS[language][font.index]}`}
            className={`${row} text-on-surface hover:bg-surface-high`}
          >
            <span
              aria-hidden
              className="w-[18px] shrink-0 text-center text-[0.8125rem] font-semibold leading-none"
            >
              A<span className="text-[1.25em]">A</span>
            </span>
            {itemText(pt ? "Letra" : "Text", FONT_LABELS[language][font.index])}
          </button>
          <button
            type="button"
            onClick={cycleTheme}
            aria-label={open ? undefined : `${t("common.theme.label")}: ${t(`common.theme.${theme}`)}`}
            className={`${row} text-on-surface hover:bg-surface-high`}
          >
            <ThemeIcon size={18} className="shrink-0" />
            {itemText(t("common.theme.label"), t(`common.theme.${theme}`))}
          </button>
          <button
            type="button"
            onClick={() => setLanguage(pt ? "en" : "pt")}
            aria-label={open ? undefined : `${t("common.language")}: ${language.toUpperCase()}`}
            className={`${row} text-on-surface hover:bg-surface-high`}
          >
            <Globe size={18} className="shrink-0" />
            {itemText(t("common.language"), <span className="font-mono">{language.toUpperCase()}</span>)}
          </button>
        </div>
      </aside>
    </>
  );
}
