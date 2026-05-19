import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getAllProjects,
  getAllCertificates,
  getAllSkills,
  getAllFreelanceWork,
  getAllTimelineEvents,
} from "@/lib/db";
import AdminPanel from "@/components/admin/AdminPanel";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/");

  const [projects, certificates, skills, freelance, timeline] = await Promise.all([
    getAllProjects(),
    getAllCertificates(),
    getAllSkills(),
    getAllFreelanceWork(),
    getAllTimelineEvents(),
  ]);

  return (
    <AdminPanel
      user={user}
      initialProjects={projects}
      initialCertificates={certificates}
      initialSkills={skills}
      initialFreelance={freelance}
      initialTimeline={timeline}
    />
  );
}
