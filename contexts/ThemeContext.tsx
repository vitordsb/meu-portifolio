"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Escolha do usuário. "system" acompanha o sistema operacional em tempo real.
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  /** O que o usuário escolheu (pode ser "system"). */
  theme: Theme;
  /** O que está de fato pintado na tela. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  /** Claro, escuro, automático, e volta pro claro. */
  cycleTheme: () => void;
}

const STORAGE_KEY = "theme";
const ORDER: Theme[] = ["light", "dark", "system"];
const QUERY = "(prefers-color-scheme: dark)";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function prefersDark(): boolean {
  return window.matchMedia(QUERY).matches;
}

function resolve(choice: Theme): ResolvedTheme {
  if (choice === "system") return prefersDark() ? "dark" : "light";
  return choice;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // A escolha atual também vive num ref: os listeners abaixo são registrados uma
  // única vez e precisam ler o valor de agora, não o do render em que nasceram.
  const choiceRef = useRef<Theme>("system");

  const apply = useCallback((choice: Theme) => {
    const next = resolve(choice);
    const root = document.documentElement;
    root.setAttribute("data-theme", next);
    // Faz scrollbar, inputs nativos e autofill seguirem o tema escolhido.
    root.style.colorScheme = next;
    setResolvedTheme(next);
  }, []);

  // Lê a preferência salva. Sem nada salvo, o padrão é acompanhar o sistema.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Modo privado / storage bloqueado: cai no padrão "system".
    }
    const initial: Theme = ORDER.includes(stored as Theme) ? (stored as Theme) : "system";
    choiceRef.current = initial;
    setThemeState(initial);
    apply(initial);
  }, [apply]);

  // Acompanha o sistema no modo automático. O listener é registrado uma vez só e
  // filtra pelo ref: registrar/remover a cada troca de `theme` abria janelas em
  // que o site ficava surdo pra mudança do SO.
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => {
      if (choiceRef.current === "system") apply("system");
    };

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", sync);
    } else {
      // Safari < 14 e WebViews antigas.
      mq.addListener(sync);
    }

    // Rede de segurança: o SO pode alternar claro/escuro (agendamento do macOS,
    // por exemplo) com a aba em segundo plano, e nem todo navegador entrega o
    // "change" nesse caso. Ao voltar pra aba, reconferimos.
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", sync);

    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", sync);
      } else {
        mq.removeListener(sync);
      }
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", sync);
    };
  }, [apply]);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Sem storage a escolha vale só pra sessão atual.
      }
      choiceRef.current = next;
      setThemeState(next);
      apply(next);
    },
    [apply],
  );

  const cycleTheme = useCallback(() => {
    setTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]);
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, cycleTheme }),
    [theme, resolvedTheme, setTheme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
