"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  Monitor,
  Globe,
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Code2,
  Award,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface NavbarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Navigation rail (M3). Colapsada é a rail de 80px com indicador pill de 56x32
 * e label abaixo do ícone. Expandida vira o navigation drawer de 360px, com
 * itens em pill de 56 de altura. Fundo transparente nas duas: quem separa a
 * navegação do conteúdo é o indicador, não uma superfície.
 */
export default function Navbar({ collapsed = false, onToggle }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, cycleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Easter egg: 7 cliques em 3s abrem o painel admin.
  // Gatilho: logo (mobile) ou botão de colapsar (desktop, que não tem logo).
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleLogoClick = useCallback(() => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 3000);
    if (clickCount.current >= 7) {
      clickCount.current = 0;
      router.push("/admin");
    }
  }, [router]);

  type NavLink = { href: string; label: string; icon: LucideIcon };
  const links: NavLink[] = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/about", label: t("nav.about"), icon: User },
    { href: "/autonomo", label: t("nav.autonomo"), icon: Briefcase },
    { href: "/skills", label: t("nav.skills"), icon: Code2 },
    { href: "/certificates", label: t("nav.certificates"), icon: Award },
    { href: "/cv", label: "CV", icon: FileText },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Ícone e rótulo refletem o estado atual; o clique avança pro próximo.
  const themeIcon =
    theme === "light" ? <Sun size={22} /> : theme === "dark" ? <Moon size={22} /> : <Monitor size={22} />;
  const themeLabel = t(`common.theme.${theme}`);

  const ThemeBtn = (
    <button
      onClick={cycleTheme}
      className="icon-btn"
      title={`${t("common.theme.label")}: ${themeLabel}`}
      aria-label={`${t("common.theme.label")}: ${themeLabel}`}
    >
      {themeIcon}
    </button>
  );

  const LangBtn = (
    <button
      onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      className="icon-btn"
      title={`${t("common.language")} (${language.toUpperCase()})`}
      aria-label={`${t("common.language")} (${language.toUpperCase()})`}
    >
      <Globe size={22} />
    </button>
  );

  // O avatar com a inicial só faz sentido no drawer do desktop. Na barra do
  // celular ele competia com a foto do hero logo abaixo, então fica só o nome.
  const renderLogo = (withAvatar: boolean) => (
    <Link
      href="/"
      onClick={handleLogoClick}
      className="flex select-none items-center gap-3"
    >
      {withAvatar && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container font-display text-base font-bold text-on-primary-container">
          v
        </span>
      )}
      <span className="title-large">vitordsb</span>
    </Link>
  );

  return (
    <>
      {/* ─── Top app bar (< lg) ──────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-surface/85 backdrop-blur-xl lg:hidden">
        <div className="container flex h-16 items-center justify-between">
          {renderLogo(false)}
          <div className="flex items-center gap-1">
            {ThemeBtn}
            {LangBtn}
            <button
              className="icon-btn"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menu: lista de navegação em pills, como o drawer M3 */}
        {mobileOpen && (
          <div className="container pb-3">
            <ul className="flex flex-col gap-1 rounded-lg bg-surface-container p-3 elev-2">
              {links.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className={`nav-item h-14 gap-3 rounded-full px-4 ${
                        active ? "nav-item-active" : ""
                      }`}
                    >
                      {active && <span className="nav-indicator" />}
                      <l.icon size={24} className="shrink-0" />
                      <span className="label-large">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* ─── Navigation rail / drawer (lg+) ──────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden flex-col bg-transparent transition-[width] duration-300 lg:flex ${
          collapsed ? "w-20" : "w-90"
        }`}
        style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
      >
        {/* Cabeçalho: só existe no drawer expandido */}
        {!collapsed && <div className="px-7 pb-2 pt-6">{renderLogo(true)}</div>}

        <nav className={`flex-1 overflow-y-auto ${collapsed ? "px-3 pt-8" : "px-3 pt-4"}`}>
          <ul className={`flex flex-col ${collapsed ? "gap-3" : "gap-1"}`}>
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    title={collapsed ? l.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={
                      collapsed
                        ? `nav-item flex-col gap-1 py-1 ${active ? "nav-item-active" : ""}`
                        : `nav-item h-14 gap-3 rounded-full px-6 ${active ? "nav-item-active" : ""}`
                    }
                  >
                    {collapsed ? (
                      <>
                        {/* Indicador pill de 56x32 com o ícone dentro */}
                        <span className="relative flex h-8 w-14 items-center justify-center">
                          {active && <span className="nav-indicator" />}
                          <l.icon size={24} />
                        </span>
                        <span className="label-medium text-center">{l.label}</span>
                      </>
                    ) : (
                      <>
                        {active && <span className="nav-indicator" />}
                        <l.icon size={24} className="shrink-0" />
                        <span className="label-large">{l.label}</span>
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={`flex gap-1 pb-6 ${
            collapsed ? "flex-col items-center px-3" : "items-center px-6"
          }`}
        >
          {ThemeBtn}
          {LangBtn}
          {onToggle && (
            <button
              onClick={() => {
                onToggle();
                handleLogoClick();
              }}
              className="icon-btn"
              title={collapsed ? "Expandir menu" : "Recolher menu"}
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
