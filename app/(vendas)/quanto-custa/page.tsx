import type { Metadata } from "next";
import PriceGuide, {
  GUIDE_ANSWER,
  GUIDE_FAQ,
} from "@/components/guide/PriceGuide";
import { SITE_URL, OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quanto custa um site ou aplicativo em 2026? | Vitor de Souza",
  description: GUIDE_ANSWER,
  alternates: { canonical: "/quanto-custa" },
  openGraph: {
    ...OG_BASE,
    title: "Quanto custa um site ou aplicativo em 2026?",
    description: GUIDE_ANSWER,
    url: `${SITE_URL}/quanto-custa`,
    type: "article",
  },
};

/** Perguntas frequentes no formato que o Google mostra nos resultados. */
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GUIDE_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Quanto custa um site ou aplicativo em 2026?",
  description: GUIDE_ANSWER,
  dateModified: new Date().toISOString(),
  inLanguage: "pt-BR",
  author: { "@id": `${SITE_URL}/#vitor` },
  mainEntityOfPage: `${SITE_URL}/quanto-custa`,
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqLd, articleLd]) }}
      />
      <PriceGuide />
    </>
  );
}
