"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ContactModalProvider } from "@/contexts/ContactModalContext";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ContactModalProvider>
          {children}
          <Toaster position="bottom-right" />
        </ContactModalProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
