"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { HERO, SERVICES, SOCIALS, l } from "@/lib/deck-content";
import { CountUp } from "@/components/motion/CountUp";
import { Line, Rise } from "../Reveal";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "../SocialIcons";
import photo from "@/app/(public)/images/vitu.jpeg";

// Cada bolinha na cor da marca. O GitHub é preto, então inverte no tema
// escuro pra não sumir no fundo.
const SOCIAL_LINKS = [
  {
    href: SOCIALS.linkedin,
    label: "LinkedIn",
    Icon: LinkedinIcon,
    color: "bg-[#0A66C2] text-white",
  },
  {
    href: SOCIALS.github,
    label: "GitHub",
    Icon: GithubIcon,
    color: "bg-[#181717] text-white dark:bg-white dark:text-[#181717]",
  },
  {
    href: SOCIALS.whatsapp,
    label: "WhatsApp",
    Icon: WhatsappIcon,
    color: "bg-[#25D366] text-white",
  },
];

/** Foto do Vitor, redonda e pequena (tamanho de avatar). */
function Photo({ className }: { className: string }) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-outline-variant ${className}`}
    >
      <Image
        src={photo}
        alt=""
        fill
        priority
        sizes="48px"
        className="object-cover object-top"
      />
    </span>
  );
}

/**
 * Banner de entrada. Tudo sobe de baixo pra cima, um de cada vez:
 * título, subtítulo, nome, frase, as três redes, os três serviços e, fechando,
 * os números. A frase diz o que eu entrego; os números, por que confiar.
 */
export default function HeroSlide({
  projectCount,
  courseCount,
}: {
  projectCount: number;
  courseCount: number;
}) {
  const { language } = useLanguage();
  const { open: openContact } = useContactModal();
  const pt = language === "pt";

  const stats = [
    {
      value: HERO.years,
      prefix: "+",
      label: pt ? "anos de carreira" : "years in the field",
    },
    {
      value: projectCount,
      prefix: "",
      label: pt ? "projetos entregues" : "projects shipped",
    },
    {
      value: courseCount,
      prefix: "",
      label: pt ? "cursos concluídos" : "courses completed",
    },
  ].filter((s) => s.value > 0);

  return (
    // O espaço que sobra se divide 1 : 1.6 entre cima e embaixo: o banner fica
    // acima do centro (centralizado parecia baixo) sem largar tela alta vazia.
    <div className="flex min-h-full flex-col px-4 pb-24 pt-[4.75rem] sm:px-8 sm:pb-36 sm:pt-24">
      <div aria-hidden className="flex-[1]" />
      <div className="mx-auto w-full max-w-[50rem]">
        {/* Cargo: o que eu sou. O título grande logo abaixo é a especialidade.
            Abaixo de 1024px a foto mora aqui (não há margem pra pendurar). */}
        <Rise step={0}>
          <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant sm:mb-5 sm:text-sm">
            <Photo className="h-8 w-8 lg:hidden" />
            {l(HERO.role, language)}
          </p>
        </Rise>

        <h1
          aria-label={`${l(HERO.role, language)}, ${HERO.lines.join(" ")}, ${HERO.name}`}
        >
          {HERO.lines.map((line, i) => (
            <span key={line} className="relative block">
              {/* Telas largas: foto pequena "solta" na margem, à esquerda do
                  UI/UX, sem empurrar o texto. Posição pelo wrapper (flex),
                  porque o transform do Rise é do Framer Motion. */}
              {i === 0 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-full mr-6 hidden items-center lg:flex"
                >
                  <Rise step={0.6}>
                    <Photo className="h-12 w-12" />
                  </Rise>
                </span>
              )}
              <Line step={0.6 + i} className="deck-display" as="span">
                {line}
              </Line>
            </span>
          ))}
        </h1>

        <Line step={2.6} as="div" className="deck-name mt-3 sm:mt-5">
          {HERO.name}
        </Line>

        {/* O que eu entrego */}
        <Line
          step={3.2}
          as="div"
          className="mt-3 text-lg leading-snug text-on-surface-variant sm:mt-4 sm:text-xl"
        >
          {l(HERO.tagline, language)}
        </Line>

        <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon, color }, i) => (
              <Rise as="li" key={label} step={4 + i * 0.4}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition hover:-translate-y-0.5 hover:opacity-90 ${color}`}
                >
                  <Icon size={17} />
                </a>
              </Rise>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {SERVICES.map((s, i) => {
              const label = l(s.label, language);
              return (
                <Rise key={s.key} step={5.2 + i * 0.4}>
                  {s.href ? (
                    <a
                      href={s.href}
                      className={
                        s.primary
                          ? "btn btn-filled h-12 rounded-lg px-7 text-base"
                          : "link-underline"
                      }
                    >
                      <span>{label}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openContact(label)}
                      className={
                        s.primary
                          ? "btn btn-filled h-12 rounded-lg px-7 text-base"
                          : "link-underline"
                      }
                    >
                      <span>{label}</span>
                    </button>
                  )}
                </Rise>
              );
            })}
          </div>
        </div>

        {/* Prova rápida: números que o próprio site confirma */}
        {stats.length > 0 && (
          <Rise step={6.6}>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-outline-variant pt-5 sm:mt-10 sm:gap-x-12 sm:pt-6">
              {stats.map((st) => (
                <div key={st.label} className="flex items-baseline gap-2">
                  <dt className="sr-only">{st.label}</dt>
                  <dd className="text-xl font-extrabold tracking-[-0.03em] tabular-nums sm:text-2xl">
                    <CountUp
                      value={st.value}
                      prefix={st.prefix}
                      startAfter={1.6}
                    />
                  </dd>
                  <dd
                    aria-hidden
                    className="font-mono text-[11px] text-on-surface-variant sm:text-xs"
                  >
                    {st.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        )}
      </div>
      <div aria-hidden className="flex-[1.6]" />
    </div>
  );
}
