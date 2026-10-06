import { SOCIALS } from "@/lib/deck-content";

/** WhatsApp com a primeira mensagem pronta: quem tem dificuldade de digitar só envia. */
export function whatsappHref(pt: boolean) {
  const text = pt
    ? "Olá! Vim pelo site e quero conversar sobre um projeto."
    : "Hi! I found you through the website and want to talk about a project.";
  return `${SOCIALS.whatsapp}?text=${encodeURIComponent(text)}`;
}
