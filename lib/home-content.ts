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

/** Tipos de projeto. O id é o mesmo de lib/guide/examples (preço e prazo).
 *  Loja virtual saiu dos cards em 06/out/2026 (pedido do Vitor). */
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

/**
 * Formatos de contratação: de 1 a 5 pessoas, preço fechado pela equipe.
 * Sem lista de checks (pedido do Vitor, 06/out/2026): o individual apresenta
 * o Vitor, a equipe mostra as funções e o projeto completo, o escopo maior.
 */
export const ENGAGEMENTS: {
  id: string;
  title: L10n;
  /** Linha logo abaixo do título (nunca acima: regra de 06/out/2026). */
  subtitle: L10n;
  text: L10n;
  /** Funções da equipe ou partes do escopo, em etiquetas. */
  tags?: L10n[];
  /** Card do especialista: mostra a foto e o nome do Vitor. */
  person?: { name: string; role: L10n };
  featured?: boolean;
}[] = [
  {
    id: "especialista",
    title: { pt: "Especialista dedicado", en: "Dedicated specialist" },
    subtitle: { pt: "1 pessoa no seu time", en: "1 person on your team" },
    person: {
      name: "Vitor de Souza",
      role: { pt: "UI/UX designer e engenheiro de software", en: "UI/UX designer and software engineer" },
    },
    text: {
      pt: "Mais de 5 anos desenhando e construindo produtos digitais. Entra no seu time pra destravar o que está parado ou cobrir o que falta, do design ao código.",
      en: "5+ years designing and building digital products. Joins your team to unblock what's stuck or cover what's missing, from design to code.",
    },
  },
  {
    id: "equipe",
    featured: true,
    title: { pt: "Equipe sob medida", en: "Tailored team" },
    subtitle: { pt: "De 2 a 5 profissionais", en: "From 2 to 5 professionals" },
    text: {
      pt: "A equipe do tamanho que o projeto pede, com preço fechado pelas pessoas necessárias.",
      en: "A team sized to the project, with a fixed price for the people it needs.",
    },
    tags: [
      { pt: "Product Manager", en: "Product Manager" },
      { pt: "UX Designer", en: "UX Designer" },
      { pt: "Software Engineer", en: "Software Engineer" },
      { pt: "Cyber Security", en: "Cyber Security" },
      { pt: "SEO e marketing", en: "SEO and marketing" },
    ],
  },
  {
    id: "completo",
    title: { pt: "Projeto completo", en: "Full project" },
    subtitle: { pt: "Um escopo maior, de ponta a ponta", en: "A bigger scope, end to end" },
    text: {
      pt: "A gente assume o produto inteiro: das primeiras decisões à evolução depois do lançamento.",
      en: "We take on the whole product: from the first decisions to evolving it after launch.",
    },
    tags: [
      { pt: "Arquitetura", en: "Architecture" },
      { pt: "Decisão de produto", en: "Product decisions" },
      { pt: "Design e pesquisa", en: "Design and research" },
      { pt: "Desenvolvimento", en: "Development" },
      { pt: "Manutenção e evolução", en: "Maintenance and evolution" },
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
