import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { BRAND } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `Serviços com preço fechado, ${BRAND.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prévia do link no WhatsApp/LinkedIn (ver lib/og/card.tsx). */
export default function Image() {
  return ogCard({
    eyebrow: "Serviços",
    title: "Serviços com preço fechado",
    subtitle: "Consultoria, revisão de UI/UX, landing page e site institucional. Pague com Pix ou cartão e a gente começa.",
    cta: "Ver pacotes e preços",
  });
}
