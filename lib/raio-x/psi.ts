import { readFile } from "node:fs/promises";
import { buildReport, ReportError } from "./report";
import type { Report } from "./types";

/**
 * Roda o Lighthouse no Google (PageSpeed Insights API v5), simulando um
 * celular. Grátis com chave própria (PAGESPEED_API_KEY): sem ela a cota é a
 * compartilhada de todo mundo e vive esgotada.
 *
 * Em dev dá pra testar sem chave apontando RAIOX_FIXTURE pra um JSON do
 * Lighthouse gerado na máquina (`npx lighthouse <url> --output=json`).
 */

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
/** O Lighthouse leva de 10 a 40 s; acima disso o site provavelmente travou. */
const TIMEOUT_MS = 70_000;
/** Mesmo site de novo em pouco tempo (atualizou a página, voltou): sem gastar cota. */
const CACHE_MS = 15 * 60 * 1000;
const CACHE_MAX = 100;

export type PsiFailure =
  | "sem_chave"
  | "inacessivel"
  | "ocupado"
  | "demorou"
  | "falhou";

export class PsiError extends Error {
  constructor(readonly reason: PsiFailure) {
    super(reason);
  }
}

const cache = new Map<string, { at: number; report: Report }>();

export function hasPsiKey() {
  return Boolean(process.env.PAGESPEED_API_KEY);
}

function fixturePath() {
  return process.env.NODE_ENV === "development"
    ? process.env.RAIOX_FIXTURE
    : undefined;
}

export function canAnalyze() {
  return hasPsiKey() || Boolean(fixturePath());
}

export async function analyze(url: string, lang: "pt" | "en"): Promise<Report> {
  const key = `${lang}:${url}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.report;

  const lhr = await fetchLighthouse(url, lang);
  let report: Report;
  try {
    report = buildReport(lhr, url, lang);
  } catch (e) {
    // runtimeError do Lighthouse = não conseguiu abrir a página
    throw new PsiError(e instanceof ReportError ? "inacessivel" : "falhou");
  }

  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
  cache.set(key, { at: Date.now(), report });
  return report;
}

async function fetchLighthouse(url: string, lang: "pt" | "en"): Promise<unknown> {
  const fixture = fixturePath();
  if (!hasPsiKey() && fixture) {
    await new Promise((r) => setTimeout(r, 2500)); // parece de verdade na tela
    return JSON.parse(await readFile(fixture, "utf8"));
  }
  if (!hasPsiKey()) throw new PsiError("sem_chave");

  const qs = new URLSearchParams({
    url,
    strategy: "mobile",
    locale: lang === "pt" ? "pt-BR" : "en",
    key: process.env.PAGESPEED_API_KEY!,
  });
  for (const c of ["PERFORMANCE", "SEO", "ACCESSIBILITY", "BEST_PRACTICES"]) {
    qs.append("category", c);
  }

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?${qs}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (e) {
    throw new PsiError(
      e instanceof Error && e.name === "TimeoutError" ? "demorou" : "falhou",
    );
  }

  if (res.ok) {
    const body = (await res.json().catch(() => null)) as {
      lighthouseResult?: unknown;
    } | null;
    if (!body?.lighthouseResult) throw new PsiError("falhou");
    return body.lighthouseResult;
  }

  // Nunca loga a URL da chamada: ela leva a chave
  const err = (await res.json().catch(() => null)) as {
    error?: { message?: string };
  } | null;
  const msg = err?.error?.message ?? "";
  console.error(`[raio-x] PageSpeed ${res.status}: ${msg.slice(0, 200)}`);
  if (res.status === 429) throw new PsiError("ocupado");
  // 400/500 com erro do Lighthouse: DNS, site fora do ar, não é HTML...
  if (/FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS_FAILURE|NOT_HTML|NO_FCP|INVALID_URL|unable to resolve|Unable to process/i.test(msg)) {
    throw new PsiError("inacessivel");
  }
  throw new PsiError("falhou");
}
