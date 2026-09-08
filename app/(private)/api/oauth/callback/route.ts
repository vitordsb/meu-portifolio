import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getUserInfo, createSessionToken, SESSION_TTL_SECONDS } from "@/lib/oauth";
import { OAUTH_STATE_COOKIE, callbackUrl, statesMatch } from "@/lib/oauth-state";
import { upsertUser } from "@/lib/db";

const COOKIE_NAME = "app_session_id";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "code and state are required" }, { status: 400 });
  }

  // O retorno só vale se este site tiver começado o fluxo (ver /api/oauth/start).
  // Antes, qualquer `code` válido do provedor virava sessão nossa.
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!statesMatch(expectedState, state)) {
    return NextResponse.json({ error: "invalid state" }, { status: 400 });
  }

  try {
    // O redirect_uri sai da nossa configuração. Antes vinha de `atob(state)`,
    // ou seja, de um valor que o visitante controlava.
    const redirectUri = callbackUrl(request.nextUrl.origin);
    const tokenResponse = await exchangeCodeForToken(code, redirectUri);
    const userInfo = await getUserInfo(tokenResponse.accessToken);

    if (!userInfo.openId) {
      return NextResponse.json({ error: "openId missing" }, { status: 400 });
    }

    await upsertUser({
      openId: userInfo.openId,
      name: userInfo.name ?? null,
      email: userInfo.email ?? null,
      loginMethod: userInfo.loginMethod ?? null,
      lastSignedIn: new Date(),
    });

    const sessionToken = await createSessionToken(userInfo.openId, userInfo.name ?? "");

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      // `lax` (era `none`): com `none` o cookie de sessão viajava em requisição
      // cross-site, o que reabre CSRF nas rotas de API. E `secure` agora segue o
      // ambiente, não o protocolo que o Next enxerga atrás do proxy.
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TTL_SECONDS,
    });

    // O state é de uso único.
    response.cookies.delete(OAUTH_STATE_COOKIE);

    return response;
  } catch (err) {
    console.error("[OAuth] Callback failed:", err);
    return NextResponse.json({ error: "OAuth callback failed" }, { status: 500 });
  }
}
