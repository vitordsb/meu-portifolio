import SidebarShell from "@/components/SidebarShell";
import HeroSection from "@/components/sections/HeroSection";
import HomeAbout from "@/components/home/HomeAbout";
import HomeStack from "@/components/home/HomeStack";
import HomeWork from "@/components/home/HomeWork";
import HomeCertificates from "@/components/home/HomeCertificates";
import {
  getAllProjects,
  getCertificateCount,
  getAllSkills,
  getAllCertificates,
  getAllTimelineEvents,
} from "@/lib/db";

export const revalidate = 0;

export default async function HomePage() {
  const [projects, skills, certificates, timeline, certCount] = await Promise.all([
    getAllProjects().catch(() => []),
    getAllSkills().catch(() => []),
    getAllCertificates().catch(() => []),
    getAllTimelineEvents().catch(() => []),
    getCertificateCount().catch(() => 0),
  ]);

  return (
    <SidebarShell>
      <main className="min-h-screen bg-background text-foreground">
        <HeroSection certCount={certCount} projectCount={projects.length} />
        <HomeAbout events={timeline} />
        <HomeStack skills={skills} />
        <HomeWork projects={projects} />
        <HomeCertificates certificates={certificates} />
      </main>
    </SidebarShell>
  );
}
