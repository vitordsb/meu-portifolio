import { SOCIALS } from "@/lib/deck-content";
import { PACKAGES } from "@/lib/payments/packages";
import { SITE_URL } from "@/lib/site";

/**
 * Dados estruturados (schema.org) pro Google entender quem é o Vitor e o que
 * ele vende: pessoa + prestador de serviço com os pacotes e preços de
 * /servicos. Os preços saem de PACKAGES, então nunca divergem da página.
 */

const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;
const prices = PACKAGES.map((p) => p.price);

const PERSON_ID = `${SITE_URL}/#vitor`;
const BUSINESS_ID = `${SITE_URL}/#servicos`;

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Vitor de Souza Barreto",
  alternateName: "Vitor de Souza",
  jobTitle: "Engenheiro de Software",
  url: SITE_URL,
  sameAs: [SOCIALS.linkedin, SOCIALS.github],
  knowsAbout: [
    "Desenvolvimento web",
    "Criação de sites",
    "Landing pages",
    "UI/UX",
    "React",
    "Next.js",
    "Node.js",
    "Aplicativos mobile",
  ],
};

const business = {
  "@type": "ProfessionalService",
  "@id": BUSINESS_ID,
  name: "Vitor de Souza · Desenvolvimento de software",
  description:
    "Criação de sites, landing pages, sistemas web e apps, do design ao deploy. Orçamento com IA em 2 minutos e serviços com preço fechado.",
  url: `${SITE_URL}/servicos`,
  founder: { "@id": PERSON_ID },
  areaServed: { "@type": "Country", name: "Brasil" },
  availableLanguage: ["pt-BR", "en"],
  // "+" no fim: projeto sob medida (orçamento com IA) passa do maior pacote
  priceRange: `${brl(Math.min(...prices))} - ${brl(Math.max(...prices))}+`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    url: SOCIALS.whatsapp,
    availableLanguage: ["Portuguese", "English"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços com preço fechado",
    itemListElement: PACKAGES.map((p) => ({
      "@type": "Offer",
      price: p.price,
      priceCurrency: "BRL",
      url: `${SITE_URL}/servicos`,
      itemOffered: {
        "@type": "Service",
        name: p.name.pt,
        description: p.summary.pt,
      },
    })),
  },
};

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [person, business],
  };
  return (
    <script
      type="application/ld+json"
      // "<" escapado: um texto com </script> não fecha a tag antes da hora
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
