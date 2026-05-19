"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactSection() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="py-16 bg-foreground text-background">
      <div className="container text-center">
        <h2 className="section-header text-background">{t("contact.title")}</h2>
        <div className="w-12 h-1 bg-accent mx-auto mb-6" />
        <p className="text-sm mb-10 max-w-xl mx-auto text-background/80">
          {t("contact.description")}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://linkedin.com/in/vitordsb" target="_blank" rel="noopener noreferrer"
            className="btn-brutalist-accent px-6 py-3 text-sm flex items-center gap-2">
            <Linkedin size={16} />{t("contact.linkedin")}
          </a>
          <a href="https://github.com/vitordsb" target="_blank" rel="noopener noreferrer"
            className="bg-transparent text-background font-black text-sm border-4 border-background hover:bg-background hover:text-foreground transition-all duration-200 px-6 py-3 flex items-center gap-2">
            <Github size={16} />{t("contact.github")}
          </a>
          <a href="mailto:vitor@example.com"
            className="bg-transparent text-background font-black text-sm border-4 border-background hover:bg-background hover:text-foreground transition-all duration-200 px-6 py-3 flex items-center gap-2">
            <Mail size={16} />{t("contact.email")}
          </a>
        </div>
        <p className="mt-16 text-xs text-background/30 font-mono">
          © {new Date().getFullYear()} VITOR DE SOUZA BARRETO
        </p>
      </div>
    </section>
  );
}
