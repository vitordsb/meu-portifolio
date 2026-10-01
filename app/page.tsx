import HomeDeck from "@/components/deck/HomeDeck";

// Home é landing: conteúdo fixo (lib/landing-data.ts), sem banco. Sai estática
// no build, sem consulta a cada visita.
export default function HomePage() {
  return (
    <main>
      <HomeDeck />
    </main>
  );
}
