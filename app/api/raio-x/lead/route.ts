import { randomInt } from "node:crypto";
import { z } from "zod";
import { deliverContact } from "@/lib/contact-delivery";
import { describeAttribution } from "@/lib/attribution-server";
import { guard, json } from "@/lib/estimate/guard";
import { sendEmail } from "@/lib/mailer";
import { buildRaioXEmail } from "@/lib/raio-x/client-email";
import { issueFromId } from "@/lib/raio-x/report";
import { CATEGORIES, type Issue } from "@/lib/raio-x/types";
import { displayUrl, normalizeSiteUrl } from "@/lib/raio-x/url";
import { cleanLine } from "@/lib/sanitize";
import { isBotRequest } from "@/lib/security/bot";
import { takeDaily } from "@/lib/security/daily-cap";

/**
 * Lead do Raio-X: a pessoa deixa nome e WhatsApp pra ver o relatório
 * completo. Vai pro Vitor (banco + e-mail) com o resumo e, se ela deu
 * e-mail, o relatório vai pra ela também.
 *
 * Confiança: notas e ids dos problemas vêm do navegador (cada rota é uma
 * função separada, sem memória em comum com /analisar), mas o TEXTO é
 * remontado do nosso dicionário: nada digitado por terceiro sai no e-mail
 * do cliente. Id fora do dicionário só aparece, cru, no e-mail do Vitor.
 */

const Score = z.coerce.number().int().min(0).max(100);

const Schema = z.object({
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
  lang: z.enum(["pt", "en"]).catch("pt"),
  url: z.string().max(400),
  scores: z.object({
    performance: Score,
    seo: Score,
    accessibility: Score,
    bestPractices: Score,
  }),
  lcpMs: z.coerce.number().int().min(0).max(120_000),
  issues: z
    .array(
      z.object({
        id: z.string().regex(/^@?[a-z0-9-]{1,60}$/),
        impact: z.enum(["alto", "medio", "baixo"]),
      }),
    )
    .max(20),
});

const IMPACT_PT = { alto: "URGENTE", medio: "importante", baixo: "simples" };

export async function POST(req: Request) {
  const blocked = guard(req, "raiox-lead", 4, 60 * 60 * 1000);
  if (blocked) return blocked;
  if (await isBotRequest()) return json({ error: "forbidden" }, 403);

  const raw = await req.json().catch(() => null);
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid" }, 400);
  const url = normalizeSiteUrl(parsed.data.url);
  if (!url) return json({ error: "url" }, 400);
  if (!(await takeDaily("raiox_lead")).ok) {
    return json({ error: "unavailable" }, 503);
  }

  const d = parsed.data;
  const pt = d.lang === "pt";
  const { scores, lcpMs } = d;
  const issues: Issue[] = [];
  const unknown: string[] = [];
  for (const i of d.issues) {
    const issue = issueFromId(i.id, i.impact, d.lang, lcpMs);
    if (issue) issues.push(issue);
    else unknown.push(`${i.id} (${i.impact})`);
  }

  const code = String(randomInt(10_000, 100_000));
  const when = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });
  const catPt = {
    performance: "Velocidade",
    seo: "Google",
    accessibility: "Acessibilidade",
    bestPractices: "Segurança",
  } as const;

  // Primeiro o e-mail do cliente: o do Vitor já diz se ele chegou
  let emailed = false;
  if (d.email) {
    const mail = buildRaioXEmail({ name: d.name, code, scores, issues, pt });
    emailed = await sendEmail({
      to: d.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: process.env.CONTACT_TO_EMAIL ?? undefined,
    });
  }

  await deliverContact({
    name: d.name,
    email: d.email ?? null,
    company: null,
    subject: `Raio-X #${code}: ${displayUrl(url).slice(0, 80)}`,
    message: [
      `Raio-X do site #${code} · ${when}`,
      describeAttribution(raw?.origem),
      `Site: ${url}`,
      `WhatsApp: ${d.whatsapp}`,
      `E-mail: ${d.email ?? "(não informou)"}`,
      "",
      `Notas: ${CATEGORIES.map((c) => `${catPt[c]} ${scores[c]}`).join(" · ")}`,
      `Conteúdo principal no celular: ${(lcpMs / 1000).toFixed(1)} s`,
      "",
      "Problemas (do mais grave):",
      ...issues.map((i) => `- [${IMPACT_PT[i.impact]}] ${i.title}`),
      ...(unknown.length
        ? ["", `Outros (id do Lighthouse): ${unknown.join(", ")}`]
        : []),
      "",
      "Notas vindas do navegador: rode de novo em /raio-x antes de citar números.",
      !d.email
        ? "O cliente não deu e-mail: viu o relatório só na tela."
        : emailed
          ? "O cliente recebeu o relatório completo por e-mail."
          : "O e-mail do relatório pro cliente FALHOU: ele viu só na tela.",
    ].join("\n"),
  });

  return json({ ok: true, code, emailed });
}
