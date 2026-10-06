"use client";

import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CNPJ } from "@/lib/site";
import { brl, type StartingPrice } from "./HomeServices";
import { Reveal, Section, SectionHeader } from "./ui";

/**
 * Dúvidas de quem nunca contratou software. <details> nativo: abre com toque
 * e teclado sem JavaScript, e o leitor de tela entende.
 */
export default function HomeFaq({ prices }: { prices: Record<string, StartingPrice> }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const landing = prices.landing;
  const site = prices.site;

  const items: { q: string; a: string }[] = pt
    ? [
        {
          q: "Quanto custa?",
          a: `Depende do que o projeto precisa fazer. Uma landing page começa em ${brl(landing.min)} e um site da empresa em ${brl(site.min)}. O orçamento guiado mostra a faixa do seu projeto em 2 minutos.`,
        },
        {
          q: "Quanto tempo leva?",
          a: `Uma landing page fica pronta em ${landing.weeksMin} a ${landing.weeksMax} semanas. Sistemas e aplicativos levam mais, e o prazo vem por escrito na proposta.`,
        },
        {
          q: "Preciso entender de tecnologia?",
          a: "Não. Você explica o que precisa com as suas palavras e recebe as telas desenhadas pra aprovar antes da programação.",
        },
        {
          q: "Como é o pagamento?",
          a: "Por Pix, boleto ou cartão, direto no site. O valor e a forma de pagamento ficam combinados na proposta.",
        },
        {
          q: "Tem contrato e nota fiscal?",
          a: `Sim. A empresa tem CNPJ ativo (${CNPJ}) e o projeto tem contrato e nota fiscal.`,
        },
      ]
    : [
        {
          q: "How much does it cost?",
          a: `It depends on what the project needs to do. A landing page starts at ${brl(landing.min)} and a company website at ${brl(site.min)}. The guided quote shows your project's range in 2 minutes.`,
        },
        {
          q: "How long does it take?",
          a: `A landing page is ready in ${landing.weeksMin} to ${landing.weeksMax} weeks. Systems and apps take longer, and the timeline comes in writing with the proposal.`,
        },
        {
          q: "Do I need to understand technology?",
          a: "No. You explain what you need in your own words and get the screens designed for approval before any coding.",
        },
        {
          q: "How do I pay?",
          a: "By Pix, bank slip or card, right on the website. Price and payment terms are agreed in the proposal.",
        },
        {
          q: "Is there a contract and invoice?",
          a: `Yes. The company is registered (CNPJ ${CNPJ}) and every project has a contract and an invoice.`,
        },
      ];

  return (
    <Section id="duvidas">
      <SectionHeader eyebrow={pt ? "Dúvidas" : "FAQ"} title={pt ? "Perguntas frequentes" : "Common questions"} />
      <Reveal>
        <div className="divide-y divide-outline-variant border-y border-outline-variant">
          {items.map((it) => (
            <details key={it.q} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {it.q}
                <Plus size={22} className="shrink-0 transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="max-w-3xl pb-6 text-base leading-relaxed text-on-surface-variant">{it.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
