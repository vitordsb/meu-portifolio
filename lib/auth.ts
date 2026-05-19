import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getUserByOpenId } from "./db";

const COOKIE_NAME = "app_session_id";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const { openId, appId, name } = payload as Record<string, unknown>;
    if (typeof openId !== "string" || typeof appId !== "string" || typeof name !== "string") return null;
    return { openId, appId, name };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return getUserByOpenId(session.openId);
}
