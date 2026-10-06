"use client";

import Link from "next/link";
import {
  ArrowRight,
  Globe,
  LayoutGrid,
  Megaphone,
  ShoppingBag,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOME_SECTIONS, SERVICE_TYPES } from "@/lib/home-content";
import { Reveal, Section, SectionHeader } from "./ui";

export type StartingPrice = { min: number; weeksMin: number; weeksMax: number };

const ICONS: Record<string, LucideIcon> = {
  landing: Megaphone,
  site: Globe,
  loja: ShoppingBag,
  sistema: LayoutGrid,
  app: Smartphone,
};

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function HomeServices({ prices }: { prices: Record<string, StartingPrice> }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const section = HOME_SECTIONS.find((s) => s.id === "servicos")!;

  return (
    <Section id="servicos" aliases={section.aliases}>
      <SectionHeader
        eyebrow={pt ? "Serviços" : "Services"}
        title={pt ? "O que a gente faz" : "What we build"}
        lead={
          pt
            ? "Escolha o tipo de projeto. O valor é de partida e fecha depois da conversa."
            : "Pick a project type. Prices are starting points, finalized after we talk."
        }
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_TYPES.map((s, i) => {
          const Icon = ICONS[s.id] ?? Globe;
          const p = prices[s.id];
          return (
            <Reveal key={s.id} delay={0.05 * i} className="flex">
              <li className="flex w-full">
                <Link
                  href="/orcamento"
                  className="group flex w-full flex-col rounded-2xl border border-outline-variant bg-surface-low p-6 transition-colors hover:border-on-surface/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-high text-on-surface">
                    <Icon size={22} />
                  </span>
                  <span className="mt-5 text-xl font-bold tracking-[-0.02em]">{s.title[language]}</span>
                  <span className="mt-2 text-base leading-relaxed text-on-surface-variant">{s.text[language]}</span>
                  {p && (
                    <span className="mt-6 flex items-end justify-between gap-3 border-t border-outline-variant pt-4">
                      <span>
                        <span className="block text-xs text-on-surface-variant">{pt ? "a partir de" : "from"}</span>
                        <span className="text-lg font-bold">{brl(p.min)}</span>
                      </span>
                      <span className="text-right text-sm text-on-surface-variant">
                        {p.weeksMin}
                        {p.weeksMax !== p.weeksMin && ` ${pt ? "a" : "to"} ${p.weeksMax}`} {pt ? "semanas" : "weeks"}
                      </span>
                    </span>
                  )}
                </Link>
              </li>
            </Reveal>
          );
        })}

        {/* Quem não sabe o que precisa: o orçamento guiado decide junto */}
        <Reveal delay={0.25} className="flex">
          <li className="flex w-full">
            <Link
              href="/orcamento"
              className="group flex w-full flex-col justify-between rounded-2xl bg-on-surface p-6 text-surface"
            >
              <span>
                <Sparkles size={24} />
                <span className="mt-5 block text-xl font-bold tracking-[-0.02em]">
                  {pt ? "Não sabe qual escolher?" : "Not sure which one?"}
                </span>
                <span className="mt-2 block text-base leading-relaxed opacity-75">
                  {pt
                    ? "Responda tocando nas opções e veja a faixa de preço na hora."
                    : "Answer by tapping the options and see the price range right away."}
                </span>
              </span>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                {pt ? "Fazer orçamento grátis" : "Get a free quote"}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        </Reveal>
      </ul>

      <Reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-base">
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
    </Section>
  );
}
