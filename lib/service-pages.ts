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
 * Página de nicho só com case real do setor, senão é promessa vazia
 * (23/out/2026). A primeira é a de arquitetos, com o ArqDoor (08/nov/2026).
 * Poucas e com conteúdo próprio: várias no mesmo modelo o Google trata como
 * spam (doorway, scaled content abuse).
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
  /** Página de nicho: só existe com case real do setor (ver o topo). */
  niche?: {
    /** Público, pro dado estruturado (audience). */
    audience: string;
    /** Pergunta que chama pra página nos links (case e página geral). */
    ask: string;
    /** Case do setor em lib/companies, mostrado como prova. */
    caseId: string;
    /** Por que dá pra confiar: o que o case mostra sobre o setor. */
    proof: string;
    /** O que o projeto tem pra esse público. */
    needs: { title: string; text: string }[];
    /** Perguntas do setor, somadas às comuns. */
    faq: { q: string; a: string }[];
  };
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
  // Nicho com case real (ArqDoor). Foco em site e portfólio, não em sistema:
  // sistema pra escritório concorreria com o ArqDoor, que é cliente (Vitor, 08/nov/2026).
  {
    slug: "site-para-arquitetos",
    noun: "um site para escritório de arquitetura",
    type: "site",
    name: "Site para escritório de arquitetura",
    lead: "Um site que mostra as suas obras do jeito que elas merecem: fotos grandes que abrem rápido no celular, projetos organizados por tipo e um caminho direto pro cliente pedir orçamento.",
    signs: [
      "O seu portfólio vive só no Instagram, e quem procura arquiteto no Google não te encontra.",
      "As fotos das obras são pesadas e o site atual demora pra abrir no celular.",
      "O cliente chega sem entender como você trabalha, e a primeira conversa vira explicação de processo.",
    ],
    niche: {
      audience: "Escritórios de arquitetura e arquitetos autônomos",
      ask: "Tem escritório de arquitetura?",
      caseId: "arqdoor",
      proof:
        "A gente construiu o ArqDoor, a plataforma de propostas, contratos e pagamentos para arquitetos, na web e no app publicado na loja. Foi um ano no dia a dia do arquiteto: como ele apresenta um projeto, fecha com o cliente e cobra.",
      needs: [
        {
          title: "Portfólio organizado",
          text: "As obras com fotos, tipo de projeto (residencial, comercial, interiores) e o desafio de cada uma.",
        },
        {
          title: "Fotos leves, sem perder qualidade",
          text: "As imagens são preparadas pra abrir rápido no celular, que é onde a maior parte dos clientes vai ver.",
        },
        {
          title: "Como você trabalha",
          text: "As etapas, do briefing à entrega do projeto, pro cliente chegar sabendo o que esperar.",
        },
        {
          title: "Contato que já qualifica",
          text: "WhatsApp e formulário que perguntam o que você precisa saber: tipo de projeto, cidade e prazo.",
        },
      ],
      faq: [
        {
          q: "Vocês já trabalharam com arquitetura?",
          a: "Sim. A gente construiu o ArqDoor, plataforma de propostas, contratos e pagamentos para arquitetos, na web e no celular. O case completo está na página do ArqDoor.",
        },
        {
          q: "Posso usar as fotos que já tenho das obras?",
          a: "Pode. A gente prepara o tamanho das imagens pra abrirem rápido sem perder qualidade. Se ainda não tiver fotos boas, vale fotografar as obras antes: o site depende delas.",
        },
        {
          q: "O Instagram não basta?",
          a: "O Instagram mostra o dia a dia, mas não aparece quando alguém procura arquiteto no Google, e as obras se perdem no meio dos posts. O site junta os projetos organizados num endereço seu.",
        },
      ],
    },
  },
];

/** Páginas de nicho de um tipo de serviço (pra linkar da página geral). */
export function nichePagesOf(type: string): ServicePage[] {
  return SERVICE_PAGES.filter((p) => p.niche && p.type === type);
}

/** Página de nicho que usa um case como prova (pra linkar da página do case). */
export function nichePageOfCase(caseId: string): ServicePage | null {
  return SERVICE_PAGES.find((p) => p.niche?.caseId === caseId) ?? null;
}

export function findServicePage(slug: string) {
  return SERVICE_PAGES.find((p) => p.slug === slug) ?? null;
}

/** Página do serviço de um tipo (pra linkar dos cards da home e do guia). */
export function servicePageHref(type: string): string | null {
  const page = SERVICE_PAGES.find((p) => p.type === type && !p.niche);
  return page ? `/servicos/${page.slug}` : null;
}
