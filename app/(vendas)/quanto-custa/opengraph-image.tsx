import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { GUIDE_EXAMPLES } from "@/lib/guide/examples";

// Mesmos valores do guia (calculados por lib/estimate/pricing): mudou o preço, a prévia acompanha.
const min = (id: string) =>
  (GUIDE_EXAMPLES.find((e) => e.id === id)?.min ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export const runtime = "nodejs";
export const alt = "Quanto custa um site ou aplicativo em 2026";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prévia do link no WhatsApp/LinkedIn (ver lib/og/card.tsx). */
export default function Image() {
  return ogCard({
    eyebrow: "Guia de preços 2026",
    title: "Quanto custa um site ou aplicativo em 2026?",
    subtitle: `Landing page a partir de ${min("landing")} e site institucional a partir de ${min("site")}. Veja o que muda o preço.`,
    cta: "Ler o guia",
  });
}
