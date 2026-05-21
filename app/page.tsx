import SidebarShell from "@/components/SidebarShell";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";

export default function HomePage() {
  return (
    <SidebarShell>
      <main className="min-h-screen bg-background text-foreground">
        <HeroSection />
        <FeaturedProjectsSection />
      </main>
    </SidebarShell>
  );
}
