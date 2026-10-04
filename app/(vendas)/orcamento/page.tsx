import type { Metadata } from "next";
import EstimateChat from "@/components/estimate/EstimateChat";

export const metadata: Metadata = {
  title: "Orçamento com IA | Vitor de Souza",
  description:
    "Converse 2 minutos com a assistente e receba uma faixa de preço e prazo para o seu software, calculada com os critérios do Vitor.",
  alternates: { canonical: "/orcamento" },
};

export default function OrcamentoPage() {
  return <EstimateChat />;
}
