/**
 * Pacotes de preço fixo vendidos em /servicos.
 *
 * PROVISÓRIOS (02/out/2026): nomes, preços e conteúdo de exemplo, coerentes
 * com a tabela do orçamento com IA (landing ~R$ 700-800, site ~R$ 1.200-1.700).
 * Trocar pelos pacotes reais do Vitor.
 */

type L10n = { pt: string; en: string };

export type ServicePackage = {
  id: string;
  name: L10n;
  /** Até 30 caracteres: é o nome do item na página do Asaas. */
  checkoutName: string;
  price: number;
  /** Parcelas máximas no cartão (1 = só à vista). */
  maxInstallments: number;
  summary: L10n;
  includes: { pt: string[]; en: string[] };
  /** Destaque visual (um por vez). */
  featured?: boolean;
};

export const PACKAGES: ServicePackage[] = [
  {
    id: "consultoria",
    name: { pt: "Consultoria 1h", en: "1h consulting" },
    checkoutName: "Consultoria 1h",
    price: 150,
    maxInstallments: 1,
    summary: {
      pt: "Uma hora com um especialista pra destravar produto, código ou UX.",
      en: "One hour with a specialist to unblock product, code or UX.",
    },
    includes: {
      pt: [
        "Videochamada de 1 hora",
        "Revisão do que você mandar antes",
        "Próximos passos por escrito",
      ],
      en: [
        "1-hour video call",
        "Review of what you send beforehand",
        "Written next steps",
      ],
    },
  },
  {
    id: "revisao-ux",
    name: { pt: "Revisão de UI/UX", en: "UI/UX review" },
    checkoutName: "Revisão de UI/UX",
    price: 390,
    maxInstallments: 3,
    summary: {
      pt: "Raio-X das telas do seu site ou app, com o que mudar primeiro.",
      en: "An X-ray of your site or app screens, with what to fix first.",
    },
    includes: {
      pt: [
        "Análise de até 5 telas",
        "Relatório com melhorias priorizadas",
        "30 min de conversa pra explicar",
      ],
      en: [
        "Review of up to 5 screens",
        "Report with prioritized improvements",
        "30-min call to walk you through it",
      ],
    },
  },
  {
    id: "landing",
    name: { pt: "Landing page", en: "Landing page" },
    checkoutName: "Landing page",
    price: 790,
    maxInstallments: 6,
    featured: true,
    summary: {
      pt: "Uma página que apresenta seu produto e capta contatos.",
      en: "A page that presents your product and captures leads.",
    },
    includes: {
      pt: [
        "Página única, responsiva",
        "Formulário de contato ou WhatsApp",
        "Publicada no seu domínio",
        "Pronta em até 1 semana",
      ],
      en: [
        "Single responsive page",
        "Contact form or WhatsApp",
        "Published on your domain",
        "Ready within 1 week",
      ],
    },
  },
  {
    id: "site",
    name: { pt: "Site institucional", en: "Company website" },
    checkoutName: "Site institucional",
    price: 1490,
    maxInstallments: 10,
    summary: {
      pt: "O site da sua empresa, completo e fácil de atualizar.",
      en: "Your company website, complete and easy to update.",
    },
    includes: {
      pt: [
        "Até 5 páginas",
        "Textos editáveis por você",
        "SEO básico e Google Analytics",
        "Domínio e e-mail configurados",
      ],
      en: [
        "Up to 5 pages",
        "Text you can edit yourself",
        "Basic SEO and Google Analytics",
        "Domain and email set up",
      ],
    },
  },
];

export function findPackage(id: string) {
  return PACKAGES.find((p) => p.id === id) ?? null;
}
