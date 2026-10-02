import type { Metadata } from "next";
import ServicesPage from "@/components/payments/ServicesPage";

export const metadata: Metadata = {
  title: "Serviços | Vitor de Souza",
  description:
    "Serviços com preço fechado: consultoria, revisão de UI/UX, landing page e site institucional. Pague com Pix ou cartão.",
};

export default function Page() {
  return <ServicesPage />;
}
