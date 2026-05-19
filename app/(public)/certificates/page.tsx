import { getAllCertificates } from "@/lib/db";
import { hardcodedCertificates } from "@/lib/portfolio-data";
import CertificatesSection from "@/components/sections/CertificatesSection";

export const metadata = { title: "Certificações | Vitor Barreto" };
export const revalidate = 0;

export default async function CertificatesPage() {
  const fromDb = await getAllCertificates().catch(() => []);
  const certificates = [...hardcodedCertificates, ...fromDb];
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-background text-foreground">
      <CertificatesSection certificates={certificates} />
    </main>
  );
}
