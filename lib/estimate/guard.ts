import { clientIpFrom } from "@/lib/request-ip";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Portaria das rotas do orçamento: cada chamada custa crédito da API, então
 * só a própria página pode chamar, e cada IP tem cota.
 */
export function guard(
  req: Request,
  bucket: string,
  limit: number,
  windowMs: number,
): Response | null {
  // Outro site chamando a rota direto do navegador do visitante
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host)
        return json({ error: "forbidden" }, 403);
    } catch {
      return json({ error: "forbidden" }, 403);
    }
  }

  const ip = clientIpFrom((name) => req.headers.get(name));
  const rl = rateLimit(`${bucket}:${ip ?? "sem-ip"}`, limit, windowMs);
  if (!rl.ok) {
    return json(
      {
        error: "rate_limited",
        retryAfterMin: Math.ceil(rl.retryAfterMs / 60000),
      },
      429,
    );
  }
  return null;
}

export function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}
