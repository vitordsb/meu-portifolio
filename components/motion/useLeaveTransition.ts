"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Quanto a página leva pra desvanecer antes de navegar. */
export const LEAVE_MS = 180;

/**
 * Saída suave pra outra rota: clique num link interno que muda de página faz
 * a página atual desvanecer (quem usa aplica a opacidade com `leaving`) e só
 * então navega; a nova entra com a animação dela. Sem isso a página sumia de
 * uma vez. Captura no document: roda antes do onClick do <Link>, que respeita
 * o preventDefault.
 *
 * Fica de fora: link externo, nova aba, download, tecla modificadora, âncora
 * na própria página (/#experiencia na home) e quem pediu menos movimento.
 */
export function useLeaveTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [leaving, setLeaving] = useState(false);

  // Navegação dentro do mesmo layout (Serviços -> Orçamento) não desmonta
  // quem usa o hook: a página nova chega e a opacidade volta.
  useEffect(() => setLeaving(false), [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault();
      setLeaving(true);
      window.setTimeout(
        () => router.push(url.pathname + url.search + url.hash),
        LEAVE_MS,
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return leaving;
}
