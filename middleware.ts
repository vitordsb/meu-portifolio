import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Returns the client IP, preferring proxy headers (Vercel/CDN/Nginx).
 * Falls back to "unknown" if nothing is available.
 */
function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function isAllowedIp(ip: string): boolean {
  // ADMIN_ALLOWED_IPS = "1.2.3.4,5.6.7.8" — empty means allow all in dev only
  const allowed = (process.env.ADMIN_ALLOWED_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Localhost is always allowed for development convenience.
  const localhost = ip === "127.0.0.1" || ip === "::1" || ip === "unknown";

  if (allowed.length === 0) {
    // No allowlist configured: only localhost passes (fail-closed in prod).
    return localhost;
  }
  if (localhost && process.env.NODE_ENV !== "production") return true;
  return allowed.includes(ip);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1) IP allowlist for /admin/* — blocks any access that isn't from approved IPs.
  if (path.startsWith("/admin")) {
    const ip = getClientIp(request);
    if (!isAllowedIp(ip)) {
      // 404 instead of 403 so we don't leak the existence of the admin area.
      return new NextResponse("Not found", { status: 404 });
    }

    // 2) Existing JWT gate — still required even from a trusted IP.
    const token = request.cookies.get("app_session_id")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
      await jwtVerify(token, secret, { algorithms: ["HS256"] });
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3) Block the login page itself from non-allowed IPs — prevents brute force.
  if (path === "/login") {
    const ip = getClientIp(request);
    if (!isAllowedIp(ip)) {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/login"] };
