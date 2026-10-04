import type { Metadata } from "next";
import HomeDeck from "@/components/deck/HomeDeck";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Home é landing: conteúdo fixo (lib/landing-data.ts), sem banco. Sai estática
// no build, sem consulta a cada visita.
export default function HomePage() {
  return (
    <main>
      <JsonLd />
      <HomeDeck />
    </main>
  );
}
