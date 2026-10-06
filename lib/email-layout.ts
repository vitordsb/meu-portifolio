/**
 * Moldura dos e-mails que o cliente recebe (confirmação de orçamento, de
 * pagamento...). HTML de e-mail é outro mundo: tabela, estilo inline, sem CSS
 * externo nem fonte da web (Gmail e Outlook ignoram). Visual monocromático
 * do site.
 */

import { CNPJ } from "./site";
export { CNPJ };
export const SITE = "https://www.vitordsb.com.br";

export const C = {
  bg: "#f4f4f5",
  card: "#ffffff",
  border: "#e4e4e7",
  text: "#0a0a0a",
  muted: "#52525b",
  soft: "#fafafa",
  green: "#25D366",
};

export const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Tira URL e domínio solto de texto vindo do visitante: o formulário não pode
 * virar canhão de spam com o nosso domínio de remetente.
 */
export function noLinks(s: string) {
  return s
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, "")
    .replace(
      /\b[\w-]+(?:\.[\w-]+)*\.(?:com|net|org|br|io|xyz|info|ru|cn|link|top)\b\S*/gi,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function firstName(name: string) {
  return noLinks(name).split(/\s+/)[0] || "";
}

export const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** Rótulo pequeno em caixa alta, acima de cada bloco. */
export function label(s: string) {
  return `<p style="margin:0 0 8px;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">${esc(s)}</p>`;
}

/** Linha de conteúdo do cartão. */
export function row(inner: string, top = 24) {
  return `<tr><td style="padding:${top}px 32px 0;">${inner}</td></tr>`;
}

/** Quadro cinza de destaque (valor, status...). */
export function highlight(inner: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.soft};border:1px solid ${C.border};border-radius:12px;"><tr><td style="padding:20px 22px;">${inner}</td></tr></table>`;
}

export function emailShell(o: {
  pt: boolean;
  title: string;
  preheader: string;
  /** Canto superior direito, ex.: "Pedido #48213". */
  tag: string;
  hello: string;
  intro: string;
  /** Linhas (`row(...)`) entre a introdução e o próximo passo. */
  body: string;
  next: { label: string; text: string; cta: string; href: string };
  role: string;
  footer: string;
}) {
  return `<!doctype html>
<html lang="${o.pt ? "pt-BR" : "en"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(o.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${FONT};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.card};border:1px solid ${C.border};border-radius:16px;">
      <tr><td style="padding:28px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:15px;font-weight:800;letter-spacing:-0.3px;color:${C.text};">Vitor de Souza</td>
          <td align="right" style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">${esc(o.tag)}</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:28px 32px 0;">
        <h1 style="margin:0;font-size:24px;line-height:30px;font-weight:800;letter-spacing:-0.4px;color:${C.text};">${esc(o.hello)}</h1>
        <p style="margin:12px 0 0;font-size:15px;line-height:24px;color:${C.muted};">${esc(o.intro)}</p>
      </td></tr>
      ${o.body}
      <tr><td style="padding:24px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.border};"><tr><td style="padding-top:22px;">
          ${label(o.next.label)}
          <p style="margin:0 0 18px;font-size:15px;line-height:24px;color:${C.text};">${esc(o.next.text)}</p>
          <a href="${esc(o.next.href)}" style="display:inline-block;padding:13px 22px;background:${C.green};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">${esc(o.next.cta)}</a>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding:28px 32px 28px;">
        <p style="margin:0;font-size:15px;font-weight:700;color:${C.text};">Vitor de Souza</p>
        <p style="margin:2px 0 0;font-size:13px;color:${C.muted};">${esc(o.role)}</p>
        <p style="margin:2px 0 0;font-size:13px;"><a href="${SITE}" style="color:${C.text};">vitordsb.com.br</a></p>
      </td></tr>
    </table>
    <p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:18px;color:#71717a;">${esc(o.footer)}<br>CNPJ ${CNPJ}</p>
  </td></tr>
</table>
</body>
</html>`;
}
