"use client";

import { createContext, useContext, useState, useCallback } from "react";
import ContactModal from "@/components/ContactModal";

interface ContactModalCtx {
  open: () => void;
  close: () => void;
}

const Ctx = createContext<ContactModalCtx | undefined>(undefined);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={close} />
    </Ctx.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}
