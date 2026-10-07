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
  { id: "problemas", label: { pt: "Isso acontece?", en: "Sound familiar?" } },
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
  /** Nomeia o aperto do cliente (Jobs to be Done) antes de prometer. */
  lead: {
    pt: "Seu negócio perde cliente com site lento ou pedido perdido no WhatsApp? A gente resolve, com preço combinado antes de começar.",
    en: "Losing customers to a slow website or orders lost in WhatsApp? We fix it, with the price agreed before we start.",
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
    text: { pt: "Anuncia e não recebe contato? Uma página feita pra vender.", en: "Running ads but getting no leads? One page built to sell." },
  },
  {
    id: "site",
    title: { pt: "Site da empresa", en: "Company website" },
    text: { pt: "Ninguém te encontra no Google? Um site que mostra quem você é.", en: "Nobody finds you on Google? A site that shows who you are." },
  },
  {
    id: "loja",
    title: { pt: "Loja virtual", en: "Online store" },
    text: { pt: "Quer vender sem depender de marketplace? Loja com Pix e cartão.", en: "Want to sell without relying on marketplaces? A store with Pix and card." },
  },
  {
    id: "sistema",
    title: { pt: "Sistema sob medida", en: "Custom system" },
    text: { pt: "Agenda, pedidos e estoque espalhados? Tudo num lugar só.", en: "Bookings, orders and stock all over the place? All in one place." },
  },
  {
    id: "app",
    title: { pt: "Aplicativo de celular", en: "Mobile app" },
    text: { pt: "Seus clientes vivem no celular? App pra iPhone e Android.", en: "Your customers live on their phones? An app for iPhone and Android." },
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

/**
 * "Isso acontece com você?": os apertos que trazem o cliente (Jobs to be
 * Done) e o medo de contratar. Cada um aponta pra saída certa no site.
 */
export const PROBLEMS: { id: string; title: L10n; text: L10n; cta: L10n; href: string }[] = [
  {
    id: "site",
    title: { pt: "Seu site não traz clientes", en: "Your website brings no customers" },
    text: {
      pt: "Lento no celular, não aparece no Google ou nem existe ainda. O cliente procura e acha o concorrente.",
      en: "Slow on mobile, missing from Google or not there at all. Customers search and find your competitor.",
    },
    cta: { pt: "Fazer o Raio-X grátis", en: "Get the free site check" },
    href: "/raio-x",
  },
  {
    id: "operacao",
    title: { pt: "Pedidos e agenda no WhatsApp e na planilha", en: "Orders and bookings in WhatsApp and spreadsheets" },
    text: {
      pt: "Informação espalhada, retrabalho e cliente esperando resposta. Quanto mais cresce, mais se perde.",
      en: "Scattered information, rework and customers waiting for answers. The more you grow, the more you lose.",
    },
    cta: { pt: "Ver o que dá pra organizar", en: "See what we can organize" },
    href: "#servicos",
  },
  {
    id: "medo",
    title: { pt: "Medo de contratar e se arrepender", en: "Afraid of hiring and regretting it" },
    text: {
      pt: "Preço que muda no meio, prazo que estoura e quem faz some. Aqui o valor é combinado antes e você aprova cada etapa.",
      en: "Prices that change midway, deadlines that slip, developers who vanish. Here the price is agreed upfront and you approve every stage.",
    },
    cta: { pt: "Ver como funciona", en: "See how it works" },
    href: "#como-funciona",
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
