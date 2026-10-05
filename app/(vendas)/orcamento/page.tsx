import type { Metadata } from "next";
import { OG_BASE, SITE_URL } from "@/lib/site";
import EstimateChat from "@/components/estimate/EstimateChat";

export const metadata: Metadata = {
  title: "Orçamento com IA | Vitor de Souza",
  description:
    "Converse 2 minutos com a assistente e receba uma faixa de preço e prazo para o seu software, calculada com os critérios do Vitor.",
  alternates: { canonical: "/orcamento" },
  openGraph: {
    ...OG_BASE,
    title: "Orçamento grátis do seu projeto em 2 minutos",
    description:
      "Toque nas opções ou fale: a assistente monta o escopo e você recebe a faixa de preço e o prazo na hora.",
    url: `${SITE_URL}/orcamento`,
  },
};

export default function OrcamentoPage() {
  return <EstimateChat />;
}
