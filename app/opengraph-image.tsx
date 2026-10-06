import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const runtime = "nodejs";
export const alt = "Vitor de Souza, estúdio de software: sites, sistemas e aplicativos para empresas";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prévia do link no WhatsApp/LinkedIn (ver lib/og/card.tsx). */
export default function Image() {
  return ogCard({
    eyebrow: "Estúdio de software",
    title: "Sites, sistemas e aplicativos para a sua empresa crescer.",
    subtitle: "Preço combinado antes de começar, com contrato e nota fiscal.",
    cta: "Orçamento grátis em 2 min",
  });
}
