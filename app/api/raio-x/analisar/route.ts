import { z } from "zod";
import { guard, json } from "@/lib/estimate/guard";
import { analyze, canAnalyze, PsiError, type PsiFailure } from "@/lib/raio-x/psi";
import { normalizeSiteUrl } from "@/lib/raio-x/url";
import { isBotRequest } from "@/lib/security/bot";
import { takeDaily } from "@/lib/security/daily-cap";

/**
 * Raio-X grátis: o visitante manda o endereço do site e recebe notas e
 * problemas, lidos do Lighthouse pelo Google. Não grava nada: o lead só
 * acontece em /api/raio-x/lead, quando a pessoa pede o relatório completo.
 */

// O Lighthouse leva até ~40 s, e o fetch desiste aos 70
export const maxDuration = 90;

const Schema = z.object({
  url: z.string().max(400),
  lang: z.enum(["pt", "en"]).catch("pt"),
});

const STATUS: Record<PsiFailure, number> = {
  sem_chave: 503,
  inacessivel: 422,
  ocupado: 503,
  demorou: 504,
  falhou: 502,
};

export async function POST(req: Request) {
  const blocked = guard(req, "raiox", 6, 10 * 60 * 1000);
  if (blocked) return blocked;
  if (await isBotRequest()) return json({ error: "forbidden" }, 403);

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "invalid" }, 400);
  const url = normalizeSiteUrl(parsed.data.url);
  if (!url) return json({ error: "url" }, 400);

  if (!canAnalyze()) return json({ error: "sem_chave" }, 503);
  if (!(await takeDaily("raiox")).ok) return json({ error: "unavailable" }, 503);

  try {
    const report = await analyze(url, parsed.data.lang);
    return json({ report });
  } catch (e) {
    const reason: PsiFailure = e instanceof PsiError ? e.reason : "falhou";
    if (!(e instanceof PsiError)) console.error("[raio-x] erro inesperado:", e);
    return json({ error: reason }, STATUS[reason]);
  }
}
