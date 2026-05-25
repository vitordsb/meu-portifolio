import { getAllSkills, getAllProjects } from "@/lib/db";
import SkillsSection from "@/components/sections/SkillsSection";

export const metadata = { title: "Skills | Vitor Barreto" };
export const revalidate = 0;

export default async function SkillsPage() {
  const [skills, projects] = await Promise.all([
    getAllSkills().catch(() => []),
    getAllProjects().catch(() => []),
  ]);
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-background text-foreground">
      <SkillsSection skills={skills} projects={projects} />
    </main>
  );
}
