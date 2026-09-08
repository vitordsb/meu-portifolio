"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { TextReveal } from "@/components/motion/TextReveal";
import { CountUp } from "@/components/motion/CountUp";
import { Eyebrow } from "@/components/Eyebrow";
import profilePic from "@/app/(public)/images/fotoPerfil-recorte.png";

interface HeroSectionProps {
  projectCount?: number;
}

export default function HeroSection({ projectCount = 0 }: HeroSectionProps) {
  const { t } = useLanguage();
  const { open: openContact } = useContactModal();

  // Stat dinâmico (anima com CountUp ao entrar na viewport): contagem exata
  // de projetos. Fallback (0): mostra placeholder pra não exibir "0+".
  const projectsNum = projectCount > 0 ? projectCount : 15;

  // Cada stat usa um par container/on-container da paleta M3.
  const stats = [
    {
      prefix: "+", value: 5, suffix: "", label: t("hero.stats.years"),
      surface: "bg-primary-container text-on-primary-container",
    },
    {
      prefix: "", value: projectsNum, suffix: "+", label: t("hero.stats.projects"),
      surface: "bg-tertiary-container text-on-tertiary-container",
    },
  ];

  const nameLines = t("hero.name").split("\n");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-24 lg:pt-12">
      <div className="container relative z-10">
        <div className="flex animate-fade-in flex-col-reverse items-center gap-12 md:flex-row md:justify-between md:gap-14">

          {/* ── Texto ── */}
          <div className="max-w-xl text-center md:text-left">
            <Eyebrow className="mb-6">{t("hero.tag")}</Eyebrow>

            <h1 className="display-large mb-6">
              <TextReveal lines={nameLines} delay={0.1} />
            </h1>

            <motion.p
              className="body-large mb-9 max-w-xl text-on-surface-variant"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.45 }}
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-3 md:justify-start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.45 }}
            >
              <a href="/projects" className="btn btn-filled btn-icon-leading group">
                <span>{t("hero.cta1")}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <button onClick={openContact} className="btn btn-outlined">
                <span>{t("hero.cta2")}</span>
              </button>
            </motion.div>
          </div>

          {/* ── Redes + foto ── */}
          <div className="flex shrink-0 flex-col-reverse items-center gap-5 md:flex-row md:gap-7">
            <motion.div
              className="flex flex-row items-center gap-4 md:flex-col md:gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.45 }}
            >
              <a
                href="https://www.linkedin.com/in/vitordsb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white elev-1 transition-shadow hover:elev-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/linkedin.svg" alt="LinkedIn" className="h-7 w-7" />
              </a>
              <a
                href="https://github.com/vitordsb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white elev-1 transition-shadow hover:elev-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/github.svg" alt="GitHub" className="h-7 w-7" />
              </a>
            </motion.div>

            {/* Recorte sem moldura: a foto flutua direto sobre a superfície da
                seção, sem card nem bloco de cor atrás. */}
            <div className="relative h-72 w-60 md:h-96 md:w-80">
              <Image
                src={profilePic}
                alt="Vitor de Souza Barreto"
                fill
                sizes="(max-width: 768px) 15rem, 20rem"
                className="object-contain object-bottom [mask-image:linear-gradient(to_top,transparent_0%,black_9%)] [-webkit-mask-image:linear-gradient(to_top,transparent_0%,black_9%)]"
                priority
              />
            </div>
          </div>
        </div>

        {/* ── Stats em cards de container ── */}
        <div className="mt-14 flex flex-wrap justify-center gap-3 md:justify-start">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`flex min-w-[10.5rem] items-baseline gap-3 rounded-[var(--shape-lg)] px-6 py-4 ${s.surface}`}
            >
              <CountUp
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                className="headline-small font-display"
              />
              <p className="label-medium opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-float absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-high text-on-surface-variant">
          <ChevronDown size={20} />
        </span>
      </div>
    </section>
  );
}
