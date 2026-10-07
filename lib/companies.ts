/**
 * Sessão "Experiência" da home: as empresas e os produtos que fiz em cada uma.
 *
 * Fixo no código (mock), sem banco nem /admin: a home é landing de marketing e
 * porta de entrada do ecossistema. Mexer aqui é mexer no que aparece.
 *
 * Ordem: o trabalho atual primeiro, o mais antigo por último (mesma linha do
 * tempo de "Conheça sobre mim"). Períodos informados pelo Vitor em 01/out/2026.
 *
 * Cada empresa pode ter mais de um produto (site e app, plataforma e site): o
 * card mostra abas e troca imagem e link entre eles. `kind` decide a moldura
 * (web = navegador, app = arte vertical) e o rótulo da aba.
 */

type L10n = { pt: string; en: string };

export type ProductKind = "web" | "app" | "site";

export type CompanyProduct = {
  title: string;
  kind: ProductKind;
  /** Link público. `null` = produto privado (aparece com cadeado). */
  link: string | null;
  /** Imagem em /public. `null` = sem print público. */
  cover: string | null;
};

export type Company = {
  id: string;
  name: string;
  /** Logo em /public/logos (aparece num selo branco, funciona nos 2 temas). */
  logo: string;
  /** Segmento, curto, em cima do nome. */
  sector: L10n;
  /** O que a empresa é. Sem stack: tecnologia mora em Especializações. */
  about: L10n;
  /** A situação do cliente antes: o card abre pelo problema (06/out/2026). */
  problem?: L10n;
  /** O que a gente fez (voz da empresa). Sem nome de tecnologia: o card fala
   *  de negócio, e a stack de cliente costuma ser privada. */
  role: L10n;
  /** Resultado mensurável, só se for real. Vazio = não aparece. */
  result?: L10n;
  period: string;
  products: CompanyProduct[];
};

export const COMPANIES: Company[] = [
  {
    id: "zuptos",
    name: "Zuptos",
    logo: "/logos/zuptos.svg",
    sector: { pt: "Infoprodutos", en: "Digital products" },
    about: {
      pt: "Plataforma de criação e venda de infoprodutos, com checkout próprio, painel do produtor e programa de afiliados.",
      en: "Platform for creating and selling digital products, with its own checkout, producer dashboard and affiliate program.",
    },
    problem: {
      pt: "Quem vende curso e produto digital perde venda a cada passo complicado no pagamento, e o produtor precisa enxergar suas vendas e seus afiliados sem depender de planilha.",
      en: "Creators selling courses and digital products lose sales at every confusing checkout step, and they need to see sales and affiliates without spreadsheets.",
    },
    role: {
      pt: "O painel do produtor, a jornada do afiliado e os checkouts que o próprio produtor edita, pensados pra vender mais.",
      en: "The creator dashboard, the affiliate journey and checkouts the creator can edit, built to sell more.",
    },
    period: "Jun/2026 - Hoje",
    products: [
      {
        title: "Zuptos",
        kind: "web",
        link: "https://app.zuptos.com.br",
        cover: "/projects/zuptos.png",
      },
    ],
  },
  {
    id: "mtc",
    name: "MTC Prop",
    logo: "/logos/mtc.png",
    sector: { pt: "Prop trading", en: "Prop trading" },
    about: {
      pt: "Mesa proprietária de trading. Os traders contratam planos e acompanham certificados, benefícios, financeiro e a academy numa área de membros.",
      en: "Proprietary trading firm. Traders subscribe to plans and follow certificates, benefits, payouts and the academy in a members area.",
    },
    problem: {
      pt: "Os traders acompanhavam plano, certificados, pagamentos e cursos em lugares diferentes, e cada dúvida virava mensagem pro suporte.",
      en: "Traders tracked plans, certificates, payouts and courses in different places, and every question turned into a support message.",
    },
    role: {
      pt: "Uma área de membros única, onde o trader vê tudo do próprio plano, do desenho das telas ao funcionamento por trás.",
      en: "A single members area where traders see everything about their plan, from screen design to everything behind it.",
    },
    period: "Abr/2026 - Hoje",
    products: [
      {
        title: "Área de Membros",
        kind: "web",
        link: "https://app.mtcprop.com.br",
        cover: "/projects/mtcprop-members.png",
      },
      {
        title: "Site",
        kind: "site",
        link: "https://mtcprop.com.br",
        cover: "/projects/mtcprop-site.png",
      },
    ],
  },
  {
    id: "arqdoor",
    name: "ArqDoor",
    logo: "/logos/arqdoor.png",
    sector: { pt: "SaaS para arquitetos", en: "SaaS for architects" },
    about: {
      pt: "Plataforma que formaliza a relação entre arquitetos e clientes: propostas, contratos em PDF, comunicação e pagamentos num lugar só, na web e no celular.",
      en: "Platform that formalizes the relationship between architects and clients: proposals, PDF contracts, messaging and payments in one place, on web and mobile.",
    },
    problem: {
      pt: "Arquitetos fechavam projetos na conversa, sem contrato, e tinham dificuldade de cobrar e de organizar a relação com o cliente.",
      en: "Architects closed projects verbally, without contracts, and struggled to get paid and keep the client relationship organized.",
    },
    role: {
      pt: "A plataforma inteira, no computador e no celular: propostas, contratos, conversas e pagamentos num lugar só, com o app publicado na loja.",
      en: "The whole platform, on desktop and mobile: proposals, contracts, messages and payments in one place, with the app published in the store.",
    },
    period: "Abr/2025 - Abr/2026",
    products: [
      {
        title: "ArqDoor",
        kind: "web",
        link: "https://arqdoor.com",
        cover: "/projects/arqdoor-web.jpg",
      },
      {
        title: "ArqDoor Mobile",
        kind: "app",
        link: "https://play.google.com/store/apps/details?id=com.arqdoor.app&hl=pt_BR",
        cover: "/projects/arqdoor-app.jpg",
      },
    ],
  },
  {
    id: "egp",
    name: "Grupo EGP",
    logo: "/logos/egp.png",
    sector: { pt: "Segurança eletrônica", en: "Electronic security" },
    about: {
      pt: "Fabricante de equipamentos eletrônicos de segurança, como alarmes, portões e fechaduras, com plataforma IoT própria pra controle remoto.",
      en: "Manufacturer of electronic security equipment such as alarms, gates and locks, with its own IoT platform for remote control.",
    },
    problem: {
      pt: "O fabricante precisava que os clientes controlassem alarmes e portões à distância, e os processos internos ainda dependiam de controles manuais.",
      en: "The manufacturer needed customers to control alarms and gates remotely, and internal processes still relied on manual controls.",
    },
    role: {
      pt: "Os sistemas internos, o site da empresa e a estrutura da plataforma de controle à distância, do aplicativo ao servidor.",
      en: "The internal systems, the company website and the structure of the remote-control platform, from the app to the server.",
    },
    period: "Jan/2022 - Dez/2023",
    products: [
      {
        title: "Plataforma IoT de Segurança",
        kind: "app",
        link: null,
        cover: null,
      },
      {
        title: "Site",
        kind: "site",
        link: "https://www.grupoegp.com.br",
        cover: "/projects/egp-industria.png",
      },
    ],
  },
];
