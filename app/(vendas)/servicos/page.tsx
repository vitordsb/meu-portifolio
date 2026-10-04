import type { Metadata } from "next";
import ServicesPage from "@/components/payments/ServicesPage";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Serviços | Vitor de Souza",
  description:
    "Serviços com preço fechado: consultoria, revisão de UI/UX, landing page e site institucional. Pague com Pix ou cartão.",
  alternates: { canonical: "/servicos" },
};

export default function Page() {
  return (
    <>
      <JsonLd />
      <ServicesPage />
    </>
  );
}
