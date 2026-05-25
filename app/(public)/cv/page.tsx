import CVDocument from "@/components/sections/CVDocument";
import { getAllProjects, getAllSkills, getAllCertificates } from "@/lib/db";

export const metadata = { title: "CV | Vitor Barreto" };
export const revalidate = 0;

export default async function CVPage() {
  const [projects, skills, certificates] = await Promise.all([
    getAllProjects().catch(() => []),
    getAllSkills().catch(() => []),
    getAllCertificates().catch(() => []),
  ]);

  return (
    <CVDocument
      projects={projects}
      skills={skills}
      certificates={certificates}
    />
  );
}
