"use client";

import Link from "next/link";
import { LayoutGroup, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import SearchHint from "@/components/SearchHint";
import FontSizeButton from "@/components/a11y/FontSizeButton";
import AvatarMenu from "./AvatarMenu";

/**
 * Menu de topo da home no desktop (variante `deck-wide`). O menu do canto
 * inferior ficava escondido: no PC tem espaço, então as sessões e as portas
 * de venda ficam sempre à vista, com nome escrito. No celular segue o
 * rodapé (pontos + menu), que é onde o polegar alcança.
 *
 * A barra é um container query em rem: com a letra no "Maior" o rem cresce
 * e os itens menos importantes saem antes de qualquer coisa se sobrepor.
 * Ordem de saída: nome e "Letra:" -> "Serviços" (fica no menu) -> texto
 * longo do orçamento e o "Normal" do botão de letra. As sessões nunca saem.
 */
export default function DeckTopNav({
  current,
  labels,
  onChange,
  language,
}: {
  current: number;
  labels: string[];
  onChange: (index: number) => void;
  language: "pt" | "en";
}) {
  const pt = language === "pt";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden deck-wide:block">
      <div className="@container pointer-events-auto mx-auto flex h-20 max-w-[max(var(--deck-frame),84rem)] items-center gap-4 px-12">
        <button
          type="button"
          onClick={() => onChange(0)}
          className="hidden shrink-0 text-base font-extrabold tracking-[-0.03em] transition-opacity hover:opacity-70 @min-[70rem]:block"
        >
          Vitor de Souza
        </button>

        <nav
          aria-label={pt ? "Sessões do portfólio" : "Portfolio sections"}
          className="flex flex-1 justify-center"
        >
          <LayoutGroup id="deck-topnav">
            <ul className="flex w-fit items-center gap-1 rounded-full border border-outline-variant bg-surface/90 p-1 backdrop-blur">
              {labels.map((label, i) => {
                const active = i === current;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => onChange(i)}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-flex h-10 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium @min-[59rem]:px-4 transition-colors ${
                        active
                          ? "text-on-primary"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="topnav-pill"
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 38,
                          }}
                        />
                      )}
                      <span className="relative">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <SearchHint variant="icon" />
          <FontSizeButton
            prefixClass="hidden @min-[70rem]:inline"
            valueClass="hidden @min-[53rem]:inline"
          />
          <Link
            href="/servicos"
            className="hidden h-11 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-high @min-[59rem]:inline-flex"
          >
            {pt ? "Serviços" : "Services"}
          </Link>
          <Link
            href="/orcamento"
            className="btn btn-filled h-11 rounded-full px-5 text-sm"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles size={15} className="shrink-0" />
              <span>
                {pt ? "Orçamento" : "Free quote"}
                {pt && (
                  <span className="hidden @min-[53rem]:inline"> grátis</span>
                )}
              </span>
            </span>
          </Link>
          <AvatarMenu side="bottom" />
        </div>
      </div>
    </header>
  );
}
