import type { ReactNode } from "react";
import Link from "next/link";
import PageHeader from "@/components/payments/PageHeader";
import { BRAND, CNPJ } from "@/lib/site";

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * Moldura da Política de Privacidade e dos Termos de Uso: resumo curto no
 * topo, índice e seções com letra grande. Só em português: são documentos
 * regidos pela lei brasileira (LGPD e Código de Defesa do Consumidor).
 */
export default function LegalPage({
  title,
  updated,
  summary,
  sections,
  other,
}: {
  title: string;
  /** Data por extenso: "6 de outubro de 2026". */
  updated: string;
  summary: string[];
  sections: LegalSection[];
  /** Link pro outro documento no rodapé. */
  other: { href: string; label: string };
}) {
  return (
    <>
      <PageHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:pt-14">
        <p className="text-sm text-on-surface-variant">Atualizado em {updated}</p>
        <h1 className="mt-2 text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
          {title}
        </h1>

        <section aria-label="Em poucas palavras" className="mt-8 border border-outline-variant bg-surface-low p-6">
          <h2 className="text-lg font-bold">Em poucas palavras</h2>
          <ul className="mt-3 space-y-2.5 text-base leading-relaxed">
            {summary.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-on-surface" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-label="Nesta página" className="mt-8">
          <p className="text-sm font-semibold text-on-surface-variant">Nesta página</p>
          <ol className="mt-3 grid gap-x-6 gap-y-2 text-base sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:underline">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-12">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="text-2xl font-bold tracking-[-0.02em]">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-on-surface/90 [&_a]:font-semibold [&_a]:text-on-surface [&_a]:underline [&_a]:underline-offset-2">{s.body}</div>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-outline-variant pt-8 text-base text-on-surface-variant">
          <p>
            {BRAND.name} · CNPJ {CNPJ} ·{" "}
            <a href={`mailto:${BRAND.email}`} className="underline">
              {BRAND.email}
            </a>
          </p>
          <p className="mt-3">
            Veja também:{" "}
            <Link href={other.href} className="font-semibold text-on-surface underline">
              {other.label}
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
}

/** Lista com marcador, no padrão das páginas legais. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-on-surface/70" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
