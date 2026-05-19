import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground lg:pl-60">
        <HeroSection />
        <FeaturedProjectsSection />
      </main>
    </>
  );
}
