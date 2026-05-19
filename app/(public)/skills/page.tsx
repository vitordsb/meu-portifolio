import { getAllSkills } from "@/lib/db";
import { hardcodedSkills } from "@/lib/portfolio-data";
import SkillsSection from "@/components/sections/SkillsSection";

export const metadata = { title: "Skills | Vitor Barreto" };
export const revalidate = 0;

export default async function SkillsPage() {
  const fromDb = await getAllSkills().catch(() => []);
  // hardcoded vem com meta (level + projects). DB ainda é Skill cru.
  const skills = [...hardcodedSkills, ...fromDb];
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-background text-foreground">
      <SkillsSection skills={skills} />
    </main>
  );
}
