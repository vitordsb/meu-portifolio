import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export type Lead = { name: string; whatsapp: string; email: string };

/** Máscara leve: (11) 91234-5678. Só visual, o servidor fica com os dígitos. */
export function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const field =
  "w-full rounded-[var(--shape-md)] border border-outline-variant bg-surface px-4 py-3 text-base outline-none transition focus:border-on-surface focus:ring-2 focus:ring-on-surface/10 sm:text-sm";

/**
 * O portão antes do preço: nome e WhatsApp liberam a faixa. Fica dentro da
 * conversa, como a próxima "mensagem", em vez de um modal por cima dela.
 */
export default function LeadForm({
  pt,
  busy,
  error,
  onSubmit,
  onKeepTalking,
}: {
  pt: boolean;
  busy: boolean;
  error: string | null;
  onSubmit: (lead: Lead) => void;
  onKeepTalking?: () => void;
}) {
  const [lead, setLead] = useState<Lead>({ name: "", whatsapp: "", email: "" });
  const [consent, setConsent] = useState(false);

  const digits = lead.whatsapp.replace(/\D/g, "");
  const valid = lead.name.trim().length >= 2 && digits.length >= 10 && consent;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid && !busy) onSubmit(lead);
      }}
      className="rounded-2xl border border-outline-variant bg-surface-low p-5 sm:p-6"
    >
      <p className="mb-1 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-on-surface-variant">
        {pt ? "Quase lá" : "Almost there"}
      </p>
      <h2 className="text-xl font-extrabold tracking-[-0.02em]">
        {pt ? "Seu orçamento está pronto" : "Your quote is ready"}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
        {pt
          ? "Me diz pra quem eu mando o detalhamento e o valor de partida do MVP aparece na hora."
          : "Tell me who to send the details to and the MVP starting price shows up right away."}
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
            placeholder={pt ? "E-mail (opcional)" : "Email (optional)"}
            aria-describedby="lead-email-hint"
            value={lead.email}
            maxLength={320}
            onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
            className={field}
          />
          <span
            id="lead-email-hint"
            className="mt-1.5 block px-1 text-xs text-on-surface-variant"
          >
            {pt
              ? "Com e-mail, você recebe uma cópia do orçamento."
              : "With an email, you get a copy of the quote."}
          </span>
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
            ? "Aceito ser contatado pelo Vitor sobre este projeto e sei que a conversa foi processada por uma IA (DeepSeek)."
            : "I agree to be contacted by Vitor about this project and understand the chat was processed by an AI (DeepSeek)."}
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          // Enquanto calcula o botão segue cheio (é progresso, não bloqueio);
          // o envio duplo é barrado no onSubmit
          disabled={!valid}
          aria-busy={busy}
          className="btn btn-filled h-12 rounded-lg px-6 text-base"
        >
          <span className="inline-flex items-center gap-2">
            {busy ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {pt ? "Calculando..." : "Calculating..."}
              </>
            ) : (
              <>
                {pt ? "Ver meu orçamento" : "See my quote"}
                <ArrowRight size={18} />
              </>
            )}
          </span>
        </button>
        {onKeepTalking && !busy && (
          <button
            type="button"
            onClick={onKeepTalking}
            className="text-sm text-on-surface-variant underline-offset-4 hover:text-on-surface hover:underline"
          >
            {pt ? "Quero contar mais antes" : "I want to add more first"}
          </button>
        )}
      </div>
    </form>
  );
}
