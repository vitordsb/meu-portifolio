import { RotateCcw } from "lucide-react";
import { SOCIALS } from "@/lib/deck-content";
import type { Estimate } from "@/lib/estimate/scope";
import { quoteWhatsappText } from "@/lib/estimate/shared";
import { WhatsappIcon } from "@/components/deck/SocialIcons";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** O que entrou na conta, em linguagem de cliente (sem horas nem fatores). */
function considered(e: Estimate, pt: boolean) {
  const s = e.scope;
  const items = s.funcionalidades.map((f) => f.nome);
  if (s.login) items.push(pt ? "Login de usuários" : "User accounts");
  if (s.painel_admin) items.push(pt ? "Painel administrativo" : "Admin panel");
  items.push(...s.integracoes);
  const plat = [
    s.plataformas.web && "Web",
    s.plataformas.mobile && (pt ? "App iOS e Android" : "iOS and Android app"),
  ].filter(Boolean) as string[];
  if (s.design !== "pronto")
    items.push(pt ? "Design de interface (UI/UX)" : "Interface design (UI/UX)");
  return { items, plat };
}

export default function EstimateResult({
  estimate,
  code,
  name,
  pt,
  onRestart,
}: {
  estimate: Estimate;
  code: string;
  name: string;
  pt: boolean;
  onRestart: () => void;
}) {
  const { items, plat } = considered(estimate, pt);
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
            {(pt
              ? [
                  "É o valor de partida da primeira versão (MVP): o essencial pra colocar sua ideia no ar e validar com usuários reais.",
                  "O preço final muda conforme o escopo e a nossa conversa. Mais funcionalidades ou mais detalhe aumentam; deixar o que não é essencial pra depois diminui.",
                  "Nada aqui é compromisso: o valor fechado sai depois de uma conversa rápida comigo.",
                ]
              : [
                  "This is the starting price for the first version (MVP): the essentials to launch your idea and validate it with real users.",
                  "The final price changes with the scope and our conversation. More features or more detail raise it; leaving non-essentials for later lowers it.",
                  "Nothing here is binding: the final price comes after a quick call with me.",
                ]
            ).map((t) => (
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
