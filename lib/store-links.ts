/**
 * Links de loja de aplicativo.
 *
 * Um link da Play Store não se comporta como link de site: o rótulo "Abrir
 * site" mente sobre o destino, a URL crua é um paredão de query string que
 * quebra o layout do card, e a ficha aceita `hl` pra fixar o idioma.
 */

export type Store = "play" | "appstore";

export function storeOf(url: string | null | undefined): Store | null {
  if (!url) return null;
  if (url.includes("play.google.com")) return "play";
  if (url.includes("apps.apple.com") || url.includes("itunes.apple.com")) return "appstore";
  return null;
}

/** Nome curto para o rodapé do card, no lugar da URL inteira. */
export function storeLabel(store: Store): string {
  return store === "play" ? "Google Play" : "App Store";
}

/** Texto do botão, no idioma do site. */
export function storeCta(store: Store, language: string): string {
  if (store === "play") {
    return language === "pt" ? "Baixar na Play Store" : "Get it on Google Play";
  }
  return language === "pt" ? "Baixar na App Store" : "Download on the App Store";
}

/** Mantém o idioma da ficha da loja alinhado ao idioma que o visitante está lendo. */
export function localizedStoreLink(url: string, language: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("hl", language === "pt" ? "pt_BR" : "en_US");
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Rótulo pronto para qualquer link: nome da loja, ou o domínio limpo. */
export function linkLabelFor(url: string): string {
  const store = storeOf(url);
  return store ? storeLabel(store) : url.replace(/^https?:\/\//, "");
}
