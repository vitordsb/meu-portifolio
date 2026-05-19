import { redirect } from "next/navigation";

// /competencies foi fundida com /skills.
export default function CompetenciesRedirect() {
  redirect("/skills");
}
