import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { BRAND } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `Pagar pedido, ${BRAND.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prévia do link de pagamento que vai pro cliente (ver lib/og/card.tsx). */
export default function Image() {
  return ogCard({
    eyebrow: "Pagamento seguro",
    title: "Pagar pedido",
    subtitle: "Pague o pedido que combinamos com Pix, boleto ou cartão, direto no site.",
    cta: "Pagar agora",
  });
}
