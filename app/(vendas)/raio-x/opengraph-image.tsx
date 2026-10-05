import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const runtime = "nodejs";
export const alt = "Raio-X grátis do seu site";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prévia do link no WhatsApp/LinkedIn (ver lib/og/card.tsx). */
export default function Image() {
  return ogCard({
    eyebrow: "Raio-X grátis",
    title: "O que está afastando clientes do seu site?",
    subtitle: "Velocidade no celular, Google, acessibilidade e segurança. Resultado em 30 segundos, com o teste do próprio Google.",
    cta: "Fazer o Raio-X grátis",
  });
}
