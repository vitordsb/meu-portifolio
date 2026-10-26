import { SOCIALS } from "@/lib/deck-content";
import { SITE_URL } from "@/lib/site";

/**
 * Programa de indicação (/indique). Sem cadastro nem banco: o link pessoal é
 * a home com `?ref=indicacao-<nome>`, e a origem do lead (lib/attribution)
 * já leva esse ref pro e-mail de cada pedido. O Vitor confere ali quem
 * indicou e paga a recompensa por Pix.
 *
 * Recompensa escolhida em 23/out/2026 (provisória, trocar aqui): muda o
 * texto da página inteira.
 */
export const REFERRAL_REWARD = {
  percent: 10,
} as const;

const PREFIX = "indicacao-";

/** "Maria José da Silva" -> "maria-jose-da-silva" (até 40 letras). */
export function referralSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}

export function referralLink(name: string): string | null {
  const slug = referralSlug(name);
  return slug.length >= 2 ? `${SITE_URL}/?ref=${PREFIX}${slug}` : null;
}

/** Nome de quem indicou, a partir do `ref` guardado ("indicacao-maria-souza"
 *  -> "Maria Souza"), ou null se a visita não veio de indicação. */
export function referrerName(ref: string | undefined): string | null {
  if (!ref?.startsWith(PREFIX)) return null;
  const words = ref.slice(PREFIX.length).split("-").filter(Boolean);
  if (words.length === 0) return null;
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

/**
 * Conversa de WhatsApp não leva a origem do lead, então quem veio de
 * indicação já chega dizendo de quem. A pessoa vê o texto antes de enviar.
 */
export function withReferral(href: string, ref: string | undefined): string {
  const who = referrerName(ref);
  if (!who) return href;
  try {
    const url = new URL(href);
    const text = url.searchParams.get("text");
    if (!text || text.includes(who)) return href;
    // encodeURIComponent, como nos outros links: o "+" do searchParams pode
    // aparecer literal na mensagem
    return `${url.origin}${url.pathname}?text=${encodeURIComponent(`${text} (Indicação de ${who})`)}`;
  } catch {
    return href;
  }
}

/** Mensagem que quem indica manda pro amigo, com o link dentro. */
export function referralMessage(link: string, pt: boolean): string {
  return pt
    ? `Conheço um estúdio que faz site, landing page e sistema sob medida, e o atendimento é muito bom. Dá uma olhada: ${link}`
    : `I know a studio that builds websites, landing pages and custom software, and they're great to work with. Take a look: ${link}`;
}

/** Quem indicou avisa o Vitor: é assim que ele fica com o WhatsApp da pessoa
 *  pra combinar o Pix quando o indicado fechar. */
export function referralNoticeHref(name: string, link: string, pt: boolean): string {
  const text = pt
    ? `Oi! Sou ${name.trim()} e indiquei vocês pra alguém. Meu link de indicação: ${link}`
    : `Hi! I'm ${name.trim()} and I referred someone to you. My referral link: ${link}`;
  return `${SOCIALS.whatsapp}?text=${encodeURIComponent(text)}`;
}
