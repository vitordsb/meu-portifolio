import { z } from "zod";
import { deliverContact } from "@/lib/contact-delivery";
import { guard, json } from "@/lib/estimate/guard";
import { cleanLine, cleanText } from "@/lib/sanitize";
import { isBotRequest } from "@/lib/security/bot";
import { takeDaily } from "@/lib/security/daily-cap";

/**
 * Contraproposta ("Negociar valor"): depois de ver o valor de partida, o
 * cliente diz quanto pode investir e como quer pagar. Sem IA: vai direto pro
 * Vitor (banco + e-mail) citando o número do pedido, pra ele comparar com o
 * e-mail original e decidir. O cliente recebe a resposta pelo WhatsApp.
 */

const PAGAMENTOS = {
  a_vista: "À vista (Pix)",
  entrada_e_entrega: "50% na aprovação + 50% na entrega",
  parcelado: "Parcelado no boleto",
  outro: "Outra condição (ver observação)",
} as const;

const Schema = z.object({
  code: z.string().regex(/^\d{5}$/),
  name: z.string().transform(cleanLine).pipe(z.string().min(2).max(80)),
  whatsapp: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .pipe(z.string().min(10).max(13)),
  email: z
    .string()
    .max(400)
    .optional()
    .transform((s) => (s ? cleanLine(s) : undefined) || undefined)
    .pipe(z.email().max(320).optional()),
  valor: z.coerce.number().min(100).max(10_000_000).transform(Math.round),
  pagamento: z.enum(["a_vista", "entrada_e_entrega", "parcelado", "outro"]),
  observacao: z
    .string()
    .max(1200)
    .optional()
    .transform((s) => (s ? cleanText(s).trim().slice(0, 600) : "")),
  /** Faixa que o cliente viu, só pra referência no e-mail (o Vitor confere
   *  no e-mail original do pedido: isto vem do navegador). */
  faixa: z
    .string()
    .max(60)
    .optional()
    .transform((s) => (s ? cleanLine(s) : "")),
});

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export async function POST(req: Request) {
  const blocked = guard(req, "orc-contra", 5, 60 * 60 * 1000);
  if (blocked) return blocked;
  if (await isBotRequest()) return json({ error: "forbidden" }, 403);

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid" }, 400);
  if (!(await takeDaily("contraproposta")).ok) {
    return json({ error: "unavailable" }, 503);
  }

  const c = parsed.data;
  const when = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });

  await deliverContact({
    name: c.name,
    email: c.email ?? null,
    company: null,
    subject: `Contraproposta do pedido #${c.code}`,
    message: [
      `Contraproposta do pedido #${c.code} · ${when}`,
      `WhatsApp: ${c.whatsapp}`,
      "",
      `Pode investir: ${brl.format(c.valor)}`,
      `Como quer pagar: ${PAGAMENTOS[c.pagamento]}`,
      ...(c.faixa ? [`Faixa que ele viu: ${c.faixa}`] : []),
      ...(c.observacao ? ["", "Observação:", c.observacao] : []),
      "",
      `Compare com o e-mail original do pedido #${c.code} (escopo, descontos e conversa).`,
      "O cliente foi avisado de que a resposta chega pelo WhatsApp.",
    ].join("\n"),
  });

  return json({ ok: true });
}
