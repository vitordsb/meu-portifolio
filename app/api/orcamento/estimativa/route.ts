import { z } from "zod";
import { cleanLine } from "@/lib/sanitize";
import { deliverContact } from "@/lib/contact-delivery";
import { describeAttribution } from "@/lib/attribution-server";
import { sendEmail } from "@/lib/mailer";
import { buildClientEmail } from "@/lib/estimate/client-email";
import {
  ConversationSchema,
  countUserTurns,
  transcript,
} from "@/lib/estimate/conversation";
import { completeJson, hasAiKey } from "@/lib/estimate/deepseek";
import { isDevMock, MOCK_SCOPE } from "@/lib/estimate/dev-mock";
import { isBotRequest } from "@/lib/security/bot";
import { takeDaily } from "@/lib/security/daily-cap";
import { guard, json } from "@/lib/estimate/guard";
import { priceScope, type PricingNotes } from "@/lib/estimate/pricing";
import { EXTRACT_SYSTEM } from "@/lib/estimate/prompts";
import {
  cleanImages,
  ImageError,
  type CleanImage,
} from "@/lib/estimate/images";
import { newQuoteCode, quoteSubject } from "@/lib/estimate/quote-code";
import { ScopeSchema, type Estimate, type Scope } from "@/lib/estimate/scope";

/**
 * Fecha o orçamento: a IA extrai o escopo da conversa, o código calcula a
 * faixa e o contato vai pro Vitor (banco + e-mail) junto com a conversa.
 *
 * O contato é salvo mesmo se a IA falhar: quem preencheu o formulário é lead,
 * e lead não pode se perder por causa de uma API fora do ar.
 */

export const maxDuration = 60;

const LeadSchema = z.object({
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
  consent: z.literal(true),
});

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function scopeLines(s: Scope) {
  const plat = [s.plataformas.web && "web", s.plataformas.mobile && "mobile"]
    .filter(Boolean)
    .join(" + ");
  return [
    `Tipo: ${s.tipo} · Plataformas: ${plat || "?"} · Design: ${s.design}`,
    `Escala: ${s.escala} · Momento: ${s.fase === "validando" ? "testando a ideia (candidato a MVP)" : "planejado"}`,
    `Login: ${s.login ? "sim" : "não"} · Painel admin: ${s.painel_admin ? "sim" : "não"} · Urgente: ${s.urgente ? "sim" : "não"} · Confiança: ${s.confianca}`,
    `Integrações: ${s.integracoes.join(", ") || "nenhuma"}`,
    `Prazo: ${s.prazo} · Referências: ${s.referencias} · Pediu desconto: ${s.pediu_desconto ? "sim" : "não"}`,
    `Pode investir: ${s.investimento_max ? brl.format(s.investimento_max) : "não disse"} · Pagamento preferido: ${s.pagamento_preferido}`,
    "Funcionalidades:",
    ...s.funcionalidades.map((f) => `  - ${f.nome} (${f.complexidade})`),
  ];
}

/** Só pro Vitor: descontos aplicados e o que foi oferecido de pagamento. */
function pricingLines(e: Estimate, n: PricingNotes | null) {
  const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
  return [
    n
      ? `Desconto automático: ${pct(n.discount)} (referências ${pct(n.parts.referencias)}, prazo ${pct(n.parts.prazo)}, negociação ${pct(n.parts.negociacao)}, orçamento ${pct(n.parts.orcamento)})`
      : "Desconto automático: n/d",
    ...(n?.budgetGap
      ? [
          "ATENÇÃO: a faixa ainda ficou ACIMA do que o cliente disse que pode investir.",
        ]
      : []),
    `Pagamento oferecido: ${e.payment.map((p) => `${p.label.pt} (${p.detail.pt})`).join(" | ")}`,
  ];
}

