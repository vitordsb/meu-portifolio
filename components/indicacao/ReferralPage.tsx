"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import { REFERRAL_REWARD, referralLink, referralMessage, referralNoticeHref } from "@/lib/referral";
import PageHeader from "@/components/payments/PageHeader";

const field =
  "w-full rounded-none border border-outline-variant bg-surface px-4 py-3 text-base outline-none transition focus:border-on-surface focus:ring-2 focus:ring-on-surface/10";

/**
 * Indique e ganhe: a pessoa digita o nome, recebe o link pessoal e manda pro
 * amigo pelo WhatsApp. Tudo no navegador, nada é gravado (ver lib/referral).
 */
export default function ReferralPage() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const link = referralLink(name);
  const pct = REFERRAL_REWARD.percent;

  const steps = pt
    ? [
        ["Gere o seu link", "Digite o seu nome aqui embaixo. O link sai na hora."],
        ["Mande pra quem precisa", "Um amigo, cliente ou parceiro que quer site, landing page ou sistema."],
        ["Fechou, você ganha", `Quando a pessoa pagar o primeiro projeto, você recebe ${pct}% do valor no Pix.`],
      ]
    : [
        ["Get your link", "Type your name below. The link appears right away."],
        ["Send it to someone", "A friend, client or partner who needs a website, landing page or software."],
        ["They hire, you earn", `When they pay for their first project, you get ${pct}% of the amount via Pix.`],
      ];

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent("indicacao_link", { acao: "copiar" });
    } catch {
      // sem permissão de área de transferência: o link segue visível pra copiar à mão
    }
  }

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8 sm:pt-16 lg:px-12">
        <h1 className="max-w-3xl text-[clamp(2rem,7vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
          {pt ? `Indique e ganhe ${pct}% do projeto` : `Refer a client, earn ${pct}% of the project`}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-on-surface-variant">
          {pt
            ? "Conhece alguém que precisa de site, landing page ou sistema? Mande o seu link. Se a pessoa fechar, uma parte do valor é sua."
            : "Know someone who needs a website, landing page or software? Send them your link. If they hire us, part of the amount is yours."}
        </p>

        <ol className="mt-10 grid gap-6 border-t border-outline-variant pt-8 md:grid-cols-3">
          {steps.map(([title, text], i) => (
            <li key={title}>
              <p className="font-mono text-sm text-on-surface-variant">0{i + 1}</p>
              <p className="mt-1 text-lg font-semibold">{title}</p>
              <p className="mt-1 text-base leading-relaxed text-on-surface-variant">{text}</p>
            </li>
          ))}
        </ol>

        <section className="mt-12 max-w-xl border border-outline-variant p-5 sm:p-8">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{pt ? "Seu nome completo" : "Your full name"}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              autoComplete="name"
              placeholder={pt ? "Ex.: Maria Souza" : "E.g. Maria Souza"}
              className={field}
            />
          </label>

          {link ? (
            <div className="mt-6">
              <p className="text-sm font-semibold">{pt ? "Seu link" : "Your link"}</p>
              <p className="mt-1.5 break-all border border-outline-variant bg-surface-low px-4 py-3 font-mono text-sm">{link}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(referralMessage(link, pt))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("indicacao_link", { acao: "whatsapp" })}
                  className="btn btn-filled inline-flex h-12 items-center gap-2 rounded-none px-6 text-base"
                >
                  <MessageCircle size={18} />
                  {pt ? "Mandar no WhatsApp" : "Send on WhatsApp"}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="btn btn-outlined inline-flex h-12 items-center gap-2 rounded-none px-6 text-base"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? (pt ? "Copiado" : "Copied") : pt ? "Copiar link" : "Copy link"}
                </button>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-on-surface-variant">
                {pt
                  ? "Depois de mandar, avise a gente. Assim a gente tem o seu contato pra combinar o Pix quando a pessoa fechar."
                  : "Once you've sent it, let us know. That way we have your contact to arrange the Pix when they hire us."}
              </p>
              <a
                href={referralNoticeHref(name, link, pt)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("indicacao_link", { acao: "avisar" })}
                className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-base font-medium underline underline-offset-4 hover:no-underline"
              >
                {pt ? "Avisar que indiquei" : "Let you know I referred someone"}
              </a>
            </div>
          ) : (
            <p className="mt-4 text-sm text-on-surface-variant">
              {pt ? "O link aparece aqui quando você digitar o nome." : "Your link shows up here once you type your name."}
            </p>
          )}
        </section>

        <div className="mt-12 max-w-xl text-base leading-relaxed text-on-surface-variant">
          <h2 className="text-lg font-semibold text-on-surface">{pt ? "Como funciona o pagamento" : "How the payout works"}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {(pt
              ? [
                  `Vale ${pct}% do primeiro projeto pago pela pessoa indicada, sem limite de indicações.`,
                  "A gente reconhece a indicação pelo link. Se a pessoa chegar por outro caminho, basta ela dizer o seu nome no primeiro contato.",
                  "O Pix sai em até 7 dias depois que o pagamento do cliente confirmar. A gente te chama no WhatsApp que você usou pra avisar.",
                  "Não vale indicar a si mesmo nem a própria empresa.",
                ]
              : [
                  `You get ${pct}% of the first project paid by the person you referred, with no limit on referrals.`,
                  "We recognize the referral through the link. If they reach us another way, they just need to mention your name in the first contact.",
                  "The Pix goes out within 7 days after the client's payment clears. We'll message you on the WhatsApp you used to let us know.",
                  "Referring yourself or your own company doesn't count.",
                ]
            ).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
