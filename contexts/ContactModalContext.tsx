"use client";

import { createContext, useContext, useState, useCallback } from "react";
import ContactModal from "@/components/ContactModal";

interface ContactModalCtx {
  /** Abre o modal. Com `subject`, o assunto já vem preenchido (CTAs da home). */
  open: (subject?: string) => void;
  close: () => void;
}

const Ctx = createContext<ContactModalCtx | undefined>(undefined);

export function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState<string | null>(null);

  // `open` costuma ir direto pro onClick, e aí o argumento é o evento do React.
  // Só string vira assunto.
  const open = useCallback((s?: unknown) => {
    setSubject(typeof s === "string" ? s : null);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={close} subject={subject} />
    </Ctx.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}
