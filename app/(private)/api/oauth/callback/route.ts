import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getUserInfo, createSessionToken } from "@/lib/oauth";
import { upsertUser } from "@/lib/db";

const COOKIE_NAME = "app_session_id";
const ONE_YEAR_S = 60 * 60 * 24 * 365;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "code and state are required" }, { status: 400 });
  }

  try {
    const tokenResponse = await exchangeCodeForToken(code, state);
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
    const isHttps = request.nextUrl.protocol === "https:";

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: isHttps,
      maxAge: ONE_YEAR_S,
    });

    return response;
  } catch (err) {
    console.error("[OAuth] Callback failed:", err);
    return NextResponse.json({ error: "OAuth callback failed" }, { status: 500 });
  }
}
