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
  /** O que EU fiz lá. Sem nome de tecnologia: o card fala de entrega. */
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
    role: {
      pt: "Front-end do painel do produtor, da jornada do afiliado e dos checkouts editáveis, com foco em conversão.",
      en: "Front-end for the producer dashboard, the affiliate journey and the editable checkouts, focused on conversion.",
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
    role: {
      pt: "Área de membros de ponta a ponta: da interface à API, com planos, certificados, financeiro e academy.",
      en: "End-to-end members area: from interface to API, with plans, certificates, payouts and academy.",
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
    role: {
      pt: "Front-end do produto web e do app mobile: autenticação, área logada, propostas com PDF e o app na loja.",
      en: "Front-end for the web product and the mobile app: auth, logged-in area, PDF proposals and the app in the store.",
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
    role: {
      pt: "Full-stack: sistemas internos, site institucional e a estruturação da plataforma IoT, do app ao servidor.",
      en: "Full-stack: internal systems, the company website and the IoT platform structure, from app to server.",
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
