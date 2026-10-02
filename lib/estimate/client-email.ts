import { SOCIALS } from "@/lib/deck-content";
import type { Estimate } from "./scope";
import { mvpItems, PRICE_NOTES, quoteWhatsappText } from "./shared";

/**
 * E-mail de confirmação pro cliente que pediu orçamento: agradece, repete o
 * número do pedido e o valor de partida do MVP e aponta o próximo passo.
 *
 * HTML de e-mail é outro mundo: tabela, estilo inline, sem CSS externo nem
 * fonte da web (Gmail e Outlook ignoram). Visual monocromático do site.
 *
 * Nome e resumo vêm do visitante (direto ou via IA), então são escapados e
 * têm link removido: o formulário não pode virar canhão de spam com o nosso
 * domínio de remetente.
 */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const CNPJ = "69.283.538/0001-57";
const SITE = "https://www.vitordsb.com.br";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Tira URL e domínio solto do texto vindo do visitante. */
function noLinks(s: string) {
  return s
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, "")
    .replace(
      /\b[\w-]+(?:\.[\w-]+)*\.(?:com|net|org|br|io|xyz|info|ru|cn|link|top)\b\S*/gi,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function firstName(name: string) {
  return noLinks(name).split(/\s+/)[0] || "";
}

const C = {
  bg: "#f4f4f5",
  card: "#ffffff",
  border: "#e4e4e7",
  text: "#0a0a0a",
  muted: "#52525b",
  soft: "#fafafa",
  green: "#25D366",
};
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

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
  const label = (s: string) =>
    `<p style="margin:0 0 8px;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">${esc(s)}</p>`;

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

  const estimateBlock = estimate
    ? `
      <tr><td style="padding:24px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.soft};border:1px solid ${C.border};border-radius:12px;">
          <tr><td style="padding:20px 22px;">
            ${label(t.rangeLabel)}
            <p style="margin:0;font-size:28px;line-height:34px;font-weight:800;letter-spacing:-0.5px;color:${C.text};">${rangeHtml}</p>
            <p style="margin:8px 0 0;font-size:14px;color:${C.muted};">${esc(t.weeksLabel)}: <strong style="color:${C.text};">${esc(weeks!)}</strong>${mvp && mvp.platforms.length ? ` &middot; ${esc(mvp.platforms.join(" + "))}` : ""}</p>
          </td></tr>
        </table>
      </td></tr>
      ${
        resumo
          ? `<tr><td style="padding:24px 32px 0;">
        ${label(t.projectLabel)}
        <p style="margin:0;font-size:15px;line-height:24px;color:${C.text};">${esc(resumo)}</p>
      </td></tr>`
          : ""
      }
      ${
        chips
          ? `<tr><td style="padding:22px 32px 0;">
        ${label(t.mvpLabel)}
        <div>${chips}</div>
      </td></tr>`
          : ""
      }
      <tr><td style="padding:14px 32px 0;">
        ${label(t.notesLabel)}
        <table role="presentation" cellpadding="0" cellspacing="0">${bullets}</table>
      </td></tr>`
    : `
      <tr><td style="padding:16px 32px 0;">
        <p style="margin:0;font-size:15px;line-height:24px;color:${C.muted};">${esc(t.failNote)}</p>
      </td></tr>`;

  const html = `<!doctype html>
<html lang="${pt ? "pt-BR" : "en"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(t.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${FONT};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.card};border:1px solid ${C.border};border-radius:16px;">
      <tr><td style="padding:28px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:15px;font-weight:800;letter-spacing:-0.3px;color:${C.text};">Vitor de Souza</td>
          <td align="right" style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">${esc(t.label)}</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:28px 32px 0;">
        <h1 style="margin:0;font-size:24px;line-height:30px;font-weight:800;letter-spacing:-0.4px;color:${C.text};">${esc(t.hello)}</h1>
        <p style="margin:12px 0 0;font-size:15px;line-height:24px;color:${C.muted};">${esc(t.thanks)}</p>
      </td></tr>
      ${estimateBlock}
      <tr><td style="padding:24px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.border};"><tr><td style="padding-top:22px;">
          ${label(t.nextLabel)}
          <p style="margin:0 0 18px;font-size:15px;line-height:24px;color:${C.text};">${esc(t.next)}</p>
          <a href="${esc(whatsapp)}" style="display:inline-block;padding:13px 22px;background:${C.green};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">${esc(t.cta)}</a>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding:28px 32px 28px;">
        <p style="margin:0;font-size:15px;font-weight:700;color:${C.text};">Vitor de Souza</p>
        <p style="margin:2px 0 0;font-size:13px;color:${C.muted};">${esc(t.role)}</p>
        <p style="margin:2px 0 0;font-size:13px;"><a href="${SITE}" style="color:${C.text};">vitordsb.com.br</a></p>
      </td></tr>
    </table>
    <p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:18px;color:#71717a;">${esc(t.footer)}<br>CNPJ ${CNPJ}</p>
  </td></tr>
</table>
</body>
</html>`;

  return { subject: t.subject, text, html };
}
