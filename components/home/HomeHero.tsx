"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, FileSignature, HandCoins, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND } from "@/lib/site";
import { HOME_HERO, TRUST } from "@/lib/home-content";
import { COMPANIES } from "@/lib/companies";
import { whatsappHref } from "@/lib/home-links";
import SearchHint from "@/components/SearchHint";
import FontSizeButton from "@/components/a11y/FontSizeButton";
import { FRAME } from "./ui";
import ClayMockup from "./ClayMockup";
import { PROJECT_SHOTS } from "@/lib/project-shots";

const TRUST_ICONS = { clients: BadgeCheck, contract: FileSignature, price: HandCoins };

export default function HomeHero() {
  const { language } = useLanguage();
  const pt = language === "pt";

  const enter = (i: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="inicio" data-home-section className="relative overflow-hidden">
      {/* Brilho discreto: o mesmo acento violeta da prévia de link */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(167_139_250/0.16),transparent_65%)]"
      />

      <div className={FRAME}>
        <div className="flex h-20 items-center justify-between gap-3">
          <Link href="/" className="min-w-0 text-lg font-extrabold leading-tight tracking-[-0.03em]">
            {BRAND.name}
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            {/* No desktop a letra fica no menu lateral */}
            <FontSizeButton className="deck-wide:hidden" />
            <SearchHint />
          </div>
        </div>

        <div className="grid items-center gap-12 pb-16 pt-8 md:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-14">
          {/* Container: o título mede pela largura desta coluna (cqi), não da tela */}
          <div className="@container">
            <motion.h1
              {...enter(0)}
              className="text-balance text-[clamp(2.25rem,min(10.5cqi,15vh),4.25rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
            >
              {HOME_HERO.title[language]}
            </motion.h1>
            <motion.p
              {...enter(1)}
              className="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant sm:text-xl"
            >
              {HOME_HERO.lead[language]}
            </motion.p>

            <motion.div {...enter(2)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/orcamento"
                className="btn btn-filled h-auto min-h-14 whitespace-normal rounded-xl px-7 py-3 text-center text-base sm:whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={18} className="shrink-0" />
                  {pt ? "Orçamento grátis em 2 min" : "Free quote in 2 min"}
                </span>
              </Link>
              <a
                href={whatsappHref(pt)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outlined h-auto min-h-14 whitespace-normal rounded-xl px-7 py-3 text-center text-base sm:whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle size={18} className="shrink-0" />
                  {pt ? "Falar no WhatsApp" : "Chat on WhatsApp"}
                </span>
              </a>
            </motion.div>

            <motion.ul
              {...enter(3)}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-on-surface-variant"
            >
              {TRUST.map((t) => {
                const Icon = TRUST_ICONS[t.key];
                return (
                  <li key={t.key} className="flex items-center gap-2">
                    <Icon size={18} className="shrink-0 text-on-surface" />
                    <span>
                      {t.key === "clients" && (
                        <strong className="font-semibold text-on-surface">{COMPANIES.length} </strong>
                      )}
                      {t.label[language]}
                    </span>
                  </li>
                );
              })}
            </motion.ul>
          </div>

          {/* Projeto entregue em mockup de argila (mesmo estilo dos cards) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="group mx-auto w-full max-w-xl"
          >
            <ClayMockup shots={PROJECT_SHOTS.arqdoor} label="ArqDoor" className="rounded-3xl" />
          </motion.div>
        </div>
      </div>

    </section>
  );
}
