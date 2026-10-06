"use client";

import Link from "next/link";
import Image from "next/image";
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

const TRUST_ICONS = { clients: BadgeCheck, contract: FileSignature, price: HandCoins };

/** Telas de projetos entregues, em leque: mostra trabalho real logo de cara. */
const SHOTS = [
  { src: "/projects/arqdoor-web.jpg", url: "arqdoor.com", w: 2000, h: 1038 },
  { src: "/projects/zuptos.png", url: "app.zuptos.com.br", w: 1280, h: 720 },
  { src: "/projects/mtcprop-site.png", url: "mtcprop.com.br", w: 1902, h: 959 },
];

function BrowserShot({ shot, className }: { shot: (typeof SHOTS)[number]; className: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl ${className}`}>
      <div className="flex h-6 items-center gap-1.5 border-b border-black/10 bg-[#f4f4f5] px-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-[0.6875rem] text-neutral-500">{shot.url}</span>
      </div>
      <Image
        src={shot.src}
        alt=""
        width={shot.w}
        height={shot.h}
        sizes="(min-width: 1024px) 36rem, 90vw"
        className="aspect-[16/10] w-full object-cover object-top"
        priority
      />
    </div>
  );
}

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
          <Link href="/" className="min-w-0 leading-tight">
            <span className="block truncate text-base font-extrabold tracking-[-0.03em]">
              {BRAND.name}
            </span>
            <span className="block truncate font-mono text-[0.75rem] uppercase tracking-[0.14em] text-on-surface-variant">
              {BRAND.descriptor[language]}
            </span>
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

          {/* Leque de telas de projetos entregues */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-[5/4] w-full max-w-xl"
            aria-hidden
          >
            <BrowserShot shot={SHOTS[2]} className="absolute right-0 top-0 w-[72%] rotate-[4deg] opacity-90" />
            <BrowserShot shot={SHOTS[1]} className="absolute bottom-2 left-0 w-[66%] -rotate-[5deg]" />
            <BrowserShot shot={SHOTS[0]} className="absolute left-[14%] top-[22%] w-[76%]" />
          </motion.div>
        </div>
      </div>

      {/* Faixa de clientes: logos de quem já contratou */}
      <div className="border-y border-outline-variant bg-surface-low">
        <div className={`${FRAME} flex flex-col items-center gap-5 py-7 md:flex-row md:justify-between`}>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">
            {pt ? "Projetos entregues para" : "Projects delivered for"}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {COMPANIES.map((c) => (
              <li key={c.id}>
                <a
                  href="#projetos"
                  title={c.name}
                  className="flex h-12 items-center rounded-lg bg-white px-4 ring-1 ring-black/5 transition-transform hover:-translate-y-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.logo} alt={c.name} className="h-7 w-auto max-w-[7.5rem] object-contain" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
