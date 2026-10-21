import type { Metadata } from "next";
import TestimonialPage from "@/components/depoimentos/TestimonialPage";
import { OG_BASE, SITE_URL } from "@/lib/site";
import { blobConfigured } from "@/lib/testimonials/store";
import { testimonialProjects } from "@/lib/testimonials/projects";

export const metadata: Metadata = {
  title: "Avalie o seu projeto",
  description: "Conte como foi o seu projeto com a gente. Leva uns 2 minutos e aparece no site.",
  alternates: { canonical: "/depoimento" },
  robots: { index: false, follow: true },
  openGraph: {
    ...OG_BASE,
    title: "Avalie o seu projeto",
    description: "Conte como foi o seu projeto com a gente. Leva uns 2 minutos.",
    url: `${SITE_URL}/depoimento`,
  },
};

/** Formulário aberto: qualquer cliente avalia, escolhendo o projeto. */
export default function Page() {
  if (!blobConfigured()) return <TestimonialPage mode="unavailable" />;
  return <TestimonialPage mode="open" projects={testimonialProjects()} />;
}
