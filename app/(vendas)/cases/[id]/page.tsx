import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CasePage from "@/components/cases/CasePage";
import { COMPANIES } from "@/lib/companies";
import { OG_BASE, SITE_URL } from "@/lib/site";
import { getPublishedTestimonials } from "@/lib/testimonials/store";

// Mesmo ritmo da home: depoimento novo entra pelo revalidateTag
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ id: c.id }));
}

function caseText(id: string) {
  const c = COMPANIES.find((x) => x.id === id);
  if (!c) return null;
  return {
    title: `Case ${c.name}: ${c.sector.pt}`,
    description: (c.headline ?? c.about).pt,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = caseText(id);
  if (!t) return {};
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/cases/${id}` },
    openGraph: { ...OG_BASE, title: t.title, description: t.description, url: `${SITE_URL}/cases/${id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!COMPANIES.some((c) => c.id === id)) notFound();
  const testimonials = await getPublishedTestimonials().catch(() => []);
  // Filtro feito aqui: o caseTestimonials da home mora num módulo de cliente
  return <CasePage id={id} testimonials={testimonials.filter((t) => t.project === id)} />;
}
