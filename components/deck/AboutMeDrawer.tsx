"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, X } from "lucide-react";
import { JOURNEY, JOURNEY_KIND_LABEL } from "@/lib/journey";

/**
 * "Conheça sobre mim" (etiqueta "Pessoal"): o cartão fica na sessão
 * Trajetória, no lugar do antigo "Ver currículo", e abre um painel lateral
 * com a linha do tempo. A trajetória vira algo que a pessoa escolhe ver.
 */
export default function AboutMeDrawer({ language }: { language: "pt" | "en" }) {
  const pt = language === "pt";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group flex w-full items-center justify-between gap-6 rounded-xl border border-outline-variant bg-surface-container-low p-6 text-left transition-colors hover:border-on-surface/40 md:p-8"
        >
          <span className="min-w-0">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
              {pt ? "Pessoal" : "Personal"}
            </span>
            <span className="block text-2xl font-extrabold tracking-[-0.03em] md:text-3xl">
              {pt ? "Conheça sobre mim" : "Get to know me"}
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-on-surface-variant">
              {pt
                ? "De onde eu vim, onde estudei e com quem trabalhei."
                : "Where I came from, where I studied and who I worked with."}
            </span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline-variant transition-colors group-hover:border-on-surface group-hover:bg-primary group-hover:text-on-primary">
            <ArrowRight size={18} />
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-scrim/25 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-[95] flex w-[min(30rem,100vw)] flex-col border-l border-outline-variant bg-surface text-on-surface elev-5 duration-300 focus:outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
        >
          <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-6 pb-5 pt-6 md:px-8">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
                {pt ? "Pessoal" : "Personal"}
              </p>
              <Dialog.Title className="text-3xl font-extrabold tracking-[-0.03em]">
                {pt ? "Conheça sobre mim" : "Get to know me"}
              </Dialog.Title>
            </div>
            <Dialog.Close
              aria-label={pt ? "Fechar" : "Close"}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-8">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
              {pt ? "Trajetória" : "Journey"}
            </p>
            <ol className="relative border-l border-outline-variant">
              {JOURNEY.map((item) => (
                <li key={item.id} className="relative pb-8 pl-7 last:pb-0">
                  <span
                    aria-hidden
                    className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                      item.current
                        ? "bg-brand ring-4 ring-brand/15"
                        : "bg-outline"
                    }`}
                  />
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] tracking-[0.08em] text-on-surface-variant">
                      {item.period[language]}
                    </span>
                    <span className="rounded border border-outline-variant px-1.5 py-px font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">
                      {JOURNEY_KIND_LABEL[item.kind][language]}
                    </span>
                  </div>
                  <p className="text-base font-semibold leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {item.detail[language]}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
