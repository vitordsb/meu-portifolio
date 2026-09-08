import { randomBytes, timingSafeEqual } from "crypto";

/**
 * `state` do OAuth: o par cookie + parâmetro que prova que o retorno veio de um
 * fluxo que ESTE site começou.
 *
 * Sem isso, qualquer pessoa com um `code` válido do provedor consegue disparar
 * o callback e receber uma sessão nossa - é o CSRF de login clássico.
 */

export const OAUTH_STATE_COOKIE = "oauth_state";
export const OAUTH_STATE_TTL_SECONDS = 10 * 60;

export function createState(): string {
  return randomBytes(32).toString("base64url");
}

/** Comparação em tempo constante, tolerante a valor ausente ou de outro tamanho. */
export function statesMatch(fromCookie: string | undefined, fromQuery: string | null): boolean {
  if (!fromCookie || !fromQuery) return false;

  const a = Buffer.from(fromCookie);
  const b = Buffer.from(fromQuery);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

/**
 * Origem canônica do site.
 *
 * Atrás de proxy, a URL que o Next enxerga costuma ser o `http://` interno, o
 * que geraria um `redirect_uri` inválido. `NEXT_PUBLIC_SITE_URL` manda quando
 * está configurada.
 */
export function siteOrigin(fallbackOrigin: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return fallbackOrigin;
  const withProtocol = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return fallbackOrigin;
  }
}

export function callbackUrl(fallbackOrigin: string): string {
  return new URL("/api/oauth/callback", siteOrigin(fallbackOrigin)).toString();
}
