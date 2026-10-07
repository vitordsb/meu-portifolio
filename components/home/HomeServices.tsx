"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Cloud,
  MessageCircle,
  Workflow,
  Bot,
  ChevronRight,
  Globe,
  LayoutGrid,
  Megaphone,
  ShoppingBag,
  Smartphone,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOME_SECTIONS, SERVICE_TYPES } from "@/lib/home-content";
import type { CatalogProject } from "@/lib/projects-catalog";
import ProjectTile from "./ProjectTile";
import { whatsappHref } from "@/lib/home-links";
import { Reveal, Section, SectionHeader } from "./ui";

export type StartingPrice = { min: number; weeksMin: number; weeksMax: number };

const ICONS: Record<string, LucideIcon> = {
  landing: Megaphone,
  site: Globe,
  loja: ShoppingBag,
  sistema: LayoutGrid,
  app: Smartphone,
  api: Workflow,
  cloud: Cloud,
  ia: Bot,
};

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

type Open = {
  id: string;
  from: { left: number; top: number; width: number; height: number };
  to: { left: number; top: number; width: number; maxHeight: number };
};

/**
 * "O que a gente faz": carrossel de colunas, do mais complexo ao mais simples
 * (sob consulta primeiro, depois do mais caro ao mais barato). Clicar ou
 * tocar numa coluna abre um painel com todos os projetos já entregues
 * daquele tipo, com o resto da tela borrado atrás; o painel nasce em cima da
 * coluna e cresce a partir dela. Abrir no hover foi testado e reprovado pelo
 * Vitor (06/out/2026): abria sem querer.
 */
