"use client";

import { useCallback, useRef } from "react";
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

/**
 * Botão do canto inferior esquerdo: o menu do site (páginas internas, tema e
 * idioma). Era a foto do Vitor; a foto foi pro banner, ao lado do "UI/UX".
 *
 * Easter egg herdado da rail: 7 cliques em 3s levam pro /admin.
 */
export default function AvatarMenu({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, cycleTheme } = useTheme();
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

  const pages = [
    { href: "/", label: pt ? "Início" : "Home" },
    { href: "/about", label: t("nav.about") },
    { href: "/autonomo", label: t("nav.autonomo") },
    { href: "/skills", label: t("nav.skills") },
    { href: "/certificates", label: t("nav.certificates") },
    { href: "/cv", label: "CV" },
  ];

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const item =
    "flex h-10 cursor-pointer select-none items-center justify-between gap-3 rounded-md px-3 text-sm outline-none " +
    "data-[highlighted]:bg-surface-high";

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        onClick={countClick}
        aria-label={pt ? "Abrir menu" : "Open menu"}
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface/90 text-on-surface backdrop-blur transition-colors hover:border-on-surface/40 data-[state=open]:border-on-surface sm:h-12 sm:w-12 ${className ?? ""}`}
      >
        <MenuIcon size={18} />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content
          side="top"
          align="start"
          sideOffset={12}
          className="z-[90] w-52 rounded-xl border border-outline-variant bg-surface p-1.5 text-on-surface elev-3 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2"
        >
          {pages.map((p) => {
            const active =
              p.href === "/" ? pathname === "/" : pathname.startsWith(p.href);
            return (
              <Menu.Item key={p.href} asChild>
                <Link
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
                </Link>
              </Menu.Item>
            );
          })}

          <Menu.Separator className="my-1 h-px bg-outline-variant" />

          {/* preventDefault no onSelect mantém o menu aberto pra ver a troca */}
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
