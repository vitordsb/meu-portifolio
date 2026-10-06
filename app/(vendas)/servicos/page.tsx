import type { Metadata } from "next";
import { OG_BASE, SITE_URL, BRAND } from "@/lib/site";
import ServicesPage from "@/components/payments/ServicesPage";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Serviços com preço fechado: consultoria, revisão de UI/UX, landing page e site institucional. Pague com Pix ou cartão.",
  alternates: { canonical: "/servicos" },
  openGraph: {
    ...OG_BASE,
    title: `Serviços com preço fechado | ${BRAND.name}`,
    description:
      "Consultoria, revisão de UI/UX, landing page e site institucional com preço fechado. Pague com Pix ou cartão e a gente começa.",
    url: `${SITE_URL}/servicos`,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd />
      <ServicesPage />
    </>
  );
}
