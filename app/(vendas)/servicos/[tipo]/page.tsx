import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceTypePage, { serviceFaq } from "@/components/servicos/ServiceTypePage";
import { findServicePage, SERVICE_PAGES } from "@/lib/service-pages";
import { servicePageData } from "@/lib/service-pages-data";
import { BRAND, OG_BASE, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ tipo: p.slug }));
}

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export async function generateMetadata({ params }: { params: Promise<{ tipo: string }> }): Promise<Metadata> {
  const page = findServicePage((await params).tipo);
  if (!page) return {};
  const d = servicePageData(page);
  const title = `${d.name} a partir de ${brl(d.guide.min)}`;
  const url = `${SITE_URL}/servicos/${d.slug}`;
  return {
    title,
    description: d.lead,
    alternates: { canonical: `/servicos/${d.slug}` },
    openGraph: { ...OG_BASE, title, description: d.lead, url },
  };
}

export default async function Page({ params }: { params: Promise<{ tipo: string }> }) {
  const page = findServicePage((await params).tipo);
  if (!page) notFound();
  const d = servicePageData(page);
  const url = `${SITE_URL}/servicos/${d.slug}`;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: d.name,
      description: d.lead,
      url,
      areaServed: { "@type": "Country", name: "Brasil" },
      provider: { "@type": "Organization", name: BRAND.name, url: SITE_URL },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "BRL",
        lowPrice: d.guide.min,
        highPrice: d.guide.max,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: serviceFaq(d).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ServiceTypePage data={d} />
    </>
  );
}
