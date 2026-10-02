import { guard, json } from "@/lib/estimate/guard";
import { findPaymentsByReference, hasAsaas } from "@/lib/payments/asaas";

/**
 * Consulta de pedido combinado (/pagar): acha no Asaas a cobrança com
 * `externalReference` = número do pedido e devolve o link da fatura.
 *
 * Devolve só valor, descrição, parcelas e status: nada de nome ou contato do
 * cliente, porque quem chuta um número não pode ver dado de outra pessoa.
 * O rate limit segura quem tentar varrer os 90 mil números.
 */

const PENDING = new Set(["PENDING", "OVERDUE"]);
const PAID = new Set(["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"]);

export async function GET(req: Request) {
  const blocked = guard(req, "pay-lookup", 20, 60 * 60 * 1000);
  if (blocked) return blocked;

  const code = new URL(req.url).searchParams.get("codigo")?.trim() ?? "";
  if (!/^\d{5}$/.test(code)) return json({ error: "invalid" }, 400);
  if (!hasAsaas()) return json({ error: "unavailable" }, 503);

  let payments;
  try {
    payments = await findPaymentsByReference(code);
  } catch {
    return json({ error: "unavailable" }, 502);
  }

  const live = payments.filter(
    (p) => PENDING.has(p.status) || PAID.has(p.status),
  );
  if (live.length === 0) return json({ error: "not_found" }, 404);

  const total = live.reduce((n, p) => n + p.value, 0);
  const pending = live
    .filter((p) => PENDING.has(p.status))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  // "Parcela 1 de 3. Site institucional" -> "Site institucional"
  const description = (live[0].description ?? "")
    .replace(/^Parcela \d+ de \d+\.\s*/i, "")
    .trim();

  return json({
    code,
    description,
    total,
    installments: live.length,
    paidInstallments: live.length - pending.length,
    status: pending.length === 0 ? "pago" : "pendente",
    invoiceUrl: pending[0]?.invoiceUrl ?? null,
    nextDueDate: pending[0]?.dueDate ?? null,
  });
}
