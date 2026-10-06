import { SOCIALS } from "@/lib/deck-content";
import { PACKAGES } from "@/lib/payments/packages";
import { BRAND, CNPJ, SITE_URL } from "@/lib/site";

/**
 * Dados estruturados (schema.org) pro Google entender a empresa e o que ela
 * vende: prestador de serviço com os pacotes e preços de /servicos. Sem a
 * pessoa do Vitor desde 06/out/2026 (o site fala como empresa). Os preços saem de PACKAGES, então nunca divergem da página.
 */

const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;
const prices = PACKAGES.map((p) => p.price);

const BUSINESS_ID = `${SITE_URL}/#servicos`;

const business = {
  "@type": "ProfessionalService",
  "@id": BUSINESS_ID,
  name: BRAND.name,
  alternateName: `${BRAND.name} · ${BRAND.descriptor.pt}`,
  taxID: CNPJ,
  email: BRAND.email,
  description:
    "Criação de sites, landing pages, sistemas web e apps, do design ao deploy. Orçamento com IA em 2 minutos e serviços com preço fechado.",
  url: SITE_URL,
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
    "@graph": [business],
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
