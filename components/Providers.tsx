"use client";

import { useEffect } from "react";
import { markBooted } from "@/components/motion/boot";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ContactModalProvider } from "@/contexts/ContactModalContext";
import { CommandPaletteProvider } from "@/contexts/CommandPaletteContext";
import { Toaster } from "sonner";
import ClickTracker from "@/components/analytics/ClickTracker";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Depois daqui, entrada animada só em navegação dentro do site (motion/boot)
  useEffect(() => markBooted(), []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ContactModalProvider>
          <CommandPaletteProvider>
            {children}
            <Toaster position="bottom-right" />
            <ClickTracker />
          </CommandPaletteProvider>
        </ContactModalProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
