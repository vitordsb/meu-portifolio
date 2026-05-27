"use client";

import { Github, Linkedin, MessageCircle, AtSign, Clock, Globe, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactSection() {
  const { t, language } = useLanguage();

  const info = [
    {
      icon: Clock,
      labelPt: "Resposta esperada",
      labelEn: "Expected response",
      valuePt: "até 24h em dias úteis",
      valueEn: "within 24h on business days",
    },
    {
      icon: Globe,
      labelPt: "Fuso",
      labelEn: "Timezone",
      valuePt: "GMT-3 · São Paulo, Brasil",
      valueEn: "GMT-3 · São Paulo, Brazil",
    },
    {
      icon: Languages,
      labelPt: "Idiomas",
      labelEn: "Languages",
      valuePt: "Português (nativo) · Inglês (profissional)",
      valueEn: "Portuguese (native) · English (working)",
    },
  ];

  return (
    <section id="contact" className="py-16 bg-foreground text-background">
      <div className="container text-center">
        <h2 className="section-header text-background">{t("contact.title")}</h2>
        <div className="w-12 h-1 rounded-full bg-accent mx-auto mb-6" />
        <p className="text-sm mb-10 max-w-xl mx-auto text-background/80">
          {t("contact.description")}
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center flex-wrap mb-12">
          <a
            href="https://www.linkedin.com/in/vitordsb"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutalist-accent px-6 py-3 text-sm flex items-center gap-2"
          >
            <Linkedin size={16} />
            LINKEDIN
          </a>
          <a
            href="https://wa.me/5511939572807"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent text-background font-extrabold text-sm border-4 border-background hover:bg-background hover:text-foreground transition-all duration-200 px-6 py-3 flex items-center gap-2"
          >
            <MessageCircle size={16} />
            WHATSAPP
          </a>
          <a
            href="mailto:vitordsb2019@gmail.com"
            className="bg-transparent text-background font-extrabold text-sm border-4 border-background hover:bg-background hover:text-foreground transition-all duration-200 px-6 py-3 flex items-center gap-2"
          >
            <AtSign size={16} />
            EMAIL
          </a>
          <a
            href="https://github.com/vitordsb"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent text-background font-extrabold text-sm border-4 border-background hover:bg-background hover:text-foreground transition-all duration-200 px-6 py-3 flex items-center gap-2"
          >
            <Github size={16} />
            GITHUB
          </a>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          {info.map((item) => (
            <div
              key={item.labelEn}
              className="border-2 border-background/30 px-5 py-4 hover:border-accent transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <item.icon size={14} className="text-accent shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-background/60">
                  {language === "pt" ? item.labelPt : item.labelEn}
                </p>
              </div>
              <p className="text-sm font-bold text-background">
                {language === "pt" ? item.valuePt : item.valueEn}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-xs text-background/30 font-mono">
          © {new Date().getFullYear()} VITOR DE SOUZA BARRETO
        </p>
      </div>
    </section>
  );
}
