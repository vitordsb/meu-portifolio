"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIALS } from "@/lib/deck-content";
import { WhatsappIcon } from "@/components/deck/SocialIcons";
import PageHeader from "./PageHeader";
import AfterPayment from "./AfterPayment";

/**
 * Volta do checkout do Asaas. Chegar aqui NÃO prova que pagou (qualquer um
 * abre a URL): a confirmação de verdade vem pelo webhook, por e-mail.
 */
export default function ThanksPage() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const code =
    useSearchParams().get("pedido")?.replace(/\D/g, "").slice(0, 5) ?? "";

  const text = code
    ? pt
      ? `Olá! Acabei de pagar o pedido #${code}. Vamos começar?`
      : `Hi! I just paid order #${code}. Shall we start?`
    : pt
      ? "Olá! Acabei de fazer um pagamento no seu site."
      : "Hi! I just made a payment on your site.";

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader />

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12 [&>*]:max-w-xl pb-20 pt-14 sm:pt-20 [@media(max-height:500px)]:pt-6">
        <CheckCircle2 size={44} strokeWidth={1.75} className="text-[#25D366]" />
        <h1 className="mt-5 text-[clamp(2rem,6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          {pt ? "Pagamento enviado!" : "Payment sent!"}
        </h1>
        {code && (
          <p className="mt-2 text-sm text-on-surface-variant">
            {pt ? "Pedido" : "Order"} <span className="font-mono">#{code}</span>
          </p>
        )}
        <div className="mt-6">
          <AfterPayment title={pt ? "O que acontece agora" : "What happens now"} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href={`${SOCIALS.whatsapp}?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outlined h-12 rounded-none px-6 text-base"
          >
            <span className="inline-flex items-center gap-2">
              <WhatsappIcon size={18} />
              {pt ? "Falar no WhatsApp" : "Chat on WhatsApp"}
            </span>
          </a>
          <Link
            href="/"
            className="text-sm text-on-surface-variant underline-offset-4 hover:text-on-surface hover:underline"
          >
            {pt ? "Voltar pro início" : "Back to home"}
          </Link>
        </div>
      </main>
    </div>
  );
}
