import { SOCIALS } from "@/lib/deck-content";
import {
  brl,
  C,
  CNPJ,
  emailShell,
  esc,
  firstName,
  highlight,
  label,
  noLinks,
  row,
  SITE,
} from "@/lib/email-layout";
import type { Estimate } from "./scope";
import { mvpItems, PRICE_NOTES, quoteWhatsappText } from "./shared";

/**
 * E-mail de confirmação pro cliente que pediu orçamento: agradece, repete o
 * número do pedido e o valor de partida do MVP e aponta o próximo passo.
 * Moldura em `lib/email-layout.ts`. Nome e resumo vêm do visitante (direto
 * ou via IA), então são escapados e têm link removido.
 */

export function buildClientEmail(opts: {
  name: string;
  code: string;
  estimate: Estimate | null;
  pt: boolean;
}) {
  const { code, estimate, pt } = opts;
  const first = firstName(opts.name);
  const lang = pt ? "pt" : "en";
  const to = pt ? " a " : " to ";

  const range = estimate
    ? `${brl.format(estimate.min)}${to}${brl.format(estimate.max)}`
    : null;
  const weeks = estimate
    ? `${estimate.weeksMin}${to}${estimate.weeksMax} ${pt ? "semanas" : "weeks"}`
    : null;
  const resumo = estimate ? noLinks(estimate.scope.resumo) : "";
  const mvp = estimate ? mvpItems(estimate.scope, pt) : null;
  const items = mvp ? mvp.items.map(noLinks).filter(Boolean) : [];
  const whatsapp = `${SOCIALS.whatsapp}?text=${encodeURIComponent(
    quoteWhatsappText(first, code, pt),
  )}`;

  const t = pt
    ? {
        subject: `Recebi seu pedido de orçamento #${code}`,
        preheader: range
          ? `Valor de partida do MVP: ${range}. Próximo passo: uma conversa rápida sobre o escopo.`
          : "Já estou com a sua conversa. Te mando o valor de partida em breve.",
        label: `Pedido #${code}`,
        hello: first ? `Olá, ${first}!` : "Olá!",
        thanks:
          "Agradeço por confiar a ideia do seu projeto a mim. Recebi a conversa inteira e o resumo do que você precisa.",
        failNote:
          "A calculadora teve um problema na hora de gerar o valor, mas isso não atrapalha nada: já estou com tudo aqui e te mando o valor de partida em breve.",
        rangeLabel: "Valor de partida da primeira versão (MVP)",
        weeksLabel: "Prazo estimado",
        projectLabel: "Seu projeto",
        mvpLabel: "O que entra no MVP",
        notesLabel: "Como esse valor funciona",
        nextLabel: "Próximo passo",
        next: `Vou te chamar em breve pra gente alinhar o escopo. Se quiser adiantar, me chama no WhatsApp citando o pedido #${code}, ou é só responder este e-mail.`,
        cta: "Falar com o Vitor no WhatsApp",
        role: "Engenheiro de software · UI/UX e Front-end",
        footer:
          "Você recebeu este e-mail porque pediu um orçamento em vitordsb.com.br.",
      }
    : {
        subject: `I got your quote request #${code}`,
        preheader: range
          ? `MVP starting price: ${range}. Next step: a quick call about the scope.`
          : "I have your chat. I'll send you the starting price soon.",
        label: `Quote #${code}`,
        hello: first ? `Hi, ${first}!` : "Hi!",
        thanks:
          "Thank you for trusting me with your project idea. I received the whole chat and the summary of what you need.",
        failNote:
          "The calculator had a hiccup generating the price, but nothing is lost: I have everything here and will send you the starting price soon.",
        rangeLabel: "Starting price for the first version (MVP)",
        weeksLabel: "Estimated timeline",
        projectLabel: "Your project",
        mvpLabel: "What's in the MVP",
        notesLabel: "How this price works",
        nextLabel: "Next step",
        next: `I'll reach out soon so we can align the scope. To speed things up, message me on WhatsApp mentioning quote #${code}, or just reply to this email.`,
        cta: "Talk to Vitor on WhatsApp",
        role: "Software engineer · UI/UX and Front-end",
        footer:
          "You received this email because you requested a quote at vitordsb.com.br.",
      };

  const notes = PRICE_NOTES[lang];
  // Cada valor inteiro numa linha: no celular quebra entre eles, nunca no meio
  const nowrap = (v: string) =>
    `<span style="white-space:nowrap;">${esc(v)}</span>`;
  const rangeHtml = estimate
    ? `${nowrap(brl.format(estimate.min))}${esc(to)}${nowrap(brl.format(estimate.max))}`
    : "";

  // ── Texto puro (clientes de e-mail sem HTML e filtros de spam leem isto) ──
  const text = [
    t.hello,
    "",
    t.thanks,
    ...(estimate
      ? [
          "",
          `${t.rangeLabel}: ${range}`,
          `${t.weeksLabel}: ${weeks}`,
          "",
          `${t.projectLabel}: ${resumo}`,
          "",
          `${t.mvpLabel}:`,
          ...items.map((i) => `- ${i}`),
          "",
          `${t.notesLabel}:`,
          ...notes.map((n) => `- ${n}`),
        ]
      : ["", t.failNote]),
    "",
    `${t.nextLabel}: ${t.next}`,
    `WhatsApp: ${whatsapp}`,
    "",
    "Vitor de Souza",
    t.role,
    SITE.replace("https://", ""),
    "",
    `${t.footer} CNPJ ${CNPJ}.`,
  ].join("\n");

  // ── HTML ──
  const chips = items
    .map(
      (i) =>
        `<span style="display:inline-block;margin:0 6px 8px 0;padding:5px 12px;border:1px solid ${C.border};border-radius:999px;font-size:13px;color:${C.text};background:${C.card};">${esc(i)}</span>`,
    )
    .join("");

  const bullets = notes
    .map(
      (n) =>
        `<tr><td valign="top" style="padding:0 10px 8px 0;color:${C.muted};font-size:14px;line-height:22px;">&bull;</td><td style="padding:0 0 8px;color:${C.muted};font-size:14px;line-height:22px;">${esc(n)}</td></tr>`,
    )
    .join("");

  const body = estimate
    ? [
        row(
          highlight(
            `${label(t.rangeLabel)}
            <p style="margin:0;font-size:28px;line-height:34px;font-weight:800;letter-spacing:-0.5px;color:${C.text};">${rangeHtml}</p>
            <p style="margin:8px 0 0;font-size:14px;color:${C.muted};">${esc(t.weeksLabel)}: <strong style="color:${C.text};">${esc(weeks!)}</strong>${mvp && mvp.platforms.length ? ` &middot; ${esc(mvp.platforms.join(" + "))}` : ""}</p>`,
          ),
        ),
        resumo
          ? row(
              `${label(t.projectLabel)}<p style="margin:0;font-size:15px;line-height:24px;color:${C.text};">${esc(resumo)}</p>`,
            )
          : "",
        chips ? row(`${label(t.mvpLabel)}<div>${chips}</div>`, 22) : "",
        row(
          `${label(t.notesLabel)}<table role="presentation" cellpadding="0" cellspacing="0">${bullets}</table>`,
          14,
        ),
      ].join("")
    : row(
        `<p style="margin:0;font-size:15px;line-height:24px;color:${C.muted};">${esc(t.failNote)}</p>`,
        16,
      );

  const html = emailShell({
    pt,
    title: t.subject,
    preheader: t.preheader,
    tag: t.label,
    hello: t.hello,
    intro: t.thanks,
    body,
    next: { label: t.nextLabel, text: t.next, cta: t.cta, href: whatsapp },
    role: t.role,
    footer: t.footer,
  });

  return { subject: t.subject, text, html };
}
