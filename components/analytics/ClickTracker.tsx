"use client";

import { useEffect } from "react";
import { linkEvent, trackEvent } from "@/lib/analytics";

/**
 * Mede os cliques que levam a um lead: WhatsApp, redes, e-mail e entradas no
 * orçamento e nos serviços, de qualquer lugar do site. Um listener só, em vez
 * de um track() em cada botão: link novo já entra na conta sozinho.
 *
 * `origem` vem do `data-origem` mais próximo (hero, menu...) pra saber QUAL
 * botão converte; sem marcação, fica "pagina".
 *
 * Captura no window: roda antes do listener da saída suave (document), que
 * cancela o clique pra animar. Por isso não olha `defaultPrevented`.
 */
export default function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 && e.button !== 1) return;
      const a = (e.target as HTMLElement).closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const ev = linkEvent(a.href);
      if (!ev) return;
      const origem =
        a.closest<HTMLElement>("[data-origem]")?.dataset.origem ?? "pagina";
      trackEvent(ev.name, {
        ...ev.props,
        origem,
        pagina: window.location.pathname,
      });
    };
    // auxclick: botão do meio (abrir em nova aba) também é intenção
    window.addEventListener("click", onClick, true);
    window.addEventListener("auxclick", onClick, true);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  return null;
}
