import { useState } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { maskPhone } from "@/components/estimate/LeadForm";

export type RaioXLead = { name: string; whatsapp: string; email: string };

const field =
  "w-full border border-outline-variant bg-surface px-4 py-3 text-base outline-none transition focus:border-on-surface focus:ring-2 focus:ring-on-surface/10 sm:text-sm";

/**
 * Portão do relatório completo: nome e WhatsApp mostram todos os pontos com
 * o "como resolver". As notas e os 3 primeiros já apareceram sem cadastro:
 * a pessoa vê valor antes de deixar o contato.
 */
export default function LeadGate({
  pt,
  total,
  busy,
  error,
  onSubmit,
}: {
  pt: boolean;
  total: number;
  busy: boolean;
  error: string | null;
  onSubmit: (lead: RaioXLead) => void;
}) {
  const [lead, setLead] = useState<RaioXLead>({ name: "", whatsapp: "", email: "" });
  const [consent, setConsent] = useState(false);
  const digits = lead.whatsapp.replace(/\D/g, "");
  const valid = lead.name.trim().length >= 2 && digits.length >= 10 && consent;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid && !busy) onSubmit(lead);
      }}
      className="border border-outline-variant bg-surface-low p-5 sm:p-6"
    >
      <p className="inline-flex items-center gap-2 text-sm font-semibold">
        <Lock size={15} />
        {pt
          ? `Relatório completo: ${total} ${total === 1 ? "ponto" : "pontos"} com o que fazer em cada um`
          : `Full report: ${total} ${total === 1 ? "item" : "items"} with what to do on each`}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
        {pt
          ? "Me diz pra quem é o relatório e ele abre aqui na hora. Com e-mail, você recebe uma cópia pra mostrar pra quem cuida do site."
          : "Tell us who it's for and it opens right here. With an email, you get a copy to share with whoever runs the site."}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">{pt ? "Nome" : "Name"}</span>
          <input
            required
            autoComplete="name"
            placeholder={pt ? "Seu nome" : "Your name"}
            value={lead.name}
            maxLength={80}
            onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
            className={field}
          />
        </label>
        <label className="block">
          <span className="sr-only">WhatsApp</span>
          <input
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="WhatsApp (DDD)"
            value={lead.whatsapp}
            onChange={(e) =>
              setLead((l) => ({ ...l, whatsapp: maskPhone(e.target.value) }))
            }
            className={field}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="sr-only">E-mail</span>
          <input
            type="email"
            autoComplete="email"
            placeholder={pt ? "E-mail (opcional, recebe uma cópia)" : "Email (optional, get a copy)"}
            value={lead.email}
            maxLength={320}
            onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
            className={field}
          />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-on-surface-variant">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
        />
        <span>
          {pt
            ? "Aceito ser contatado sobre o meu site."
            : "I agree to be contacted about my site."}{" "}
          {pt ? "Veja a" : "See the"}{" "}
          <a
            href="/privacidade"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:text-on-surface"
          >
            {pt ? "Política de Privacidade" : "Privacy Policy (in Portuguese)"}
          </a>
          .
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!valid}
        aria-busy={busy}
        className="btn btn-filled mt-5 h-12 rounded-none px-6 text-base"
      >
        <span className="inline-flex items-center gap-2">
          {busy ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {pt ? "Abrindo..." : "Opening..."}
            </>
          ) : (
            <>
              {pt ? "Ver relatório completo" : "See full report"}
              <ArrowRight size={18} />
            </>
          )}
        </span>
      </button>
    </form>
  );
}
