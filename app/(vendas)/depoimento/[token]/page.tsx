import type { Metadata } from "next";
import TestimonialPage from "@/components/depoimentos/TestimonialPage";
import { blobConfigured, testimonialExists } from "@/lib/testimonials/store";
import { projectName } from "@/lib/testimonials/projects";
import { readRequestToken } from "@/lib/testimonials/token";

// O token é pessoal: fora do Google e sem guardar a página em cache
export const metadata: Metadata = {
  title: "Avalie o seu projeto",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

/** Link único gerado por `pnpm depoimento` (cliente verificado). */
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!blobConfigured()) return <TestimonialPage mode="unavailable" />;
  const request = readRequestToken(decodeURIComponent(token));
  if (!request || (await testimonialExists(request.id).catch(() => true))) {
    return <TestimonialPage mode="invalid" />;
  }
  return (
    <TestimonialPage
      mode="link"
      token={decodeURIComponent(token)}
      projectName={projectName(request.project)}
      name={request.name}
    />
  );
}