export default function HomeServices({
  prices,
  projects,
}: {
  prices: Record<string, StartingPrice>;
  projects: CatalogProject[];
}) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const section = HOME_SECTIONS.find((s) => s.id === "servicos")!;
  const scroller = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<Open | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const byType = (id: string) => projects.filter((p) => p.type === id || p.tags.includes(id));

  const openFor = useCallback((id: string, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const width = Math.min(vw - 32, 56 * rem);
    const left = Math.min(Math.max(16, r.left), vw - width - 16);
    const top = Math.max(16, Math.min(r.top, vh * 0.2));
    setOpen({
      id,
      from: { left: r.left, top: r.top, width: r.width, height: r.height },
      to: { left, top, width, maxHeight: vh - top - 16 },
    });
  }, []);

  const close = useCallback(() => setOpen(null), []);

  // Aberto, a página trava (rola só o painel) e Esc fecha
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [open, close]);

  const scrollBy = (dir: 1 | -1) => {
    const ul = scroller.current;
    if (!ul) return;
    const card = ul.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    ul.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Do mais complexo ao mais simples: sob consulta primeiro, depois preço desc
  const ordered = [
    // IA > modernização > APIs: do mais complexo pro menos
    ...SERVICE_TYPES.filter((s) => s.consult).reverse(),
    ...SERVICE_TYPES.filter((s) => !s.consult).sort(
      (a, b) => (prices[b.id]?.min ?? 0) - (prices[a.id]?.min ?? 0),
    ),
  ];
  const active = open ? SERVICE_TYPES.find((s) => s.id === open.id) : null;
  const activeProjects = open ? byType(open.id) : [];
  const ActiveIcon = active ? (ICONS[active.id] ?? Globe) : Globe;
  const activePrice = active ? prices[active.id] : undefined;

  const weeks = (p: StartingPrice) =>
    `${p.weeksMin}${p.weeksMax !== p.weeksMin ? ` ${pt ? "a" : "to"} ${p.weeksMax}` : ""} ${pt ? "semanas" : "weeks"}`;

  return (
    <Section id="servicos" aliases={section.aliases}>
      <div className="flex items-end justify-between gap-6">
        <SectionHeader
          title={pt ? "O que a gente faz" : "What we build"}
          lead={
            pt
              ? "O valor é de partida e fecha depois da conversa. Abra uma coluna pra ver os projetos já entregues."
              : "Prices are starting points, finalized after we talk. Open a column to see delivered projects."
          }
        />
        <div className="mb-10 hidden shrink-0 gap-2 md:mb-14 md:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={pt ? "Anterior" : "Previous"}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant transition-colors hover:border-on-surface/40"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={pt ? "Próximo" : "Next"}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant transition-colors hover:border-on-surface/40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <Reveal>
        <ul
          ref={scroller}
          className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {ordered.map((s) => {
            const Icon = ICONS[s.id] ?? Globe;
            const p = prices[s.id];
            const list = byType(s.id);
            const isOpen = open?.id === s.id;
            return (
              <li key={s.id} className="flex w-[17.5rem] shrink-0 snap-start sm:w-[19rem]">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={isOpen}
onClick={(e) => openFor(s.id, e.currentTarget)}
                  className={`flex min-h-[27rem] w-full flex-col rounded-3xl border border-outline-variant bg-surface-low p-7 text-left transition-[border-color,opacity] hover:border-on-surface/40 ${isOpen ? "opacity-0" : ""}`}
                >
                  <span className="flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-high">
                      <Icon size={26} />
                    </span>
                    {(list.length > 0 || !s.consult) && (
                      <span className="rounded-full border border-outline-variant px-3 py-1 text-sm text-on-surface-variant">
                        {list.length === 0
                          ? pt
                            ? "Novo"
                            : "New"
                          : `${list.length} ${pt ? (list.length === 1 ? "projeto" : "projetos") : list.length === 1 ? "project" : "projects"}`}
                      </span>
                    )}
                  </span>
                  <span className="mt-7 text-2xl font-bold tracking-[-0.025em]">{s.title[language]}</span>
                  <span className="mt-2 text-base leading-relaxed text-on-surface-variant">{s.text[language]}</span>

                  {/* Prévia: as capas dos projetos desse tipo (sob consulta: no pé da coluna) */}
                  <span className={`flex items-center gap-3 ${s.consult ? "mt-auto pt-6" : "mt-6"}`}>
                    {list.some((x) => x.cover) && (
                      <span className="flex shrink-0 -space-x-3">
                        {list
                          .filter((x) => x.cover)
                          .slice(0, 3)
                          .map((x) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={x.slug}
                              src={x.cover!}
                              alt=""
                              loading="lazy"
                              className="h-10 w-14 rounded-lg object-cover object-top ring-2 ring-surface-low"
                            />
                          ))}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-base font-semibold">
                      {list.length === 0
                        ? s.consult
                          ? pt
                            ? "Ver o que entra"
                            : "See what's included"
                          : pt
                            ? "Seja o primeiro"
                            : "Be the first"
                        : pt
                          ? `Ver ${list.length} ${list.length === 1 ? "projeto" : "projetos"}`
                          : `See ${list.length} ${list.length === 1 ? "project" : "projects"}`}
                      <ArrowRight size={16} className="shrink-0" />
                    </span>
                  </span>

                  {p && (
                    <span className="mt-auto flex items-end justify-between gap-3 border-t border-outline-variant pt-5">
                      <span>
                        <span className="block text-sm text-on-surface-variant">{pt ? "a partir de" : "from"}</span>
                        <span className="text-xl font-bold">{brl(p.min)}</span>
                      </span>
                      <span className="text-right text-sm text-on-surface-variant">{weeks(p)}</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}

          {/* Quem não sabe o que precisa: o orçamento guiado decide junto */}
          <li className="flex w-[17.5rem] shrink-0 snap-start sm:w-[19rem]">
            <Link
              href="/orcamento"
              className="group flex min-h-[27rem] w-full flex-col justify-between rounded-3xl bg-on-surface p-7 text-surface"
            >
              <span>
                <Sparkles size={28} />
                <span className="mt-7 block text-2xl font-bold tracking-[-0.025em]">
                  {pt ? "Não sabe qual escolher?" : "Not sure which one?"}
                </span>
                <span className="mt-2 block text-base leading-relaxed opacity-75">
                  {pt
                    ? "Responda tocando nas opções e veja a faixa de preço na hora."
                    : "Answer by tapping the options and see the price range right away."}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-lg font-semibold">
                {pt ? "Fazer orçamento grátis" : "Get a free quote"}
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        </ul>
      </Reveal>

      <Reveal className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-base">
        <Link href="/servicos" className="link-underline">
          {pt ? "Pacotes com preço fechado" : "Fixed-price packages"}
        </Link>
        <Link href="/quanto-custa" className="link-underline">
          {pt ? "Guia: quanto custa um site ou app" : "Guide: how much a site or app costs"}
        </Link>
        <Link href="/raio-x" className="link-underline">
          {pt ? "Raio-X grátis do seu site" : "Free check of your site"}
        </Link>
      </Reveal>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && active && (
              <>
                <motion.div
                  key="backdrop"
                  aria-hidden
                  onClick={close}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[95] bg-scrim/40 backdrop-blur-md"
                />
                <motion.div
                  key={`panel-${open.id}`}
                  role="dialog"
                  aria-modal
                  aria-label={active.title[language]}
                  initial={{ ...open.from, opacity: 0.6 }}
                  animate={{ left: open.to.left, top: open.to.top, width: open.to.width, height: "auto", opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "fixed", maxHeight: open.to.maxHeight }}
                  className="z-[96] flex flex-col overflow-hidden rounded-3xl border border-outline-variant bg-surface text-on-surface shadow-[var(--elev-3)]"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.12, duration: 0.2 }}
                    className="min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-high sm:flex">
                          <ActiveIcon size={26} />
                        </span>
                        <div>
                          <p className="text-2xl font-bold tracking-[-0.025em] sm:text-3xl">{active.title[language]}</p>
                          <p className="mt-1 text-base text-on-surface-variant">{active.text[language]}</p>
                          {activePrice && (
                            <p className="mt-2 text-base">
                              <span className="text-on-surface-variant">{pt ? "A partir de " : "From "}</span>
                              <strong>{brl(activePrice.min)}</strong>
                              <span className="text-on-surface-variant"> · {weeks(activePrice)}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        ref={closeBtn}
                        type="button"
                        onClick={close}
                        aria-label={pt ? "Fechar" : "Close"}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline-variant transition-colors hover:border-on-surface/40"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {active.bullets && (
                      <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                        {active.bullets.map((b) => (
                          <li key={b.pt} className="flex items-start gap-2.5 rounded-xl bg-surface-low p-4 text-base">
                            <Check size={18} className="mt-0.5 shrink-0" />
                            {b[language]}
                          </li>
                        ))}
                      </ul>
                    )}

                    {(activeProjects.length > 0 || !active.consult) && (
                    <p className="mb-4 mt-8 text-sm font-medium text-on-surface-variant">
                      {activeProjects.length
                        ? pt
                          ? `Projetos entregues (${activeProjects.length})`
                          : `Delivered projects (${activeProjects.length})`
                        : pt
                          ? "Ainda não temos um projeto desse tipo no portfólio. O seu pode ser o primeiro."
                          : "No project of this type in the portfolio yet. Yours could be the first."}
                    </p>
                    )}
                    {activeProjects.length > 0 && (
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {activeProjects.map((proj) => (
                          <ProjectTile key={proj.slug} project={proj} pt={pt} compact />
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/orcamento"
                        onClick={close}
                        className="btn btn-filled h-auto min-h-12 rounded-xl px-6 py-3 text-base"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Sparkles size={18} className="shrink-0" />
                          {pt ? "Orçar um projeto assim" : "Get a quote for one like this"}
                        </span>
                      </Link>
                      {active.consult && (
                        <a
                          href={whatsappHref(pt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outlined h-auto min-h-12 rounded-xl px-6 py-3 text-base"
                        >
                          <span className="inline-flex items-center gap-2">
                            <MessageCircle size={18} className="shrink-0" />
                            {pt ? "Conversar no WhatsApp" : "Chat on WhatsApp"}
                          </span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </Section>
  );
}
