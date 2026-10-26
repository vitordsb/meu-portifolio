import type { ProjectType } from "@/lib/projects-catalog";

/**
 * Páginas de cada serviço pro Google (/servicos/<slug>), em português (busca
 * do público brasileiro), como o /quanto-custa. Nada digitado à mão que possa
 * desencontrar do resto do site:
 * - preço e prazo saem de lib/guide/examples (tabela do orçamento com IA);
 * - "o que vem" é o mesmo do guia;
 * - projetos saem do catálogo (mesmo tipo dos cards de serviço da home);
 * - as respostas comuns repetem as Dúvidas da home.
 * Só os sinais de "é pra você" e a abertura são texto próprio de cada página.
 *
 * Este arquivo é leve (vai pro navegador pelos cards da home); a montagem
 * com preço e projetos fica em lib/service-pages-data, só no servidor.
 *
 * Sem página de nicho ("site pra arquiteto") por enquanto (23/out/2026): só
 * vale quando houver case real do nicho, senão é promessa vazia.
 */

export type ServicePage = {
  slug: string;
  type: ProjectType;
  /** Nome do serviço no h1 e no título da aba. */
  name: string;
  /** Com artigo, pras perguntas ("Quanto custa uma landing page?"). */
  noun: string;
  /** Abertura, logo abaixo do h1. */
  lead: string;
  /** "É pra você se...": situações do cliente, sem número inventado. */
  signs: string[];
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "landing-page",
    noun: "uma landing page",
    type: "landing",
    name: "Criação de landing page",
    lead: "Uma página feita pra vender: apresenta seu produto, serviço ou evento e transforma visita em contato no WhatsApp ou no formulário.",
    signs: [
      "Você anuncia no Instagram ou no Google e o contato não chega.",
      "Vai lançar um produto, serviço ou evento e quer uma página só dele.",
      "Precisa de um endereço pra pôr na bio e mandar pra quem pergunta.",
    ],
  },
  {
    slug: "criacao-de-site",
    noun: "um site para empresa",
    type: "site",
    name: "Criação de site para empresa",
    lead: "O site da sua empresa, rápido no celular e fácil de achar no Google: quem vocês são, o que fazem e como falar com vocês.",
    signs: [
      "Quem procura a sua empresa no Google não encontra nada, ou encontra o concorrente.",
      "O site atual é antigo, lento ou não abre direito no celular.",
      "Você quer mostrar serviços, trabalhos feitos e contato num lugar só.",
    ],
  },
  {
    slug: "sistema-sob-medida",
    noun: "um sistema sob medida",
    type: "sistema",
    name: "Sistema web sob medida",
    lead: "Um sistema feito pro jeito que a sua empresa trabalha: agenda, pedidos, estoque ou atendimento num lugar só, com login pra cada pessoa da equipe.",
    signs: [
      "Agenda, pedidos ou estoque vivem em planilha e grupo de WhatsApp.",
      "A equipe repete o mesmo trabalho em vários lugares e alguma coisa sempre se perde.",
      "Os sistemas prontos que você testou não fazem do jeito que a empresa precisa.",
    ],
  },
  {
    slug: "aplicativo",
    noun: "um aplicativo",
    type: "app",
    name: "Criação de aplicativo",
    lead: "Um app pra iPhone e Android, publicado nas lojas, com um painel web pra quem administra.",
    signs: [
      "Seus clientes fazem tudo pelo celular e esperam fazer com você também.",
      "Você quer avisar o cliente por notificação, não só por mensagem.",
      "A ideia precisa de recursos do celular, como câmera, localização ou uso fora da internet.",
    ],
  },
];

export function findServicePage(slug: string) {
  return SERVICE_PAGES.find((p) => p.slug === slug) ?? null;
}

/** Página do serviço de um tipo (pra linkar dos cards da home e do guia). */
export function servicePageHref(type: string): string | null {
  const page = SERVICE_PAGES.find((p) => p.type === type);
  return page ? `/servicos/${page.slug}` : null;
}
