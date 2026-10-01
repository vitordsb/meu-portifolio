"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import CommandPalette from "@/components/CommandPalette";

interface CommandPaletteCtx {
  open: () => void;
  /** No Mac a dica mostra ⌘K: ctrl + espaço é do sistema (ver isShortcut). */
  isMac: boolean;
}

const Ctx = createContext<CommandPaletteCtx | undefined>(undefined);

/**
 * ctrl + espaço é o atalho pedido, e funciona no Windows e no Linux. No macOS
 * ele vem ligado de fábrica como "Selecionar a fonte de entrada anterior": o
 * sistema engole a tecla e o navegador nunca recebe. Por isso ⌘K / ctrl+K
 * abrem também, e no Mac a dica mostra ⌘K.
 */
function isShortcut(e: KeyboardEvent) {
  if (e.ctrlKey && (e.code === "Space" || e.key === " ")) return true;
  return (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
}

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(
      /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent),
    );
  }, []);

  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isShortcut(e)) return;
      e.preventDefault();
      setIsOpen((current) => !current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Ctx.Provider value={{ open, isMac }}>
      {children}
      <CommandPalette open={isOpen} onOpenChange={setIsOpen} isMac={isMac} />
    </Ctx.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useCommandPalette must be used within CommandPaletteProvider",
    );
  return ctx;
}
