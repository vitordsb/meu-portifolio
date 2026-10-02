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
  confianca: z.enum(["baixa", "media", "alta"]).catch("media"),
});

export type Scope = z.infer<typeof ScopeSchema>;

/** O que a página mostra no fim. Sem horas nem valor-hora: isso fica comigo. */
export type Estimate = {
  min: number;
  max: number;
  weeksMin: number;
  weeksMax: number;
  scope: Scope;
};
