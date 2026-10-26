import { SOCIALS } from "@/lib/deck-content";

/** WhatsApp com a primeira mensagem pronta: quem tem dificuldade de digitar só envia. */
export function whatsappHref(pt: boolean) {
  const text = pt
    ? "Olá! Vim pelo site e quero conversar sobre um projeto."
    : "Hi! I found you through the website and want to talk about a project.";
  return `${SOCIALS.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** WhatsApp a partir de um case: a pessoa já chega dizendo o que quer. */
export function whatsappCaseHref(pt: boolean, caseName: string) {
  const text = pt
    ? `Olá! Vi o projeto ${caseName} no seu site e quero algo parecido pro meu negócio.`
    : `Hi! I saw the ${caseName} project on your website and want something similar for my business.`;
  return `${SOCIALS.whatsapp}?text=${encodeURIComponent(text)}`;
}
