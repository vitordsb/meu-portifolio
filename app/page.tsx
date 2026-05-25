import SidebarShell from "@/components/SidebarShell";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import { getAllProjects, getCertificateCount } from "@/lib/db";

export const revalidate = 0;

export default async function HomePage() {
  const [projects, certCount] = await Promise.all([
    getAllProjects().catch(() => []),
    getCertificateCount().catch(() => 0),
  ]);

  return (
    <SidebarShell>
      <main className="min-h-screen bg-background text-foreground">
        <HeroSection certCount={certCount} projectCount={projects.length} />
        <FeaturedProjectsSection projects={projects} />
      </main>
    </SidebarShell>
  );
}
