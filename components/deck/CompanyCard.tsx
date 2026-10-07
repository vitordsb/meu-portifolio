"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Company, ProductKind } from "@/lib/companies";
import { PROJECT_SHOTS } from "@/lib/project-shots";
import ClayMockup from "@/components/home/ClayMockup";
import {
  linkLabelFor,
  localizedStoreLink,
  storeCta,
  storeOf,
} from "@/lib/store-links";

/**
 * Rótulo da aba. "Web" vira "Plataforma" quando a empresa também tem um site
 * institucional: aí "Web | Site" não diria nada.
 */
function tabLabel(kind: ProductKind, hasSite: boolean, pt: boolean): string {
  if (kind === "app") return "App";
  if (kind === "site") return "Site";
  return hasSite ? (pt ? "Plataforma" : "Platform") : "Web";
}




/**
 * Card de empresa da sessão "Experiência": quem é a empresa, não a stack.
 * Empresa com mais de um produto (site e app, plataforma e site) ganha abas
 * que trocam a imagem e o link no mesmo card.
 */
export default function CompanyCard({
  company,
  language,
}: {
  company: Company;
  language: "pt" | "en";
}) {
  const { products } = company;
  const pt = language === "pt";
  // Abre na primeira versão que tem imagem: privado sem print fica pra aba
  const firstWithCover = Math.max(
    0,
    products.findIndex((p) => p.cover),
  );
  const [active, setActive] = useState(firstWithCover);
  const product = products[active];
  const hasSite = products.some((p) => p.kind === "site");
  const period = company.period;
  const link = product.link;
  const store = storeOf(link);

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-none border border-outline-variant bg-surface-low transition-colors hover:border-on-surface/30">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-outline-variant bg-surface-high">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={product.title}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ClayMockup
              shots={product.slug ? PROJECT_SHOTS[product.slug] : undefined}
              label={product.title}
              className="h-full w-full"
            />
          </motion.div>
        </AnimatePresence>

        {products.length > 1 && (
          <div
            data-no-swipe
            className="absolute left-3 top-3 z-10 inline-flex rounded-none border border-outline-variant bg-surface/90 p-0.5 backdrop-blur"
          >
            {products.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                title={p.title}
                className={`h-7 rounded-none px-3 text-xs font-medium transition-colors ${
                  i === active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tabLabel(p.kind, hasSite, pt)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm text-on-surface-variant">
          <span>{company.sector[language]}</span>
          {period && <span className="shrink-0">{period}</span>}
        </div>

        <div className="mb-3 flex items-center gap-3">
          {/* Selo branco: logos coloridos e com fundo próprio ficam iguais
              no tema claro e no escuro */}
          <span className="flex h-10 shrink-0 items-center rounded-lg border border-outline-variant bg-white px-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={company.logo}
              alt=""
              aria-hidden
              draggable={false}
              className="h-6 w-auto max-w-[6.5rem] select-none object-contain"
            />
          </span>
          <h3 className="text-2xl font-extrabold tracking-[-0.03em] md:text-3xl">
            {company.name}
          </h3>
        </div>

        {/* História curta: o problema do cliente, o que a gente fez e, se
            houver número real, o resultado. Sem nome de tecnologia. */}
        <dl className="mb-6 flex-1 space-y-4">
          <div>
            <dt className="mb-1 text-sm font-semibold text-on-surface-variant">
              {pt ? "O problema" : "The problem"}
            </dt>
            <dd className="text-base leading-relaxed">
              {(company.problem ?? company.about)[language]}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-sm font-semibold text-on-surface-variant">
              {pt ? "O que a gente fez" : "What we did"}
            </dt>
            <dd className="text-base leading-relaxed">{company.role[language]}</dd>
          </div>
          {company.result && (
            <div>
              <dt className="mb-1 text-sm font-semibold text-on-surface-variant">
                {pt ? "Resultado" : "Result"}
              </dt>
              <dd className="text-base font-semibold leading-relaxed">
                {company.result[language]}
              </dd>
            </div>
          )}
        </dl>

        {/* Link da versão que está na tela */}
        <div className="border-t border-outline-variant pt-4">
          {link ? (
            <a
              href={store ? localizedStoreLink(link, language) : link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-none border border-outline-variant px-3 text-sm font-medium transition-colors hover:border-on-surface hover:bg-surface-high"
            >
              {store ? storeCta(store, language) : linkLabelFor(link)}
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="inline-flex h-9 items-center gap-2 rounded-none bg-surface-high px-3 text-sm text-on-surface-variant">
              <Lock size={13} />
              {product.title}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
