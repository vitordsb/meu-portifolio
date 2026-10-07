"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowRight,
  Clock,
  Loader2,
  ReceiptText,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIALS } from "@/lib/deck-content";
import { CNPJ } from "@/lib/email-layout";
import { WhatsappIcon } from "@/components/deck/SocialIcons";
import { PACKAGES, type ServicePackage } from "@/lib/payments/packages";
import PageHeader from "./PageHeader";
import AfterPayment from "./AfterPayment";

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
    trackEvent("pacote_contratar", { pacote: pkg.id });
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
        trackEvent("pacote_fallback_whatsapp", { pacote: pkg.id });
    } catch {
      setNotice({ pkg: pkg.id, kind: "offline" });
    }
    setBusy(null);
  };

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader />

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12 pb-20 pt-10 sm:pt-14 [@media(max-height:500px)]:pt-6">
        <h1 className="max-w-2xl text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          {pt ? "Serviços com preço fechado" : "Fixed-price services"}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-on-surface-variant">
          {pt
            ? "Escolha, pague com Pix ou cartão e a gente começa. Sem orçamento, sem espera."
            : "Pick one, pay with Pix or card and we get started. No quote, no waiting."}
        </p>

        {/* Do mais caro pro mais barato, como na home */}
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {[...PACKAGES]
            .sort((a, b) => b.price - a.price)
            .map((pkg) => (
              <li
                key={pkg.id}
                id={pkg.id}
                className={`relative flex flex-col border bg-surface-low p-6 sm:p-7 ${
                  pkg.featured
                    ? "border-on-surface/60"
                    : "border-outline-variant"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-on-surface px-2.5 py-1 text-[0.75rem] font-semibold text-surface">
                    {pt ? "Mais pedido" : "Most popular"}
                  </span>
                )}
                <h2 className="text-xl font-extrabold tracking-[-0.02em]">
                  {pkg.name[language]}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                  {pkg.summary[language]}
                </p>

                <p className="mt-5 text-[2rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
                  {brl.format(pkg.price)}
                </p>
                <p className="mt-1.5 min-h-[2.5rem] text-sm text-on-surface-variant">
                  {pkg.maxInstallments > 1
                    ? pt
                      ? `Pagamento único no Pix, ou em até ${pkg.maxInstallments}x no cartão`
                      : `One-time payment by Pix, or up to ${pkg.maxInstallments}x on card`
                    : pt
                      ? "Pagamento único, no Pix ou cartão"
                      : "One-time payment, by Pix or card"}
                </p>

                {/* O que a pessoa leva pelo valor: preço ligado ao entregável
                  dói menos (Prelec e Loewenstein, "pain of paying"). Uma frase,
                  não lista: os cards ficam do mesmo tamanho. */}
                <p className="mt-5 text-sm leading-relaxed">
                  <span className="font-semibold">
                    {pt ? "O que você recebe: " : "What you get: "}
                  </span>
                  <span className="text-on-surface-variant">
                    {pkg.receives[language]}
                  </span>
                </p>
                {pkg.delivery && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">
                    <Clock size={16} className="shrink-0" />
                    {pkg.delivery[language]}
                  </p>
                )}

                <div className="mt-auto pt-7">
                  <button
                    type="button"
                    onClick={() => hire(pkg)}
                    disabled={busy !== null}
                    aria-busy={busy === pkg.id}
                    className={`btn h-12 w-full rounded-none text-base ${
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
                          {pt
                            ? `Contratar por ${brl.format(pkg.price)}`
                            : `Hire for ${brl.format(pkg.price)}`}
                          <ArrowRight size={18} />
                        </>
                      )}
                    </span>
                  </button>

                  <p className="mt-2 text-center text-xs text-on-surface-variant">
                    {pt
                      ? "Você vai pra página segura do Asaas pra pagar."
                      : "You'll go to Asaas's secure page to pay."}
                  </p>
                </div>

                {notice?.pkg === pkg.id && (
                  <div role="alert" className="mt-4 text-sm">
                    {notice.kind === "fallback" ? (
                      <>
                        <p className="text-on-surface-variant">
                          {pt
                            ? "O pagamento online está indisponível agora. Contrata pelo WhatsApp que a gente te manda o link."
                            : "Online payment is unavailable right now. Hire us on WhatsApp and we'll send you the link."}
                        </p>
                        <a
                          href={`${SOCIALS.whatsapp}?text=${encodeURIComponent(
                            pt
                              ? `Olá! Quero contratar o pacote ${pkg.name.pt} (${brl.format(pkg.price)}).`
                              : `Hi! I'd like to hire the ${pkg.name.en} package (${brl.format(pkg.price)}).`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outlined mt-3 h-11 w-full rounded-none text-base"
                        >
                          <span className="inline-flex items-center gap-2">
                            <WhatsappIcon size={18} />
                            {pt
                              ? "Contratar pelo WhatsApp"
                              : "Hire on WhatsApp"}
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

        <div className="mt-6">
          <AfterPayment
            title={
              pt
                ? "Como funciona depois que você contrata"
                : "What happens after you hire"
            }
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            href="/raio-x"
            className="group flex items-center justify-between gap-4 border border-outline-variant p-6 transition-colors hover:border-on-surface/40 md:col-span-2"
          >
            <span>
              <span className="flex items-center gap-2 font-semibold">
                <ScanSearch size={16} />
                {pt
                  ? "Já tem site? Faça o raio-x grátis"
                  : "Already have a site? Run a free check"}
              </span>
              <span className="mt-1 block text-sm text-on-surface-variant">
                {pt
                  ? "Em 30 segundos você vê se ele precisa de ajustes ou de um site novo."
                  : "In 30 seconds you'll see whether it needs tweaks or a new site."}
              </span>
            </span>
            <ArrowRight
              size={18}
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/orcamento"
            className="group flex items-center justify-between gap-4 border border-outline-variant p-6 transition-colors hover:border-on-surface/40"
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
            className="group flex items-center justify-between gap-4 border border-outline-variant p-6 transition-colors hover:border-on-surface/40"
          >
            <span>
              <span className="flex items-center gap-2 font-semibold">
                <ReceiptText size={16} />
                {pt
                  ? "Já combinou um valor com a gente?"
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

        <p className="mt-8 text-sm text-on-surface-variant">
          {pt ? "Comparando preços? Veja " : "Comparing prices? See "}
          <Link
            href="/quanto-custa"
            className="font-medium text-on-surface underline underline-offset-4"
          >
            {pt
              ? "quanto custa cada tipo de projeto"
              : "how much each type of project costs"}
          </Link>
          .
        </p>

        <p className="mt-6 flex gap-2 text-xs leading-relaxed text-on-surface-variant">
          <ShieldCheck size={14} className="mt-0.5 shrink-0" />
          <span>
            {pt
              ? "Pagamento seguro processado pelo Asaas. Seus dados de cartão não passam por este site."
              : "Secure payment processed by Asaas. Your card details never touch this site."}
            <span className="whitespace-nowrap"> · CNPJ {CNPJ}</span>
          </span>
        </p>
        <p className="mt-2 text-center text-xs text-on-surface-variant">
          <Link
            href="/termos"
            className="underline underline-offset-2 hover:text-on-surface"
          >
            {pt ? "Termos de Uso" : "Terms of Use"}
          </Link>
          {" · "}
          <Link
            href="/privacidade"
            className="underline underline-offset-2 hover:text-on-surface"
          >
            {pt ? "Política de Privacidade" : "Privacy Policy"}
          </Link>
        </p>
      </main>
    </div>
  );
}
