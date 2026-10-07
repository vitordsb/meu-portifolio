"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, FileSignature, HandCoins, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOME_HERO, TRUST } from "@/lib/home-content";
import { COMPANIES } from "@/lib/companies";
import { whatsappHref } from "@/lib/home-links";
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
        {/* Editorial (referências apparicio e ajota): frase grande em peso
            médio, botões, selos e o projeto em mockup de argila embaixo */}
        <div className="max-w-5xl pb-12 pt-14 md:pb-16 md:pt-20">
          <motion.h1
            {...enter(0)}
            className="text-balance text-[clamp(2.4rem,min(6.5vw,14vh),5.2rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
          >
            {HOME_HERO.title[language]}
          </motion.h1>
          <motion.p
            {...enter(1)}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant sm:text-xl"
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

        {/* Projeto entregue em mockup de argila, em largura total */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="group mx-auto w-full max-w-5xl pb-16 md:pb-24"
        >
          <ClayMockup shots={PROJECT_SHOTS.arqdoor} label="ArqDoor" className="rounded-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
