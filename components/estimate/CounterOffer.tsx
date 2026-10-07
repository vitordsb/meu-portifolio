import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CheckCircle2, Loader2 } from "lucide-react";

/**
 * "Negociar valor": o cliente diz quanto pode investir e como quer pagar.
 * Sem IA: vai direto pro Vitor, que compara com o pedido original e responde
 * pelo WhatsApp.
 */

type Pagamento = "a_vista" | "entrada_e_entrega" | "parcelado" | "outro";

const OPTIONS: { id: Pagamento; pt: string; en: string }[] = [
  { id: "a_vista", pt: "À vista (Pix)", en: "Upfront (Pix)" },
  {
    id: "entrada_e_entrega",
    pt: "50% + 50% na entrega",
    en: "50% + 50% on delivery",
  },
  {
    id: "parcelado",
    pt: "Parcelado no boleto",
    en: "Installments (bank slip)",
  },
  { id: "outro", pt: "Outra condição", en: "Something else" },
];

const field =
  "w-full border border-outline-variant bg-surface px-4 py-3 text-base outline-none transition focus:border-on-surface focus:ring-2 focus:ring-on-surface/10 sm:text-sm";

/** "4.500" ou "4500" -> 4500 */
function parseMoney(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export default function CounterOffer({
  pt,
  code,
  name,
  whatsapp,
  email,
  range,
  sent,
  onSent,
}: {
  pt: boolean;
  code: string;
  name: string;
  whatsapp: string;
  email: string;
  /** Faixa que o cliente está vendo, pra referência no e-mail. */
  range: string;
  sent: boolean;
  onSent: () => void;
}) {
  const [valor, setValor] = useState("");
  const [pagamento, setPagamento] = useState<Pagamento>("entrada_e_entrega");
  const [obs, setObs] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <div
        role="status"
        className="flex gap-3 border border-outline-variant bg-surface p-4"
      >
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#25D366]" />
        <p className="text-sm leading-relaxed">
          {pt
            ? "Agradecemos a renegociação! Em breve chegamos com uma decisão pelo WhatsApp."
            : "Thank you for the counteroffer! We'll get back to you with a decision on WhatsApp soon."}
        </p>
      </div>
    );
  }

  const amount = parseMoney(valor);
  const valid = amount >= 100 && !busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orcamento/contraproposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          name,
          whatsapp,
          email: email || undefined,
          valor: amount,
          pagamento,
          observacao: obs || undefined,
          faixa: range,
        }),
      });
      if (res.ok) {
        trackEvent("orcamento_contraproposta", { pagamento });
        onSent();
        return;
      }
      setError(
        res.status === 429
          ? pt
            ? "Muitas tentativas seguidas. Tenta de novo mais tarde ou chama a gente no WhatsApp."
            : "Too many attempts. Try again later or reach us on WhatsApp."
          : pt
            ? "Não deu pra enviar agora. Chama a gente no WhatsApp citando o pedido."
            : "Couldn't send it now. Reach us on WhatsApp mentioning the quote.",
      );
    } catch {
      setError(
        pt ? "Sem conexão. Tenta de novo." : "No connection. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="border border-outline-variant bg-surface p-4 sm:p-5"
    >
      <p className="text-sm font-semibold">
        {pt
          ? "Vamos ajustar pra caber no seu projeto"
          : "Let's make it fit your project"}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
        {pt
          ? "Diz quanto você pode investir e como prefere pagar. A gente compara com o seu pedido e responde pelo WhatsApp."
          : "Tell us how much you can invest and how you'd like to pay. We compare it with your quote and reply on WhatsApp."}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs text-on-surface-variant">
            {pt
              ? "Quanto pode investir nessa primeira versão"
              : "How much you can invest in this first version"}
          </span>
          <div className="flex items-center border border-outline-variant bg-surface pl-4 focus-within:border-on-surface focus-within:ring-2 focus-within:ring-on-surface/10">
            <span className="text-sm text-on-surface-variant">R$</span>
            <input
              inputMode="numeric"
              required
              value={valor}
              placeholder="3.500"
              onChange={(e) => {
                const n = parseMoney(e.target.value);
                setValor(n ? n.toLocaleString("pt-BR") : "");
              }}
              className="w-full bg-transparent px-2 py-3 text-base outline-none sm:text-sm"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs text-on-surface-variant">
            {pt ? "Como prefere pagar" : "How you'd like to pay"}
          </span>
          <select
            value={pagamento}
            onChange={(e) => setPagamento(e.target.value as Pagamento)}
            className={field}
          >
            {OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {pt ? o.pt : o.en}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs text-on-surface-variant">
            {pt
              ? "Algo mais? (opcional: prazo, o que pode ficar pra depois...)"
              : "Anything else? (optional: deadline, what can wait...)"}
          </span>
          <textarea
            rows={2}
            maxLength={600}
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className={`${field} resize-none`}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!valid}
        className="btn btn-filled mt-4 h-11 rounded-none px-5 text-sm"
      >
        <span className="inline-flex items-center gap-2">
          {busy && <Loader2 size={16} className="animate-spin" />}
          {pt ? "Enviar contraproposta" : "Send counteroffer"}
        </span>
      </button>
    </form>
  );
}
