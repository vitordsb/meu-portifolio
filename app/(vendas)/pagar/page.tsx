import type { Metadata } from "next";
import { Suspense } from "react";
import PayOrderPage from "@/components/payments/PayOrderPage";

export const metadata: Metadata = {
  title: "Pagar pedido | Vitor de Souza",
  description: "Pague um pedido já combinado com Pix, boleto ou cartão.",
  robots: { index: false },
};

export default function Page() {
  // useSearchParams (?pedido=) precisa de Suspense pra página seguir estática
  return (
    <Suspense>
      <PayOrderPage />
    </Suspense>
  );
}
