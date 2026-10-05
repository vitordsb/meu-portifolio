import { priceScope } from "@/lib/estimate/pricing";
import type { Scope } from "@/lib/estimate/scope";

/**
 * Projetos típicos do guia "Quanto custa um site ou app". O preço NÃO é
 * digitado: sai da mesma tabela do orçamento com IA (lib/estimate/pricing.ts),
 * então o guia nunca contradiz o orçamento e acompanha qualquer mudança de
 * preço automaticamente.
 */

const BASE: Scope = {
  resumo: "",
  tipo: "site",
  plataformas: { web: true, mobile: false },
  design: "do_zero",
  funcionalidades: [],
  integracoes: [],
  escala: "regional",
  fase: "planejado",
  login: false,
  painel_admin: false,
  urgente: false,
  prazo: "normal",
  referencias: "nenhuma",
  investimento_max: null,
  pagamento_preferido: "nao_disse",
  pediu_desconto: false,
  confianca: "alta",
};

export type GuideExample = {
  id: string;
  title: string;
  /** O que esse tipo de projeto resolve, em uma frase. */
  forWho: string;
  includes: string[];
  min: number;
  max: number;
  weeksMin: number;
  weeksMax: number;
};

const DEFS: {
  id: string;
  title: string;
  forWho: string;
  includes: string[];
  scope: Partial<Scope>;
}[] = [
  {
    id: "landing",
    title: "Landing page",
    forWho:
      "Uma página só, pra apresentar um produto, serviço ou evento e captar contatos.",
    includes: [
      "Página única e responsiva",
      "Formulário ou botão de WhatsApp",
      "Design próprio",
      "Publicada no seu domínio",
    ],
    scope: {
      tipo: "landing",
      funcionalidades: [
        { nome: "Formulário de contato", complexidade: "simples" },
      ],
      integracoes: ["WhatsApp"],
    },
  },
  {
    id: "site",
    title: "Site institucional",
    forWho:
      "O site da empresa: quem vocês são, o que fazem e como falar com vocês.",
    includes: [
      "Até 5 páginas",
      "Formulário e WhatsApp",
      "Galeria ou portfólio",
      "SEO básico pro Google",
    ],
    scope: {
      tipo: "site",
      funcionalidades: [
        { nome: "Páginas institucionais", complexidade: "simples" },
        { nome: "Formulário de contato", complexidade: "simples" },
        { nome: "Galeria de serviços", complexidade: "simples" },
      ],
      integracoes: ["WhatsApp"],
    },
  },
  {
    id: "loja",
    title: "Loja virtual",
    forWho: "Vender pela internet com catálogo, carrinho e pagamento online.",
    includes: [
      "Catálogo e carrinho",
      "Pagamento com Pix e cartão",
      "Login de clientes",
      "Painel pra gerenciar pedidos",
    ],
    scope: {
      tipo: "ecommerce",
      funcionalidades: [
        { nome: "Catálogo de produtos", complexidade: "media" },
        { nome: "Carrinho e checkout", complexidade: "media" },
        { nome: "Acompanhamento de pedidos", complexidade: "simples" },
      ],
      integracoes: ["Gateway de pagamento", "Cálculo de frete"],
      login: true,
      painel_admin: true,
    },
  },
  {
    id: "sistema",
    title: "Sistema web sob medida",
    forWho:
      "Organizar um processo da empresa: agenda, pedidos, estoque, atendimento.",
    includes: [
      "Telas feitas pro seu processo",
      "Login com níveis de acesso",
      "Painel administrativo",
      "Relatórios",
    ],
    scope: {
      tipo: "sistema_web",
      funcionalidades: [
        { nome: "Cadastros", complexidade: "simples" },
        { nome: "Fluxo principal do processo", complexidade: "media" },
        { nome: "Relatórios", complexidade: "media" },
      ],
      login: true,
      painel_admin: true,
    },
  },
  {
    id: "app",
    title: "Aplicativo de celular",
    forWho: "Um app pra iPhone e Android, com painel web pra quem administra.",
    includes: [
      "App iOS e Android",
      "Painel web de gestão",
      "Login de usuários",
      "Pagamento ou notificações",
    ],
    scope: {
      tipo: "app_mobile",
      plataformas: { web: true, mobile: true },
      funcionalidades: [
        { nome: "Fluxo principal do app", complexidade: "media" },
        { nome: "Perfil do usuário", complexidade: "simples" },
        { nome: "Pagamento no app", complexidade: "media" },
      ],
      integracoes: ["Gateway de pagamento", "WhatsApp"],
      login: true,
      painel_admin: true,
    },
  },
];

export const GUIDE_EXAMPLES: GuideExample[] = DEFS.map((d) => {
  const { estimate } = priceScope({ ...BASE, ...d.scope });
  return {
    id: d.id,
    title: d.title,
    forWho: d.forWho,
    includes: d.includes,
    min: estimate.min,
    max: estimate.max,
    weeksMin: estimate.weeksMin,
    weeksMax: estimate.weeksMax,
  };
});
