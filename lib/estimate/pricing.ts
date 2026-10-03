import type { Estimate, PaymentOption, Scope } from "./scope";

/**
 * As métricas do Vitor. A IA nunca vê este arquivo: ela só descreve o projeto
 * (`scope.ts`) e o valor sai daqui, sempre igual pro mesmo escopo.
 *
 * Calibrado pra GERAR LEAD, não pra pagar a hora cheia (decisão do Vitor em
 * 01/out/2026): o valor tem que ser atrativo o bastante pra pessoa deixar o
 * contato; o fechamento é negociado depois. Histórico do app de agendamento
 * de exemplo: R$ 39,5 a 60,5 mil (R$ 120/h) -> 12,5 a 18,5 mil (R$ 70/h) ->
 * hoje R$ 4,6 a 6,5 mil.
 */
export const PRICING = {
  /** R$ por hora de trabalho. */
  hourlyRate: 45,

  /** Nenhum orçamento sai abaixo disso (R$). */
  minimumProject: 700,

  /** Horas de base por tipo: setup, deploy, QA, reuniões, ajustes finais. */
  baseHours: {
    landing: 8,
    site: 14,
    sistema_web: 24,
    app_mobile: 28,
    ecommerce: 30,
    saas: 38,
    outro: 20,
  } satisfies Record<Scope["tipo"], number>,

  /** Horas por funcionalidade, pela complexidade. */
  featureHours: { simples: 4, media: 9, complexa: 18 },

  /** Cada integração (pagamento, WhatsApp, ERP, API de terceiro...). */
  integrationHours: 6,

  /** Cadastro/login de usuários. */
  loginHours: 6,

  /** Painel administrativo. */
  adminHours: 12,

  /** Multiplicador pelo estado do design (UI/UX é o meu forte: do zero custa). */
  designFactor: { pronto: 1, referencias: 1.05, do_zero: 1.1 },

  /** Web e app juntos: a segunda plataforma soma esta fração do total. */
  secondPlatformFactor: 0.3,

  /** Alcance: internacional pede multi-idioma, moeda, fuso e mais cuidado
   *  com infraestrutura. */
  scaleFactor: { regional: 1, nacional: 1, internacional: 1.1 },

  /** Prazo apertado. */
  rushFactor: 1.1,

  /**
   * Faixa em torno do valor central. Confiança baixa (conversa vaga) abre o
   * teto, porque o risco de aparecer escopo novo é maior.
   */
  spread: {
    low: 0.85,
    high: { alta: 1.1, media: 1.2, baixa: 1.3 },
  } satisfies { low: number; high: Record<Scope["confianca"], number> },

  /** Horas produtivas por semana dedicadas ao projeto (pro prazo). */
  hoursPerWeek: 30,

  /**
   * Descontos automáticos (decisão do Vitor, 03/out/2026). Cada parte vai
   * até 5%, e a soma nunca passa de 15%. O cliente não vê o motivo: o
   * detalhe vai só no e-mail do Vitor.
   * - referências concretas (imagens, layout, briefing): o trabalho diminui
   * - prazo flexível: o Vitor encaixa com calma
   * - negociação: pediu desconto ou paga à vista
   * - orçamento: se o cliente pode investir menos que a faixa, usa o que
   *   sobrar do teto (e o prazo estica). Nunca SOBE porque ele pode pagar mais.
   */
  discounts: {
    referenciasMuitas: 0.05,
    referenciasAlgumas: 0.025,
    prazoFlexivel: 0.05,
    negociacao: 0.05,
    teto: 0.15,
  },

  /** Prazo flexível: entrega mais espaçada (é o que barateia). */
  flexibleWeeksFactor: 1.4,

  /** Formas de pagamento por faixa (pelo mínimo da faixa, já com desconto). */
  payment: {
    /** Abaixo disto: só 50% na aprovação + 50% na entrega. */
    onlySplitBelow: 1500,
    /** A partir disto: 3x e 4x no boleto, Pix por contrato. */
    installmentsFrom: 3000,
    /** Acréscimo no boleto em 4x (3x é sem acréscimo). */
    fourXSurcharge: 0.05,
  },

  /** Arredonda pra este múltiplo (R$): de 100 em 100 nos projetos pequenos
   *  (R$ 900 parece preço; R$ 1.000 parece chute), de 500 em 500 acima. */
  roundTo: { small: 100, large: 500, threshold: 5000 },
} as const;

function roundPrice(value: number) {
  const { small, large, threshold } = PRICING.roundTo;
  const step = value < threshold ? small : large;
  return Math.max(step, Math.round(value / step) * step);
}

const brlFmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const money = (n: number) => brlFmt.format(n);

