"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Code2,
  Award,
  Mail,
  Github,
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

export default function Navbar({ collapsed = false, onToggle }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Easter egg: click logo 7× within 3s → admin panel
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
    { href: "/contact", label: t("nav.contact"), icon: Mail },
  ];

  const externalLinks = [
    { href: "https://github.com/vitordsb", label: t("nav.github"), icon: Github },
  ];

  const LogoFull = (
    <Link
      href="/"
      onClick={handleLogoClick}
      className="font-mono font-black tracking-tighter hover:text-accent transition select-none text-xl whitespace-nowrap"
    >
      <span className="text-accent">&lt;</span>
      vitordsb
      <span className="text-accent">/&gt;</span>
    </Link>
  );

  const LogoMini = (
    <Link
      href="/"
      onClick={handleLogoClick}
      className="font-mono font-black tracking-tighter hover:text-accent transition select-none text-xl flex justify-center"
      title="vitordsb"
    >
      <span className="text-accent">&lt;/&gt;</span>
    </Link>
  );

  const ThemeBtn = (
    <button
      onClick={toggleTheme}
      className="p-2 border border-border hover:border-accent transition"
      title={theme === "light" ? t("common.theme.dark") : t("common.theme.light")}
    >
      {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
  const LangBtn = (
    <button
      onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      className="p-2 border border-border hover:border-accent transition flex items-center gap-1 text-xs font-bold"
      title={t("common.language")}
    >
      <Globe size={14} />
      {language.toUpperCase()}
    </button>
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ─── Mobile topbar (< lg) — sem botão de colapsar ─────────────────── */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4">
          {LogoFull}
          <div className="flex gap-2 items-center">
            {ThemeBtn}
            {LangBtn}
            <button
              className="p-2 border border-border hover:border-accent transition"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="bg-background border-t border-border">
            <div className="container py-4 flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-bold hover:text-accent transition flex items-center gap-3 ${
                    isActive(l.href) ? "text-accent" : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <l.icon size={16} />
                  {l.label}
                </Link>
              ))}
              {externalLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold hover:text-accent transition flex items-center gap-3"
                >
                  <l.icon size={16} />
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ─── Desktop sidebar (lg+) ─ com toggle colapsa/expande ───────────── */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 bottom-0 z-50 bg-background border-r border-border flex-col transition-[width] duration-200 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Header com logo + botão de toggle */}
        <div
          className={`border-b border-border flex items-center ${
            collapsed ? "px-2 py-4 flex-col gap-3" : "px-4 py-4 justify-between gap-2"
          }`}
        >
          {collapsed ? LogoMini : LogoFull}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-2 border border-border hover:border-accent transition shrink-0"
              title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            </button>
          )}
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-6">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  title={collapsed ? l.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-bold tracking-wider border-l-2 transition ${
                    isActive(l.href)
                      ? "border-accent text-accent bg-accent/5"
                      : "border-transparent hover:border-accent hover:text-accent"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <l.icon size={16} className="shrink-0" />
                  {!collapsed && <span>{l.label}</span>}
                </Link>
              </li>
            ))}
            <li className="mt-4 pt-4 border-t border-border">
              {externalLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={collapsed ? l.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-bold tracking-wider border-l-2 border-transparent hover:border-accent hover:text-accent transition ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <l.icon size={16} className="shrink-0" />
                  {!collapsed && <span>{l.label} ↗</span>}
                </a>
              ))}
            </li>
          </ul>
        </nav>

        {/* Controls */}
        <div
          className={`border-t border-border ${
            collapsed ? "px-2 py-3 flex flex-col gap-2 items-center" : "px-4 py-4 flex items-center gap-2"
          }`}
        >
          {ThemeBtn}
          {LangBtn}
        </div>
      </aside>
    </>
  );
}
