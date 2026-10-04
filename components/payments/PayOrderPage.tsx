"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIALS } from "@/lib/deck-content";
import { CNPJ } from "@/lib/email-layout";
import PageHeader from "./PageHeader";

type Order = {
  code: string;
  description: string;
  total: number;
  installments: number;
  paidInstallments: number;
  status: "pago" | "pendente";
  invoiceUrl: string | null;
  nextDueDate: string | null;
};

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

/**
 * Pagar um pedido já combinado: a pessoa digita o número (ou chega com
 * ?pedido=) e cai na fatura do Asaas com o valor acertado.
 */
export default function PayOrderPage() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const params = useSearchParams();

  const [code, setCode] = useState(
    () => params.get("pedido")?.replace(/\D/g, "").slice(0, 5) ?? "",
  );
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(
    async (value: string) => {
      if (!/^\d{5}$/.test(value)) return;
      setBusy(true);
      setError(null);
      setOrder(null);
      try {
        const res = await fetch(`/api/pagamentos/pedido?codigo=${value}`);
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setOrder(data as Order);
          track("pedido_consulta", { status: data.status });
        } else if (res.status === 404) {
          setError(
            pt
              ? "Não achei esse pedido. Confere o número ou me chama no WhatsApp."
              : "I couldn't find that order. Check the number or reach me on WhatsApp.",
          );
        } else if (res.status === 429) {
          setError(
            pt
              ? "Muitas consultas seguidas. Tenta de novo em alguns minutos."
              : "Too many lookups. Try again in a few minutes.",
          );
        } else {
          setError(
            pt
              ? "Não consegui consultar agora. Tenta de novo em instantes."
              : "Couldn't look it up right now. Try again shortly.",
          );
        }
      } catch {
        setError(
          pt ? "Sem conexão. Tenta de novo." : "No connection. Try again.",
        );
      } finally {
        setBusy(false);
      }
    },
    [pt],
  );

  // Link direto (/pagar?pedido=15703): já consulta ao abrir
  useEffect(() => {
    if (/^\d{5}$/.test(code)) lookup(code);
    // só na abertura
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const due = order?.nextDueDate
    ? new Date(`${order.nextDueDate}T12:00:00`).toLocaleDateString(
        pt ? "pt-BR" : "en-US",
      )
    : null;

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader width="max-w-xl" />

      <main className="mx-auto w-full max-w-xl px-4 pb-20 pt-10 sm:pt-14 [@media(max-height:500px)]:pt-6">
        <h1 className="text-[clamp(2rem,6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          {pt ? "Pagar meu pedido" : "Pay my order"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
          {pt
            ? "Digite o número do pedido que a gente combinou. Você paga com Pix, boleto ou cartão."
            : "Enter the order number we agreed on. Pay with Pix, bank slip or card."}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup(code);
          }}
          className="mt-8 flex gap-2"
        >
          <label htmlFor="pedido" className="sr-only">
            {pt ? "Número do pedido" : "Order number"}
          </label>
          <div className="flex h-12 flex-1 items-center rounded-lg border border-outline-variant bg-surface-low px-4 focus-within:border-on-surface/60">
            <span className="mr-1 text-lg text-on-surface-variant">#</span>
            <input
              id="pedido"
              inputMode="numeric"
              autoComplete="off"
              placeholder="15703"
              value={code}
              maxLength={5}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              className="w-full bg-transparent text-lg tracking-[0.08em] tabular-nums outline-none placeholder:text-on-surface-variant/60"
            />
          </div>
          <button
            type="submit"
            disabled={code.length !== 5 || busy}
            className="btn btn-filled h-12 shrink-0 rounded-lg px-5 text-base"
          >
            <span className="inline-flex items-center gap-2">
              {busy ? <Loader2 size={18} className="animate-spin" /> : null}
              {pt ? "Buscar" : "Find"}
            </span>
          </button>
        </form>

        {error && (
          <div role="alert" className="mt-5 text-sm text-on-surface-variant">
            <p>{error}</p>
            <a
              href={SOCIALS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex font-semibold text-on-surface underline underline-offset-4"
            >
              {pt ? "Abrir WhatsApp" : "Open WhatsApp"}
            </a>
          </div>
        )}

        {order && (
          <section
            aria-label={pt ? "Seu pedido" : "Your order"}
            className="mt-8 overflow-hidden rounded-2xl border border-outline-variant bg-surface-low"
          >
            <div className="p-5 sm:p-7">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
                {pt ? "Pedido" : "Order"} #{order.code}
              </p>
              {order.description && (
                <p className="text-lg font-semibold leading-snug">
                  {order.description}
                </p>
              )}
              <p className="mt-4 text-[2rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
                {brl.format(order.total)}
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                {order.installments > 1
                  ? pt
                    ? `Em ${order.installments} parcelas · ${order.paidInstallments} de ${order.installments} pagas`
                    : `In ${order.installments} installments · ${order.paidInstallments} of ${order.installments} paid`
                  : pt
                    ? "Pagamento único"
                    : "Single payment"}
                {due && order.status === "pendente" && (
                  <>
                    {" · "}
                    {pt ? "vence em" : "due"} {due}
                  </>
                )}
              </p>
            </div>

            <div className="border-t border-outline-variant bg-surface px-5 py-4 sm:px-7">
              {order.status === "pago" ? (
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 size={18} className="text-[#25D366]" />
                  {pt
                    ? "Esse pedido já está pago. Obrigado!"
                    : "This order is already paid. Thank you!"}
                </p>
              ) : order.invoiceUrl ? (
                <a
                  href={order.invoiceUrl}
                  onClick={() => track("pedido_pagar", { codigo: order.code })}
                  className="btn btn-filled h-12 w-full rounded-lg text-base sm:w-auto sm:px-7"
                >
                  <span className="inline-flex items-center gap-2">
                    {order.installments > 1 && order.paidInstallments > 0
                      ? pt
                        ? "Pagar próxima parcela"
                        : "Pay next installment"
                      : pt
                        ? "Pagar agora"
                        : "Pay now"}
                    <ArrowRight size={18} />
                  </span>
                </a>
              ) : null}
            </div>
          </section>
        )}

        <p className="mt-10 flex gap-2 text-xs leading-relaxed text-on-surface-variant">
          <ShieldCheck size={14} className="mt-0.5 shrink-0" />
          <span>
            {pt
              ? "Pagamento seguro processado pelo Asaas."
              : "Secure payment processed by Asaas."}
            <span className="whitespace-nowrap"> · CNPJ {CNPJ}</span>
          </span>
        </p>
      </main>
    </div>
  );
}
