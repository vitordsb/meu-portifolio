/**
 * Rate limit de janela fixa, em memória.
 *
 * Limitação conhecida: o contador vive no processo. Em serverless com várias
 * instâncias, cada uma tem o seu, então o limite efetivo é
 * `limite x instâncias`. Ainda assim transforma "infinitas tentativas por
 * segundo" em "algumas por janela", que é o que mata força bruta. Se um dia o
 * projeto virar a base de outros, troque o Map por Redis/Upstash mantendo esta
 * mesma assinatura.
 */

type Bucket = { hits: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Teto de segurança: sem isso, um atacante variando a chave (um IP por
// requisição) faz o Map crescer até derrubar o processo.
const MAX_KEYS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) purgeExpired(now);
    buckets.set(key, { hits: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  bucket.hits += 1;
  if (bucket.hits > limit) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }
  return { ok: true, remaining: limit - bucket.hits, retryAfterMs: 0 };
}

/** Zera o contador de uma chave. Use depois de um sucesso legítimo. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

function purgeExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Se a limpeza não resolveu, o Map está sob ataque de chaves variadas:
  // esvazia tudo em vez de estourar a memória.
  if (buckets.size >= MAX_KEYS) buckets.clear();
}
