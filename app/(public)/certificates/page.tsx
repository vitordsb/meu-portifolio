import { getAllCertificates } from "@/lib/db";
import CertificatesSection from "@/components/sections/CertificatesSection";

export const metadata = { title: "Certificações | Vitor Barreto" };
export const revalidate = 0;

export default async function CertificatesPage() {
  const certificates = await getAllCertificates().catch(() => []);
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-background text-foreground">
      <CertificatesSection certificates={certificates} />
    </main>
  );
}
