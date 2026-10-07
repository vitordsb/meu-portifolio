import { useState } from "react";
import { HandCoins, RotateCcw, Users } from "lucide-react";
import CounterOffer from "./CounterOffer";
import { SOCIALS } from "@/lib/deck-content";
import type { Estimate } from "@/lib/estimate/scope";
import {
  mvpItems,
  PRICE_NOTES,
  quoteWhatsappText,
  teamText,
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
  contact,
  counterSent,
  onCounterSent,
  pt,
  onRestart,
}: {
  estimate: Estimate;
  code: string;
  name: string;
  /** E-mail que recebeu a confirmação; vazio = não mandou. */
  sentTo?: string;
  /** WhatsApp e e-mail do formulário, pra contraproposta já ir identificada. */
  contact: { whatsapp: string; email: string };
  counterSent: boolean;
  onCounterSent: () => void;
  pt: boolean;
  onRestart: () => void;
}) {
  const [negotiating, setNegotiating] = useState(counterSent);
  const { items, platforms: plat } = mvpItems(estimate.scope, pt);
  const to = pt ? " a " : " to ";
  const weeks = `${estimate.weeksMin} a ${estimate.weeksMax} ${pt ? "semanas" : "weeks"}`;
  const range = `${brl.format(estimate.min)}${to}${brl.format(estimate.max)}`;
  const payment = estimate.payment ?? [];

  const whatsapp = `${SOCIALS.whatsapp}?text=${encodeURIComponent(
    quoteWhatsappText(name, code, pt),
  )}`;

  return (
    <section
      aria-label={pt ? "Seu orçamento" : "Your quote"}
      className="overflow-hidden border border-outline-variant bg-surface-low"
    >
      <div className="p-5 sm:p-7">
        <div className="mb-3 flex items-baseline justify-between gap-3 text-sm text-on-surface-variant">
          <span>{pt ? "Primeira versão (MVP)" : "First version (MVP)"}</span>
          <span className="shrink-0">
            {pt ? "Pedido" : "Quote"}{" "}
            <span className="font-mono font-semibold text-on-surface">#{code}</span>
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

        {estimate.team && (
          <div className="mt-5 border border-outline-variant bg-surface p-4">
            <p className="flex items-center gap-2 text-base font-semibold">
              <Users size={18} className="shrink-0" />
              {teamText(estimate.team.size, pt)}
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {estimate.team.roles.map((r, i) => (
                <li key={i} className="rounded-full bg-surface-high px-3 py-1 text-sm">
                  {pt ? r.pt : r.en}
                </li>
              ))}
            </ul>
          </div>
        )}

        {estimate.scope.resumo && (
          <p className="mt-5 text-base leading-relaxed">
            {estimate.scope.resumo}
          </p>
        )}

        {items.length > 0 && (
          <>
            <p className="mb-2.5 mt-6 text-base font-semibold">
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

        {payment.length > 0 && (
          <>
            <p className="mb-2.5 mt-6 text-base font-semibold">
              {pt ? "Formas de pagamento" : "Payment options"}
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {payment.map((p) => (
                <li
                  key={p.id}
                  className="border border-outline-variant bg-surface px-4 py-3"
                >
                  <p className="text-sm font-semibold">
                    {pt ? p.label.pt : p.label.en}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">
                    {pt ? p.detail.pt : p.detail.en}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}

        {estimate.aboveBudget && !negotiating && (
          <p className="mt-4 text-sm leading-relaxed">
            {pt
              ? "Ficou acima do que você pode investir? Manda uma contraproposta: dá pra ajustar o escopo, o prazo ou a forma de pagamento."
              : "Above what you can invest? Send a counteroffer: we can adjust scope, timeline or payment."}
          </p>
        )}

        {/* Visível de propósito, não letra miúda: o valor é de partida e
            quem vê isso antes de conversar não se sente enganado depois */}
        <div className="mt-6 border border-outline-variant bg-surface p-4">
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

      {negotiating && (
        <div className="border-t border-outline-variant bg-surface-low px-5 py-4 sm:px-7">
          <CounterOffer
            pt={pt}
            code={code}
            name={name}
            whatsapp={contact.whatsapp}
            email={contact.email}
            range={range}
            sent={counterSent}
            onSent={onCounterSent}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-outline-variant bg-surface px-5 py-4 sm:px-7">
        <p className="w-full text-sm text-on-surface-variant">
          {pt ? (
            <>
              Seu pedido{" "}
              <span className="font-semibold text-on-surface">#{code}</span> já
              chegou pra gente. No WhatsApp, é só citar o número.
            </>
          ) : (
            <>
              Your quote{" "}
              <span className="font-semibold text-on-surface">#{code}</span> is
              already with us. On WhatsApp, just mention the number.
            </>
          )}
        </p>
        {sentTo && (
          <p className="-mt-1 w-full text-sm text-on-surface-variant">
            {pt
              ? "Enviamos uma cópia deste orçamento pra "
              : "We sent a copy of this quote to "}
            <span className="font-medium text-on-surface">{sentTo}</span>.
          </p>
        )}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-filled h-12 rounded-none px-6 text-base"
        >
          <span className="inline-flex items-center gap-2">
            <WhatsappIcon size={18} />
            {pt ? "Falar no WhatsApp" : "Chat on WhatsApp"}
          </span>
        </a>
        {!negotiating && (
          <button
            type="button"
            onClick={() => setNegotiating(true)}
            className="btn btn-outlined h-12 rounded-none px-5 text-base"
          >
            <span className="inline-flex items-center gap-2">
              <HandCoins size={18} />
              {pt ? "Negociar valor" : "Negotiate"}
            </span>
          </button>
        )}
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
