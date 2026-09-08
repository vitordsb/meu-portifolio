/**
 * Identificação de IP e allowlist do admin.
 *
 * Vive num módulo só porque middleware (edge) e server actions (node) precisam
 * decidir a mesma coisa. Duas cópias da regra é como uma delas fica para trás.
 * Nada aqui pode importar API de Node: o middleware roda no edge runtime.
 */

type HeaderReader = (name: string) => string | null | undefined;

/**
 * IP do cliente, ou `null` quando não dá pra saber.
 *
 * A ordem importa. `x-forwarded-for` é uma lista que o cliente consegue
 * prefixar quando o proxy anexa em vez de sobrescrever, então ele é o último
 * recurso: antes dele vêm os headers que a própria plataforma escreve.
 */
export function clientIpFrom(getHeader: HeaderReader): string | null {
  // Vercel: escrito pela borda, não aceita valor vindo do cliente.
  const vercel = getHeader("x-vercel-forwarded-for");
  if (vercel) return firstIp(vercel);

  // Nginx/Traefik configurados como se deve.
  const real = getHeader("x-real-ip");
  if (real?.trim()) return real.trim();

  const fwd = getHeader("x-forwarded-for");
  if (fwd) return firstIp(fwd);

  return null;
}

function firstIp(value: string): string | null {
  const first = value.split(",")[0]?.trim();
  return first && first.length > 0 ? first : null;
}

function isLocalhost(ip: string | null): boolean {
  return ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
}

/**
 * Decide se o IP pode falar com a área administrativa.
 *
 * Falha FECHADO: IP desconhecido é negado em produção. A versão anterior
 * tratava "sem header" como localhost, o que abria /admin e /login inteiros
 * em qualquer deploy que não repassasse header de proxy.
 */
export function isAllowedIp(ip: string | null): boolean {
  const isProd = process.env.NODE_ENV === "production";

  const allowed = (process.env.ADMIN_ALLOWED_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowed.includes(ip ?? "")) return true;

  // Fora de produção, o dev precisa conseguir entrar: localhost e "não sei"
  // passam. Em produção nenhum dos dois vale.
  if (!isProd) return isLocalhost(ip) || ip === null;

  return false;
}
