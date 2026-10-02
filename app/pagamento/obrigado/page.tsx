import type { Metadata } from "next";
import { Suspense } from "react";
import ThanksPage from "@/components/payments/ThanksPage";

export const metadata: Metadata = {
  title: "Pagamento enviado | Vitor de Souza",
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense>
      <ThanksPage />
    </Suspense>
  );
}
