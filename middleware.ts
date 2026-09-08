import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { clientIpFrom, isAllowedIp } from "@/lib/request-ip";

/**
 * Barreira de borda da área administrativa.
 *
 * É a primeira camada, não a única: `assertAdmin()` nas server actions e a
 * checagem de role em /admin/page.tsx repetem a verificação do lado do servidor.
 * Isso importa porque bypass de middleware é uma classe de bug recorrente no
 * Next - quando ela aparece, o que segura é a camada de baixo.
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ip = clientIpFrom((name) => request.headers.get(name));

  // 404 em vez de 403: não confirma nem que a área existe.
  if (path.startsWith("/admin") || path === "/login") {
    if (!isAllowedIp(ip)) {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  if (path.startsWith("/admin")) {
    const token = request.cookies.get("app_session_id")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    const secret = process.env.JWT_SECRET ?? "";
    // Sem segredo configurado ninguém entra. O `jose` já recusa chave de
    // tamanho zero, mas falhar aqui deixa o motivo explícito.
    if (secret.length === 0) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/login"] };
