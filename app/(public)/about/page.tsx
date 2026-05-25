import AboutSection from "@/components/sections/AboutSection";
import TimelineSection from "@/components/sections/TimelineSection";
import { getAllTimelineEvents } from "@/lib/db";

export const metadata = { title: "Sobre | Vitor Barreto" };
export const revalidate = 0;

export default async function AboutPage() {
  const events = await getAllTimelineEvents().catch(() => []);
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-background text-foreground">
      <AboutSection />
      <TimelineSection events={events} />
    </main>
  );
}
