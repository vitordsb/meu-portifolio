import type { Metadata } from "next";
import CompanyHome from "@/components/home/CompanyHome";
import JsonLd from "@/components/seo/JsonLd";
import { GUIDE_EXAMPLES } from "@/lib/guide/examples";
import { buildCatalog } from "@/lib/projects-catalog";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Preço de partida e prazo de cada tipo de projeto: a mesma tabela do
// orçamento com IA, calculada aqui no build (a tabela não vai pro navegador).
const prices = Object.fromEntries(
  GUIDE_EXAMPLES.map((e) => [e.id, { min: e.min, weeksMin: e.weeksMin, weeksMax: e.weeksMax }]),
);

// Projetos entregues por tipo (vitrine dos serviços e abas de projetos).
const projects = buildCatalog();

// Home é landing: conteúdo fixo, sem banco. Sai estática no build.
// A home anterior (deck de sessões) segue em components/deck/HomeDeck: pra
// voltar, troque <CompanyHome .../> por <HomeDeck />.
export default function HomePage() {
  return (
    <main>
      <JsonLd />
      <CompanyHome
        prices={prices}
        projects={projects}
      />
    </main>
  );
}
