import type { Estimate, Scope } from "./scope";

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

  /** Arredonda pra este múltiplo (R$): de 100 em 100 nos projetos pequenos
   *  (R$ 900 parece preço; R$ 1.000 parece chute), de 500 em 500 acima. */
  roundTo: { small: 100, large: 500, threshold: 5000 },
} as const;

function roundPrice(value: number) {
  const { small, large, threshold } = PRICING.roundTo;
  const step = value < threshold ? small : large;
  return Math.max(step, Math.round(value / step) * step);
}

export function priceScope(scope: Scope): Estimate {
  const p = PRICING;

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

  const central = hours * p.hourlyRate * (scope.urgente ? p.rushFactor : 1);
  const min = roundPrice(Math.max(p.minimumProject, central * p.spread.low));
  const max = Math.max(
    roundPrice(min * 1.15),
    roundPrice(central * p.spread.high[scope.confianca]),
  );

  // Urgência encurta o prazo (é por isso que custa mais), não o trabalho.
  const weeklyPace = p.hoursPerWeek * (scope.urgente ? 1.4 : 1);
  const weeksMin = Math.max(1, Math.round((hours * p.spread.low) / weeklyPace));
  const weeksMax = Math.max(
    weeksMin + 1,
    Math.ceil((hours * p.spread.high[scope.confianca]) / weeklyPace),
  );

  return { min, max, weeksMin, weeksMax, scope };
}
