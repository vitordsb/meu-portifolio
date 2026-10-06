import { z } from "zod";

/**
 * O escopo que a IA extrai da conversa. É SÓ isso que ela decide: o preço sai
 * de `pricing.ts`, em código, com as métricas do Vitor. Assim ninguém convence
 * o modelo a "fazer por R$ 1": no máximo descreve um projeto menor.
 *
 * Os limites (25 funcionalidades, 10 integrações) seguram transcrição forjada
 * querendo inflar ou estourar o cálculo.
 */

export const PROJECT_TYPES = [
  "landing",
  "site",
  "sistema_web",
  "app_mobile",
  "ecommerce",
  "saas",
  "outro",
] as const;

export const COMPLEXITIES = ["simples", "media", "complexa"] as const;

/** Lista tolerante: descarta o item inválido em vez de zerar a lista, e corta
 *  no teto em vez de recusar. */
function listOf<T extends z.ZodType>(item: T, max: number) {
  return z
    .array(z.unknown())
    .catch([])
    .transform((raw) =>
      raw
        .map((v) => item.safeParse(v))
        .filter((r) => r.success)
        .map((r) => r.data as z.infer<T>)
        .slice(0, max),
    );
}

const Feature = z.object({
  nome: z.string().trim().min(1).max(80),
  complexidade: z.enum(COMPLEXITIES).catch("media"),
});

const Integration = z.string().trim().min(1).max(60);

export const ScopeSchema = z.object({
  resumo: z
    .string()
    .catch("")
    .transform((s) => s.trim().slice(0, 400)),
  tipo: z.enum(PROJECT_TYPES).catch("outro"),
  plataformas: z
    .object({
      web: z.boolean().catch(true),
      mobile: z.boolean().catch(false),
    })
    .catch({ web: true, mobile: false }),
  design: z.enum(["pronto", "referencias", "do_zero"]).catch("do_zero"),
  funcionalidades: listOf(Feature, 25),
  integracoes: listOf(Integration, 10),
  escala: z.enum(["regional", "nacional", "internacional"]).catch("nacional"),
  fase: z.enum(["validando", "planejado"]).catch("planejado"),
  login: z.boolean().catch(false),
  painel_admin: z.boolean().catch(false),
  urgente: z.boolean().catch(false),
  prazo: z.enum(["urgente", "normal", "flexivel"]).catch("normal"),
  referencias: z.enum(["nenhuma", "algumas", "muitas"]).catch("nenhuma"),
  /** Quanto o cliente disse que pode investir (R$). Teto de sanidade. */
  investimento_max: z.coerce
    .number()
    .positive()
    .max(10_000_000)
    .transform(Math.round)
    .nullable()
    .catch(null),
  pagamento_preferido: z
    .enum(["a_vista", "entrada_e_entrega", "parcelado", "nao_disse"])
    .catch("nao_disse"),
  pediu_desconto: z.boolean().catch(false),
  confianca: z.enum(["baixa", "media", "alta"]).catch("media"),
});

export type Scope = z.infer<typeof ScopeSchema>;

/** Uma forma de pagamento oferecida, já com a conta feita pelo código. */
export type PaymentOption = {
  id:
    | "entrada_entrega"
    | "boleto_2x"
    | "boleto_3x"
    | "boleto_4x"
    | "pix_contrato";
  label: { pt: string; en: string };
  /** Detalhe com valores (a partir do mínimo da faixa). */
  detail: { pt: string; en: string };
};

/** O que a página mostra no fim. Sem horas, valor-hora nem desconto
 *  aplicado: isso fica com o Vitor (vai só no e-mail dele). */
export type Estimate = {
  min: number;
  max: number;
  weeksMin: number;
  weeksMax: number;
  scope: Scope;
  payment: PaymentOption[];
  /** A faixa ficou acima do que o cliente disse que pode investir: a tela
   *  convida pra contraproposta. */
  aboveBudget: boolean;
  /** Equipe que o projeto pede (1 a 5), calculada pelo código. */
  team: Team;
};

/** Quem trabalha no projeto: o tamanho e o papel de cada pessoa. */
export type Team = {
  size: number;
  roles: { pt: string; en: string }[];
};
