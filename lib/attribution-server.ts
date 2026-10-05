import { z } from "zod";
import { cleanLine } from "@/lib/sanitize";

/**
 * Origem do lead no servidor: valida o que veio do navegador (não confiável)
 * e escreve a linha do e-mail do Vitor. Captura em lib/attribution.ts.
 */

const field = z
  .string()
  .max(200)
  .transform(cleanLine)
  .pipe(z.string().max(120))
  .optional();

export const AttributionSchema = z
  .object({
    source: field,
    medium: field,
    campaign: field,
    content: field,
    term: field,
    ref: field,
    referrer: field,
    landing: field,
    at: field,
  })
  .partial();

const KNOWN: [RegExp, string][] = [
  [/(^|\.)google\./, "Google (busca)"],
  [/(^|\.)bing\.com$/, "Bing (busca)"],
  [/duckduckgo\.com$/, "DuckDuckGo (busca)"],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, "LinkedIn"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)facebook\.com$|^fb\.me$/, "Facebook"],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, "X / Twitter"],
  [/(^|\.)youtube\.com$/, "YouTube"],
  [/(^|\.)github\.com$/, "GitHub"],
  [/chatgpt\.com$|chat\.openai\.com$/, "ChatGPT"],
  [/perplexity\.ai$/, "Perplexity"],
  [/(^|\.)whatsapp\.com$|^wa\.me$/, "WhatsApp"],
];

/** Uma linha legível pro e-mail do Vitor. */
export function describeAttribution(raw: unknown): string {
  const parsed = AttributionSchema.safeParse(raw);
  const a = parsed.success ? parsed.data : undefined;
  if (!a || !Object.values(a).some(Boolean)) {
    return "Origem: direto (digitou o endereço, favorito ou app que esconde a origem)";
  }

  const parts: string[] = [];
  if (a.ref) parts.push(`link ?ref=${a.ref}`);
  if (a.source) {
    parts.push(
      [a.source, a.medium, a.campaign].filter(Boolean).join(" / ") +
        (a.content ? ` (${a.content})` : ""),
    );
  }
  if (a.referrer) {
    const name = KNOWN.find(([re]) => re.test(a.referrer!))?.[1];
    parts.push(name ? `${name}, via ${a.referrer}` : `site ${a.referrer}`);
  }

  const where = a.landing ? `, entrou por ${a.landing}` : "";
  const when = a.at ? ` em ${a.at.split("-").reverse().join("/")}` : "";
  return `Origem: ${parts.join(" · ") || "desconhecida"}${where}${when}`;
}
