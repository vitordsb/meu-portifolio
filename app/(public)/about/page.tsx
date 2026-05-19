import AboutSection from "@/components/sections/AboutSection";
import TimelineSection from "@/components/sections/TimelineSection";
import { getAllTimelineEvents } from "@/lib/db";
import { hardcodedTimeline } from "@/lib/portfolio-data";

export const metadata = { title: "Sobre | Vitor Barreto" };
export const revalidate = 0;

export default async function AboutPage() {
  const fromDb = await getAllTimelineEvents().catch(() => []);
  // hardcoded como base; admin pode acrescentar/sobrepor entries no banco
  const events = [...hardcodedTimeline, ...fromDb].sort((a, b) =>
    a.sortDate.localeCompare(b.sortDate)
  );
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-background text-foreground">
      <AboutSection />
      <TimelineSection events={events} />
    </main>
  );
}
