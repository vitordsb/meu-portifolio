import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { REFERRAL_REWARD } from "@/lib/referral";
import { BRAND } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `Indique e ganhe, ${BRAND.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prévia do link no WhatsApp/LinkedIn (ver lib/og/card.tsx). */
export default function Image() {
  return ogCard({
    label: "Indicação",
    title: "Indique e ganhe",
    subtitle: `Conhece alguém que precisa de site ou sistema? Fechou o projeto, você ganha ${REFERRAL_REWARD.percent}% do valor no Pix.`,
    cta: "Gerar meu link",
  });
}
