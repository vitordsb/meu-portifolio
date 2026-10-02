import { SOCIALS } from "@/lib/deck-content";
import {
  brl,
  C,
  emailShell,
  esc,
  firstName,
  highlight,
  label,
  row,
} from "@/lib/email-layout";

/**
 * E-mails de pagamento confirmado (disparados pelo webhook do Asaas): um aviso
 * seco pro Vitor e uma confirmação formatada pro cliente.
 */

const METHOD: Record<string, string> = {
  PIX: "Pix",
  CREDIT_CARD: "Cartão de crédito",
  BOLETO: "Boleto",
  UNDEFINED: "A definir",
};

export function methodLabel(billingType: string) {
  return METHOD[billingType] ?? billingType;
}

export type PaidInfo = {
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  value: number;
  billingType: string;
  description: string;
  /** "3x" quando parcelado no cartão; null à vista. */
  installments: string | null;
  invoiceUrl: string;
};

export function ownerPaidEmail(p: PaidInfo) {
  return {
    subject: `[Portfolio] Pagamento confirmado #${p.code}: ${brl.format(p.value)}`,
    text: [
      `Pedido #${p.code}`,
      `Valor: ${brl.format(p.value)}${p.installments ? ` (${p.installments})` : ""}`,
      `Forma: ${methodLabel(p.billingType)}`,
      `Descrição: ${p.description}`,
      "",
      `Cliente: ${p.name}`,
      `E-mail: ${p.email ?? "(não informado)"}`,
      `Telefone: ${p.phone ?? "(não informado)"}`,
      "",
      `Fatura no Asaas: ${p.invoiceUrl}`,
    ].join("\n"),
  };
}

export function clientPaidEmail(p: PaidInfo) {
  const first = firstName(p.name);
  const whatsText = `Olá! Sou ${first} e acabei de pagar o pedido #${p.code}. Vamos começar?`;
  const whatsapp = `${SOCIALS.whatsapp}?text=${encodeURIComponent(whatsText)}`;
  const value = `${brl.format(p.value)}${p.installments ? ` em ${p.installments}` : ""}`;

  const t = {
    subject: `Pagamento confirmado: pedido #${p.code}`,
    preheader: `Recebi seu pagamento de ${value}. Próximo passo: combinar o início.`,
    hello: first ? `Olá, ${first}!` : "Olá!",
    intro:
      "Seu pagamento foi confirmado. Agradeço pela confiança: a partir daqui é comigo.",
    next: `Vou te chamar em breve pra combinar o início. Se quiser adiantar, me chama no WhatsApp citando o pedido #${p.code}, ou responda este e-mail.`,
  };

  const body = [
    row(
      highlight(
        `${label("Pagamento confirmado")}
        <p style="margin:0;font-size:28px;line-height:34px;font-weight:800;letter-spacing:-0.5px;color:${C.text};">${esc(brl.format(p.value))}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${C.muted};">${esc(methodLabel(p.billingType))}${p.installments ? ` &middot; ${esc(p.installments)}` : ""}</p>`,
      ),
    ),
    row(
      `${label("O que você contratou")}<p style="margin:0;font-size:15px;line-height:24px;color:${C.text};">${esc(p.description)}</p>`,
    ),
    row(
      `<p style="margin:0;font-size:14px;line-height:22px;color:${C.muted};">Comprovante e nota ficam na sua <a href="${esc(p.invoiceUrl)}" style="color:${C.text};">fatura do Asaas</a>.</p>`,
      14,
    ),
  ].join("");

  const html = emailShell({
    pt: true,
    title: t.subject,
    preheader: t.preheader,
    tag: `Pedido #${p.code}`,
    hello: t.hello,
    intro: t.intro,
    body,
    next: {
      label: "Próximo passo",
      text: t.next,
      cta: "Falar com o Vitor no WhatsApp",
      href: whatsapp,
    },
    role: "Engenheiro de software · UI/UX e Front-end",
    footer:
      "Você recebeu este e-mail porque fez um pagamento em vitordsb.com.br.",
  });

  const text = [
    t.hello,
    "",
    t.intro,
    "",
    `Pagamento confirmado: ${value} (${methodLabel(p.billingType)})`,
    `O que você contratou: ${p.description}`,
    `Fatura: ${p.invoiceUrl}`,
    "",
    `Próximo passo: ${t.next}`,
    `WhatsApp: ${whatsapp}`,
    "",
    "Vitor de Souza",
    "Engenheiro de software · UI/UX e Front-end",
  ].join("\n");

  return { subject: t.subject, html, text };
}
