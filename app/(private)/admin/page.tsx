import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getAllProjects,
  getAllCertificates,
  getAllSkills,
  getAllFreelanceWork,
  getAllTimelineEvents,
  getAllContactMessages,
} from "@/lib/db";
import AdminPanel from "@/components/admin/AdminPanel";

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/");

  const [projects, certificates, skills, freelance, timeline, messages] = await Promise.all([
    getAllProjects(),
    getAllCertificates(),
    getAllSkills(),
    getAllFreelanceWork(),
    getAllTimelineEvents(),
    getAllContactMessages(),
  ]);

  return (
    <AdminPanel
      user={user}
      initialProjects={projects}
      initialCertificates={certificates}
      initialSkills={skills}
      initialFreelance={freelance}
      initialTimeline={timeline}
      initialMessages={messages}
    />
  );
}
