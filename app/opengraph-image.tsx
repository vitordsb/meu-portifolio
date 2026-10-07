import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { BRAND } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${BRAND.name}, estúdio de software: sites, sistemas e aplicativos para empresas`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prévia do link no WhatsApp/LinkedIn (ver lib/og/card.tsx). */
export default function Image() {
  return ogCard({
    label: "Estúdio de software",
    title: "Sites, sistemas e aplicativos para a sua empresa crescer.",
    subtitle: "Preço combinado antes de começar, com contrato e nota fiscal.",
    cta: "Orçamento grátis em 2 min",
    shots: { desktop: "projects/shots/arqdoor-desktop.jpg", mobile: "projects/shots/arqdoor-mobile.jpg" },
  });
}
