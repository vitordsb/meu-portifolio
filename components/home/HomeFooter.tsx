"use client";

import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND, CNPJ } from "@/lib/site";
import { WORK_LINKS, l } from "@/lib/deck-content";
import { whatsappHref } from "@/lib/home-links";
import { FRAME, Reveal } from "./ui";

/** Convite final + rodapé de empresa (marca, CNPJ, contato, links). */
export default function HomeFooter() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const year = new Date().getFullYear();

  return (
    <footer className="pb-28 deck-wide:pb-10">
      <div className={FRAME}>
        <Reveal>
          <div className="rounded-3xl bg-on-surface px-6 py-12 text-surface sm:px-12 md:py-16">
            <h2 className="max-w-2xl text-[2rem] font-extrabold leading-[1.05] tracking-[-0.035em] md:text-5xl">
              {pt ? "Vamos tirar sua ideia do papel?" : "Ready to get your idea off the ground?"}
            </h2>
            <p className="mt-4 max-w-xl text-lg opacity-75">
              {pt
                ? "Cada semana com site lento ou pedido perdido é cliente indo pro concorrente. Faça o orçamento grátis ou chame no WhatsApp."
                : "Every week with a slow site or lost orders is customers going to a competitor. Get a free quote or message us on WhatsApp."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/orcamento"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-surface px-7 py-3 text-center text-base font-semibold text-on-surface transition-opacity hover:opacity-90"
              >
                <Sparkles size={18} className="shrink-0" />
                {pt ? "Orçamento grátis em 2 min" : "Free quote in 2 min"}
              </Link>
              <a
                href={whatsappHref(pt)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-surface/30 px-7 py-3 text-center text-base font-semibold transition-colors hover:bg-surface/10"
              >
                <MessageCircle size={18} className="shrink-0" />
                {pt ? "Falar no WhatsApp" : "Chat on WhatsApp"}
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-outline-variant pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold tracking-[-0.03em]">{BRAND.name}</p>
            <p className="mt-1 text-sm text-on-surface-variant">{BRAND.descriptor[language]}</p>
            <p className="mt-4 text-sm text-on-surface-variant">CNPJ {CNPJ}</p>
          </div>
          <nav aria-label={pt ? "Contratar" : "Hire us"}>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">
              {pt ? "Contratar" : "Hire us"}
            </p>
            <ul className="space-y-2.5 text-base">
              {WORK_LINKS.map((w) => (
                <li key={w.href}>
                  <Link href={w.href} className="hover:underline">
                    {l(w.label, language)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/quanto-custa" className="hover:underline">
                  {pt ? "Quanto custa" : "Pricing guide"}
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">
              {pt ? "Contato" : "Contact"}
            </p>
            <ul className="space-y-2.5 text-base">
              <li>
                <a href={whatsappHref(pt)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="break-all hover:underline">
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. {pt ? "Todos os direitos reservados." : "All rights reserved."}
          </p>
          <p className="flex gap-5">
            <Link href="/privacidade" className="hover:underline">
              {pt ? "Política de Privacidade" : "Privacy Policy"}
            </Link>
            <Link href="/termos" className="hover:underline">
              {pt ? "Termos de Uso" : "Terms of Use"}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
