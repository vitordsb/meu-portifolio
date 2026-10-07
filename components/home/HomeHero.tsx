"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, BadgeCheck, FileSignature, HandCoins, MessageCircle, Sparkles } from "lucide-react";
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
              className="btn btn-filled h-auto min-h-14 whitespace-normal rounded-none px-7 py-3 text-center text-base sm:whitespace-nowrap"
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
              className="btn btn-outlined h-auto min-h-14 whitespace-normal rounded-none px-7 py-3 text-center text-base sm:whitespace-nowrap"
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

        {/* Case em destaque: é chamada de efeito, então o card é arredondado */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pb-16 md:pb-24"
        >
          <FeaturedCase pt={pt} />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * ArqDoor como case de sucesso logo abaixo do banner: o problema resolvido
 * em uma frase, o que foi entregue e o mockup grande. "Ver o case" desce até
 * a linha do ArqDoor em Projetos.
 */
function FeaturedCase({ pt }: { pt: boolean }) {
  const language = pt ? "pt" : "en";
  const company = COMPANIES.find((c) => c.id === "arqdoor");
  if (!company) return null;
  const facts = pt
    ? ["Plataforma web", "App na Play Store", "12 meses de projeto"]
    : ["Web platform", "App on Play Store", "12-month project"];

  return (
    <article className="group relative overflow-hidden rounded-[2rem] bg-[linear-gradient(150deg,#ebe6de_0%,#d9d2c6_100%)] text-neutral-900 dark:bg-[linear-gradient(150deg,#3b3834_0%,#242220_100%)] dark:text-neutral-50">
      {/* Laranja da marca ArqDoor atrás dos aparelhos */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/4 right-0 h-[90%] w-[70%] rounded-full bg-[radial-gradient(circle,rgb(241_90_36/0.28),transparent_65%)] dark:bg-[radial-gradient(circle,rgb(241_90_36/0.22),transparent_65%)]"
      />
      <div className="relative grid items-center gap-2 lg:grid-cols-12">
        <div className="px-6 pt-8 sm:px-10 sm:pt-10 lg:col-span-5 lg:py-12 lg:pl-12 lg:pr-0">
          <p className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{company.name}</p>
          <p className="mt-1 text-base opacity-70">{company.sector[language]}</p>
          <h2 className="mt-6 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
            {company.headline?.[language]}
          </h2>
          <p className="mt-4 text-base leading-relaxed opacity-80">{company.problem?.[language]}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {facts.map((f) => (
              <li key={f} className="rounded-full border border-current/20 px-3 py-1 text-sm font-medium">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`#case-${company.id}`}
              onClick={(e) => {
                const el = document.getElementById(`case-${company.id}`);
                if (!el) return;
                e.preventDefault();
                el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex min-h-12 items-center gap-2 bg-neutral-900 px-5 text-base font-semibold text-neutral-50 transition-opacity hover:opacity-90 dark:bg-neutral-50 dark:text-neutral-900"
            >
              {pt ? "Ver o case" : "See the case"}
              <ArrowDown size={18} className="shrink-0" />
            </a>
            <a
              href={company.products[0].link ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 border border-current/25 px-5 text-base font-semibold transition-colors hover:border-current/60"
            >
              {pt ? "Abrir o ArqDoor" : "Open ArqDoor"}
              <ArrowUpRight size={18} className="shrink-0" />
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ClayMockup bare tallOnMobile shots={PROJECT_SHOTS.arqdoor} label="ArqDoor" className="scale-[1.04] lg:scale-[1.1]" />
        </div>
      </div>
    </article>
  );
}
