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
  FileText,
  Mail,
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
    { href: "/cv", label: "CV", icon: FileText },
    { href: "/contact", label: t("nav.contact"), icon: Mail },
  ];

  const LogoFull = (
    <Link
      href="/"
      onClick={handleLogoClick}
      className="font-mono font-extrabold tracking-tighter hover:text-accent transition select-none text-xl whitespace-nowrap"
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
      className="font-mono font-extrabold tracking-tighter hover:text-accent transition select-none text-xl flex justify-center"
      title="vitordsb"
    >
      <span className="text-accent">&lt;/&gt;</span>
    </Link>
  );

  // Botões de controle padronizados — mesmo tamanho (h-9 w-9), só ícone.
  const iconBtn =
    "h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border hover:border-accent hover:text-accent transition shrink-0";
  const ThemeBtn = (
    <button
      onClick={toggleTheme}
      className={iconBtn}
      title={theme === "light" ? t("common.theme.dark") : t("common.theme.light")}
      aria-label={theme === "light" ? t("common.theme.dark") : t("common.theme.light")}
    >
      {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
  const LangBtn = (
    <button
      onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      className={iconBtn}
      title={`${t("common.language")} (${language.toUpperCase()})`}
      aria-label={`${t("common.language")} (${language.toUpperCase()})`}
    >
      <Globe size={15} />
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
              className={iconBtn}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
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
        {/* Header — só o logo, sem poluição */}
        <div
          className={`border-b border-border flex items-center ${
            collapsed ? "px-2 py-4 justify-center" : "px-4 py-4"
          }`}
        >
          {collapsed ? LogoMini : LogoFull}
        </div>

        {/* Links — gap generoso entre eles */}
        <nav className="flex-1 overflow-y-auto px-2 py-6">
          <ul className="flex flex-col gap-2.5">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  title={collapsed ? l.label : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold tracking-wider transition ${
                    isActive(l.href)
                      ? "bg-accent/10 text-accent"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-accent"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <l.icon size={17} className="shrink-0" />
                  {!collapsed && <span>{l.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer — theme + lang + colapsar, todos alinhados na mesma linha */}
        <div
          className={`border-t border-border flex gap-2 ${
            collapsed ? "px-2 py-3 flex-col items-center" : "px-4 py-4 items-center"
          }`}
        >
          {ThemeBtn}
          {LangBtn}
          {onToggle && (
            <button
              onClick={onToggle}
              className={iconBtn}
              title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
