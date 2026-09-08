"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircleMore } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactModal } from "@/contexts/ContactModalContext";

/**
 * Extended FAB (M3) no canto inferior direito.
 * Aparece em todas as telas exceto a home, que já tem contato forte no hero.
 */
export default function ContactFab() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { open } = useContactModal();
  const reduce = useReducedMotion();

  // Home tem o contato no hero, então não duplica aqui.
  if (pathname === "/") return null;

  const label = language === "pt" ? "Vamos conversar" : "Let's talk";

  return (
    <motion.button
      onClick={open}
      aria-label={label}
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3, ease: [0.2, 0, 0, 1] }}
      className="fab fab-extended fixed bottom-6 right-6 z-[80]"
    >
      <MessageCircleMore size={24} className="shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </motion.button>
  );
}
