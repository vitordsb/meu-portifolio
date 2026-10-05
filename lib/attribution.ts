/**
 * Origem do lead (lado do navegador, sem dependência pesada: roda em toda
 * página). Validação e texto do e-mail em lib/attribution-server.ts.
 *
 * Origem do lead: de onde a pessoa veio (Google, LinkedIn, link de
 * prospecção...), pra saber qual canal gera cliente. Vai só no e-mail do
 * Vitor, nunca no do cliente.
 *
 * Regra "último clique que não foi direto": link com UTM ou ?ref= sempre
 * sobrescreve; site externo (referrer) só entra se não houver origem guardada;
 * visita direta não apaga nada. Guarda 30 dias: muita gente volta depois pra
 * pedir o orçamento.
 *
 * Links de prospecção: https://www.vitordsb.com.br/raio-x?ref=prospeccao-cotia
 * Campanhas: ?utm_source=instagram&utm_medium=bio&utm_campaign=outubro
 */

const KEY = "origem:v1";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Campos guardados (validados de novo no servidor: lib/attribution-server). */
export type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  ref?: string;
  referrer?: string;
  landing?: string;
  at?: string;
};

// ── Navegador ──────────────────────────────────────────────────────────────

/** Roda uma vez por carregamento de página (ClickTracker). */
export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams;
    const utm = {
      source: q.get("utm_source") ?? undefined,
      medium: q.get("utm_medium") ?? undefined,
      campaign: q.get("utm_campaign") ?? undefined,
      content: q.get("utm_content") ?? undefined,
      term: q.get("utm_term") ?? undefined,
      ref: q.get("ref") ?? undefined,
    };
    const tagged = Object.values(utm).some(Boolean);

    let referrer: string | undefined;
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host !== url.hostname.replace(/^www\./, "")) referrer = host;
    }

    if (!tagged && (!referrer || readAttribution())) return;

    const data: Attribution = {
      ...utm,
      referrer,
      landing: url.pathname,
      at: new Date().toISOString().slice(0, 10),
    };
    localStorage.setItem(
      KEY,
      JSON.stringify({ data, exp: Date.now() + TTL_MS }),
    );
  } catch {
    // modo anônimo, storage bloqueado: segue sem origem
  }
}

/** Origem guardada (ou undefined), pra mandar junto do pedido. */
export function readAttribution(): Attribution | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const { data, exp } = JSON.parse(raw) as { data: Attribution; exp: number };
    if (!exp || exp < Date.now()) {
      localStorage.removeItem(KEY);
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
}
