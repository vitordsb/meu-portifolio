import { revalidateTag } from "next/cache";
import { z } from "zod";
import { guard, json } from "@/lib/estimate/guard";
import { C, esc, FONT, noLinks, SITE } from "@/lib/email-layout";
import { ownerEmails, sendEmail } from "@/lib/mailer";
import { cleanLine, cleanText } from "@/lib/sanitize";
import { takeDaily } from "@/lib/security/daily-cap";
import { OTHER_PROJECT, projectName, requestProjectName } from "@/lib/testimonials/projects";
import {
  blobConfigured,
  createTestimonial,
  deletePhoto,
  savePhoto,
  testimonialExists,
  TESTIMONIALS_TAG,
} from "@/lib/testimonials/store";
import { moderationSig, newTestimonialId, readRequestToken } from "@/lib/testimonials/token";
import { CONSENT_VERSION, LIMITS, type StoredTestimonial } from "@/lib/testimonials/types";

/**
 * Envio de depoimento. Dois caminhos, mesmo formulário:
 * - com `token` (link único do `pnpm depoimento`): projeto vem do link, vale
 *   1 envio e sai com a marca "Cliente verificado";
 * - sem token (formulário aberto em /depoimento): a pessoa escolhe o projeto.
 *
 * Publica na hora (pedido do Vitor, 21/out/2026). A rede de proteção é o
 * e-mail pro Vitor com o botão "Tirar do site", mais limite por IP, teto
 * diário, campo-isca e texto sem link.
 *
 * Ordem: limite, teto, token, validação e só então a foto. Foto de envio
 * recusado nunca chega no storage.
 */

const Line = (min: number, max: number) =>
  z.string().transform((s) => noLinks(cleanLine(s))).pipe(z.string().min(min).max(max));

const Schema = z.object({
  token: z.string().max(600).optional(),
  project: z.string().max(40).optional(),
  name: Line(LIMITS.name[0], LIMITS.name[1]),
  role: z
    .string()
    .optional()
    .transform((s) => (s ? noLinks(cleanLine(s)) : ""))
    .pipe(z.string().max(LIMITS.role[1])),
  quote: z
    .string()
    .transform((s) =>
      noLinks(cleanText(s).replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim()),
    )
    .pipe(z.string().min(LIMITS.quote[0]).max(LIMITS.quote[1])),
  rating: z.coerce.number().int().min(1).max(5),
  consent: z.literal("sim"),
  // Campo-isca: invisível pra gente, robô preenche
  site: z.string().max(0).optional(),
});

function field(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v : undefined;
}

export async function POST(req: Request) {
  const blocked = guard(req, "depoimento", 5, 60 * 60 * 1000);
  if (blocked) return blocked;
  if (!blobConfigured()) return json({ error: "unavailable" }, 503);

  const form = await req.formData().catch(() => null);
  if (!form) return json({ error: "invalid" }, 400);

  const parsed = Schema.safeParse({
    token: field(form, "token") || undefined,
    project: field(form, "project") || undefined,
    name: field(form, "name") ?? "",
    role: field(form, "role"),
    quote: field(form, "quote") ?? "",
    rating: field(form, "rating"),
    consent: field(form, "consent"),
    site: field(form, "site"),
  });
  if (!parsed.success) return json({ error: "invalid" }, 400);
  const d = parsed.data;

  // Link único: confere assinatura, prazo e se já foi usado
  let id: string;
  let project: string;
  let label: string | null;
  let verified = false;
  if (d.token) {
    const request = readRequestToken(d.token);
    if (!request || (await testimonialExists(request.id))) return json({ error: "link" }, 410);
    id = request.id;
    project = request.project;
    label = requestProjectName(request);
    verified = true;
  } else {
    project = d.project ?? "";
    if (project !== OTHER_PROJECT && !projectName(project)) return json({ error: "invalid" }, 400);
    label = projectName(project);
    id = newTestimonialId();
  }

  if (!(await takeDaily("depoimento")).ok) return json({ error: "unavailable" }, 503);

  const photo = form.get("photo");
  let photoUrl: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > LIMITS.photoBytes) return json({ error: "photo" }, 400);
    try {
      photoUrl = await savePhoto(id, Buffer.from(await photo.arrayBuffer()));
    } catch {
      return json({ error: "photo" }, 400);
    }
  }

  const record: StoredTestimonial = {
    id,
    project,
    projectName: label,
    name: d.name,
    role: d.role || null,
    photoUrl,
    quote: d.quote,
    rating: d.rating,
    verified,
    status: "publicado",
    consentVersion: CONSENT_VERSION,
    createdAt: new Date().toISOString(),
  };

  try {
    await createTestimonial(record);
  } catch (e) {
    // Dois envios ao mesmo tempo com o mesmo link: só o primeiro grava
    console.error("[depoimentos] não gravou:", e);
    if (photoUrl) await deletePhoto(photoUrl);
    return json({ error: verified ? "link" : "unavailable" }, verified ? 410 : 503);
  }

  revalidateTag(TESTIMONIALS_TAG);
  await notifyOwner(record);
  return json({ ok: true });
}

async function notifyOwner(t: StoredTestimonial) {
  const removeUrl = `${SITE}/depoimento/moderar?id=${t.id}&s=${moderationSig(t.id)}`;
  const stars = "★".repeat(t.rating) + "☆".repeat(5 - t.rating);
  const project = t.projectName ?? "Outro projeto";
  const origin = t.verified ? "pelo link único (cliente verificado)" : "pelo formulário aberto do site";

  const sent = await sendEmail({
    to: ownerEmails(),
    subject: `[Portfolio] Depoimento novo no ar: ${t.name} (${project}) ${stars}`,
    text: [
      `Depoimento publicado ${origin}.`,
      "",
      `Nome: ${t.name}`,
      `Cargo: ${t.role ?? "(não informou)"}`,
      `Projeto: ${project}`,
      `Avaliação: ${stars} (${t.rating}/5)`,
      `Foto: ${t.photoUrl ?? "(sem foto)"}`,
      "",
      t.quote,
      "",
      `Já está no site. Se não for de verdade ou não quiser publicar, tire aqui: ${removeUrl}`,
    ].join("\n"),
    html: `<div style="font-family:${FONT};max-width:560px;margin:0 auto;padding:24px;color:${C.text};">
<p style="margin:0 0 16px;font-size:13px;color:${C.muted};">Depoimento publicado ${esc(origin)}.</p>
<div style="border:1px solid ${C.border};padding:20px;">
${t.photoUrl ? `<img src="${esc(t.photoUrl)}" width="56" height="56" alt="" style="border-radius:50%;display:block;margin-bottom:12px;">` : ""}
<p style="margin:0;font-size:18px;letter-spacing:2px;">${stars}</p>
<p style="margin:12px 0;font-size:15px;line-height:24px;white-space:pre-line;">${esc(t.quote)}</p>
<p style="margin:0;font-size:15px;font-weight:700;">${esc(t.name)}</p>
<p style="margin:2px 0 0;font-size:13px;color:${C.muted};">${esc([t.role, project].filter(Boolean).join(" · "))}</p>
</div>
<p style="margin:20px 0 12px;font-size:14px;line-height:22px;">Já está no site. Se não for de verdade ou você não quiser publicar:</p>
<a href="${esc(removeUrl)}" style="display:inline-block;padding:12px 20px;background:${C.text};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Tirar do site</a>
</div>`,
  });
  if (!sent) console.error("[depoimentos] e-mail não saiu; remoção manual:", removeUrl);
}
