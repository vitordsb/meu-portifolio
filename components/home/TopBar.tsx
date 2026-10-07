"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Globe, Menu, MessageCircle, Monitor, Moon, Sparkles, Sun, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { BRAND } from "@/lib/site";
import { FONT_LABELS, useFontScale } from "@/lib/font-scale";
import { whatsappHref } from "@/lib/home-links";
import SearchHint from "@/components/SearchHint";

/** Links da barra: só o essencial, como nas referências (apparicio, ajota). */
export const TOP_LINKS = [
  { id: "servicos", pt: "Serviços", en: "Services" },
  { id: "projetos", pt: "Projetos", en: "Projects" },
  { id: "como-funciona", pt: "Como funciona", en: "How it works" },
  { id: "duvidas", pt: "Dúvidas", en: "FAQ" },
];

/**
 * Barra fina no topo da home (substituiu o menu lateral em 06/out/2026: o
 * Vitor não gostou da barra lateral). Container query em rem: com a letra
 * grande ou tela estreita, os links viram o botão "Menu" antes de apertar. Desktop: marca, links das sessões com
 * a ativa marcada, busca, tema, idioma e "Orçamento grátis" (a letra fica no
 * rodapé e no Menu, pedido do Vitor). Celular: marca e um
 * "Menu" que abre os links em tela cheia, com letra grande.
 */
export default function TopBar({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (id: string) => void;
}) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, cycleTheme } = useTheme();
  const font = useFontScale();
  const pt = language === "pt";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    // Espera o menu fechar (e destravar a rolagem) antes de deslizar
    setTimeout(() => onSelect(id), 10);
  };

  const pref =
    "flex h-14 w-full items-center justify-between rounded-xl border border-outline-variant px-4 text-base";

  return (
    <header
      className={`sticky top-0 z-[60] border-b bg-surface/85 backdrop-blur transition-colors ${
        scrolled ? "border-outline-variant" : "border-transparent"
      }`}
    >
      <div className="@container mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => onSelect("inicio")}
          className="min-w-0 truncate text-lg font-extrabold tracking-[-0.03em]"
        >
          {BRAND.name}
        </button>

        <nav aria-label={pt ? "Sessões" : "Sections"} className="ml-auto hidden @min-[62rem]:block">
          <ul className="flex items-center gap-1">
            {TOP_LINKS.map((l) => {
              const active = current === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelect(l.id);
                    }}
                    aria-current={active ? "true" : undefined}
                    className={`inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-base transition-colors ${
                      active ? "bg-surface-high font-semibold text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {l[language]}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 @min-[62rem]:ml-0">
          <span className="hidden @min-[62rem]:block">
            <SearchHint variant="icon" />
          </span>
          {/* Tema e idioma à mão; a letra fica no Menu e no rodapé */}
          <span className="hidden items-center gap-2 @min-[40rem]:flex">
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`${t("common.theme.label")}: ${t(`common.theme.${theme}`)}`}
              title={`${t("common.theme.label")}: ${t(`common.theme.${theme}`)}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant transition-colors hover:border-on-surface/40"
            >
              <ThemeIcon size={18} />
            </button>
            <button
              type="button"
              onClick={() => setLanguage(pt ? "en" : "pt")}
              aria-label={pt ? "Mudar para inglês" : "Switch to Portuguese"}
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-outline-variant px-3.5 text-sm font-semibold transition-colors hover:border-on-surface/40"
            >
              <Globe size={16} />
              {language.toUpperCase()}
            </button>
          </span>
          <Link href="/orcamento" className="btn btn-filled hidden h-11 rounded-full px-5 text-base @min-[34rem]:inline-flex">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} className="shrink-0" />
              {pt ? "Orçamento grátis" : "Free quote"}
            </span>
          </Link>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-outline-variant px-4 text-base font-semibold @min-[62rem]:hidden"
              >
                <Menu size={18} />
                Menu
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[90] bg-scrim/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
              <Dialog.Content className="fixed inset-0 z-[91] flex flex-col overflow-y-auto bg-surface px-5 pb-8 pt-4 text-on-surface data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-4 sm:px-8">
                <div className="flex h-12 items-center justify-between">
                  <Dialog.Title className="text-lg font-extrabold tracking-[-0.03em]">{BRAND.name}</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label={pt ? "Fechar menu" : "Close menu"}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant"
                    >
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">{pt ? "Navegação do site" : "Site navigation"}</Dialog.Description>

                <nav className="mt-8">
                  <ul className="flex flex-col">
                    {[{ id: "inicio", pt: "Início", en: "Home" }, ...TOP_LINKS].map((l) => (
                      <li key={l.id} className="border-b border-outline-variant">
                        <a
                          href={`#${l.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            go(l.id);
                          }}
                          className={`flex h-16 items-center text-3xl tracking-[-0.03em] ${
                            current === l.id ? "font-bold" : "font-medium"
                          }`}
                        >
                          {l[language]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8 grid gap-3">
                  <Link href="/orcamento" onClick={() => setOpen(false)} className="btn btn-filled h-14 rounded-xl text-base">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles size={18} />
                      {pt ? "Orçamento grátis em 2 min" : "Free quote in 2 min"}
                    </span>
                  </Link>
                  <a href={whatsappHref(pt)} target="_blank" rel="noopener noreferrer" className="btn btn-outlined h-14 rounded-xl text-base">
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle size={18} />
                      {pt ? "Falar no WhatsApp" : "Chat on WhatsApp"}
                    </span>
                  </a>
                </div>

                <div className="mt-8 grid gap-2">
                  <button type="button" onClick={font.cycle} className={pref}>
                    <span className="flex items-center gap-3">
                      <span aria-hidden className="w-5 text-center font-semibold">
                        A<span className="text-[1.25em]">A</span>
                      </span>
                      {pt ? "Tamanho da letra" : "Text size"}
                    </span>
                    <span className="text-on-surface-variant">{FONT_LABELS[language][font.index]}</span>
                  </button>
                  <button type="button" onClick={cycleTheme} className={pref}>
                    <span className="flex items-center gap-3">
                      <ThemeIcon size={20} />
                      {t("common.theme.label")}
                    </span>
                    <span className="text-on-surface-variant">{t(`common.theme.${theme}`)}</span>
                  </button>
                  <button type="button" onClick={() => setLanguage(pt ? "en" : "pt")} className={pref}>
                    <span className="flex items-center gap-3">
                      <Globe size={20} />
                      {t("common.language")}
                    </span>
                    <span className="font-mono text-on-surface-variant">{language.toUpperCase()}</span>
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
