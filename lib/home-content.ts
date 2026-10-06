/**
 * Conteúdo da home "de empresa" (rolagem vertical, desde 06/out/2026).
 *
 * Modelo: estúdio liderado pelo fundador. A marca fala como empresa
 * (serviços, projetos entregues, processo, garantias) e o Vitor aparece como
 * fundador em "Quem faz". Pouco texto de propósito: o público inclui gente
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
  { id: "servicos", label: { pt: "Serviços", en: "Services" }, aliases: ["especializacoes"] },
  { id: "projetos", label: { pt: "Projetos", en: "Projects" }, aliases: ["experiencia"] },
  { id: "como-funciona", label: { pt: "Como funciona", en: "How it works" } },
  { id: "sobre", label: { pt: "Quem faz", en: "Who builds it" }, aliases: ["trajetoria", "cursos", "tecnologias"] },
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

export const FOUNDER = {
  name: "Vitor de Souza",
  role: { pt: "Fundador e desenvolvedor", en: "Founder and developer" },
  bio: {
    pt: "Engenheiro de software há mais de 5 anos, do design ao código. Você fala direto comigo, do primeiro contato à entrega.",
    en: "Software engineer for 5+ years, from design to code. You talk to me directly, from the first contact to delivery.",
  },
};
