"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@vercel/analytics";
import {
  ArrowRight,
  Check,
  Loader2,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIALS } from "@/lib/deck-content";
import { CNPJ } from "@/lib/email-layout";
import { WhatsappIcon } from "@/components/deck/SocialIcons";
import { PACKAGES, type ServicePackage } from "@/lib/payments/packages";
import PageHeader from "./PageHeader";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

type Notice = { pkg: string; kind: "fallback" | "rate" | "offline" };

/**
 * Vitrine de pacotes com preço fechado. "Contratar" cria a sessão de
 * checkout no Asaas (o preço sai do servidor) e leva a pessoa pra lá.
 *
 * Se o Asaas não abrir o pagamento (conta em análise, instabilidade), o card
 * oferece contratar pelo WhatsApp com o pacote já escrito: a venda não morre
 * num erro.
 */
export default function ServicesPage() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const hire = async (pkg: ServicePackage) => {
    setBusy(pkg.id);
    setNotice(null);
    track("pacote_contratar", { pacote: pkg.id });
    try {
      const res = await fetch("/api/pagamentos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return; // segue "carregando" até a página do Asaas abrir
      }
      const kind = res.status === 429 ? "rate" : "fallback";
      setNotice({ pkg: pkg.id, kind });
      if (kind === "fallback")
        track("pacote_fallback_whatsapp", { pacote: pkg.id });
    } catch {
      setNotice({ pkg: pkg.id, kind: "offline" });
    }
    setBusy(null);
  };

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader
        eyebrow={pt ? "Serviços" : "Services"}
        width="max-w-5xl 2xl:max-w-[88rem]"
      />

      <main className="mx-auto w-full max-w-5xl px-4 pb-20 2xl:max-w-[88rem] pt-10 sm:pt-14 [@media(max-height:500px)]:pt-6">
        <h1 className="max-w-2xl text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          {pt ? "Serviços com preço fechado" : "Fixed-price services"}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-on-surface-variant">
          {pt
            ? "Escolha, pague com Pix ou cartão e eu começo. Sem orçamento, sem espera."
            : "Pick one, pay with Pix or card and I get started. No quote, no waiting."}
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <li
              key={pkg.id}
              id={pkg.id}
              className={`relative flex flex-col rounded-2xl border bg-surface-low p-6 sm:p-7 ${
                pkg.featured ? "border-on-surface/60" : "border-outline-variant"
              }`}
            >
              {pkg.featured && (
                <span className="absolute right-5 top-5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-on-primary">
                  {pt ? "Mais pedido" : "Most popular"}
                </span>
              )}
              <h2 className="pr-24 text-xl font-extrabold tracking-[-0.02em]">
                {pkg.name[language]}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                {pkg.summary[language]}
              </p>

              <p className="mt-5 text-[2rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
                {brl.format(pkg.price)}
              </p>
              <p className="mt-1.5 text-sm text-on-surface-variant">
                {pkg.maxInstallments > 1
                  ? pt
                    ? `ou até ${pkg.maxInstallments}x no cartão`
                    : `or up to ${pkg.maxInstallments}x on card`
                  : pt
                    ? "Pix ou cartão"
                    : "Pix or card"}
              </p>

              <ul className="mt-5 space-y-2 text-sm">
                {pkg.includes[language].map((it) => (
                  <li key={it} className="flex gap-2.5">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-on-surface-variant"
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => hire(pkg)}
                disabled={busy !== null}
                aria-busy={busy === pkg.id}
                className={`btn mt-7 h-12 w-full rounded-lg text-base ${
                  pkg.featured ? "btn-filled" : "btn-outlined"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {busy === pkg.id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {pt ? "Abrindo pagamento..." : "Opening payment..."}
                    </>
                  ) : (
                    <>
                      {pt ? "Contratar" : "Hire"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </span>
              </button>

              {notice?.pkg === pkg.id && (
                <div role="alert" className="mt-4 text-sm">
                  {notice.kind === "fallback" ? (
                    <>
                      <p className="text-on-surface-variant">
                        {pt
                          ? "O pagamento online está indisponível agora. Contrata comigo pelo WhatsApp que eu te mando o link."
                          : "Online payment is unavailable right now. Hire me on WhatsApp and I'll send you the link."}
                      </p>
                      <a
                        href={`${SOCIALS.whatsapp}?text=${encodeURIComponent(
                          pt
                            ? `Olá! Quero contratar o pacote ${pkg.name.pt} (${brl.format(pkg.price)}).`
                            : `Hi! I'd like to hire the ${pkg.name.en} package (${brl.format(pkg.price)}).`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn mt-3 h-11 w-full rounded-lg bg-[#25D366] text-base text-white"
                      >
                        <span className="inline-flex items-center gap-2">
                          <WhatsappIcon size={18} />
                          {pt ? "Contratar pelo WhatsApp" : "Hire on WhatsApp"}
                        </span>
                      </a>
                    </>
                  ) : (
                    <p className="text-error">
                      {notice.kind === "rate"
                        ? pt
                          ? "Muitas tentativas seguidas. Tenta de novo em alguns minutos."
                          : "Too many attempts. Try again in a few minutes."
                        : pt
                          ? "Sem conexão. Tenta de novo."
                          : "No connection. Try again."}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            href="/orcamento"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-outline-variant p-6 transition-colors hover:border-on-surface/40"
          >
            <span>
              <span className="flex items-center gap-2 font-semibold">
                <Sparkles size={16} />
                {pt ? "Precisa de algo sob medida?" : "Need something custom?"}
              </span>
              <span className="mt-1 block text-sm text-on-surface-variant">
                {pt
                  ? "Orçamento com IA em 2 minutos."
                  : "AI quote in 2 minutes."}
              </span>
            </span>
            <ArrowRight
              size={18}
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/pagar"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-outline-variant p-6 transition-colors hover:border-on-surface/40"
          >
            <span>
              <span className="flex items-center gap-2 font-semibold">
                <ReceiptText size={16} />
                {pt
                  ? "Já combinou um valor comigo?"
                  : "Already agreed on a price?"}
              </span>
              <span className="mt-1 block text-sm text-on-surface-variant">
                {pt
                  ? "Pague seu pedido pelo número."
                  : "Pay your order by its number."}
              </span>
            </span>
            <ArrowRight
              size={18}
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <p className="mt-10 flex gap-2 text-xs leading-relaxed text-on-surface-variant">
          <ShieldCheck size={14} className="mt-0.5 shrink-0" />
          <span>
            {pt
              ? "Pagamento seguro processado pelo Asaas. Seus dados de cartão não passam por este site."
              : "Secure payment processed by Asaas. Your card details never touch this site."}
            <span className="whitespace-nowrap"> · CNPJ {CNPJ}</span>
          </span>
        </p>
      </main>
    </div>
  );
}
