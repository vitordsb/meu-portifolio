"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import photo from "@/app/(public)/images/vitu.jpeg";
import { HERO, SOCIALS, SPECIALTIES } from "@/lib/deck-content";
import { FOUNDER, HOME_SECTIONS } from "@/lib/home-content";
import AboutMeDrawer from "@/components/deck/AboutMeDrawer";
import { Reveal, Section } from "./ui";

/** Tecnologias principais (as das especializações), sem repetir. */
const TECH = [...new Set(SPECIALTIES.flatMap((s) => s.tags))].filter(
  (t) => !["Design System", "Acessibilidade", "Prototipação", "iOS", "Android"].includes(t),
);

/**
 * Quem faz: o fundador como credencial da empresa. Experiência, cursos e a
 * trajetória moram aqui (e no painel "Conheça sobre mim"), não no topo.
 */
export default function HomeAbout({
  projectCount,
  courseCount,
}: {
  projectCount: number;
  courseCount: number;
}) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const section = HOME_SECTIONS.find((s) => s.id === "sobre")!;

  const stats = [
    { n: `+${HERO.years}`, label: pt ? "anos de carreira" : "years of experience" },
    { n: String(projectCount), label: pt ? "projetos entregues" : "projects delivered" },
    { n: String(courseCount), label: pt ? "cursos concluídos" : "courses completed" },
  ];

  return (
    <Section id="sobre" aliases={section.aliases} className="bg-surface-low/40">
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-14">
        <Reveal className="md:sticky md:top-10">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[20rem] overflow-hidden rounded-3xl ring-1 ring-outline-variant">
            <Image
              src={photo}
              alt={FOUNDER.name}
              fill
              sizes="(min-width: 768px) 20rem, 80vw"
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">
            {pt ? "Quem faz" : "Who builds it"}
          </p>
          <h2 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.035em] md:text-5xl">
            {FOUNDER.name}
          </h2>
          <p className="mt-2 text-lg text-on-surface-variant">{FOUNDER.role[language]}</p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{FOUNDER.bio[language]}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-extrabold tracking-[-0.03em] tabular-nums">{s.n}</dd>
                <dd className="text-sm text-on-surface-variant">{s.label}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label={pt ? "Tecnologias" : "Technologies"}>
            {TECH.map((t) => (
              <li key={t} className="rounded-full border border-outline-variant px-3 py-1.5 font-mono text-[0.8125rem]">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-base">
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline">
              LinkedIn
            </a>
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" className="link-underline">
              GitHub
            </a>
          </div>

          <div className="mt-8 max-w-xl">
            <AboutMeDrawer language={language} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
