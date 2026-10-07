"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  FolderKanban,
  MessageCircle,
  Package,
  ScanSearch,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHeader from "@/components/payments/PageHeader";
import { trackEvent } from "@/lib/analytics";
import { whatsappHref } from "@/lib/home-links";
import { HOME_TARGET, matchNotFound, type NotFoundTarget } from "@/lib/not-found-match";

/** Segundos até o redirecionamento automático. */
const SECONDS = 8;

const FRAME = "mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12";

type Shortcut = { href: string; icon: LucideIcon; title: { pt: string; en: string }; text: { pt: string; en: string }; external?: boolean };

const SHORTCUTS: Shortcut[] = [
  {
    href: "/orcamento",
    icon: Sparkles,
    title: { pt: "Orçamento grátis", en: "Free quote" },
    text: { pt: "Conta a ideia e recebe o valor de partida em 2 minutos.", en: "Tell us the idea and get a starting price in 2 minutes." },
  },
  {
    href: "/#projetos",
    icon: FolderKanban,
    title: { pt: "Projetos entregues", en: "Delivered projects" },
    text: { pt: "O problema de cada cliente e o que a gente fez.", en: "Each client's problem and what we did." },
  },
  {
    href: "/servicos",
    icon: Package,
    title: { pt: "Serviços com preço fechado", en: "Fixed-price services" },
    text: { pt: "Escolhe, paga com Pix ou cartão e a gente começa.", en: "Pick one, pay by Pix or card and we start." },
  },
  {
    href: "/raio-x",
    icon: ScanSearch,
    title: { pt: "Raio-X grátis do seu site", en: "Free website check" },
    text: { pt: "O que afasta clientes do seu site, em 30 segundos.", en: "What drives customers away from your site, in 30 seconds." },
  },
  {
    href: "/quanto-custa",
    icon: Calculator,
    title: { pt: "Quanto custa um site ou app", en: "How much a site or app costs" },
    text: { pt: "Valores de partida e o que faz o preço mudar.", en: "Starting prices and what changes them." },
  },
];

/**
 * Página 404 (pedido do Vitor, 07/out/2026). Mostra o endereço que não
 * existe, sugere a página mais parecida e leva pra ela sozinha em alguns
 * segundos. Qualquer sinal de que a pessoa está lendo (rolar, clicar, teclar)
 * pausa a contagem: ninguém é arrastado no meio da leitura. Status continua
 * 404 pro Google; cada visita vira evento no Umami pra achar link quebrado.
 */