export async function POST(req: Request) {
  const blocked = guard(req, "orc-estimate", 5, 60 * 60 * 1000);
  if (blocked) return blocked;

  if (await isBotRequest()) return json({ error: "forbidden" }, 403);

  const body = await req.json().catch(() => null);
  const convo = ConversationSchema.safeParse(body?.messages);
  const lead = LeadSchema.safeParse(body?.lead);
  if (!convo.success || !lead.success) return json({ error: "invalid" }, 400);
  if (countUserTurns(convo.data) < 1) return json({ error: "invalid" }, 400);

  // Teto diário: cada orçamento manda até 2 e-mails (um pra fora do site)
  if (!(await takeDaily("estimativa")).ok) {
    return json({ error: "unavailable" }, 503);
  }

  const text = transcript(convo.data);
  const mock = isDevMock();

  let estimate: Estimate | null = null;
  let notes: PricingNotes | null = null;
  // Imagens contam como referência concreta (preço menor, regra interna)
  const imageCount = Array.isArray(body?.images)
    ? Math.min(body.images.length, 4)
    : 0;
  try {
    if (!mock && !hasAiKey()) throw new Error("sem chave");
    const raw = mock
      ? MOCK_SCOPE
      : await completeJson(
          [
            { role: "system", content: EXTRACT_SYSTEM },
            { role: "user", content: `Conversa:\n\n${text}` },
          ],
          { maxTokens: 1200, signal: req.signal },
        );
    const scope = ScopeSchema.parse(raw);
    ({ estimate, notes } = priceScope(scope, { images: imageCount }));
  } catch (e) {
    console.error("[orcamento] extração falhou:", e);
  }

  const { name, whatsapp, email } = lead.data;
  const code = await newQuoteCode();

  // Imagens do cliente: regravadas e limpas; inválida não derruba o pedido
  let images: CleanImage[] = [];
  let imageNote = "";
  try {
    images = await cleanImages(body?.images, `pedido-${code}`);
    if (images.length)
      imageNote = `Imagens anexadas: ${images.length} (neste e-mail)`;
  } catch (e) {
    const why = e instanceof ImageError ? e.message : "erro";
    console.warn(`[orcamento] imagens recusadas no pedido #${code}: ${why}`);
    imageNote = `Imagens recusadas (${why}): o cliente tentou anexar, mas não passaram na validação`;
  }
  const when = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });
  const header = estimate
    ? [
        `Faixa de partida mostrada (MVP): ${brl.format(estimate.min)} a ${brl.format(estimate.max)}`,
        `Prazo mostrado: ${estimate.weeksMin} a ${estimate.weeksMax} semanas`,
        `Equipe mostrada: ${estimate.team.size} (${estimate.team.roles.map((r) => r.pt).join(", ")})`,
        "",
        `Resumo: ${estimate.scope.resumo}`,
        ...scopeLines(estimate.scope),
        "",
        ...pricingLines(estimate, notes),
      ]
    : [
        "A IA falhou ao gerar a estimativa: o cliente NÃO viu valor. Responder manualmente.",
      ];

  await deliverContact(
    {
      name,
      email: email ?? null,
      company: null,
      subject: quoteSubject(code),
      message: [
        `Pedido #${code} · ${when}`,
        describeAttribution(body?.origem),
        `WhatsApp: ${whatsapp}`,
        ...(imageNote ? [imageNote] : []),
        ...header,
        "",
        "── Conversa ──",
        "",
        text,
      ].join("\n"),
    },
    images,
  );

  // Confirmação pro cliente: só com e-mail informado. Responder cai no
  // orcamento@ (ImprovMX encaminha pro Vitor).
  let confirmationSent = false;
  if (email) {
    const mail = buildClientEmail({
      name,
      code,
      estimate,
      pt: body?.lang !== "en",
    });
    confirmationSent = await sendEmail({ to: email, ...mail });
  }

  if (!estimate) {
    return json(
      { error: "unavailable", saved: true, code, confirmationSent },
      503,
    );
  }
  return json({ estimate, code, confirmationSent });
}
