import { CATEGORY_FALLBACK, IGNORED, ISSUE_COPY } from "./issues";
import { CATEGORIES, type Category, type Impact, type Issue, type Report } from "./types";

/**
 * Lê o resultado do Lighthouse (o `lighthouseResult` do PageSpeed Insights)
 * e monta o Raio-X: notas, métricas, foto e a lista de problemas já
 * traduzida, sem repetição e na ordem do que mais custa cliente.
 */

type Lang = "pt" | "en";

type Audit = {
  score: number | null;
  scoreDisplayMode?: string;
  title?: string;
  numericValue?: number;
  metricSavings?: Record<string, number>;
  details?: { type?: string; overallSavingsMs?: number; data?: string };
};

type Lhr = {
  finalDisplayedUrl?: string;
  finalUrl?: string;
  runtimeError?: { code?: string };
  categories: Record<
    string,
    { score: number | null; auditRefs: { id: string; weight?: number }[] }
  >;
  audits: Record<string, Audit>;
};

/** Categoria do Lighthouse -> nossa chave. */
const LHR_CATEGORY: Record<string, Category> = {
  performance: "performance",
  seo: "seo",
  accessibility: "accessibility",
  "best-practices": "bestPractices",
};

const IMPACT_RANK: Record<Impact, number> = { alto: 0, medio: 1, baixo: 2 };
const SKIP_MODES = new Set(["informative", "notApplicable", "manual", "error"]);
const MAX_ISSUES = 15;
const MAX_SCREENSHOT = 200_000;

export class ReportError extends Error {}

/** Quanto tempo o achado economizaria (ms), pelo maior dos números. */
function savingsMs(a: Audit) {
  const s = a.metricSavings ?? {};
  return Math.max(s.LCP ?? 0, s.FCP ?? 0, a.details?.overallSavingsMs ?? 0);
}

function impactFromSavings(ms: number): Impact {
  if (ms >= 2000) return "alto";
  if (ms >= 700) return "medio";
  return "baixo";
}

function impactFromWeight(w: number): Impact {
  if (w >= 7) return "alto";
  if (w >= 3) return "medio";
  return "baixo";
}

/** Título do Lighthouse sem crase de código nem link em markdown. */
/** Título do Lighthouse sem tradução (chega em inglês mesmo com locale pt-BR). */
function looksEnglish(s: string) {
  if (/[ãõçáéíóúâêôà]/i.test(s)) return false;
  return /\b(the|is|are|do|does|not|have|has|with|and|elements?|page|uses?)\b/i.test(s);
}

