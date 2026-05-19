import { SignJWT } from "jose";

const OAUTH_SERVER_URL = process.env.OAUTH_SERVER_URL ?? "";
const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? process.env.APP_ID ?? "";
const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export interface TokenResponse {
  accessToken: string;
}

export interface UserInfo {
  openId: string;
  name?: string;
  email?: string;
  loginMethod?: string;
  platform?: string;
}

function deriveLoginMethod(platforms: unknown, fallback: string | null): string | null {
  if (fallback && fallback.length > 0) return fallback;
  if (!Array.isArray(platforms) || platforms.length === 0) return null;
  const set = new Set<string>(platforms.filter((p): p is string => typeof p === "string"));
  if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
  if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
  if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
  if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
  const first = Array.from(set)[0];
  return first ? first.toLowerCase() : null;
}

export async function exchangeCodeForToken(code: string, state: string): Promise<TokenResponse> {
  const redirectUri = atob(state);
  const res = await fetch(`${OAUTH_SERVER_URL}/webdev.v1.WebDevAuthPublicService/ExchangeToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId: APP_ID, grantType: "authorization_code", code, redirectUri }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json();
}

export async function getUserInfo(accessToken: string): Promise<UserInfo> {
  const res = await fetch(`${OAUTH_SERVER_URL}/webdev.v1.WebDevAuthPublicService/GetUserInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });
  if (!res.ok) throw new Error(`Get user info failed: ${res.status}`);
  const data = (await res.json()) as Record<string, unknown>;
  const loginMethod = deriveLoginMethod(data.platforms, (data.platform as string | null) ?? null);
  return { ...(data as unknown as UserInfo), loginMethod: loginMethod ?? undefined };
}

export async function createSessionToken(openId: string, name: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
  const expiresAt = Math.floor((Date.now() + ONE_YEAR_MS) / 1000);
  return new SignJWT({ openId, appId: APP_ID, name })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expiresAt)
    .sign(secret);
}
