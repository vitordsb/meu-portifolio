import { track } from "@vercel/analytics";

/**
 * Ponto único dos eventos do funil. Hoje vai pro Vercel Web Analytics, que só
 * mostra evento personalizado nos planos Pro/Enterprise: trocar de ferramenta
 * é mexer só aqui.
 */
export type EventProps = Record<string, string | number | boolean | null>;

export function trackEvent(name: string, props?: EventProps) {
  try {
    track(name, props);
  } catch {
    // medição nunca pode quebrar a navegação
  }
}

/** Qual evento um link gera, ou null se não é algo que o funil acompanha. */
export function linkEvent(
  href: string,
): { name: string; props?: EventProps } | null {
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (url.protocol === "mailto:") return { name: "clique_social", props: { rede: "email" } };
  if (host === "wa.me" || host.endsWith("whatsapp.com")) return { name: "clique_whatsapp" };
  if (host.endsWith("linkedin.com")) return { name: "clique_social", props: { rede: "linkedin" } };
  if (host === "github.com") return { name: "clique_social", props: { rede: "github" } };
  if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
    if (url.pathname === "/orcamento") return { name: "clique_orcamento" };
    if (url.pathname === "/servicos") return { name: "clique_servicos" };
  }
  return null;
}
