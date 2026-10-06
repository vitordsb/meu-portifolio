"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Company, ProductKind } from "@/lib/companies";
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

/** Print web numa moldura de navegador, cortado embaixo como vitrine. */
function WebShot({ src, url }: { src: string; url: string | null }) {
  return (
    <div className="absolute inset-x-[6%] bottom-0 top-[17%] overflow-hidden rounded-t-xl border border-b-0 border-black/10 bg-white shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
      <div className="flex h-6 items-center gap-1.5 border-b border-black/10 bg-[#f4f4f5] px-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        {url && (
          <span className="ml-2 truncate font-mono text-[0.75rem] text-neutral-500">
            {linkLabelFor(url)}
          </span>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="h-full w-full select-none object-cover object-top"
      />
    </div>
  );
}

/** Arte vertical do app, em pé no centro, como peça de divulgação. */
function AppShot({ src }: { src: string }) {
  return (
    <div className="absolute left-1/2 top-[17%] h-[78%] -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="h-full w-auto select-none rounded-2xl object-cover shadow-2xl ring-1 ring-black/10"
      />
    </div>
  );
}

/**
 * App privado, sem print público: um celular ILUSTRATIVO (blocos neutros, não
 * tela de verdade) com o selo "Privado". Fica no nível visual dos outros
 * cards sem fingir que é o app real.
 */
function PrivateAppShot({ title, pt }: { title: string; pt: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-high to-surface-container">
      <div className="relative h-[78%] translate-y-[8%] transition-transform duration-500 group-hover:translate-y-[6%]">
        <div className="flex h-full aspect-[9/19] flex-col gap-2 rounded-[1.6rem] border-[5px] border-on-surface/80 bg-surface p-3 shadow-2xl">
          <div className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-on-surface/15" />
          <div className="h-3 w-2/3 rounded bg-on-surface/15" />
          <div className="h-2 w-1/2 rounded bg-on-surface/10" />
          <div className="mt-1 grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-on-surface/[0.07]"
              />
            ))}
          </div>
          <div className="h-2 w-3/4 rounded bg-on-surface/10" />
          <div className="h-2 w-2/3 rounded bg-on-surface/10" />
        </div>
        <span className="absolute -right-3 top-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-on-primary shadow-lg">
          <Lock size={11} />
          {pt ? "Privado" : "Private"}
        </span>
      </div>
      <span className="sr-only">
        {title}:{" "}
        {pt ? "produto privado, ilustração" : "private product, illustration"}
      </span>
    </div>
  );
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
  const kind = product.kind;
  const hasSite = products.some((p) => p.kind === "site");
  const period = company.period;
  const link = product.link;
  const store = storeOf(link);

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-low transition-colors hover:border-on-surface/30">
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
            {product.cover ? (
              <>
                {/* Fundo: a própria imagem, borrada, dá a cor do produto */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.cover}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="absolute inset-0 h-full w-full scale-125 select-none object-cover opacity-70 blur-2xl"
                />
                {kind === "app" ? (
                  <AppShot src={product.cover} />
                ) : (
                  <WebShot src={product.cover} url={link} />
                )}
              </>
            ) : (
              <PrivateAppShot title={product.title} pt={pt} />
            )}
          </motion.div>
        </AnimatePresence>

        {products.length > 1 && (
          <div
            data-no-swipe
            className="absolute left-3 top-3 z-10 inline-flex rounded-full border border-outline-variant bg-surface/90 p-0.5 backdrop-blur"
          >
            {products.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                title={p.title}
                className={`h-7 rounded-full px-3 text-xs font-medium transition-colors ${
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
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono text-[0.75rem] leading-snug text-on-surface-variant">
          <span className="uppercase tracking-[0.12em]">
            {company.sector[language]}
          </span>
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

        <p className="mb-5 text-sm leading-relaxed text-on-surface-variant md:text-base">
          {company.about[language]}
        </p>

        {/* O que EU fiz lá: é isso que vende "Crie um software" */}
        <dl className="mb-6 flex-1 space-y-3">
          <div>
            <dt className="mb-1 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-on-surface-variant">
              {pt ? "O que foi entregue" : "What was delivered"}
            </dt>
            <dd className="text-sm leading-relaxed md:text-base">
              {company.role[language]}
            </dd>
          </div>
          {company.result && (
            <div>
              <dt className="mb-1 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-on-surface-variant">
                {pt ? "Resultado" : "Result"}
              </dt>
              <dd className="text-sm font-semibold leading-relaxed md:text-base">
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
              className="inline-flex h-9 items-center gap-2 rounded-md border border-outline-variant px-3 text-sm font-medium transition-colors hover:border-on-surface hover:bg-surface-high"
            >
              {store ? storeCta(store, language) : linkLabelFor(link)}
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="inline-flex h-9 items-center gap-2 rounded-md bg-surface-high px-3 text-sm text-on-surface-variant">
              <Lock size={13} />
              {product.title}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
