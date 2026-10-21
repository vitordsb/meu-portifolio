import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Links assinados dos depoimentos, sem banco: o próprio link carrega o pedido
 * (id, projeto, nome da pessoa e validade) e uma assinatura HMAC com
 * TESTIMONIAL_SECRET. Quem não tem o segredo não consegue inventar um link.
 *
 * - Link do cliente: `/depoimento/<token>`, gerado por `pnpm depoimento`.
 *   Uso único: o id vira o nome do arquivo no Blob e o segundo envio esbarra
 *   no arquivo que já existe.
 * - Link do Vitor: assinatura do id, no botão "Tirar do site" do e-mail.
 *
 * Usado também pelo script (scripts/depoimento.ts), então nada de
 * `server-only` aqui.
 */

export type TestimonialRequest = {
  /** Id do depoimento (nome do arquivo no Blob). */
  id: string;
  /** Projeto (lib/testimonials/projects). */
  project: string;
  /** Nome de quem vai preencher, pra já vir no campo. */
  name?: string;
  /** Validade, em segundos desde 1970. */
  exp: number;
};

const DAYS_VALID = 30;

function secret(): string {
  const s = process.env.TESTIMONIAL_SECRET ?? "";
  if (s.length < 32) throw new Error("TESTIMONIAL_SECRET ausente ou curto (mínimo 32 caracteres)");
  return s;
}

export function hasTestimonialSecret() {
  return (process.env.TESTIMONIAL_SECRET ?? "").length >= 32;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

function sameSig(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function newTestimonialId(): string {
  return randomBytes(9).toString("base64url");
}

export function createRequestToken(req: Omit<TestimonialRequest, "exp" | "id">): {
  token: string;
  request: TestimonialRequest;
} {
  const request: TestimonialRequest = {
    id: newTestimonialId(),
    project: req.project,
    ...(req.name ? { name: req.name } : {}),
    exp: Math.floor(Date.now() / 1000) + DAYS_VALID * 86400,
  };
  const body = Buffer.from(JSON.stringify(request)).toString("base64url");
  return { token: `${body}.${sign(`pedido:${body}`)}`, request };
}

/** Pedido do link, ou `null` se assinatura não confere ou o prazo venceu. */
export function readRequestToken(token: string): TestimonialRequest | null {
  if (!hasTestimonialSecret() || token.length > 600) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !sameSig(sig, sign(`pedido:${body}`))) return null;
  try {
    const r = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as TestimonialRequest;
    if (typeof r.id !== "string" || !/^[\w-]{6,24}$/.test(r.id)) return null;
    if (typeof r.project !== "string" || typeof r.exp !== "number") return null;
    if (r.exp < Date.now() / 1000) return null;
    return r;
  } catch {
    return null;
  }
}

/** Assinatura do link de moderação ("Tirar do site") de um depoimento. */
export function moderationSig(id: string): string {
  return sign(`moderar:${id}`);
}

export function checkModerationSig(id: string, sig: string): boolean {
  if (!hasTestimonialSecret() || !/^[\w-]{6,24}$/.test(id)) return false;
  return sameSig(sig, moderationSig(id));
}
