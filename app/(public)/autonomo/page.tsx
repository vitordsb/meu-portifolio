import AutonomoSection from "@/components/sections/AutonomoSection";
import { getAllProjects } from "@/lib/db";

export const metadata = { title: "Autônomo | Vitor Barreto" };
export const revalidate = 0;

export default async function AutonomoPage() {
  const projects = await getAllProjects().catch(() => []);
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-background text-foreground">
      <AutonomoSection projects={projects} />
    </main>
  );
}
