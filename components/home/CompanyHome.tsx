"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Briefcase,
  CircleHelp,
  House,
  LayoutGrid,
  ListChecks,
  MessageCircleWarning,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOME_SECTIONS } from "@/lib/home-content";
import TopBar from "./TopBar";
import HomeHero from "./HomeHero";
import HomeProblems from "./HomeProblems";
import HomeServices, { type StartingPrice } from "./HomeServices";
import type { CatalogProject } from "@/lib/projects-catalog";
import HomeProjects from "./HomeProjects";
import HomeEngagements from "./HomeEngagements";
import NewsletterPrompt from "./NewsletterPrompt";
import HomeProcess from "./HomeProcess";
import HomeFaq from "./HomeFaq";
import HomeFooter from "./HomeFooter";

const ICONS: Record<string, LucideIcon> = {
  inicio: House,
  problemas: MessageCircleWarning,
  servicos: LayoutGrid,
  formatos: Users,
  projetos: Briefcase,
  "como-funciona": ListChecks,
  duvidas: CircleHelp,
};

/**
 * Home de empresa (rolagem vertical). Substituiu o deck de sessões em
 * 06/out/2026 pra o site falar como empresa; o deck segue em
 * components/deck/HomeDeck e volta trocando o componente em app/page.tsx.
 *
 * Navegação: barra fina no topo (TopBar) com a sessão da tela marcada; no
 * celular ela abre um menu em tela cheia. Lá o botão de orçamento da barra
 * some por falta de espaço, então um botão flutuante aparece depois do banner.
 */
export default function CompanyHome({
  prices,
  projects,
}: {
  prices: Record<string, StartingPrice>;
  projects: CatalogProject[];
}) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [current, setCurrent] = useState("inicio");
  const [pastHero, setPastHero] = useState(false);

  // Sessão ativa = a que cruza a faixa do meio da tela
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-home-section]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Botão flutuante só depois que os botões do banner saem da tela
  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), {
      rootMargin: "-55% 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const select = useCallback((id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    window.history.replaceState(null, "", id === "inicio" ? window.location.pathname : `#${id}`);
  }, []);

  const items = HOME_SECTIONS.map((s) => ({
    id: s.id,
    label: s.label[language],
    icon: ICONS[s.id] ?? House,
  }));

  return (
    <MotionConfig reducedMotion="user">

      <div data-home-scroll className="bg-surface text-on-surface">
        <TopBar current={current} onSelect={select} />
        <HomeHero />
        <HomeProblems />
        <HomeServices prices={prices} projects={projects} />
        <HomeEngagements />
        <HomeProjects projects={projects} />
        <HomeProcess />
        <HomeFaq prices={prices} />
        <HomeFooter />
      </div>

      <NewsletterPrompt />


      <AnimatePresence>
        {pastHero && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-4 z-[80] sm:hidden"
          >
            <Link
              href="/orcamento"
              className="inline-flex h-12 items-center gap-2 rounded-none bg-on-surface px-5 text-base font-semibold text-surface shadow-[var(--elev-3)] transition-opacity hover:opacity-90 sm:h-14 sm:px-6"
            >
              <Sparkles size={18} className="shrink-0" />
              {pt ? "Orçamento grátis" : "Free quote"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
