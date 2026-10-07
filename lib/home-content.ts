/**
 * Conteúdo da home "de empresa" (rolagem vertical, desde 06/out/2026).
 *
 * A marca fala como empresa (serviços, projetos entregues, processo,
 * garantias). Desde 06/out/2026 o site não mostra o Vitor como pessoa: a
 * sessão "Quem faz" saiu. Pouco texto de propósito: o público inclui gente
 * mais velha, que lê melhor frase curta com ícone.
 *
 * Preços NÃO moram aqui: saem de lib/guide/examples (mesma tabela do
 * orçamento com IA) e chegam por props, calculados no servidor.
 *
 * A home antiga (deck de sessões) segue em components/deck: pra voltar, troque
 * o componente em app/page.tsx.
 */

type L10n = { pt: string; en: string };

/** Sessões da página, na ordem. `aliases` são os # da home antiga (deck):
 *  links velhos (/#experiencia, busca, e-mails) continuam caindo no lugar. */
export const HOME_SECTIONS: { id: string; label: L10n; aliases?: string[] }[] = [
  { id: "inicio", label: { pt: "Início", en: "Home" } },
  { id: "servicos", label: { pt: "Serviços", en: "Services" }, aliases: ["especializacoes", "tecnologias"] },
  { id: "formatos", label: { pt: "Equipe", en: "Team" } },
  { id: "projetos", label: { pt: "Projetos", en: "Projects" }, aliases: ["experiencia", "trajetoria", "cursos"] },
  { id: "como-funciona", label: { pt: "Como funciona", en: "How it works" } },
  { id: "duvidas", label: { pt: "Dúvidas", en: "FAQ" } },
];

export const HOME_HERO = {
  title: {
    pt: "Sites, sistemas e aplicativos para a sua empresa crescer.",
    en: "Websites, systems and apps to help your business grow.",
  },
  lead: {
    pt: "Do desenho ao ar, com preço combinado antes de começar e atendimento direto com quem desenvolve.",
    en: "From design to launch, with the price agreed before we start and direct contact with the person who builds it.",
  },
};

/** Selos de confiança logo abaixo do banner. */
export const TRUST = [
  { key: "clients", label: { pt: "empresas atendidas", en: "companies served" } },
  { key: "contract", label: { pt: "Contrato e nota fiscal", en: "Contract and invoice" } },
  { key: "price", label: { pt: "Preço combinado antes", en: "Price agreed upfront" } },
] as const;

/** Tipos de projeto. O id é o mesmo de lib/guide/examples (preço e prazo). */
export const SERVICE_TYPES: { id: string; title: L10n; text: L10n }[] = [
  {
    id: "landing",
    title: { pt: "Landing page", en: "Landing page" },
    text: { pt: "Uma página pra vender um produto ou captar contatos.", en: "One page to sell a product or capture leads." },
  },
  {
    id: "site",
    title: { pt: "Site da empresa", en: "Company website" },
    text: { pt: "Mostre quem você é e seja encontrado no Google.", en: "Show who you are and get found on Google." },
  },
  {
    id: "loja",
    title: { pt: "Loja virtual", en: "Online store" },
    text: { pt: "Venda pela internet com Pix e cartão.", en: "Sell online with Pix and card." },
  },
  {
    id: "sistema",
    title: { pt: "Sistema sob medida", en: "Custom system" },
    text: { pt: "Agenda, pedidos, estoque e relatórios num lugar só.", en: "Bookings, orders, stock and reports in one place." },
  },
  {
    id: "app",
    title: { pt: "Aplicativo de celular", en: "Mobile app" },
    text: { pt: "Para iPhone e Android, publicado nas lojas.", en: "For iPhone and Android, published in the stores." },
  },
];

/** Formatos de contratação: de 1 a 5 pessoas, preço fechado pela equipe. */
export const ENGAGEMENTS: {
  id: string;
  kicker: L10n;
  title: L10n;
  text: L10n;
  checks: L10n[];
  featured?: boolean;
}[] = [
  {
    id: "especialista",
    kicker: { pt: "1 pessoa no seu time", en: "1 person on your team" },
    title: { pt: "Especialista dedicado", en: "Dedicated specialist" },
    text: {
      pt: "Um desenvolvedor dedicado pra destravar o que está parado ou cobrir uma área que falta no seu time.",
      en: "A dedicated developer to unblock what's stuck or cover a skill your team is missing.",
    },
    checks: [
      { pt: "Perfil certo pra necessidade", en: "The right profile for the need" },
      { pt: "Trabalha no seu ritmo e ferramentas", en: "Works in your flow and tools" },
      { pt: "Acompanhamento das entregas", en: "Delivery follow-up" },
    ],
  },
  {
    id: "equipe",
    featured: true,
    kicker: { pt: "De 2 a 5 profissionais", en: "From 2 to 5 professionals" },
    title: { pt: "Equipe sob medida", en: "Tailored team" },
    text: {
      pt: "Montamos a equipe com desenvolvimento, design, back-end e testes, do tamanho que o projeto pede. Preço fechado pela equipe necessária.",
      en: "We build the team with development, design, back-end and testing, sized to the project. Fixed price for the team it needs.",
    },
    checks: [
      { pt: "Equipe ajustável ao projeto", en: "Team adjusted to the project" },
      { pt: "Prioridades sempre visíveis", en: "Priorities always visible" },
      { pt: "Entregas curtas com demonstração", en: "Short cycles with demos" },
    ],
  },
  {
    id: "completo",
    kicker: { pt: "Da ideia ao ar", en: "From idea to launch" },
    title: { pt: "Projeto completo", en: "Full project" },
    text: {
      pt: "Cuidamos de tudo: entender o problema, desenhar, desenvolver, testar, publicar e evoluir depois do lançamento.",
      en: "We handle everything: understanding the problem, design, development, testing, launch and evolution.",
    },
    checks: [
      { pt: "Gestão de ponta a ponta", en: "End-to-end management" },
      { pt: "Publicação e servidores", en: "Launch and servers" },
      { pt: "Evolução depois do lançamento", en: "Evolution after launch" },
    ],
  },
];

export const PROCESS: { title: L10n; text: L10n }[] = [
  {
    title: { pt: "Conversa", en: "Talk" },
    text: { pt: "Você conta a ideia pelo WhatsApp, por vídeo ou no orçamento guiado.", en: "Tell us the idea on WhatsApp, by video or in the guided quote." },
  },
  {
    title: { pt: "Proposta", en: "Proposal" },
    text: { pt: "Escopo, prazo e valor combinados por escrito antes de começar.", en: "Scope, timeline and price agreed in writing before we start." },
  },
  {
    title: { pt: "Construção", en: "Build" },
    text: { pt: "Entregas por etapa: você vê e aprova cada parte.", en: "Delivered in stages: you see and approve each part." },
  },
  {
    title: { pt: "No ar", en: "Launch" },
    text: { pt: "Publicação no seu domínio e ajustes finais junto com você.", en: "Published on your domain, with final tweaks together." },
  },
];

export const GUARANTEES: L10n[] = [
  { pt: "Empresa com CNPJ ativo", en: "Registered company (CNPJ)" },
  { pt: "Contrato e nota fiscal", en: "Contract and invoice" },
  { pt: "Pix, boleto ou cartão", en: "Pix, bank slip or card" },
  { pt: "Atendimento direto com quem desenvolve", en: "Direct contact with the developer" },
];
