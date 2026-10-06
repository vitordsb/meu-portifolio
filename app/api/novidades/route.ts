import { z } from "zod";
import { deliverContact } from "@/lib/contact-delivery";
import { describeAttribution } from "@/lib/attribution-server";
import { guard, json } from "@/lib/estimate/guard";
import { addSubscriber } from "@/lib/newsletter";
import { cleanLine } from "@/lib/sanitize";
import { isBotRequest } from "@/lib/security/bot";
import { takeDaily } from "@/lib/security/daily-cap";

/**
 * "Quer receber nossas novidades?": grava o e-mail nos Contatos do Resend e
 * avisa o Vitor de cada inscrição nova. Mesmas camadas dos outros
 * formulários públicos (SPEC segurança): limite por IP, BotID, campo-isca e
 * teto diário.
 */

const Schema = z.object({
  email: z
    .string()
    .max(400)
    .transform(cleanLine)
    .pipe(z.email().max(320)),
  /** Campo-isca: pessoa não vê, robô preenche. */
  website: z.string().max(200).optional(),
  origem: z.unknown().optional(),
});

export async function POST(req: Request) {
  const blocked = guard(req, "novidades", 3, 60 * 60 * 1000);
  if (blocked) return blocked;
  if (await isBotRequest()) return json({ error: "forbidden" }, 403);

  const raw = await req.json().catch(() => null);
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid" }, 400);
  // Robô preencheu a isca: finge sucesso e não grava nada
  if (parsed.data.website?.trim()) return json({ ok: true });
  if (!(await takeDaily("novidades")).ok) return json({ error: "unavailable" }, 503);

  const email = parsed.data.email.toLowerCase();
  const result = await addSubscriber(email);

  // Aviso pro Vitor: inscrição nova, ou o e-mail quando o Resend falhou
  // (assim nenhum inscrito se perde)
  if (result !== "ja_inscrito") {
    await deliverContact({
      name: "Inscrição em novidades",
      email,
      company: null,
      subject: result === "novo" ? "Nova inscrição em novidades" : "Inscrição em novidades (NÃO gravada no Resend)",
      message: [
        `E-mail: ${email}`,
        result === "novo"
          ? "Gravado nos Contatos do Resend."
          : "O Resend recusou o contato: adicione manualmente na lista.",
        "",
        `── ${describeAttribution(parsed.data.origem)}`,
      ].join("\n"),
    });
  }

  return json({ ok: true });
}