function plain(s: string) {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`/g, "")
    .trim();
}

function seconds(ms: number, lang: Lang) {
  const v = (ms / 1000).toLocaleString(lang === "pt" ? "pt-BR" : "en-US", {
    maximumFractionDigits: 1,
  });
  return `${v} s`;
}

/** "O conteúdo principal leva 6,2 s...": vem da métrica, não de um audit. */
function lcpIssue(lcpMs: number, lang: Lang): Issue {
  const s = seconds(lcpMs, lang);
  return {
    id: "@lcp",
    cat: "performance",
    impact: lcpMs > 4000 ? "alto" : "medio",
    title:
      lang === "pt"
        ? `O conteúdo principal leva ${s} pra aparecer no celular`
        : `The main content takes ${s} to show up on phones`,
    why:
      lang === "pt"
        ? "Segundo o Google, mais da metade das visitas no celular desiste quando a página passa de 3 segundos."
        : "According to Google, over half of mobile visits are abandoned when a page takes longer than 3 seconds.",
    fix:
      lang === "pt"
        ? "Atacar os itens de velocidade desta lista: são eles que seguram o carregamento."
        : "Tackle the speed items on this list: they're what holds the load back.",
  };
}

/**
 * Remonta um item só a partir do id e do nosso dicionário. Usado quando o
 * lead chega e o relatório não está mais na memória: o texto que vai por
 * e-mail nunca vem do navegador. Id desconhecido volta null.
 */
export function issueFromId(
  id: string,
  impact: Impact,
  lang: Lang,
  lcpMs: number,
): Issue | null {
  if (id === "@lcp") return lcpMs > 2500 ? lcpIssue(lcpMs, lang) : null;
  const copy = ISSUE_COPY[id];
  if (!copy) return null;
  return {
    id,
    cat: copy.cat,
    impact: copy.impact ?? impact,
    title: copy.title[lang],
    why: copy.why[lang],
    fix: copy.fix[lang],
  };
}

export function buildReport(raw: unknown, requestedUrl: string, lang: Lang): Report {
  const lhr = raw as Lhr;
  if (!lhr?.categories || !lhr?.audits) throw new ReportError("formato");
  if (lhr.runtimeError?.code) throw new ReportError(lhr.runtimeError.code);

  const audits = lhr.audits;
  const num = (id: string) => audits[id]?.numericValue ?? 0;

  const scores = Object.fromEntries(
    CATEGORIES.map((c) => [c, 0]),
  ) as Record<Category, number>;
  for (const [key, cat] of Object.entries(LHR_CATEGORY)) {
    const s = lhr.categories[key]?.score;
    scores[cat] = Math.round((s ?? 0) * 100);
  }

  const metrics = {
    lcpMs: Math.round(num("largest-contentful-paint")),
    fcpMs: Math.round(num("first-contentful-paint")),
    cls: Math.round(num("cumulative-layout-shift") * 1000) / 1000,
    tbtMs: Math.round(num("total-blocking-time")),
  };

  type Found = Issue & { group: string; savings: number };
  const found: Found[] = [];

  const push = (
    id: string,
    cat: Category,
    impact: Impact,
    savings: number,
    fallbackTitle?: string,
  ) => {
    const copy = ISSUE_COPY[id];
    const fb = CATEGORY_FALLBACK[copy?.cat ?? cat];
    found.push({
      id,
      group: copy?.group ?? id,
      cat: copy?.cat ?? cat,
      impact: copy?.impact ?? impact,
      savings,
      title: copy
        ? copy.title[lang]
        : lang === "pt" && looksEnglish(fallbackTitle ?? id)
          ? fb.title.pt
          : plain(fallbackTitle ?? id),
      why: (copy?.why ?? fb.why)[lang],
      fix: (copy?.fix ?? fb.fix)[lang],
    });
  };

  // ── Sintéticos: as métricas que o visitante sente ──
  if (metrics.lcpMs > 2500) {
    found.push({ ...lcpIssue(metrics.lcpMs, lang), group: "lcp", savings: metrics.lcpMs });
  }
  if (metrics.cls > 0.1) push("@cls", "performance", metrics.cls > 0.25 ? "alto" : "medio", 0);
  if (metrics.tbtMs > 300) push("@tbt", "performance", metrics.tbtMs > 600 ? "alto" : "medio", 0);

  // ── Achados de cada categoria ──
  for (const [key, cat] of Object.entries(LHR_CATEGORY)) {
    for (const ref of lhr.categories[key]?.auditRefs ?? []) {
      if (IGNORED.has(ref.id)) continue;
      const a = audits[ref.id];
      if (!a || a.score === null || a.score >= 0.9) continue;
      if (SKIP_MODES.has(a.scoreDisplayMode ?? "")) continue;

      if (cat === "performance") {
        // Velocidade: só o que está traduzido e economiza tempo de verdade
        if (!ISSUE_COPY[ref.id]) continue;
        const ms = savingsMs(a);
        if (ms < 300 && a.score >= 0.5) continue;
        push(ref.id, cat, ms ? impactFromSavings(ms) : "baixo", ms);
      } else {
        push(ref.id, cat, impactFromWeight(ref.weight ?? 0), 0, a.title);
      }
    }
  }

  // Mais grave primeiro; no empate, a categoria (velocidade antes) e o tempo
  found.sort(
    (x, y) =>
      IMPACT_RANK[x.impact] - IMPACT_RANK[y.impact] ||
      CATEGORIES.indexOf(x.cat) - CATEGORIES.indexOf(y.cat) ||
      y.savings - x.savings,
  );

  const seen = new Set<string>();
  const issues: Issue[] = [];
  for (const f of found) {
    if (seen.has(f.group)) continue;
    seen.add(f.group);
    const { group: _g, savings: _s, ...issue } = f;
    issues.push(issue);
    if (issues.length >= MAX_ISSUES) break;
  }

  const shot = audits["final-screenshot"]?.details?.data;
  const screenshot =
    typeof shot === "string" &&
    /^data:image\/(jpeg|webp|png);base64,[A-Za-z0-9+/=]+$/.test(shot) &&
    shot.length <= MAX_SCREENSHOT
      ? shot
      : null;

  return {
    url: lhr.finalDisplayedUrl || lhr.finalUrl || requestedUrl,
    scores,
    metrics,
    screenshot,
    issues,
    analyzedAt: new Date().toISOString(),
  };
}
