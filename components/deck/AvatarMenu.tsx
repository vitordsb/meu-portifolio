"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Menu from "@radix-ui/react-dropdown-menu";
import {
  ArrowUpRight,
  Globe,
  Menu as MenuIcon,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FONT_LABELS, useFontScale } from "@/lib/font-scale";

/**
 * Botão do canto inferior esquerdo: o menu do site (sessões da home, portas
 * de venda, tema e idioma). Era a foto do Vitor; a foto foi pro banner, ao lado do "UI/UX".
 *
 * Easter egg herdado da rail: 7 cliques em 3s levam pro /admin.
 */
export default function AvatarMenu({
  className,
  side = "top",
}: {
  className?: string;
  /** "bottom" quando o botão mora no menu de topo da home (desktop). */
  side?: "top" | "bottom";
}) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, cycleTheme } = useTheme();
  const font = useFontScale();
  const router = useRouter();
  const pathname = usePathname();
  const pt = language === "pt";

  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countClick = useCallback(() => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => (clicks.current = 0), 3000);
    if (clicks.current >= 7) {
      clicks.current = 0;
      router.push("/admin");
    }
  }, [router]);

  // Portfólio = sessões da home (o deck escuta o #); "Trabalhe comigo" = as
  // portas de venda. As páginas internas antigas (/about, /cv...) saíram do
  // menu em 02/out/2026: o conteúdo delas já vive na home.
  const groups: { label: string; items: { href: string; label: string }[] }[] =
    [
      {
        label: pt ? "Portfólio" : "Portfolio",
        items: [
          { href: "/", label: pt ? "Início" : "Home" },
          { href: "/#experiencia", label: pt ? "Experiência" : "Experience" },
          {
            href: "/#especializacoes",
            label: pt ? "Especializações" : "Expertise",
          },
          { href: "/#trajetoria", label: pt ? "Trajetória" : "Journey" },
        ],
      },
      {
        label: pt ? "Trabalhe comigo" : "Work with me",
        items: [
          { href: "/servicos", label: pt ? "Serviços e preços" : "Services" },
          { href: "/orcamento", label: pt ? "Orçamento com IA" : "AI quote" },
          { href: "/raio-x", label: pt ? "Raio-X grátis do site" : "Free site check" },
          { href: "/pagar", label: pt ? "Pagar pedido" : "Pay order" },
        ],
      },
    ];

  // O # muda sem re-render (o deck usa replaceState): lê ao abrir o menu
  const [hash, setHash] = useState("");
  const isActive = (href: string) => {
    if (!href.startsWith("/#") && href !== "/")
      return pathname.startsWith(href);
    if (pathname !== "/") return false;
    const current = hash && hash !== "#inicio" ? hash : "";
    return href === "/" ? current === "" : href.slice(1) === current;
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const item =
    "flex h-11 cursor-pointer select-none items-center justify-between gap-3 rounded-md px-3 text-sm outline-none [@media(max-height:500px)]:h-9 " +
    "data-[highlighted]:bg-surface-high";

  return (
    <Menu.Root
      modal={false}
      onOpenChange={(open) => open && setHash(window.location.hash)}
    >
      <Menu.Trigger
        onClick={countClick}
        aria-label={pt ? "Abrir menu" : "Open menu"}
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface/90 text-on-surface backdrop-blur transition-colors hover:border-on-surface/40 data-[state=open]:border-on-surface sm:h-12 sm:w-12 ${className ?? ""}`}
      >
        <MenuIcon size={18} />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content
          data-origem="menu"
          side={side}
          align={side === "top" ? "start" : "end"}
          sideOffset={12}
          collisionPadding={8}
          className="z-[90] max-h-[var(--radix-dropdown-menu-content-available-height)] w-56 overflow-y-auto overscroll-contain rounded-xl border border-outline-variant bg-surface p-1.5 text-on-surface elev-3 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2"
        >
          {groups.map((g) => (
            <Menu.Group key={g.label}>
              <Menu.Label className="px-3 pb-1 pt-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-on-surface-variant">
                {g.label}
              </Menu.Label>
              {g.items.map((p) => {
                const active = isActive(p.href);
                // Link do Next com # na mesma página não dispara hashchange:
                // <a> comum deixa o navegador avisar o deck.
                const Anchor = p.href.startsWith("/#") ? "a" : Link;
                return (
                  <Menu.Item key={p.href} asChild>
                    <Anchor
                      href={p.href}
                      className={item}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className={active ? "font-semibold" : ""}>
                        {p.label}
                      </span>
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      ) : (
                        <ArrowUpRight
                          size={14}
                          className="text-on-surface-variant"
                        />
                      )}
                    </Anchor>
                  </Menu.Item>
                );
              })}
            </Menu.Group>
          ))}

          <Menu.Separator className="my-1 h-px bg-outline-variant" />

          {/* preventDefault no onSelect mantém o menu aberto pra ver a troca */}
          <Menu.Item
            className={item}
            onSelect={(e) => {
              e.preventDefault();
              font.cycle();
            }}
          >
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="w-4 text-center text-[0.8125rem] font-semibold leading-none">
                A<span className="text-[1.25em]">A</span>
              </span>
              {pt ? "Tamanho da letra" : "Text size"}
            </span>
            <span className="text-xs text-on-surface-variant">
              {FONT_LABELS[language][font.index]}
            </span>
          </Menu.Item>
          <Menu.Item
            className={item}
            onSelect={(e) => {
              e.preventDefault();
              cycleTheme();
            }}
          >
            <span className="flex items-center gap-2.5">
              <ThemeIcon size={16} />
              {t("common.theme.label")}
            </span>
            <span className="text-xs text-on-surface-variant">
              {t(`common.theme.${theme}`)}
            </span>
          </Menu.Item>
          <Menu.Item
            className={item}
            onSelect={(e) => {
              e.preventDefault();
              setLanguage(pt ? "en" : "pt");
            }}
          >
            <span className="flex items-center gap-2.5">
              <Globe size={16} />
              {t("common.language")}
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              {language.toUpperCase()}
            </span>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
