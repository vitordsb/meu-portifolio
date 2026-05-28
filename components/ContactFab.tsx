"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircleMore } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactModal } from "@/contexts/ContactModalContext";

/**
 * Botão flutuante de contato no canto inferior direito.
 * Aparece em todas as telas EXCETO a home (que já tem contato forte no hero).
 */
export default function ContactFab() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { open } = useContactModal();
  const reduce = useReducedMotion();

  // Home tem o contato no hero — não duplica aqui.
  if (pathname === "/") return null;

  const label = language === "pt" ? "Vamos conversar" : "Let's talk";

  return (
    <motion.button
      onClick={open}
      aria-label={label}
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -2 }}
      className="group fixed bottom-5 right-5 z-[80] inline-flex items-center gap-2.5 rounded-full bg-accent text-background pl-4 pr-5 py-3.5 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-shadow"
    >
      <MessageCircleMore size={20} className="shrink-0" />
      <span className="text-sm font-bold whitespace-nowrap">{label}</span>
    </motion.button>
  );
}
