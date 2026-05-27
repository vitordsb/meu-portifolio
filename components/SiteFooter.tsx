"use client";

import Link from "next/link";
import { Linkedin, Github, MessageCircle, AtSign, FileText, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const contacts = [
  { href: "https://www.linkedin.com/in/vitordsb", label: "LinkedIn", icon: Linkedin, external: true },
  { href: "https://github.com/vitordsb", label: "GitHub", icon: Github, external: true },
  { href: "https://wa.me/5511939572807", label: "WhatsApp", icon: MessageCircle, external: true },
  { href: "mailto:vitordsb2019@gmail.com", label: "Email", icon: AtSign, external: true },
  { href: "/cv", label: "Currículo", icon: FileText, external: false },
];

export default function SiteFooter() {
  const { language } = useLanguage();
  const tagline =
    language === "pt"
      ? "UX Engineer — design de experiência + engenharia. Aberto a oportunidades remotas ou híbridas."
      : "UX Engineer — experience design + engineering. Open to remote or hybrid opportunities.";
  const cta = language === "pt" ? "Vamos conversar" : "Let's talk";

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-md">
            <Link
              href="/"
              className="font-mono font-extrabold text-2xl tracking-tight inline-block mb-3"
            >
              <span className="text-accent">&lt;</span>vitordsb<span className="text-accent">/&gt;</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{tagline}</p>
          </div>

          <Link
            href="/contact"
            className="btn-brutalist-accent px-6 py-3 text-sm inline-flex items-center gap-2 self-start md:self-auto"
          >
            {cta}
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Contatos em linha — pills */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center gap-3">
          {contacts.map((c) => {
            const Inner = (
              <>
                <c.icon size={15} className="shrink-0" />
                <span>{c.label}</span>
                {c.external && <ArrowUpRight size={13} className="opacity-50" />}
              </>
            );
            const cls =
              "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground/75 hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all";
            return c.external ? (
              <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {Inner}
              </a>
            ) : (
              <Link key={c.href} href={c.href} className={cls}>
                {Inner}
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-muted-foreground/60 font-mono">
          © {new Date().getFullYear()} Vitor de Souza Barreto
        </p>
      </div>
    </footer>
  );
}
