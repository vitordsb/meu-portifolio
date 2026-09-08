import SidebarShell from "@/components/SidebarShell";
import HeroSection from "@/components/sections/HeroSection";
import HomeAbout from "@/components/home/HomeAbout";
import HomeStack from "@/components/home/HomeStack";
import HomeWork from "@/components/home/HomeWork";
import HomeOwnProjects from "@/components/home/HomeOwnProjects";
import HomeCertificates from "@/components/home/HomeCertificates";
import {
  getAllProjects,
  getAllSkills,
  getAllCertificates,
  getAllTimelineEvents,
} from "@/lib/db";

export const revalidate = 0;

export default async function HomePage() {
  const [projects, skills, certificates, timeline] = await Promise.all([
    getAllProjects().catch(() => []),
    getAllSkills().catch(() => []),
    getAllCertificates().catch(() => []),
    getAllTimelineEvents().catch(() => []),
  ]);

  return (
    <SidebarShell>
      <main className="min-h-screen bg-surface text-on-surface">
        <HeroSection projectCount={projects.length} />
        <HomeAbout events={timeline} />
        <HomeStack skills={skills} projects={projects} />
        <HomeWork projects={projects} />
        <HomeOwnProjects projects={projects} />
        <HomeCertificates certificates={certificates} />
      </main>
    </SidebarShell>
  );
}
