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
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOME_SECTIONS } from "@/lib/home-content";
import SideRail from "@/components/nav/SideRail";
import AvatarMenu from "@/components/deck/AvatarMenu";
import HomeHero from "./HomeHero";
import HomeServices, { type StartingPrice } from "./HomeServices";
import type { CatalogProject } from "@/lib/projects-catalog";
import HomeProjects from "./HomeProjects";
import HomeEngagements from "./HomeEngagements";
import NewsletterPrompt from "./NewsletterPrompt";
import HomeProcess from "./HomeProcess";
import HomeAbout from "./HomeAbout";
import HomeFaq from "./HomeFaq";
import HomeFooter from "./HomeFooter";

const ICONS: Record<string, LucideIcon> = {
  inicio: House,
  servicos: LayoutGrid,
  formatos: Users,
  projetos: Briefcase,
  "como-funciona": ListChecks,
  sobre: UserRound,
  duvidas: CircleHelp,
};

/**
 * Home de empresa (rolagem vertical). Substituiu o deck de sessões em
 * 06/out/2026 pra o site falar como empresa; o deck segue em
 * components/deck/HomeDeck e volta trocando o componente em app/page.tsx.
 *
 * Navegação: no desktop o menu lateral recolhido marca a sessão que está na
 * tela; no celular, botão de menu no canto. Depois do banner aparece um
 * botão flutuante de orçamento, que é o principal caminho de venda.
 */
export default function CompanyHome({
  prices,
  projects,
  projectCount,
  courseCount,
}: {
  prices: Record<string, StartingPrice>;
  projects: CatalogProject[];
  projectCount: number;
  courseCount: number;
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
      <SideRail
        items={items}
        current={current}
        onSelect={select}
        groupTitle={pt ? "Nesta página" : "On this page"}
      />

      <div data-home-scroll className="bg-surface text-on-surface deck-wide:pl-[var(--deck-side)]">
        <HomeHero />
        <HomeServices prices={prices} projects={projects} />
        <HomeEngagements />
        <HomeProjects projects={projects} />
        <HomeProcess />
        <HomeAbout projectCount={projectCount} courseCount={courseCount} />
        <HomeFaq prices={prices} />
        <HomeFooter />
      </div>

      <NewsletterPrompt />

      {/* Celular e tablet: menu no canto (no desktop é o menu lateral) */}
      <div className="fixed bottom-5 left-4 z-[80] deck-wide:hidden">
        <AvatarMenu className="bg-surface elev-2" />
      </div>

      <AnimatePresence>
        {pastHero && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-4 z-[80] sm:right-6"
          >
            <Link
              href="/orcamento"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-on-surface px-5 text-base font-semibold text-surface shadow-[var(--elev-3)] transition-opacity hover:opacity-90 sm:h-14 sm:px-6"
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
