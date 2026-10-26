import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { SERVICE_PAGES, findServicePage } from "@/lib/service-pages";
import { servicePageData } from "@/lib/service-pages-data";
import { BRAND } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `Serviços, ${BRAND.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ tipo: p.slug }));
}

/** Prévia do link de cada serviço (ver lib/og/card.tsx). */
export default async function Image({ params }: { params: Promise<{ tipo: string }> }) {
  const page = findServicePage((await params).tipo) ?? SERVICE_PAGES[0];
  const d = servicePageData(page);
  const min = d.guide.min.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  return ogCard({
    label: "Serviços",
    title: d.name,
    subtitle: `A partir de ${min}. ${d.lead}`,
    cta: "Ver como funciona",
  });
}
