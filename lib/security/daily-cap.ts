/**
 * Teto diário GLOBAL por recurso (SPEC de segurança, S2): segura abuso vindo
 * de muitos IPs, que o rate limit por IP não pega. Conta por dia no fuso de
 * São Paulo.
 *
 * Armazenamento:
 * - Upstash Redis (REST) quando houver UPSTASH_REDIS_REST_URL/TOKEN ou
 *   KV_REST_API_URL/TOKEN (nomes que a integração do Marketplace da Vercel
 *   cria). Vale entre todas as instâncias.
 * - Sem isso, memória do processo: cada instância conta separado (melhor que
 *   nada até o Redis ou o banco entrarem).
 * Falha do Redis deixa passar e loga (não derruba o site por causa do contador).
 */

export type CapName =
  | "chat"
  | "estimativa"
  | "checkout"
  | "contato"
  | "contraproposta"
  | "raiox"
  | "raiox_lead"
  | "novidades";

/** Limites padrão por dia; sobrescreva com CAP_<NOME>_DIA na Vercel. */
const DEFAULTS: Record<CapName, number> = {
  chat: 400,
  estimativa: 60,
  checkout: 150,
  contato: 80,
  contraproposta: 60,
  // Raio-X: a cota do Google (25 mil/dia) sobra; o teto segura o tempo de
  // função gasto esperando o Lighthouse (até ~40 s por análise)
  raiox: 300,
  raiox_lead: 80,
  novidades: 100,
};

function limitFor(name: CapName) {
  const env = Number(process.env[`CAP_${name.toUpperCase()}_DIA`]);
  return Number.isFinite(env) && env > 0 ? env : DEFAULTS[name];
}

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

const memory = new Map<string, number>();

async function incrRedis(key: string): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Expira em 2 dias: o contador de ontem some sozinho
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, 172800],
      ]),
      signal: AbortSignal.timeout(2000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Redis ${res.status}`);
    const data = (await res.json()) as { result?: number }[];
    return Number(data[0]?.result ?? NaN);
  } catch (e) {
    console.error("[cap] Redis falhou, deixando passar:", e);
    return NaN;
  }
}

/** Conta um uso. `ok: false` = o teto do dia estourou. */
export async function takeDaily(
  name: CapName,
): Promise<{ ok: boolean; count: number; limit: number }> {
  const limit = limitFor(name);
  const key = `cap:${name}:${today()}`;

  let count = await incrRedis(key);
  if (count === null) {
    count = (memory.get(key) ?? 0) + 1;
    memory.set(key, count);
    // Limpa dias anteriores pra memória não crescer
    if (memory.size > 50) {
      for (const k of memory.keys()) if (!k.endsWith(today())) memory.delete(k);
    }
  }
  if (Number.isNaN(count)) return { ok: true, count: 0, limit };
  if (count > limit) {
    if (count === limit + 1)
      console.warn(`[cap] teto diário de "${name}" atingido (${limit})`);
    return { ok: false, count, limit };
  }
  return { ok: true, count, limit };
}
