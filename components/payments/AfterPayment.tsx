"use client";

import { FileText, MailCheck, MessageCircle, RotateCcw, ShieldCheck, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * O que acontece depois de pagar + garantias. Mostrar o processo
 * (transparência operacional, Buell e Norton, Harvard) aumenta o valor
 * percebido e a confiança; deixar claro que dá pra desistir em 7 dias (CDC
 * art. 49) tira o medo de perder o dinheiro (aversão a perda).
 *
 * Mesmo bloco em /servicos, /pagar e na página de obrigado: a pessoa sempre
 * sabe o próximo passo.
 */
export default function AfterPayment({ title }: { title?: string }) {
  const { language } = useLanguage();
  const pt = language === "pt";

  const steps = pt
    ? [
        { icon: MailCheck, title: "Confirmação por e-mail", text: "Pix confirma na hora; cartão, em alguns minutos." },
        { icon: MessageCircle, title: "A gente te chama", text: "Em até 1 dia útil, no WhatsApp, pra combinar o início." },
        { icon: CalendarCheck, title: "Começa no dia combinado", text: "E a entrega segue o prazo do que você contratou." },
      ]
    : [
        { icon: MailCheck, title: "Email confirmation", text: "Pix confirms instantly; card, within minutes." },
        { icon: MessageCircle, title: "We reach out", text: "Within 1 business day, on WhatsApp, to plan the start." },
        { icon: CalendarCheck, title: "We start on the agreed day", text: "And delivery follows the timeline of what you hired." },
      ];

  const guarantees = pt
    ? [
        { icon: RotateCcw, text: "7 dias pra desistir, com o dinheiro de volta" },
        { icon: FileText, text: "Nota fiscal do serviço" },
        { icon: ShieldCheck, text: "Pagamento pelo Asaas: o cartão não passa por este site" },
      ]
    : [
        { icon: RotateCcw, text: "7 days to cancel with a full refund" },
        { icon: FileText, text: "Invoice for the service" },
        { icon: ShieldCheck, text: "Paid through Asaas: your card never touches this site" },
      ];

  return (
    <section aria-label={title ?? (pt ? "Depois de pagar" : "After you pay")} className="rounded-2xl border border-outline-variant bg-surface-low p-5 sm:p-6">
      <h2 className="text-lg font-bold">{title ?? (pt ? "Depois de pagar" : "After you pay")}</h2>
      <ol className="mt-4 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-on-surface text-surface">
              <s.icon size={18} />
            </span>
            <span>
              <span className="block text-base font-semibold">
                {i + 1}. {s.title}
              </span>
              <span className="mt-0.5 block text-sm leading-relaxed text-on-surface-variant">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <ul className="mt-5 flex flex-col gap-2.5 border-t border-outline-variant pt-4 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
        {guarantees.map((g) => (
          <li key={g.text} className="flex items-center gap-2">
            <g.icon size={16} className="shrink-0" />
            {g.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
