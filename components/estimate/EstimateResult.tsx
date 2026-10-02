import { RotateCcw } from "lucide-react";
import { SOCIALS } from "@/lib/deck-content";
import type { Estimate } from "@/lib/estimate/scope";
import {
  mvpItems,
  PRICE_NOTES,
  quoteWhatsappText,
} from "@/lib/estimate/shared";
import { WhatsappIcon } from "@/components/deck/SocialIcons";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export default function EstimateResult({
  estimate,
  code,
  name,
  sentTo,
  pt,
  onRestart,
}: {
  estimate: Estimate;
  code: string;
  name: string;
  /** E-mail que recebeu a confirmação; vazio = não mandou. */
  sentTo?: string;
  pt: boolean;
  onRestart: () => void;
}) {
  const { items, platforms: plat } = mvpItems(estimate.scope, pt);
  const to = pt ? " a " : " to ";
  const weeks = `${estimate.weeksMin} a ${estimate.weeksMax} ${pt ? "semanas" : "weeks"}`;

  const whatsapp = `${SOCIALS.whatsapp}?text=${encodeURIComponent(
    quoteWhatsappText(name, code, pt),
  )}`;

  return (
    <section
      aria-label={pt ? "Seu orçamento" : "Your quote"}
      className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-low"
    >
      <div className="p-5 sm:p-7">
        <div className="mb-3 flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
          <span>{pt ? "Primeira versão (MVP)" : "First version (MVP)"}</span>
          <span className="shrink-0 normal-case tracking-[0.08em]">
            {pt ? "Pedido" : "Quote"}{" "}
            <span className="font-semibold text-on-surface">#{code}</span>
          </span>
        </div>
        <p className="text-[clamp(1.75rem,7vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] tabular-nums">
          {brl.format(estimate.min)}
          <span className="text-on-surface-variant">{to}</span>
          {brl.format(estimate.max)}
        </p>
        <p className="mt-2 text-sm font-medium">
          {pt
            ? "Valor de partida: muda conforme o escopo e a nossa conversa."
            : "Starting price: it changes with the scope and our conversation."}
        </p>
        <p className="mt-1 text-sm text-on-surface-variant">
          {pt ? "Prazo estimado do MVP:" : "Estimated MVP timeline:"}{" "}
          <span className="font-semibold text-on-surface">{weeks}</span>
          {plat.length > 0 && <> · {plat.join(" + ")}</>}
        </p>

        {estimate.scope.resumo && (
          <p className="mt-5 text-base leading-relaxed">
            {estimate.scope.resumo}
          </p>
        )}

        {items.length > 0 && (
          <>
            <p className="mb-2.5 mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
              {pt ? "O que entra no MVP" : "What's in the MVP"}
            </p>
            <ul className="flex flex-wrap gap-2">
              {items.map((it) => (
                <li
                  key={it}
                  className="rounded-full border border-outline-variant bg-surface px-3 py-1 text-sm"
                >
                  {it}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Visível de propósito, não letra miúda: o valor é de partida e
            quem vê isso antes de conversar não se sente enganado depois */}
        <div className="mt-6 rounded-xl border border-outline-variant bg-surface p-4">
          <p className="mb-2 text-sm font-semibold">
            {pt ? "Como esse valor funciona" : "How this price works"}
          </p>
          <ul className="space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            {PRICE_NOTES[pt ? "pt" : "en"].map((t) => (
              <li key={t} className="flex gap-2">
                <span
                  aria-hidden
                  className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-on-surface-variant"
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-outline-variant bg-surface px-5 py-4 sm:px-7">
        <p className="w-full text-sm text-on-surface-variant">
          {pt ? (
            <>
              Seu pedido{" "}
              <span className="font-semibold text-on-surface">#{code}</span> já
              está comigo. No WhatsApp, é só citar o número.
            </>
          ) : (
            <>
              Your quote{" "}
              <span className="font-semibold text-on-surface">#{code}</span> is
              already with me. On WhatsApp, just mention the number.
            </>
          )}
        </p>
        {sentTo && (
          <p className="-mt-1 w-full text-sm text-on-surface-variant">
            {pt
              ? "Enviei uma cópia deste orçamento pra "
              : "I sent a copy of this quote to "}
            <span className="font-medium text-on-surface">{sentTo}</span>.
          </p>
        )}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn h-12 rounded-lg bg-[#25D366] px-6 text-base text-white"
        >
          <span className="inline-flex items-center gap-2">
            <WhatsappIcon size={18} />
            {pt ? "Falar com o Vitor" : "Talk to Vitor"}
          </span>
        </a>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface"
        >
          <RotateCcw size={14} />
          {pt ? "Fazer outro orçamento" : "Start another quote"}
        </button>
      </div>
    </section>
  );
}
