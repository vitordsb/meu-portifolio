import { SOCIALS } from "@/lib/deck-content";
import {
  C,
  CNPJ,
  emailShell,
  esc,
  firstName,
  highlight,
  label,
  row,
  SITE,
} from "@/lib/email-layout";
import { raioXWhatsappText } from "./shared";
import type { Category, Issue, Report } from "./types";
import { BRAND } from "@/lib/site";

/**
 * Relatório do Raio-X por e-mail pra quem deixou o contato. Só leva texto
 * nosso (dicionário) e números: o endereço analisado NÃO entra, pra a rota
 * não virar jeito de mandar e-mail com link de terceiro pelo nosso domínio.
 */

const CAT_LABEL: Record<Category, { pt: string; en: string }> = {
  performance: { pt: "Velocidade", en: "Speed" },
  seo: { pt: "Google", en: "Google" },
  accessibility: { pt: "Acessibilidade", en: "Accessibility" },
  bestPractices: { pt: "Segurança", en: "Security" },
};

/** Cor da nota, na régua do Lighthouse. */
function scoreColor(n: number) {
  if (n >= 90) return "#0c7a3e";
  if (n >= 50) return "#b45309";
  return "#b91c1c";
}

export function buildRaioXEmail(opts: {
  name: string;
  code: string;
  scores: Report["scores"];
  issues: Issue[];
  pt: boolean;
}) {
  const { code, scores, issues, pt } = opts;
  const lang = pt ? "pt" : "en";
  const first = firstName(opts.name);
  const whatsapp = `${SOCIALS.whatsapp}?text=${encodeURIComponent(
    raioXWhatsappText(firstName(opts.name), code, pt),
  )}`;

  const t = pt
    ? {
        subject: `Seu raio-x do site #${code}`,
        preheader: `${issues.length} pontos pra melhorar, do mais urgente pro mais simples.`,
        tag: `Raio-X #${code}`,
        hello: first ? `Olá, ${first}!` : "Olá!",
        intro:
          "Aqui está o raio-x completo do seu site no celular, com o que está afastando visitas e como resolver.",
        scoresLabel: "Notas (de 0 a 100)",
        issuesLabel: "O que melhorar, do mais urgente pro mais simples",
        why: "Por que importa",
        fix: "Como resolver",
        impact: { alto: "Urgente", medio: "Importante", baixo: "Simples" },
        nextLabel: "Próximo passo",
        next: `Se quiser, a gente resolve pra você. Chama a gente no WhatsApp citando o raio-x #${code}, ou é só responder este e-mail.`,
        cta: "Falar no WhatsApp",
        role: BRAND.descriptor.pt,
        footer:
          "Você recebeu este e-mail porque pediu um raio-x do site em vitordsb.com.br.",
      }
    : {
        subject: `Your site check #${code}`,
        preheader: `${issues.length} things to improve, from most urgent to simplest.`,
        tag: `Site check #${code}`,
        hello: first ? `Hi, ${first}!` : "Hi!",
        intro:
          "Here is the full check of your site on mobile: what's pushing visitors away and how to fix it.",
        scoresLabel: "Scores (0 to 100)",
        issuesLabel: "What to improve, from most urgent to simplest",
        why: "Why it matters",
        fix: "How to fix it",
        impact: { alto: "Urgent", medio: "Important", baixo: "Simple" },
        nextLabel: "Next step",
        next: `If you'd like, we can fix it for you. Message us on WhatsApp mentioning check #${code}, or just reply to this email.`,
        cta: "Chat on WhatsApp",
        role: BRAND.descriptor.en,
        footer:
          "You received this email because you requested a site check at vitordsb.com.br.",
      };

  const cats = Object.keys(CAT_LABEL) as Category[];

  // ── Texto puro ──
  const text = [
    t.hello,
    "",
    t.intro,
    "",
    `${t.scoresLabel}: ${cats.map((c) => `${CAT_LABEL[c][lang]} ${scores[c]}`).join(" · ")}`,
    "",
    `${t.issuesLabel}:`,
    ...issues.flatMap((i, n) => [
      "",
      `${n + 1}. [${t.impact[i.impact]}] ${i.title}`,
      `   ${t.why}: ${i.why}`,
      `   ${t.fix}: ${i.fix}`,
    ]),
    "",
    `${t.nextLabel}: ${t.next}`,
    `WhatsApp: ${whatsapp}`,
    "",
    BRAND.name,
    t.role,
    SITE.replace("https://", ""),
    "",
    `${t.footer} CNPJ ${CNPJ}.`,
  ].join("\n");

  // ── HTML ──
  const scoreCells = cats
    .map(
      (c) =>
        `<td align="center" width="25%" style="padding:4px;">
          <p style="margin:0;font-size:26px;line-height:30px;font-weight:800;color:${scoreColor(scores[c])};">${scores[c]}</p>
          <p style="margin:4px 0 0;font-size:12px;color:${C.muted};">${esc(CAT_LABEL[c][lang])}</p>
        </td>`,
    )
    .join("");

  const issueRows = issues
    .map(
      (i, n) =>
        `<tr><td style="padding:${n ? 18 : 0}px 0 0;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${i.impact === "alto" ? "#b91c1c" : C.muted};">${esc(t.impact[i.impact])}</p>
          <p style="margin:0;font-size:15px;line-height:22px;font-weight:700;color:${C.text};">${esc(i.title)}</p>
          <p style="margin:6px 0 0;font-size:14px;line-height:21px;color:${C.muted};"><strong style="color:${C.text};">${esc(t.why)}:</strong> ${esc(i.why)}</p>
          <p style="margin:4px 0 0;font-size:14px;line-height:21px;color:${C.muted};"><strong style="color:${C.text};">${esc(t.fix)}:</strong> ${esc(i.fix)}</p>
        </td></tr>`,
    )
    .join("");

  const body = [
    row(
      highlight(
        `${label(t.scoresLabel)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${scoreCells}</tr></table>`,
      ),
    ),
    issues.length
      ? row(
          `${label(t.issuesLabel)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${issueRows}</table>`,
        )
      : "",
  ].join("");

  const html = emailShell({
    pt,
    title: t.subject,
    preheader: t.preheader,
    tag: t.tag,
    hello: t.hello,
    intro: t.intro,
    body,
    next: { label: t.nextLabel, text: t.next, cta: t.cta, href: whatsapp },
    role: t.role,
    footer: t.footer,
  });

  return { subject: t.subject, text, html };
}