export default function NotFoundPage() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const target: NotFoundTarget = useMemo(() => matchNotFound(pathname) ?? HOME_TARGET, [pathname]);
  const [left, setLeft] = useState(SECONDS);
  const [paused, setPaused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const best = target;

  // Cada 404 vira evento: mostra link quebrado e endereço digitado errado
  useEffect(() => {
    trackEvent("pagina_404", { caminho: pathname.slice(0, 120), destino: target.href });
  }, [pathname, target.href]);

  // Contagem: para com a aba escondida e quando a pessoa interage
  useEffect(() => {
    if (paused) return;
    const tick = setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(tick);
  }, [target, paused]);

  useEffect(() => {
    if (left <= 0 && !paused) router.replace(target.href);
  }, [left, paused, target, router]);

  useEffect(() => {
    if (paused) return;
    const stop = (e: Event) => {
      // Clique dentro do quadro de redirecionamento é decisão, não leitura
      if (e.target instanceof Node && boxRef.current?.contains(e.target)) return;
      setPaused(true);
    };
    const onScroll = () => window.scrollY > 24 && setPaused(true);
    window.addEventListener("pointerdown", stop);
    window.addEventListener("keydown", stop);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("scroll", onScroll);
    };
  }, [paused]);

  const isHome = best.href === "/";
  const where = best.label[language];
  const progress = paused ? 1 : left / SECONDS;

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <PageHeader />

      <main className={`${FRAME} pb-24 pt-10 sm:pt-16 [@media(max-height:500px)]:pt-6`}>
        <div className="max-w-3xl">
          <p aria-hidden className="text-[clamp(5rem,18vw,10rem)] font-semibold leading-none tracking-[-0.06em] text-on-surface/15">
            404
          </p>
          <h1 className="mt-4 text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            {pt ? "Essa página não existe." : "This page doesn't exist."}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
            {pt ? "O endereço " : "The address "}
            <span className="break-all font-mono text-base text-on-surface">{pathname}</span>
            {pt
              ? " pode ter mudado de lugar ou sido digitado com algum erro. Acontece."
              : " may have moved or been mistyped. It happens."}
          </p>
        </div>

        {/* Redirecionamento: a decisão fica sempre na mão da pessoa */}
        <div ref={boxRef} className="mt-10 max-w-3xl border border-outline-variant bg-surface-low">
          <div className="p-6 sm:p-7">
            <p className="text-lg leading-snug">
              {isHome
                ? pt
                  ? "Vamos te levar pro início do site."
                  : "We'll take you to the homepage."
                : pt
                  ? "Parece que você procurava "
                  : "Looks like you were after "}
              {!isHome && <strong className="font-semibold">{where}</strong>}
              {!isHome && "."}
            </p>
            <p className="mt-1.5 text-base text-on-surface-variant" aria-live="polite">
              {paused
                  ? pt
                    ? "Redirecionamento pausado. Fica à vontade."
                    : "Redirect paused. Take your time."
                  : pt
                    ? `Indo pra lá em ${left} ${left === 1 ? "segundo" : "segundos"}.`
                    : `Going there in ${left} ${left === 1 ? "second" : "seconds"}.`}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={best.href}
                replace
                className="btn btn-filled h-12 rounded-none px-6 text-base"
              >
                <span className="inline-flex items-center gap-2">
                  {isHome ? (pt ? "Ir pro início agora" : "Go home now") : pt ? "Ir agora" : "Go now"}
                  <ArrowRight size={18} />
                </span>
              </Link>
              {!paused && (
                <button
                  type="button"
                  onClick={() => setPaused(true)}
                  className="btn btn-outlined h-12 rounded-none px-6 text-base"
                >
                  {pt ? "Ficar nesta página" : "Stay on this page"}
                </button>
              )}
              {!isHome && (
                <Link href="/" className="link-underline px-1 text-base">
                  {pt ? "Ou voltar pro início" : "Or go to the homepage"}
                </Link>
              )}
            </div>
          </div>
          {/* Linha que encurta com o tempo */}
          <div aria-hidden className="h-1 bg-on-surface/10">
            <div
              className="h-full bg-on-surface transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
              style={{ width: `${progress * 100}%`, opacity: paused ? 0 : 1 }}
            />
          </div>
        </div>

        <section aria-labelledby="atalhos" className="mt-16">
          <h2 id="atalhos" className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
            {pt ? "Ou escolha pra onde ir" : "Or pick where to go"}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHORTCUTS.map((s) => (
              <li key={s.href} className="flex">
                <Link
                  href={s.href}
                  className="group flex w-full flex-col border border-outline-variant bg-surface-low p-6 transition-colors hover:border-on-surface/40"
                >
                  <s.icon size={24} className="shrink-0" />
                  <span className="mt-5 text-lg font-semibold leading-snug">{s.title[language]}</span>
                  <span className="mt-1.5 text-base leading-relaxed text-on-surface-variant">{s.text[language]}</span>
                  <span className="mt-auto pt-5">
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
            <li className="flex">
              <a
                href={whatsappHref(pt)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full flex-col border border-outline-variant bg-surface-low p-6 transition-colors hover:border-on-surface/40"
              >
                <MessageCircle size={24} className="shrink-0" />
                <span className="mt-5 text-lg font-semibold leading-snug">
                  {pt ? "Falar no WhatsApp" : "Chat on WhatsApp"}
                </span>
                <span className="mt-1.5 text-base leading-relaxed text-on-surface-variant">
                  {pt ? "Não achou o que procurava? Pergunta pra gente." : "Didn't find it? Just ask us."}
                </span>
                <span className="mt-auto pt-5">
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
