"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navbar() {
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

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/autonomo", label: t("nav.autonomo") },
    { href: "/skills", label: t("nav.skills") },
    { href: "/certificates", label: t("nav.certificates") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const externalLinks = [
    { href: "https://github.com/vitordsb", label: t("nav.github") },
  ];

  const Logo = (
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

  const Controls = (
    <div className="flex gap-2 items-center">
      <button
        onClick={toggleTheme}
        className="p-2 border border-border hover:border-accent transition"
        title={theme === "light" ? t("common.theme.dark") : t("common.theme.light")}
      >
        {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
      </button>
      <button
        onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
        className="p-2 border border-border hover:border-accent transition flex items-center gap-1 text-xs font-bold"
        title={t("common.language")}
      >
        <Globe size={14} />
        {language.toUpperCase()}
      </button>
    </div>
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ─── Mobile topbar (< lg) ─────────────────────────────────────────── */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4">
          {Logo}
          <div className="flex gap-2 items-center">
            {Controls}
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
                  className={`text-sm font-bold hover:text-accent transition ${
                    isActive(l.href) ? "text-accent" : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              {externalLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold hover:text-accent transition flex items-center gap-2"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ─── Desktop sidebar (lg+) ────────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 z-50 w-60 bg-background border-r border-border flex-col">
        <div className="px-6 py-6 border-b border-border">{Logo}</div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block px-3 py-2 text-xs font-bold tracking-wider border-l-2 transition ${
                    isActive(l.href)
                      ? "border-accent text-accent bg-accent/5"
                      : "border-transparent hover:border-accent hover:text-accent"
                  }`}
                >
                  {l.label}
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
                  className="block px-3 py-2 text-xs font-bold tracking-wider border-l-2 border-transparent hover:border-accent hover:text-accent transition"
                >
                  {l.label} ↗
                </a>
              ))}
            </li>
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-border flex items-center gap-2">
          {Controls}
        </div>
      </aside>
    </>
  );
}
