import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const runtime = "nodejs";
export const alt = "Orçamento grátis do seu projeto em 2 minutos";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prévia do link no WhatsApp/LinkedIn (ver lib/og/card.tsx). */
export default function Image() {
  return ogCard({
    eyebrow: "Orçamento com IA",
    title: "Orçamento grátis do seu projeto em 2 minutos",
    subtitle: "Toque nas opções ou fale. Você recebe a faixa de preço e o prazo na hora.",
    cta: "Fazer meu orçamento",
  });
}
