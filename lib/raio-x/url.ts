/**
 * Endereço que o visitante digitou no Raio-X. Quem abre o site é o Google
 * (PageSpeed Insights), não o nosso servidor, então não tem risco de usarem
 * a rota pra cutucar rede interna. Mesmo assim só passa site público de
 * verdade: o Google gastaria cota à toa com localhost, IP ou lixo.
 */

const MAX_LENGTH = 200;

/** "meusite.com.br/contato " -> "https://meusite.com.br/contato", ou null. */
export function normalizeSiteUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let s = raw.trim();
  if (!s || s.length > MAX_LENGTH) return null;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;

  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "80" && url.port !== "443") return null;

  const host = url.hostname.toLowerCase();
  // Precisa de domínio com ponto e terminação de letras: fora IP, localhost,
  // nomes internos e IPv6 entre colchetes
  if (!/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/.test(host)) return null;
  if (host.endsWith(".local") || host.endsWith(".localhost")) return null;

  url.hash = "";
  return url.toString();
}

/** Como mostrar o endereço pro visitante: sem https:// nem barra final. */
export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
