import { COMPANIES } from "@/lib/companies";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { PROJECT_SHOTS } from "@/lib/project-shots";
import { BRAND } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `Case, ${BRAND.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ id: c.id }));
}

/** Prévia do link do case, com os prints quando o projeto tem os dois (desktop e celular em jpg). */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = COMPANIES.find((x) => x.id === id) ?? COMPANIES[0];
  const s = c.products.map((p) => (p.slug ? PROJECT_SHOTS[p.slug] : undefined)).find((x) => x?.desktop?.endsWith(".jpg") && x.mobile?.endsWith(".jpg"));
  return ogCard({
    label: "Case",
    title: c.name,
    subtitle: (c.headline ?? c.about).pt,
    cta: "Ver o case",
    shots: s ? { desktop: s.desktop!.slice(1), mobile: s.mobile!.slice(1) } : undefined,
  });
}
