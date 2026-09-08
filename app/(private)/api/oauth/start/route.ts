import { NextRequest, NextResponse } from "next/server";
import {
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_TTL_SECONDS,
  callbackUrl,
  createState,
} from "@/lib/oauth-state";

/**
 * Início do fluxo OAuth.
 *
 * Existe para que o `state` seja emitido por nós: geramos um valor aleatório,
 * guardamos num cookie HttpOnly e mandamos o mesmo valor ao portal. Na volta, o
 * callback só aceita se os dois baterem.
 *
 * ATENÇÃO: o formato da URL de autorização (`appId`, `redirectUri`, `state`)
 * segue o que o callback antigo dava a entender. Confira contra a documentação
 * do portal antes de confiar neste caminho em produção.
 */
export async function GET(request: NextRequest) {
  const portal = process.env.NEXT_PUBLIC_OAUTH_PORTAL_URL?.trim();
  const appId = process.env.NEXT_PUBLIC_APP_ID ?? process.env.APP_ID ?? "";

  if (!portal || !appId) {
    return NextResponse.json({ error: "OAuth não configurado" }, { status: 501 });
  }

  const state = createState();
  const redirectUri = callbackUrl(request.nextUrl.origin);

  const authorizeUrl = new URL(portal);
  authorizeUrl.searchParams.set("appId", appId);
  authorizeUrl.searchParams.set("redirectUri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: OAUTH_STATE_TTL_SECONDS,
    path: "/",
  });

  return response;
}
