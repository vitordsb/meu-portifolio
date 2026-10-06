import type { Metadata } from "next";
import { OG_BASE, SITE_URL, BRAND } from "@/lib/site";
import { Suspense } from "react";
import PayOrderPage from "@/components/payments/PayOrderPage";

export const metadata: Metadata = {
  title: "Pagar pedido",
  description: "Pague um pedido já combinado com Pix, boleto ou cartão.",
  robots: { index: false },
  openGraph: {
    ...OG_BASE,
    title: `Pagar pedido | ${BRAND.name}`,
    description:
      "Pague um pedido já combinado com Pix, boleto ou cartão.",
    url: `${SITE_URL}/pagar`,
  },
};

export default function Page() {
  // useSearchParams (?pedido=) precisa de Suspense pra página seguir estática
  return (
    <Suspense>
      <PayOrderPage />
    </Suspense>
  );
}
