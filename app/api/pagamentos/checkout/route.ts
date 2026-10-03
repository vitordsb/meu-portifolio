import { SITE } from "@/lib/email-layout";
import { isBotRequest } from "@/lib/security/bot";
import { takeDaily } from "@/lib/security/daily-cap";
import { guard, json } from "@/lib/estimate/guard";
import { newQuoteCode } from "@/lib/estimate/quote-code";
import { createCheckout, hasAsaas } from "@/lib/payments/asaas";
import { findPackage } from "@/lib/payments/packages";

/**
 * Contratar um pacote: cria a sessão de checkout no Asaas e devolve a URL.
 * O preço vem SEMPRE do servidor (`packages.ts`), nunca do navegador.
 *
 * `externalReference` = "<pedido>:<pacote>": o webhook tira dali o número do
 * pedido e o pacote. Os callbacks apontam pro domínio de produção, que é o
 * cadastrado na conta Asaas (inclusive no sandbox).
 */

export async function POST(req: Request) {
  const blocked = guard(req, "pay-checkout", 10, 60 * 60 * 1000);
  if (blocked) return blocked;

  if (!hasAsaas()) return json({ error: "unavailable" }, 503);
  if (await isBotRequest()) return json({ error: "forbidden" }, 403);

  const body = await req.json().catch(() => null);
  const pkg = findPackage(String(body?.packageId ?? ""));
  if (!pkg) return json({ error: "invalid" }, 400);
  if (!(await takeDaily("checkout")).ok)
    return json({ error: "unavailable" }, 503);

  const code = await newQuoteCode();
  try {
    const { url } = await createCheckout({
      itemName: pkg.checkoutName,
      description: pkg.summary.pt,
      value: pkg.price,
      maxInstallments: pkg.maxInstallments,
      externalReference: `${code}:${pkg.id}`,
      successUrl: `${SITE}/pagamento/obrigado?pedido=${code}`,
      cancelUrl: `${SITE}/servicos`,
      expiredUrl: `${SITE}/servicos`,
    });
    return json({ url, code });
  } catch {
    return json({ error: "unavailable" }, 502);
  }
}