/** Formas de pagamento da faixa, com as contas feitas (pelo mínimo). */
export function paymentOptions(min: number): PaymentOption[] {
  const p = PRICING.payment;
  const half = money(Math.round(min / 2));
  const split: PaymentOption = {
    id: "entrada_entrega",
    label: { pt: "50% + 50%", en: "50% + 50%" },
    detail: {
      pt: `A partir de ${half} na aprovação e ${half} na entrega`,
      en: `From ${half} on approval and ${half} on delivery`,
    },
  };
  if (min < p.onlySplitBelow) return [split];

  if (min < p.installmentsFrom) {
    return [
      split,
      {
        id: "boleto_2x",
        label: { pt: "2x no boleto", en: "2x bank slip" },
        detail: {
          pt: `A partir de 2x de ${half}, sem acréscimo`,
          en: `From 2x ${half}, no surcharge`,
        },
      },
    ];
  }

  const three = money(Math.round(min / 3));
  const four = money(Math.round((min * (1 + p.fourXSurcharge)) / 4));
  return [
    split,
    {
      id: "boleto_3x",
      label: { pt: "3x no boleto", en: "3x bank slip" },
      detail: {
        pt: `A partir de 3x de ${three}, sem acréscimo`,
        en: `From 3x ${three}, no surcharge`,
      },
    },
    {
      id: "boleto_4x",
      label: { pt: "4x no boleto", en: "4x bank slip" },
      detail: {
        pt: `A partir de 4x de ${four} (+${Math.round(p.fourXSurcharge * 100)}%)`,
        en: `From 4x ${four} (+${Math.round(p.fourXSurcharge * 100)}%)`,
      },
    },
    {
      id: "pix_contrato",
      label: { pt: "Pix em etapas", en: "Pix in milestones" },
      detail: {
        pt: "Pagamentos por entrega, combinados em contrato",
        en: "Payments per milestone, agreed in a contract",
      },
    },
  ];
}

/** O que só o Vitor vê: por que o valor ficou assim. */
export type PricingNotes = {
  /** Desconto total aplicado (0 a 0,15). */
  discount: number;
  parts: {
    referencias: number;
    prazo: number;
    negociacao: number;
    orcamento: number;
  };
  /** Faixa ainda acima do que o cliente disse que pode investir. */
  budgetGap: boolean;
};

export function priceScope(
  scope: Scope,
  signals: { images?: number } = {},
): { estimate: Estimate; notes: PricingNotes } {
  const p = PRICING;
  const d = p.discounts;

  let hours = p.baseHours[scope.tipo];
  for (const f of scope.funcionalidades)
    hours += p.featureHours[f.complexidade];
  hours += scope.integracoes.length * p.integrationHours;
  if (scope.login) hours += p.loginHours;
  if (scope.painel_admin) hours += p.adminHours;

  hours *= p.designFactor[scope.design];
  hours *= p.scaleFactor[scope.escala];
  if (scope.plataformas.web && scope.plataformas.mobile) {
    hours *= 1 + p.secondPlatformFactor;
  }

  const rush = scope.urgente || scope.prazo === "urgente";
  const flexible = !rush && scope.prazo === "flexivel";

  // ── Descontos (só pra baixo, teto de 15%) ──────────────────────────────
  const images = signals.images ?? 0;
  const referencias =
    images >= 2 || scope.referencias === "muitas" || scope.design === "pronto"
      ? d.referenciasMuitas
      : images === 1 || scope.referencias === "algumas"
        ? d.referenciasAlgumas
        : 0;
  const prazo = flexible ? d.prazoFlexivel : 0;
  const negociacao =
    scope.pediu_desconto || scope.pagamento_preferido === "a_vista"
      ? d.negociacao
      : 0;
  let discount = Math.min(d.teto, referencias + prazo + negociacao);

  let central =
    hours * p.hourlyRate * (rush ? p.rushFactor : 1) * (1 - discount);

  // Orçamento do cliente abaixo da faixa: usa o que sobra do teto
  let orcamento = 0;
  const budget = scope.investimento_max;
  if (budget && budget < central * p.spread.low) {
    const room = d.teto - discount;
    const wanted = 1 - budget / (central * p.spread.low);
    orcamento = Math.max(0, Math.min(room, wanted));
    discount += orcamento;
    central *= 1 - orcamento;
  }

  const min = roundPrice(Math.max(p.minimumProject, central * p.spread.low));
  const max = Math.max(
    roundPrice(min * 1.15),
    roundPrice(central * p.spread.high[scope.confianca]),
  );

  // Urgência encurta o prazo (é por isso que custa mais); prazo flexível ou
  // ajuste pelo orçamento espaçam a entrega (é por isso que barateia).
  const stretch = flexible || orcamento > 0 ? p.flexibleWeeksFactor : 1;
  const weeklyPace = (p.hoursPerWeek * (rush ? 1.4 : 1)) / stretch;
  const weeksMin = Math.max(1, Math.round((hours * p.spread.low) / weeklyPace));
  const weeksMax = Math.max(
    weeksMin + 1,
    Math.ceil((hours * p.spread.high[scope.confianca]) / weeklyPace),
  );

  return {
    estimate: {
      min,
      max,
      weeksMin,
      weeksMax,
      scope,
      payment: paymentOptions(min),
      aboveBudget: Boolean(budget && budget < min),
    },
    notes: {
      discount: Math.round(discount * 1000) / 1000,
      parts: {
        referencias,
        prazo,
        negociacao,
        orcamento: Math.round(orcamento * 1000) / 1000,
      },
      budgetGap: Boolean(budget && budget < min),
    },
  };
}
